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

export async function connectToDatabase() {
  const client = await clientPromise;
  const db = client.db(dbName);
  return { client, db };
}

export default clientPromise;
