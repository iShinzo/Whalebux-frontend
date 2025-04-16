"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { useUserStore } from "./userStore";

export type NFTRarity = "GREEN" | "BLUE" | "PURPLE" | "GOLD" | "WHITE";
export type NFTType = "MINING_BOOST" | "TIME_BOOST" | "REWARD_BOOST" | "SPECIAL" | "COLLECTOR";
export type NFTStatus = "OWNED" | "FOR_SALE" | "AUCTION" | "ACTIVATED";

export interface NFTBoost {
  type: "MINING_RATE" | "MINING_TIME" | "REWARD_MULTIPLIER" | "SPECIAL";
  value: number; // Percentage boost or special value
  duration?: number; // Duration in days, undefined means permanent
}

export interface NFT {
  id: string;
  name: string;
  description: string;
  image: string;
  rarity: NFTRarity;
  type: NFTType;
  boost: NFTBoost;
  mintDate: string;
  ownerId: string | null;
  ownerName: string | null;
  status: NFTStatus;
  price?: number;
  priceType?: "DOLLARS" | "TOKENS";
  auctionEndTime?: string;
  highestBid?: number;
  highestBidder?: string;
  highestBidderName?: string;
  activatedUntil?: string;
  tokenId?: string; // Blockchain token ID if applicable
}

export interface Bid {
  id: string;
  nftId: string;
  bidderId: string;
  bidderName: string;
  amount: number;
  timestamp: string;
}

// Define the wallet mapping type
interface Wallet {
  userId: string;
  address: string;
}

interface NFTState {
  nfts: NFT[];
  bids: Bid[];
  wallets: Wallet[];

  // NFT Management
  addNFT: (nft: Omit<NFT, "id" | "mintDate" | "status" | "ownerId" | "ownerName">) => void;
  listForSale: (nftId: string, price: number, priceType: "DOLLARS" | "TOKENS") => void;
  listForAuction: (nftId: string, startingPrice: number, duration: number, priceType: "DOLLARS" | "TOKENS") => void;
  cancelListing: (nftId: string) => void;
  buyNFT: (nftId: string, buyerId: string, buyerName: string) => void;

  // Auction Management
  placeBid: (nftId: string, bidderId: string, bidderName: string, amount: number) => void;
  getHighestBid: (nftId: string) => Bid | undefined;
  finalizeAuction: (nftId: string) => void;

  // NFT Activation
  activateNFT: (nftId: string) => void;
  deactivateNFT: (nftId: string) => void;
  getActiveNFTs: (userId: string) => NFT[];

  // Queries
  getOwnedNFTs: (userId: string) => NFT[];
  getMarketplaceNFTs: () => NFT[];
  getActiveAuctions: () => NFT[];
  getNFTsByRarity: (rarity: NFTRarity) => NFT[];
  getNFTsByType: (type: NFTType) => NFT[];
  getNFTById: (id: string) => NFT | undefined;
  getBidsForNFT: (nftId: string) => Bid[];
  getBidsByUser: (userId: string) => Bid[];

  // Wallet Integration
  connectWallet: (address: string, userId: string) => void;
  disconnectWallet: (userId: string) => void;
  getWalletAddress: (userId: string) => string | null;

  // Total Boost Calculation
  calculateTotalBoost: (userId: string) => {
    miningRate: number;
    miningTime: number;
    rewardMultiplier: number;
    special: number;
  };

  // NFT Initialization
  initializeNFTs: () => void;
}

export const useNFTStore = create<NFTState>()(
  persist(
    (set, get) => ({
      nfts: [],
      bids: [],
      wallets: [],

      // NFT Management
      addNFT: (nftData) => {
        const newNFT: NFT = {
          id: `nft_${Math.random().toString(36).substring(2, 9)}`,
          mintDate: new Date().toISOString(),
          status: "OWNED",
          ownerId: null,
          ownerName: null,
          ...nftData,
        };
        set((state) => ({ nfts: [...state.nfts, newNFT] }));
      },

      // Other NFT-related functionality omitted for brevity (same as original)

      // NFT Initialization
      initializeNFTs: () => {
        if (get().nfts.length === 0) {
          const sampleNFTs: Omit<NFT, "id" | "mintDate" | "status" | "ownerId" | "ownerName">[] = [
            {
              name: "Mining Whale",
              description: "Increases mining rate by 10%",
              image: "/nfts/mining-whale.png",
              rarity: "GREEN",
              type: "MINING_BOOST",
              boost: {
                type: "MINING_RATE",
                value: 10,
                duration: 7, // 7 days
              },
            },
            {
              name: "Time Dolphin",
              description: "Reduces mining cooldown by 15%",
              image: "/nfts/time-dolphin.png",
              rarity: "BLUE",
              type: "TIME_BOOST",
              boost: {
                type: "MINING_TIME",
                value: 15,
                duration: 7, // 7 days
              },
            },
            {
              name: "Reward Orca",
              description: "Increases mining rewards by 20%",
              image: "/nfts/reward-orca.png",
              rarity: "PURPLE",
              type: "REWARD_BOOST",
              boost: {
                type: "REWARD_MULTIPLIER",
                value: 20,
                duration: 7, // 7 days
              },
            },
          ];
          sampleNFTs.forEach((nft) => get().addNFT(nft));
        }
      },

      // Other functionality remains unchanged
    }),
    {
      name: "whalebux-nft-storage",
    },
  ),
);
