import express from "express";
import { upsertItem, queryItems } from "../services/cosmosService";
import type { Metrics } from "../types/metrics";

const router = express.Router();

/**
 * POST /api/metrics
 * Create or update a daily health log
 */
router.post("/", async (req, res) => {
  try {
    const data = req.body;

    const item: Metrics = {
      id: `${data.user_id}_${data.date}`, // enforce 1 per day
      user_id: data.user_id,
      date: data.date,

      sleep: data.sleep || {},
      exercise: data.exercise || {},
      nutrition: data.nutrition || {},
      wellness: data.wellness || {},
    };

    const result = await upsertItem("Metrics", item);

    res.json(result);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * GET /api/metrics
 * Query by user + date range
 */
router.get("/", async (req, res) => {
  try {
    const { user_id, start_date, end_date } = req.query;

    let query: any = {
      query: "SELECT * FROM c WHERE c.user_id = @user_id",
      parameters: [{ name: "@user_id", value: user_id }],
    };

    if (start_date && end_date) {
      query.query += " AND c.date >= @start AND c.date <= @end";
      query.parameters.push(
        { name: "@start", value: start_date },
        { name: "@end", value: end_date }
      );
    }

    const results = await queryItems("Metrics", query);

    res.json(results);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

export default router;