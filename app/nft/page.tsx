"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useUserStore } from "../../lib/stores/userStore";
import { useNFTStore, initializeNFTs } from "../../lib/stores/nftStore";
import NFTGrid from "../../components/nft/NFTGrid";
import WalletConnect from "../../components/wallet/WalletConnect";
import WalletBalance from "../../components/wallet/WalletBalance";

export default function NFTMarketplace() {
  const router = useRouter();
  const { userId } = useUserStore();
  const { getMarketplaceNFTs, getOwnedNFTs, getActiveNFTs } = useNFTStore();

  const [activeTab, setActiveTab] = useState<"marketplace" | "my-nfts" | "active-nfts">("marketplace");

  // Initialize sample NFTs
  useEffect(() => {
    initializeNFTs();
  }, []);

  const marketplaceNFTs = getMarketplaceNFTs();
  const ownedNFTs = userId ? getOwnedNFTs(userId) : [];
  const activeNFTs = userId ? getActiveNFTs(userId) : [];

  return (
    <div className="min-h-screen bg-gray-900 pb-20">
      <div className="max-w-6xl mx-auto p-4">
        <div className="flex items-center mb-6">
          <button onClick={() => router.push("/")} className="text-gray-400 hover:text-white mr-4">
            ← Back
          </button>
          <h1 className="text-2xl font-bold text-white">NFT Marketplace</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-3">
            <div className="bg-gray-800 rounded-lg mb-6 overflow-hidden">
              <div className="flex flex-wrap">
                <button
                  className={`py-3 px-4 text-sm font-medium ${
                    activeTab === "marketplace" ? "bg-blue-600 text-white" : "text-gray-300 hover:bg-gray-700"
                  }`}
                  onClick={() => setActiveTab("marketplace")}
                >
                  Marketplace
                </button>
                <button
                  className={`py-3 px-4 text-sm font-medium ${
                    activeTab === "my-nfts" ? "bg-blue-600 text-white" : "text-gray-300 hover:bg-gray-700"
                  }`}
                  onClick={() => setActiveTab("my-nfts")}
                >
                  My NFTs
                </button>
                <button
                  className={`py-3 px-4 text-sm font-medium ${
                    activeTab === "active-nfts" ? "bg-blue-600 text-white" : "text-gray-300 hover:bg-gray-700"
                  }`}
                  onClick={() => setActiveTab("active-nfts")}
                >
                  Active Boosts
                </button>
              </div>
            </div>

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
                      <div className="bg-gray-700 rounded-lg p-4 mb-6">
                        <h3 className="text-lg font-medium text-white mb-2">Total Active Boosts</h3>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="bg-gray-800 p-3 rounded-lg">
                            <div className="text-sm text-gray-400 mb-1">Mining Rate:</div>
                            <div className="text-green-400 font-bold text-lg">
                              +
                              {activeNFTs.reduce(
                                (total, nft) => total + (nft.boost.type === "MINING_RATE" ? nft.boost.value : 0),
                                0
                              )}
                              %
                            </div>
                          </div>
                          <div className="bg-gray-800 p-3 rounded-lg">
                            <div className="text-sm text-gray-400 mb-1">Mining Time:</div>
                            <div className="text-green-400 font-bold text-lg">
                              +
                              {activeNFTs.reduce(
                                (total, nft) => total + (nft.boost.type === "MINING_TIME" ? nft.boost.value : 0),
                                0
                              )}
                              %
                            </div>
                          </div>
                          <div className="bg-gray-800 p-3 rounded-lg">
                            <div className="text-sm text-gray-400 mb-1">Reward Multiplier:</div>
                            <div className="text-green-400 font-bold text-lg">
                              +
                              {activeNFTs.reduce(
                                (total, nft) => total + (nft.boost.type === "REWARD_MULTIPLIER" ? nft.boost.value : 0),
                                0
                              )}
                              %
                            </div>
                          </div>
                          <div className="bg-gray-800 p-3 rounded-lg">
                            <div className="text-sm text-gray-400 mb-1">Special Boosts:</div>
                            <div className="text-green-400 font-bold text-lg">
                              +
                              {activeNFTs.reduce(
                                (total, nft) => total + (nft.boost.type === "SPECIAL" ? nft.boost.value : 0),
                                0
                              )}
                              %
                            </div>
                          </div>
                        </div>
                      </div>
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

          <div className="space-y-6">
            <WalletConnect />
            <WalletBalance />

            <div className="bg-gray-800 rounded-lg p-4">
              <h2 className="text-xl font-semibold text-white mb-4">NFT Rarity Guide</h2>
              <div className="space-y-3">
                <div className="flex items-center">
                  <div className="w-4 h-4 rounded-full bg-green-500 mr-2"></div>
                  <div className="text-white">Green - Common (10% boost)</div>
                </div>
                <div className="flex items-center">
                  <div className="w-4 h-4 rounded-full bg-blue-500 mr-2"></div>
                  <div className="text-white">Blue - Uncommon (15% boost)</div>
                </div>
                <div className="flex items-center">
                  <div className="w-4 h-4 rounded-full bg-purple-500 mr-2"></div>
                  <div className="text-white">Purple - Rare (20% boost)</div>
                </div>
                <div className="flex items-center">
                  <div className="w-4 h-4 rounded-full bg-yellow-500 mr-2"></div>
                  <div className="text-white">Gold - Epic (25% boost)</div>
                </div>
                <div className="flex items-center">
                  <div className="w-4 h-4 rounded-full bg-white mr-2"></div>
                  <div className="text-white">White - Special Edition (30% boost)</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
