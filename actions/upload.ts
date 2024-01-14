"use server"

import { connectToBucket } from "@/lib/mongodb"
import { Readable } from "stream"

import { encodeStrings, getCollectionName } from "@/lib/utils"
import { ObjectId } from "mongodb"

export const upload = async (formData: FormData) => {
  try {
    const { collectionName } = await getCollectionName()
    const bucket = await connectToBucket(collectionName)

    const files: File[] = []
    let counter = 0
    formData.forEach((value) => files.push(value as File))

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
          image_path: encodeStrings({
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

    // took me four days for this, had to MARK here!
    while (counter < files.length) {
      await new Promise((resolve) => setTimeout(resolve, 1000))
      console.log("hold a second...")
    }

    console.log(`[UPLOAD_SUCCESS] ${files.length} file(s) uploaded.`)

    // return the response after all the entries have been processed.
  } catch (error) {
    console.log("[UPLOAD_FAIL] ", error)
  }
}
