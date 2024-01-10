"use client"

import axios from "axios"
import { useCallback } from "react"
import { useDropzone } from "react-dropzone"

import { delay } from "@/lib/utils"

type DropFileProps = {
  children: React.ReactNode
}

export const DropFile = ({ children }: DropFileProps) => {
  const onDrop = useCallback((acceptedFiles: any) => {
    // Do something with the files
    acceptedFiles.forEach(async (file: File) => {
      // upload file to mongodb
      const formData = new FormData()
      formData.append("file", file)
      await axios.post("/api/upload", formData)
    })
    delay(1000).then(() => window.location.reload())
  }, [])
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
  })

  return (
    <div {...getRootProps()}>
      <input {...getInputProps()} />
      {children}
    </div>
  )
}
