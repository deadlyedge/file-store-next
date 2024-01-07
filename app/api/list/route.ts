// list files in mongodb

import { NextResponse } from "next/server"

import { connectToDb } from "@/lib/mongodb"
import { FileInfoProps } from "@/types"

const base_url = process.env.BASE_URL as string

export const dynamic = 'force-dynamic'

export async function GET() {
  const { bucket } = await connectToDb()

  const files = await bucket.find().toArray()
  const output: FileInfoProps[] = files.map((file) => {
    return {
      id: String(file._id),
      filename: file.filename,
      size: file.length,
      // trans file.uploadDate to exist time from now in seconds
      delta_time: Math.floor(
        (Date.now() - new Date(file.uploadDate).getTime()) / 1000
      ),
      base_url,
      selected: false,
    }
  })
  return NextResponse.json(output, { status: 200 })
}
