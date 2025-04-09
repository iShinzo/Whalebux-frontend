"use client"

import { create } from "zustand"
import { persist } from "zustand/middleware"
import { useUserStore } from "./userStore"
import { swapConfig } from "../config/chainConfig"

export interface SwapTransaction {
  id: string
  userId: string
  dollarAmount: number
  tokenAmount: number
  chain: string
  status: "PENDING" | "COMPLETED" | "FAILED"
  txHash?: string
  timestamp: string
  walletAddress: string
}

interface SwapState {
  transactions: SwapTransaction[]
  isSwapping: boolean
  error: string | null
  dailySwapAmounts: Record<string, number> // userId -> amount swapped today

  // Swap actions
  initiateSwap: (
    userId: string,
    dollarAmount: number,
    chain: string,
    walletAddress: string,
  ) => Promise<SwapTransaction | null>
  completeSwap: (txId: string, txHash: string) => void
  failSwap: (txId: string, error: string) => void
  getDailySwapAmount: (userId: string) => number
  resetDailySwapAmount: (userId: string) => void
  getUserTransactions: (userId: string) => SwapTransaction[]
  getPendingTransactions: (userId: string) => SwapTransaction[]

  // Status management
  setSwapping: (isSwapping: boolean) => void
  setError: (error: string | null) => void
}

export const useSwapStore = create<SwapState>()(
  persist(
    (set, get) => ({
      transactions: [],
      isSwapping: false,
      error: null,
      dailySwapAmounts: {},

      initiateSwap: async (userId, dollarAmount, chain, walletAddress) => {
        set({ isSwapping: true, error: null })

        try {
          // Validate swap amount
          if (dollarAmount < swapConfig.minSwapAmount) {
            throw new Error(`Minimum swap amount is ${swapConfig.minSwapAmount} Dollars`)
          }

          if (dollarAmount > swapConfig.maxSwapAmount) {
            throw new Error(`Maximum swap amount is ${swapConfig.maxSwapAmount} Dollars`)
          }

          // Check daily limit
          const dailyAmount = get().getDailySwapAmount(userId)
          if (dailyAmount + dollarAmount > swapConfig.dailyLimit) {
            throw new Error(`Daily swap limit of ${swapConfig.dailyLimit} Dollars would be exceeded`)
          }

          // Check if user has enough dollars
          const userState = useUserStore.getState()
          if (userState.wbuxDollars < dollarAmount) {
            throw new Error(`Insufficient WhaleBux Dollars balance`)
          }

          // Calculate token amount
          const tokenAmount = dollarAmount * swapConfig.rate

          // Create swap transaction
          const newSwap: SwapTransaction = {
            id: `swap_${Math.random().toString(36).substring(2, 9)}`,
            userId,
            dollarAmount,
            tokenAmount,
            chain,
            status: "PENDING",
            timestamp: new Date().toISOString(),
            walletAddress,
          }

          // Update daily swap amount
          set((state) => ({
            dailySwapAmounts: {
              ...state.dailySwapAmounts,
              [userId]: (state.dailySwapAmounts[userId] || 0) + dollarAmount,
            },
          }))

          // Deduct dollars from user balance
          useUserStore.setState({ wbuxDollars: userState.wbuxDollars - dollarAmount })

          // Add transaction to store
          set((state) => ({
            transactions: [...state.transactions, newSwap],
            isSwapping: false,
          }))

          return newSwap
        } catch (error) {
          set({
            isSwapping: false,
            error: error instanceof Error ? error.message : "Unknown error during swap",
          })
          return null
        }
      },

      completeSwap: (txId, txHash) => {
        set((state) => ({
          transactions: state.transactions.map((tx) =>
            tx.id === txId
              ? {
                  ...tx,
                  status: "COMPLETED",
                  txHash,
                }
              : tx,
          ),
        }))
      },

      failSwap: (txId, error) => {
        // Get the transaction
        const tx = get().transactions.find((t) => t.id === txId)
        if (!tx) return

        // Refund dollars to user
        const userState = useUserStore.getState()
        useUserStore.setState({ wbuxDollars: userState.wbuxDollars + tx.dollarAmount })

        // Update daily swap amount
        set((state) => ({
          dailySwapAmounts: {
            ...state.dailySwapAmounts,
            [tx.userId]: Math.max(0, (state.dailySwapAmounts[tx.userId] || 0) - tx.dollarAmount),
          },
          transactions: state.transactions.map((t) =>
            t.id === txId
              ? {
                  ...t,
                  status: "FAILED",
                }
              : t,
          ),
        }))
      },

      getDailySwapAmount: (userId) => {
        // Reset daily amount if it's a new day
        const lastSwap = get()
          .transactions.filter((tx) => tx.userId === userId && tx.status !== "FAILED")
          .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())[0]

        if (lastSwap) {
          const lastSwapDate = new Date(lastSwap.timestamp).setHours(0, 0, 0, 0)
          const today = new Date().setHours(0, 0, 0, 0)

          if (lastSwapDate < today) {
            get().resetDailySwapAmount(userId)
            return 0
          }
        }

        return get().dailySwapAmounts[userId] || 0
      },

      resetDailySwapAmount: (userId) => {
        set((state) => ({
          dailySwapAmounts: {
            ...state.dailySwapAmounts,
            [userId]: 0,
          },
        }))
      },

      getUserTransactions: (userId) => {
        return get().transactions.filter((tx) => tx.userId === userId)
      },

      getPendingTransactions: (userId) => {
        return get().transactions.filter((tx) => tx.userId === userId && tx.status === "PENDING")
      },

      setSwapping: (isSwapping) => {
        set({ isSwapping })
      },

      setError: (error) => {
        set({ error })
      },
    }),
    {
      name: "whalebux-swap-storage",
    },
  ),
)
