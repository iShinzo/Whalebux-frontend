"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUserStore } from "../../lib/stores/userStore";
import ReferralLink from "../../components/friends/ReferralLink";
import FriendsList from "../../components/friends/FriendsList";
import ReferralBoostCard from "../../components/friends/ReferralBoostCard";

export default function Friends() {
  const router = useRouter();
  const { friends, referralBoost, updateReferralBoost } = useUserStore();

  const activeCount = friends.filter(
    (f) => Date.now() - new Date(f.lastActive).getTime() < 24 * 60 * 60 * 1000
  ).length;

  useEffect(() => {
    updateReferralBoost();
  }, [friends, updateReferralBoost]);

  return (
    <div className="min-h-screen bg-gray-900 p-4 pb-20">
      <div className="max-w-md mx-auto">
        <div className="flex items-center mb-6">
          <button
            onClick={() => router.push("/")}
            className="text-gray-400 hover:text-white mr-4"
          >
            &larr; Back
          </button>
          <h1 className="text-2xl font-bold text-white">Friends & Referrals</h1>
        </div>

        <ReferralLink />

        <ReferralBoostCard boost={referralBoost} friendCount={activeCount} />

        <div className="mt-6">
          <h2 className="text-xl font-semibold text-white mb-4">Your Friends</h2>
          <FriendsList friends={friends} />
        </div>
      </div>
    </div>
  );
}
