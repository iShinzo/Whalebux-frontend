"use client"

import { useState } from "react"
import type { NFT, NFTRarity, NFTType } from "../../lib/stores/nftStore"
import NFTCard from "./NFTCard"
import NFTModal from "./NFTModal"

interface NFTGridProps {
  nfts: NFT[]
  showActions?: boolean
}

export default function NFTGrid({ nfts, showActions = false }: NFTGridProps) {
  const [selectedNFT, setSelectedNFT] = useState<NFT | null>(null)
  const [filter, setFilter] = useState<NFTRarity | "ALL">("ALL")
  const [typeFilter, setTypeFilter] = useState<NFTType | "ALL">("ALL")
  const [sortBy, setSortBy] = useState<"rarity" | "price" | "newest">("rarity")

  // Apply filters
  const filteredNFTs = nfts.filter((nft) => {
    if (filter !== "ALL" && nft.rarity !== filter) return false
    if (typeFilter !== "ALL" && nft.type !== typeFilter) return false
    return true
  })

  // Apply sorting
  const sortedNFTs = [...filteredNFTs].sort((a, b) => {
    if (sortBy === "rarity") {
      return getRarityValue(b.rarity) - getRarityValue(a.rarity)
    } else if (sortBy === "price") {
      const aPrice = a.price || 0
      const bPrice = b.price || 0
      return bPrice - aPrice
    } else {
      return new Date(b.mintDate).getTime() - new Date(a.mintDate).getTime()
    }
  })

  return (
    <div>
      <div className="mb-6 flex flex-wrap gap-2">
        <button
          className={`px-3 py-1 text-sm rounded-full ${
            filter === "ALL" ? "bg-blue-600 text-white" : "bg-gray-700 text-gray-300 hover:bg-gray-600"
          }`}
          onClick={() => setFilter("ALL")}
        >
          All Rarities
        </button>
        <button
          className={`px-3 py-1 text-sm rounded-full ${
            filter === "GREEN" ? "bg-green-600 text-white" : "bg-gray-700 text-gray-300 hover:bg-gray-600"
          }`}
          onClick={() => setFilter("GREEN")}
        >
          Green
        </button>
        <button
          className={`px-3 py-1 text-sm rounded-full ${
            filter === "BLUE" ? "bg-blue-600 text-white" : "bg-gray-700 text-gray-300 hover:bg-gray-600"
          }`}
          onClick={() => setFilter("BLUE")}
        >
          Blue
        </button>
        <button
          className={`px-3 py-1 text-sm rounded-full ${
            filter === "PURPLE" ? "bg-purple-600 text-white" : "bg-gray-700 text-gray-300 hover:bg-gray-600"
          }`}
          onClick={() => setFilter("PURPLE")}
        >
          Purple
        </button>
        <button
          className={`px-3 py-1 text-sm rounded-full ${
            filter === "GOLD" ? "bg-yellow-600 text-white" : "bg-gray-700 text-gray-300 hover:bg-gray-600"
          }`}
          onClick={() => setFilter("GOLD")}
        >
          Gold
        </button>
        <button
          className={`px-3 py-1 text-sm rounded-full ${
            filter === "WHITE" ? "bg-gray-200 text-gray-800" : "bg-gray-700 text-gray-300 hover:bg-gray-600"
          }`}
          onClick={() => setFilter("WHITE")}
        >
          White
        </button>
      </div>

      <div className="mb-6 flex flex-wrap gap-2">
        <button
          className={`px-3 py-1 text-sm rounded-full ${
            typeFilter === "ALL" ? "bg-blue-600 text-white" : "bg-gray-700 text-gray-300 hover:bg-gray-600"
          }`}
          onClick={() => setTypeFilter("ALL")}
        >
          All Types
        </button>
        <button
          className={`px-3 py-1 text-sm rounded-full ${
            typeFilter === "MINING_BOOST" ? "bg-blue-600 text-white" : "bg-gray-700 text-gray-300 hover:bg-gray-600"
          }`}
          onClick={() => setTypeFilter("MINING_BOOST")}
        >
          Mining Boost
        </button>
        <button
          className={`px-3 py-1 text-sm rounded-full ${
            typeFilter === "TIME_BOOST" ? "bg-blue-600 text-white" : "bg-gray-700 text-gray-300 hover:bg-gray-600"
          }`}
          onClick={() => setTypeFilter("TIME_BOOST")}
        >
          Time Boost
        </button>
        <button
          className={`px-3 py-1 text-sm rounded-full ${
            typeFilter === "REWARD_BOOST" ? "bg-blue-600 text-white" : "bg-gray-700 text-gray-300 hover:bg-gray-600"
          }`}
          onClick={() => setTypeFilter("REWARD_BOOST")}
        >
          Reward Boost
        </button>
        <button
          className={`px-3 py-1 text-sm rounded-full ${
            typeFilter === "SPECIAL" ? "bg-blue-600 text-white" : "bg-gray-700 text-gray-300 hover:bg-gray-600"
          }`}
          onClick={() => setTypeFilter("SPECIAL")}
        >
          Special
        </button>
        <button
          className={`px-3 py-1 text-sm rounded-full ${
            typeFilter === "COLLECTOR" ? "bg-blue-600 text-white" : "bg-gray-700 text-gray-300 hover:bg-gray-600"
          }`}
          onClick={() => setTypeFilter("COLLECTOR")}
        >
          Collector
        </button>
      </div>

      <div className="flex justify-between items-center mb-6">
        <div className="text-sm text-gray-400">{sortedNFTs.length} NFTs</div>
        <div className="flex items-center">
          <span className="text-sm text-gray-400 mr-2">Sort by:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as "rarity" | "price" | "newest")}
            className="bg-gray-700 text-white text-sm rounded px-2 py-1 border border-gray-600"
          >
            <option value="rarity">Rarity</option>
            <option value="price">Price</option>
            <option value="newest">Newest</option>
          </select>
        </div>
      </div>

      {sortedNFTs.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {sortedNFTs.map((nft) => (
            <NFTCard key={nft.id} nft={nft} onClick={() => setSelectedNFT(nft)} showActions={showActions} />
          ))}
        </div>
      ) : (
        <div className="bg-gray-800 rounded-lg p-8 text-center">
          <p className="text-gray-400">No NFTs found matching your filters.</p>
        </div>
      )}

      {selectedNFT && <NFTModal nft={selectedNFT} onClose={() => setSelectedNFT(null)} />}
    </div>
  )
}

// Helper function to get rarity value for sorting
function getRarityValue(rarity: NFTRarity): number {
  switch (rarity) {
    case "WHITE":
      return 5
    case "GOLD":
      return 4
    case "PURPLE":
      return 3
    case "BLUE":
      return 2
    case "GREEN":
      return 1
    default:
      return 0
  }
}
