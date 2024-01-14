"use server"

import { currentUser } from "@clerk/nextjs"

import clientPromise from "@/lib/mongodb"
import { formatBytes } from "@/lib/utils"
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
  return info
}

export const dropDb = async (dbName: string) => {
  const client = await clientPromise

  client.db(dbName).dropDatabase()
}
