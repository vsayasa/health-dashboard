import dotenv from "dotenv";
dotenv.config();

import express from "express";
import multer from "multer";
import {
  BlobServiceClient,
  StorageSharedKeyCredential,
  generateBlobSASQueryParameters,
  BlobSASPermissions,
} from "@azure/storage-blob";
import { upsertItem, queryItems, deleteItem } from "../services/cosmosService";

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

const connectionString = process.env.BLOB_STORAGE_CONNECTION_STRING!;
const mealsContainerName = "meal-images";
const reportsContainerName = "report-docs";

const blobServiceClient = BlobServiceClient.fromConnectionString(connectionString);

const getContainerClient = (fileType: string) => {
  if (fileType === "meal") {
    return blobServiceClient.getContainerClient(mealsContainerName);
  }

  if (fileType === "report") {
    return blobServiceClient.getContainerClient(reportsContainerName);
  }

  throw new Error("Invalid file_type. Must be 'meal' or 'report'.");
};

const getSharedKeyCredential = () => {
  const accountName = process.env.AZURE_STORAGE_ACCOUNT_NAME!;
  const accountKey = process.env.AZURE_STORAGE_ACCOUNT_KEY!;

  return new StorageSharedKeyCredential(accountName, accountKey);
};

const generateSasUrl = (containerName: string, blobName: string) => {
  const accountName = process.env.AZURE_STORAGE_ACCOUNT_NAME!;
  const sharedKeyCredential = getSharedKeyCredential();

  const sasToken = generateBlobSASQueryParameters(
    {
      containerName,
      blobName,
      permissions: BlobSASPermissions.parse("r"),
      startsOn: new Date(Date.now() - 5 * 60 * 1000),
      expiresOn: new Date(Date.now() + 60 * 60 * 1000),
    },
    sharedKeyCredential
  ).toString();

  return `https://${accountName}.blob.core.windows.net/${containerName}/${blobName}?${sasToken}`;
};

/**
 * POST /api/files/upload
 */
router.post("/upload", upload.single("file"), async (req, res) => {
  console.log("UPLOAD ROUTE HIT");
  console.log("body:", req.body);
  console.log("file:", req.file?.originalname);
  console.log("blob env exists:", {
    hasConnectionString: !!process.env.BLOB_STORAGE_CONNECTION_STRING,
    hasAccountName: !!process.env.AZURE_STORAGE_ACCOUNT_NAME,
    hasAccountKey: !!process.env.AZURE_STORAGE_ACCOUNT_KEY,
    mealsContainer: process.env.BLOB_STORAGE_CONTAINER_MEALS,
    reportsContainer: process.env.BLOB_STORAGE_CONTAINER_REPORTS,
  });

  try {
    const { user_id, date, file_type } = req.body || {};

    if (!req.file || !user_id || !date || !file_type) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const containerClient = getContainerClient(file_type);
    await containerClient.createIfNotExists();

    const safeName = req.file.originalname.replace(/\s+/g, "_");
    const blobName = `${user_id}/${Date.now()}_${safeName}`;

    const blockBlobClient = containerClient.getBlockBlobClient(blobName);

    await blockBlobClient.uploadData(req.file.buffer, {
      blobHTTPHeaders: {
        blobContentType: req.file.mimetype,
      },
    });

    const containerName =
      file_type === "meal" ? mealsContainerName : reportsContainerName;

    const fileDoc = {
      id: `${user_id}_${Date.now()}`,
      user_id,
      date,
      file_type,
      file_name: req.file.originalname,
      content_type: req.file.mimetype,
      container_name: containerName,
      blob_name: blobName,
      created_at: new Date().toISOString(),
    };

    const result = await upsertItem("Files", fileDoc);

    res.json({
      ...result,
      file_url: generateSasUrl(containerName, blobName),
    });
  } catch (err: any) {
    console.error("File upload error:", err);
    res.status(500).json({ error: err.message });
  }
});

/**
 * GET /api/files?user_id=...
 */
router.get("/", async (req, res) => {
  try {
    const { user_id } = req.query;

    if (!user_id) {
      return res.status(400).json({ error: "Missing user_id" });
    }

    const query = {
      query:
        "SELECT * FROM c WHERE c.user_id = @user_id ORDER BY c.created_at DESC",
      parameters: [{ name: "@user_id", value: user_id }],
    };

    const results = await queryItems("Files", query);

    const filesWithSasUrls = results.map((file: any) => ({
      ...file,
      file_url: generateSasUrl(file.container_name, file.blob_name),
    }));

    res.json(filesWithSasUrls);
  } catch (err: any) {
    console.error("File fetch error:", err);
    res.status(500).json({ error: err.message });
  }
});

/**
 * DELETE /api/files/:id
 * Delete file from Blob Storage + delete metadata from Cosmos DB
 */
router.delete("/:id", async (req, res) => {
  try {
    console.log("DELETE ROUTE HIT");
    console.log("params:", req.params);
    console.log("body:", req.body);

    const { id } = req.params;
    const { user_id, container_name, blob_name } = req.body || {};

    if (!id || !user_id || !container_name || !blob_name) {
      return res.status(400).json({
        error: "Missing required fields",
        received: { id, user_id, container_name, blob_name },
      });
    }

    const containerClient = blobServiceClient.getContainerClient(container_name);
    const blockBlobClient = containerClient.getBlockBlobClient(blob_name);

    await blockBlobClient.deleteIfExists();

    // Most likely partition key is /user_id
    await deleteItem("Files", id, user_id);

    res.json({ message: "File deleted successfully" });
  } catch (err: any) {
    console.error("File delete error:", err);
    res.status(500).json({ error: err.message });
  }
});

export default router;