import { GridFSBucket, MongoClient } from "mongodb"
import { logger } from "./utils"

// add default value to prevent docker build error with mongodb
const MONGODB_URI = process.env.MONGODB_URI || "mongodb://192.168.50.17/"
const DEFAULT_DB_NAME = process.env.DEFAULT_DB_NAME || "file-store-next"
const DEFAULT_SHORT_PATH_LENGTH =
  Number(process.env.DEFAULT_SHORT_PATH_LENGTH) || 8

const options = {}

let client
let clientPromise: Promise<MongoClient>

if (process.env.NODE_ENV === "development") {
  // In development mode, use a global variable so that the value
  // is preserved across module reloads caused by HMR (Hot Module Replacement).
  let globalWithMongo = global as typeof globalThis & {
    _mongoClientPromise?: Promise<MongoClient>
  }

  if (!globalWithMongo._mongoClientPromise) {
    client = new MongoClient(MONGODB_URI, options)
    globalWithMongo._mongoClientPromise = client.connect()
  }
  clientPromise = globalWithMongo._mongoClientPromise
} else {
  // In production mode, it's best to not use a global variable.
  client = new MongoClient(MONGODB_URI, options)
  clientPromise = client.connect()
}

// Export a module-scoped MongoClient promise. By doing this in a
// separate module, the client can be shared across functions.
export default clientPromise

export const connectToBucket = async (
  databaseName: string = DEFAULT_DB_NAME
) => {
  const client = await clientPromise

  const changeDotInDatabaseName = databaseName.replace(".", "_")

  const bucket = new GridFSBucket(client.db(changeDotInDatabaseName))

  return bucket
}

export const connectToShortPathCollection = async () => {
  const client = await clientPromise
  const db = client.db("file_store_common")
  const collection = db.collection("short_path")

  const checkCollection = await db.listCollections().toArray()

  if (checkCollection.length < 1) await db.createCollection("short_path")

  const checkIndex = await collection.listIndexes().toArray()
  if (checkIndex.length < 2) {
    await collection.createIndex({ shortPath: 1 }, { unique: true })
  }

  return collection
}

/**
 * make a random string, check if it exist in the database.
 * if it does, add a "_" to the random string.
 * this is just a small project so it does not even happen.
 * @param len of result
 * @returns string
 */
export const getRandomString = async (len = DEFAULT_SHORT_PATH_LENGTH) => {
  const pool = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnprstuvwxyz2345678" // xdream
  let str = ""
  for (let i = 0; i < len; i++) {
    str += pool.charAt(Math.floor(Math.random() * pool.length))
  }

  const client = await clientPromise

  const checkExist = await client
    .db("file_store_common")
    .collection("short_path")
    .findOne({ shortPath: str })

  if (!checkExist) return str

  logger("find duplicate id, use alternative plan.")
  return (str += "_")
}
