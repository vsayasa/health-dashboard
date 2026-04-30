import express from "express";
import { upsertItem, queryItems } from "../services/cosmosService";

const router = express.Router();

/**
 * POST /api/goals
 * Create or update a goal
 */
router.post("/", async (req, res) => {
  try {
    const data = req.body;

    if (
      !data.user_id ||
      !data.metric_type ||
      data.goal_value == null ||
      !data.start_date
    ) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const goalValue = Number(data.goal_value);

    if (Number.isNaN(goalValue) || goalValue < 0) {
      return res.status(400).json({ error: "Goal value must be a positive number" });
    }

    const goal = {
      id: data.id || `${data.user_id}_${data.metric_type}`,
      user_id: data.user_id,
      metric_type: data.metric_type, // "sleep", "exercise", or "nutrition"
      goal_value: goalValue,
      start_date: data.start_date,
      end_date: data.end_date || null,
      updated_at: new Date().toISOString()
    };

    const result = await upsertItem("Goals", goal);

    res.json(result);
  } catch (err: any) {
    console.error("Goal save error:", err);
    res.status(500).json({ error: err.message });
  }
});

/**
 * GET /api/goals?user_id=...
 * Retrieve all goals for a user
 */
router.get("/", async (req, res) => {
  try {
    const { user_id } = req.query;

    if (!user_id) {
      return res.status(400).json({ error: "Missing user_id" });
    }

    const query = {
      query: "SELECT * FROM c WHERE c.user_id = @user_id",
      parameters: [{ name: "@user_id", value: user_id }]
    };

    const results = await queryItems("Goals", query);

    res.json(results);
  } catch (err: any) {
    console.error("Goal fetch error:", err);
    res.status(500).json({ error: err.message });
  }
});

export default router;