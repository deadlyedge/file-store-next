"use server"

import { ObjectId } from "mongodb"
import { connectToBucket, connectToShortPathCollection } from "@/lib/mongodb"
import { logger } from "@/lib/utils"

export const deleteFiles = async (ids_to_delete: string[]) => {
  try {
    const { bucket } = await connectToBucket()
    const { shortPathCollection } = await connectToShortPathCollection()

    ids_to_delete.forEach(async (id) => {
      const objectId = new ObjectId(id)
      await shortPathCollection.deleteOne({ _id: objectId })
      await bucket.delete(objectId)
    })

    logger(`[DELETE FILES] ${ids_to_delete.length} file(s) deleted.`)
  } catch (error) {
    logger("delete failed", error)
  }
}
