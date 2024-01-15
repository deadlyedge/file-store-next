"use server"

import { ObjectId } from "mongodb"
import { connectToBucket } from "@/lib/mongodb"
import { getCollectionName, logger } from "@/lib/utils"

export const deleteFiles = async (ids_to_delete: string[]) => {
  try {
    const { collectionName } = await getCollectionName()
    const bucket = await connectToBucket(collectionName)

    ids_to_delete.forEach(async (id) => {
      await bucket.delete(new ObjectId(id))
    })

    logger(`[DELETE FILES] ${ids_to_delete.length} file(s) deleted.`)
  } catch (error) {
    logger("delete failed", error)
  }
}
