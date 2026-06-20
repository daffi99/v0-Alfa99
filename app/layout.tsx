import type React from "react"
// <CHANGE> Updated metadata for kanban board app
import type { Metadata } from "next"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"

export const metadata: Metadata = {
  title: "Kanban Board",
  description: "Full-stack kanban board for task management",
  generator: "v0.app",
  icons: {
    icon: "/logo_kanban.png",
    apple: "/logo_kanban.png",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`font-sans antialiased`}>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
