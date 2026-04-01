import { Router } from "express";
import type { Sleep } from "../models/Sleep";
import crypto from "crypto";

const router = Router();
const sleepData: Sleep[] = [];

// POST /api/sleep
router.post("/", (req, res) => {
  const newSleep: Sleep = {
    sleep_id: crypto.randomUUID(),
    ...req.body,
  };

  sleepData.push(newSleep);
  res.status(201).json(newSleep);
});

// GET /api/sleep?start_date=&end_date=
router.get("/", (req, res) => {
  const { start_date, end_date } = req.query;

  let filtered = sleepData;

  if (start_date && end_date) {
    filtered = sleepData.filter(s =>
      s.date >= start_date && s.date <= end_date
    );
  }

  res.json(filtered);
});

export default router;