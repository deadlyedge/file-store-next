"use server"

import { ObjectId } from "mongodb"
import { connectToBucket } from "@/lib/mongodb"
import { getCollectionName } from "@/lib/utils"

export const deleteFiles = async (ids_to_delete: string[]) => {
  try {
    const { collectionName } = await getCollectionName()
    const bucket = await connectToBucket(collectionName)

    ids_to_delete.forEach(async (id) => {
      await bucket.delete(new ObjectId(id))
    })

    console.log(`[DELETE FILES] ${ids_to_delete.length} file(s) deleted.`)
  } catch (error) {
    console.log("delete failed", error)
  }
}
