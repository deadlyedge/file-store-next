import { Whisper } from "next/font/google"
import { UserButton, currentUser } from "@clerk/nextjs"

import { cn } from "@/lib/utils"
import { TokenDialog } from "./tokenDialog"
import { Button } from "./ui/button"
import { About } from "./about"

const whisper = Whisper({ subsets: ["latin"], weight: "400" })
const ADMIN_EMAIL = process.env.ADMIN_EMAIL

export const Header = async () => {
  const user = await currentUser()
  const isAdmin = user?.emailAddresses[0].emailAddress === ADMIN_EMAIL

  return (
    <>
      <div className='w-52 h-32 right-0 top-0 fixed bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500 background-animate bg-opacity-20'></div>
      <div className='w-full h-20 right-0 top-0 fixed z-10 bg-zinc-500/40'>
        <div className='ml-[390px] mt-1 p-2 w-80 h-16 flex flex-row justify-start items-center border-zinc-500 text-zinc-200'>
          <div className='z-50'>
            <UserButton afterSignOutUrl='/' showName />
            <TokenDialog />
          </div>
          {isAdmin && (
            <div className='ml-4 z-50'>
              <Button>Admin</Button>
            </div>
          )}
          <div className='ml-4 z-50'>
            <About />
          </div>
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
