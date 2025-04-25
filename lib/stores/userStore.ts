"use client"

import { create } from "zustand"
import { persist } from "zustand/middleware"

export interface Friend {
  id: string
  telegramId: number
  username: string
  firstName: string
  lastName?: string
  lastActive: string // ISO date string
  joinedAt: string // ISO date string
  isActive: boolean
}

interface UserState {
  userId: string | null
  telegramId: number | null
  username: string | null
  firstName: string | null
  lastName: string | null
  photoUrl: string | null
  level: number
  experience: number
  wbuxDollars: number
  wbuxBalance: number
  loginStreak: number
  referralCode: string | null
  referralCount: number
  referredBy: string | null
  lastLogin: string | null
  miningRateLevel: number
  miningBoostLevel: number
  miningTimeLevel: number
  nftSlotLevel: number
  completedTasks: string[]
  friends: Friend[]
  referralBoost: number

  // Actions
  setUser: (userData: Partial<UserState>) => void
  incrementLoginStreak: () => void
  resetLoginStreak: () => void
  addFriend: (friend: Friend) => void
  updateFriend: (telegramId: number, updates: Partial<Friend>) => void
  removeFriend: (telegramId: number) => void
  updateReferralBoost: () => void
  clearUser: () => void
}

export const useUserStore = create<UserState>()(
  persist(
    (set, get) => ({
      // Initial state
      userId: null,
      telegramId: null,
      username: null,
      firstName: null,
      lastName: null,
      photoUrl: null,
      level: 1,
      experience: 0,
      wbuxDollars: 0,
      wbuxBalance: 0,
      loginStreak: 1,
      referralCode: null,
      referralCount: 0,
      referredBy: null,
      lastLogin: null,
      miningRateLevel: 1,
      miningBoostLevel: 1,
      miningTimeLevel: 1,
      nftSlotLevel: 0,
      completedTasks: [],
      friends: [],
      referralBoost: 0,

      // Actions
      setUser: (userData) => set((state) => ({ ...state, ...userData })),
      incrementLoginStreak: () => set((state) => ({ ...state, loginStreak: state.loginStreak + 1 })),
      resetLoginStreak: () => set((state) => ({ ...state, loginStreak: 1 })),

      addFriend: (friend) =>
        set((state) => ({
          ...state,
          friends: [...state.friends, friend],
        })),

      updateFriend: (telegramId, updates) =>
        set((state) => ({
          ...state,
          friends: state.friends.map((friend) =>
            friend.telegramId === telegramId ? { ...friend, ...updates } : friend,
          ),
        })),

      removeFriend: (telegramId) =>
        set((state) => ({
          ...state,
          friends: state.friends.filter((friend) => friend.telegramId !== telegramId),
        })),

      updateReferralBoost: () => {
        const state = get()
        const activeCount = state.friends.filter(
          (f) => f.isActive && Date.now() - new Date(f.lastActive).getTime() < 24 * 60 * 60 * 1000,
        ).length

        // Calculate boost based on active referrals
        let boost = 0
        if (activeCount >= 20) boost = 25
        else if (activeCount >= 10) boost = 15
        else if (activeCount >= 5) boost = 10
        else if (activeCount >= 1) boost = 5

        set({ referralBoost: boost })
      },

      clearUser: () =>
        set({
          userId: null,
          telegramId: null,
          username: null,
          firstName: null,
          lastName: null,
          photoUrl: null,
          level: 1,
          experience: 0,
          wbuxDollars: 0,
          wbuxBalance: 0,
          loginStreak: 1,
          referralCode: null,
          referralCount: 0,
          referredBy: null,
          lastLogin: null,
          miningRateLevel: 1,
          miningBoostLevel: 1,
          miningTimeLevel: 1,
          nftSlotLevel: 0,
          completedTasks: [],
          friends: [],
          referralBoost: 0,
        }),
    }),
    {
      name: "whalebux-user-storage",
    },
  ),
)
