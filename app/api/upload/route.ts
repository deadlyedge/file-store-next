// upload file to mongodb

import { NextResponse } from "next/server"
import { Readable } from "stream"
import { ObjectId } from "mongodb"

import {
  connectToBucket,
  connectToShortPathCollection,
  connectToTokenTable,
  getRandomString,
} from "@/lib/mongodb"
import { encodeStrings, logger } from "@/lib/utils"

export const POST = async (req: Request) => {
  try {
    const formData = await req.formData()
    const token = req.headers.get("token")
    if (!token) return new NextResponse("Unauthorized", { status: 401 })

    const { tokenTable } = await connectToTokenTable()
    const databaseName = await tokenTable
      .findOne({ token })
      .then((res) => res?.user_id)

    const { bucket } = await connectToBucket(databaseName)
    const { shortPathCollection } = await connectToShortPathCollection()

    const files: File[] = []
    let counter = 0
    formData.forEach((value) => files.push(value as File))

    // map through all the entries
    files.forEach(async (file) => {
      const filename = file.name
      const fileId = new ObjectId()
      const buffer = Buffer.from(await file.arrayBuffer())
      const stream = Readable.from(buffer)
      const { randomString } = await getRandomString()

      const uploadStream = bucket.openUploadStream(filename, {
        // make sure to add content type so that it will be easier to set later.
        chunkSizeBytes: 1024 * 1024,
        id: fileId,
        contentType: file.type,
        metadata: {
          shortPath: randomString,
        }, //add your metadata here if any
      })

      await shortPathCollection.insertOne({
        _id: fileId,
        user_id: databaseName,
        shortPath: randomString,
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
