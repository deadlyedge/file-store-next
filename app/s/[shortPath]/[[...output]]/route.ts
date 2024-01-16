import { redirect } from "next/navigation"

import { connectToBucket, connectToShortPathCollection } from "@/lib/mongodb"
import { NextResponse } from "next/server"
import { decodeString, logger } from "@/lib/utils"
import { ObjectId } from "mongodb"

type GETProps = {
  params: {
    shortPath: string
    output: string[]
  }
}

export const GET = async (req: Request, { params }: GETProps) => {
  const { shortPathCollection } = await connectToShortPathCollection()

  const shortPathLongPathTable = await shortPathCollection.findOne({
    shortPath: params.shortPath,
  })
  if (!shortPathLongPathTable) {
    return redirect("/vercel.svg")
  }

  try {
    const { longPath } = shortPathLongPathTable as unknown as {
      longPath: string
    }

    const { fileId, databaseName } = decodeString(longPath)
    const { bucket } = await connectToBucket(databaseName)

    const fileObjectId = new ObjectId(fileId)
    const file = (await bucket.find(fileObjectId).toArray()).at(0)
    const output = params.output ? params.output.shift() : ""

    if (!file) return new NextResponse("File Not Found", { status: 404 })

    const fileStream = bucket.openDownloadStream(
      fileObjectId
    ) as unknown as ReadableStream

    switch (output) {
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
    logger("[GET_FILE_ERROR]", error)
    return new NextResponse("Internal Error", { status: 500 })
  }
}
