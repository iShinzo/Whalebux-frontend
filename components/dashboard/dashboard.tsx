"use client"

import { useEffect, useState } from "react"
import { useTelegramWebApp } from "../../lib/telegram-init"
import { userApi, taskApi } from "../../lib/api-service"
import { useUserStore } from "../../lib/stores/userStore"
import Link from "next/link"

export const Dashboard = () => {
  const { webApp, user, loading, error } = useTelegramWebApp()
  const [tasks, setTasks] = useState([])
  const [loadingTasks, setLoadingTasks] = useState(true)
  const setUser = useUserStore((state) => state.setUser)
  const referralBoost = useUserStore((state) => state.referralBoost)

  useEffect(() => {
    // If we have a user, fetch their tasks
    if (user && user.telegramId) {
      // Update the user store with the user data from the API
      setUser({
        userId: user.userId,
        telegramId: user.telegramId,
        username: user.username,
        firstName: user.firstName,
        lastName: user.lastName,
        level: user.level,
        experience: user.experience,
        wbuxDollars: user.wbuxDollars,
        wbuxBalance: user.wbuxBalance,
        loginStreak: user.loginStreak,
        referralCode: user.referralCode,
        referralCount: user.referralCount,
        lastLogin: user.lastLogin,
        miningRateLevel: user.miningRateLevel,
        miningBoostLevel: user.miningBoostLevel,
        miningTimeLevel: user.miningTimeLevel,
        nftSlotLevel: user.nftSlotLevel,
        completedTasks: user.completedTasks || [],
      })

      taskApi
        .getTasksForUser(user.telegramId)
        .then((tasks) => {
          setTasks(tasks)
          setLoadingTasks(false)
        })
        .catch((error) => {
          console.error("Error fetching tasks:", error)
          setLoadingTasks(false)
        })
    }
  }, [user, setUser])

  // If still loading, show loading spinner
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  // If error or no user found, show error
  if (error || !user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <h1 className="text-3xl font-bold text-white mb-4">Error</h1>
        <p className="text-white mb-4">{error || "Could not authenticate with Telegram. Please try again."}</p>
        <div className="bg-gray-800 rounded-lg p-4 w-full max-w-md mb-4">
          <h2 className="text-xl font-bold text-white mb-2">Debug Information</h2>
          <p className="text-gray-400 text-sm">API URL: {process.env.NEXT_PUBLIC_API_URL || "Not set"}</p>
          <p className="text-gray-400 text-sm">Environment: {process.env.NODE_ENV}</p>
          <p className="text-gray-400 text-sm">Telegram WebApp: {webApp ? "Available" : "Not Available"}</p>
        </div>
        <a href="/test" className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
          Go to Test Mode
        </a>
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <h1 className="text-3xl font-bold text-white mb-4">Welcome to WhaleBux!</h1>

      {/* User Info */}
      <div className="bg-gray-800 rounded-lg p-4 w-full max-w-md mb-4">
        <h2 className="text-xl font-bold text-white mb-2">Your Profile</h2>
        <p className="text-white">Level: {user.level}</p>
        <p className="text-white">WhaleBux Dollars: {user.wbuxDollars}</p>
        <p className="text-white">WBUX Tokens: {user.wbuxBalance}</p>
        <p className="text-white">Referral Code: {user.referralCode}</p>

        {/* Mining Section */}
        <div className="mt-4 pt-4 border-t border-gray-700">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-white">Mining Center</p>
              <p className="text-gray-400 text-sm">Earn WhaleBux Dollars by mining!</p>
            </div>
            <Link href="/mining" className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700">
              Start Mining
            </Link>
          </div>
        </div>

        {/* Daily Streak Section */}
        <div className="mt-4 pt-4 border-t border-gray-700">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-white">Login Streak: {user.loginStreak} days</p>
              <p className="text-gray-400 text-sm">Keep logging in daily for rewards!</p>
            </div>
            <Link href="/daily-streak" className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700">
              View Streak
            </Link>
          </div>
        </div>

        {/* Referrals Section */}
        <div className="mt-4 pt-4 border-t border-gray-700">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-white">Referral Boost: +{referralBoost}%</p>
              <p className="text-gray-400 text-sm">Invite friends to earn more!</p>
            </div>
            <Link href="/friends" className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700">
              Invite Friends
            </Link>
          </div>
        </div>

        {/* Task Marketplace Section */}
        <div className="mt-4 pt-4 border-t border-gray-700">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-white">Task Marketplace</p>
              <p className="text-gray-400 text-sm">Complete tasks to earn rewards!</p>
            </div>
            <Link href="/tasks" className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700">
              View Tasks
            </Link>
          </div>
        </div>

        {/* NFT Marketplace Section */}
        <div className="mt-4 pt-4 border-t border-gray-700">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-white">NFT Marketplace</p>
              <p className="text-gray-400 text-sm">Buy, sell, and activate NFT boosts!</p>
            </div>
            <Link href="/nft" className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700">
              View NFTs
            </Link>
          </div>
        </div>

        {/* Token Swap Section */}
        <div className="mt-4 pt-4 border-t border-gray-700">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-white">Token Swap</p>
              <p className="text-gray-400 text-sm">Convert Dollars to WBUX Tokens!</p>
            </div>
            <Link href="/swap" className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700">
              Swap Tokens
            </Link>
          </div>
        </div>
      </div>

      {/* Tasks */}
      <div className="bg-gray-800 rounded-lg p-4 w-full max-w-md">
        <h2 className="text-xl font-bold text-white mb-2">Tasks</h2>

        {loadingTasks ? (
          <div className="flex justify-center p-4">
            <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : tasks.length > 0 ? (
          <ul className="space-y-2">
            {tasks.map((task: any) => (
              <li key={task.id} className="bg-gray-700 rounded p-3">
                <h3 className="font-bold text-white">{task.title}</h3>
                <p className="text-gray-300 text-sm">{task.description}</p>
                <div className="flex justify-between items-center mt-2">
                  <span className="text-green-400">
                    {task.reward} {task.rewardType === "DOLLARS" ? "Dollars" : "Tokens"}
                  </span>
                  <button
                    className={`px-3 py-1 rounded ${
                      task.completed
                        ? "bg-gray-600 text-gray-400 cursor-not-allowed"
                        : "bg-blue-600 text-white hover:bg-blue-700"
                    }`}
                    disabled={task.completed}
                    onClick={() => {
                      if (!task.completed && user.telegramId) {
                        taskApi
                          .completeTask(task.id, user.telegramId)
                          .then((result) => {
                            if (result.success) {
                              // Update tasks
                              setTasks(tasks.map((t: any) => (t.id === task.id ? { ...t, completed: true } : t)))

                              // Update user data
                              userApi.getUserData(user.telegramId).then((updatedUser) => {
                                // Update the user store with the updated user data
                                setUser({
                                  wbuxDollars: updatedUser.wbuxDollars,
                                  wbuxBalance: updatedUser.wbuxBalance,
                                  completedTasks: updatedUser.completedTasks || [],
                                })
                              })
                            }
                          })
                          .catch((error) => {
                            console.error("Error completing task:", error)
                          })
                      }
                    }}
                  >
                    {task.completed ? "Completed" : "Complete"}
                  </button>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-white text-center">No tasks available</p>
        )}
      </div>
    </div>
  )
}
