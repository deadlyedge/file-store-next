// upload file to mongodb

import { NextResponse } from "next/server"
import { Readable } from "stream"
import { ObjectId } from "mongodb"

import { connectToBucket } from "@/lib/mongodb"
import { encodeStrings, getCollectionName, logger } from "@/lib/utils"

export const POST = async (req: Request) => {
  try {
    const data = await req.formData()
    const { collectionName } = await getCollectionName()
    const bucket = await connectToBucket(collectionName)

    const files: File[] = []
    let counter = 0
    data.forEach((value) => files.push(value as File))

    // map through all the entries
    files.forEach(async (file) => {
      const filename = file.name
      const fileId = new ObjectId()

      const buffer = Buffer.from(await file.arrayBuffer())
      const stream = Readable.from(buffer)

      const uploadStream = bucket.openUploadStream(filename, {
        // make sure to add content type so that it will be easier to set later.
        chunkSizeBytes: 1024 * 1024,
        id: fileId,
        contentType: file.type,
        metadata: {
          imagePath: encodeStrings({
            fileId: fileId.toString(),
            collectionName,
          }),
        }, //add your metadata here if any
      })

      stream.on("close", () => {
        counter += 1
      })

      // pipe the readable stream to a writeable stream to save it to the database
      stream.pipe(uploadStream)
    })

    // took me four days form this, have to MARK here!
    while (counter < files.length) {
      await new Promise((resolve) => setTimeout(resolve, 1000))
      logger("hold a second...")
    }

    logger(`[UPLOAD_SUCCESS:] ${files.length} files uploaded.`)

    // return the response after all the entries have been processed.
    return new NextResponse("success", { status: 200 })
  } catch (error) {
    logger("[UPLOAD_FAIL:]", error)
    return new NextResponse("error", { status: 500 })
  }
}
