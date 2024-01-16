"use client"

import { UserButton } from "@clerk/nextjs"
import { useRouter } from "next/navigation"
import { useCallback, useEffect, useState } from "react"
import { Trash2 } from "lucide-react"

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
import { DBInfoProps } from "@/types"
import { logger } from "@/lib/utils"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

export default function AdminPage() {
  const router = useRouter()
  const [showInfo, setShowInfo] = useState<DBInfoProps[]>([])

  const getInfo = useCallback(async () => {
    const info = await getDbInfos()

    if (!info) {
      logger("[You have to log in with Admin Email to use admin route.]")
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
            <TableHead>DB Name</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className='w-20'>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {showInfo.map((db) => (
            <TableRow key={db.dbName}>
              <TableCell className='break-all'>{db.dbName}</TableCell>
              <TableCell>
                {db.filesCount} files, {db.chunksCount} chunks, {db.dbSize}{" "}
                total.
              </TableCell>
              <TableCell>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant='destructive'>Delete</Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Delete Collection</DialogTitle>
                      <DialogDescription>
                        Please confirm you want to DELETE entire collection of
                        <br />
                        <code className='text-lg bg-white/20 rounded-lg ml-8 py-1 px-2'>
                          {db.dbName}
                        </code>
                        <br />
                        All Files of that use in this database will be remove.
                      </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                      <Button
                        variant='destructive'
                        onClick={() => handleDelete(db.dbName)}>
                        <Trash2 className="mr-2 w-4 h-4" />Delete
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
