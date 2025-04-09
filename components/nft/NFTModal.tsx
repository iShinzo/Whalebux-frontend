"use client"

import { useState } from "react"
import { useUserStore } from "../../lib/stores/userStore"
import { useNFTStore, type NFT } from "../../lib/stores/nftStore"
import { formatDistanceToNow } from "date-fns"

interface NFTModalProps {
  nft: NFT
  onClose: () => void
}

export default function NFTModal({ nft, onClose }: NFTModalProps) {
  const { userId, username } = useUserStore()
  const { activateNFT, deactivateNFT, listForSale, listForAuction, cancelListing, buyNFT, getBidsForNFT, placeBid } =
    useNFTStore()

  const [bidAmount, setBidAmount] = useState(nft.highestBid ? nft.highestBid + 10 : nft.price || 100)
  const [showBidForm, setShowBidForm] = useState(false)

  const isOwner = nft.ownerId === userId
  const isForSale = nft.status === "FOR_SALE"
  const isAuction = nft.status === "AUCTION"
  const isActivated = nft.status === "ACTIVATED"

  const bids = getBidsForNFT(nft.id)

  const handleActivate = () => {
    if (isOwner && !isActivated) {
      activateNFT(nft.id)
      onClose()
    }
  }

  const handleDeactivate = () => {
    if (isOwner && isActivated) {
      deactivateNFT(nft.id)
      onClose()
    }
  }

  const handleCancelSale = () => {
    if (isOwner && (isForSale || isAuction)) {
      cancelListing(nft.id)
      onClose()
    }
  }

  const handleBuy = () => {
    if (!isOwner && isForSale && userId && username) {
      buyNFT(nft.id, userId, username)
      onClose()
    }
  }

  const handlePlaceBid = () => {
    if (!isOwner && isAuction && userId && username) {
      placeBid(nft.id, userId, username, bidAmount)
      setShowBidForm(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-auto">
        <div className="relative">
          <img
            src={nft.image || "/placeholder.svg?height=400&width=400"}
            alt={nft.name}
            className="w-full h-64 object-cover"
          />
          <button onClick={onClose} className="absolute top-2 right-2 bg-gray-900/80 text-white rounded-full p-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h2 className="text-2xl font-bold text-white">{nft.name}</h2>
              <p className="text-gray-400">
                {nft.type} • {nft.rarity} Rarity
              </p>
            </div>
            <div
              className={`px-3 py-1 text-sm font-bold rounded-full ${
                nft.status === "FOR_SALE"
                  ? "bg-blue-900/70 text-blue-400"
                  : nft.status === "AUCTION"
                    ? "bg-purple-900/70 text-purple-400"
                    : nft.status === "ACTIVATED"
                      ? "bg-green-900/70 text-green-400"
                      : "bg-gray-900/70 text-gray-400"
              }`}
            >
              {nft.status === "FOR_SALE"
                ? "For Sale"
                : nft.status === "AUCTION"
                  ? "Auction"
                  : nft.status === "ACTIVATED"
                    ? "Activated"
                    : "Owned"}
            </div>
          </div>

          <p className="text-gray-300 mb-6">{nft.description}</p>

          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-gray-700 p-4 rounded-lg">
              <div className="text-sm text-gray-400 mb-1">Boost Type:</div>
              <div className="text-white">
                {nft.boost.type === "MINING_RATE"
                  ? "Mining Rate"
                  : nft.boost.type === "MINING_TIME"
                    ? "Mining Time"
                    : nft.boost.type === "REWARD_MULTIPLIER"
                      ? "Reward Multiplier"
                      : "Special"}
              </div>
            </div>

            <div className="bg-gray-700 p-4 rounded-lg">
              <div className="text-sm text-gray-400 mb-1">Boost Value:</div>
              <div className="text-white">+{nft.boost.value}%</div>
            </div>

            <div className="bg-gray-700 p-4 rounded-lg">
              <div className="text-sm text-gray-400 mb-1">Duration:</div>
              <div className="text-white">{nft.boost.duration ? `${nft.boost.duration} days` : "Permanent"}</div>
            </div>

            <div className="bg-gray-700 p-4 rounded-lg">
              <div className="text-sm text-gray-400 mb-1">Minted:</div>
              <div className="text-white">{formatDistanceToNow(new Date(nft.mintDate))} ago</div>
            </div>
          </div>

          {isForSale && (
            <div className="mb-6 p-4 bg-gray-700 rounded-lg">
              <div className="text-sm text-gray-400 mb-1">Price:</div>
              <div className="text-2xl font-bold text-white">
                {nft.price} {nft.priceType === "DOLLARS" ? "Dollars" : "WBUX"}
              </div>
              <div className="text-sm text-gray-400 mt-1">Seller: {nft.ownerName || "Unknown"}</div>
            </div>
          )}

          {isAuction && (
            <div className="mb-6">
              <div className="p-4 bg-gray-700 rounded-lg mb-4">
                <div className="flex justify-between">
                  <div>
                    <div className="text-sm text-gray-400 mb-1">
                      {nft.highestBid ? "Current Bid:" : "Starting Price:"}
                    </div>
                    <div className="text-2xl font-bold text-white">
                      {nft.highestBid || nft.price} {nft.priceType === "DOLLARS" ? "Dollars" : "WBUX"}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-gray-400 mb-1">Auction Ends:</div>
                    <div className="text-white">
                      {nft.auctionEndTime ? formatDistanceToNow(new Date(nft.auctionEndTime)) : "Unknown"}
                    </div>
                  </div>
                </div>
                {nft.highestBidder && (
                  <div className="text-sm text-gray-400 mt-2">Highest Bidder: {nft.highestBidderName || "Unknown"}</div>
                )}
              </div>

              {showBidForm && !isOwner && (
                <div className="p-4 bg-gray-700 rounded-lg mb-4">
                  <div className="text-sm text-gray-400 mb-2">Place Your Bid:</div>
                  <div className="flex space-x-2">
                    <input
                      type="number"
                      value={bidAmount}
                      onChange={(e) => setBidAmount(Number(e.target.value))}
                      className="flex-1 px-3 py-2 bg-gray-600 border border-gray-500 rounded-md text-white"
                      min={nft.highestBid ? nft.highestBid + 1 : (nft.price || 0) + 1}
                    />
                    <button
                      onClick={handlePlaceBid}
                      className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-md"
                    >
                      Place Bid
                    </button>
                  </div>
                  <div className="text-xs text-gray-400 mt-2">
                    Minimum bid: {nft.highestBid ? nft.highestBid + 1 : (nft.price || 0) + 1}{" "}
                    {nft.priceType === "DOLLARS" ? "Dollars" : "WBUX"}
                  </div>
                </div>
              )}

              {bids.length > 0 && (
                <div className="p-4 bg-gray-700 rounded-lg">
                  <div className="text-sm text-gray-400 mb-2">Bid History:</div>
                  <div className="space-y-2 max-h-40 overflow-y-auto">
                    {bids
                      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
                      .map((bid) => (
                        <div key={bid.id} className="flex justify-between items-center text-sm">
                          <div className="text-white">{bid.bidderName}</div>
                          <div className="text-white font-medium">
                            {bid.amount} {nft.priceType === "DOLLARS" ? "Dollars" : "WBUX"}
                          </div>
                          <div className="text-gray-400">{formatDistanceToNow(new Date(bid.timestamp))} ago</div>
                        </div>
                      ))}
                  </div>
                </div>
              )}
            </div>
          )}

          <div className="flex space-x-3">
            {isOwner ? (
              <>
                {isActivated ? (
                  <button
                    onClick={handleDeactivate}
                    className="flex-1 py-2 px-4 bg-red-600 hover:bg-red-700 text-white rounded-md"
                  >
                    Deactivate
                  </button>
                ) : isForSale || isAuction ? (
                  <button
                    onClick={handleCancelSale}
                    className="flex-1 py-2 px-4 bg-red-600 hover:bg-red-700 text-white rounded-md"
                  >
                    Cancel Listing
                  </button>
                ) : (
                  <>
                    <button
                      onClick={handleActivate}
                      className="flex-1 py-2 px-4 bg-green-600 hover:bg-green-700 text-white rounded-md"
                    >
                      Activate
                    </button>
                  </>
                )}
              </>
            ) : (
              <>
                {isForSale && (
                  <button
                    onClick={handleBuy}
                    className="flex-1 py-2 px-4 bg-green-600 hover:bg-green-700 text-white rounded-md"
                  >
                    Buy Now
                  </button>
                )}

                {isAuction && (
                  <button
                    onClick={() => setShowBidForm(!showBidForm)}
                    className="flex-1 py-2 px-4 bg-purple-600 hover:bg-purple-700 text-white rounded-md"
                  >
                    {showBidForm ? "Cancel" : "Place Bid"}
                  </button>
                )}
              </>
            )}

            <button onClick={onClose} className="flex-1 py-2 px-4 bg-gray-600 hover:bg-gray-700 text-white rounded-md">
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
