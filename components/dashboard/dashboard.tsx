"use client";

import { useEffect, useState } from "react";
import { useTelegramWebApp } from "../../lib/telegram-init";
import { userApi, taskApi } from "../../lib/api-service";
import { useUserStore } from "../../lib/stores/userStore";
import { getLevelFromExperience, getLevelProgress, getExperienceForNextLevel } from "../../lib/config/miningConfig";
import Link from "next/link";

// Define the UserData interface to match the expected UserState
interface UserData {
  userId: string;
  telegramId: number | null; // Align with UserState
  username: string;
  firstName: string;
  lastName: string;
  level?: number;
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
  completed?: boolean;
}

// Define the shape of the user object returned by useTelegramWebApp
interface TelegramUser {
  userId: string;
  telegramId: string | number | null;
  username?: string;
  firstName?: string;
  lastName?: string;
  level?: number;
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

// Define the shape of the useTelegramWebApp hook return value
interface TelegramWebApp {
  webApp: any; // Replace with actual Telegram WebApp type if available
  user: TelegramUser | null;
  loading: boolean;
  error: string | null;
}

export const Dashboard = () => {
  const { webApp, user, loading, error } = useTelegramWebApp() as TelegramWebApp;
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loadingTasks, setLoadingTasks] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const setUser = useUserStore((state) => state.setUser);
  const referralBoost = useUserStore((state) => state.referralBoost);
  const userStore = useUserStore();
  const level = getLevelFromExperience(userStore.experience ?? 0);
  const levelProgress = getLevelProgress(userStore.experience ?? 0, level);
  const nextLevelXp = getExperienceForNextLevel(level);
  const telegramId = userStore.telegramId;

  async function handleRefresh() {
    if (!telegramId) return;
    setRefreshing(true);
    try {
      const freshUser = await userApi.getUserData(telegramId);
      userStore.setUser(freshUser);
    } catch (e) {
      // Optionally show error
    }
    setRefreshing(false);
  }

