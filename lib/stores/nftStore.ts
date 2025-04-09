"use client"

import { create } from "zustand"
import { persist } from "zustand/middleware"
import { useUserStore } from "./userStore"

export type NFTRarity = "GREEN" | "BLUE" | "PURPLE" | "GOLD" | "WHITE"
export type NFTType = "MINING_BOOST" | "TIME_BOOST" | "REWARD_BOOST" | "SPECIAL" | "COLLECTOR"
export type NFTStatus = "OWNED" | "FOR_SALE" | "AUCTION" | "ACTIVATED"

export interface NFTBoost {
  type: "MINING_RATE" | "MINING_TIME" | "REWARD_MULTIPLIER" | "SPECIAL"
  value: number // Percentage boost or special value
  duration?: number // Duration in days, undefined means permanent
}

export interface NFT {
  id: string
  name: string
  description: string
  image: string
  rarity: NFTRarity
  type: NFTType
  boost: NFTBoost
  mintDate: string
  ownerId: string | null
  ownerName: string | null
  status: NFTStatus
  price?: number
  priceType?: "DOLLARS" | "TOKENS"
  auctionEndTime?: string
  highestBid?: number
  highestBidder?: string
  highestBidderName?: string
  activatedUntil?: string
  tokenId?: string // Blockchain token ID if applicable
}

export interface Bid {
  id: string
  nftId: string
  bidderId: string
  bidderName: string
  amount: number
  timestamp: string
}

interface NFTState {
  nfts: NFT[]
  bids: Bid[]

  // NFT Management
  addNFT: (nft: Omit<NFT, "id" | "mintDate" | "status" | "ownerId" | "ownerName">) => void
  listForSale: (nftId: string, price: number, priceType: "DOLLARS" | "TOKENS") => void
  listForAuction: (nftId: string, startingPrice: number, duration: number, priceType: "DOLLARS" | "TOKENS") => void
  cancelListing: (nftId: string) => void
  buyNFT: (nftId: string, buyerId: string, buyerName: string) => void

  // Auction Management
  placeBid: (nftId: string, bidderId: string, bidderName: string, amount: number) => void
  getHighestBid: (nftId: string) => Bid | undefined
  finalizeAuction: (nftId: string) => void

  // NFT Activation
  activateNFT: (nftId: string) => void
  deactivateNFT: (nftId: string) => void
  getActiveNFTs: (userId: string) => NFT[]

  // Queries
  getOwnedNFTs: (userId: string) => NFT[]
  getMarketplaceNFTs: () => NFT[]
  getActiveAuctions: () => NFT[]
  getNFTsByRarity: (rarity: NFTRarity) => NFT[]
  getNFTsByType: (type: NFTType) => NFT[]
  getNFTById: (id: string) => NFT | undefined
  getBidsForNFT: (nftId: string) => Bid[]
  getBidsByUser: (userId: string) => Bid[]

  // Wallet Integration
  connectWallet: (address: string, userId: string) => void
  disconnectWallet: (userId: string) => void
  getWalletAddress: (userId: string) => string | null

  // Total Boost Calculation
  calculateTotalBoost: (userId: string) => {
    miningRate: number
    miningTime: number
    rewardMultiplier: number
    special: number
  }
}

