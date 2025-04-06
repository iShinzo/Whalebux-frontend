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

  useEffect(() => {
    // Check if we're in a browser environment
    if (typeof window === "undefined") return

    // Log detailed information about the Telegram WebApp
    console.log("Window object:", typeof window)
    console.log("Telegram object:", typeof window.Telegram)
    console.log("WebApp object:", window.Telegram?.WebApp)

    // Initialize Telegram WebApp if available
    if (window.Telegram?.WebApp) {
      console.log("Telegram WebApp found, initializing...")

      try {
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

          // Check if user exists in our database
          userApi
            .getUserData(telegramId)
            .then((userData) => {
              console.log("User data from API:", userData)
              setUser(userData)
              setLoading(false)
            })
            .catch((error) => {
              console.error("Error fetching user data:", error)

              // If user doesn't exist, create a new user
              if (error.message.includes("404") || error.message.includes("not found")) {
                console.log("Creating new user...")

                // Create new user with Telegram data
                userApi
                  .createUser({
                    telegramId: telegramId,
                    username: initData.user.username || `user_${telegramId}`,
                    firstName: initData.user.first_name || "",
                    lastName: initData.user.last_name || "",
                  })
                  .then((newUser) => {
                    console.log("New user created:", newUser)
                    setUser(newUser)
                    setLoading(false)
                  })
                  .catch((createError) => {
                    console.error("Error creating user:", createError)
                    setLoading(false)
                  })
              } else {
                setLoading(false)
              }
            })
        } else {
          console.warn("No user data in Telegram WebApp initDataUnsafe")
          setLoading(false)
        }

        // Set the WebApp in state
        setWebApp(window.Telegram.WebApp)
      } catch (error) {
        console.error("Error initializing Telegram WebApp:", error)
        setLoading(false)
      }
    } else {
      console.warn("Telegram WebApp not found. Are you opening this app from within Telegram?")
      setLoading(false)
    }
  }, [])

  return { webApp, user, loading }
}

