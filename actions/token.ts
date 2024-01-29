"use server"

import { v4 as UUID } from "uuid"

import { connectToTokenTable, getDatabaseName } from "@/lib/mongodb"
import { logger } from "@/lib/utils"

export const getToken = async (make: boolean = false) => {
  const databaseName = await getDatabaseName()
  const { tokenTable } = await connectToTokenTable()

  if (make) {
    const token = UUID()
    await tokenTable.updateOne(
      { user_id: databaseName },
      { $set: { token, user_id: databaseName } },
      { upsert: true }
    )
    logger(`Token created: ${token}`)
    return token
  }

  const lastToken: string = await tokenTable
    .findOne({ user_id: databaseName })
    .then((res) => res?.token)

  // logger(`Last token: ${lastToken}`)
  if (!lastToken) {
    const token = UUID()
    await tokenTable.insertOne({ token, user_id: databaseName })
    return token
  }
  return lastToken
}
