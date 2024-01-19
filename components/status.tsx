"use client"
/**
 * this is a component only made for debug.
 */

import { logger } from "@/lib/utils"
import { currentUser } from "@clerk/nextjs"
import Image from "next/image"
import { useEffect } from "react"
import { io as ClientIO } from "socket.io-client"

export const Status = () => {
  // const user = await currentUser()
  // const date = new Date(user?.createdAt!)
  // const avatar = user?.imageUrl!
  // const email = user?.emailAddresses[0].emailAddress!

  // test socket.io here
  //
  /////////////////////////////////

  useEffect(() => {
    const socketInstance = new (ClientIO as any)(
      process.env.NEXT_PUBLIC_SITE_URL!,
      {
        path: "/api/socket/io",
      }
    )

    // Send a message to the server
    socketInstance.emit("chatMessage", "Hello, server!")
    // Receive a message from the server
    socketInstance.on("serverMessage", (message: string) => {
      logger(`Server says: ${message}`)
    })

    return () => socketInstance.disconnect()
  }, [])

  /////////////////////////////////
  // console.log(allInfo)
  return (
    <div className='fixed left-0 top-20 w-64 h-20 bg-white/50 p-1 text-xs text-zinc-900'>
      {/* {user?.username}
      {date.toLocaleString()}
      <Image src={avatar} alt='profile' width={50} height={50} />
      {email} */}
      hello socket!
    </div>
  )
}
