import express from "express";
import { upsertItem, queryItems } from "../services/cosmosService";

const router = express.Router();

/**
 * POST /api/users
 * Create a new user
 */
router.post("/", async (req, res) => {
  try {
    const { id, username, email } = req.body;

    const user = {
      id, // partition key
      username,
      email,
      created_at: new Date().toISOString()
    };

    const result = await upsertItem("Users", user);

    res.json(result);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/", async (req, res) => {
  try {
    const query = {
      query: "SELECT * FROM c"
    };

    const results = await queryItems("Users", query);

    res.json(results);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * GET /api/users/:id
 * Get user by ID
 */
router.get("/:id", async (req, res) => {
  try {
    const id = req.params.id;

    const query = {
      query: "SELECT * FROM c WHERE c.id = @id",
      parameters: [{ name: "@id", value: id }]
    };

    const results = await queryItems("Users", query);

    res.json(results[0] || null);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

export default router;