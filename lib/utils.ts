import { currentUser } from "@clerk/nextjs"
import { type ClassValue, clsx } from "clsx"
import { redirect } from "next/navigation"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Little delay util.
 * @param ms
 * @returns a custom delay Promise
 */
export const delay = (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms))

/**
 * transform number to a string like 'MB, KB...'
 * @param bytes
 * @param decimals
 * @returns {string}
 */
export const formatBytes = (bytes: number, decimals = 1) => {
  if (!+bytes) return "0 Bytes"

  const k = 1024
  const dm = decimals < 0 ? 0 : decimals
  const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"]

  const i = Math.floor(Math.log(bytes) / Math.log(k))

  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`
}

/**
 * get user email from current user and then
 * transform it to collection name for mongo.
 * @returns user email
 */
export const getDatabaseName = async () => {
  const user = await currentUser()

  if (!user) {
    logger("no user found.")
    return redirect("/sign-in")
  }

  const email = user.emailAddresses[0].emailAddress

  if (!email) {
    logger("no email found. something wrong.")
    return redirect("/sign-in")
  }

  const databaseName = email.replace(".", "_")

  return { databaseName }
}

/**
 * encode fileId and databaseName to a uri safe string.
 * @param {fileId: string, databaseName: string}
 * @returns
 */
export const encodeStrings = ({
  fileId,
  databaseName,
}: {
  fileId: string
  databaseName: string
}): string => {
  const combinedString = `${fileId},${databaseName}`
  return encodeURIComponent(combinedString)
}

/**
 * decode uri safe string to fileId and databaseName.
 * @param encodedStr
 * @returns {fileId: string, databaseName: string}
 */
export const decodeString = (
  encodedStr: string
): { fileId: string; databaseName: string } => {
  const combinedString = decodeURIComponent(encodedStr)
  const [fileId, databaseName] = combinedString.split(",")
  return { fileId, databaseName }
}

/**
 * make a logger
 */
export const logger = (...args: any[]) => {
  console.log(new Date().toLocaleString(), " - ", ...args)
}

