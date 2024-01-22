"use server"

import clientPromise from "@/lib/mongodb"
import { ChangeStreamEvents } from "mongodb"
import { FileInfoProps } from "@/types"
import { logger } from "@/lib/utils"

const baseUrl = process.env.BASE_URL as string

export const watchList = async () => {
  const client = await clientPromise
  const db = client.db("file_store_common")
  const shortPathCollection = db.collection("short_path")

  try {
    const changeStream = shortPathCollection.watch()

    changeStream.on("change", (change: ChangeStreamEvents<Document>) => {
      logger("Collection change detected:", change)
    })

    changeStream.on("close", () => {
      logger("Collection change stream closed")
    })

    await changeStream.close()
  } catch (error) {
  } finally {
    client.close()
  }
}
