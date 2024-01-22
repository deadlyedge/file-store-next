"use server"

import { Server as NetServer } from "http"
import { NextApiRequest } from "next"
import { Server as ServerIO } from "socket.io"

import { NextApiResponseServerIO } from "@/types"
import { logger } from "@/lib/utils"
import clientPromise from "@/lib/mongodb"
import { ChangeStreamEvents } from "mongodb"

export const config = {
  api: {
    bodyParser: false,
  },
}

const ioHandler = async (req: NextApiRequest, res: NextApiResponseServerIO) => {
  const client = await clientPromise
  const db = client.db("file_store_common")
  const shortPathCollection = db.collection("short_path")
  if (!res.socket.server.io) {
    const path = "/api/socket/io"
    const httpServer: NetServer = res.socket.server as any
    const io = new ServerIO(httpServer, {
      path,
    })
    io.on("connection", (socket) => {
      logger("Client connected")

      const changeStream = shortPathCollection.watch()
      logger("Collection change stream created!")

      changeStream.on("change", (change: ChangeStreamEvents<Document>) => {
        logger("Collection change detected:", change)
      })

      changeStream.on("close", () => {
        logger("Collection change stream closed")
      })

      socket.on("disconnect", () => {
        changeStream.close()
        logger("Socket disconnected")
      })
    })
    io.on("disconnect", () => {
      logger("Client disconnected")
    })
    res.socket.server.io = io
  }
  res.end()
  // await client.close()
}
export default ioHandler
