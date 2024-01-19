"use client"

import { useEffect, useState } from "react"
import { useSocket } from "@/components/socket/provider"
import { Badge } from "@/components/ui/badge"

export const SocketIndicator = () => {
  const { socket, isConnected } = useSocket()
  const [message, setMessage] = useState("")

  useEffect(() => {
    if (!socket) {
      return
    }
    socket.on("message", (message: string) => {
      setMessage(message)
    })
  }, [socket])

  if (!isConnected) {
    return (
      <Badge variant='outline' className='bg-yellow-600 text-white border-none'>
        连接降级: 每秒拉取
      </Badge>
    )
  }

  return (
    <Badge variant='outline' className='bg-emerald-600 text-white border-none'>
      Live: {message}
    </Badge>
  )
}
