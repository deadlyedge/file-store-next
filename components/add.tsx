"use client"

import { useTransition } from "react"
import { useDropzone } from "react-dropzone"
import { BeatLoader } from "react-spinners"

import { upload } from "@/actions/upload"
import { logger } from "@/lib/utils"

type AddProps = {
  getData: () => Promise<void>
}

export const Add = ({ getData }: AddProps) => {
  const [isPending, startTransition] = useTransition()

  // USE SERVER ACTIONS
  const onDrop = (acceptedFiles: any) => {
    const formData = new FormData()
    const files: File[] = Array.from(acceptedFiles ?? [])
    for (const file of files) {
      formData.append(file.name, file)
    }

    startTransition(() => {
      upload(formData)
        .then((res) => {
          logger(res)
        })
        .finally(getData)
    })
  }

  // USE API route
  // const onDrop = (acceptedFiles: any) => {
  //   const formData = new FormData()
  //   const files: File[] = Array.from(acceptedFiles ?? [])
  //   for (const file of files) {
  //     formData.append(file.name, file)
  //   }

  //   startTransition(() => {
  //     axios.post("/api/upload", formData).then(() => {
  //       getData()
  //     })
  //   })
  // }

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
  })

  return (
    <div className=''>
      <div
        {...getRootProps()}
        className='fixed left-0 top-0 z-50 w-2/3 sm:w-48 lg:w-96 h-20 flex flex-row sm:flex-col lg:flex-row justify-center items-center border-2 border-dashed text-zinc-800 bg-gray-100 rounded bg-opacity-50 cursor-pointer group hover:bg-opacity-90 duration-200 uppercase'>
        <div className='flex-auto text-center text-lg '>Drop Files Here</div>
        <div className='flex-init'>
          <input {...getInputProps()} />
          <svg
            className='w-8 h-8 mx-auto rotate-45 text-blue-500 group-hover:rotate-[135deg] group-hover:text-lime-500 duration-200'
            fill='currentColor'
            viewBox='7 2 10 20'
            xmlns='http://www.w3.org/2000/svg'>
            <path d='M13.41 12l4.3-4.29a1 1 0 1 0-1.42-1.42L12 10.59l-4.29-4.3a1 1 0 0 0-1.42 1.42l4.3 4.29-4.3 4.29a1 1 0 0 0 0 1.42 1 1 0 0 0 1.42 0l4.29-4.3 4.29 4.3a1 1 0 0 0 1.42 0 1 1 0 0 0 0-1.42z'></path>
          </svg>
        </div>
        <div className='flex-auto ml-5 sm:ml-0 lg:ml-5 text-sm'>
          click to select
        </div>
      </div>
      {isPending && (
        <div className='fixed w-full h-full flex justify-center items-center bg-black/50'>
          <BeatLoader color='#2F80ED' />
        </div>
      )}
    </div>
  )
}
