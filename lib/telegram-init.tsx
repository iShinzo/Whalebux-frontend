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

    // Check if we're in a Telegram WebApp environment
    if (!window.Telegram?.WebApp) {
      console.log("Not running in Telegram WebApp environment");
      setLoading(false);
      setError("Please open this app through Telegram.");
      return;
    }

    const initTelegram = async () => {
      try {
        console.log("Initializing Telegram WebApp...");

        const telegramWebApp = window.Telegram?.WebApp as TelegramWebApp;
        if (!telegramWebApp) {
          throw new Error("Telegram WebApp not found");
        }

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
    if (user && typeof window !== "undefined") {
      // Update the Zustand user store with backend/Telegram data
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

      // Use dynamic import for the store to avoid circular dependencies
      import("./stores/userStore").then(({ useUserStore }) => {
        useUserStore.setState({
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
      });
    }
  }, [user]);

  return { webApp, user, loading, error };
}