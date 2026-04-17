import express from "express";
import sleepRouter from "./routes/sleep";
import exerciseRouter from "./routes/exercise";
import nutritionRouter from "./routes/nutrition";
import wellnessRouter from "./routes/wellness";
import goalsRouter from "./routes/goals";
const app = express();
app.use(express.json());

app.use("/api/sleep", sleepRouter);
app.use("/api/exercise", exerciseRouter);
app.use("/api/nutrition", nutritionRouter);
app.use("/api/wellness", wellnessRouter);
app.use("/api/goals", goalsRouter);

// Root test route
app.get("/", (req, res) => {
  res.send("API is running 🚀");
});

// GET function for the app:

app.listen(3001, () => console.log("API running on http://localhost:3001"));
