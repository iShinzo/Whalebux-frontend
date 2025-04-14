"use client";

import { useEffect, useMemo, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useUserStore } from "@/lib/stores/userStore"; // Updated import path to use alias for consistency
import ReferralLink from "@/components/friends/ReferralLink"; // Updated path
import FriendsList from "@/components/friends/FriendsList"; // Updated path
import ReferralBoostCard from "@/components/friends/ReferralBoostCard"; // Updated path

// Define the Friend interface for type safety
interface Friend {
  lastActive: string; // Add other properties as needed
}

// Constants
const ACTIVE_FRIEND_THRESHOLD = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

export default function Friends() {
  const router = useRouter();
  const { friends = [], referralBoost, updateReferralBoost } = useUserStore();

  // Memoize active friends count calculation
  const activeCount = useMemo(() => {
    if (!friends || friends.length === 0) return 0;
    return friends.filter((friend: Friend) => {
      const lastActiveTime = new Date(friend.lastActive).getTime();
      return Date.now() - lastActiveTime < ACTIVE_FRIEND_THRESHOLD;
    }).length;
  }, [friends]);

  // Stabilize the onClick handler
  const handleBackClick = useCallback(() => {
    router.push("/home"); // Replace "/" with the correct main page route
  }, [router]);

  // Update referral boost when component mounts or friends change
  useEffect(() => {
    if (updateReferralBoost) {
      updateReferralBoost();
    }
  }, [friends, updateReferralBoost]);

  return (
    <div className="min-h-screen bg-gray-900 p-4 pb-20">
      <div className="max-w-md mx-auto">
        {/* Header Section */}
        <div className="flex items-center mb-6">
          <button
            onClick={handleBackClick}
            className="text-gray-400 hover:text-white mr-4"
          >
            ← Back
          </button>
          <h1 className="text-2xl font-bold text-white">Friends & Referrals</h1>
        </div>

        {/* Referral Link */}
        <ReferralLink />

        {/* Referral Boost Card */}
        <ReferralBoostCard boost={referralBoost ?? 0} friendCount={activeCount} />

        {/* Friends List Section */}
        <div className="mt-6">
          <h2 className="text-xl font-semibold text-white mb-4">Your Friends</h2>
          {friends && friends.length > 0 ? (
            <FriendsList friends={friends} />
          ) : (
            <p className="text-gray-400">No friends found.</p>
          )}
        </div>
      </div>
    </div>
  );
}
