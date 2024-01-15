import { GridFSBucket, MongoClient } from "mongodb"

// if (!process.env.MONGODB_URI) {
//   throw new Error('Invalid/Missing environment variable: "MONGODB_URI"')
// }

// add default value to prevent docker build error with mongodb
const uri = process.env.MONGODB_URI || 'mongodb://192.168.50.17/'
const DEFAULT_DB_NAME = process.env.MONGO_DB_NAME as string

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
    client = new MongoClient(uri, options)
    globalWithMongo._mongoClientPromise = client.connect()
  }
  clientPromise = globalWithMongo._mongoClientPromise
} else {
  // In production mode, it's best to not use a global variable.
  client = new MongoClient(uri, options)
  clientPromise = client.connect()
}

// Export a module-scoped MongoClient promise. By doing this in a
// separate module, the client can be shared across functions.
export default clientPromise

export const connectToBucket = async (dbName: string = DEFAULT_DB_NAME) => {
  const client = await clientPromise

  const changeDotInDbName = dbName.replace(".", "_")

  const bucket = new GridFSBucket(client.db(changeDotInDbName))

  return bucket
}
