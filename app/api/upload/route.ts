// upload file to mongodb

import { NextResponse } from "next/server"
import { Readable } from "stream"

import { connectToDb } from "@/lib/mongodb"

export async function POST(req: Request) {
  try {
    const body = await req.formData()
    const { bucket } = await connectToDb()

    const file = body.get("file") as File
    const buffer = Buffer.from(await file.arrayBuffer())
    const readableStream = Readable.from(buffer)

    // upload file to mongodb
    const uploadStream = bucket.openUploadStream(file.name, {
      chunkSizeBytes: 1024 * 1024,
    })

    // Write file data to stream
    await readableStream.pipe(uploadStream)

    return new NextResponse("File uploaded successfully", { status: 200 })
  } catch (error) {
    return new NextResponse("Error uploading file", { status: 500 })
  }
}
