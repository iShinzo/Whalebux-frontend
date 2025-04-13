"use client"

import { useRouter } from "next/navigation"
import { useUserStore } from "../../lib/stores/userStore"
import { useMiningStore } from "../../lib/stores/miningStore"
import MiningControls from "../../components/mining/MiningControls"
import MiningProgress from "../../components/mining/MiningProgress"
import MiningStats from "../../components/mining/MiningStats"
import { getLevelFromExperience } from "../../lib/config/miningConfig"

export default function MiningPage() {
  const router = useRouter()
  const { experience, firstName } = useUserStore()
  const { isMining } = useMiningStore()

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

        <MiningStats />

        {isMining && <MiningProgress />}

        <MiningControls />
      </div>
    </div>
  )
}
