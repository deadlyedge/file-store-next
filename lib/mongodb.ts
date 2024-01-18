import { GridFSBucket, MongoClient } from "mongodb"
import { logger } from "./utils"
import { currentUser } from "@clerk/nextjs"
import { redirect } from "next/navigation"

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

/**
 * on upload, list, delete route, use current user's database name,
 * on get route, the url link or the short path must provide the
 * database name. so we can then connect the database.
 * @param dbName optional, if not present, use current user's database
 * @returns
 */
export const connectToBucket = async (dbName?: string) => {
  const client = await clientPromise
  const databaseName = dbName || (await getDatabaseName())

  const db = client.db(databaseName)
  const bucket = new GridFSBucket(db)

  return { db, bucket, databaseName }
}

/**
 * check if collection exist, if not, create it.
 * check if index exist, if not, create it.
 * @returns collection for short path.
 */
export const connectToShortPathCollection = async () => {
  const client = await clientPromise
  const db = client.db("file_store_common")
  const shortPathCollection = db.collection("short_path")

  const checkCollection = (await db.listCollections().toArray()).map(
    (res) => res.name
  )

  if (!checkCollection.includes("short_path"))
    await db.createCollection("short_path")

  const checkIndex = await shortPathCollection.listIndexes().toArray()

  if (checkIndex.length < 2) {
    await shortPathCollection.createIndex({ shortPath: 1 }, { unique: true })
  }

  return { shortPathCollection }
}
/**
 * check if collection exist, if not, create it.
 * check if index exist, if not, create it.
 * @returns collection for short path.
 */
export const connectToTokenTable = async () => {
  const client = await clientPromise
  const db = client.db("file_store_common")
  const tokenTable = db.collection("token_table")

  const checkCollection = (await db.listCollections().toArray()).map(
    (res) => res.name
  )
  if (!checkCollection.includes("token_table"))
    await db.createCollection("token_table")

  const checkIndex = await tokenTable.listIndexes().toArray()

  if (checkIndex.length < 2) {
    await tokenTable.createIndex({ user_id: 1 }, { unique: true })
    await tokenTable.createIndex({ token: 1 }, { unique: true })
  }

  return { tokenTable }
}

/**
 * get user email from current user and then
 * transform it to collection name for mongo.
 * @returns database name.
 */
export const getDatabaseName = async () => {
  const user = await currentUser()

  if (!user) {
    logger("no user found.")
    return redirect("/sign-in")
  }

  const email = user.emailAddresses[0].emailAddress

  if (!email) {
    logger("no email found. something wrong.")
    return redirect("/sign-in")
  }

  const databaseName = "fs_" + email.replaceAll(".", "_")

  return databaseName
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

  const { db } = await connectToBucket()

  const checkExist = await db
    .collection("short_path")
    .findOne({ shortPath: str })

  if (!checkExist) return { randomString: str }

  logger("find duplicate id, use alternative plan.")
  return { randomString: (str += "_") }
}
