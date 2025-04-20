"use client";

import { useEffect, useState } from "react";
import { userApi } from "./api-service";

// Define the Telegram WebApp interface (local to this file)
interface TelegramWebApp {
  ready: () => void;
  expand: () => void;
  initData: string;
  initDataUnsafe?: {
    user?: {
      id: number;
      username?: string;
      first_name?: string;
      last_name?: string;
    };
  };
}

interface TelegramUser {
  id: number;
  username?: string;
  first_name?: string;
  last_name?: string;
}

interface UserData {
  userId: string;
  telegramId: number | null;
  username?: string;
  firstName?: string;
  lastName?: string;
  wbuxBalance?: number;
  level?: number;
  referralCode?: string;
  referralCount?: number;
  miningRateLevel?: number;
}

interface TelegramWebAppHook {
  webApp: TelegramWebApp | null;
  user: UserData | null;
  loading: boolean;
  error: string | null;
}

export function useTelegramWebApp(): TelegramWebAppHook {
  const [webApp, setWebApp] = useState<TelegramWebApp | null>(null);
  const [user, setUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") {
      setLoading(false);
      setError("This hook must run in a browser environment.");
      return;
    }

    // Debugging: Log the window.Telegram object to inspect it
    console.log("window.Telegram:", window.Telegram);

    // Mock Telegram WebApp in development mode
    if (process.env.NODE_ENV === "development" && !window.Telegram?.WebApp) {
      console.log("Mocking Telegram WebApp for development.");
      const mockWebApp: TelegramWebApp = {
        ready: () => console.log("Mock Telegram WebApp is ready"),
        expand: () => console.log("Mock Telegram WebApp expanded"),
        initData: "mock_init_data",
        initDataUnsafe: {
          user: {
            id: 1,
            username: "mock_user",
            first_name: "Mock",
            last_name: "User",
          },
        },
      };
      window.Telegram = { WebApp: mockWebApp };
    }

    const initTelegram = async () => {
      try {
        console.log("Initializing Telegram WebApp...");

        // Check if window.Telegram and window.Telegram.WebApp exist
        if (!window.Telegram || !window.Telegram.WebApp) {
          console.error("Telegram WebApp not detected.");
          setError(
            "Telegram WebApp not detected. Ensure this app is opened via a Telegram bot's WebApp link or button.",
          );
          return;
        }

        const telegramWebApp = window.Telegram.WebApp as TelegramWebApp;
        console.log("Telegram WebApp detected:", telegramWebApp);

        // Initialize Telegram WebApp
        telegramWebApp.ready();
        telegramWebApp.expand();

        // Get user data from Telegram
        const initData = telegramWebApp.initDataUnsafe;
        const telegramUser = initData?.user;

        if (!telegramUser) {
          console.log("No Telegram user data found.");
          setError("No Telegram user data available.");
          return;
        }

        const telegramId = telegramUser.id;
        console.log("Telegram user data:", telegramUser);

        try {
          // Fetch user data from API
          const userData = await userApi.getUserData(telegramId);
          console.log("User data fetched from API:", userData);
          setUser({
            userId: userData.userId,
            telegramId: userData.telegramId ?? telegramId,
            username: userData.username,
            firstName: userData.firstName,
            lastName: userData.lastName,
          });
        } catch (fetchError) {
          console.error("Error fetching user data:", fetchError);

          // Handle 404 (user not found) by creating a new user
          if (fetchError instanceof Error && fetchError.message.includes("404")) {
            console.log("User not found in database, creating new user...");
            try {
              const newUser = await userApi.createUser({
                telegramId,
                username: telegramUser.username || `user_${telegramId}`,
                firstName: telegramUser.first_name || "",
                lastName: telegramUser.last_name || "",
              });
              console.log("New user created successfully:", newUser);
              setUser({
                userId: newUser.userId,
                telegramId: newUser.telegramId ?? telegramId,
                username: newUser.username,
                firstName: newUser.firstName,
                lastName: newUser.lastName,
              });
            } catch (createError) {
              console.error("Error creating new user:", createError);
              setError(
                `Failed to create user: ${
                  createError instanceof Error ? createError.message : String(createError)
                }`,
              );
            }
          } else {
            setError(
              `Failed to fetch user data: ${
                fetchError instanceof Error ? fetchError.message : String(fetchError)
              }`,
            );
          }
        }

        setWebApp(telegramWebApp);
      } catch (err) {
        console.error("Error initializing Telegram WebApp:", err);
        setError(
          `Error initializing Telegram WebApp: ${
            err instanceof Error ? err.message : String(err)
          }`,
        );
      } finally {
        setLoading(false);
      }
    };

    initTelegram();
  }, []);

  useEffect(() => {
    if (user) {
      // Update the Zustand user store with backend/Telegram data
      // Use actual backend values, fallback to defaults if missing
      const {
        userId,
        telegramId,
        username,
        firstName,
        lastName,
        wbuxBalance = 100.0,
        level = 1,
        referralCode = `REF_${user.telegramId}`,
        referralCount = 0,
        miningRateLevel = 0,
      } = user;
      // Import useUserStore at the top if not already
      // import { useUserStore } from "./stores/userStore";
      // Set state
      if (typeof window !== "undefined") {
        // Only update on client
        require("./stores/userStore").useUserStore.setState({
          userId,
          telegramId,
          username,
          firstName,
          lastName,
          wbuxBalance,
          level,
          referralCode,
          referralCount,
          miningRateLevel,
        });
      }
    }
  }, [user]);

  return { webApp, user, loading, error };
}