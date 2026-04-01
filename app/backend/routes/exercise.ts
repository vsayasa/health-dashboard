import express from "express";
const router = express.Router();

// GET /api/exercise
router.get("/", (req, res) => {
  res.json({ message: "Get exercise data" });
});

// POST /api/exercise
router.post("/", (req, res) => {
  const { user_id, date, exercise_hours, exercise_type, calories_burned } = req.body;

  if (!user_id || !date || !exercise_hours) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  const newExercise = {
    user_id,
    date,
    exercise_hours,
    exercise_type: exercise_type || "unspecified",
    calories_burned: calories_burned || null
  };

  res.status(201).json({
    message: "Exercise data saved",
    data: newExercise
  });
});

export default router;