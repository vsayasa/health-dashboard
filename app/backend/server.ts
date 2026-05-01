import express from "express";
import dotenv from "dotenv";
import metricsRoutes from "./routes/metrics";
import usersRoutes from "./routes/users";
import goalsRoutes from "./routes/goals";
import filesRoutes from "./routes/files";

dotenv.config();

console.log("SERVER FILE LOADED 🔥");

const app = express();

app.use(express.json());

app.use((req, res, next) => {
  console.log("➡️", req.method, req.url);
  next();
});

app.get("/", (req, res) => {
  res.send("API is running 🚀");
});

app.get("/api/files/test", (req, res) => {
  res.json({ message: "Files route is connected" });
});

app.use("/api/metrics", metricsRoutes);
app.use("/api/users", usersRoutes);
app.use("/api/goals", goalsRoutes);
app.use("/api/files", filesRoutes);

app.listen(3001, () => {
  console.log("API running on http://localhost:3001");
});