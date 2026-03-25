import { Router } from "express";
import type { Goal } from "../models/Goal";

const router = Router();

// in-memory storage for now
const goals: Goal[] = [];

// add a new goal
router.post("/", (req, res) => {
  const goal: Goal = { ...req.body };
  goals.push(goal);
  res.status(201).json(goal);
});

// fetch all goals for a user
router.get("/:user_id", (req, res) => {
  const user_goals = goals.filter(g => g.user_id === req.params.user_id);
  res.json(user_goals);
});

export default router;