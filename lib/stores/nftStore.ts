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

      listForSale: (nftId, price, priceType) => {
        set((state) => ({
          nfts: state.nfts.map((nft) =>
            nft.id === nftId
              ? {
                  ...nft,
                  status: "FOR_SALE" as NFTStatus,
                  price,
                  priceType,
                  auctionEndTime: undefined,
                  highestBid: undefined,
                  highestBidder: undefined,
                  highestBidderName: undefined,
                  activatedUntil: undefined, // Cannot be activated while for sale
                }
              : nft,
          ),
        }));
      },

      listForAuction: (nftId, startingPrice, duration, priceType) => {
        const endTime = new Date();
        endTime.setHours(endTime.getHours() + duration);

        set((state) => ({
          nfts: state.nfts.map((nft) =>
            nft.id === nftId
              ? {
                  ...nft,
                  status: "AUCTION" as NFTStatus,
                  price: startingPrice,
                  priceType,
                  auctionEndTime: endTime.toISOString(),
                  highestBid: undefined,
                  highestBidder: undefined,
                  highestBidderName: undefined,
                  activatedUntil: undefined, // Cannot be activated while in auction
                }
              : nft,
          ),
        }));
      },

      cancelListing: (nftId) => {
        set((state) => ({
          nfts: state.nfts.map((nft) =>
            nft.id === nftId
              ? {
                  ...nft,
                  status: "OWNED" as NFTStatus,
                  price: undefined,
                  priceType: undefined,
                  auctionEndTime: undefined,
                  highestBid: undefined,
                  highestBidder: undefined,
                  highestBidderName: undefined,
                }
              : nft,
          ),
        }));
      },

      buyNFT: (nftId, buyerId, buyerName) => {
        const nft = get().nfts.find((n) => n.id === nftId);
        if (!nft || nft.status !== "FOR_SALE" || !nft.price || !nft.priceType) {
          console.warn("Cannot buy NFT: Invalid NFT or not for sale");
          return;
        }

        const userState = useUserStore.getState();
        const buyerBalance =
          nft.priceType === "DOLLARS" ? userState.wbuxDollars : userState.wbuxBalance;

        if (typeof buyerBalance !== "number" || buyerBalance < nft.price) {
          console.warn("Cannot buy NFT: Insufficient balance");
          return;
        }

        // Deduct balance from buyer (you'd typically do this via an API call)
        if (nft.priceType === "DOLLARS") {
          useUserStore.setState((state) => ({
            wbuxDollars: state.wbuxDollars - nft.price!,
          }));
        } else {
          useUserStore.setState((state) => ({
            wbuxBalance: state.wbuxBalance - nft.price!,
          }));
        }

        // Transfer NFT to buyer
        set((state) => ({
          nfts: state.nfts.map((n) =>
            n.id === nftId
              ? {
                  ...n,
                  status: "OWNED" as NFTStatus,
                  ownerId: buyerId,
                  ownerName: buyerName,
                  price: undefined,
                  priceType: undefined,
                }
              : n,
          ),
        }));
      },

      // Auction Management
      placeBid: (nftId, bidderId, bidderName, amount) => {
        const nft = get().nfts.find((n) => n.id === nftId);
        if (!nft || nft.status !== "AUCTION") {
          console.warn("Cannot place bid: NFT not in auction");
          return;
        }

        const auctionEndTime = nft.auctionEndTime ? new Date(nft.auctionEndTime) : null;
        if (auctionEndTime && auctionEndTime < new Date()) {
          console.warn("Cannot place bid: Auction has ended");
          return;
        }

        const userState = useUserStore.getState();
        const bidderBalance =
          nft.priceType === "DOLLARS" ? userState.wbuxDollars : userState.wbuxBalance;

        if (typeof bidderBalance !== "number" || bidderBalance < amount) {
          console.warn("Cannot place bid: Insufficient balance");
          return;
        }

        if (nft.highestBid && amount <= nft.highestBid) {
          console.warn("Cannot place bid: Bid must be higher than current highest bid");
          return;
        }

        const newBid: Bid = {
          id: `bid_${Math.random().toString(36).substring(2, 9)}`,
          nftId,
          bidderId,
          bidderName,
          amount,
          timestamp: new Date().toISOString(),
        };

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
        }));
      },

      getHighestBid: (nftId) => {
        const bids = get().bids.filter((b) => b.nftId === nftId);
        if (bids.length === 0) return undefined;
        return bids.reduce((highest, bid) => (bid.amount > highest.amount ? bid : highest), bids[0]);
      },

      finalizeAuction: (nftId) => {
        const nft = get().nfts.find((n) => n.id === nftId);
        if (!nft || nft.status !== "AUCTION") {
          console.warn("Cannot finalize auction: NFT not in auction");
          return;
        }

        const auctionEndTime = nft.auctionEndTime ? new Date(nft.auctionEndTime) : null;
        if (auctionEndTime && auctionEndTime > new Date()) {
          console.warn("Cannot finalize auction: Auction has not ended");
          return;
        }

        if (!nft.highestBidder || !nft.highestBidderName || !nft.highestBid) {
          // No bids, return NFT to owner
          set((state) => ({
            nfts: state.nfts.map((n) =>
              n.id === nftId
                ? {
                    ...n,
                    status: "OWNED" as NFTStatus,
                    ownerId: null,
                    ownerName: null,
                    price: undefined,
                    priceType: undefined,
                    auctionEndTime: undefined,
                    highestBid: undefined,
                    highestBidder: undefined,
                    highestBidderName: undefined,
                  }
                : n,
            ),
          }));
          return;
        }

        const userState = useUserStore.getState();
        const bidderBalance =
          nft.priceType === "DOLLARS" ? userState.wbuxDollars : userState.wbuxBalance;

        if (typeof bidderBalance !== "number" || bidderBalance < nft.highestBid) {
          console.warn("Cannot finalize auction: Bidder balance insufficient");
          return;
        }

        // Deduct balance from highest bidder
        if (nft.priceType === "DOLLARS") {
          useUserStore.setState((state) => ({
            wbuxDollars: state.wbuxDollars - nft.highestBid!,
          }));
        } else {
          useUserStore.setState((state) => ({
            wbuxBalance: state.wbuxBalance - nft.highestBid!,
          }));
        }

        // Transfer NFT to highest bidder
        set((state) => ({
          nfts: state.nfts.map((n) =>
            n.id === nftId
              ? {
                  ...n,
                  status: "OWNED" as NFTStatus,
                  ownerId: nft.highestBidder!,
                  ownerName: nft.highestBidderName!,
                  price: undefined,
                  priceType: undefined,
                  auctionEndTime: undefined,
                  highestBid: undefined,
                  highestBidder: undefined,
                  highestBidderName: undefined,
                }
              : n,
          ),
        }));
      },

      // NFT Activation
      activateNFT: (nftId) => {
        const nft = get().nfts.find((n) => n.id === nftId);
        if (!nft || nft.status !== "OWNED") {
          console.warn("Cannot activate NFT: NFT not owned");
          return;
        }

        const activatedUntil = new Date();
        if (nft.boost.duration) {
          activatedUntil.setDate(activatedUntil.getDate() + nft.boost.duration);
        } else {
          // Permanent activation (e.g., set to a far future date)
          activatedUntil.setFullYear(activatedUntil.getFullYear() + 100);
        }

        set((state) => ({
          nfts: state.nfts.map((n) =>
            n.id === nftId
              ? {
                  ...n,
                  status: "ACTIVATED" as NFTStatus,
                  activatedUntil: activatedUntil.toISOString(),
                }
              : n,
          ),
        }));
      },

      deactivateNFT: (nftId) => {
        set((state) => ({
          nfts: state.nfts.map((n) =>
            n.id === nftId
              ? {
                  ...n,
                  status: "OWNED" as NFTStatus,
                  activatedUntil: undefined,
                }
              : n,
          ),
        }));
      },

      getActiveNFTs: (userId) => {
        const now = new Date();
        return get()
          .nfts.filter(
            (nft) =>
              nft.ownerId === userId &&
              nft.status === "ACTIVATED" &&
              nft.activatedUntil &&
              new Date(nft.activatedUntil) > now,
          )
          .map((nft) => ({
            ...nft,
            status: new Date(nft.activatedUntil!) <= now ? ("OWNED" as NFTStatus) : nft.status,
          }));
      },

      // Queries
      getOwnedNFTs: (userId) => {
        return get().nfts.filter((nft) => nft.ownerId === userId);
      },

      getMarketplaceNFTs: () => {
        return get().nfts.filter((nft) => nft.status === "FOR_SALE");
      },

      getActiveAuctions: () => {
        const now = new Date();
        return get()
          .nfts.filter(
            (nft) =>
              nft.status === "AUCTION" &&
              nft.auctionEndTime &&
              new Date(nft.auctionEndTime) > now,
          )
          .map((nft) => ({
            ...nft,
            status:
              nft.auctionEndTime && new Date(nft.auctionEndTime) <= now
                ? ("OWNED" as NFTStatus)
                : nft.status,
          }));
      },

      getNFTsByRarity: (rarity) => {
        return get().nfts.filter((nft) => nft.rarity === rarity);
      },

      getNFTsByType: (type) => {
        return get().nfts.filter((nft) => nft.type === type);
      },

      getNFTById: (id) => {
        return get().nfts.find((nft) => nft.id === id);
      },

      getBidsForNFT: (nftId) => {
        return get().bids.filter((bid) => bid.nftId === nftId);
      },

      getBidsByUser: (userId) => {
        return get().bids.filter((bid) => bid.bidderId === userId);
      },

      // Wallet Integration
      connectWallet: (address, userId) => {
        set((state) => ({
          wallets: [...state.wallets.filter((w) => w.userId !== userId), { userId, address }],
        }));
      },

      disconnectWallet: (userId) => {
        set((state) => ({
          wallets: state.wallets.filter((w) => w.userId !== userId),
        }));
      },

      getWalletAddress: (userId) => {
        const wallet = get().wallets.find((w) => w.userId === userId);
        return wallet ? wallet.address : null;
      },

      // Total Boost Calculation
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
          { miningRate: 0, miningTime: 0, rewardMultiplier: 0, special: 0 },
        );
      },
    }),
    {
      name: "whalebux-nft-storage",
    },
  ),
);
