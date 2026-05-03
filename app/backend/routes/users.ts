import express from "express";
import { upsertItem, queryItems } from "../services/cosmosService";

const router = express.Router();

/**
 * POST /api/users
 * Create a new user
 */
router.post("/", async (req, res) => {
  try {
    const { id, email, created_at, startDate, endDate } = req.body;

    const user = {
      id, // partition key
      email,
      created_at,
      startDate,
      endDate

    };

    const result = await upsertItem("Users", user);

    res.json(result);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});
router.get("/", async (req, res) => {
  try {
    let query;
    if (Object.keys(req.query).length > 0) {
      query = {
        query: "SELECT * FROM c WHERE c.id = @id",
        parameters: [{ name: "@id", value: req.query.user_id }]
      };
    } else {
      query = {
        query: "SELECT * FROM c"
      };
    }
    const results = await queryItems("Users", query);
    res.json(results);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

export default router;