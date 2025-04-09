"use client"

import { useState, useEffect } from "react"
import { useUserStore } from "../../lib/stores/userStore"
import { useTaskStore, type Task, type TaskType } from "../../lib/stores/taskStore"
import { formatDistanceToNow } from "date-fns"

export default function TaskCatalog() {
  const { userId, username } = useUserStore()
  const { getAvailableTasks, applyForTask } = useTaskStore()
  const [availableTasks, setAvailableTasks] = useState<Task[]>([])
  const [filter, setFilter] = useState<TaskType | "ALL">("ALL")
  const [sortBy, setSortBy] = useState<"newest" | "reward">("newest")
  const [success, setSuccess] = useState("")

  useEffect(() => {
    if (userId) {
      setAvailableTasks(getAvailableTasks(userId))
    }
  }, [userId, getAvailableTasks])

  const handleApply = (taskId: string) => {
    if (userId && username) {
      applyForTask(taskId, userId, username)
      setAvailableTasks(getAvailableTasks(userId))
      setSuccess("You've successfully applied for the task!")
      setTimeout(() => setSuccess(""), 3000)
    }
  }

  const filteredTasks = availableTasks.filter((task) => {
    if (filter === "ALL") return true
    return task.type === filter
  })

  const sortedTasks = [...filteredTasks].sort((a, b) => {
    if (sortBy === "newest") {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    } else {
      return b.reward - a.reward
    }
  })

  return (
    <div className="bg-gray-800 rounded-lg p-4">
      <h2 className="text-xl font-semibold text-white mb-4">Task Marketplace</h2>

      {success && (
        <div className="mb-4 p-3 bg-green-900/50 border border-green-700 rounded text-green-400">{success}</div>
      )}

      <div className="flex flex-wrap gap-2 mb-4">
        <button
          className={`px-3 py-1 text-sm rounded-full ${
            filter === "ALL" ? "bg-blue-600 text-white" : "bg-gray-700 text-gray-300 hover:bg-gray-600"
          }`}
          onClick={() => setFilter("ALL")}
        >
          All Tasks
        </button>
        <button
          className={`px-3 py-1 text-sm rounded-full ${
            filter === "REFERRAL" ? "bg-blue-600 text-white" : "bg-gray-700 text-gray-300 hover:bg-gray-600"
          }`}
          onClick={() => setFilter("REFERRAL")}
        >
          Referrals
        </button>
        <button
          className={`px-3 py-1 text-sm rounded-full ${
            filter === "AIRDROP" ? "bg-blue-600 text-white" : "bg-gray-700 text-gray-300 hover:bg-gray-600"
          }`}
          onClick={() => setFilter("AIRDROP")}
        >
          Airdrops
        </button>
        <button
          className={`px-3 py-1 text-sm rounded-full ${
            filter === "CHANNEL_JOIN" ? "bg-blue-600 text-white" : "bg-gray-700 text-gray-300 hover:bg-gray-600"
          }`}
          onClick={() => setFilter("CHANNEL_JOIN")}
        >
          Channels
        </button>
        <button
          className={`px-3 py-1 text-sm rounded-full ${
            filter === "SOCIAL" ? "bg-blue-600 text-white" : "bg-gray-700 text-gray-300 hover:bg-gray-600"
          }`}
          onClick={() => setFilter("SOCIAL")}
        >
          Social
        </button>
      </div>

      <div className="flex justify-between items-center mb-4">
        <div className="text-sm text-gray-400">{sortedTasks.length} tasks available</div>
        <div className="flex items-center">
          <span className="text-sm text-gray-400 mr-2">Sort by:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as "newest" | "reward")}
            className="bg-gray-700 text-white text-sm rounded px-2 py-1 border border-gray-600"
          >
            <option value="newest">Newest</option>
            <option value="reward">Highest Reward</option>
          </select>
        </div>
      </div>

      {sortedTasks.length > 0 ? (
        <div className="space-y-4">
          {sortedTasks.map((task) => (
            <div key={task.id} className="bg-gray-700 rounded-lg p-4">
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-lg font-medium text-white">{task.title}</h3>
                <div
                  className={`px-2 py-1 text-xs rounded-full ${
                    task.rewardType === "DOLLARS" ? "bg-green-900/50 text-green-400" : "bg-blue-900/50 text-blue-400"
                  }`}
                >
                  {task.reward} {task.rewardType === "DOLLARS" ? "Dollars" : "Tokens"}
                </div>
              </div>

              <p className="text-gray-300 text-sm mb-3">{task.description}</p>

              {task.link && (
                <div className="mb-3">
                  <a
                    href={task.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-400 text-sm hover:underline break-all"
                  >
                    {task.link}
                  </a>
                </div>
              )}

              <div className="flex justify-between items-center text-xs text-gray-400 mb-4">
                <div>Posted by: {task.creatorName}</div>
                <div>{formatDistanceToNow(new Date(task.createdAt))} ago</div>
              </div>

              <div className="flex justify-between items-center">
                <div className={`px-2 py-1 text-xs rounded-full ${getTaskTypeColor(task.type)}`}>
                  {getTaskTypeLabel(task.type)}
                </div>
                <button
                  onClick={() => handleApply(task.id)}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded"
                >
                  Accept Task
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-gray-700 rounded-lg p-6 text-center">
          <p className="text-gray-400">No tasks available at the moment.</p>
          <p className="text-gray-500 text-sm mt-1">Check back later or create your own task!</p>
        </div>
      )}
    </div>
  )
}

function getTaskTypeColor(type: TaskType): string {
  switch (type) {
    case "REFERRAL":
      return "bg-purple-900/50 text-purple-400"
    case "AIRDROP":
      return "bg-yellow-900/50 text-yellow-400"
    case "CHANNEL_JOIN":
      return "bg-blue-900/50 text-blue-400"
    case "SOCIAL":
      return "bg-pink-900/50 text-pink-400"
    case "REVIEW":
      return "bg-orange-900/50 text-orange-400"
    default:
      return "bg-gray-900/50 text-gray-400"
  }
}

function getTaskTypeLabel(type: TaskType): string {
  switch (type) {
    case "REFERRAL":
      return "Referral"
    case "AIRDROP":
      return "Airdrop"
    case "CHANNEL_JOIN":
      return "Channel Join"
    case "SOCIAL":
      return "Social Media"
    case "REVIEW":
      return "Review"
    default:
      return type
  }
}
