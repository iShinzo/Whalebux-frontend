"use client"

interface UserStatsProps {
  wbuxBalance: number
  wbuxDollars: number
  username: string | null
}

export default function UserStats({ wbuxBalance, wbuxDollars, username }: UserStatsProps) {
  return (
    <div className="bg-gray-800 p-4 shadow-lg">
      <div className="max-w-md mx-auto">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-lg font-semibold text-white">{username || "User"}</h2>
            <div className="flex space-x-4 mt-1">
              <div className="text-green-400 text-sm">{wbuxDollars} Dollars</div>
              <div className="text-blue-400 text-sm">{wbuxBalance} WBUX</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
