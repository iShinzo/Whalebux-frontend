"use client"

import { useEffect, useState } from "react"
import { userApi } from "./api-service"

// Extend the global Window type to include Telegram WebApp
declare global {
  interface Window {
    Telegram?: {
      WebApp?: {
        ready: () => void
        expand: () => void
        initDataUnsafe?: {
          user?: {
            id: number
            username?: string
            first_name?: string
            last_name?: string
          }
        }
      }
    }
  }
}

// Define types for the custom hook
interface TelegramWebApp {
  ready: () => void
  expand: () => void
  initDataUnsafe?: {
    user?: TelegramUser
  }
}

interface TelegramUser {
  id: number
  username?: string
  first_name?: string
  last_name?: string
}

interface UserData {
  userId: string
  telegramId: number // Ensure this is strictly a number (no undefined)
  username?: string
  firstName?: string
  lastName?: string
}

interface TelegramWebAppHook {
  webApp: TelegramWebApp | null
  user: UserData | null
  loading: boolean
  error: string | null
}

export function useTelegramWebApp(): TelegramWebAppHook {
  const [webApp, setWebApp] = useState<TelegramWebApp | null>(null)
  const [user, setUser] = useState<UserData | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // Ensure this runs only in a browser environment
    if (typeof window === "undefined") return

    const initTelegram = async () => {
      try {
        console.log("Initializing Telegram WebApp...")

        // Check if Telegram WebApp is available
        if (window.Telegram?.WebApp) {
          console.log("Telegram WebApp detected, initializing...")

          // Prepare the WebApp
          window.Telegram.WebApp.ready()
          window.Telegram.WebApp.expand()

          // Extract user data from Telegram initData
          const initData = window.Telegram.WebApp.initDataUnsafe
          const telegramUser = initData?.user

          if (telegramUser) {
            const telegramId = telegramUser.id
            console.log("Telegram user data:", telegramUser)

            try {
              // Fetch user data from the backend
              const userData = await userApi.getUserData(telegramId)
              console.log("User data fetched from API:", userData)
              setUser({
                ...userData,
                telegramId: userData.telegramId ?? telegramId, // Ensure telegramId is set
              })
            } catch (fetchError) {
              console.error("Error fetching user data:", fetchError)

              // Handle case when the user does not exist in the backend
              if (fetchError instanceof Error && fetchError.message.includes("404")) {
                console.log("User not found in database, creating new user...")

                try {
                  const newUser = await userApi.createUser({
                    telegramId,
                    username: telegramUser.username || `user_${telegramId}`,
                    firstName: telegramUser.first_name || "",
                    lastName: telegramUser.last_name || "",
                  })
                  console.log("New user created successfully:", newUser)
                  setUser({
                    ...newUser,
                    telegramId: newUser.telegramId ?? telegramId, // Ensure telegramId is set
                  })
                } catch (createError) {
                  console.error("Error creating new user:", createError)
                  setError(
                    `Failed to create user: ${
                      createError instanceof Error ? createError.message : String(createError)
                    }`
                  )
                }
              } else {
                setError(
                  `Failed to fetch user data: ${
                    fetchError instanceof Error ? fetchError.message : String(fetchError)
                  }`
                )
              }
            }
          } else {
            console.warn("No user data available from Telegram WebApp")
            setError("No user data available from Telegram")
          }

          // Update the WebApp state
          setWebApp(window.Telegram.WebApp)
        } else {
          console.warn("Telegram WebApp not detected. Ensure this is opened within Telegram.")
          setError("Not running inside Telegram")
        }
      } catch (initError) {
        console.error("Error initializing Telegram WebApp:", initError)
        setError(
          `Initialization error: ${
            initError instanceof Error ? initError.message : String(initError)
          }`
        )
      } finally {
        setLoading(false)
      }
    }

    initTelegram()
  }, [])

  return { webApp, user, loading, error }
}
