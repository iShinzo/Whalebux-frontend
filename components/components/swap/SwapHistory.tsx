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
      setTransactions(getUserTransactions(userId))
    }
  }, [userId, getUserTransactions])

  if (!transactions.length) {
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
          .map((tx) => (
            <div key={tx.id} className="bg-gray-700 rounded-lg p-4">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <div className="text-white font-medium">
                    {tx.dollarAmount.toLocaleString()} Dollars → {tx.tokenAmount.toFixed(6)} WBUX
                  </div>
                  <div className="text-sm text-gray-400">
                    {formatDistanceToNow(new Date(tx.timestamp))} ago on {chains[tx.chain]?.name}
                  </div>
                </div>
                <div
                  className={`px-2 py-1 text-xs rounded-full ${
                    tx.status === "COMPLETED"
                      ? "bg-green-900/50 text-green-400"
                      : tx.status === "PENDING"
                        ? "bg-yellow-900/50 text-yellow-400"
                        : "bg-red-900/50 text-red-400"
                  }`}
                >
                  {tx.status}
                </div>
              </div>

              {tx.txHash && (
                <div className="mt-2">
                  <a
                    href={`${chains[tx.chain]?.blockExplorerUrl}/tx/${tx.txHash}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-400 text-sm hover:underline"
                  >
                    View Transaction
                  </a>
                </div>
              )}
            </div>
          ))}
      </div>
    </div>
  )
}
