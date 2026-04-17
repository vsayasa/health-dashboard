import express from "express";
import { upsertItem, queryItems } from "../services/cosmosService";

const router = express.Router();

/**
 * POST /api/files
 * Save file metadata
 */
router.post("/", async (req, res) => {
  try {
    const data = req.body;

    const file = {
      id: data.id || `${data.user_id}_${Date.now()}`,
      user_id: data.user_id,
      date: data.date,
      file_url: data.file_url,
      file_type: data.file_type // "meal" or "report"
    };

    const result = await upsertItem("Files", file);

    res.json(result);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * GET /api/files?user_id=...
 */
router.get("/", async (req, res) => {
  try {
    const { user_id } = req.query;

    const query = {
      query: "SELECT * FROM c WHERE c.user_id = @user_id",
      parameters: [{ name: "@user_id", value: user_id }]
    };

    const results = await queryItems("Files", query);

    res.json(results);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

export default router;