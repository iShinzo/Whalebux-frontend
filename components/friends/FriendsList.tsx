"use client"

import { useState, useMemo } from "react"
import type { Friend } from "../../lib/stores/userStore"
import { formatDistanceToNow } from "date-fns"

interface FriendsListProps {
  friends: Friend[]
}

export default function FriendsList({ friends }: FriendsListProps) {
  const [filter, setFilter] = useState<"all" | "active" | "inactive">("all")

  // Helper function to determine if a friend is active
  const isActive = (lastActive: string): boolean => {
    return Date.now() - new Date(lastActive).getTime() < 24 * 60 * 60 * 1000
  }

  // Filtered and sorted friends, memoized for performance
  const filteredAndSortedFriends = useMemo(() => {
    const filtered = friends.filter((friend) => {
      if (filter === "all") return true
      return filter === "active" ? isActive(friend.lastActive) : !isActive(friend.lastActive)
    })

    return filtered.sort((a, b) => {
      const aActive = isActive(a.lastActive)
      const bActive = isActive(b.lastActive)

      if (aActive && !bActive) return -1
      if (!aActive && bActive) return 1

      return new Date(b.lastActive).getTime() - new Date(a.lastActive).getTime()
    })
  }, [friends, filter])

  // Handle empty friends list
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
      {/* Filter Buttons */}
      <div className="flex mb-4 bg-gray-700 rounded-lg p-1">
        {["all", "active", "inactive"].map((filterType) => (
          <button
            key={filterType}
            aria-label={`Filter ${filterType} friends`}
            className={`flex-1 py-1 rounded-md text-sm ${
              filter === filterType ? "bg-gray-600 text-white" : "text-gray-400"
            }`}
            onClick={() => setFilter(filterType as "all" | "active" | "inactive")}
          >
            {filterType.charAt(0).toUpperCase() + filterType.slice(1)} ({friends.filter((friend) =>
              filterType === "all"
                ? true
                : filterType === "active"
                ? isActive(friend.lastActive)
                : !isActive(friend.lastActive)
            ).length})
          </button>
        ))}
      </div>

      {/* Friends List */}
      <div className="space-y-3">
        {filteredAndSortedFriends.length > 0 ? (
          filteredAndSortedFriends.map((friend) => (
            <div key={friend.telegramId} className="flex items-center bg-gray-700 rounded-lg p-3">
              {/* Friend's Initial */}
              <div className="w-10 h-10 rounded-full bg-gray-600 flex items-center justify-center text-lg font-bold text-white">
                {friend.firstName.charAt(0)}
              </div>

              {/* Friend's Details */}
              <div className="ml-3 flex-grow">
                <div className="flex items-center">
                  <span className="text-white font-medium">
                    {friend.firstName} {friend.lastName || ""}
                  </span>
                  {/* Active/Inactive Badge */}
                  <span
                    className={`ml-2 text-xs px-2 py-0.5 rounded-full bg-opacity-20 ${
                      isActive(friend.lastActive)
                        ? "bg-green-500 text-green-400"
                        : "bg-gray-500 text-gray-400"
                    }`}
                  >
                    {isActive(friend.lastActive) ? "Active" : "Inactive"}
                  </span>
                </div>
                <div className="text-gray-400 text-xs">
                  Last active: {formatDistanceToNow(new Date(friend.lastActive))} ago
                </div>
              </div>

              {/* Joined Date */}
              <div className="text-xs text-gray-400">
                Joined {formatDistanceToNow(new Date(friend.joinedAt))} ago
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-4 text-gray-400">No {filter} friends found</div>
        )}
      </div>
    </div>
  )
}
