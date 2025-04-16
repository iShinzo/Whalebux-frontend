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

  return (
    <div className="min-h-screen bg-gray-900 pb-20">
      <div className="max-w-6xl mx-auto p-4">
        <div className="flex items-center mb-6">
          <button onClick={() => router.push("/")} className="text-gray-400 hover:text-white mr-4">
            ← Back
          </button>
          <h1 className="text-2xl font-bold text-white">Token Swap</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <SwapForm />
            <SwapHistory />
          </div>

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