export const useNFTStore = create<NFTState>()(
  persist(
    (set, get) => ({
      nfts: [],
      bids: [],
      walletConnections: {},

      addNFT: (nftData) => {
        const newNFT: NFT = {
          id: `nft_${Math.random().toString(36).substring(2, 9)}`,
          mintDate: new Date().toISOString(),
          status: "OWNED",
          ownerId: null,
          ownerName: null,
          ...nftData,
        }
        set((state) => ({ nfts: [...state.nfts, newNFT] }))
      },

      listForSale: (nftId, price, priceType) => {
        set((state) => ({
          nfts: state.nfts.map((nft) =>
            nft.id === nftId
              ? {
                  ...nft,
                  status: "FOR_SALE",
                  price,
                  priceType,
                  auctionEndTime: undefined,
                  highestBid: undefined,
                  highestBidder: undefined,
                  highestBidderName: undefined,
                }
              : nft,
          ),
        }))
      },

      listForAuction: (nftId, startingPrice, duration, priceType) => {
        const endTime = new Date()
        endTime.setHours(endTime.getHours() + duration)

        set((state) => ({
          nfts: state.nfts.map((nft) =>
            nft.id === nftId
              ? {
                  ...nft,
                  status: "AUCTION",
                  price: startingPrice,
                  priceType,
                  auctionEndTime: endTime.toISOString(),
                  highestBid: undefined,
                  highestBidder: undefined,
                  highestBidderName: undefined,
                }
              : nft,
          ),
        }))
      },

      cancelListing: (nftId) => {
        set((state) => ({
          nfts: state.nfts.map((nft) =>
            nft.id === nftId
              ? {
                  ...nft,
                  status: "OWNED",
                  price: undefined,
                  priceType: undefined,
                  auctionEndTime: undefined,
                  highestBid: undefined,
                  highestBidder: undefined,
                  highestBidderName: undefined,
                }
              : nft,
          ),
        }))
      },

      buyNFT: (nftId, buyerId, buyerName) => {
        const nft = get().nfts.find((n) => n.id === nftId)
        if (!nft || nft.status !== "FOR_SALE" || !nft.price || !nft.priceType) return

        const userState = useUserStore.getState()

        // Check if buyer has enough funds
        if (
          (nft.priceType === "DOLLARS" && userState.wbuxDollars < nft.price) ||
          (nft.priceType === "TOKENS" && userState.wbuxBalance < nft.price)
        ) {
          return
        }

        // Transfer funds from buyer to seller
        if (nft.ownerId) {
          if (nft.priceType === "DOLLARS") {
            useUserStore.setState({ wbuxDollars: userState.wbuxDollars - nft.price })
            // Add funds to seller (would need a more complex system for this in a real app)
          } else {
            useUserStore.setState({ wbuxBalance: userState.wbuxBalance - nft.price })
            // Add tokens to seller (would need a more complex system for this in a real app)
          }
        }

        // Transfer NFT to buyer
        set((state) => ({
          nfts: state.nfts.map((n) =>
            n.id === nftId
              ? {
                  ...n,
                  status: "OWNED",
                  ownerId: buyerId,
                  ownerName: buyerName,
                  price: undefined,
                  priceType: undefined,
                }
              : n,
          ),
        }))
      },

      placeBid: (nftId, bidderId, bidderName, amount) => {
        const nft = get().nfts.find((n) => n.id === nftId)
        if (!nft || nft.status !== "AUCTION") return

        // Check if auction has ended
        if (nft.auctionEndTime && new Date(nft.auctionEndTime) < new Date()) return

        // Check if bid is higher than current highest bid or starting price
        if ((nft.highestBid && amount <= nft.highestBid) || (!nft.highestBid && amount < (nft.price || 0))) return

        // Check if bidder has enough funds
        const userState = useUserStore.getState()
        if (
          (nft.priceType === "DOLLARS" && userState.wbuxDollars < amount) ||
          (nft.priceType === "TOKENS" && userState.wbuxBalance < amount)
        ) {
          return
        }

        // Create new bid
        const newBid: Bid = {
          id: `bid_${Math.random().toString(36).substring(2, 9)}`,
          nftId,
          bidderId,
          bidderName,
          amount,
          timestamp: new Date().toISOString(),
        }

        // Update NFT with highest bid
        set((state) => ({
          bids: [...state.bids, newBid],
          nfts: state.nfts.map((n) =>
            n.id === nftId
              ? {
                  ...n,
                  highestBid: amount,
                  highestBidder: bidderId,
                  highestBidderName: bidderName,
                }
              : n,
          ),
        }))
      },

      getHighestBid: (nftId) => {
        const bids = get().bids.filter((bid) => bid.nftId === nftId)
        if (bids.length === 0) return undefined

        return bids.reduce((highest, bid) => (bid.amount > highest.amount ? bid : highest), bids[0])
      },

      finalizeAuction: (nftId) => {
        const nft = get().nfts.find((n) => n.id === nftId)
        if (!nft || nft.status !== "AUCTION") return

        // Check if auction has a highest bidder
        if (!nft.highestBidder || !nft.highestBidderName || !nft.highestBid) {
          // No bids, return to owner
          set((state) => ({
            nfts: state.nfts.map((n) =>
              n.id === nftId
                ? {
                    ...n,
                    status: "OWNED",
                    price: undefined,
                    priceType: undefined,
                    auctionEndTime: undefined,
                    highestBid: undefined,
                    highestBidder: undefined,
                    highestBidderName: undefined,
                  }
                : n,
            ),
          }))
          return
        }

        // Transfer NFT to highest bidder
        set((state) => ({
          nfts: state.nfts.map((n) =>
            n.id === nftId
              ? {
                  ...n,
                  status: "OWNED",
                  ownerId: nft.highestBidder,
                  ownerName: nft.highestBidderName,
                  price: undefined,
                  priceType: undefined,
                  auctionEndTime: undefined,
                  highestBid: undefined,
                  highestBidder: undefined,
                  highestBidderName: undefined,
                }
              : n,
          ),
        }))

        // Transfer funds from highest bidder to seller would happen here in a real app
      },

      activateNFT: (nftId) => {
        const nft = get().nfts.find((n) => n.id === nftId)
        if (!nft || nft.status !== "OWNED") return

        // Calculate activation end time based on boost duration
        let activatedUntil: string | undefined = undefined
        if (nft.boost.duration) {
          const endTime = new Date()
          endTime.setDate(endTime.getDate() + nft.boost.duration)
          activatedUntil = endTime.toISOString()
        }

        // Activate NFT
        set((state) => ({
          nfts: state.nfts.map((n) =>
            n.id === nftId
              ? {
                  ...n,
                  status: "ACTIVATED",
                  activatedUntil,
                }
              : n,
          ),
        }))
      },

      deactivateNFT: (nftId) => {
        set((state) => ({
          nfts: state.nfts.map((n) =>
            n.id === nftId
              ? {
                  ...n,
                  status: "OWNED",
                  activatedUntil: undefined,
                }
              : n,
          ),
        }))
      },

      getActiveNFTs: (userId) => {
        return get().nfts.filter((nft) => {
          if (nft.status !== "ACTIVATED" || nft.ownerId !== userId) return false

          // Check if activation has expired
          if (nft.activatedUntil && new Date(nft.activatedUntil) < new Date()) {
            // Auto-deactivate expired NFTs
            get().deactivateNFT(nft.id)
            return false
          }

          return true
        })
      },

      getOwnedNFTs: (userId) => {
        return get().nfts.filter((nft) => nft.ownerId === userId)
      },

      getMarketplaceNFTs: () => {
        return get().nfts.filter((nft) => nft.status === "FOR_SALE" || nft.status === "AUCTION")
      },

      getActiveAuctions: () => {
        return get().nfts.filter((nft) => {
          if (nft.status !== "AUCTION") return false

          // Check if auction has ended
          if (nft.auctionEndTime && new Date(nft.auctionEndTime) < new Date()) {
            // Auto-finalize ended auctions
            get().finalizeAuction(nft.id)
            return false
          }

          return true
        })
      },

      getNFTsByRarity: (rarity) => {
        return get().nfts.filter((nft) => nft.rarity === rarity)
      },

      getNFTsByType: (type) => {
        return get().nfts.filter((nft) => nft.type === type)
      },

      getNFTById: (id) => {
        return get().nfts.find((nft) => nft.id === id)
      },

      getBidsForNFT: (nftId) => {
        return get().bids.filter((bid) => bid.nftId === nftId)
      },

      getBidsByUser: (userId) => {
        return get().bids.filter((bid) => bid.bidderId === userId)
      },

      connectWallet: (address, userId) => {
        // In a real app, this would involve more complex wallet integration
        localStorage.setItem(`wallet_${userId}`, address)
      },

      disconnectWallet: (userId) => {
        localStorage.removeItem(`wallet_${userId}`)
      },

      getWalletAddress: (userId) => {
        return localStorage.getItem(`wallet_${userId}`)
      },

      calculateTotalBoost: (userId) => {
        const activeNFTs = get().getActiveNFTs(userId)

        // Initialize boost values
        let miningRate = 0
        let miningTime = 0
        let rewardMultiplier = 0
        let special = 0

        // Sum up boosts from all active NFTs
        activeNFTs.forEach((nft) => {
          switch (nft.boost.type) {
            case "MINING_RATE":
              miningRate += nft.boost.value
              break
            case "MINING_TIME":
              miningTime += nft.boost.value
              break
            case "REWARD_MULTIPLIER":
              rewardMultiplier += nft.boost.value
              break
            case "SPECIAL":
              special += nft.boost.value
              break
          }
        })

        return { miningRate, miningTime, rewardMultiplier, special }
      },
    }),
    {
      name: "whalebux-nft-storage",
    },
  ),
)

