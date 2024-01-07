// list files in mongodb

import { NextResponse } from "next/server"

import { bucket } from "@/lib/mongodb"

export async function GET() {
  const files = await bucket.find().toArray()
  return NextResponse.json(files)
}