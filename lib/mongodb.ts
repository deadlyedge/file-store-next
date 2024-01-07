import { GridFSBucket, MongoClient } from "mongodb"

declare global {
  var client: MongoClient | null
  var bucket: GridFSBucket | null
}

const MONGODB_URI = process.env.MONGODB_URI as string
const DB_NAME = process.env.MONGO_DB_NAME as string

if (!DB_NAME || !MONGODB_URI) {
  console.log(
    'Invalid/Missing environment variable: "MONGO_DB_NAME" or "MONGODB_URI"'
  )
}

/* 
  Initializes the connection to mongodb and creates a GridFSBucket
  Once connected, it will use the cached connection.
*/
export async function connectToDb() {
  if (global.client) {
    return {
      client: global.client,
      bucket: global.bucket!,
    }
  }

  const client = (global.client = new MongoClient(MONGODB_URI, {}))
  const bucket = (global.bucket = new GridFSBucket(client.db(DB_NAME)))

  await global.client.connect()
  console.log("Connected to the Database ")
  return { client, bucket: bucket! }
}

// utility to check if file exists
export async function fileExists(filename: string): Promise<boolean> {
  const { client } = await connectToDb()
  const count = await client
    .db()
    .collection("images.files")
    .countDocuments({ filename })

  return !!count
}
