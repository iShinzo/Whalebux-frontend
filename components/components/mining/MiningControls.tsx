"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useUserStore } from "../../lib/stores/userStore"
import { useMiningStore } from "../../lib/stores/miningStore"
import { useNFTStore } from "../../lib/stores/nftStore"
import { LEVEL_CONFIG, getLevelFromExperience } from "../../lib/config/miningConfig"

export default function MiningControls() {
  const router = useRouter()
  const { experience, loginStreak, miningRateLevel, miningBoostLevel, referralBoost } = useUserStore()
  const { isMining, currentMined, startMining, getMiningStats } = useMiningStore()
  const nftBoosts = useNFTStore((state) => {
    const userId = useUserStore.getState().userId
    return userId
      ? state.calculateTotalBoost(userId)
      : { miningRate: 0, miningTime: 0, rewardMultiplier: 0, special: 0 }
  })

  const level = getLevelFromExperience(experience)
  const config = LEVEL_CONFIG[level]
  const { totalRate, totalBoost, estimatedEarnings } = getMiningStats()

  // Clean up interval on unmount
  useEffect(() => {
    return () => {
      const { miningInterval } = useMiningStore.getState()
      if (miningInterval) {
        clearInterval(miningInterval)
      }
    }
  }, [])

  const formatMiningInfo = () => {
    if (!isMining) {
      return (
        <div className="text-center">
          <div className="text-xl font-bold">Start Mining</div>
          <div className="text-sm text-gray-400 mt-1">
            Rate: ${totalRate.toFixed(2)}/hr (+{miningRateLevel} levels)
          </div>
          <div className="text-sm text-gray-400">Boost: +{totalBoost.toFixed(0)}% total</div>
        </div>
      )
    }

    return (
      <div className="text-center">
        <div className="text-xl font-bold">Mining in progress: ${currentMined.toFixed(2)}</div>
        <div className="text-sm text-gray-400 mt-1">
          Rate: ${totalRate.toFixed(2)}/hr • Boost: +{totalBoost.toFixed(0)}%
        </div>
      </div>
    )
  }

  return (
    <div className="mt-8 w-full max-w-md">
      <button
        onClick={startMining}
        disabled={isMining}
        className={`w-full py-4 rounded-lg mb-6 ${
          isMining ? "bg-green-800 text-green-200 cursor-not-allowed" : "bg-green-600 hover:bg-green-500"
        }`}
      >
        {formatMiningInfo()}
      </button>

      <div className="flex justify-between gap-4">
        <button
          onClick={() => router.push("/daily-streak")}
          className="flex-1 bg-yellow-600 p-3 rounded-lg text-center hover:bg-yellow-500"
        >
          <div className="text-sm">Daily</div>
          <div className="text-xl font-bold">Streak</div>
        </button>

        <button
          onClick={() => router.push("/boost")}
          className="flex-1 bg-blue-600 p-3 rounded-lg text-center hover:bg-blue-500"
        >
          <div className="text-sm">Boost</div>
          <div className="text-xl font-bold">Upgrade</div>
        </button>

        <button
          onClick={() => router.push("/nft")}
          className="flex-1 bg-purple-600 p-3 rounded-lg text-center hover:bg-purple-500"
        >
          <div className="text-sm">NFT</div>
          <div className="text-xl font-bold">Boosts</div>
        </button>
      </div>
    </div>
  )
}
