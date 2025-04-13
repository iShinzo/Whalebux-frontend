"use client"

import { useEffect, useState } from "react"
import { useMiningStore } from "../../lib/stores/miningStore"

export default function MiningProgress() {
  const { isMining, getMiningProgress, getRemainingMiningTime, stopMining } = useMiningStore()
  const [progress, setProgress] = useState(0)
  const [timeRemaining, setTimeRemaining] = useState(0)

  useEffect(() => {
    // Update progress and time remaining every second
    const interval = setInterval(() => {
      if (isMining) {
        setProgress(getMiningProgress())
        setTimeRemaining(getRemainingMiningTime())
      }
    }, 1000)

    return () => clearInterval(interval)
  }, [isMining, getMiningProgress, getRemainingMiningTime])

  // Format time remaining as mm:ss
  const formatTimeRemaining = () => {
    const totalSeconds = Math.ceil(timeRemaining / 1000)
    const minutes = Math.floor(totalSeconds / 60)
    const seconds = totalSeconds % 60
    return `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`
  }

  if (!isMining) {
    return null
  }

  return (
    <div className="w-full max-w-md bg-gray-800 rounded-lg p-4 mb-6">
      <div className="flex justify-between items-center mb-2">
        <div className="text-white font-medium">Mining Progress</div>
        <div className="text-white">{formatTimeRemaining()} remaining</div>
      </div>

      <div className="w-full bg-gray-700 rounded-full h-4">
        <div
          className="bg-green-600 h-4 rounded-full transition-all duration-1000 ease-linear"
          style={{ width: `${progress}%` }}
        ></div>
      </div>

      <div className="mt-4 flex justify-end">
        <button onClick={() => stopMining(true)} className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white rounded">
          Collect Early
        </button>
      </div>
    </div>
  )
}
