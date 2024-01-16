"use server"

import {
  connectToBucket,
  connectToShortPathCollection,
  getRandomString,
} from "@/lib/mongodb"
import { Readable } from "stream"

import { encodeStrings, getDatabaseName, logger } from "@/lib/utils"
import { ObjectId } from "mongodb"

export const upload = async (formData: FormData) => {
  try {
    const { databaseName } = await getDatabaseName()
    const bucket = await connectToBucket(databaseName)
    const shortPathCollection = await connectToShortPathCollection()

    const files: File[] = []
    let counter = 0
    formData.forEach((value) => files.push(value as File))

    // map through all the entries
    files.forEach(async (file) => {
      const filename = file.name
      const fileId = new ObjectId()
      const buffer = Buffer.from(await file.arrayBuffer())
      const stream = Readable.from(buffer)
      const randomString = await getRandomString()
      const imagePath = encodeStrings({
        fileId: fileId.toString(),
        databaseName,
      })

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
        longPath: imagePath,
      })

      stream.on("close", () => {
        counter += 1
      })

      // pipe the readable stream to a writeable stream to save it to the database
      stream.pipe(uploadStream)
    })

    // took me four days for this, had to MARK here!
    while (counter < files.length) {
      await new Promise((resolve) => setTimeout(resolve, 2000))
      logger("hold 2 seconds...")
    }

    logger(`[UPLOAD_SUCCESS] ${files.length} file(s) uploaded.`)

    // return the response after all the entries have been processed.
  } catch (error) {
    logger("[UPLOAD_FAIL] ", error)
  }
}
