"use server"

import { connectToBucket } from "@/lib/mongodb"
import { FileInfoProps } from "@/types"

const baseUrl = process.env.BASE_URL as string

export const listFiles = async () => {
  const { bucket } = await connectToBucket()

  const files = await bucket.find().toArray()
  const output: FileInfoProps[] = files.map((file) => ({
    id: String(file._id),
    filename: file.filename,
    size: file.length,
    // trans file.uploadDate to exist time from now in seconds
    deltaTime: Math.floor(
      (Date.now() - new Date(file.uploadDate).getTime()) / 1000
    ),
    baseUrl,
    shortPath: file.metadata?.shortPath,
    selected: false,
  }))

  return output
}
