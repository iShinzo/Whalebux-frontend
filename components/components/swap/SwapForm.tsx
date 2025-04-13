"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useUserStore } from "../../lib/stores/userStore"
import { useWalletStore } from "../../lib/stores/walletStore"
import { useSwapStore } from "../../lib/stores/swapStore"
import { swapConfig } from "../../config/chainConfig"
import ChainSelector from "./ChainSelector"

export default function SwapForm() {
  const { userId, wbuxDollars, username } = useUserStore()
  const { getWalletConnection, setPreferredChain } = useWalletStore()
  const { initiateSwap, getDailySwapAmount, isSwapping, error, setError } = useSwapStore()

  const [amount, setAmount] = useState<number>(swapConfig.minSwapAmount)
  const [selectedChain, setSelectedChain] = useState<string>("BSC")
  const [tokenAmount, setTokenAmount] = useState<number>(0)
  const [success, setSuccess] = useState<string | null>(null)

  const walletConnection = userId ? getWalletConnection(userId) : undefined
  const isConnected = !!walletConnection
  const dailySwapAmount = userId ? getDailySwapAmount(userId) : 0
  const remainingDailyLimit = swapConfig.dailyLimit - dailySwapAmount

  // Calculate token amount when dollar amount changes
  useEffect(() => {
    setTokenAmount(amount * swapConfig.rate)
  }, [amount])

  // Reset error when component mounts
  useEffect(() => {
    setError(null)
    setSuccess(null)
  }, [setError])

  const handleChainChange = (chain: string) => {
    setSelectedChain(chain)
    if (userId) {
      setPreferredChain(userId, chain)
    }
  }

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number.parseFloat(e.target.value)
    if (isNaN(value)) {
      setAmount(0)
      setTokenAmount(0)
    } else {
      setAmount(value)
      setTokenAmount(value * swapConfig.rate)
    }
  }

  const handleMaxAmount = () => {
    const maxAmount = Math.min(wbuxDollars, swapConfig.maxSwapAmount, remainingDailyLimit)
    setAmount(maxAmount)
    setTokenAmount(maxAmount * swapConfig.rate)
  }

  const handleSwap = async () => {
    if (!userId || !isConnected || !walletConnection) {
      setError("Please connect your wallet first")
      return
    }

    setSuccess(null)
    setError(null)

    try {
      const result = await initiateSwap(userId, amount, selectedChain, walletConnection.address)
      if (result) {
        setSuccess(`Successfully swapped ${amount} WhaleBux Dollars to ${tokenAmount.toFixed(6)} WBUX tokens!`)
        setAmount(swapConfig.minSwapAmount)
      }
    } catch (error) {
      console.error("Swap error:", error)
    }
  }

  return (
    <div className="bg-gray-800 rounded-lg p-6">
      <h2 className="text-xl font-semibold text-white mb-4">Swap WhaleBux Dollars to WBUX Tokens</h2>

      {error && <div className="mb-4 p-3 bg-red-900/50 border border-red-700 rounded text-red-400">{error}</div>}

      {success && (
        <div className="mb-4 p-3 bg-green-900/50 border border-green-700 rounded text-green-400">{success}</div>
      )}

      <div className="space-y-6">
        <div className="bg-gray-700 p-4 rounded-lg">
          <div className="flex justify-between items-center mb-2">
            <div className="text-sm text-gray-400">Your Balance:</div>
            <div className="text-white font-medium">{wbuxDollars.toLocaleString()} WhaleBux Dollars</div>
          </div>
          <div className="flex justify-between items-center">
            <div className="text-sm text-gray-400">Daily Limit Remaining:</div>
            <div className="text-white font-medium">{remainingDailyLimit.toLocaleString()} WhaleBux Dollars</div>
          </div>
        </div>

        <div>
          <label htmlFor="amount" className="block text-sm font-medium text-gray-300 mb-2">
            Amount to Swap
          </label>
          <div className="relative">
            <input
              type="number"
              id="amount"
              value={amount}
              onChange={handleAmountChange}
              min={swapConfig.minSwapAmount}
              max={Math.min(wbuxDollars, swapConfig.maxSwapAmount, remainingDailyLimit)}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white pr-20"
              placeholder="Enter amount"
            />
            <button
              onClick={handleMaxAmount}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 px-2 py-1 bg-gray-600 text-xs text-white rounded"
            >
              MAX
            </button>
          </div>
          <div className="mt-1 text-xs text-gray-400 flex justify-between">
            <span>Min: {swapConfig.minSwapAmount.toLocaleString()} Dollars</span>
            <span>Max: {swapConfig.maxSwapAmount.toLocaleString()} Dollars</span>
          </div>
        </div>

        <div className="flex items-center justify-center">
          <div className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">You Will Receive</label>
          <div className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white">
            <div className="flex justify-between items-center">
              <span className="text-lg font-medium">{tokenAmount.toFixed(6)}</span>
              <span className="text-gray-400">WBUX Tokens</span>
            </div>
          </div>
          <div className="mt-1 text-xs text-gray-400">Rate: 10,000 WhaleBux Dollars = 0.25 WBUX Tokens</div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Select Blockchain</label>
          <ChainSelector selectedChain={selectedChain} onSelectChain={handleChainChange} />
        </div>

        <button
          onClick={handleSwap}
          disabled={
            !isConnected ||
            isSwapping ||
            amount < swapConfig.minSwapAmount ||
            amount > Math.min(wbuxDollars, swapConfig.maxSwapAmount, remainingDailyLimit)
          }
          className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-md font-medium disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSwapping ? "Processing..." : "Swap Now"}
        </button>

        {!isConnected && (
          <div className="text-center text-sm text-yellow-400">Please connect your wallet first to perform a swap.</div>
        )}
      </div>
    </div>
  )
}
