import { redirect } from "next/navigation"

import { connectToBucket, connectToShortPathCollection } from "@/lib/mongodb"
import { NextResponse } from "next/server"
import { logger } from "@/lib/utils"
import { ObjectId } from "mongodb"

type GETProps = {
  params: {
    shortPath: string
    output: string[]
  }
}

export const GET = async (req: Request, { params }: GETProps) => {
  try {
    const { shortPathCollection } = await connectToShortPathCollection()

    const shortPathTable = await shortPathCollection.findOne({
      shortPath: params.shortPath,
    })
    if (!shortPathTable) {
      return redirect("/vercel.svg")
    }

    const { _id: fileId, user_id: userId } = shortPathTable as unknown as {
      _id: ObjectId
      user_id: string
    }

    const { bucket } = await connectToBucket(userId)

    const file = (await bucket.find(fileId).toArray()).at(0)
    const output_format = params.output ? params.output.shift() : ""

    if (!file) return new NextResponse("File Not Found", { status: 404 })

    const fileStream = bucket.openDownloadStream(
      fileId
    ) as unknown as ReadableStream

    switch (output_format) {
      case "json":
        return NextResponse.json(file)
      case "download":
        return new NextResponse(fileStream, {
          status: 200,
          headers: {
            "Content-Disposition": `attachment; filename=${file.filename}`,
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
