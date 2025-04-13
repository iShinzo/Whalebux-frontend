"use client"

import { useEffect, useState, useMemo } from "react"
import { useRouter } from "next/navigation"
import { useUserStore } from "../../lib/stores/userStore"
import { useNFTStore, initializeNFTs } from "../../lib/stores/nftStore"
import NFTGrid from "../../components/nft/NFTGrid"
import WalletConnect from "../../components/wallet/WalletConnect"
import WalletBalance from "../../components/wallet/WalletBalance"

export default function NFTMarketplace() {
  const router = useRouter()
  const { userId } = useUserStore()
  const { getMarketplaceNFTs, getOwnedNFTs, getActiveNFTs } = useNFTStore()

  const [activeTab, setActiveTab] = useState<"marketplace" | "my-nfts" | "active-nfts">("marketplace")

  // Initialize NFTs on component mount
  useEffect(() => {
    initializeNFTs()
  }, [])

  // Fetch NFTs based on user state
  const marketplaceNFTs = useMemo(() => getMarketplaceNFTs(), [getMarketplaceNFTs])
  const ownedNFTs = useMemo(() => (userId ? getOwnedNFTs(userId) : []), [userId, getOwnedNFTs])
  const activeNFTs = useMemo(() => (userId ? getActiveNFTs(userId) : []), [userId, getActiveNFTs])

  // Helper function to calculate total boost for a specific type
  const calculateTotalBoost = (boostType: string) =>
    activeNFTs.reduce((total, nft) => (nft.boost.type === boostType ? total + nft.boost.value : total), 0)

  return (
    <div className="min-h-screen bg-gray-900 pb-20">
      <div className="max-w-6xl mx-auto p-4">
        {/* Header Section */}
        <div className="flex items-center mb-6">
          <button
            onClick={() => router.push("/")}
            className="text-gray-400 hover:text-white mr-4"
            aria-label="Go back to home"
          >
            ← Back
          </button>
          <h1 className="text-2xl font-bold text-white">NFT Marketplace</h1>
        </div>

        {/* Main Content Section */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Left Column: Tabs and Content */}
          <div className="lg:col-span-3">
            {/* Tab Navigation */}
            <div className="bg-gray-800 rounded-lg mb-6 overflow-hidden">
              <div className="flex flex-wrap">
                {[
                  { id: "marketplace", label: "Marketplace" },
                  { id: "my-nfts", label: "My NFTs" },
                  { id: "active-nfts", label: "Active Boosts" },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    className={`py-3 px-4 text-sm font-medium ${
                      activeTab === tab.id ? "bg-blue-600 text-white" : "text-gray-300 hover:bg-gray-700"
                    }`}
                    onClick={() => setActiveTab(tab.id as "marketplace" | "my-nfts" | "active-nfts")}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Tab Content */}
            <div className="bg-gray-800 rounded-lg p-6">
              {activeTab === "marketplace" && (
                <>
                  <h2 className="text-xl font-semibold text-white mb-6">NFT Marketplace</h2>
                  <NFTGrid nfts={marketplaceNFTs} showActions={true} />
                </>
              )}

              {activeTab === "my-nfts" && (
                <>
                  <h2 className="text-xl font-semibold text-white mb-6">My NFT Collection</h2>
                  {ownedNFTs.length > 0 ? (
                    <NFTGrid nfts={ownedNFTs} showActions={true} />
                  ) : (
                    <div className="bg-gray-700 rounded-lg p-8 text-center">
                      <p className="text-gray-400 mb-4">You don't own any NFTs yet.</p>
                      <button
                        onClick={() => setActiveTab("marketplace")}
                        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md"
                      >
                        Browse Marketplace
                      </button>
                    </div>
                  )}
                </>
              )}

              {activeTab === "active-nfts" && (
                <>
                  <h2 className="text-xl font-semibold text-white mb-6">Active NFT Boosts</h2>
                  {activeNFTs.length > 0 ? (
                    <>
                      {/* Active Boosts Summary */}
                      <div className="bg-gray-700 rounded-lg p-4 mb-6">
                        <h3 className="text-lg font-medium text-white mb-2">Total Active Boosts</h3>
                        <div className="grid grid-cols-2 gap-4">
                          {[
                            { label: "Mining Rate", type: "MINING_RATE" },
                            { label: "Mining Time", type: "MINING_TIME" },
                            { label: "Reward Multiplier", type: "REWARD_MULTIPLIER" },
                            { label: "Special Boosts", type: "SPECIAL" },
                          ].map((boost) => (
                            <div key={boost.type} className="bg-gray-800 p-3 rounded-lg">
                              <div className="text-sm text-gray-400 mb-1">{boost.label}:</div>
                              <div className="text-green-400 font-bold text-lg">+{calculateTotalBoost(boost.type)}%</div>
                            </div>
                          ))}
                        </div>
                      </div>
                      {/* NFT Grid */}
                      <NFTGrid nfts={activeNFTs} showActions={true} />
                    </>
                  ) : (
                    <div className="bg-gray-700 rounded-lg p-8 text-center">
                      <p className="text-gray-400 mb-4">You don't have any active NFT boosts.</p>
                      <button
                        onClick={() => setActiveTab("my-nfts")}
                        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md"
                      >
                        Activate NFTs
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>

          {/* Right Column: Wallet Info and Guide */}
          <div className="space-y-6">
            <WalletConnect />
            <WalletBalance />

            {/* NFT Rarity Guide */}
            <div className="bg-gray-800 rounded-lg p-4">
              <h2 className="text-xl font-semibold text-white mb-4">NFT Rarity Guide</h2>
              <div className="space-y-3">
                {[
                  { color: "green", label: "Common (10% boost)" },
                  { color: "blue", label: "Uncommon (15% boost)" },
                  { color: "purple", label: "Rare (20% boost)" },
                  { color: "yellow", label: "Epic (25% boost)" },
                  { color: "white", label: "Special Edition (30% boost)" },
                ].map((rarity) => (
                  <div key={rarity.color} className="flex items-center">
                    <div className={`w-4 h-4 rounded-full bg-${rarity.color}-500 mr-2`}></div>
                    <div className="text-white">{rarity.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
