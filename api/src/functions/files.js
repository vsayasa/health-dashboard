const { app } = require('@azure/functions');
const multipart = require('parse-multipart-data');
const { upsertItem, queryItems, deleteItem, blobServiceClient } = require("../db");
const mealsContainerName = "meal-images";
const reportsContainerName = "report-docs";
const {
  BlobServiceClient,
  StorageSharedKeyCredential,
  generateBlobSASQueryParameters,
  BlobSASPermissions,
} =require("@azure/storage-blob");
const getContainerClient = (fileType) => {
  if (fileType === "meal") {
    return blobServiceClient.getContainerClient(mealsContainerName);
  }

  if (fileType === "report") {
    return blobServiceClient.getContainerClient(reportsContainerName);
  }

  throw new Error("Invalid file_type. Must be 'meal' or 'report'.");
};
const generateSasUrl = (containerName, blobName) => {
  const accountName = "vonnstorage";
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
const getSharedKeyCredential = () => {
  const accountName = "vonnstorage";
  const accountKey = process.env.AZURE_STORAGE_ACCOUNT_KEY;

  return new StorageSharedKeyCredential(accountName, accountKey);
};
app.http('files', {
    methods: ['GET', 'POST', 'DELETE'],
    authLevel: 'anonymous',
    handler: async (request, context) => {
        if (request.method === "GET") {
        try {
            const user_id = request.query.get('user_id');
        
        
            const query = {
              query:
                "SELECT * FROM c WHERE c.user_id = @user_id ORDER BY c.created_at DESC",
              parameters: [{ name: "@user_id", value: user_id }],
            };
        
            const results = await queryItems("Files", query);
            const filesWithSasUrls = results.map((file) => ({
      ...file,
      file_url: generateSasUrl(file.container_name, file.blob_name),
    }));
            return { 
                status: 200, 
                jsonBody: results 
                };

            } 
            catch (err) {
                return { 
                status: 500, 
                jsonBody: { error: err.message } 
                };
            
              }
        }

        if (request.method === "POST") {
            try {
            const bodyBuffer = Buffer.from(await request.arrayBuffer());
            const contentType = request.headers.get('content-type');
            const boundary = multipart.getBoundary(contentType);
            const parts = multipart.Parse(bodyBuffer, boundary);
            const user_id = parts.find(p => p.name === 'user_id')?.data.toString();
            const date = parts.find(p => p.name === 'date')?.data.toString();
            const file_type = parts.find(p => p.name === 'file_type')?.data.toString();
            const file = parts.find(p => p.filename);
            if (!file || !user_id || !date || !file_type) {
                return { status: 400, jsonBody: { error: "Missing required fields or file" } };
            }
            const containerClient = getContainerClient(file_type);
            await containerClient.createIfNotExists();;
            
                const safeName = file.filename.replace(/\s+/g, "_");
                const blobName = `${user_id}/${Date.now()}_${safeName}`;
            
                const blockBlobClient = containerClient.getBlockBlobClient(blobName);
            
                await blockBlobClient.uploadData(file.data, {
                  blobHTTPHeaders: {
                    blobContentType: file.type,
                  },
                });
            
                const containerName =
                  file_type === "meal" ? mealsContainerName : reportsContainerName;
            
                const fileDoc = {
                  id: `${user_id}_${Date.now()}`,
                  user_id,
                  date,
                  file_type,
                  file_name: file.filename,
                  content_type: file.type,
                  container_name: containerName,
                  blob_name: blobName,
                  created_at: new Date().toISOString(),
                };
            
                const results = await upsertItem("Files", fileDoc);

                return { 
                    status: 200, 
                    jsonBody: {
                        ...results,
                        file_url: generateSasUrl(containerName, blobName)
                    }
                };
              } 
              catch (err) {
                return { 
                status: 500, 
                jsonBody: { error: err.message } 
                };
            
              }
        }
        if (request.method === "DELETE") {
        try {        
            const id = request.query.get('id');
            const body = await request.json();
            const { user_id, container_name, blob_name } = body;
            
            const containerClient = blobServiceClient.getContainerClient(container_name);
            const blockBlobClient = containerClient.getBlockBlobClient(blob_name);
        
            await blockBlobClient.deleteIfExists();
        
            // Most likely partition key is /user_id
            await deleteItem("Files", id, user_id);
            return { 
                status: 200, 
                jsonBody: "Deleted!"
                };

            } 
            catch (err) {
                return { 
                status: 500, 
                jsonBody: { error: err.message } 
                };
            
              }
        }
        
    }
});
