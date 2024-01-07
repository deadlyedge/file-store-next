"use client"

import axios from "axios"
import { useEffect, useState } from "react"

import { Add } from "./add"
import { Item } from "./item"
import { FileInfoProps } from "@/types"

export function List() {
  const [fileList, setFileList] = useState<FileInfoProps[]>([])

  const getData = async () => {
    const res = await axios.get("/api/list")
    setFileList(res.data)
  }

  const selected = fileList
    .filter((file) => file.selected)
    .map((file) => file.id)

  const handleSelect = (id: string) => {
    setFileList(
      fileList.map((file) =>
        file.id === id ? { ...file, selected: !file.selected } : file
      )
    )
  }

  const handleDelete = async () => {
    await axios.post("/api/delete", { fileIds: selected })
    getData()
  }

  useEffect(() => {
    getData()
  }, [])

  return (
    <>
      <div className='fixed left-0 top-0 z-50 flex bg-gray-800 bg-opacity-70'>
        <Add getData={getData} />
      </div>

      <div className='flex flex-wrap items-start mt-40 pt-2'>
        {fileList.map((file: FileInfoProps, index) => (
          <Item key={index} params={file} handleSelect={handleSelect} />
        ))}
        {selected.length > 0 && (
          <div className='fixed w-20 top-5 left-48 block z-40'>
            <button
              className='bg-red-400 p-3 shadow-md transition duration-500 hover:scale-125 hover:bg-red-600 hover:text-white focus:ring-4 focus:ring-blue-300 font-bold rounded-lg text-sm px-5 py-2.5'
              type='button'
              onClick={handleDelete}>
              Delete THEM!
            </button>
          </div>
        )}
      </div>
    </>
  )
}
