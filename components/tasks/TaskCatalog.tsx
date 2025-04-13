"use client"

import { useState, useEffect, useMemo } from "react"
import { useUserStore } from "../../lib/stores/userStore"
import { useTaskStore, type Task, type TaskType } from "../../lib/stores/taskStore"
import { formatDistanceToNow } from "date-fns"

export default function TaskCatalog() {
  const { userId, username } = useUserStore()
  const { getAvailableTasks, applyForTask } = useTaskStore()

  const [availableTasks, setAvailableTasks] = useState<Task[]>([])
  const [filter, setFilter] = useState<TaskType | "ALL">("ALL")
  const [sortBy, setSortBy] = useState<"newest" | "reward">("newest")
  const [successMessage, setSuccessMessage] = useState("")

  // Fetch available tasks whenever the userId changes
  useEffect(() => {
    if (userId) {
      setAvailableTasks(getAvailableTasks(userId))
    }
  }, [userId, getAvailableTasks])

  // Handle applying to a task
  const handleApply = (taskId: string) => {
    if (!userId || !username) return

    applyForTask(taskId, userId, username)
    setAvailableTasks(getAvailableTasks(userId))
    setSuccessMessage("You've successfully applied for the task!")
    setTimeout(() => setSuccessMessage(""), 3000)
  }

  // Memoized filtered tasks to avoid unnecessary calculations
  const filteredTasks = useMemo(() => {
    return filter === "ALL"
      ? availableTasks
      : availableTasks.filter((task) => task.type === filter)
  }, [availableTasks, filter])

  // Memoized sorted tasks to avoid unnecessary calculations
  const sortedTasks = useMemo(() => {
    return [...filteredTasks].sort((a, b) => {
      if (sortBy === "newest") {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      }
      return b.reward - a.reward
    })
  }, [filteredTasks, sortBy])

  return (
    <div className="bg-gray-800 rounded-lg p-4">
      <h2 className="text-xl font-semibold text-white mb-4">Task Marketplace</h2>

      {successMessage && (
        <div className="mb-4 p-3 bg-green-900/50 border border-green-700 rounded text-green-400">
          {successMessage}
        </div>
      )}

      {/* Filter Buttons */}
      <div className="flex flex-wrap gap-2 mb-4">
        {["ALL", "REFERRAL", "AIRDROP", "CHANNEL_JOIN", "SOCIAL"].map((type) => (
          <button
            key={type}
            className={`px-3 py-1 text-sm rounded-full ${
              filter === type ? "bg-blue-600 text-white" : "bg-gray-700 text-gray-300 hover:bg-gray-600"
            }`}
            onClick={() => setFilter(type as TaskType | "ALL")}
          >
            {type === "ALL" ? "All Tasks" : getTaskTypeLabel(type as TaskType)}
          </button>
        ))}
      </div>

      {/* Sort Dropdown */}
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

      {/* Task List */}
      {sortedTasks.length > 0 ? (
        <div className="space-y-4">
          {sortedTasks.map((task) => (
            <div key={task.id} className="bg-gray-700 rounded-lg p-4">
              {/* Task Header */}
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

              {/* Task Description */}
              <p className="text-gray-300 text-sm mb-3">{task.description}</p>

              {/* Task Link */}
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

              {/* Task Footer */}
              <div className="flex justify-between items-center text-xs text-gray-400 mb-4">
                <div>Posted by: {task.creatorName}</div>
                <div>{formatDistanceToNow(new Date(task.createdAt))} ago</div>
              </div>

              {/* Task Actions */}
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
