"use client";

import { useEffect, useState } from "react";
import { useTelegramWebApp } from "../../lib/telegram-init";
import { userApi, taskApi } from "../../lib/api-service";
import { useUserStore } from "../../lib/stores/userStore";
import Link from "next/link";

// Define the UserData interface to match the actual structure of the user object
interface UserData {
  userId: string;
  telegramId: string | number | null; // Allow string or number for compatibility
  username: string;
  firstName: string;
  lastName: string;
  level?: number; // Optional property
  experience?: number; // Optional property
  wbuxDollars?: number; // Optional property
  wbuxBalance?: number; // Optional property
  loginStreak?: number; // Optional property
  referralCode?: string; // Optional property
  referralCount?: number; // Optional property
  lastLogin?: string; // Optional property
  miningRateLevel?: number; // Optional property
  miningBoostLevel?: number; // Optional property
  miningTimeLevel?: number; // Optional property
  nftSlotLevel?: number; // Optional property
  completedTasks?: string[]; // Optional property
}

// Define the Task type
interface Task {
  id: string;
  title: string;
  description: string;
  reward: number;
  rewardType: "DOLLARS" | "TOKENS";
  completed?: boolean; // Optional property
}

export const Dashboard = () => {
  const { webApp, user, loading, error } = useTelegramWebApp();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loadingTasks, setLoadingTasks] = useState(true);
  const setUser = useUserStore((state) => state.setUser);
  const referralBoost = useUserStore((state) => state.referralBoost);

  useEffect(() => {
    if (user && user.telegramId) {
      // Debug the user object to inspect its structure
      console.log("User object:", user);

      // Update the user store with the user data from the API
      const userData: Partial<UserData> = {
        userId: user.userId,
        telegramId: typeof user.telegramId === "string" ? parseInt(user.telegramId, 10) : user.telegramId, // Ensure telegramId is a number
        username: user.username || "Unknown",
        firstName: user.firstName || "Unknown",
        lastName: user.lastName || "Unknown",
        level: user.level ?? 0, // Use nullish coalescing for fallback
        experience: user.experience ?? 0,
        wbuxDollars: user.wbuxDollars ?? 0,
        wbuxBalance: user.wbuxBalance ?? 0,
        loginStreak: user.loginStreak ?? 0,
        referralCode: user.referralCode || "",
        referralCount: user.referralCount ?? 0,
        lastLogin: user.lastLogin || "",
        miningRateLevel: user.miningRateLevel ?? 0,
        miningBoostLevel: user.miningBoostLevel ?? 0,
        miningTimeLevel: user.miningTimeLevel ?? 0,
        nftSlotLevel: user.nftSlotLevel ?? 0,
        completedTasks: user.completedTasks || [],
      };

      setUser(userData); // Use Partial<UserData> with corrected telegramId type

      // Fetch tasks for the user
      taskApi
        .getTasksForUser(user.telegramId)
        .then((tasks: Task[]) => {
          setTasks(tasks);
          setLoadingTasks(false);
        })
        .catch((error) => {
          console.error("Error fetching tasks:", error);
          setLoadingTasks(false);
        });
    }
  }, [user, setUser]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <h1 className="text-3xl font-bold text-white mb-4">Error</h1>
        <p className="text-white mb-4">
          {error || "Could not authenticate with Telegram. Please try again."}
        </p>
        <div className="bg-gray-800 rounded-lg p-4 w-full max-w-md mb-4">
          <h2 className="text-xl font-bold text-white mb-2">Debug Information</h2>
          <p className="text-gray-400 text-sm">
            API URL: {process.env.NEXT_PUBLIC_API_URL || "Not set"}
          </p>
          <p className="text-gray-400 text-sm">
            Environment: {process.env.NODE_ENV}
          </p>
          <p className="text-gray-400 text-sm">
            Telegram WebApp: {webApp ? "Available" : "Not Available"}
          </p>
        </div>
        <a
          href="/test"
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Go to Test Mode
        </a>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <h1 className="text-3xl font-bold text-white mb-4">Welcome to WhaleBux!</h1>

      {/* Additional UI components */}
    </div>
  );
};
