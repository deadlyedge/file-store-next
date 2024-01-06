"use client"

import { useCallback } from "react"
import { useDropzone } from "react-dropzone"

type DropFileProps = {
  children: React.ReactNode
}

export function DropFile({ children }: DropFileProps) {
  const onDrop = useCallback((acceptedFiles: any) => {
    // Do something with the files
    // console.log(acceptedFiles)
    acceptedFiles.forEach((file: any) => {
      const reader = new FileReader()
      reader.onabort = () => console.log("file reading was aborted")
      reader.onerror = () => console.log("file reading has failed")
      reader.onload = () => {
        // Do whatever you want with the file contents
        const binaryStr = reader.result
        console.log(binaryStr)
      }
      reader.readAsArrayBuffer(file)
    })
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
