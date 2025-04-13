"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useUserStore } from "../../lib/stores/userStore"
import TaskNavigation from "../../components/tasks/TaskNavigation"
import PlaceTask from "../../components/tasks/PlaceTask"
import TaskCatalog from "../../components/tasks/TaskCatalog"
import WhaleBuxTasks from "../../components/tasks/WhaleBuxTasks"
import MyTasks from "../../components/tasks/MyTasks"
import UserStats from "../../components/mining/UserStats"

export default function Tasks() {
  const router = useRouter()
  const [activeSection, setActiveSection] = useState<"place-task" | "catalog" | "whalebux" | "my-tasks">("catalog")
  const { wbuxBalance, wbuxDollars, username } = useUserStore()

  const renderContent = () => {
    switch (activeSection) {
      case "place-task":
        return <PlaceTask />
      case "catalog":
        return <TaskCatalog />
      case "whalebux":
        return <WhaleBuxTasks />
      case "my-tasks":
        return <MyTasks />
      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-gray-900 pb-20">
      <UserStats wbuxBalance={wbuxBalance} wbuxDollars={wbuxDollars} username={username} />

      <div className="max-w-md mx-auto p-4">
        <div className="flex items-center mb-6">
          <button onClick={() => router.push("/")} className="text-gray-400 hover:text-white mr-4">
            ← Back
          </button>
          <h1 className="text-2xl font-bold text-white">Task Marketplace</h1>
        </div>

        <TaskNavigation activeSection={activeSection} onSectionChange={setActiveSection} />
        {renderContent()}
      </div>
    </div>
  )
}
