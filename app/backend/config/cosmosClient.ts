import { CosmosClient } from "@azure/cosmos";
import dotenv from "dotenv";

dotenv.config();

const client = new CosmosClient({
  endpoint: process.env.COSMOS_ENDPOINT!,
  key: process.env.COSMOS_KEY!,
});

export const database = client.database(process.env.COSMOS_DATABASE!);