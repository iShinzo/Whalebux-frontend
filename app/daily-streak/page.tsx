"use client";

import { useRouter } from "next/navigation";
import { useUserStore } from "../../lib/stores/userStore";
import { calculateLoginStreakBoost } from "../../lib/config/miningConfig";
import { useEffect, useMemo } from "react";

export default function DailyStreak() {
  const router = useRouter();
  const { loginStreak } = useUserStore();

  const days = useMemo(() => Array.from({ length: 28 }, (_, i) => i + 1), []);

  const currentBoost = useMemo(() => calculateLoginStreakBoost(loginStreak), [loginStreak]);

  const isBoostDay = (day: number) => day % 7 === 0;

  useEffect(() => {
    // Placeholder for backend sync
  }, []);

  return (
    <div className="min-h-screen bg-gray-900 p-4">
      <div className="max-w-md mx-auto">
        <div className="flex items-center mb-6">
          <button
            onClick={() => router.push("/")}
            className="text-gray-400 hover:text-white mr-4"
            aria-label="Go back to home"
          >
            &larr; Back
          </button>
          <h1 className="text-2xl font-bold text-white">Daily Login Streak</h1>
        </div>

        <div className="bg-gray-800 rounded-lg p-6 mb-6">
          <div className="text-center mb-6">
            <div className="text-4xl font-bold text-green-500 mb-2">{loginStreak}</div>
            <div className="text-gray-400">Current Streak Days</div>
            {currentBoost > 0 && <div className="mt-2 text-green-500">Active Boost: +{currentBoost}%</div>}
          </div>

          <div className="grid grid-cols-7 gap-3 mb-6" role="grid" aria-label="Daily Streak Calendar">
            {days.map((day) => (
              <div
                key={day}
                className={`w-12 h-12 rounded-full flex items-center justify-center text-lg ${
                  day <= loginStreak ? "bg-green-600 text-white" : "bg-gray-700 text-gray-400"
                }`}
              >
                {day}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
