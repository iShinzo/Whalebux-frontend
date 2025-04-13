"use client"

import { useState, useCallback } from "react"
import { useUserStore } from "../../lib/stores/userStore"
import { useNFTStore, type NFT } from "../../lib/stores/nftStore"
import { formatDistanceToNow } from "date-fns"

interface NFTModalProps {
  nft: NFT
  onClose: () => void
}

// Reusable Badge Component
const Badge = ({ label, color }: { label: string; color: string }) => (
  <div className={`px-3 py-1 text-sm font-bold rounded-full ${color}`}>{label}</div>
)

// Reusable Button Component
const Button = ({
  label,
  onClick,
  color,
}: {
  label: string
  onClick: () => void
  color: string
}) => (
  <button
    onClick={onClick}
    className={`flex-1 py-2 px-4 ${color} hover:opacity-90 text-white rounded-md`}
  >
    {label}
  </button>
)

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

  const handleActivate = useCallback(() => {
    if (isOwner && !isActivated) {
      activateNFT(nft.id)
      onClose()
    }
  }, [isOwner, isActivated, activateNFT, nft.id, onClose])

  const handleDeactivate = useCallback(() => {
    if (isOwner && isActivated) {
      deactivateNFT(nft.id)
      onClose()
    }
  }, [isOwner, isActivated, deactivateNFT, nft.id, onClose])

  const handleCancelSale = useCallback(() => {
    if (isOwner && (isForSale || isAuction)) {
      cancelListing(nft.id)
      onClose()
    }
  }, [isOwner, isForSale, isAuction, cancelListing, nft.id, onClose])

  const handleBuy = useCallback(() => {
    if (!isOwner && isForSale && userId && username) {
      buyNFT(nft.id, userId, username)
      onClose()
    }
  }, [isOwner, isForSale, userId, username, buyNFT, nft.id, onClose])

  const handlePlaceBid = useCallback(() => {
    if (!isOwner && isAuction && userId && username) {
      placeBid(nft.id, userId, username, bidAmount)
      setShowBidForm(false)
    }
  }, [isOwner, isAuction, userId, username, placeBid, nft.id, bidAmount])

  const renderStatusBadge = () => {
    switch (nft.status) {
      case "FOR_SALE":
        return <Badge label="For Sale" color="bg-blue-900/70 text-blue-400" />
      case "AUCTION":
        return <Badge label="Auction" color="bg-purple-900/70 text-purple-400" />
      case "ACTIVATED":
        return <Badge label="Activated" color="bg-green-900/70 text-green-400" />
      default:
        return <Badge label="Owned" color="bg-gray-900/70 text-gray-400" />
    }
  }

  const renderBoostDetails = () => (
    <div className="grid grid-cols-2 gap-4">
      <DetailCard label="Boost Type" value={getBoostTypeLabel(nft.boost.type)} />
      <DetailCard label="Boost Value" value={`+${nft.boost.value}%`} />
      <DetailCard label="Duration" value={nft.boost.duration ? `${nft.boost.duration} days` : "Permanent"} />
      <DetailCard label="Minted" value={`${formatDistanceToNow(new Date(nft.mintDate))} ago`} />
    </div>
  )

  // Detail card for displaying NFT details
  const DetailCard = ({ label, value }: { label: string; value: string }) => (
    <div className="bg-gray-700 p-4 rounded-lg">
      <div className="text-sm text-gray-400 mb-1">{label}:</div>
      <div className="text-white">{value}</div>
    </div>
  )

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-auto">
        {/* Modal Header */}
        <div className="relative">
          <img
            src={nft.image || "/placeholder.svg?height=400&width=400"}
            alt={nft.name}
            className="w-full h-64 object-cover"
          />
          <button
            onClick={onClose}
            className="absolute top-2 right-2 bg-gray-900/80 text-white rounded-full p-2"
            aria-label="Close Modal"
          >
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

        {/* Modal Body */}
        <div className="p-6">
          {/* NFT Info */}
          <div className="flex justify-between items-start mb-4">
            <div>
              <h2 className="text-2xl font-bold text-white">{nft.name}</h2>
              <p className="text-gray-400">
                {nft.type} • {nft.rarity} Rarity
              </p>
            </div>
            {renderStatusBadge()}
          </div>

          <p className="text-gray-300 mb-6">{nft.description}</p>

          {/* Boost Details */}
          {renderBoostDetails()}

          {/* For Sale Section */}
          {isForSale && (
            <DetailCard
              label="Price"
              value={`${nft.price} ${nft.priceType === "DOLLARS" ? "Dollars" : "WBUX"}`}
            />
          )}

          {/* Auction Section */}
          {isAuction && (
            <>
              <DetailCard
                label={nft.highestBid ? "Current Bid" : "Starting Price"}
                value={`${nft.highestBid || nft.price} ${nft.priceType === "DOLLARS" ? "Dollars" : "WBUX"}`}
              />
              <DetailCard
                label="Auction Ends"
                value={nft.auctionEndTime ? formatDistanceToNow(new Date(nft.auctionEndTime)) : "Unknown"}
              />
              {showBidForm && (
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
                    <Button label="Place Bid" onClick={handlePlaceBid} color="bg-purple-600" />
                  </div>
                </div>
              )}
            </>
          )}

          {/* Action Buttons */}
          <div className="flex space-x-3">
            {isOwner ? (
              <>
                {isActivated ? (
                  <Button label="Deactivate" onClick={handleDeactivate} color="bg-red-600" />
                ) : isForSale || isAuction ? (
                  <Button label="Cancel Listing" onClick={handleCancelSale} color="bg-red-600" />
                ) : (
                  <Button label="Activate" onClick={handleActivate} color="bg-green-600" />
                )}
              </>
            ) : (
              <>
                {isForSale && <Button label="Buy Now" onClick={handleBuy} color="bg-green-600" />}
                {isAuction && (
                  <Button
                    label={showBidForm ? "Cancel" : "Place Bid"}
                    onClick={() => setShowBidForm(!showBidForm)}
                    color="bg-purple-600"
                  />
                )}
              </>
            )}
            <Button label="Close" onClick={onClose} color="bg-gray-600" />
          </div>
        </div>
      </div>
    </div>
  )
}

// Helper function for boost type labels
function getBoostTypeLabel(type: string): string {
  switch (type) {
    case "MINING_RATE":
      return "Mining Rate"
    case "MINING_TIME":
      return "Mining Time"
    case "REWARD_MULTIPLIER":
      return "Reward Multiplier"
    case "SPECIAL":
      return "Special"
    default:
      return "Unknown"
  }
}
