"use client"

import { Whisper } from "next/font/google"
import Link from "next/link"
import { useAuth } from "@clerk/nextjs"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

const whisper = Whisper({ subsets: ["latin"], weight: "400" })

export function LandingNavbar() {
  const { isSignedIn } = useAuth()
  return (
    <nav className='p-2 bg-transparent flex items-center justify-between'>
      <Link href='/' className='flex items-center'>
        <section
          className={cn(
            whisper.className,
            "z-40 text-gray-100 scale-50 ml-32 "
          )}>
          <div className='w-52 h-32 right-0 top-0 fixed bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500 background-animate bg-opacity-20'></div>
          <div className='absolute top-8 right-2 text-[3rem] mr-16 mt-10 -rotate-90'>
            mongo
          </div>
          <div className='absolute inset-y-0 right-2'>
            <div className='text-[5rem] -mt-8'>FileStore</div>
            <div className='font-sans text-xl mt-0 float-right'>NexTS</div>
          </div>
        </section>
      </Link>
      <div className='flex items-center gap-x-2'>
        <Link href={isSignedIn ? "/dashboard" : "/sign-in"}>
          <Button variant='outline' className='rounded-full'>
            Start
          </Button>
        </Link>
      </div>
    </nav>
  )
}
