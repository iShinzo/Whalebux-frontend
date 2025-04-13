"use client"

import { useState } from "react"
import { useUserStore } from "../../lib/stores/userStore"
import { useNFTStore, type NFT, type NFTRarity } from "../../lib/stores/nftStore"
import { formatDistanceToNow } from "date-fns"

interface NFTCardProps {
  nft: NFT
  onClick?: () => void
  showActions?: boolean
}

export default function NFTCard({ nft, onClick, showActions = false }: NFTCardProps) {
  const { userId, username } = useUserStore()
  const { activateNFT, deactivateNFT, listForSale, listForAuction, cancelListing, buyNFT } = useNFTStore()

  const [showSellOptions, setShowSellOptions] = useState(false)
  const [price, setPrice] = useState(100)
  const [priceType, setPriceType] = useState<"DOLLARS" | "TOKENS">("DOLLARS")
  const [auctionDuration, setAuctionDuration] = useState(24) // hours

  const isOwner = nft.ownerId === userId
  const isForSale = nft.status === "FOR_SALE"
  const isAuction = nft.status === "AUCTION"
  const isActivated = nft.status === "ACTIVATED"

  const handleActivate = () => {
    if (isOwner && !isActivated) {
      activateNFT(nft.id)
    }
  }

  const handleDeactivate = () => {
    if (isOwner && isActivated) {
      deactivateNFT(nft.id)
    }
  }

  const handleSell = () => {
    if (isOwner && !isForSale && !isAuction && !isActivated) {
      setShowSellOptions(true)
    }
  }

  const handleCancelSale = () => {
    if (isOwner && (isForSale || isAuction)) {
      cancelListing(nft.id)
    }
  }

  const handleListForSale = () => {
    if (isOwner && !isForSale && !isAuction && !isActivated) {
      listForSale(nft.id, price, priceType)
      setShowSellOptions(false)
    }
  }

  const handleListForAuction = () => {
    if (isOwner && !isForSale && !isAuction && !isActivated) {
      listForAuction(nft.id, price, auctionDuration, priceType)
      setShowSellOptions(false)
    }
  }

  const handleBuy = () => {
    if (!isOwner && isForSale && userId && username) {
      buyNFT(nft.id, userId, username)
    }
  }

  return (
    <div
      className={`bg-gray-800 rounded-lg overflow-hidden border-2 ${getRarityBorderColor(nft.rarity)}`}
      onClick={onClick}
    >
      <div className="relative">
        <img
          src={nft.image || "/placeholder.svg?height=200&width=200"}
          alt={nft.name}
          className="w-full h-48 object-cover"
        />
        <div
          className={`absolute top-2 right-2 px-2 py-1 text-xs font-bold rounded-full ${getRarityBgColor(nft.rarity)}`}
        >
          {nft.rarity}
        </div>

        {nft.status !== "OWNED" && (
          <div
            className={`absolute top-2 left-2 px-2 py-1 text-xs font-bold rounded-full ${getStatusBgColor(nft.status)}`}
          >
            {getStatusLabel(nft.status)}
          </div>
        )}
      </div>

      <div className="p-4">
        <h3 className="text-lg font-bold text-white mb-1">{nft.name}</h3>
        <p className="text-gray-300 text-sm mb-3">{nft.description}</p>

        <div className="mb-3">
          <div className="text-xs text-gray-400 mb-1">Boost:</div>
          <div className="text-sm text-white">
            +{nft.boost.value}% {getBoostTypeLabel(nft.boost.type)}
            {nft.boost.duration && ` (${nft.boost.duration} days)`}
          </div>
        </div>

        {isForSale && (
          <div className="mb-3 p-2 bg-gray-700 rounded">
            <div className="text-xs text-gray-400 mb-1">Price:</div>
            <div className="text-lg font-bold text-white">
              {nft.price} {nft.priceType === "DOLLARS" ? "Dollars" : "WBUX"}
            </div>
          </div>
        )}

        {isAuction && (
          <div className="mb-3 p-2 bg-gray-700 rounded">
            <div className="text-xs text-gray-400 mb-1">{nft.highestBid ? "Current Bid:" : "Starting Price:"}</div>
            <div className="text-lg font-bold text-white">
              {nft.highestBid || nft.price} {nft.priceType === "DOLLARS" ? "Dollars" : "WBUX"}
            </div>
            {nft.auctionEndTime && (
              <div className="text-xs text-gray-400 mt-1">
                Ends in: {formatDistanceToNow(new Date(nft.auctionEndTime))}
              </div>
            )}
          </div>
        )}

        {showActions && (
          <div className="mt-4">
            {isOwner ? (
              <>
                {isActivated ? (
                  <button
                    onClick={handleDeactivate}
                    className="w-full py-2 px-4 bg-red-600 hover:bg-red-700 text-white rounded-md text-sm font-medium"
                  >
                    Deactivate
                  </button>
                ) : (
                  <>
                    {isForSale || isAuction ? (
                      <button
                        onClick={handleCancelSale}
                        className="w-full py-2 px-4 bg-red-600 hover:bg-red-700 text-white rounded-md text-sm font-medium"
                      >
                        Cancel Listing
                      </button>
                    ) : (
                      <>
                        {showSellOptions ? (
                          <div className="space-y-3">
                            <div className="flex items-center space-x-2">
                              <input
                                type="number"
                                value={price}
                                onChange={(e) => setPrice(Number(e.target.value))}
                                className="flex-1 px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white text-sm"
                                min="1"
                              />
                              <select
                                value={priceType}
                                onChange={(e) => setPriceType(e.target.value as "DOLLARS" | "TOKENS")}
                                className="px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white text-sm"
                              >
                                <option value="DOLLARS">Dollars</option>
                                <option value="TOKENS">WBUX</option>
                              </select>
                            </div>

                            <div className="grid grid-cols-2 gap-2">
                              <button
                                onClick={handleListForSale}
                                className="py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-sm font-medium"
                              >
                                Sell Now
                              </button>

                              <div className="relative">
                                <button
                                  onClick={handleListForAuction}
                                  className="w-full py-2 px-4 bg-purple-600 hover:bg-purple-700 text-white rounded-md text-sm font-medium"
                                >
                                  Auction
                                </button>
                                <select
                                  value={auctionDuration}
                                  onChange={(e) => setAuctionDuration(Number(e.target.value))}
                                  className="absolute right-1 top-1 h-8 bg-transparent text-transparent cursor-pointer"
                                >
                                  <option value="6">6 hours</option>
                                  <option value="12">12 hours</option>
                                  <option value="24">24 hours</option>
                                  <option value="48">48 hours</option>
                                </select>
                              </div>
                            </div>

                            <button
                              onClick={() => setShowSellOptions(false)}
                              className="w-full py-2 px-4 bg-gray-600 hover:bg-gray-700 text-white rounded-md text-sm font-medium"
                            >
                              Cancel
                            </button>
                          </div>
                        ) : (
                          <div className="grid grid-cols-2 gap-2">
                            <button
                              onClick={handleActivate}
                              className="py-2 px-4 bg-green-600 hover:bg-green-700 text-white rounded-md text-sm font-medium"
                            >
                              Activate
                            </button>
                            <button
                              onClick={handleSell}
                              className="py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-sm font-medium"
                            >
                              Sell
                            </button>
                          </div>
                        )}
                      </>
                    )}
                  </>
                )}
              </>
            ) : (
              <>
                {isForSale && (
                  <button
                    onClick={handleBuy}
                    className="w-full py-2 px-4 bg-green-600 hover:bg-green-700 text-white rounded-md text-sm font-medium"
                  >
                    Buy Now
                  </button>
                )}

                {isAuction && (
                  <button
                    onClick={() => {}}
                    className="w-full py-2 px-4 bg-purple-600 hover:bg-purple-700 text-white rounded-md text-sm font-medium"
                  >
                    Place Bid
                  </button>
                )}
              </>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

// Helper functions for styling
function getRarityBorderColor(rarity: NFTRarity): string {
  switch (rarity) {
    case "GREEN":
      return "border-green-500"
    case "BLUE":
      return "border-blue-500"
    case "PURPLE":
      return "border-purple-500"
    case "GOLD":
      return "border-yellow-500"
    case "WHITE":
      return "border-white"
    default:
      return "border-gray-500"
  }
}

function getRarityBgColor(rarity: NFTRarity): string {
  switch (rarity) {
    case "GREEN":
      return "bg-green-900/70 text-green-400"
    case "BLUE":
      return "bg-blue-900/70 text-blue-400"
    case "PURPLE":
      return "bg-purple-900/70 text-purple-400"
    case "GOLD":
      return "bg-yellow-900/70 text-yellow-400"
    case "WHITE":
      return "bg-gray-900/70 text-white"
    default:
      return "bg-gray-900/70 text-gray-400"
  }
}

function getStatusBgColor(status: string): string {
  switch (status) {
    case "FOR_SALE":
      return "bg-blue-900/70 text-blue-400"
    case "AUCTION":
      return "bg-purple-900/70 text-purple-400"
    case "ACTIVATED":
      return "bg-green-900/70 text-green-400"
    default:
      return "bg-gray-900/70 text-gray-400"
  }
}

function getStatusLabel(status: string): string {
  switch (status) {
    case "FOR_SALE":
      return "For Sale"
    case "AUCTION":
      return "Auction"
    case "ACTIVATED":
      return "Active"
    default:
      return status
  }
}

function getBoostTypeLabel(type: string): string {
  switch (type) {
    case "MINING_RATE":
      return "Mining Rate"
    case "MINING_TIME":
      return "Mining Time"
    case "REWARD_MULTIPLIER":
      return "Reward Boost"
    case "SPECIAL":
      return "Special Boost"
    default:
      return type
  }
}
