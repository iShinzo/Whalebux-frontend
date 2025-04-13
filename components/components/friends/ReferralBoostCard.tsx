"use client"

interface ReferralBoostCardProps {
  boost: number
  friendCount: number
}

export default function ReferralBoostCard({ boost, friendCount }: ReferralBoostCardProps) {
  // Calculate progress to next tier
  const getNextTier = () => {
    if (friendCount >= 20) return { target: null, current: friendCount, needed: 0 }
    if (friendCount >= 10) return { target: 20, current: friendCount, needed: 20 - friendCount }
    if (friendCount >= 5) return { target: 10, current: friendCount, needed: 10 - friendCount }
    if (friendCount >= 1) return { target: 5, current: friendCount, needed: 5 - friendCount }
    return { target: 1, current: 0, needed: 1 }
  }

  const { target, current, needed } = getNextTier()
  const progressPercent = target ? (current / target) * 100 : 100

  return (
    <div className="bg-gray-800 rounded-lg p-4 mb-6">
      <h2 className="text-lg font-semibold text-white mb-2">Referral Mining Boost</h2>

      <div className="flex items-center justify-between mb-3">
        <span className="text-gray-400">Active Friends: {friendCount}</span>
        <span className="text-green-500 font-bold">+{boost}% Boost</span>
      </div>

      {/* Progress bar */}
      <div className="h-2 bg-gray-700 rounded-full mb-3">
        <div className="h-full bg-blue-600 rounded-full" style={{ width: `${progressPercent}%` }}></div>
      </div>

      {/* Next tier info */}
      {target ? (
        <div className="text-sm text-gray-400">
          Refer {needed} more active friend{needed !== 1 ? "s" : ""} to reach the next tier!
        </div>
      ) : (
        <div className="text-sm text-green-500">Maximum boost achieved! Great job!</div>
      )}

      {/* Tiers */}
      <div className="mt-4 grid grid-cols-4 gap-2">
        <div
          className={`text-center p-2 rounded ${friendCount >= 1 ? "bg-blue-900/50 text-blue-400" : "bg-gray-700 text-gray-500"}`}
        >
          <div className="text-xs">1 Friend</div>
          <div className="font-bold">+5%</div>
        </div>
        <div
          className={`text-center p-2 rounded ${friendCount >= 5 ? "bg-blue-900/50 text-blue-400" : "bg-gray-700 text-gray-500"}`}
        >
          <div className="text-xs">5 Friends</div>
          <div className="font-bold">+10%</div>
        </div>
        <div
          className={`text-center p-2 rounded ${friendCount >= 10 ? "bg-blue-900/50 text-blue-400" : "bg-gray-700 text-gray-500"}`}
        >
          <div className="text-xs">10 Friends</div>
          <div className="font-bold">+15%</div>
        </div>
        <div
          className={`text-center p-2 rounded ${friendCount >= 20 ? "bg-blue-900/50 text-blue-400" : "bg-gray-700 text-gray-500"}`}
        >
          <div className="text-xs">20 Friends</div>
          <div className="font-bold">+25%</div>
        </div>
      </div>
    </div>
  )
}
