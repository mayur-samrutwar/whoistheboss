// db.js
import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DB;

if (!uri) {
  throw new Error("Please add your MongoDB URI to .env");
}

if (!dbName) {
  throw new Error("Please add your MongoDB database name to .env");
}

let client;
let clientPromise;

client = new MongoClient(uri);

clientPromise = client.connect()
  .then((connectedClient) => {
    console.log(`Connected to MongoDB database: ${dbName}`);
    return connectedClient;
  });

let cachedClient = null;
let cachedDb = null;

export async function connectToDatabase() {
  if (cachedClient && cachedDb) {
    return { client: cachedClient, db: cachedDb };
  }

  if (!clientPromise) {
    throw new Error("MongoDB client promise not initialized");
  }

  try {
    cachedClient = await clientPromise;
    cachedDb = cachedClient.db(dbName);
    return { client: cachedClient, db: cachedDb };
  } catch (error) {
    console.error("Failed to connect to the database:", error);
    throw error;
  }
}

export default clientPromise;
