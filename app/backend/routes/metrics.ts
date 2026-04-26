import express from "express";
import { upsertItem, queryItems } from "../services/cosmosService";

const router = express.Router();

/**
 * POST /api/metrics
 * One document per user per day (UPSERT)
 */
router.post("/", async (req, res) => {
  try {
    const body = req.body;

    if (!body.user_id || !body.date) {
      return res.status(400).json({ error: "Missing required fields" });
    }
    
    const id = `${body.user_id}_${body.date}`
    const document = {
      id,
      user_id: body.user_id,
      date: body.date,

      sleep: body.sleep || {},
      exercise: body.exercise || {},
      wellness: body.wellness || {},
      nutrition: body.nutrition || {}
    };

    const result = await upsertItem("Metrics", document);

    res.json(result);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * GET /api/metrics
 * Query by user + optional date range
 */
router.get("/", async (req, res) => {
  
      try {
      const { user_id, start_date, end_date } = req.query;
      let query = "SELECT * FROM c WHERE c.user_id = @user_id";
      const params: any[] = [
      { name: "@user_id", value: user_id }
    ];

    if (start_date && end_date) {
      query += " AND c.date >= @start_date AND c.date <= @end_date";
      params.push(
        { name: "@start_date", value: start_date },
        { name: "@end_date", value: end_date }
      );
    }

    const results = await queryItems("Metrics", { 
      query, 
      parameters: params 
    });

    res.json(results);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
    }
});
export default router;