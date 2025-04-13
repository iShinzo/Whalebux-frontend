"use client"

import type React from "react"

import { useState } from "react"
import { useUserStore } from "../../lib/stores/userStore"
import { useTaskStore, type TaskType, type RewardType } from "../../lib/stores/taskStore"

export default function PlaceTask() {
  const { wbuxDollars, wbuxBalance, userId, username } = useUserStore()
  const { addTask } = useTaskStore()

  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [reward, setReward] = useState(10)
  const [rewardType, setRewardType] = useState<RewardType>("DOLLARS")
  const [taskType, setTaskType] = useState<TaskType>("REFERRAL")
  const [link, setLink] = useState("")
  const [proofRequired, setProofRequired] = useState(true)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setSuccess(false)

    // Validate inputs
    if (!title.trim()) {
      setError("Title is required")
      return
    }

    if (!description.trim()) {
      setError("Description is required")
      return
    }

    if (reward <= 0) {
      setError("Reward must be greater than 0")
      return
    }

    // Check if user has enough balance
    if (rewardType === "DOLLARS" && reward > wbuxDollars) {
      setError("You don't have enough WhaleBux Dollars")
      return
    }

    if (rewardType === "TOKENS" && reward > wbuxBalance) {
      setError("You don't have enough WBUX Tokens")
      return
    }

    // Create task
    addTask({
      title,
      description,
      reward,
      rewardType,
      type: taskType,
      link: link.trim() || undefined,
      proofRequired,
    })

    // Reset form
    setTitle("")
    setDescription("")
    setReward(10)
    setLink("")
    setSuccess(true)
  }

  return (
    <div className="bg-gray-800 rounded-lg p-4">
      <h2 className="text-xl font-semibold text-white mb-4">Create a New Task</h2>

      {success && (
        <div className="mb-4 p-3 bg-green-900/50 border border-green-700 rounded text-green-400">
          Task created successfully! Users can now apply for your task.
        </div>
      )}

      {error && <div className="mb-4 p-3 bg-red-900/50 border border-red-700 rounded text-red-400">{error}</div>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-300 mb-1">
            Task Title
          </label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white"
            placeholder="e.g., Sign up for Crypto Airdrop"
          />
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-300 mb-1">
            Task Description
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white"
            placeholder="Describe what the user needs to do to complete this task..."
          ></textarea>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="reward" className="block text-sm font-medium text-gray-300 mb-1">
              Reward Amount
            </label>
            <input
              type="number"
              id="reward"
              value={reward}
              onChange={(e) => setReward(Number(e.target.value))}
              min="1"
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white"
            />
          </div>

          <div>
            <label htmlFor="rewardType" className="block text-sm font-medium text-gray-300 mb-1">
              Reward Type
            </label>
            <select
              id="rewardType"
              value={rewardType}
              onChange={(e) => setRewardType(e.target.value as RewardType)}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white"
            >
              <option value="DOLLARS">WhaleBux Dollars</option>
              <option value="TOKENS">WBUX Tokens</option>
            </select>
          </div>
        </div>

        <div>
          <label htmlFor="taskType" className="block text-sm font-medium text-gray-300 mb-1">
            Task Type
          </label>
          <select
            id="taskType"
            value={taskType}
            onChange={(e) => setTaskType(e.target.value as TaskType)}
            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white"
          >
            <option value="REFERRAL">Referral Link</option>
            <option value="AIRDROP">Crypto Airdrop</option>
            <option value="CHANNEL_JOIN">Join Channel/Group</option>
            <option value="SOCIAL">Social Media Task</option>
            <option value="REVIEW">Write Review</option>
          </select>
        </div>

        <div>
          <label htmlFor="link" className="block text-sm font-medium text-gray-300 mb-1">
            Task Link (Optional)
          </label>
          <input
            type="text"
            id="link"
            value={link}
            onChange={(e) => setLink(e.target.value)}
            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white"
            placeholder="https://example.com/referral?code=123"
          />
        </div>

        <div className="flex items-center">
          <input
            type="checkbox"
            id="proofRequired"
            checked={proofRequired}
            onChange={(e) => setProofRequired(e.target.checked)}
            className="h-4 w-4 bg-gray-700 border-gray-600 rounded"
          />
          <label htmlFor="proofRequired" className="ml-2 text-sm text-gray-300">
            Require proof of completion
          </label>
        </div>

        <div className="bg-gray-700 p-3 rounded-md">
          <div className="text-sm text-gray-300 mb-2">Your Balance:</div>
          <div className="flex justify-between">
            <div className="text-white">
              <span className="font-medium">{wbuxDollars}</span> WhaleBux Dollars
            </div>
            <div className="text-white">
              <span className="font-medium">{wbuxBalance}</span> WBUX Tokens
            </div>
          </div>
        </div>

        <button
          type="submit"
          className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md"
        >
          Create Task
        </button>
      </form>
    </div>
  )
}
