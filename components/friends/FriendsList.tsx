"use client"

import { useState } from "react"
import type { Friend } from "../../lib/stores/userStore"
import { formatDistanceToNow } from "date-fns"

interface FriendsListProps {
  friends: Friend[]
}

export default function FriendsList({ friends }: FriendsListProps) {
  const [filter, setFilter] = useState<"all" | "active" | "inactive">("all")

  const filteredFriends = friends.filter((friend) => {
    if (filter === "all") return true
    const isActive = Date.now() - new Date(friend.lastActive).getTime() < 24 * 60 * 60 * 1000
    return filter === "active" ? isActive : !isActive
  })

  const sortedFriends = [...filteredFriends].sort((a, b) => {
    // Sort by active status first, then by last active date
    const aActive = Date.now() - new Date(a.lastActive).getTime() < 24 * 60 * 60 * 1000
    const bActive = Date.now() - new Date(b.lastActive).getTime() < 24 * 60 * 60 * 1000

    if (aActive && !bActive) return -1
    if (!aActive && bActive) return 1

    return new Date(b.lastActive).getTime() - new Date(a.lastActive).getTime()
  })

  if (friends.length === 0) {
    return (
      <div className="bg-gray-800 rounded-lg p-4 text-center">
        <p className="text-gray-400">You haven't referred any friends yet.</p>
        <p className="text-gray-400 text-sm mt-2">Share your referral link to get started!</p>
      </div>
    )
  }

  return (
    <div className="bg-gray-800 rounded-lg p-4">
      <div className="flex mb-4 bg-gray-700 rounded-lg p-1">
        <button
          className={`flex-1 py-1 rounded-md text-sm ${filter === "all" ? "bg-gray-600 text-white" : "text-gray-400"}`}
          onClick={() => setFilter("all")}
        >
          All ({friends.length})
        </button>
        <button
          className={`flex-1 py-1 rounded-md text-sm ${filter === "active" ? "bg-gray-600 text-white" : "text-gray-400"}`}
          onClick={() => setFilter("active")}
        >
          Active
        </button>
        <button
          className={`flex-1 py-1 rounded-md text-sm ${filter === "inactive" ? "bg-gray-600 text-white" : "text-gray-400"}`}
          onClick={() => setFilter("inactive")}
        >
          Inactive
        </button>
      </div>

      <div className="space-y-3">
        {sortedFriends.length > 0 ? (
          sortedFriends.map((friend) => (
            <div key={friend.telegramId} className="flex items-center bg-gray-700 rounded-lg p-3">
              <div className="w-10 h-10 rounded-full bg-gray-600 flex items-center justify-center text-lg font-bold text-white">
                {friend.firstName.charAt(0)}
              </div>

              <div className="ml-3 flex-grow">
                <div className="flex items-center">
                  <span className="text-white font-medium">
                    {friend.firstName} {friend.lastName || ""}
                  </span>
                  <span
                    className="ml-2 text-xs px-2 py-0.5 rounded-full bg-opacity-20 
                    ${(Date.now() - new Date(friend.lastActive).getTime()) < 24 * 60 * 60 * 1000 
                      ? 'bg-green-500 text-green-400' 
                      : 'bg-gray-500 text-gray-400'}"
                  >
                    {Date.now() - new Date(friend.lastActive).getTime() < 24 * 60 * 60 * 1000 ? "Active" : "Inactive"}
                  </span>
                </div>
                <div className="text-gray-400 text-xs">
                  Last active: {formatDistanceToNow(new Date(friend.lastActive))} ago
                </div>
              </div>

              <div className="text-xs text-gray-400">Joined {formatDistanceToNow(new Date(friend.joinedAt))} ago</div>
            </div>
          ))
        ) : (
          <div className="text-center py-4 text-gray-400">No {filter} friends found</div>
        )}
      </div>
    </div>
  )
}
