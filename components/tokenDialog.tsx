"use client"

import { useState } from "react"
import { useUser } from "@clerk/nextjs"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { getToken } from "@/actions/token"

export const TokenDialog = () => {
  const [showToken, setShowToken] = useState("")
  const user = useUser()
  if (!user.isSignedIn) return null

  const handleMakeToken = () => getToken(true).then((res) => setShowToken(res))
  const handleGetToken = () => getToken().then((res) => setShowToken(res))

  return (
    <Dialog>
      <DialogTrigger className='text-sm'>API MENU</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>API MENU</DialogTitle>
          <DialogDescription>
            This menu will be available soon. Stay tuned! 🚀 🚀 🚀
            <br />
            <br />
            /api should be useful for upload/delete/list database, which is
            hided and replaced with server action for now. but api is definitely
            best choice for developers of course.
            <br />
            <br />
            If you only want to &quot;get&quot; the file, just copy the [url] of
            files, by click it.
            <br />
            <br />
            And add
            <code className='bg-white/20 mx-1 px-1 rounded text-nowrap'>
              ?output=json
            </code>
            at the end of urls for file info.
            <code className='bg-white/20 mx-1 px-1 rounded text-nowrap'>
              ?output=download
            </code>
            also supported.
            <br />
            <br />
            Later I will try to add token here for other functions. Like below:
            <br />
            <br />
            <span className='text=lg bg-green-300/10 rounded p-1 text-center'>
              Your
              <code className='bg-white/20 mx-1 px-1 rounded text-nowrap'>
                ?token={showToken}
              </code>
            </span>
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button type='button' onClick={handleMakeToken}>
            Make a<b className='mx-2'>NEW</b>
            token
          </Button>
          <Button type='button' onClick={handleGetToken}>
            Get
            <b className='mx-2'>LAST</b>
            token
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
