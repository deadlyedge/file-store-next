"use server"

import { connectToBucket } from "@/lib/mongodb"
import { getCollectionName } from "@/lib/utils"
import { FileInfoProps } from "@/types"

const base_url = process.env.BASE_URL as string

export const listFiles = async () => {
  const { collectionName } = await getCollectionName()
  const bucket = await connectToBucket(collectionName)

  const files = await bucket.find().toArray()
  const output: FileInfoProps[] = files.map((file) => ({
    id: String(file._id),
    filename: file.filename,
    size: file.length,
    // trans file.uploadDate to exist time from now in seconds
    delta_time: Math.floor(
      (Date.now() - new Date(file.uploadDate).getTime()) / 1000
    ),
    base_url,
    collectionName,
    selected: false,
  }))

  return output
}
