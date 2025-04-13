"use client"

import { useRouter } from "next/navigation"
import { useUserStore } from "../../lib/stores/userStore"
import { calculateLoginStreakBoost } from "../../lib/config/miningConfig"
import { useEffect, useMemo } from "react"

// Day Component to render individual day
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
      aria-label={`Day ${day}${isToday ? " (Today)" : ""}${isBoostDay ? " (Boost Day)" : ""}`}
    >
      {day}
      {isBoostDay && <div className="absolute -top-1 -right-1 w-4 h-4 bg-yellow-500 rounded-full" />}
    </div>
  )
}

// RewardCard Component to render streak rewards
interface RewardCardProps {
  streakDay: number
  miningBoost: number
  isActive: boolean
}

function RewardCard({ streakDay, miningBoost, isActive }: RewardCardProps) {
  return (
    <div
      className={`bg-gray-700 rounded-lg p-4 flex justify-between items-center ${
        isActive ? "ring-2 ring-green-500" : ""
      }`}
      aria-label={`${streakDay} Days Streak Reward`}
    >
      <span className="text-white">{streakDay} Days Streak</span>
      <div className="flex items-center gap-2">
        <span className="text-green-500 font-medium">+{miningBoost}% Mining Boost</span>
        {isActive && (
          <span className="bg-green-500 text-white text-xs px-2 py-0.5 rounded">Active</span>
        )}
      </div>
    </div>
  )
}

// Main DailyStreak Component
export default function DailyStreak() {
  const router = useRouter()
  const { loginStreak } = useUserStore()

  // Generate the days array (1 to 28)
  const days = useMemo(() => Array.from({ length: 28 }, (_, i) => i + 1), [])

  // Calculate current mining boost based on login streak
  const currentBoost = useMemo(() => calculateLoginStreakBoost(loginStreak), [loginStreak])

  // Determine if a day is a boost day
  const isBoostDay = (day: number) => day % 7 === 0 // Every 7th day is a boost day

  // Sync data with backend when component mounts (placeholder for real backend sync)
  useEffect(() => {
    // Fetch user data from the backend and update the store if needed
  }, [])

  return (
    <div className="min-h-screen bg-gray-900 p-4">
      <div className="max-w-md mx-auto">
        {/* Header Section */}
        <div className="flex items-center mb-6">
          <button
            onClick={() => router.push("/")}
            className="text-gray-400 hover:text-white mr-4"
            aria-label="Go back to home"
          >
            ← Back
          </button>
          <h1 className="text-2xl font-bold text-white">Daily Login Streak</h1>
        </div>

        {/* Streak Information Section */}
        <div className="bg-gray-800 rounded-lg p-6 mb-6">
          <div className="text-center mb-6">
            <div className="text-4xl font-bold text-green-500 mb-2">{loginStreak}</div>
            <div className="text-gray-400">Current Streak Days</div>
            {currentBoost > 0 && <div className="mt-2 text-green-500">Active Boost: +{currentBoost}%</div>}
          </div>

          {/* Days Grid */}
          <div
            className="grid grid-cols-7 gap-3 mb-6"
            role="grid"
            aria-label="Daily Streak Calendar"
          >
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

          {/* Rewards Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white mb-3">Streak Rewards</h3>
            <RewardCard streakDay={7} miningBoost={5} isActive={loginStreak >= 7} />
            <RewardCard streakDay={14} miningBoost={10} isActive={loginStreak >= 14} />
            <RewardCard streakDay={21} miningBoost={15} isActive={loginStreak >= 21} />
            <RewardCard streakDay={28} miningBoost={25} isActive={loginStreak >= 28} />
          </div>
        </div>
      </div>
    </div>
  )
}
