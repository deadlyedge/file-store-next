"use client"

import { Montserrat } from "next/font/google"
import Link from "next/link"
import { useAuth } from "@clerk/nextjs"
import TypewriterComponent from "typewriter-effect"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const font = Montserrat({ weight: "600", subsets: ["latin"] })

export function LandingHero() {
  const { isSignedIn } = useAuth()
  return (
    <div
      className={cn(
        font.className,
        "text-white font-bold py-36 text-center space-y-5"
      )}>
      <div className='text-4xl sm:text-5xl md:text-6xl lg:text-7xl space-y-5'>
        <h1>A Simple Mongo</h1>
        <p>for</p>
        <div className='text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600'>
          <TypewriterComponent
            options={{
              strings: ["fileStore", "manage", "fileShare","APIs"],
              autoStart: true,
              loop: true,
            }}
          />
        </div>
      </div>
      <div className='text-sm md:text-xl font-light text-zinc-400'>
        Make them EASY to reach.
      </div>
      <div>
        <Link href={isSignedIn ? "/dashboard" : "/sign-in"}>
          <Button className='md:text-lg p-4 md:p-6 rounded-full font-semibold w-fit'>
            Start NOW!
          </Button>
        </Link>
      </div>
      <div className='text-zinc-400 text-xs md:text-sm font-normal'>
        use VPS and docker to serve.
      </div>
    </div>
  )
}
