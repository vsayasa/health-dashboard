import express from "express";
import metricsRoutes from "./routes/metrics";
import usersRoutes from "./routes/users";
import goalsRoutes from "./routes/goals";
import filesRoutes from "./routes/files";

console.log("🔥 SERVER FILE LOADED: COSMOS VERSION");

const app = express();

app.use(express.json());

app.use((req, res, next) => {
  console.log("➡️", req.method, req.url);
  next();
});

// Root test
app.get("/", (req, res) => {
  res.send("CosmosDB is implemented. API is running 🚀");
});

// Routes
app.use("/api/metrics", metricsRoutes);
app.use("/api/users", usersRoutes);
app.use("/api/goals", goalsRoutes);
app.use("/api/files", filesRoutes);

app.listen(3001, () => {
  console.log("API running on http://localhost:3001");
});

