"use client"

import { useUserStore } from "../../lib/stores/userStore"
import { useSwapStore } from "../../lib/stores/swapStore"
import { swapConfig } from "../../config/chainConfig"

export default function SwapStats() {
  const { wbuxDollars } = useUserStore()
  const { getDailySwapAmount } = useSwapStore()
  const userId = useUserStore((state) => state.userId)

  const dailySwapAmount = userId ? getDailySwapAmount(userId) : 0
  const remainingDailyLimit = swapConfig.dailyLimit - dailySwapAmount
  const dailyLimitPercentage = Math.min(100, (dailySwapAmount / swapConfig.dailyLimit) * 100)

  return (
    <div className="bg-gray-800 rounded-lg p-6">
      <h2 className="text-xl font-semibold text-white mb-4">Swap Statistics</h2>

      <div className="space-y-6">
        <div>
          <div className="flex justify-between items-center mb-2">
            <div className="text-sm text-gray-400">WhaleBux Dollars Balance:</div>
            <div className="text-white font-medium">{wbuxDollars.toLocaleString()}</div>
          </div>
          <div className="h-2 bg-gray-700 rounded-full">
            <div
              className="h-full bg-green-600 rounded-full"
              style={{ width: `${Math.min(100, (wbuxDollars / 100000) * 100)}%` }}
            ></div>
          </div>
        </div>

        <div>
          <div className="flex justify-between items-center mb-2">
            <div className="text-sm text-gray-400">Daily Swap Limit:</div>
            <div className="text-white font-medium">
              {dailySwapAmount.toLocaleString()} / {swapConfig.dailyLimit.toLocaleString()}
            </div>
          </div>
          <div className="h-2 bg-gray-700 rounded-full">
            <div className="h-full bg-blue-600 rounded-full" style={{ width: `${dailyLimitPercentage}%` }}></div>
          </div>
          <div className="mt-1 text-xs text-gray-400">
            Remaining today: {remainingDailyLimit.toLocaleString()} WhaleBux Dollars
          </div>
        </div>

        <div className="bg-gray-700 p-4 rounded-lg">
          <div className="text-sm text-gray-400 mb-2">Current Swap Rate:</div>
          <div className="text-white font-medium">10,000 WhaleBux Dollars = 0.25 WBUX Tokens</div>
          <div className="text-xs text-gray-400 mt-1">
            (1 WBUX Token = {(1 / swapConfig.rate).toLocaleString()} WhaleBux Dollars)
          </div>
        </div>
      </div>
    </div>
  )
}
