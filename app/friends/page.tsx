"use client"

import { useEffect, useMemo } from "react"
import { useRouter } from "next/navigation"
import { useUserStore } from "../../lib/stores/userStore"
import ReferralLink from "../../components/friends/ReferralLink"
import FriendsList from "../../components/friends/FriendsList"
import ReferralBoostCard from "../../components/friends/ReferralBoostCard"

export default function Friends() {
  const router = useRouter()
  const { friends = [], referralBoost, updateReferralBoost } = useUserStore() // Default to an empty array to prevent errors

  // Calculate the count of active friends
  const activeFriendCount = useMemo(() => {
    const oneDayInMs = 24 * 60 * 60 * 1000
    return friends.filter((friend) => Date.now() - new Date(friend.lastActive).getTime() < oneDayInMs).length
  }, [friends])

  // Update referral boost when the component mounts or when the friends list changes
  useEffect(() => {
    updateReferralBoost()
  }, [friends, updateReferralBoost])

  return (
    <div className="min-h-screen bg-gray-900 p-4 pb-20">
      <div className="max-w-md mx-auto">
        {/* Header Section */}
        <div className="flex items-center mb-6">
          <button
            onClick={() => router.push("/")}
            className="text-gray-400 hover:text-white mr-4"
            aria-label="Go back to home"
          >
            ← Back
          </button>
          <h1 className="text-2xl font-bold text-white">Friends & Referrals</h1>
        </div>

        {/* Referral Link Component */}
        <ReferralLink />

        {/* Referral Boost Card */}
        <ReferralBoostCard boost={referralBoost} friendCount={activeFriendCount} />

        {/* Friends List Section */}
        <div className="mt-6">
          <h2 className="text-xl font-semibold text-white mb-4">Your Friends</h2>
          {friends.length > 0 ? (
            <FriendsList friends={friends} />
          ) : (
            <div className="text-gray-400 text-center">You have no friends yet. Share your referral link to add some!</div>
          )}
        </div>
      </div>
    </div>
  )
}
