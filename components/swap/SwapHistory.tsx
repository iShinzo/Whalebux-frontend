"use client"

import { useEffect, useState } from "react"
import { useUserStore } from "../../lib/stores/userStore"
import { useSwapStore, type SwapTransaction } from "../../lib/stores/swapStore"
import { formatDistanceToNow } from "date-fns"
import { chains } from "../../config/chainConfig"

export default function SwapHistory() {
  const { userId } = useUserStore()
  const { getUserTransactions } = useSwapStore()
  const [transactions, setTransactions] = useState<SwapTransaction[]>([])

  useEffect(() => {
    if (userId) {
      const fetchedTransactions = getUserTransactions(userId)
      setTransactions(fetchedTransactions)
    }
  }, [userId, getUserTransactions])

  const renderTransactionStatus = (status: "COMPLETED" | "PENDING" | "FAILED") => {
    const statusClasses: Record<"COMPLETED" | "PENDING" | "FAILED", string> = {
      COMPLETED: "bg-green-900/50 text-green-400",
      PENDING: "bg-yellow-900/50 text-yellow-400",
      FAILED: "bg-red-900/50 text-red-400",
    }
    return (
      <div
        className={`px-2 py-1 text-xs rounded-full ${
          statusClasses[status] // Ensured strict typing here
        }`}
      >
        {status}
      </div>
    )
  }

  const renderTransaction = (tx: SwapTransaction) => {
    const chainDetails = chains[tx.chain]
    return (
      <div key={tx.id} className="bg-gray-700 rounded-lg p-4">
        <div className="flex justify-between items-start mb-2">
          <div>
            <div className="text-white font-medium">
              {tx.dollarAmount.toLocaleString()} Dollars → {tx.tokenAmount.toFixed(6)} WBUX
            </div>
            <div className="text-sm text-gray-400">
              {formatDistanceToNow(new Date(tx.timestamp))} ago on {chainDetails?.name || "Unknown Chain"}
            </div>
          </div>
          {renderTransactionStatus(tx.status)}
        </div>

        {tx.txHash && chainDetails?.blockExplorerUrl && (
          <div className="mt-2">
            <a
              href={`${chainDetails.blockExplorerUrl}/tx/${tx.txHash}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-400 text-sm hover:underline"
            >
              View Transaction
            </a>
          </div>
        )}
      </div>
    )
  }

  if (transactions.length === 0) {
    return (
      <div className="bg-gray-800 rounded-lg p-6">
        <h2 className="text-xl font-semibold text-white mb-4">Swap History</h2>
        <div className="text-center py-8">
          <p className="text-gray-400">You haven't made any swaps yet.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-gray-800 rounded-lg p-6">
      <h2 className="text-xl font-semibold text-white mb-4">Swap History</h2>

      <div className="space-y-4">
        {transactions
          .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
          .map(renderTransaction)}
      </div>
    </div>
  )
}
