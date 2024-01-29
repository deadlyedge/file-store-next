// list files in mongodb

import { NextRequest, NextResponse } from "next/server"

import { connectToBucket, connectToTokenTable } from "@/lib/mongodb"
import { FileInfoProps } from "@/types"
import { listFiles } from "@/actions/list"

const baseUrl = process.env.BASE_URL as string

export const dynamic = "force-dynamic"

export const GET = async (req: NextRequest) => {
  const token = req.nextUrl.searchParams.get("token")
  if (!token) return new NextResponse("Need Token", { status: 401 })

  const { tokenTable } = await connectToTokenTable()
  const databaseName = await tokenTable
    .findOne({ token })
    .then((res) => res?.user_id)

  if (!databaseName) return new NextResponse("Invalid Token", { status: 401 })

  const { bucket } = await connectToBucket(databaseName)

  const files = await bucket.find().toArray()
  const output: FileInfoProps[] = files.map((file) => {
    return {
      id: String(file._id),
      filename: file.filename,
      size: file.length,
      // trans file.uploadDate to exist time from now in seconds
      deltaTime: Math.floor(
        (Date.now() - new Date(file.uploadDate).getTime()) / 1000
      ),
      baseUrl,
      shortPath: file.metadata?.shortPath,
      databaseName,
      selected: false,
    }
  })

  return NextResponse.json(output, { status: 200 })
}
