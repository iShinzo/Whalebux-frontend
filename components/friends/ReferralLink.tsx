"use client"

import { useState } from "react"
import { useUserStore } from "../../lib/stores/userStore"
import { Copy } from "lucide-react"

export default function ReferralLink() {
  const { referralCode } = useUserStore()
  const [copied, setCopied] = useState(false)

  const referralLink = `https://t.me/WhaleBuxBot?start=${referralCode}`

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(referralLink)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error("Failed to copy: ", err)
    }
  }

  return (
    <div className="bg-gray-800 rounded-lg p-4 mb-6">
      <h2 className="text-lg font-semibold text-white mb-2">Your Referral Link</h2>
      <p className="text-gray-400 text-sm mb-3">
        Share this link with friends and earn mining boosts when they join and stay active!
      </p>

      <div className="flex items-center">
        <div className="bg-gray-700 rounded-l-lg py-2 px-3 flex-grow overflow-x-auto whitespace-nowrap text-gray-300 text-sm">
          {referralLink}
        </div>
        <button
          onClick={copyToClipboard}
          className="bg-blue-600 hover:bg-blue-700 text-white rounded-r-lg py-2 px-3 flex items-center"
        >
          <Copy size={16} className="mr-1" />
          {copied ? "Copied!" : "Copy"}
        </button>
      </div>

      <div className="mt-3 text-xs text-gray-400">
        Your referral code: <span className="text-blue-400 font-medium">{referralCode}</span>
      </div>
    </div>
  )
}
