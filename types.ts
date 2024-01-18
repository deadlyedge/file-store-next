import { Server as NetServer, Socket } from "net"
import { NextApiResponse } from "next"
import { Server as SocketIOServer } from "socket.io"

export type FileInfoProps = {
  filename: string
  id: string
  size: number
  deltaTime: number
  baseUrl: string
  databaseName?: string
  shortPath: string
  selected?: boolean
}

export type DBInfoProps = {
  dbName: string
  dbSize: string
  filesCount: number
  chunksCount: number
}

export type NextApiResponseServerIO = NextApiResponse & {
  socket: Socket & {
    server: NetServer & {
      io: SocketIOServer
    }
  }
}
