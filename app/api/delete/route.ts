// delete file from mongodb

import { ObjectId } from "mongodb"
import { NextResponse } from "next/server"

import { connectToBucket } from "@/lib/mongodb"

export const POST = async (req: Request) => {
  try {
    const { bucket } = await connectToBucket()
    const { fileIds } = (await req.json()) as { fileIds: string[] }

    fileIds.forEach(async (id) => {
      await bucket.delete(new ObjectId(id))
    })

    return new NextResponse("Delete Success.", { status: 200 })
  } catch (error) {
    console.log("delete failed", error)

    return new NextResponse("Delete Failed.", { status: 500 })
  }
}
