'use server'

import { ObjectId } from "mongodb"
import { connectToDb } from "@/lib/mongodb"

export const deleteFiles = async (ids_to_delete: string[]) => {
  try {
    const { bucket } = await connectToDb()

    ids_to_delete.forEach(async (id) => {
      await bucket.delete(new ObjectId(id))
    })

    console.log(`[DELETE FILES] ${ids_to_delete.length} file(s) deleted.`)
  } catch (error) {
    console.log("delete failed", error)
  }
}
