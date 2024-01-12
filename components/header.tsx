import { Whisper } from "next/font/google"
import { UserButton } from "@clerk/nextjs"

import { cn } from "@/lib/utils"
import { TokenDialog } from "./tokenDialog"

const whisper = Whisper({ subsets: ["latin"], weight: "400" })

export const Header = () => {
  return (
    <>
      <div className='w-52 h-32 right-0 top-0 fixed bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500 background-animate bg-opacity-20'></div>
      <div className='w-full h-20 right-0 top-0 fixed z-10 bg-zinc-500/40'>
        <div className='ml-[390px] mt-1 p-2 w-36 border-zinc-500 h-16 text-zinc-200'>
          <UserButton afterSignOutUrl='/' showName />
          <TokenDialog />
        </div>
      </div>
      <div className='w-40 h-40 right-0 top-0 fixed bg-gray-50 bg-opacity-20'></div>
      <section
        className={cn(
          whisper.className,
          "fixed z-10 text-gray-200 h-40 w-48 top-0 right-0"
        )}>
        <div className='absolute bottom-6 -left-8 -rotate-90 text-[3rem] '>
          mongo
        </div>
        <div className='absolute z-10 inset-y-0 right-2'>
          <div className='text-[5rem] -mt-8'>FileStore</div>
          <div className='font-sans text-xl mt-0 float-right'>NexTS</div>
        </div>
      </section>
    </>
  )
}
