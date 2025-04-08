"use client"

// API service for interacting with the backend
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "https://whalebux-backend.onrender.com/api"

// Log the API URL on startup
if (typeof window !== "undefined") {
  console.log("API_BASE_URL:", API_BASE_URL)
}

// Add connection status monitoring
let isBackendAvailable = true

// Helper function to check if backend is available
const checkBackendAvailability = async () => {
  try {
    const healthUrl = `${API_BASE_URL.replace(/\/api$/, "")}/health`
    console.log("Checking backend health at:", healthUrl)

    const response = await fetch(healthUrl, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      cache: "no-store",
      mode: "cors", // Explicitly set CORS mode
    })

    console.log("Health check response:", response.status, response.statusText)

    if (response.ok) {
      const data = await response.json()
      console.log("Health check data:", data)
    }

    isBackendAvailable = response.ok
    return isBackendAvailable
  } catch (error) {
    console.error("Backend health check failed:", error)
    isBackendAvailable = false
    return false
  }
}

// Add this function to test CORS
const testCors = async () => {
  try {
    console.log("Testing CORS with backend...")
    const response = await fetch(`${API_BASE_URL.replace(/\/api$/, "")}/cors/test`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      mode: "cors", // Explicitly set CORS mode
    })
    
    console.log("CORS test response status:", response.status)
    
    if (response.ok) {
      const data = await response.json()
      console.log("CORS test successful:", data)
      return true
    } else {
      console.error("CORS test failed:", response.statusText)
      return false
    }
  } catch (error) {
    console.error("CORS test error:", error)
    return false
  }
}

// Check backend availability and CORS on startup
if (typeof window !== "undefined") {
  checkBackendAvailability()
    .then((available) => console.log(`Backend is ${available ? "available" : "unavailable"}`))
    .catch((err) => console.error("Error checking backend availability:", err))
  
  testCors()
    .then(success => console.log(`CORS test ${success ? "passed" : "failed"}`))
    .catch(err => console.error("Error during CORS test:", err))
}

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
  wbuxBalance: number // Token balance
  loginStreak: number
  referralCode: string
  referralCount: number
  referredBy?: string
  lastLogin: string
  miningRateLevel: number
  miningBoostLevel: number
  miningTimeLevel: number
  nftSlotLevel: number
  completedTasks: string[] // Array of task IDs
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
  global: boolean // If true, available to all users
  completed?: boolean // Client-side property
}

const createDefaultUser = (telegramId: number): UserData => {
  const userId = `user-${telegramId}-${Date.now()}`
  const referralCode = Math.random().toString(36).substring(2, 10).toUpperCase()

  return {
    userId: userId,
    telegramId: telegramId,
    level: 1,
    experience: 0,
    wbuxDollars: 0,
    wbuxBalance: 0,
    loginStreak: 0,
    referralCode: referralCode,
    referralCount: 0,
    lastLogin: new Date().toISOString(),
    miningRateLevel: 1,
    miningBoostLevel: 1,
    miningTimeLevel: 1,
    nftSlotLevel: 1,
    completedTasks: [],
  }
}

// User API
export const userApi = {
  // Get user data
  getUserData: async (telegramId: number): Promise<UserData> => {
    try {
      // Check if backend is available
      if (!isBackendAvailable) {
        await checkBackendAvailability()
      }

      const url = `${API_BASE_URL}/users/${telegramId}`
      console.log("Fetching user data from:", url)

      const response = await fetch(url, {
        headers: { "Content-Type": "application/json" },
        cache: "no-store",
        mode: "cors", // Explicitly set CORS mode
      })

      console.log("User data response:", response.status, response.statusText)

      if (!response.ok) {
        throw new Error(`Failed to fetch user data: ${response.status} ${response.statusText}`)
      }

      const userData = await response.json()
      console.log("User data received:", userData)
      return userData
    } catch (error) {
      console.error("Error fetching user data:", error)
      throw error
    }
  },

  // Create new user
  createUser: async (userData: CreateUserData): Promise<UserData> => {
    try {
      // Check if backend is available
      if (!isBackendAvailable) {
        await checkBackendAvailability()
      }

      console.log("Creating user with data:", userData);
      console.log("API URL being used:", `${API_BASE_URL}/users`);
      
      const response = await fetch(`${API_BASE_URL}/users`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData),
        mode: "cors", // Explicitly set CORS mode
      })

      console.log("Create user response status:", response.status, response.statusText);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error("Error response body:", errorText);
        throw new Error(`Failed to create user: ${response.status} ${response.statusText} - ${errorText}`);
      }

      const data = await response.json();
      console.log("User created successfully:", data);
      return data;
    } catch (error) {
      console.error("Error creating user:", error);
      if (error instanceof Error) {
        console.error("Error message:", error.message);
        console.error("Error stack:", error.stack);
      }
      throw error;
    }
  },

  // Update user data
  updateUserData: async (telegramId: number, updates: Partial<UserData>): Promise<UserData> => {
    try {
      // Check if backend is available
      if (!isBackendAvailable) {
        await checkBackendAvailability()
      }

      const response = await fetch(`${API_BASE_URL}/users/${telegramId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
        mode: "cors", // Explicitly set CORS mode
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
      // Check if backend is available
      if (!isBackendAvailable) {
        await checkBackendAvailability()
      }

      const response = await fetch(`${API_BASE_URL}/tasks?userId=${telegramId}`, {
        headers: { "Content-Type": "application/json" },
        cache: "no-store",
        mode: "cors", // Explicitly set CORS mode
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
      // Check if backend is available
      if (!isBackendAvailable) {
        await checkBackendAvailability()
      }

      const response = await fetch(`${API_BASE_URL}/tasks/${taskId}/complete`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: telegramId }),
        mode: "cors", // Explicitly set CORS mode
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
