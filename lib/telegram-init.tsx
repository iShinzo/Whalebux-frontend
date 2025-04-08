"use client"

import { useEffect, useState } from "react"
import { userApi } from "./api-service"

declare global {
  interface Window {
    Telegram?: {
      WebApp?: any
    }
  }
}

export function useTelegramWebApp() {
  const [webApp, setWebApp] = useState<any>(null)
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // Check if we're in a browser environment
    if (typeof window === "undefined") return

    const initTelegram = async () => {
      try {
        console.log("Initializing Telegram WebApp...")
        console.log("Window object:", typeof window)
        console.log("Telegram object:", typeof window.Telegram)
        console.log("WebApp object:", window.Telegram?.WebApp)

        // Initialize Telegram WebApp if available
        if (window.Telegram?.WebApp) {
          console.log("Telegram WebApp found, initializing...")

          // Initialize the WebApp
          window.Telegram.WebApp.ready()

          // Expand the WebApp to full height
          window.Telegram.WebApp.expand()

          // Get user data from Telegram
          const initData = window.Telegram.WebApp.initDataUnsafe

          if (initData && initData.user) {
            console.log("User data from Telegram:", initData.user)

            // Get or create user in our database
            const telegramId = initData.user.id

            try {
              // Check if user exists in our database
              const userData = await userApi.getUserData(telegramId)
              console.log("User data from API:", userData)
              setUser(userData)
            } catch (error) {
              console.error("Error fetching user data:", error)

              // If user doesn't exist, create a new user
              if (error instanceof Error && (error.message.includes("404") || error.message.includes("not found"))) {
                console.log("Creating new user...")

                try {
                  // Create new user with Telegram data
                  console.log("Attempting to create user with telegramId:", telegramId);
                  console.log("User data to be sent:", {
                    telegramId: telegramId,
                    username: initData.user.username || `user_${telegramId}`,
                    firstName: initData.user.first_name || "",
                    lastName: initData.user.last_name || "",
                  });
                  
                  const newUser = await userApi.createUser({
                    telegramId: telegramId,
                    username: initData.user.username || `user_${telegramId}`,
                    firstName: initData.user.first_name || "",
                    lastName: initData.user.last_name || "",
                  });
                  console.log("New user created successfully:", newUser);
                  setUser(newUser);
                } catch (createError) {
                  console.error("Error creating user in telegram-init:", createError);
                  console.error("Error type:", typeof createError);
                  console.error("Error details:", createError instanceof Error ? createError.message : String(createError));
                  setError(`Failed to create user account: ${createError instanceof Error ? createError.message : String(createError)}`);
                }
              } else {
                setError(`Failed to fetch user data: ${error instanceof Error ? error.message : String(error)}`)
              }
            }
          } else {
            console.warn("No user data in Telegram WebApp initDataUnsafe")
            setError("No user data available from Telegram")
          }

          // Set the WebApp in state
          setWebApp(window.Telegram.WebApp)
        } else {
          console.warn("Telegram WebApp not found. Are you opening this app from within Telegram?")
          setError("Not running inside Telegram")
        }
      } catch (error) {
        console.error("Error initializing Telegram WebApp:", error)
        setError(`Initialization error: ${error instanceof Error ? error.message : String(error)}`)
      } finally {
        setLoading(false)
      }
    }

    initTelegram()
  }, [])

  return { webApp, user, loading, error }
}
