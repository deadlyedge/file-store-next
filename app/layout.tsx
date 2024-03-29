import type { Metadata } from "next"
import { Nunito } from "next/font/google"
import { ClerkProvider } from "@clerk/nextjs"
import { zhCN } from "@clerk/localizations"
import { dark } from "@clerk/themes"

import "@/app/globals.css"

import { Toaster } from "@/components/ui/toaster"
import { cn } from "@/lib/utils"

const nunito = Nunito({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "File Store NextMongo",
  description: "An interface for mongo file store.",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ClerkProvider
      localization={zhCN}
      appearance={{
        baseTheme: dark,
      }}>
      <html lang='en' className='dark hide_scrollbar'>
        <body className={cn(nunito.className, "antialiased min-h-screen")}>
          {children}
          <Toaster />
        </body>
      </html>
    </ClerkProvider>
  )
}
