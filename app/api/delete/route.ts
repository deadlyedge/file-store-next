// delete file from mongodb

import { ObjectId } from "mongodb"
import { NextResponse } from "next/server"

import {
  connectToBucket,
  connectToShortPathCollection,
  connectToTokenTable,
} from "@/lib/mongodb"
import { logger } from "@/lib/utils"

type POSTProps = {
  fileIds: string[]
  token: string
}

type MessageProps = {
  deleted: string[]
  notFound: string[]
}

export const POST = async (req: Request) => {
  try {
    const { fileIds, token } = (await req.json()) as POSTProps
    if (!token) return new NextResponse("Need Token", { status: 401 })

    const { tokenTable } = await connectToTokenTable()
    const databaseName = await tokenTable
      .findOne({ token })
      .then((res) => res?.user_id)

    if (!databaseName) return new NextResponse("Invalid Token", { status: 401 })

    const { bucket } = await connectToBucket(databaseName)
    const { shortPathCollection } = await connectToShortPathCollection()

    const message: MessageProps = { deleted: [], notFound: [] }
    for (const id of fileIds) {
      const objectId = new ObjectId(id)
      const file = await shortPathCollection.findOne({ _id: objectId })

      if (!file) {
        message.notFound.push(id)
        continue
      }

      if (file.user_id !== databaseName) {
        message.notFound.push("[id not match]" + id)
        continue
      }

      await shortPathCollection.deleteOne({ _id: objectId })
      await bucket.delete(objectId)
      message.deleted.push(id)
    }
    logger(`${message.deleted.length} file(s) deleted.`)

    return NextResponse.json(message, { status: 200 })
  } catch (error) {
    logger("delete failed", error)

    return new NextResponse("Delete Failed.", { status: 500 })
  }
}
