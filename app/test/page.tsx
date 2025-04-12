"use client"

import { useState, useEffect } from "react"
import { Dashboard } from "../../components/dashboard/dashboard"

export default function TestPage() {
  const [mockTelegramId, setMockTelegramId] = useState<string>("")
  const [showDashboard, setShowDashboard] = useState(false)
  const [apiStatus, setApiStatus] = useState<string>("Checking...")

  // Check API status on load
  useEffect(() => {
    const checkApi = async () => {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || "https://whalebux-vercel.onrender.com/api"
        const response = await fetch(`${apiUrl.replace(/\/api$/, "")}/health`, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        })

        if (response.ok) {
          const data = await response.json()
          setApiStatus(`Connected: ${data.status}, MongoDB: ${data.mongodb}`)
        } else {
          setApiStatus(`Error: ${response.status} ${response.statusText}`)
        }
      } catch (error) {
        setApiStatus(`Connection failed: ${error instanceof Error ? error.message : String(error)}`)
      }
    }

    checkApi()
  }, [])

  // Mock the Telegram WebApp for testing
  const setupMockTelegram = (telegramId: number) => {
    if (typeof window !== "undefined") {
      // Create mock Telegram WebApp object
      window.Telegram = {
        WebApp: {
          initDataUnsafe: {
            user: {
              id: telegramId,
              first_name: "Test",
              last_name: "User",
              username: "testuser",
            },
          },
          ready: () => console.log("Mock Telegram WebApp ready"),
          expand: () => console.log("Mock Telegram WebApp expanded"),
        },
      }

      setShowDashboard(true)
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      {!showDashboard ? (
        <div className="bg-gray-800 rounded-lg p-6 w-full max-w-md">
          <h1 className="text-2xl font-bold text-white mb-6">WhaleBux Test Mode</h1>

          <div className="mb-6 p-3 bg-gray-700 rounded text-sm">
            <p className="text-white font-semibold">API Status:</p>
            <p className={`${apiStatus.includes("Connected") ? "text-green-400" : "text-red-400"}`}>{apiStatus}</p>
            <p className="text-gray-400 mt-2">
              API URL: {process.env.NEXT_PUBLIC_API_URL || "Not set (using default)"}
            </p>
          </div>

          <div className="mb-4">
            <label htmlFor="telegramId" className="block text-white mb-2">
              Enter Telegram ID for testing:
            </label>
            <input
              type="number"
              id="telegramId"
              value={mockTelegramId}
              onChange={(e) => setMockTelegramId(e.target.value)}
              className="w-full p-2 bg-gray-700 border border-gray-600 rounded text-white"
              placeholder="e.g. 123456789"
            />
          </div>

          <button
            onClick={() => setupMockTelegram(Number(mockTelegramId))}
            disabled={!mockTelegramId || isNaN(Number(mockTelegramId))}
            className="w-full py-2 px-4 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Launch Test Dashboard
          </button>

          <p className="mt-4 text-gray-400 text-sm">
            This page allows you to test the app outside of Telegram by mocking the Telegram WebApp object.
          </p>
        </div>
      ) : (
        <Dashboard />
      )}
    </div>
  )
}
