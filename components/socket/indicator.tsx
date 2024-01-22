"use client"

import { useEffect, useState } from "react"
import { useSocket } from "@/components/socket/provider"
import { Badge } from "@/components/ui/badge"

type SocketIndicatorProps = {
  getData: () => Promise<void>
}

export const SocketIndicator = ({ getData }: SocketIndicatorProps) => {
  const { socket, isConnected } = useSocket()
  const [message, setMessage] = useState("")

  useEffect(() => {
    if (!socket) {
      return
    }
    socket.on("message", (message: string) => {
      setMessage(message)
      getData()
    })
  }, [getData, socket])

  if (!isConnected) {
    return (
      <Badge variant='outline' className='bg-yellow-600 text-white border-none'>
        Offline
      </Badge>
    )
  }

  return (
    <Badge variant='outline' className='bg-emerald-600 text-white border-none'>
      Live: {message}
    </Badge>
  )
}
