"use server"

import { currentUser } from "@clerk/nextjs"

import clientPromise, { connectToShortPathCollection } from "@/lib/mongodb"
import { formatBytes, logger } from "@/lib/utils"
import { DBInfoProps } from "@/types"

const ADMIN_EMAIL = process.env.ADMIN_EMAIL

export const getDbInfos = async (): Promise<DBInfoProps[] | null> => {
  const user = await currentUser()
  if (!user || user.emailAddresses[0].emailAddress !== ADMIN_EMAIL) return null

  const client = await clientPromise

  const dbList = await client.db().admin().listDatabases()

  const filtered = dbList.databases.filter((db) => db.name.includes("@"))

  const info = Promise.all(
    filtered.map(async (db) => ({
      dbName: db.name,
      dbSize: formatBytes(db.sizeOnDisk as number),
      filesCount: await client
        .db(db.name)
        .collection("fs.files")
        .countDocuments(),
      chunksCount: await client
        .db(db.name)
        .collection("fs.chunks")
        .countDocuments(),
    }))
  )

  logger(`${filtered.length} collections got.`)
  return info
}

export const dropDb = async (dbName: string) => {
  const client = await clientPromise
  const shortPathCollection = await connectToShortPathCollection()

  await shortPathCollection.deleteMany({ user_id: dbName })

  await client
    .db(dbName)
    .dropDatabase()
    .then(() => logger(`${dbName} [DROPPED!]`))
}
