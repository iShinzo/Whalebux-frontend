"use client"

import { useUserStore } from "../../lib/stores/userStore"

interface TaskNavigationProps {
  activeSection: "place-task" | "catalog" | "whalebux" | "my-tasks"
  onSectionChange: (section: "place-task" | "catalog" | "whalebux" | "my-tasks") => void
}

export default function TaskNavigation({ activeSection, onSectionChange }: TaskNavigationProps) {
  const isAdmin = useUserStore((state) => state.userId === "admin" || state.telegramId === 123456789) // Replace with your admin ID

  return (
    <div className="bg-gray-800 rounded-lg mb-6 overflow-hidden">
      <div className="flex flex-wrap">
        <button
          className={`py-3 px-4 text-sm font-medium ${
            activeSection === "catalog" ? "bg-blue-600 text-white" : "text-gray-300 hover:bg-gray-700"
          }`}
          onClick={() => onSectionChange("catalog")}
        >
          Task Marketplace
        </button>
        <button
          className={`py-3 px-4 text-sm font-medium ${
            activeSection === "place-task" ? "bg-blue-600 text-white" : "text-gray-300 hover:bg-gray-700"
          }`}
          onClick={() => onSectionChange("place-task")}
        >
          Create Task
        </button>
        <button
          className={`py-3 px-4 text-sm font-medium ${
            activeSection === "my-tasks" ? "bg-blue-600 text-white" : "text-gray-300 hover:bg-gray-700"
          }`}
          onClick={() => onSectionChange("my-tasks")}
        >
          My Tasks
        </button>
        {isAdmin && (
          <button
            className={`py-3 px-4 text-sm font-medium ${
              activeSection === "whalebux" ? "bg-blue-600 text-white" : "text-gray-300 hover:bg-gray-700"
            }`}
            onClick={() => onSectionChange("whalebux")}
          >
            Admin Tasks
          </button>
        )}
      </div>
    </div>
  )
}
