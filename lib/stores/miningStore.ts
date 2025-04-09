"use client"

import { create } from "zustand"
import { persist } from "zustand/middleware"
import { useUserStore } from "./userStore"
import { useNFTStore } from "./nftStore"
import {
  LEVEL_CONFIG,
  calculateMiningTime,
  calculateMiningRatePerSecond,
  calculateMiningEarnings,
  calculateTotalBoost,
  calculateTotalMiningRate,
  getLevelFromExperience,
} from "../config/miningConfig"

interface MiningState {
  isMining: boolean
  miningStartTime: number | null
  miningEndTime: number | null
  currentMined: number
  lastUpdateTime: number | null
  miningInterval: any

  // Mining actions
  startMining: () => void
  stopMining: (collectRewards: boolean) => void
  updateMining: () => void
  collectMiningRewards: () => number
  getRemainingMiningTime: () => number
  getMiningProgress: () => number
  getMiningStats: () => {
    totalRate: number
    totalBoost: number
    estimatedEarnings: number
    miningDuration: number
    timeReduction: number
  }
}

export const useMiningStore = create<MiningState>()(
  persist(
    (set, get) => ({
      isMining: false,
      miningStartTime: null,
      miningEndTime: null,
      currentMined: 0,
      lastUpdateTime: null,
      miningInterval: null,

      startMining: () => {
        const { isMining, miningInterval } = get()

        // Don't start if already mining
        if (isMining) return

        // Clear any existing interval
        if (miningInterval) {
          clearInterval(miningInterval)
        }

        const userState = useUserStore.getState()
        const level = getLevelFromExperience(userState.experience)
        const miningTime = calculateMiningTime(level, userState.miningTimeLevel)
        const now = Date.now()

        // Set up mining state
        set({
          isMining: true,
          miningStartTime: now,
          miningEndTime: now + miningTime,
          currentMined: 0,
          lastUpdateTime: now,
        })

        // Set up interval to update mining progress
        const interval = setInterval(() => {
          get().updateMining()
        }, 1000) // Update every second

        set({ miningInterval: interval })
      },

      stopMining: (collectRewards = true) => {
        const { miningInterval, isMining } = get()

        // Don't stop if not mining
        if (!isMining) return

        // Clear interval
        if (miningInterval) {
          clearInterval(miningInterval)
        }

        // Collect rewards if requested
        if (collectRewards) {
          get().collectMiningRewards()
        }

        // Reset mining state
        set({
          isMining: false,
          miningStartTime: null,
          miningEndTime: null,
          currentMined: 0,
          lastUpdateTime: null,
          miningInterval: null,
        })
      },

      updateMining: () => {
        const { isMining, miningEndTime, lastUpdateTime, currentMined } = get()

        // Don't update if not mining
        if (!isMining || !miningEndTime || !lastUpdateTime) return

        const now = Date.now()

        // Check if mining is complete
        if (now >= miningEndTime) {
          get().stopMining(true)
          return
        }

        // Calculate time elapsed since last update
        const timeElapsed = (now - lastUpdateTime) / 1000 // in seconds

        // Get user state for calculations
        const userState = useUserStore.getState()
        const nftState = useNFTStore.getState()
        const level = getLevelFromExperience(userState.experience)
        const config = LEVEL_CONFIG[level]

        // Calculate NFT boost
        const nftBoost = nftState.calculateTotalBoost(userState.userId || "").miningRate

        // Calculate mining rate per second
        const ratePerSecond = calculateMiningRatePerSecond(
          config.baseRate,
          userState.miningRateLevel,
          userState.miningBoostLevel,
          config.boost,
          userState.loginStreak,
          nftBoost,
          userState.referralBoost,
        )

        // Calculate new amount mined
        const newMined = currentMined + ratePerSecond * timeElapsed

        // Update state
        set({
          currentMined: newMined,
          lastUpdateTime: now,
        })
      },

      collectMiningRewards: () => {
        const { currentMined, isMining } = get()

        // Don't collect if not mining or no rewards
        if (!isMining || currentMined <= 0) return 0

        // Round to 2 decimal places
        const roundedRewards = Math.round(currentMined * 100) / 100

        // Add rewards to user balance
        const userState = useUserStore.getState()
        useUserStore.setState({
          wbuxDollars: userState.wbuxDollars + roundedRewards,
          // Add some experience based on mining rewards
          experience: userState.experience + Math.floor(roundedRewards * 0.5),
        })

        return roundedRewards
      },

      getRemainingMiningTime: () => {
        const { isMining, miningEndTime } = get()

        if (!isMining || !miningEndTime) return 0

        const now = Date.now()
        return Math.max(0, miningEndTime - now)
      },

      getMiningProgress: () => {
        const { isMining, miningStartTime, miningEndTime } = get()

        if (!isMining || !miningStartTime || !miningEndTime) return 0

        const now = Date.now()
        const totalDuration = miningEndTime - miningStartTime
        const elapsed = now - miningStartTime

        return Math.min(100, Math.floor((elapsed / totalDuration) * 100))
      },

      getMiningStats: () => {
        const userState = useUserStore.getState()
        const nftState = useNFTStore.getState()
        const level = getLevelFromExperience(userState.experience)
        const config = LEVEL_CONFIG[level]

        // Calculate NFT boost
        const nftBoosts = nftState.calculateTotalBoost(userState.userId || "")

        // Calculate total rate and boost
        const totalRate = calculateTotalMiningRate(config.baseRate, userState.miningRateLevel)
        const totalBoost = calculateTotalBoost(
          config.boost,
          userState.miningBoostLevel,
          userState.loginStreak,
          nftBoosts.miningRate,
          userState.referralBoost,
        )

        // Calculate mining duration in hours
        const miningTime = calculateMiningTime(level, userState.miningTimeLevel)
        const miningDuration = miningTime / (60 * 60 * 1000) // Convert ms to hours

        // Calculate time reduction in minutes
        const timeReduction = config.miningDuration * 60 - miningDuration * 60

        // Calculate estimated earnings
        const estimatedEarnings = calculateMiningEarnings(
          config.baseRate,
          config.miningDuration,
          userState.miningRateLevel,
          userState.miningBoostLevel,
          userState.miningTimeLevel,
          config.boost,
          userState.loginStreak,
          nftBoosts.miningRate,
          userState.referralBoost,
        )

        return {
          totalRate,
          totalBoost,
          estimatedEarnings,
          miningDuration,
          timeReduction,
        }
      },
    }),
    {
      name: "whalebux-mining-storage",
    },
  ),
)
