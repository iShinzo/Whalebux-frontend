"use client"

// API service for interacting with the backend
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "https://whalebux-vercel.onrender.com/api"

// Backend connection status
let isBackendAvailable = true

// Types
interface UserData {
  userId: string
  telegramId?: number
  username?: string
  firstName?: string
  lastName?: string
  level: number
  experience: number
  wbuxDollars: number
  wbuxBalance: number
  loginStreak: number
  referralCode: string
  referralCount: number
  referredBy?: string
  lastLogin: string
  miningRateLevel: number
  miningBoostLevel: number
  miningTimeLevel: number
  nftSlotLevel: number
  completedTasks: string[]
}

interface CreateUserData {
  telegramId: number
  username?: string
  firstName?: string
  lastName?: string
  referredBy?: string
}

interface Task {
  id: string
  type: "AIRDROP" | "CHANNEL_JOIN" | "REFERRAL" | "DAILY"
  title: string
  description: string
  reward: number
  rewardType: "DOLLARS" | "TOKENS"
  expiresAt?: string
  createdAt: string
  global: boolean
  completed?: boolean
}

interface Friend {
  userId: string
  telegramId: number
  username?: string
  firstName?: string
  lastName?: string
}

// Helper function to check backend availability
const checkBackendAvailability = async (): Promise<boolean> => {
  const healthUrl = `${API_BASE_URL.replace(/\/api$/, "")}/health`
  try {
    const response = await fetch(healthUrl, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      cache: "no-store",
    })
    isBackendAvailable = response.ok
    return isBackendAvailable
  } catch (error) {
    console.error("Backend health check failed:", error)
    isBackendAvailable = false
    return false
  }
}

// User API
export const userApi = {
  // Get user data
  getUserData: async (telegramId: number): Promise<UserData> => {
    try {
      if (!isBackendAvailable && !(await checkBackendAvailability())) {
        throw new Error("Backend is unavailable")
      }

      const url = `${API_BASE_URL}/users/${telegramId}`
      const response = await fetch(url, {
        headers: { "Content-Type": "application/json" },
        cache: "no-store",
      })

      if (!response.ok) {
        throw new Error(`Failed to fetch user data: ${response.statusText}`)
      }

      return await response.json()
    } catch (error) {
      console.error("Error fetching user data:", error)
      throw error
    }
  },

  // Create new user
  createUser: async (userData: CreateUserData): Promise<UserData> => {
    try {
      if (!isBackendAvailable && !(await checkBackendAvailability())) {
        throw new Error("Backend is unavailable")
      }

      const url = `${API_BASE_URL}/users`
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData),
      })

      if (!response.ok) {
        throw new Error(`Failed to create user: ${response.statusText}`)
      }

      return await response.json()
    } catch (error) {
      console.error("Error creating user:", error)
      throw error
    }
  },

  // Update user data
  updateUserData: async (telegramId: number, updates: Partial<UserData>): Promise<UserData> => {
    try {
      if (!isBackendAvailable && !(await checkBackendAvailability())) {
        throw new Error("Backend is unavailable")
      }

      const url = `${API_BASE_URL}/users/${telegramId}`
      const response = await fetch(url, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
      })

      if (!response.ok) {
        throw new Error(`Failed to update user data: ${response.statusText}`)
      }

      return await response.json()
    } catch (error) {
      console.error("Error updating user data:", error)
      throw error
    }
  },
}

// Task API
export const taskApi = {
  // Get tasks for user
  getTasksForUser: async (telegramId: number): Promise<Task[]> => {
    try {
      if (!isBackendAvailable && !(await checkBackendAvailability())) {
        return []
      }

      const url = `${API_BASE_URL}/tasks?userId=${telegramId}`
      const response = await fetch(url, {
        headers: { "Content-Type": "application/json" },
        cache: "no-store",
      })

      if (!response.ok) {
        throw new Error(`Failed to fetch tasks: ${response.statusText}`)
      }

      return await response.json()
    } catch (error) {
      console.error("Error fetching tasks:", error)
      return []
    }
  },

  // Complete task
  completeTask: async (taskId: string, telegramId: number): Promise<any> => {
    try {
      if (!isBackendAvailable && !(await checkBackendAvailability())) {
        throw new Error("Backend is unavailable")
      }

      const url = `${API_BASE_URL}/tasks/${taskId}/complete`
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: telegramId }),
      })

      if (!response.ok) {
        throw new Error(`Failed to complete task: ${response.statusText}`)
      }

      return await response.json()
    } catch (error) {
      console.error("Error completing task:", error)
      throw error
    }
  },
}

// Get referred friends
export const getFriends = async (telegramId: number): Promise<Friend[]> => {
  try {
    const url = `${API_BASE_URL}/users/${telegramId}/friends`
    const response = await fetch(url, {
      headers: { "Content-Type": "application/json" },
      cache: "no-store",
    })

    if (!response.ok) {
      throw new Error(`Failed to fetch friends: ${response.statusText}`)
    }

    return await response.json()
  } catch (error) {
    console.error("Error fetching friends:", error)
    return []
  }
}

// Check if a referral code is valid
export const checkReferralCode = async (referralCode: string): Promise<boolean> => {
  try {
    const url = `${API_BASE_URL}/referrals/check/${referralCode}`
    const response = await fetch(url, {
      headers: { "Content-Type": "application/json" },
      cache: "no-store",
    })

    if (!response.ok) {
      return false
    }

    const data = await response.json()
    return data.valid
  } catch (error) {
    console.error("Error checking referral code:", error)
    return false
  }
}

// Apply a referral code
export const applyReferralCode = async (telegramId: number, referralCode: string): Promise<boolean> => {
  try {
    const url = `${API_BASE_URL}/referrals/apply`
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ telegramId, referralCode }),
    })

    if (!response.ok) {
      throw new Error(`Failed to apply referral code: ${response.statusText}`)
    }

    const data = await response.json()
    return data.success
  } catch (error) {
    console.error("Error applying referral code:", error)
    return false
  }
}
