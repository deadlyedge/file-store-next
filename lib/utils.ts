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
export const getCollectionName = async () => {
  const user = await currentUser()

  if (!user) {
    console.log("no user found.")
    return redirect("/sign-in")
  }

  const email = user.emailAddresses[0].emailAddress

  if (!email) {
    console.log("no email found. something wrong.")
    return redirect("/sign-in")
  }

  const collectionName = email.replace(".", "_")

  return { collectionName }
}

/**
 * encode fileId and collectionName to a uri safe string.
 * @param {fileId: string, collectionName: string}
 * @returns
 */
export const encodeStrings = ({
  fileId,
  collectionName,
}: {
  fileId: string
  collectionName: string
}): string => {
  const combinedString = `${fileId},${collectionName}`
  return encodeURIComponent(combinedString)
}

/**
 * decode uri safe string to fileId and collectionName.
 * @param encodedStr
 * @returns {fileId: string, collectionName: string}
 */
export const decodeString = (
  encodedStr: string
): { fileId: string; collectionName: string } => {
  const combinedString = decodeURIComponent(encodedStr)
  const [fileId, collectionName] = combinedString.split(",")
  return { fileId, collectionName }
}
