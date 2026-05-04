const { CosmosClient } = require("@azure/cosmos");
const { BlobServiceClient, StorageSharedKeyCredential,
  generateBlobSASQueryParameters,
  BlobSASPermissions } = require("@azure/storage-blob");
const cosmosConnection = process.env.CosmosDBConnection;
if (!cosmosConnection) {
  console.error("ERROR: CosmosDBConnection environment variable is not set!");
}

const storageConnection = process.env.StorageConnection;


const blobServiceClient = BlobServiceClient.fromConnectionString(storageConnection);
const imagesContainer = blobServiceClient.getContainerClient("meal-images");
const reportsContainer = blobServiceClient.getContainerClient("report-docs");
const client = new CosmosClient(cosmosConnection);

const database = client.database("VitaMetricsDB");
const usersContainer = database.container("Users");
const goalsContainer = database.container("Goals");
const metricsContainer = database.container("Metrics");

const getContainer = (name) => {
  return database.container(name);
};

const upsertItem = async (containerName, item) => {
  const container = getContainer(containerName);
  const { resource } = await container.items.upsert(item);
  return resource;
};

const queryItems = async (containerName, querySpec) => {
  const container = getContainer(containerName);
  const { resources } = await container.items.query(querySpec).fetchAll();
  return resources;
};

const deleteItem = async (containerName, id, partitionKey) => {
  const container = getContainer(containerName);
  await container.item(id, partitionKey).delete();
};
const testVar = "db.js is accessed";
module.exports = {
  testVar,
  blobServiceClient,
  imagesContainer,
  reportsContainer,
  client,
  usersContainer,
  goalsContainer,
  metricsContainer,
  getContainer,
  upsertItem,
  queryItems,
  deleteItem
}