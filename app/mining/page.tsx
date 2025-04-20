"use client"

import { useRouter } from "next/navigation"
import { useState } from "react"
import { useUserStore } from "../../lib/stores/userStore"
import { useMiningStore } from "../../lib/stores/miningStore"
import { userApi } from "../../lib/api-service"
import MiningControls from "../../components/mining/MiningControls"
import MiningProgress from "../../components/mining/MiningProgress"
import MiningStats from "../../components/mining/MiningStats"
import { getLevelFromExperience } from "../../lib/config/miningConfig"

export default function MiningPage() {
  const router = useRouter()
  const { experience, firstName } = useUserStore()
  const { isMining } = useMiningStore()

  const [refreshing, setRefreshing] = useState(false)
  const telegramId = useUserStore((state) => state.telegramId)
  const setUser = useUserStore((state) => state.setUser)

  async function handleRefresh() {
    if (!telegramId) return
    setRefreshing(true)
    try {
      const freshUser = await userApi.getUserData(telegramId)
      setUser(freshUser)
    } catch (e) {
      // Optionally show error
    }
    setRefreshing(false)
  }

  const level = getLevelFromExperience(experience)

  return (
    <div className="min-h-screen bg-gray-900 pb-20">
      <div className="max-w-md mx-auto p-4">
        <div className="flex items-center mb-6">
          <button onClick={() => router.push("/")} className="text-gray-400 hover:text-white mr-4">
            ← Back
          </button>
          <h1 className="text-2xl font-bold text-white">Mining Center</h1>
        </div>

        <div className="bg-gray-800 rounded-lg p-4 mb-6">
          <h2 className="text-xl font-semibold text-white mb-2">Welcome, {firstName || "Miner"}!</h2>
          <p className="text-gray-300">
            You are currently at Level {level}. Mine WhaleBux Dollars by clicking the button below.
          </p>
        </div>

        <button
          className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded mb-4"
          onClick={handleRefresh}
          disabled={refreshing}
        >
          {refreshing ? "Refreshing..." : "Refresh User Data"}
        </button>

        <MiningStats />

        {isMining && <MiningProgress />}

        <MiningControls />
      </div>
    </div>
  )
}