  useEffect(() => {
    if (user && user.telegramId) {
      // Debug the user object to inspect its structure
      console.log("User object:", user);

      // Convert telegramId to a number, handling edge cases
      let telegramId: number | null = null;
      if (typeof user.telegramId === "string") {
        const parsedId = parseInt(user.telegramId, 10);
        telegramId = isNaN(parsedId) ? null : parsedId;
      } else if (typeof user.telegramId === "number") {
        telegramId = user.telegramId;
      }

      // Construct userData with proper typing
      const userData: Partial<UserData> = {
        userId: user.userId,
        telegramId, // Now guaranteed to be number | null
        username: user.username || "Unknown",
        firstName: user.firstName || "Unknown",
        lastName: user.lastName || "Unknown",
        level: user.level ?? 0,
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

      setUser(userData); // TypeScript error resolved

      // Fetch tasks for the user
      if (telegramId !== null) {
        taskApi
          .getTasksForUser(telegramId)
          .then((tasks: Task[]) => {
            setTasks(tasks);
            setLoadingTasks(false);
          })
          .catch((err) => {
            console.error("Error fetching tasks:", err);
            setLoadingTasks(false);
          });
      } else {
        console.warn("Skipping task fetch: telegramId is null");
        setLoadingTasks(false);
      }
    }
  }, [user, setUser]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div
          className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"
          role="status"
          aria-label="Loading"
        ></div>
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-background">
        <h1 className="text-3xl font-bold text-foreground mb-4">Error</h1>
        <p className="text-muted-foreground mb-4 text-center">
          {error || "Could not authenticate with Telegram. Please try again."}
        </p>
        <div className="card p-4 w-full max-w-md mb-4">
          <h2 className="text-xl font-bold text-foreground mb-2">Debug Information</h2>
          <p className="text-muted-foreground text-sm">
            API URL: {process.env.NEXT_PUBLIC_API_URL || "Not set"}
          </p>
          <p className="text-muted-foreground text-sm">
            Environment: {process.env.NODE_ENV}
          </p>
          <p className="text-muted-foreground text-sm">
            Telegram WebApp: {webApp ? "Available" : "Not Available"}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 p-4">
      <h1 className="text-3xl font-bold text-white mb-6">Welcome to WhaleBux!</h1>
      <div className="w-full max-w-2xl">
        <button
          className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded mb-4"
          onClick={handleRefresh}
          disabled={refreshing}
        >
          {refreshing ? "Refreshing..." : "Refresh User Data"}
        </button>

        {/* User Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-gray-800 rounded-lg p-4 flex flex-col items-center">
            <div className="text-gray-400 text-xs mb-1">Level</div>
            <div className="text-2xl font-bold text-white">{level}</div>
            <div className="w-full bg-gray-700 rounded-full h-2 mt-2">
              <div className="bg-blue-600 h-2 rounded-full" style={{ width: `${levelProgress}%` }}></div>
            </div>
            <div className="text-xs text-gray-400 mt-1">{userStore.experience?.toLocaleString()} / {nextLevelXp === Number.POSITIVE_INFINITY ? "MAX" : nextLevelXp.toLocaleString()} XP</div>
          </div>
          <div className="bg-gray-800 rounded-lg p-4 flex flex-col items-center">
            <div className="text-gray-400 text-xs mb-1">WBUX Dollars</div>
            <div className="text-2xl font-bold text-green-400">${userStore.wbuxDollars?.toLocaleString() ?? 0}</div>
          </div>
          <div className="bg-gray-800 rounded-lg p-4 flex flex-col items-center">
            <div className="text-gray-400 text-xs mb-1">WBUX Tokens</div>
            <div className="text-2xl font-bold text-blue-400">{userStore.wbuxBalance?.toLocaleString() ?? 0}</div>
          </div>
          <div className="bg-gray-800 rounded-lg p-4 flex flex-col items-center">
            <div className="text-gray-400 text-xs mb-1">Login Streak</div>
            <div className="text-2xl font-bold text-yellow-400">{userStore.loginStreak ?? 0} days</div>
          </div>
          <div className="bg-gray-800 rounded-lg p-4 flex flex-col items-center">
            <div className="text-gray-400 text-xs mb-1">Referral Boost</div>
            <div className="text-2xl font-bold text-purple-400">+{referralBoost ?? 0}%</div>
          </div>
          <div className="bg-gray-800 rounded-lg p-4 flex flex-col items-center">
            <div className="text-gray-400 text-xs mb-1">Tasks Completed</div>
            <div className="text-2xl font-bold text-white">{userStore.completedTasks?.length ?? 0}</div>
          </div>
        </div>

        {/* User Info Card */}
        <div className="bg-gray-800 rounded-lg p-4 mb-6">
          <h2 className="text-xl font-bold text-white mb-1">{user?.firstName} {user?.lastName}</h2>
          <div className="text-gray-400 text-sm mb-1">@{user?.username || "Unknown"}</div>
          <div className="text-gray-400 text-sm">User ID: {user?.userId}</div>
        </div>

        {/* Tasks Section */}
        <div className="bg-gray-800 rounded-lg p-4">
          <h2 className="text-xl font-bold text-white mb-2">Your Tasks</h2>
          {loadingTasks ? (
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500 mx-auto" role="status" aria-label="Loading tasks"></div>
          ) : tasks.length > 0 ? (
            <ul className="space-y-2" role="list" aria-label="Task list">
              {tasks.map((task) => (
                <li key={task.id} className="bg-gray-700 rounded-lg p-3 flex justify-between items-center">
                  <div>
                    <h3 className="text-white font-medium truncate">{task.title}</h3>
                    <p className="text-gray-400 text-sm truncate">{task.description}</p>
                    <p className="text-gray-400 text-sm">Reward: {task.reward} {task.rewardType}</p>
                  </div>
                  {task.completed ? (
                    <span className="text-green-500 text-sm">Completed</span>
                  ) : (
                    <button className="bg-blue-600 hover:bg-blue-500 text-white px-3 py-1 rounded text-sm" aria-label={`Complete task ${task.title}`}>Complete</button>
                  )}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-400 text-center">No tasks available.</p>
          )}
        </div>
      </div>
    </div>
  );
};
