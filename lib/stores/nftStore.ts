"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export type NFTRarity = "GREEN" | "BLUE" | "PURPLE" | "GOLD" | "WHITE";
export type NFTType = "MINING_BOOST" | "TIME_BOOST" | "REWARD_BOOST" | "SPECIAL" | "COLLECTOR";
export type NFTStatus = "OWNED" | "FOR_SALE" | "AUCTION" | "ACTIVATED";

export interface NFTBoost {
  type: "MINING_RATE" | "MINING_TIME" | "REWARD_MULTIPLIER" | "SPECIAL";
  value: number;
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

export interface Wallet {
  userId: string;
  address: string;
}

export interface BoostTotals {
  miningRate: number;
  miningTime: number;
  rewardMultiplier: number;
  special: number;
}

interface NFTState {
  nfts: NFT[];
  bids: Bid[];
  wallets: Wallet[];

  // NFT Management
  addNFT: (nft: Omit<NFT, "id" | "mintDate" | "status" | "ownerId" | "ownerName">) => void;
  activateNFT: (nftId: string) => void;
  deactivateNFT: (nftId: string) => void;
  listForSale: (nftId: string, price: number, priceType: "DOLLARS" | "TOKENS") => void;
  listForAuction: (nftId: string, startingPrice: number, endTime: string) => void;
  cancelListing: (nftId: string) => void;

  // Queries
  getOwnedNFTs: (userId: string) => NFT[];
  getMarketplaceNFTs: () => NFT[];
  getActiveNFTs: (userId: string) => NFT[];
  calculateTotalBoost: (userId: string) => BoostTotals;

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
      activateNFT: (nftId) => {
        set((state) => ({
          nfts: state.nfts.map((nft) =>
            nft.id === nftId ? { ...nft, status: "ACTIVATED" } : nft
          ),
        }));
      },
      deactivateNFT: (nftId) => {
        set((state) => ({
          nfts: state.nfts.map((nft) =>
            nft.id === nftId ? { ...nft, status: "OWNED" } : nft
          ),
        }));
      },
      listForSale: (nftId, price, priceType) => {
        set((state) => ({
          nfts: state.nfts.map((nft) =>
            nft.id === nftId
              ? { ...nft, status: "FOR_SALE", price, priceType }
              : nft
          ),
        }));
      },
      listForAuction: (nftId, startingPrice, endTime) => {
        set((state) => ({
          nfts: state.nfts.map((nft) =>
            nft.id === nftId
              ? {
                  ...nft,
                  status: "AUCTION",
                  price: startingPrice,
                  auctionEndTime: endTime,
                }
              : nft
          ),
        }));
      },
      cancelListing: (nftId) => {
        set((state) => ({
          nfts: state.nfts.map((nft) =>
            nft.id === nftId
              ? { ...nft, status: "OWNED", price: undefined, priceType: undefined, auctionEndTime: undefined }
              : nft
          ),
        }));
      },

      // Queries
      getOwnedNFTs: (userId) => get().nfts.filter((nft) => nft.ownerId === userId),
      getMarketplaceNFTs: () => get().nfts.filter((nft) => nft.status === "FOR_SALE"),
      getActiveNFTs: (userId) => get().nfts.filter((nft) => nft.ownerId === userId && nft.status === "ACTIVATED"),
      calculateTotalBoost: (userId) => {
        const activeNFTs = get().getActiveNFTs(userId);
        return activeNFTs.reduce(
          (totals, nft) => {
            switch (nft.boost.type) {
              case "MINING_RATE":
                totals.miningRate += nft.boost.value;
                break;
              case "MINING_TIME":
                totals.miningTime += nft.boost.value;
                break;
              case "REWARD_MULTIPLIER":
                totals.rewardMultiplier += nft.boost.value;
                break;
              case "SPECIAL":
                totals.special += nft.boost.value;
                break;
            }
            return totals;
          },
          { miningRate: 0, miningTime: 0, rewardMultiplier: 0, special: 0 }
        );
      },

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
    }),
    {
      name: "whalebux-nft-storage",
    }
  )
);

// Export the initializeNFTs function for external use
export const initializeNFTs = useNFTStore.getState().initializeNFTs;
