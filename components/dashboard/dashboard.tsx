"use client";

import { useEffect, useState } from "react";
import { useTelegramWebApp } from "../../lib/telegram-init";
import { userApi, taskApi } from "../../lib/api-service";
import { useUserStore } from "../../lib/stores/userStore";
import Link from "next/link";

// Define the UserData interface
interface UserData {
  userId: string;
  telegramId: number | null; // Adjusted to match expected type
  username?: string; // Optional property
  firstName?: string; // Optional property
  lastName?: string; // Optional property
  level?: number; // Optional property
  experience?: number;
  wbuxDollars?: number;
  wbuxBalance?: number;
  loginStreak?: number;
  referralCode?: string;
  referralCount?: number;
  lastLogin?: string;
  miningRateLevel?: number;
  miningBoostLevel?: number;
  miningTimeLevel?: number;
  nftSlotLevel?: number;
  completedTasks?: string[];
}

// Define the Task type
interface Task {
  id: string;
  title: string;
  description: string;
  reward: number;
  rewardType: "DOLLARS" | "TOKENS";
  completed?: boolean; // Made optional to handle undefined values
}

export const Dashboard = () => {
  const { webApp, user, loading, error } = useTelegramWebApp();
  const [tasks, setTasks] = useState<Task[]>([]); // Explicitly define the type as Task[]
  const [loadingTasks, setLoadingTasks] = useState(true);
  const setUser = useUserStore((state) => state.setUser);
  const referralBoost = useUserStore((state) => state.referralBoost);

  useEffect(() => {
    if (user && user.telegramId) {
      // Update the user store with the user data from the API
      const userData: Partial<UserData> = {
        userId: user.userId,
        telegramId: user.telegramId as number | null, // Ensure compatibility with expected type
        username: user.username || "Unknown", // Provide default value
        firstName: user.firstName || "Unknown",
        lastName: user.lastName || "Unknown",
        level: user.level || 0, // Default to 0 if undefined
        experience: user.experience || 0, // Default to 0 if undefined
        wbuxDollars: user.wbuxDollars || 0,
        wbuxBalance: user.wbuxBalance || 0,
        loginStreak: user.loginStreak || 0,
        referralCode: user.referralCode || "",
        referralCount: user.referralCount || 0,
        lastLogin: user.lastLogin || "",
        miningRateLevel: user.miningRateLevel || 0,
        miningBoostLevel: user.miningBoostLevel || 0,
        miningTimeLevel: user.miningTimeLevel || 0,
        nftSlotLevel: user.nftSlotLevel || 0,
        completedTasks: user.completedTasks || [],
      };

      setUser(userData); // Use Partial<UserData> to match the expected type

      taskApi
        .getTasksForUser(user.telegramId)
        .then((tasks: Task[]) => {
          setTasks(tasks); // Ensure tasks match the Task[] type
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
