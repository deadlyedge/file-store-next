"use server"

import { connectToShortPathCollection } from "@/lib/mongodb"
import { ChangeStreamEvents } from "mongodb"
import { FileInfoProps } from "@/types"
import { logger } from "@/lib/utils"

const baseUrl = process.env.BASE_URL as string

export const watchList = async () => {
  const { shortPathCollection } = await connectToShortPathCollection()
  const changeStream = shortPathCollection.watch()

  changeStream.on("change", (change: ChangeStreamEvents<Document>) => {
    logger('Collection change detected:', change)
  })

  changeStream.on('close',()=>{
    logger('Collection change stream closed')
  })

  // const files = await bucket.find().toArray()
  // const output: FileInfoProps[] = files.map((file) => ({
  //   id: String(file._id),
  //   filename: file.filename,
  //   size: file.length,
  //   // trans file.uploadDate to exist time from now in seconds
  //   deltaTime: Math.floor(
  //     (Date.now() - new Date(file.uploadDate).getTime()) / 1000
  //   ),
  //   baseUrl,
  //   shortPath: file.metadata?.shortPath,
  //   selected: false,
  // }))

  // return output
}
