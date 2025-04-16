import type React from "react"
import { ThemeProvider } from "../components/theme-provider"
import "./globals.css"

export const metadata = {
  title: "WhaleBux",
  description: "Telegram Mini App for WhaleBux",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gray-950 text-white">
        <ThemeProvider attribute="class" defaultTheme="dark">
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
