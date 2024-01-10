// get file from mongodb, in 'json' or 'download' or just image data

import { NextRequest, NextResponse } from "next/server"
import { ObjectId } from "mongodb"

import { connectToDb } from "@/lib/mongodb"

export const GET = async (
  req: NextRequest,
  { params }: { params: { fileId: string } }
) => {
  try {
    const searchParams = req.nextUrl.searchParams
    const { bucket } = await connectToDb()

    const output_format = searchParams.get("output")
    const fileObjectId = new ObjectId(params.fileId)
    const file = (await bucket.find(fileObjectId).toArray()).at(0)

    if (!file) return new NextResponse("File Not Found", { status: 404 })

    const fileStream = bucket.openDownloadStream(
      fileObjectId
    ) as unknown as ReadableStream

    switch (output_format) {
      case "json":
        return NextResponse.json(file)
      case "download":
        return new NextResponse(fileStream, {
          status: 200,
          headers: {
            "Content-Disposition": `attachment; filename=${file?.filename}`,
          },
        })
      default:
        return new NextResponse(fileStream, { status: 200 })
    }
  } catch (error) {
    console.log("[GET_FILE_ERROR]", error)
    return new NextResponse("Internal Error", { status: 500 })
  }
}
