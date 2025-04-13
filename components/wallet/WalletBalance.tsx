"use client"

import { useState, useEffect, useMemo } from "react"
import { useUserStore } from "../../lib/stores/userStore"
import { useWalletStore } from "../../lib/stores/walletStore"

export default function WalletBalance() {
  const { userId } = useUserStore()
  const { getWalletConnection } = useWalletStore()

  const [tokenBalance, setTokenBalance] = useState<number | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Memoize wallet connection to prevent unnecessary re-renders
  const walletConnection = useMemo(() => (userId ? getWalletConnection(userId) : undefined), [userId, getWalletConnection])
  const isConnected = !!walletConnection

  // Fetch token balance when connected
  useEffect(() => {
    if (!isConnected) {
      setTokenBalance(null)
      setError(null)
      return
    }

    const fetchBalance = async () => {
      setLoading(true)
      setError(null) // Reset error state
      try {
        // Simulate API call to fetch token balance
        await new Promise((resolve) => setTimeout(resolve, 1000))

        // Mock balance
        const mockBalance = Math.floor(Math.random() * 10000) / 100
        setTokenBalance(mockBalance)
      } catch (err) {
        console.error("Error fetching token balance:", err)
        setError("Failed to fetch balance. Please try again.")
        setTokenBalance(null)
      } finally {
        setLoading(false)
      }
    }

    fetchBalance()
  }, [isConnected])

  if (!isConnected) {
    return (
      <div className="bg-gray-800 rounded-lg p-4">
        <h2 className="text-xl font-semibold text-white mb-4">Wallet Balance</h2>
        <div className="text-center py-6">
          <p className="text-gray-400">Connect your wallet to view your balance</p>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-gray-800 rounded-lg p-4">
      <h2 className="text-xl font-semibold text-white mb-4">Wallet Balance</h2>

      <div className="bg-gray-700 rounded-lg p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <TokenIcon />
            <div className="ml-3">
              <div className="text-white font-medium">WBUX Token</div>
              <div className="text-gray-400 text-sm">On {getChainName(walletConnection?.chainId)}</div>
            </div>
          </div>
          <div className="text-right">
            {loading ? (
              <div className="h-6 w-16 bg-gray-600 rounded animate-pulse"></div>
            ) : error ? (
              <div className="text-red-400 text-sm">{error}</div>
            ) : (
              <div className="text-white font-bold text-xl">{tokenBalance !== null ? tokenBalance : "—"}</div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

// Reusable component for the token icon
function TokenIcon() {
  return (
    <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-6 w-6 text-white"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
    </div>
  )
}

// Improved chain name lookup
const chainNames: Record<number, string> = {
  1: "Ethereum",
  56: "BSC",
  137: "Polygon",
  43114: "Avalanche",
}

function getChainName(chainId?: number): string {
  return chainId ? chainNames[chainId] || "Unknown Chain" : "Unknown Chain"
}
