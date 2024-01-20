"use client"
/**
 * this is a component only made for debug.
 */

import { logger } from "@/lib/utils"
import { currentUser } from "@clerk/nextjs"
import Image from "next/image"
import { useEffect } from "react"
import { io as ClientIO } from "socket.io-client"
import { SocketIndicator } from "./socket/indicator"

export const Status = () => {
  // const user = await currentUser()
  // const date = new Date(user?.createdAt!)
  // const avatar = user?.imageUrl!
  // const email = user?.emailAddresses[0].emailAddress!

  // test socket.io here
  //
  /////////////////////////////////



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
