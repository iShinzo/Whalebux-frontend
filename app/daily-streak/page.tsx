"use client"

import { useRouter } from "next/navigation"
import { useUserStore } from "../../lib/stores/userStore"
import { calculateLoginStreakBoost } from "../../lib/config/miningConfig"
import { useEffect } from "react"

interface DayProps {
  day: number
  isActive: boolean
  isToday: boolean
  isBoostDay: boolean
}

function Day({ day, isActive, isToday, isBoostDay }: DayProps) {
  return (
    <div
      className={`w-12 h-12 rounded-full flex items-center justify-center text-lg relative ${
        isActive ? "bg-green-600 text-white" : "bg-gray-700 text-gray-400"
      } ${isToday ? "ring-2 ring-blue-500 ring-offset-2 ring-offset-gray-900" : ""}`}
    >
      {day}
      {isBoostDay && <div className="absolute -top-1 -right-1 w-4 h-4 bg-yellow-500 rounded-full" />}
    </div>
  )
}

export default function DailyStreak() {
  const router = useRouter()
  const { loginStreak } = useUserStore()
  const days = Array.from({ length: 28 }, (_, i) => i + 1)
  const currentBoost = calculateLoginStreakBoost(loginStreak)

  const isBoostDay = (day: number) => {
    return day % 7 === 0 // Every 7th day is a boost day
  }

  // Sync with backend data when component mounts
  useEffect(() => {
    // This would typically fetch the user data from your backend
    // and update the store with the latest login streak
    // For now, we'll use the data from the store
  }, [])

  return (
    <div className="min-h-screen bg-gray-900 p-4">
      <div className="max-w-md mx-auto">
        <div className="flex items-center mb-6">
          <button onClick={() => router.push("/")} className="text-gray-400 hover:text-white mr-4">
            ← Back
          </button>
          <h1 className="text-2xl font-bold text-white">Daily Login Streak</h1>
        </div>

        <div className="bg-gray-800 rounded-lg p-6 mb-6">
          <div className="text-center mb-6">
            <div className="text-4xl font-bold text-green-500 mb-2">{loginStreak}</div>
            <div className="text-gray-400">Current Streak Days</div>
            {currentBoost > 0 && <div className="mt-2 text-green-500">Active Boost: +{currentBoost}%</div>}
          </div>

          <div className="grid grid-cols-7 gap-3 mb-6">
            {days.map((day) => (
              <Day
                key={day}
                day={day}
                isActive={day <= loginStreak}
                isToday={day === loginStreak}
                isBoostDay={isBoostDay(day)}
              />
            ))}
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white mb-3">Streak Rewards</h3>
            <div
              className={`bg-gray-700 rounded-lg p-4 flex justify-between items-center ${
                loginStreak >= 7 ? "ring-2 ring-green-500" : ""
              }`}
            >
              <span className="text-white">7 Days Streak</span>
              <div className="flex items-center gap-2">
                <span className="text-green-500 font-medium">+5% Mining Boost</span>
                {loginStreak >= 7 && (
                  <span className="bg-green-500 text-white text-xs px-2 py-0.5 rounded">Active</span>
                )}
              </div>
            </div>
            <div
              className={`bg-gray-700 rounded-lg p-4 flex justify-between items-center ${
                loginStreak >= 14 ? "ring-2 ring-green-500" : ""
              }`}
            >
              <span className="text-white">14 Days Streak</span>
              <div className="flex items-center gap-2">
                <span className="text-green-500 font-medium">+10% Mining Boost</span>
                {loginStreak >= 14 && (
                  <span className="bg-green-500 text-white text-xs px-2 py-0.5 rounded">Active</span>
                )}
              </div>
            </div>
            <div
              className={`bg-gray-700 rounded-lg p-4 flex justify-between items-center ${
                loginStreak >= 21 ? "ring-2 ring-green-500" : ""
              }`}
            >
              <span className="text-white">21 Days Streak</span>
              <div className="flex items-center gap-2">
                <span className="text-green-500 font-medium">+15% Mining Boost</span>
                {loginStreak >= 21 && (
                  <span className="bg-green-500 text-white text-xs px-2 py-0.5 rounded">Active</span>
                )}
              </div>
            </div>
            <div
              className={`bg-gray-700 rounded-lg p-4 flex justify-between items-center ${
                loginStreak >= 28 ? "ring-2 ring-green-500" : ""
              }`}
            >
              <span className="text-white">28 Days Streak</span>
              <div className="flex items-center gap-2">
                <span className="text-green-500 font-medium">+25% Mining Boost</span>
                {loginStreak >= 28 && (
                  <span className="bg-green-500 text-white text-xs px-2 py-0.5 rounded">Active</span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
