"use client"

import { useEffect, useState } from "react"
import { useSocket } from "@/components/socket/provider"
import { Badge } from "@/components/ui/badge"
import { Button } from "../ui/button"

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
      // get pushed message and add a second tag to show diff.
      setMessage(`${message}(${new Date().getSeconds().toString()})`)
      getData()
    })
  }, [getData, socket])

  if (!isConnected) {
    return (
      <Badge
        variant='outline'
        className='bg-yellow-600/80 text-white border-none'>
        Offline:{" "}
        <Button size='sm' variant='link' onClick={getData}>
          Refresh list
        </Button>
      </Badge>
    )
  }

  return (
    <Badge
      variant='outline'
      className='bg-emerald-600/60 text-white border-none'>
      Live: {message}
    </Badge>
  )
}
