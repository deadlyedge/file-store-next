// get file from mongodb, in 'json' or 'download' or just image data

import { NextRequest, NextResponse } from "next/server"
import { ObjectId } from "mongodb"

import { connectToBucket } from "@/lib/mongodb"
import { decodeString, logger } from "@/lib/utils"

export const GET = async (
  req: NextRequest,
  { params }: { params: { fileId: string } }
) => {
  try {
    const searchParams = req.nextUrl.searchParams
    const output_format = searchParams.get("output")

    const { fileId, databaseName } = decodeString(params.fileId)
    const { bucket } = await connectToBucket(databaseName)

    const fileObjectId = new ObjectId(fileId)
    const file = (await bucket.find(fileObjectId).toArray()).at(0)

    if (!file) return new NextResponse("File Not Found", { status: 404 })
    const fileNameUrlSafe = encodeURI(file.filename)

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
            "Content-Disposition": `attachment; filename=${fileNameUrlSafe}`,
          },
        })
      default:
        return new NextResponse(fileStream, { status: 200 })
    }
  } catch (error) {
    logger("[GET_FILE_ERROR]", error)
    return new NextResponse("Internal Error", { status: 500 })
  }
}
