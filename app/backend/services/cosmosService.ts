import { database } from "../config/cosmosClient";

export const getContainer = (name: string) => {
  return database.container(name);
};

export const upsertItem = async (containerName: string, item: any) => {
  const container = getContainer(containerName);
  const { resource } = await container.items.upsert(item);
  return resource;
};

export const queryItems = async (containerName: string, querySpec: any) => {
  const container = getContainer(containerName);
  const { resources } = await container.items.query(querySpec).fetchAll();
  return resources;
};