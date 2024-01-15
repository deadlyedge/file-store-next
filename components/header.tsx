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
      <div className=' w-24 h-24 sm:w-52 sm:h-32 right-0 top-0 fixed bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500 background-animate bg-opacity-20'></div>
      <div className='w-full h-36 sm:h-20 right-0 top-0 fixed z-10 bg-zinc-500/40'>
        <div className='mt-[70px] sm:ml-52 lg:ml-[390px] sm:my-auto p-2 w-40 sm:w-80 h-20 flex flex-row justify-start items-center border-zinc-500 text-zinc-200'>
          <div className='z-50 text-center'>
            <div className="bg-white/10 rounded py-1 px-2 shadow-md"><UserButton afterSignOutUrl='/' showName /></div>
            <div className='hidden sm:block'>
              <TokenDialog />
            </div>
          </div>
          {isAdmin && (
            <div className='ml-4 z-50'>
              <a href='/admin'>
                <Button>Admin</Button>
              </a>
            </div>
          )}
          <div className='ml-4 z-50'>
            <About />
          </div>
        </div>
      </div>
      <div className='w-full h-20 sm:w-40 sm:h-40 right-0 top-0 fixed bg-gray-50 bg-opacity-20'></div>
      <section
        className={cn(
          whisper.className,
          "fixed z-40 text-gray-100 scale-50 sm:scale-100 sm:h-40 sm:w-48 top-2 sm:top-0 right-0"
        )}>
        <div className='absolute top-8 right-2 text-[3rem] mr-16 mt-10 -rotate-90'>
          mongo
        </div>
        <div className='absolute inset-y-0 right-2'>
          <div className='text-[5rem] -mt-8'>FileStore</div>
          <div className='font-sans text-xl mt-0 float-right'>NexTS</div>
        </div>
      </section>
    </>
  )
}
