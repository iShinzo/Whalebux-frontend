"use client"

import { create } from "zustand"
import { persist } from "zustand/middleware"
import { chains, getChainById, getChainByName } from "../config/chainConfig"

export type WalletType = "METAMASK" | "WALLETCONNECT" | "COINBASE" | "PHANTOM"

export interface WalletConnection {
  userId: string
  address: string
  type: WalletType
  chainId: number
  connectedAt: string
  lastActive: string
  preferredChain?: string // BSC or MINTME
}

interface WalletState {
  connections: WalletConnection[]
  isConnecting: boolean
  error: string | null
  pendingTransactions: string[] // Array of transaction hashes

  // Connection Management
  connectWallet: (userId: string, type: WalletType) => Promise<boolean>
  disconnectWallet: (userId: string) => void
  getWalletConnection: (userId: string) => WalletConnection | undefined
  updateLastActive: (userId: string) => void
  setPreferredChain: (userId: string, chain: string) => void

  // Chain Management
  switchChain: (userId: string, chainName: string) => Promise<boolean>
  getCurrentChain: (userId: string) => string | null

  // Transaction Management
  addPendingTransaction: (txHash: string) => void
  removePendingTransaction: (txHash: string) => void
  hasPendingTransactions: () => boolean

  // Status Management
  setConnecting: (isConnecting: boolean) => void
  setError: (error: string | null) => void
}

export const useWalletStore = create<WalletState>()(
  persist(
    (set, get) => ({
      connections: [],
      isConnecting: false,
      error: null,
      pendingTransactions: [],

      connectWallet: async (userId, type) => {
        set({ isConnecting: true, error: null })

        try {
          // Check if wallet is available
          if (type === "METAMASK" && typeof window.ethereum === "undefined") {
            throw new Error("MetaMask is not installed")
          }

          let address = ""
          let chainId = 0

          // Connect to wallet (simplified for demo)
          if (type === "METAMASK") {
            try {
              // Request account access
              const accounts = await window.ethereum.request({ method: "eth_requestAccounts" })
              address = accounts[0]

              // Get chain ID
              chainId = await window.ethereum.request({ method: "eth_chainId" })
              chainId = Number.parseInt(chainId, 16)
            } catch (error) {
              throw new Error("Failed to connect to MetaMask")
            }
          } else {
            // Mock connection for other wallet types
            address = `0x${Math.random().toString(36).substring(2, 10)}...${Math.random().toString(36).substring(2, 10)}`
            chainId = 56 // Default to BSC
          }

          // Create new connection
          const newConnection: WalletConnection = {
            userId,
            address,
            type,
            chainId,
            connectedAt: new Date().toISOString(),
            lastActive: new Date().toISOString(),
            preferredChain: "BSC", // Default to BSC
          }

          // Update connections
          set((state) => ({
            connections: [...state.connections.filter((conn) => conn.userId !== userId), newConnection],
            isConnecting: false,
          }))

          return true
        } catch (error) {
          set({
            isConnecting: false,
            error: error instanceof Error ? error.message : "Unknown error",
          })
          return false
        }
      },

      disconnectWallet: (userId) => {
        set((state) => ({
          connections: state.connections.filter((conn) => conn.userId !== userId),
        }))
      },

      getWalletConnection: (userId) => {
        return get().connections.find((conn) => conn.userId === userId)
      },

      updateLastActive: (userId) => {
        set((state) => ({
          connections: state.connections.map((conn) =>
            conn.userId === userId
              ? {
                  ...conn,
                  lastActive: new Date().toISOString(),
                }
              : conn,
          ),
        }))
      },

      setPreferredChain: (userId, chain) => {
        set((state) => ({
          connections: state.connections.map((conn) =>
            conn.userId === userId
              ? {
                  ...conn,
                  preferredChain: chain,
                }
              : conn,
          ),
        }))
      },

      switchChain: async (userId, chainName) => {
        const connection = get().getWalletConnection(userId)
        if (!connection) return false

        const chain = getChainByName(chainName)
        if (!chain) return false

        try {
          if (connection.type === "METAMASK" && window.ethereum) {
            try {
              // Try to switch to the chain
              await window.ethereum.request({
                method: "wallet_switchEthereumChain",
                params: [{ chainId: `0x${chain.id.toString(16)}` }],
              })
            } catch (switchError: any) {
              // This error code indicates that the chain has not been added to MetaMask
              if (switchError.code === 4902) {
                await window.ethereum.request({
                  method: "wallet_addEthereumChain",
                  params: [
                    {
                      chainId: `0x${chain.id.toString(16)}`,
                      chainName: chain.name,
                      nativeCurrency: {
                        name: chain.name,
                        symbol: chain.symbol,
                        decimals: 18,
                      },
                      rpcUrls: [chain.rpcUrl],
                      blockExplorerUrls: [chain.blockExplorerUrl],
                    },
                  ],
                })
              } else {
                throw switchError
              }
            }

            // Update connection with new chain ID
            set((state) => ({
              connections: state.connections.map((conn) =>
                conn.userId === userId
                  ? {
                      ...conn,
                      chainId: chain.id,
                      preferredChain: chainName,
                    }
                  : conn,
              ),
            }))

            return true
          } else {
            // For other wallet types, just update the preferred chain
            set((state) => ({
              connections: state.connections.map((conn) =>
                conn.userId === userId
                  ? {
                      ...conn,
                      preferredChain: chainName,
                    }
                  : conn,
              ),
            }))
            return true
          }
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : "Failed to switch chain",
          })
          return false
        }
      },

      getCurrentChain: (userId) => {
        const connection = get().getWalletConnection(userId)
        if (!connection) return null

        const chain = getChainById(connection.chainId)
        return chain ? Object.keys(chains).find((key) => chains[key].id === chain.id) || null : null
      },

      addPendingTransaction: (txHash) => {
        set((state) => ({
          pendingTransactions: [...state.pendingTransactions, txHash],
        }))
      },

      removePendingTransaction: (txHash) => {
        set((state) => ({
          pendingTransactions: state.pendingTransactions.filter((hash) => hash !== txHash),
        }))
      },

      hasPendingTransactions: () => {
        return get().pendingTransactions.length > 0
      },

      setConnecting: (isConnecting) => {
        set({ isConnecting })
      },

      setError: (error) => {
        set({ error })
      },
    }),
    {
      name: "whalebux-wallet-storage",
    },
  ),
)

// Add window.ethereum type for TypeScript
declare global {
  interface Window {
    ethereum?: any
  }
}
