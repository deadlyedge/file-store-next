"use server"

import { connectToDb } from "@/lib/mongodb"
import { Readable } from "stream"

export const upload = async (formData: FormData) => {
  const { bucket } = await connectToDb()
  const file = formData.get("file") as File

  console.log(file)

  const buffer = Buffer.from(await file.arrayBuffer())
  const readableStream = Readable.from(buffer)

  // upload file to mongodb
  const uploadStream = bucket.openUploadStream(file.name, {
    chunkSizeBytes: 1024 * 1024,
  })

  // Handle events on the upload stream
  uploadStream.on("error", (error) => {
    console.error(error)
    return false
  })

  uploadStream.on("finish", () => {
    console.log("File uploaded successfully")
    // Perform any additional actions here, if needed
    return true
  })

  // Write file data to stream
  await new Promise(() => {
    readableStream.pipe(uploadStream)
  })
}
