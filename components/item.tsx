"use client"

import { useState } from "react"
import Image from "next/image"
import { FileBox, FileCode2, FileText } from "lucide-react"

import { FileInfoProps } from "@/types"
import { cn, formatBytes, delay } from "@/lib/utils"
import { useToast } from "./ui/use-toast"

type ItemProps = {
  params: FileInfoProps
  handleSelect: (id: string) => void
}

export const Item = ({ params, handleSelect }: ItemProps) => {
  const [isCopied, setIsCopied] = useState(false)
  const {toast} = useToast()

  const base_url = params.base_url
  const image_path = `/get/${params.id}`
  const image_url = `${base_url}${image_path}`
  const days = Math.floor(params.delta_time / 86400)
  const file_size = formatBytes(params.size)
  const isImage = params.filename.match(/\.(jpg|jpeg|png|gif)$/i)
  const isPDF = params.filename.match(/\.(pdf)$/i)
  const isZip = params.filename.match(/\.(zip|7z|gz)$/i)

  if (!params.selected) params.selected = false

  const copyText = (text: string) => {
    navigator.clipboard.writeText(text)
    setIsCopied(true)
    toast({
      title: "Link Copied",
      description: text,
    })
    delay(2000).then(() => setIsCopied(false))
  }

  return (
    <div
      className={cn(
        "flex flex-col outline shadow-md text-zinc-700 text-xs m-2 p-2 w-72 hover:outline-blue-300 hover:outline-2 transition-transform",
        params.selected ? "bg-zinc-300/50" : "bg-white"
      )}>
      {isImage && (
        <Image
          src={image_path}
          alt={params.filename}
          width={320}
          height={320}
          sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
          className='w-fit'
        />
      )}
      {isPDF && <FileText className='w-20 h-20 mx-auto' />}
      {isZip && <FileBox className='w-20 h-20 mx-auto' />}
      {!isImage && !isPDF && !isZip && (
        <FileCode2 className='w-20 h-20 mx-auto' />
      )}
      <p className='overflow-hidden text-ellipsis hover:overflow-visible'>
        Filename:
        <code className='bg-zinc-200 px-1 rounded'>{params.filename}</code>
      </p>
      <p className='w-64 overflow-hidden text-ellipsis hover:overflow-visible'>
        url:
        <code
          className={cn(
            "px-1 rounded",
            isCopied ? "bg-emerald-300 " : "bg-zinc-200"
          )}
          onClick={() => copyText(image_url)}>
          {image_url}
        </code>
      </p>
      <p>
        Size:
        <code className='bg-zinc-200 px-1 rounded'>{file_size}</code>
      </p>
      <p>
        Exsist time:
        <code className='bg-zinc-200 px-1 rounded'>{days} days</code>
      </p>
      <p>
        <a href={`${image_path}?output=download`} target='_blank'>
          <button className='rounded h-5 mt-1 bg-sky-200 hover:bg-orange-300 px-2'>
            Download
          </button>
        </a>
        <input
          type='checkbox'
          id={params.id}
          name={params.id}
          checked={params.selected}
          onChange={() => handleSelect(params.id)}
          className='w-5 h-5 mt-1 rounded-lg float-right accent-red-500'></input>
      </p>
    </div>
  )
}
