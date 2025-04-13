"use client"

import { useState, useEffect } from "react"
import { useUserStore } from "../../lib/stores/userStore"
import { useWalletStore, type WalletType } from "../../lib/stores/walletStore"

export default function WalletConnect() {
  const { userId } = useUserStore()
  const { connectWallet, disconnectWallet, getWalletConnection, isConnecting, error, setError } = useWalletStore()

  const [showOptions, setShowOptions] = useState(false)

  const walletConnection = userId ? getWalletConnection(userId) : undefined
  const isConnected = !!walletConnection

  // Reset error when component mounts
  useEffect(() => {
    setError(null)
  }, [setError])

  const handleConnect = async (walletType: WalletType) => {
    if (!userId) return

    const success = await connectWallet(userId, walletType)
    if (success) {
      setShowOptions(false)
    }
  }

  const handleDisconnect = () => {
    if (!userId) return

    disconnectWallet(userId)
  }

  const formatAddress = (address: string) => {
    if (!address) return ""
    if (address.length < 10) return address
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`
  }

  return (
    <div className="bg-gray-800 rounded-lg p-4">
      <h2 className="text-xl font-semibold text-white mb-4">Wallet Connection</h2>

      {error && <div className="mb-4 p-3 bg-red-900/50 border border-red-700 rounded text-red-400">{error}</div>}

      {isConnected ? (
        <div>
          <div className="bg-gray-700 rounded-lg p-4 mb-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-gray-400 mb-1">Connected Wallet:</div>
                <div className="text-white font-medium flex items-center">
                  {getWalletIcon(walletConnection.type)}
                  <span className="ml-2">{walletConnection.type}</span>
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm text-gray-400 mb-1">Address:</div>
                <div className="text-white font-medium">{formatAddress(walletConnection.address)}</div>
              </div>
            </div>
          </div>

          <button
            onClick={handleDisconnect}
            className="w-full py-2 px-4 bg-red-600 hover:bg-red-700 text-white rounded-md"
          >
            Disconnect Wallet
          </button>
        </div>
      ) : (
        <div>
          {showOptions ? (
            <div className="space-y-3">
              <button
                onClick={() => handleConnect("METAMASK")}
                disabled={isConnecting}
                className="w-full py-3 px-4 bg-orange-600 hover:bg-orange-700 text-white rounded-md flex items-center justify-center"
              >
                {getWalletIcon("METAMASK")}
                <span className="ml-2">Connect MetaMask</span>
              </button>

              <button
                onClick={() => handleConnect("WALLETCONNECT")}
                disabled={isConnecting}
                className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-md flex items-center justify-center"
              >
                {getWalletIcon("WALLETCONNECT")}
                <span className="ml-2">WalletConnect</span>
              </button>

              <button
                onClick={() => handleConnect("COINBASE")}
                disabled={isConnecting}
                className="w-full py-3 px-4 bg-blue-500 hover:bg-blue-600 text-white rounded-md flex items-center justify-center"
              >
                {getWalletIcon("COINBASE")}
                <span className="ml-2">Coinbase Wallet</span>
              </button>

              <button
                onClick={() => handleConnect("PHANTOM")}
                disabled={isConnecting}
                className="w-full py-3 px-4 bg-purple-600 hover:bg-purple-700 text-white rounded-md flex items-center justify-center"
              >
                {getWalletIcon("PHANTOM")}
                <span className="ml-2">Phantom Wallet</span>
              </button>

              <button
                onClick={() => setShowOptions(false)}
                className="w-full py-2 px-4 bg-gray-600 hover:bg-gray-700 text-white rounded-md mt-2"
              >
                Cancel
              </button>
            </div>
          ) : (
            <button
              onClick={() => setShowOptions(true)}
              disabled={isConnecting}
              className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-md"
            >
              {isConnecting ? "Connecting..." : "Connect Wallet"}
            </button>
          )}
        </div>
      )}
    </div>
  )
}

function getWalletIcon(type: WalletType) {
  switch (type) {
    case "METAMASK":
      return (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M21.3622 2L13.1657 8.2416L14.6689 4.51724L21.3622 2Z"
            fill="#E17726"
            stroke="#E17726"
            strokeWidth="0.25"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M2.63782 2L10.7632 8.30469L9.33116 4.51724L2.63782 2Z"
            fill="#E27625"
            stroke="#E27625"
            strokeWidth="0.25"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M18.4386 16.9151L16.2386 20.4877L20.8419 21.8782L22.1645 17.0151L18.4386 16.9151Z"
            fill="#E27625"
            stroke="#E27625"
            strokeWidth="0.25"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M1.84644 17.0151L3.15806 21.8782L7.75136 20.4877L5.56233 16.9151L1.84644 17.0151Z"
            fill="#E27625"
            stroke="#E27625"
            strokeWidth="0.25"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M7.48547 11.1643L6.20508 13.2447L10.7605 13.4824L10.6036 8.55078L7.48547 11.1643Z"
            fill="#E27625"
            stroke="#E27625"
            strokeWidth="0.25"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M16.5146 11.1643L13.3385 8.48828L13.1657 13.4824L17.7211 13.2447L16.5146 11.1643Z"
            fill="#E27625"
            stroke="#E27625"
            strokeWidth="0.25"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M7.75134 20.4877L10.4774 19.0782L8.12656 17.0529L7.75134 20.4877Z"
            fill="#E27625"
            stroke="#E27625"
            strokeWidth="0.25"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M13.5226 19.0782L16.2386 20.4877L15.8734 17.0529L13.5226 19.0782Z"
            fill="#E27625"
            stroke="#E27625"
            strokeWidth="0.25"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      )
    case "WALLETCONNECT":
      return (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M6.08 9.24C9.6 5.68 15.36 5.68 18.88 9.24L19.28 9.64C19.52 9.84 19.52 10.24 19.28 10.48L17.84 11.92C17.76 12.04 17.52 12.04 17.36 11.92L16.8 11.36C14.32 8.88 10.64 8.88 8.16 11.36L7.52 12C7.36 12.12 7.12 12.12 7 12L5.56 10.56C5.32 10.32 5.32 9.92 5.56 9.72L6.08 9.24ZM21.2 11.56L22.48 12.84C22.72 13.08 22.72 13.48 22.48 13.68L16.88 19.32C16.64 19.56 16.24 19.56 16.04 19.32L12.24 15.52C12.2 15.44 12.12 15.44 12.04 15.52L8.24 19.32C8 19.56 7.6 19.56 7.4 19.32L1.76 13.68C1.52 13.44 1.52 13.04 1.76 12.84L3.04 11.56C3.28 11.32 3.68 11.32 3.88 11.56L7.68 15.36C7.76 15.44 7.84 15.44 7.92 15.36L11.72 11.56C11.96 11.32 12.36 11.32 12.56 11.56L16.36 15.36C16.44 15.44 16.52 15.44 16.6 15.36L20.4 11.56C20.64 11.32 21.04 11.32 21.2 11.56Z"
            fill="#3B99FC"
          />
        </svg>
      )
    case "COINBASE":
      return (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 18.5C8.42 18.5 5.5 15.58 5.5 12C5.5 8.42 8.42 5.5 12 5.5C15.58 5.5 18.5 8.42 18.5 12C18.5 15.58 15.58 18.5 12 18.5Z"
            fill="#0052FF"
          />
          <path
            d="M12 7.5C9.52 7.5 7.5 9.52 7.5 12C7.5 14.48 9.52 16.5 12 16.5C14.48 16.5 16.5 14.48 16.5 12C16.5 9.52 14.48 7.5 12 7.5Z"
            fill="#0052FF"
          />
        </svg>
      )
    case "PHANTOM":
      return (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M20 4H4C2.89543 4 2 4.89543 2 6V18C2 19.1046 2.89543 20 4 20H20C21.1046 20 22 19.1046 22 18V6C22 4.89543 21.1046 4 20 4Z"
            fill="#AB9FF2"
          />
          <path
            d="M17 7H14C12.3431 7 11 8.34315 11 10V14C11 15.6569 12.3431 17 14 17H17C18.6569 17 20 15.6569 20 14V10C20 8.34315 18.6569 7 17 7Z"
            fill="#FFFFFF"
          />
          <path
            d="M8 7H7C6.44772 7 6 7.44772 6 8V16C6 16.5523 6.44772 17 7 17H8C8.55228 17 9 16.5523 9 16V8C9 7.44772 8.55228 7 8 7Z"
            fill="#FFFFFF"
          />
        </svg>
      )
    default:
      return null
  }
}
