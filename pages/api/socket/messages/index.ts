import { NextApiRequest } from "next"

import { NextApiResponseServerIO } from "@/types"
import { currentUser } from "@clerk/nextjs"
import { getAuth } from "@clerk/nextjs/server"

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponseServerIO
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" })
  }

  const { message } = req.body

  try {
    const outMessage = "been touched! " + message + " by "

    res?.socket?.server?.io?.emit("message", outMessage)

    return res.status(200).json(outMessage)
  } catch (error) {
    console.log("[MESSAGES_POST]", error)
    return res.status(500).json({ message: "Internal Error" })
  }
}
