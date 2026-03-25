import { Router } from "express";
import type { Metric } from "../models/Metric";

const router = Router();

// in-memory storage for now
const metrics: Metric[] = [];

// add a new metric
router.post("/", (req, res) => {
  const metric: Metric = { ...req.body };
  metrics.push(metric);
  res.status(201).json(metric);
});

// fetch all metrics for a user
router.get("/:user_id", (req, res) => {
  const user_metrics = metrics.filter(m => m.user_id === req.params.user_id);
  res.json(user_metrics);
});

export default router;