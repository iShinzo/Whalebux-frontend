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

// Define the NFTCard component
const NFTCard = (props: NFTCardProps) => {
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

// Define the NFTModal component
const NFTModal = ({ nft, onClose }: { nft: NFT; onClose: () => void }) => {
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
  const [loading, setLoading] = useState(true);

  // Simulate loading using a more secure approach
  useEffect(() => {
    const timerId = window.setTimeout(() => setLoading(false), 1000);
    return () => window.clearTimeout(timerId); // Use clearTimeout to clean up
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
        return (b.price || 0) - (a.price || 0);
      } else {
        return new Date(b.mintDate).getTime() - new Date(a.mintDate).getTime();
      }
    });
  }, [filteredNFTs, sortBy]);

  return (
    <div className="space-y-6">
      {/* Filters and Sorting */}
      <div className="flex flex-wrap gap-2">
        {/* Filters */}
        <button onClick={() => setFilter("ALL")}>All Rarities</button>
        {/* Add other filter buttons */}
      </div>

      {loading ? (
        <EmptyState message="Loading NFTs..." />
      ) : sortedNFTs.length > 0 ? (
        <section>
          {sortedNFTs.map((nft) => (
            <NFTCard
              key={nft.id}
              nft={nft}
              onClick={() => setSelectedNFT(nft)}
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
