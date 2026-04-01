import express from "express";
const router = express.Router();

// GET /api/goals
router.get("/", (req, res) => {
  res.json({ message: "Get goals" });
});

// POST /api/goals
router.post("/", (req, res) => {
  const { user_id, metric_type, goal_value, start_date, end_date } = req.body;

  if (!user_id || !metric_type || !goal_value) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  const newGoal = {
    user_id,
    metric_type,
    goal_value,
    start_date: start_date || new Date(),
    end_date: end_date || null
  };

  res.status(201).json({
    message: "Goal saved",
    data: newGoal
  });
});

export default router;