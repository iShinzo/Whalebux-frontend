"use client"

import type React from "react"
import { useState } from "react"
import { useUserStore } from "../../lib/stores/userStore"
import { useTaskStore, type TaskType, type RewardType } from "../../lib/stores/taskStore"

// Reusable input component
const FormInput = ({
  label,
  id,
  type = "text",
  value,
  onChange,
  placeholder = "",
  min,
}: {
  label: string
  id: string
  type?: string
  value: string | number
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  placeholder?: string
  min?: number
}) => (
  <div>
    <label htmlFor={id} className="block text-sm font-medium text-gray-300 mb-1">
      {label}
    </label>
    <input
      type={type}
      id={id}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      min={min}
      className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white"
    />
  </div>
)

// Reusable textarea component
const FormTextarea = ({
  label,
  id,
  value,
  onChange,
  placeholder = "",
  rows = 3,
}: {
  label: string
  id: string
  value: string
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void
  placeholder?: string
  rows?: number
}) => (
  <div>
    <label htmlFor={id} className="block text-sm font-medium text-gray-300 mb-1">
      {label}
    </label>
    <textarea
      id={id}
      value={value}
      onChange={onChange}
      rows={rows}
      placeholder={placeholder}
      className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white"
    ></textarea>
  </div>
)

// Reusable select component
const FormSelect = <T extends string>({
  label,
  id,
  value,
  onChange,
  options,
}: {
  label: string
  id: string
  value: T
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void
  options: { label: string; value: T }[]
}) => (
  <div>
    <label htmlFor={id} className="block text-sm font-medium text-gray-300 mb-1">
      {label}
    </label>
    <select
      id={id}
      value={value}
      onChange={onChange}
      className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white"
    >
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  </div>
)

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

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError("")
    setSuccess(false)

    // Input validations
    if (!title.trim()) {
      setError("Title is required.")
      return
    }

    if (!description.trim()) {
      setError("Description is required.")
      return
    }

    if (reward <= 0) {
      setError("Reward must be greater than 0.")
      return
    }

    // Check user balance
    if (rewardType === "DOLLARS" && reward > wbuxDollars) {
      setError("You don't have enough WhaleBux Dollars.")
      return
    }

    if (rewardType === "TOKENS" && reward > wbuxBalance) {
      setError("You don't have enough WBUX Tokens.")
      return
    }

    // Create task
    addTask({
      title: title.trim(),
      description: description.trim(),
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
    setRewardType("DOLLARS")
    setTaskType("REFERRAL")
    setLink("")
    setProofRequired(true)
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
        <FormInput
          label="Task Title"
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="e.g., Sign up for Crypto Airdrop"
        />

        <FormTextarea
          label="Task Description"
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Describe what the user needs to do to complete this task..."
        />

        <div className="grid grid-cols-2 gap-4">
          <FormInput
            label="Reward Amount"
            id="reward"
            type="number"
            value={reward}
            onChange={(e) => setReward(Number(e.target.value))}
            min={1}
          />

          <FormSelect
            label="Reward Type"
            id="rewardType"
            value={rewardType}
            onChange={(e) => setRewardType(e.target.value as RewardType)}
            options={[
              { label: "WhaleBux Dollars", value: "DOLLARS" },
              { label: "WBUX Tokens", value: "TOKENS" },
            ]}
          />
        </div>

        <FormSelect
          label="Task Type"
          id="taskType"
          value={taskType}
          onChange={(e) => setTaskType(e.target.value as TaskType)}
          options={[
            { label: "Referral Link", value: "REFERRAL" },
            { label: "Crypto Airdrop", value: "AIRDROP" },
            { label: "Join Channel/Group", value: "CHANNEL_JOIN" },
            { label: "Social Media Task", value: "SOCIAL" },
            { label: "Write Review", value: "REVIEW" },
          ]}
        />

        <FormInput
          label="Task Link (Optional)"
          id="link"
          value={link}
          onChange={(e) => setLink(e.target.value)}
          placeholder="https://example.com/referral?code=123"
        />

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