// Initialize some sample NFTs
export const initializeNFTs = () => {
  const store = useNFTStore.getState()

  // Check if NFTs are already initialized
  if (store.nfts.length > 0) return

  // Sample NFTs
  const sampleNFTs = [
    {
      name: "Mining Whale",
      description: "Increases mining rate by 10%",
      image: "/nfts/mining-whale.png",
      rarity: "GREEN" as NFTRarity,
      type: "MINING_BOOST" as NFTType,
      boost: {
        type: "MINING_RATE" as const,
        value: 10,
        duration: 7, // 7 days
      },
    },
    {
      name: "Time Dolphin",
      description: "Reduces mining cooldown by 15%",
      image: "/nfts/time-dolphin.png",
      rarity: "BLUE" as NFTRarity,
      type: "TIME_BOOST" as NFTType,
      boost: {
        type: "MINING_TIME" as const,
        value: 15,
        duration: 7, // 7 days
      },
    },
    {
      name: "Reward Orca",
      description: "Increases mining rewards by 20%",
      image: "/nfts/reward-orca.png",
      rarity: "PURPLE" as NFTRarity,
      type: "REWARD_BOOST" as NFTType,
      boost: {
        type: "REWARD_MULTIPLIER" as const,
        value: 20,
        duration: 7, // 7 days
      },
    },
    {
      name: "Golden Narwhal",
      description: "Increases all mining stats by 25%",
      image: "/nfts/golden-narwhal.png",
      rarity: "GOLD" as NFTRarity,
      type: "SPECIAL" as NFTType,
      boost: {
        type: "SPECIAL" as const,
        value: 25,
        duration: 14, // 14 days
      },
    },
    {
      name: "Christmas Beluga",
      description: "Special holiday edition with 30% mining boost",
      image: "/nfts/christmas-beluga.png",
      rarity: "WHITE" as NFTRarity,
      type: "COLLECTOR" as NFTType,
      boost: {
        type: "MINING_RATE" as const,
        value: 30,
        duration: 30, // 30 days
      },
    },
  ]

  // Add sample NFTs to store
  sampleNFTs.forEach((nft) => store.addNFT(nft))
}
