import { MongoClient, Db } from "mongodb";

const client = new MongoClient(process.env.DB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

export default async function database(): Promise<Db> {
  if (!client.isConnected()) await client.connect();
  return client.db(process.env.DB_NAME);
}
