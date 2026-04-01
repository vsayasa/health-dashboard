import express from "express";
const router = express.Router();

// GET /api/nutrition
router.get("/", (req, res) => {
  res.json({ message: "Get nutrition data" });
});

// POST /api/nutrition
router.post("/", (req, res) => {
  const { user_id, date, total_calories, protein, carbs, fat } = req.body;

  if (!user_id || !date || !total_calories) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  const newNutrition = {
    user_id,
    date,
    total_calories,
    protein: protein || null,
    carbs: carbs || null,
    fat: fat || null
  };

  res.status(201).json({
    message: "Nutrition data saved",
    data: newNutrition
  });
});

export default router;