"use client"

import { useEffect } from "react"
import { useTelegramWebApp } from "../lib/telegram-init"
import { Dashboard } from "../components/dashboard/dashboard"

export default function Home() {
  const telegramWebApp = useTelegramWebApp()

  useEffect(() => {
    console.log("Page component mounted")
    console.log("Environment:", process.env.NODE_ENV)
    console.log("API URL:", process.env.NEXT_PUBLIC_API_URL)

    // Check if we're in the Telegram environment
    if (typeof window !== "undefined") {
      if (window.Telegram?.WebApp) {
        console.log("Running inside Telegram WebApp")
      } else {
        console.log("Not running inside Telegram WebApp")
      }
    }
  }, [])

  // If we're not in Telegram, show a message
  if (!telegramWebApp && typeof window !== "undefined") {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <h1 className="text-3xl font-bold text-white mb-4">WhaleBux</h1>
        <p className="text-white mb-4">This app is designed to run inside Telegram.</p>
        <p className="text-white mb-4">Please open it from your Telegram bot.</p>

        {/* For development/testing, add a button to load the actual app */}
        <button
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg"
          onClick={() => {
            // Force load the app for testing
            window.location.href = "/?forceLoad=true"
          }}
        >
          Load App Anyway (Development Only)
        </button>
      </div>
    )
  }

  // Check if we should force load the app (for development)
  const shouldForceLoad =
    typeof window !== "undefined" &&
    (window.location.search.includes("forceLoad=true") || process.env.NODE_ENV === "development")

  // If we're in Telegram or forcing load, show the actual app
  if (telegramWebApp || shouldForceLoad) {
    return <Dashboard />
  }

  // Loading state
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
    </div>
  )
}

