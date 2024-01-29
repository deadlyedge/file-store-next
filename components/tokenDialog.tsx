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
import { useToast } from "@/components/ui/use-toast"
import { cn, delay } from "@/lib/utils"

export const TokenDialog = () => {
  const [showToken, setShowToken] = useState("")
  const [isCopied, setIsCopied] = useState(false)
  const { toast } = useToast()

  const user = useUser()
  if (!user.isSignedIn) return null

  const handleMakeToken = () => getToken(true).then((res) => setShowToken(res))
  const handleGetToken = () => getToken().then((res) => setShowToken(res))

  const copyText = (text: string) => {
    navigator.clipboard.writeText(text)
    setIsCopied(true)
    toast({
      title: "Token Copied",
      description: text,
    })
    delay(2000).then(() => setIsCopied(false))
  }

  return (
    <Dialog>
      <DialogTrigger className='text-sm'>API MENU</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>API MENU</DialogTitle>
          <DialogDescription>
            /api is useful for upload/delete/list database, and is definitely
            best choice for developers.
            <br />
            <br />
            If you only want to &quot;get&quot; the file, just copy the [url] of
            files, by click it.
            <br />
            <br />
            And add
            <code className='bg-white/20 mx-1 px-1 rounded text-nowrap'>
              /json
            </code>
            at the end of short urls for file info.
            <code className='bg-white/20 mx-1 px-1 rounded text-nowrap'>
              /download
            </code>
            also supported.
            <br />
            <br />
            <span className='text=lg rounded p-1 text-center outline-none hover:outline-offset-1 hover:outline-2 hover:outline-orange-500 transition-all'>
              Your token is:{" "}
              <code
                className={cn(
                  "bg-white/20 mx-1 px-1 rounded text-nowrap",
                  isCopied ? "bg-emerald-700 " : "bg-white/20"
                )}
                onClick={() => copyText(showToken)}>
                {showToken}
              </code>
            </span>
            <br />
            <br />
            So the api url should look like:
            <code className='bg-white/20 mx-1 px-1 rounded'>
              http://localhost:3000/api/list?token={showToken}
            </code>
            <br />
            <br />
            For more api usage, please try
            <a href='https://github.com/deadlyedge/file-store-next/blob/master/README.md'>
              {" "}
              README.md{" "}
            </a>
            file at github.
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
