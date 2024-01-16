// delete file from mongodb

import { ObjectId } from "mongodb"
import { NextResponse } from "next/server"

import { connectToBucket } from "@/lib/mongodb"
import { getDatabaseName, logger } from "@/lib/utils"

export const POST = async (req: Request) => {
  try {
    const { databaseName } = await getDatabaseName()
    const bucket = await connectToBucket(databaseName)
    const { fileIds } = (await req.json()) as { fileIds: string[] }

    fileIds.forEach(async (id) => {
      await bucket.delete(new ObjectId(id))
    })

    return new NextResponse("Delete Success.", { status: 200 })
  } catch (error) {
    logger("delete failed", error)

    return new NextResponse("Delete Failed.", { status: 500 })
  }
}
