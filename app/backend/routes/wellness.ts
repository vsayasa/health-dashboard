import express from "express";
const router = express.Router();

// GET /api/wellness
router.get("/", (req, res) => {
  res.json({ message: "Get wellness data" });
});

// POST /api/wellness
router.post("/", (req, res) => {
  const { user_id, date, mood, stress_level } = req.body;

  if (!user_id || !date || !mood) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  const newWellness = {
    user_id,
    date,
    mood,
    stress_level: stress_level || null
  };

  res.status(201).json({
    message: "Wellness data saved",
    data: newWellness
  });
});

export default router;