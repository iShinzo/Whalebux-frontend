"use client"

import { useState, useMemo } from "react"
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
  const {
    wbuxDollars,
    wbuxBalance,
    miningRateLevel,
    miningBoostLevel,
    miningTimeLevel,
    nftSlotLevel,
    setUser,
  } = useUserStore()

  const [activeTab, setActiveTab] = useState<UpgradeType>("rate")
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)

  // Handle upgrade logic
  const handleUpgrade = (type: UpgradeType) => {
    const currentLevel = getCurrentLevel(type)
    const maxLevel = getMaxUpgradeLevel(type)

    // Check if already at max level
    if (currentLevel >= maxLevel) {
      setMessage({ type: "error", text: "Already at maximum level!" })
      return
    }

    // Check if user can afford the upgrade
    const cost = getUpgradeCost(type, currentLevel)
    if (!canAffordUpgrade(type, currentLevel, wbuxDollars, wbuxBalance)) {
      setMessage({ type: "error", text: "Cannot afford this upgrade!" })
      return
    }

    // Apply upgrade
    const nextLevel = currentLevel + 1
    applyUpgrade(type, nextLevel, cost)
    setMessage({ type: "success", text: "Upgrade successful!" })
  }

  // Get the current level for the given upgrade type
  const getCurrentLevel = (type: UpgradeType) => {
    switch (type) {
      case "rate":
        return miningRateLevel
      case "boost":
        return miningBoostLevel
      case "time":
        return miningTimeLevel
      case "nft":
        return nftSlotLevel
      default:
        return 0
    }
  }

  // Apply the upgrade and update the user state
  const applyUpgrade = (type: UpgradeType, nextLevel: number, cost: { dollars: number; tokens: number }) => {
    const updatedState = {
      wbuxDollars: wbuxDollars - cost.dollars,
      wbuxBalance: wbuxBalance - cost.tokens,
    }

    switch (type) {
      case "rate":
        setUser({ ...updatedState, miningRateLevel: nextLevel })
        break
      case "boost":
        setUser({ ...updatedState, miningBoostLevel: nextLevel })
        break
      case "time":
        setUser({ ...updatedState, miningTimeLevel: nextLevel })
        break
      case "nft":
        setUser({ ...updatedState, nftSlotLevel: nextLevel })
        break
    }
  }

  // Render an individual upgrade card
  const renderUpgradeCard = (type: UpgradeType, title: string, description: string) => {
    const currentLevel = getCurrentLevel(type)
    const maxLevel = getMaxUpgradeLevel(type)
    const isMaxLevel = currentLevel >= maxLevel
    const cost = useMemo(() => getUpgradeCost(type, currentLevel), [type, currentLevel])
    const canAfford = useMemo(
      () => canAffordUpgrade(type, currentLevel, wbuxDollars, wbuxBalance),
      [type, currentLevel, wbuxDollars, wbuxBalance]
    )

    const upgradeDetails = getUpgradeDetails(type, currentLevel)

    return (
      <div className="bg-gray-800 rounded-lg p-4 mb-6">
        {/* Header */}
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-lg font-semibold text-white">{title}</h3>
            <p className="text-gray-400 text-sm">{description}</p>
          </div>
          <div className="bg-gray-700 px-2 py-1 rounded text-white">
            Level {currentLevel}/{maxLevel}
          </div>
        </div>

        {/* Upgrade Details */}
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
                  {getUpgradeDetails(type, currentLevel + 1)}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Upgrade Button */}
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
              disabled={!canAfford}
              className={`px-4 py-2 rounded ${
                canAfford ? "bg-green-600 hover:bg-green-500 text-white" : "bg-red-900 text-red-300 cursor-not-allowed"
              }`}
            >
              Upgrade
            </button>
          </div>
        )}

        {isMaxLevel && <div className="text-center text-green-400 font-medium">Maximum level reached!</div>}
      </div>
    )
  }

  // Get the details of the upgrade for a specific type and level
  const getUpgradeDetails = (type: UpgradeType, level: number) => {
    switch (type) {
      case "rate":
        return `+${MINING_RATE_UPGRADES[level]?.bonus || 0} WBUX/hr`
      case "boost":
        return `+${MINING_BOOST_UPGRADES[level]?.bonus || 0}% boost`
      case "time":
        return `-${MINING_TIME_UPGRADES[level]?.bonus || 0} minutes`
      case "nft":
        return `+${NFT_SLOT_UPGRADES[level]?.slots || 0} slot(s)`
      default:
        return ""
    }
  }

  return (
    <div className="min-h-screen bg-gray-900 pb-20">
      <div className="max-w-md mx-auto p-4">
        {/* Header */}
        <div className="flex items-center mb-6">
          <button onClick={() => router.push("/")} className="text-gray-400 hover:text-white mr-4">
            ← Back
          </button>
          <h1 className="text-2xl font-bold text-white">Mining Upgrades</h1>
        </div>

        {/* Success/Error Message */}
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

        {/* Tabs for Upgrade Types */}
        <div className="bg-gray-800 rounded-lg mb-6">
          <div className="flex flex-wrap">
            {["rate", "boost", "time", "nft"].map((type) => (
              <button
                key={type}
                className={`py-3 px-4 text-sm font-medium ${
                  activeTab === type ? "bg-blue-600 text-white" : "text-gray-300 hover:bg-gray-700"
                }`}
                onClick={() => setActiveTab(type as UpgradeType)}
              >
                {type === "rate" && "Mining Rate"}
                {type === "boost" && "Mining Boost"}
                {type === "time" && "Mining Time"}
                {type === "nft" && "NFT Slots"}
              </button>
            ))}
          </div>
        </div>

        {/* Wallet Information */}
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

        {/* Render Active Tab Content */}
        {activeTab === "rate" &&
          renderUpgradeCard("rate", "Mining Rate", "Increase your base mining rate per hour")}
        {activeTab === "boost" &&
          renderUpgradeCard("boost", "Mining Boost", "Increase your mining boost percentage")}
        {activeTab === "time" &&
          renderUpgradeCard("time", "Mining Time", "Reduce the time required for mining")}
        {activeTab === "nft" &&
          renderUpgradeCard("nft", "NFT Slots", "Unlock additional NFT slots for more boosts")}
      </div>
    </div>
  )
}
