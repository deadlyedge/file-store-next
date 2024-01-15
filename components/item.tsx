"use client"

import { useState } from "react"
import Image from "next/image"
import { FileBox, FileCode2, FileText } from "lucide-react"

import { FileInfoProps } from "@/types"
import { cn, formatBytes, delay, encodeStrings } from "@/lib/utils"
import { useToast } from "@/components/ui/use-toast"

type ItemProps = {
  params: FileInfoProps
  handleSelect: (id: string) => void
}

export const Item = ({ params, handleSelect }: ItemProps) => {
  const [isCopied, setIsCopied] = useState(false)
  const { toast } = useToast()

  const fileId = encodeStrings({
    fileId: params.id,
    collectionName: params.collectionName,
  })
  const baseUrl = params.baseUrl
  const imagePath = `/get/${fileId}`

  const showInfo = {
    filename: params.filename,
    imageUrl: `${baseUrl}${imagePath}`,
    fileSize: formatBytes(params.size),
    days: Math.floor(params.deltaTime / 86400),
    downloadUrl: `${imagePath}?output=download`,

    isImage: params.filename.match(/\.(jpg|jpeg|png|gif)$/i),
    isPDF: params.filename.match(/\.(pdf)$/i),
    isZip: params.filename.match(/\.(zip|7z|gz)$/i),
  }

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
        "flex flex-col outline shadow-md text-zinc-700 text-xs m-2 p-2 w-72 hover:outline-blue-300 hover:outline-4 transition-all",
        params.selected ? "bg-zinc-300/50" : "bg-white"
      )}>
      {showInfo.isImage && (
        <Image
          src={imagePath}
          alt={showInfo.filename}
          width={320}
          height={320}
          sizes='(max-width: 768px) 100vw, (max-width: 1200px) 60vw, 50vw'
          className='w-fit'
        />
      )}
      {showInfo.isPDF && <FileText className='w-20 h-20 mx-auto' />}
      {showInfo.isZip && <FileBox className='w-20 h-20 mx-auto' />}
      {!showInfo.isImage && !showInfo.isPDF && !showInfo.isZip && (
        <FileCode2 className='w-20 h-20 mx-auto' />
      )}
      <p className='truncate'>
        Filename:
        <code className='bg-zinc-200 px-1 rounded'>{params.filename}</code>
      </p>
      <p className='truncate rounded hover:ring-1 hover:ring-orange-500 transition-all'>
        url:
        <code
          className={cn(
            "px-1 rounded",
            isCopied ? "bg-emerald-300 " : "bg-zinc-200"
          )}
          onClick={() => copyText(showInfo.imageUrl)}>
          {showInfo.imageUrl}
        </code>
      </p>
      <p>
        Size:
        <code className='bg-zinc-200 px-1 rounded'>{showInfo.fileSize}</code>
      </p>
      <p>
        Exist:
        <code className='bg-zinc-200 px-1 rounded'>{showInfo.days} days</code>
      </p>
      <p>
        <a href={showInfo.downloadUrl} target='_blank'>
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
          className='w-5 h-5 mt-1 rounded-lg float-right accent-red-500 hover:outline-2 hover:outline hover:outline-offset-2 hover:outline-red-600 transition-all'></input>
      </p>
    </div>
  )
}
