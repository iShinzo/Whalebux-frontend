"use client";

import { useEffect, useState } from "react";
import { useTelegramWebApp } from "../../lib/telegram-init";
import { userApi, taskApi } from "../../lib/api-service";
import { useUserStore } from "../../lib/stores/userStore";
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
  const setUser = useUserStore((state) => state.setUser);
  const referralBoost = useUserStore((state) => state.referralBoost);

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
        <Link
          href="/test"
          className="btn btn-primary mt-4"
          aria-label="Go to Test Mode"
        >
          Go to Test Mode
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-background">
      <h1 className="text-3xl font-bold text-foreground mb-4">Welcome to WhaleBux!</h1>
      <div className="w-full max-w-md">
        {/* User Info Card */}
        <div className="card p-4 mb-4">
          <h2 className="text-xl font-bold text-foreground">
            {user.firstName} {user.lastName}
          </h2>
          <p className="text-muted-foreground">
            Username: {user.username || "Unknown"}
          </p>
          <p className="text-muted-foreground">Level: {user.level ?? 0}</p>
          <p className="text-muted-foreground">
            WBUX Balance: {user.wbuxBalance ?? 0}
          </p>
          <p className="text-muted-foreground">
            Referral Boost: {referralBoost ?? 0}%
          </p>
        </div>

        {/* Tasks Section */}
        <div className="card p-4">
          <h2 className="text-xl font-bold text-foreground mb-2">Your Tasks</h2>
          {loadingTasks ? (
            <div
              className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary mx-auto"
              role="status"
              aria-label="Loading tasks"
            ></div>
          ) : tasks.length > 0 ? (
            <ul className="space-y-2" role="list" aria-label="Task list">
              {tasks.map((task) => (
                <li
                  key={task.id}
                  className="card p-3 flex justify-between items-center"
                >
                  <div>
                    <h3 className="text-foreground font-medium truncate">
                      {task.title}
                    </h3>
                    <p className="text-muted-foreground text-sm truncate">
                      {task.description}
                    </p>
                    <p className="text-muted-foreground text-sm">
                      Reward: {task.reward} {task.rewardType}
                    </p>
                  </div>
                  {task.completed ? (
                    <span className="text-green-500 text-sm">Completed</span>
                  ) : (
                    <button
                      className="btn btn-primary text-sm"
                      aria-label={`Complete task ${task.title}`}
                    >
                      Complete
                    </button>
                  )}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-muted-foreground text-center">
              No tasks available.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
