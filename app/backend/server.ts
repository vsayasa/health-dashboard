import express from "express";
import usersRouter from "./routes/users";
import metricsRouter from "./routes/metrics";
import goalsRouter from "./routes/goals";

const app = express();
app.use(express.json());

app.use("/api/users", usersRouter);
app.use("/api/metrics", metricsRouter);
app.use("/api/goals", goalsRouter);

app.get("/", (req, res) => {
  res.send("VitaMetrics API is running 🚀");
});

app.listen(3001, () => console.log("API running on http://localhost:3001"));