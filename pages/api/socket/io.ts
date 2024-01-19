import { Server as NetServer } from "http"
import { NextApiRequest } from "next"
import { Server as ServerIO } from "socket.io"

import { NextApiResponseServerIO } from "@/types"
import { logger } from "@/lib/utils"

const ioHandler = (req: NextApiRequest, res: NextApiResponseServerIO) => {
  if (!res.socket.server.io) {
    const path = "/api/socket/io"
    const httpServer: NetServer = res.socket.server as any
    const io = new ServerIO(httpServer, {
      path,
    })
    io.on("connection", (socket) => {
      logger("Client connected")
      socket.on("disconnect", () => {
        logger("Client disconnected")
      })
    })
    res.socket.server.io = io
  }
  res.end()
}
export default ioHandler
