"use client"

import { UserButton } from "@clerk/nextjs"
import { useRouter } from "next/navigation"

import { dropDb, getDbInfos } from "@/actions/admin"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { useCallback, useEffect, useState } from "react"
import { DBInfoProps } from "@/types"

export default function AdminPage() {
  const router = useRouter()
  const [showInfo, setShowInfo] = useState<DBInfoProps[]>([])

  const getInfo = useCallback(async () => {
    const info = await getDbInfos()

    if (!info) {
      console.log("[You have to log in with Admin Email to use admin route.]")
      return router.push("/dashboard")
    }

    setShowInfo(info)
  }, [router])

  useEffect(() => {
    getInfo()
  }, [getInfo])

  const handleDelete = (dbName: string) => {
    dropDb(dbName).then(() => getInfo())
  }
  return (
    <div className='flex flex-col justify-center items-center'>
      <div className='flex flex-row justify-center items-center gap-4 my-4'>
        <Button disabled variant='default'>
          AdminPage
        </Button>
        <a href='/dashboard'>
          <Button variant='secondary'>Dashboard</Button>
        </a>
        <UserButton afterSignOutUrl='/' showName />
      </div>
      <Table>
        <TableCaption>Current File DBs</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className=''>DB Name</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className='w-20'>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {showInfo.map((db) => (
            <TableRow key={db.dbName}>
              <TableCell>{db.dbName}</TableCell>
              <TableCell>
                {db.filesCount} files, {db.chunksCount} chunks, {db.dbSize}{" "}
                total.
              </TableCell>
              <TableCell>
                <Button
                  variant='destructive'
                  onClick={() => handleDelete(db.dbName)}>
                  Delete
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
