import express from "express";
import sleepRouter from "./routes/sleep";
import exerciseRouter from "./routes/exercise";
import nutritionRouter from "./routes/nutrition";
import wellnessRouter from "./routes/wellness";
import goalsRouter from "./routes/goals";
import { CosmosClient } from '@azure/cosmos';
import { BlobServiceClient } from '@azure/storage-blob';
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

app.listen(3001, () => console.log("API running on http://localhost:3001"));


// DB connection stuff here
const cosmosConnection = import.meta.env.VITE_CosmosDBConnection;

const client = new CosmosClient(cosmosConnection);
const database = client.database("metricsdb");
const usersContainer = database.container("Users"); // partition key is /Users
const metricsContainer = database.container("Metrics"); // partition key is /Metrics

const storageConnection = import.meta.env.VITE_StorageConnection;

let blobServiceClient = null;
let imagesContainer = null;

if (storageConnection) {
  blobServiceClient = BlobServiceClient.fromConnectionString(storageConnection);
  
  // Make sure its made
  imagesContainer = blobServiceClient.getContainerClient("images");
}
else {
  console.log("ur storage acc isnt made correctly");
}
export { 
  client,
  database,
  usersContainer,
  metricsContainer
}