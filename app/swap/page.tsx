"use client"

import { useRouter } from "next/navigation"
import { useUserStore } from "../../lib/stores/userStore"
import SwapForm from "../../components/swap/SwapForm"
import SwapHistory from "../../components/swap/SwapHistory"
import SwapStats from "../../components/swap/SwapStats"
import WalletConnect from "../../components/wallet/WalletConnect"
import WalletBalance from "../../components/wallet/WalletBalance"

export default function SwapPage() {
  const router = useRouter()
  const { userId } = useUserStore()

  // Redirect to login if userId is not available (placeholder for actual implementation)
  if (!userId) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Please log in to access the Swap Page</h1>
          <button
            onClick={() => router.push("/login")}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md"
          >
            Go to Login
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-900 pb-20">
      <div className="max-w-6xl mx-auto p-4">
        {/* Header Section */}
        <div className="flex items-center mb-6">
          <button
            onClick={() => router.push("/")}
            className="text-gray-400 hover:text-white mr-4"
            aria-label="Go back to home"
          >
            ← Back
          </button>
          <h1 className="text-2xl font-bold text-white">Token Swap</h1>
        </div>

        {/* Main Content Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column: Swap Form and History */}
          <div className="lg:col-span-2 space-y-6">
            <SwapForm />
            <SwapHistory />
          </div>

          {/* Right Column: Wallet and Stats */}
          <div className="space-y-6">
            <WalletConnect />
            <WalletBalance />
            <SwapStats />
          </div>
        </div>
      </div>
    </div>
  )
}
