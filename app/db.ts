// DB connection stuff here
import { CosmosClient } from '@azure/cosmos';
import { BlobServiceClient } from '@azure/storage-blob';

const cosmosConnection = import.meta.env.CosmosDBConnection;
const client = new CosmosClient(cosmosConnection);
const database = client.database("metricsdb");
const usersContainer = database.container("Users"); // partition key is /Users
const metricsContainer = database.container("Metrics"); // partition key is /Metrics

const storageConnection = import.meta.env.StorageConnection;

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