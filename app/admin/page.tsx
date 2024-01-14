import { UserButton, currentUser } from "@clerk/nextjs"
import { redirect } from "next/navigation"

const ADMIN_EMAIL = process.env.ADMIN_EMAIL

export default async function AdminPage() {
  const user = await currentUser()
  const isAdmin = user?.emailAddresses[0].emailAddress === ADMIN_EMAIL

  if (!isAdmin) return redirect("/dashboard")

  return (
    <div>
      AdminPage
      <UserButton afterSignOutUrl='/' showName />
    </div>
  )
}
