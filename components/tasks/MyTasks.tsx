"use client"

import { useState, useEffect } from "react"
import { useUserStore } from "../../lib/stores/userStore"
import { useTaskStore, type Task } from "../../lib/stores/taskStore"
import { formatDistanceToNow } from "date-fns"

// Reusable component for displaying message alerts
const MessageAlert = ({ type, text }: { type: string; text: string }) => {
  if (!text) return null
  return (
    <div
      className={`mb-4 p-3 rounded ${
        type === "success"
          ? "bg-green-900/50 border border-green-700 text-green-400"
          : "bg-red-900/50 border border-red-700 text-red-400"
      }`}
    >
      {text}
    </div>
  )
}

// Reusable component for proof submission
const ProofSubmission = ({
  taskId,
  proofText,
  setProofText,
  handleSubmit,
}: {
  taskId: string
  proofText: string
  setProofText: (value: string) => void
  handleSubmit: () => void
}) => (
  <div className="mt-3">
    <label className="block text-sm font-medium text-gray-300 mb-1">Submit Proof of Completion</label>
    <textarea
      value={proofText}
      onChange={(e) => setProofText(e.target.value)}
      rows={3}
      className="w-full px-3 py-2 bg-gray-600 border border-gray-500 rounded-md text-white text-sm"
      placeholder="Describe how you completed the task or provide proof..."
    ></textarea>
    <button
      onClick={handleSubmit}
      disabled={!proofText}
      className="mt-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded disabled:opacity-50"
    >
      Submit Proof
    </button>
  </div>
)

// Reusable component for task cards
const TaskCard = ({
  task,
  children,
}: {
  task: Task
  children?: React.ReactNode
}) => (
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
    {children}
  </div>
)

