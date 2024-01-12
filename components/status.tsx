import { auth, currentUser } from "@clerk/nextjs"
import Image from "next/image"


export const Status = async () => {
  const user = await currentUser()
  const allInfo = JSON.stringify(user)
  const date = new Date(user?.createdAt!)
  const avatar = user?.imageUrl!
  const email = user?.emailAddresses[0].emailAddress!

  console.log(allInfo)
  return (
    <div className='fixed left-0 top-20 w-64 h-20 bg-white/50 p-1 text-xs text-zinc-900'>
      {user?.username}
      {date.toLocaleString()}
      <Image
        src={avatar}
        alt='profile'
        width={50}
        height={50}
      />
      {email}
    </div>
  )
}
