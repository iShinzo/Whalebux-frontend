"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useUserStore } from "../../lib/stores/userStore"
import {
  MINING_RATE_UPGRADES,
  MINING_BOOST_UPGRADES,
  MINING_TIME_UPGRADES,
  NFT_SLOT_UPGRADES,
  getUpgradeCost,
  canAffordUpgrade,
  getMaxUpgradeLevel,
} from "../../lib/config/miningConfig"

type UpgradeType = "rate" | "boost" | "time" | "nft"

export default function BoostPage() {
  const router = useRouter()
  const { wbuxDollars, wbuxBalance, miningRateLevel, miningBoostLevel, miningTimeLevel, nftSlotLevel, setUser } =
    useUserStore()

  const [activeTab, setActiveTab] = useState<UpgradeType>("rate")
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)

  const handleUpgrade = (type: UpgradeType) => {
    let currentLevel: number
    let maxLevel: number

    switch (type) {
      case "rate":
        currentLevel = miningRateLevel
        maxLevel = MINING_RATE_UPGRADES.length
        break
      case "boost":
        currentLevel = miningBoostLevel
        maxLevel = MINING_BOOST_UPGRADES.length
        break
      case "time":
        currentLevel = miningTimeLevel
        maxLevel = MINING_TIME_UPGRADES.length
        break
      case "nft":
        currentLevel = nftSlotLevel
        maxLevel = NFT_SLOT_UPGRADES.length
        break
      default:
        return
    }

    // Check if already at max level
    if (currentLevel >= maxLevel) {
      setMessage({ type: "error", text: "Already at maximum level!" })
      return
    }

    // Get next level
    const nextLevel = currentLevel + 1

    // Check if user can afford upgrade
    if (!canAffordUpgrade(type, currentLevel, wbuxDollars, wbuxBalance)) {
      setMessage({ type: "error", text: "Cannot afford this upgrade!" })
      return
    }

    // Get upgrade cost
    const cost = getUpgradeCost(type, currentLevel)

    // Apply upgrade
    switch (type) {
      case "rate":
        setUser({
          miningRateLevel: nextLevel,
          wbuxDollars: wbuxDollars - cost.dollars,
          wbuxBalance: wbuxBalance - cost.tokens,
        })
        break
      case "boost":
        setUser({
          miningBoostLevel: nextLevel,
          wbuxDollars: wbuxDollars - cost.dollars,
          wbuxBalance: wbuxBalance - cost.tokens,
        })
        break
      case "time":
        setUser({
          miningTimeLevel: nextLevel,
          wbuxDollars: wbuxDollars - cost.dollars,
          wbuxBalance: wbuxBalance - cost.tokens,
        })
        break
      case "nft":
        setUser({
          nftSlotLevel: nextLevel,
          wbuxDollars: wbuxDollars - cost.dollars,
          wbuxBalance: wbuxBalance - cost.tokens,
        })
        break
    }

    setMessage({ type: "success", text: "Upgrade successful!" })
  }

  const renderUpgradeCard = (type: UpgradeType, title: string, description: string, currentLevel: number) => {
    const maxLevel = getMaxUpgradeLevel(type)
    const isMaxLevel = currentLevel >= maxLevel
    const nextLevel = isMaxLevel ? currentLevel : currentLevel + 1
    const cost = getUpgradeCost(type, currentLevel)
    const canAfford = canAffordUpgrade(type, currentLevel, wbuxDollars, wbuxBalance)

    let upgradeDetails = ""

    switch (type) {
      case "rate":
        upgradeDetails = `+${MINING_RATE_UPGRADES[currentLevel]?.bonus || 0} WBUX/hr`
        break
      case "boost":
        upgradeDetails = `+${MINING_BOOST_UPGRADES[currentLevel]?.bonus || 0}% boost`
        break
      case "time":
        upgradeDetails = `-${MINING_TIME_UPGRADES[currentLevel]?.bonus || 0} minutes`
        break
      case "nft":
        upgradeDetails = `+${NFT_SLOT_UPGRADES[currentLevel]?.slots || 0} slot`
        break
    }

    return (
      <div className="bg-gray-800 rounded-lg p-4 mb-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-lg font-semibold text-white">{title}</h3>
            <p className="text-gray-400 text-sm">{description}</p>
          </div>
          <div className="bg-gray-700 px-2 py-1 rounded text-white">
            Level {currentLevel}/{maxLevel}
          </div>
        </div>

        <div className="bg-gray-700 rounded-lg p-3 mb-4">
          <div className="flex justify-between items-center">
            <div>
              <div className="text-gray-400 text-xs">Current Bonus</div>
              <div className="text-white">{upgradeDetails}</div>
            </div>
            {!isMaxLevel && (
              <div>
                <div className="text-gray-400 text-xs">Next Level</div>
                <div className="text-green-400">
                  {type === "rate" && `+${MINING_RATE_UPGRADES[nextLevel - 1]?.bonus || 0} WBUX/hr`}
                  {type === "boost" && `+${MINING_BOOST_UPGRADES[nextLevel - 1]?.bonus || 0}% boost`}
                  {type === "time" && `-${MINING_TIME_UPGRADES[nextLevel - 1]?.bonus || 0} minutes`}
                  {type === "nft" && `+${NFT_SLOT_UPGRADES[nextLevel - 1]?.slots || 0} slot`}
                </div>
              </div>
            )}
          </div>
        </div>

        {!isMaxLevel && (
          <div className="flex justify-between items-center">
            <div>
              <div className="text-gray-400 text-xs">Upgrade Cost</div>
              <div className="flex items-center">
                {cost.dollars > 0 && (
                  <div className={`text-sm ${canAfford ? "text-white" : "text-red-400"}`}>
                    ${cost.dollars.toLocaleString()}
                  </div>
                )}
                {cost.tokens > 0 && (
                  <div className={`text-sm ml-2 ${canAfford ? "text-white" : "text-red-400"}`}>
                    {cost.tokens.toLocaleString()} WBUX
                  </div>
                )}
              </div>
            </div>
            <button
              onClick={() => handleUpgrade(type)}
              disabled={isMaxLevel || !canAfford}
              className={`px-4 py-2 rounded ${
                isMaxLevel
                  ? "bg-gray-600 text-gray-400 cursor-not-allowed"
                  : canAfford
                    ? "bg-green-600 hover:bg-green-500 text-white"
                    : "bg-red-900 text-red-300 cursor-not-allowed"
              }`}
            >
              {isMaxLevel ? "Maxed" : "Upgrade"}
            </button>
          </div>
        )}

        {isMaxLevel && <div className="text-center text-green-400 font-medium">Maximum level reached!</div>}
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-900 pb-20">
      <div className="max-w-md mx-auto p-4">
        <div className="flex items-center mb-6">
          <button onClick={() => router.push("/")} className="text-gray-400 hover:text-white mr-4">
            ← Back
          </button>
          <h1 className="text-2xl font-bold text-white">Mining Upgrades</h1>
        </div>

        {message && (
          <div
            className={`mb-4 p-3 rounded-lg ${
              message.type === "success"
                ? "bg-green-900/50 border border-green-700 text-green-400"
                : "bg-red-900/50 border border-red-700 text-red-400"
            }`}
          >
            {message.text}
          </div>
        )}

        <div className="bg-gray-800 rounded-lg mb-6">
          <div className="flex flex-wrap">
            <button
              className={`py-3 px-4 text-sm font-medium ${
                activeTab === "rate" ? "bg-blue-600 text-white" : "text-gray-300 hover:bg-gray-700"
              }`}
              onClick={() => setActiveTab("rate")}
            >
              Mining Rate
            </button>
            <button
              className={`py-3 px-4 text-sm font-medium ${
                activeTab === "boost" ? "bg-blue-600 text-white" : "text-gray-300 hover:bg-gray-700"
              }`}
              onClick={() => setActiveTab("boost")}
            >
              Mining Boost
            </button>
            <button
              className={`py-3 px-4 text-sm font-medium ${
                activeTab === "time" ? "bg-blue-600 text-white" : "text-gray-300 hover:bg-gray-700"
              }`}
              onClick={() => setActiveTab("time")}
            >
              Mining Time
            </button>
            <button
              className={`py-3 px-4 text-sm font-medium ${
                activeTab === "nft" ? "bg-blue-600 text-white" : "text-gray-300 hover:bg-gray-700"
              }`}
              onClick={() => setActiveTab("nft")}
            >
              NFT Slots
            </button>
          </div>
        </div>

        <div className="bg-gray-800 rounded-lg p-4 mb-6">
          <div className="flex justify-between">
            <div>
              <div className="text-gray-400 text-xs">WhaleBux Dollars</div>
              <div className="text-white font-medium">${wbuxDollars.toLocaleString()}</div>
            </div>
            <div>
              <div className="text-gray-400 text-xs">WBUX Tokens</div>
              <div className="text-white font-medium">{wbuxBalance.toLocaleString()}</div>
            </div>
          </div>
        </div>

        {activeTab === "rate" &&
          renderUpgradeCard("rate", "Mining Rate", "Increase your base mining rate per hour", miningRateLevel)}

        {activeTab === "boost" &&
          renderUpgradeCard("boost", "Mining Boost", "Increase your mining boost percentage", miningBoostLevel)}

        {activeTab === "time" &&
          renderUpgradeCard("time", "Mining Time", "Reduce the time required for mining", miningTimeLevel)}

        {activeTab === "nft" &&
          renderUpgradeCard("nft", "NFT Slots", "Unlock additional NFT slots for more boosts", nftSlotLevel)}
      </div>
    </div>
  )
}
