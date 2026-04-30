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

    const id = `${body.user_id}_${body.date}`;

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
 * Query by user + optional date range OR last N days
 */
router.get("/", async (req, res) => {
  try {
    const { user_id, start_date, end_date, days } = req.query;

    if (!user_id) {
      return res.status(400).json({ error: "Missing user_id" });
    }

    let finalStartDate = start_date as string | undefined;
    let finalEndDate = end_date as string | undefined;

    // ✅ If no explicit date range, use "days"
    if (!finalStartDate || !finalEndDate) {
      if (days) {
        const numDays = parseInt(days as string);

        if (!isNaN(numDays)) {
          const end = new Date();
          const start = new Date();
          start.setDate(end.getDate() - (numDays - 1));

          // format YYYY-MM-DD (important for Cosmos string compare)
          finalStartDate = start.toISOString().split("T")[0];
          finalEndDate = end.toISOString().split("T")[0];
        }
      }
    }

    let query = "SELECT * FROM c WHERE c.user_id = @user_id";

    const params: any[] = [
      { name: "@user_id", value: user_id }
    ];

    if (finalStartDate && finalEndDate) {
      query += " AND c.date >= @start_date AND c.date <= @end_date";

      params.push(
        { name: "@start_date", value: finalStartDate },
        { name: "@end_date", value: finalEndDate }
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