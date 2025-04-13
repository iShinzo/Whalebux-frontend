"use client";

import { useState, useMemo, useEffect } from "react";
import type { NFT, NFTRarity, NFTType } from "../../lib/stores/nftStore";

// Placeholder interface for NFTCard props
interface NFTCardProps {
  nft: NFT;
  onClick: (nft: NFT) => void;
  showActions: boolean;
  "aria-label": string;
}

// Placeholder interface for NFTModal props
interface NFTModalProps {
  nft: NFT;
  onClose: () => void;
}

// Define the NFTCard component with proper typing (assuming it's a separate file)
const NFTCard = (props: NFTCardProps) => {
  // This is a placeholder implementation
  // Replace with the actual NFTCard component code
  const { nft, onClick, showActions, ...rest } = props;
  return (
    <div onClick={() => onClick(nft)} {...rest}>
      <h3>{nft.name || "Unnamed NFT"}</h3>
      <p>Rarity: {nft.rarity}</p>
      <p>Type: {nft.type}</p>
      {showActions && <button>Action</button>}
    </div>
  );
};

// Define the NFTModal component with proper typing (assuming it's a separate file)
const NFTModal = ({ nft, onClose }: NFTModalProps) => {
  // This is a placeholder implementation
  // Replace with the actual NFTModal component code
  return (
    <div className="modal">
      <h2>{nft.name || "Unnamed NFT"}</h2>
      <p>Rarity: {nft.rarity}</p>
      <p>Type: {nft.type}</p>
      <button onClick={onClose}>Close</button>
    </div>
  );
};

// Reusable EmptyState component
const EmptyState = ({ message }: { message: string }) => (
  <div
    className="bg-gray-800 rounded-lg p-8 text-center min-h-[200px] flex items-center justify-center"
    role="alert"
    aria-live="polite"
  >
    <p className="text-gray-400">{message}</p>
  </div>
);

interface NFTGridProps {
  nfts: NFT[];
  showActions?: boolean;
}

export default function NFTGrid({ nfts, showActions = false }: NFTGridProps) {
  const [selectedNFT, setSelectedNFT] = useState<NFT | null>(null);
  const [filter, setFilter] = useState<NFTRarity | "ALL">("ALL");
  const [typeFilter, setTypeFilter] = useState<NFTType | "ALL">("ALL");
  const [sortBy, setSortBy] = useState<"rarity" | "price" | "newest">("rarity");
  const [loading, setLoading] = useState(true); // Add loading state

  // Simulate loading (remove this if you're fetching NFTs from an API)
  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1000); // Simulate a 1-second load
    return () => clearTimeout(timer);
  }, []);

  // Memoized filtered NFTs
  const filteredNFTs = useMemo(() => {
    return nfts.filter((nft) => {
      if (filter !== "ALL" && nft.rarity !== filter) return false;
      if (typeFilter !== "ALL" && nft.type !== typeFilter) return false;
      return true;
    });
  }, [nfts, filter, typeFilter]);

  // Memoized sorted NFTs
  const sortedNFTs = useMemo(() => {
    return [...filteredNFTs].sort((a, b) => {
      if (sortBy === "rarity") {
        return getRarityValue(b.rarity) - getRarityValue(a.rarity);
      } else if (sortBy === "price") {
        const aPrice = a.price || 0;
        const bPrice = b.price || 0;
        return bPrice - aPrice;
      } else {
        return new Date(b.mintDate).getTime() - new Date(a.mintDate).getTime();
      }
    });
  }, [filteredNFTs, sortBy]);

  // Handler for NFT clicks
  const handleNFTClick = (nft: NFT) => {
    setSelectedNFT(nft);
  };

  // Helper to render filter buttons
  const renderFilterButton = (
    label: string,
    value: string,
    activeValue: string,
    onClick: () => void
  ) => (
    <button
      className={`px-3 py-1 text-sm rounded-full transition-colors duration-200 ${
        activeValue === value
          ? "bg-blue-600 text-white"
          : "bg-gray-700 text-gray-300 hover:bg-gray-600"
      }`}
      onClick={onClick}
      aria-pressed={activeValue === value}
    >
      {label}
    </button>
  );

  return (
    <div className="space-y-6">
      {/* Rarity Filter */}
      <div className="flex flex-wrap gap-2">
        {renderFilterButton("All Rarities", "ALL", filter, () => setFilter("ALL"))}
        {renderFilterButton("Green", "GREEN", filter, () => setFilter("GREEN"))}
        {renderFilterButton("Blue", "BLUE", filter, () => setFilter("BLUE"))}
        {renderFilterButton("Purple", "PURPLE", filter, () => setFilter("PURPLE"))}
        {renderFilterButton("Gold", "GOLD", filter, () => setFilter("GOLD"))}
        {renderFilterButton("White", "WHITE", filter, () => setFilter("WHITE"))}
      </div>

      {/* Type Filter */}
      <div className="flex flex-wrap gap-2">
        {renderFilterButton("All Types", "ALL", typeFilter, () => setTypeFilter("ALL"))}
        {renderFilterButton("Mining Boost", "MINING_BOOST", typeFilter, () =>
          setTypeFilter("MINING_BOOST")
        )}
        {renderFilterButton("Time Boost", "TIME_BOOST", typeFilter, () =>
          setTypeFilter("TIME_BOOST")
        )}
        {renderFilterButton("Reward Boost", "REWARD_BOOST", typeFilter, () =>
          setTypeFilter("REWARD_BOOST")
        )}
        {renderFilterButton("Special", "SPECIAL", typeFilter, () =>
          setTypeFilter("SPECIAL")
        )}
        {renderFilterButton("Collector", "COLLECTOR", typeFilter, () =>
          setTypeFilter("COLLECTOR")
        )}
      </div>

      {/* Sort By */}
      <div className="flex justify-between items-center">
        <div className="text-sm text-gray-400">{sortedNFTs.length} NFTs</div>
        <div className="flex items-center">
          <label htmlFor="sortBy" className="text-sm text-gray-400 mr-2">
            Sort by:
          </label>
          <select
            id="sortBy"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as "rarity" | "price" | "newest")}
            className="bg-gray-700 text-white text-sm rounded px-2 py-1 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="rarity">Rarity</option>
            <option value="price">Price</option>
            <option value="newest">Newest</option>
          </select>
        </div>
      </div>

      {/* NFT Grid */}
      {loading ? (
        <EmptyState message="Loading NFTs..." />
      ) : sortedNFTs.length > 0 ? (
        <section
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
          role="grid"
          aria-label="NFT Collection"
        >
          {sortedNFTs.map((nft) => (
            <NFTCard
              key={nft.id}
              nft={nft}
              onClick={() => handleNFTClick(nft)}
              showActions={showActions}
              aria-label={`View details for NFT ${nft.name || nft.id}`}
            />
          ))}
        </section>
      ) : (
        <EmptyState message="No NFTs found matching your filters." />
      )}

      {/* NFT Modal */}
      {selectedNFT && <NFTModal nft={selectedNFT} onClose={() => setSelectedNFT(null)} />}
    </div>
  );
}

// Helper function to get rarity value for sorting
function getRarityValue(rarity: NFTRarity): number {
  switch (rarity) {
    case "WHITE":
      return 5;
    case "GOLD":
      return 4;
    case "PURPLE":
      return 3;
    case "BLUE":
      return 2;
    case "GREEN":
      return 1;
    default:
      return 0;
  }
}