export default function MyTasks() {
  const { userId, username } = useUserStore()
  const { getMyCreatedTasks, getMyAssignedTasks, submitProof, approveTask, denyTask, deleteTask } = useTaskStore()

  const [createdTasks, setCreatedTasks] = useState<Task[]>([])
  const [assignedTasks, setAssignedTasks] = useState<Task[]>([])
  const [activeTab, setActiveTab] = useState<"created" | "assigned">("assigned")
  const [proofText, setProofText] = useState<{ [key: string]: string }>({})
  const [message, setMessage] = useState<{ type: string; text: string }>({ type: "", text: "" })

  useEffect(() => {
    if (userId) {
      setCreatedTasks(getMyCreatedTasks(userId))
      setAssignedTasks(getMyAssignedTasks(userId))
    }
  }, [userId, getMyCreatedTasks, getMyAssignedTasks])

  const handleSetMessage = (type: string, text: string) => {
    setMessage({ type, text })
    setTimeout(() => setMessage({ type: "", text: "" }), 3000)
  }

  const handleSubmitProof = (taskId: string) => {
    if (proofText[taskId]) {
      submitProof(taskId, proofText[taskId])
      handleSetMessage("success", "Proof submitted successfully!")
      setProofText((prev) => ({ ...prev, [taskId]: "" }))
      setAssignedTasks(getMyAssignedTasks(userId || ""))
    }
  }

  const handleApproveTask = (taskId: string) => {
    approveTask(taskId)
    handleSetMessage("success", "Task approved and reward sent!")
    setCreatedTasks(getMyCreatedTasks(userId || ""))
  }

  const handleDenyTask = (taskId: string) => {
    denyTask(taskId)
    handleSetMessage("success", "Task denied and returned to marketplace.")
    setCreatedTasks(getMyCreatedTasks(userId || ""))
  }

  const handleDeleteTask = (taskId: string) => {
    deleteTask(taskId)
    handleSetMessage("success", "Task deleted and funds returned.")
    setCreatedTasks(getMyCreatedTasks(userId || ""))
  }

  const renderAssignedTasks = () =>
    assignedTasks.length > 0 ? (
      assignedTasks.map((task) => (
        <TaskCard key={task.id} task={task}>
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
          {task.status === "IN_PROGRESS" && task.proofRequired && (
            <ProofSubmission
              taskId={task.id}
              proofText={proofText[task.id] || ""}
              setProofText={(value) => setProofText({ ...proofText, [task.id]: value })}
              handleSubmit={() => handleSubmitProof(task.id)}
            />
          )}
          {task.status === "COMPLETED" && (
            <div className="mt-3 p-3 bg-green-900/20 border border-green-800/30 rounded-md">
              <div className="text-green-400 text-sm font-medium mb-1">Task Completed!</div>
              <div className="text-gray-300 text-xs">
                Reward of {task.reward} {task.rewardType === "DOLLARS" ? "Dollars" : "Tokens"} has been added to your
                balance.
              </div>
            </div>
          )}
        </TaskCard>
      ))
    ) : (
      <div className="bg-gray-700 rounded-lg p-6 text-center">
        <p className="text-gray-400">You haven't accepted any tasks yet.</p>
        <p className="text-gray-500 text-sm mt-1">Browse the marketplace to find tasks to work on!</p>
      </div>
    )

  const renderCreatedTasks = () =>
    createdTasks.length > 0 ? (
      createdTasks.map((task) => (
        <TaskCard key={task.id} task={task}>
          <div className="flex justify-between items-center text-xs text-gray-400 mb-4">
            <div>Created: {formatDistanceToNow(new Date(task.createdAt))} ago</div>
            <div
              className={`px-2 py-1 rounded-full ${
                task.status === "PENDING"
                  ? "bg-gray-600 text-gray-300"
                  : task.status === "IN_PROGRESS"
                  ? "bg-yellow-900/50 text-yellow-400"
                  : task.status === "COMPLETED"
                  ? "bg-green-900/50 text-green-400"
                  : "bg-red-900/50 text-red-400"
              }`}
            >
              {task.status === "PENDING"
                ? "Pending"
                : task.status === "IN_PROGRESS"
                ? "In Progress"
                : task.status === "COMPLETED"
                ? "Completed"
                : "Denied"}
            </div>
          </div>

          {task.status === "PENDING" && (
            <div className="flex justify-end">
              <button
                onClick={() => handleDeleteTask(task.id)}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded"
              >
                Delete Task
              </button>
            </div>
          )}
          {task.status === "IN_PROGRESS" && task.proofSubmitted && (
            <div className="mb-3">
              <div className="text-sm font-medium text-gray-300 mb-1">Proof of Completion:</div>
              <div className="p-3 bg-gray-600 border border-gray-500 rounded-md text-white text-sm">
                {task.proofSubmitted}
              </div>
            </div>
          )}
        </TaskCard>
      ))
    ) : (
      <div className="bg-gray-700 rounded-lg p-6 text-center">
        <p className="text-gray-400">You haven't created any tasks yet.</p>
        <p className="text-gray-500 text-sm mt-1">Create a task to hire other users for referrals!</p>
      </div>
    )

  return (
    <div className="bg-gray-800 rounded-lg p-4">
      <h2 className="text-xl font-semibold text-white mb-4">My Tasks</h2>

      <MessageAlert type={message.type} text={message.text} />

      <div className="flex mb-4 bg-gray-700 rounded-lg p-1">
        <button
          className={`flex-1 py-2 rounded-md text-sm ${
            activeTab === "assigned" ? "bg-gray-600 text-white" : "text-gray-400"
          }`}
          onClick={() => setActiveTab("assigned")}
        >
          Tasks I'm Working On
        </button>
        <button
          className={`flex-1 py-2 rounded-md text-sm ${
            activeTab === "created" ? "bg-gray-600 text-white" : "text-gray-400"
          }`}
          onClick={() => setActiveTab("created")}
        >
          Tasks I've Created
        </button>
      </div>

      {activeTab === "assigned" ? renderAssignedTasks() : renderCreatedTasks()}
    </div>
  )
}
