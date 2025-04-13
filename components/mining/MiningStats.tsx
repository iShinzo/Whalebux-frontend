"use client"

import { useUserStore } from "../../lib/stores/userStore"
import { useMiningStore } from "../../lib/stores/miningStore"
import { getLevelFromExperience, getLevelProgress, getExperienceForNextLevel } from "../../lib/config/miningConfig"

export default function MiningStats() {
  const { experience, wbuxDollars, wbuxBalance } = useUserStore()
  const { getMiningStats } = useMiningStore()

  const level = getLevelFromExperience(experience);
  const nextLevelXp = getExperienceForNextLevel(level);
  const levelProgress = getLevelProgress(experience, level);
  const { estimatedEarnings, miningDuration, timeReduction } = getMiningStats(level);

  return (
    <div className="w-full max-w-md bg-gray-800 rounded-lg p-4 mb-6">
      <div className="flex justify-between items-center mb-4">
        <div>
          <div className="text-gray-400 text-sm">Level</div>
          <div className="text-white text-2xl font-bold">{level}</div>
        </div>
        <div>
          <div className="text-gray-400 text-sm">Experience</div>
          <div className="text-white text-2xl font-bold">{experience.toLocaleString()}</div>
        </div>
      </div>

      {/* Level progress bar */}
      <div className="mb-4">
        <div className="flex justify-between text-sm text-gray-400 mb-1">
          <div>Progress to Level {level + 1}</div>
          <div>{levelProgress}%</div>
        </div>
        <div className="w-full bg-gray-700 rounded-full h-2">
          <div className="bg-blue-600 h-2 rounded-full" style={{ width: `${levelProgress}%` }}></div>
        </div>
        <div className="text-xs text-gray-400 mt-1">
          {experience.toLocaleString()} /{" "}
          {nextLevelXp === Number.POSITIVE_INFINITY ? "MAX" : nextLevelXp.toLocaleString()} XP
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="bg-gray-700 p-3 rounded-lg">
          <div className="text-gray-400 text-xs">Mining Duration</div>
          <div className="text-white font-medium">{miningDuration.toFixed(1)} hours</div>
          {timeReduction > 0 && <div className="text-green-400 text-xs">-{timeReduction.toFixed(0)} min</div>}
        </div>

        <div className="bg-gray-700 p-3 rounded-lg">
          <div className="text-gray-400 text-xs">Est. Earnings</div>
          <div className="text-white font-medium">${estimatedEarnings.toFixed(2)}</div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-gray-700 p-3 rounded-lg">
          <div className="text-gray-400 text-xs">WhaleBux Dollars</div>
          <div className="text-white font-medium">${wbuxDollars.toLocaleString()}</div>
        </div>

        <div className="bg-gray-700 p-3 rounded-lg">
          <div className="text-gray-400 text-xs">WBUX Tokens</div>
          <div className="text-white font-medium">{wbuxBalance.toLocaleString()}</div>
        </div>
      </div>
    </div>
  )
}
