// Mining configuration interfaces
export interface LevelConfig {
  xpMin: number
  xpMax: number
  miningDuration: number // in hours
  baseRate: number // base mining rate per hour
  miningEarnings: number // total earnings for full mining duration
  boost: number // base boost percentage
}

export interface MiningRateUpgrade {
  level: number
  bonus: number // Additional WBUX per hour
  cost: number // Cost in WBUX $Dollars
  tokenCost: number // Cost in WBUX tokens
}

export interface MiningBoostUpgrade {
  level: number
  bonus: number // Additional percentage boost
  cost: number // Cost in WBUX $Dollars
  tokenCost: number // Cost in WBUX tokens
}

export interface MiningTimeUpgrade {
  level: number
  bonus: number // Minutes reduced from mining time
  cost: number // Cost in WBUX $Dollars
  tokenCost: number // Cost in WBUX tokens
}

export interface NFTSlotUpgrade {
  level: number
  slots: number // Number of NFT slots unlocked
  cost: number // Cost in WBUX $Dollars
  tokenCost: number // Cost in WBUX tokens
  available: boolean
}

// Base level configurations
export const LEVEL_CONFIG: Record<number, LevelConfig> = {
  1: { xpMin: 0, xpMax: 10, miningDuration: 2, baseRate: 1.0, miningEarnings: 2.0, boost: 0 },
  2: { xpMin: 11, xpMax: 100, miningDuration: 3, baseRate: 2.1, miningEarnings: 6.3, boost: 7 },
  3: { xpMin: 101, xpMax: 1000, miningDuration: 4, baseRate: 3.21, miningEarnings: 12.84, boost: 15 },
  4: { xpMin: 1001, xpMax: 10000, miningDuration: 5, baseRate: 4.4, miningEarnings: 22.0, boost: 23 },
  5: { xpMin: 10001, xpMax: 100000, miningDuration: 6, baseRate: 5.6, miningEarnings: 33.6, boost: 38 },
  6: { xpMin: 100001, xpMax: 500000, miningDuration: 7, baseRate: 6.9, miningEarnings: 48.3, boost: 50 },
  7: { xpMin: 500001, xpMax: 1000000, miningDuration: 8, baseRate: 8.26, miningEarnings: 66.08, boost: 76 },
  8: { xpMin: 1000001, xpMax: 5000000, miningDuration: 9, baseRate: 9.6, miningEarnings: 86.4, boost: 90 },
  9: {
    xpMin: 5000001,
    xpMax: Number.POSITIVE_INFINITY,
    miningDuration: 10,
    baseRate: 11.25,
    miningEarnings: 112.5,
    boost: 150,
  },
}

// Mining Rate upgrade configurations
export const MINING_RATE_UPGRADES: MiningRateUpgrade[] = [
  { level: 1, bonus: 1, cost: 10, tokenCost: 0 },
  { level: 2, bonus: 1, cost: 110, tokenCost: 0 },
  { level: 3, bonus: 1, cost: 500, tokenCost: 0 },
  { level: 4, bonus: 1, cost: 1200, tokenCost: 0 },
  { level: 5, bonus: 1, cost: 2800, tokenCost: 0 },
  { level: 6, bonus: 2, cost: 0, tokenCost: 5 },
  { level: 7, bonus: 2, cost: 0, tokenCost: 10 },
  { level: 8, bonus: 2, cost: 0, tokenCost: 20 },
  { level: 9, bonus: 3, cost: 0, tokenCost: 25 },
]

// Mining Boost upgrade configurations
export const MINING_BOOST_UPGRADES: MiningBoostUpgrade[] = [
  { level: 1, bonus: 5, cost: 15, tokenCost: 0 },
  { level: 2, bonus: 10, cost: 130, tokenCost: 0 },
  { level: 3, bonus: 16, cost: 300, tokenCost: 0 },
  { level: 4, bonus: 28, cost: 1500, tokenCost: 0 },
  { level: 5, bonus: 39, cost: 2800, tokenCost: 0 },
  { level: 6, bonus: 53, cost: 0, tokenCost: 10 },
  { level: 7, bonus: 69, cost: 0, tokenCost: 30 },
  { level: 8, bonus: 80, cost: 0, tokenCost: 80 },
  { level: 9, bonus: 120, cost: 0, tokenCost: 120 },
]

// Mining Time upgrade configurations
export const MINING_TIME_UPGRADES: MiningTimeUpgrade[] = [
  { level: 1, bonus: 30, cost: 10, tokenCost: 0 },
  { level: 2, bonus: 30, cost: 150, tokenCost: 0 },
  { level: 3, bonus: 30, cost: 500, tokenCost: 0 },
  { level: 4, bonus: 30, cost: 1200, tokenCost: 0 },
  { level: 5, bonus: 30, cost: 2500, tokenCost: 0 },
  { level: 6, bonus: 30, cost: 0, tokenCost: 15 },
  { level: 7, bonus: 30, cost: 0, tokenCost: 30 },
  { level: 8, bonus: 30, cost: 0, tokenCost: 70 },
  { level: 9, bonus: 30, cost: 0, tokenCost: 125 },
]

// NFT Slot upgrade configurations
export const NFT_SLOT_UPGRADES: NFTSlotUpgrade[] = [
  { level: 1, slots: 1, cost: 50, tokenCost: 0, available: false },
  { level: 2, slots: 1, cost: 300, tokenCost: 0, available: false },
  { level: 3, slots: 1, cost: 600, tokenCost: 0, available: false },
  { level: 4, slots: 1, cost: 1500, tokenCost: 0, available: false },
  { level: 5, slots: 1, cost: 3000, tokenCost: 0, available: false },
  { level: 6, slots: 1, cost: 0, tokenCost: 10, available: false },
  { level: 7, slots: 1, cost: 12000, tokenCost: 0, available: false },
  { level: 8, slots: 1, cost: 0, tokenCost: 25, available: false },
  { level: 9, slots: 1, cost: 0, tokenCost: 40, available: false },
]

// Helper functions
export const calculateTotalMiningRate = (baseRate: number, miningRateLevel: number): number => {
  const rateBonus = MINING_RATE_UPGRADES.slice(0, miningRateLevel).reduce((total, upgrade) => total + upgrade.bonus, 0)
  return baseRate + rateBonus
}

export const calculateTotalBoost = (
  baseBoost: number,
  miningBoostLevel: number,
  loginStreak: number,
  nftBoost = 0,
  referralBoost = 0,
): number => {
  const boostBonus = MINING_BOOST_UPGRADES.slice(0, miningBoostLevel).reduce(
    (total, upgrade) => total + upgrade.bonus,
    0,
  )
  const streakBoost = calculateLoginStreakBoost(loginStreak)
  return baseBoost + boostBonus + streakBoost + nftBoost + referralBoost
}

export const calculateTimeReduction = (miningTimeLevel: number): number => {
  return MINING_TIME_UPGRADES.slice(0, miningTimeLevel).reduce((total, upgrade) => total + upgrade.bonus, 0)
}

export const calculateNFTSlots = (nftSlotLevel: number): number => {
  return NFT_SLOT_UPGRADES.slice(0, nftSlotLevel).reduce((total, upgrade) => total + upgrade.slots, 0)
}

export const calculateLoginStreakBoost = (loginStreak: number): number => {
  if (loginStreak >= 28) return 25
  if (loginStreak >= 21) return 15
  if (loginStreak >= 14) return 10
  if (loginStreak >= 7) return 5
  return 0
}

export const calculateMiningEarnings = (
  baseRate: number,
  miningDuration: number,
  miningRateLevel: number,
  miningBoostLevel: number,
  miningTimeLevel: number,
  baseBoost: number,
  loginStreak: number,
  nftBoost = 0,
  referralBoost = 0,
): number => {
  const totalRate = calculateTotalMiningRate(baseRate, miningRateLevel)
  const totalBoost = calculateTotalBoost(baseBoost, miningBoostLevel, loginStreak, nftBoost, referralBoost)
  const timeReduction = calculateTimeReduction(miningTimeLevel)
  const adjustedDuration = Math.max(miningDuration - timeReduction / 60, 1) // Convert minutes to hours, minimum 1 hour
  const baseEarnings = totalRate * adjustedDuration
  return baseEarnings * (1 + totalBoost / 100)
}

// Get level based on experience
export const getLevelFromExperience = (experience: number): number => {
  for (let level = 1; level <= Object.keys(LEVEL_CONFIG).length; level++) {
    const config = LEVEL_CONFIG[level]
    if (experience >= config.xpMin && experience <= config.xpMax) {
      return level
    }
  }
  return Object.keys(LEVEL_CONFIG).length // Return max level if experience exceeds all levels
}

// Calculate experience needed for next level
export const getExperienceForNextLevel = (currentLevel: number): number => {
  const nextLevel = currentLevel + 1
  if (nextLevel > Object.keys(LEVEL_CONFIG).length) {
    return Number.POSITIVE_INFINITY // Already at max level
  }
  return LEVEL_CONFIG[nextLevel].xpMin
}

// Calculate progress percentage to next level
export const getLevelProgress = (experience: number, currentLevel: number): number => {
  const config = LEVEL_CONFIG[currentLevel]
  const nextLevelXp = getExperienceForNextLevel(currentLevel)

  if (nextLevelXp === Number.POSITIVE_INFINITY) {
    return 100 // Already at max level
  }

  const totalRange = nextLevelXp - config.xpMin
  const currentProgress = experience - config.xpMin
  return Math.min(100, Math.floor((currentProgress / totalRange) * 100))
}

// Calculate mining time in milliseconds
export const calculateMiningTime = (level: number, miningTimeLevel: number): number => {
  const config = LEVEL_CONFIG[level]
  const timeReduction = calculateTimeReduction(miningTimeLevel)
  const adjustedDuration = Math.max(config.miningDuration - timeReduction / 60, 1) // Convert minutes to hours, minimum 1 hour
  return adjustedDuration * 60 * 60 * 1000 // Convert hours to milliseconds
}

// Calculate mining rate per second
export const calculateMiningRatePerSecond = (
  baseRate: number,
  miningRateLevel: number,
  miningBoostLevel: number,
  baseBoost: number,
  loginStreak: number,
  nftBoost = 0,
  referralBoost = 0,
): number => {
  const totalRate = calculateTotalMiningRate(baseRate, miningRateLevel)
  const totalBoost = calculateTotalBoost(baseBoost, miningBoostLevel, loginStreak, nftBoost, referralBoost)
  const hourlyRate = totalRate * (1 + totalBoost / 100)
  return hourlyRate / 3600 // Convert hourly rate to per second
}

// Calculate upgrade cost (dollars or tokens)
export const getUpgradeCost = (
  upgradeType: "rate" | "boost" | "time" | "nft",
  currentLevel: number,
): { dollars: number; tokens: number } => {
  let upgrade

  switch (upgradeType) {
    case "rate":
      upgrade = MINING_RATE_UPGRADES[currentLevel]
      break
    case "boost":
      upgrade = MINING_BOOST_UPGRADES[currentLevel]
      break
    case "time":
      upgrade = MINING_TIME_UPGRADES[currentLevel]
      break
    case "nft":
      upgrade = NFT_SLOT_UPGRADES[currentLevel]
      break
    default:
      return { dollars: 0, tokens: 0 }
  }

  if (!upgrade) {
    return { dollars: 0, tokens: 0 }
  }

  return { dollars: upgrade.cost, tokens: upgrade.tokenCost }
}

// Check if user can afford upgrade
export const canAffordUpgrade = (
  upgradeType: "rate" | "boost" | "time" | "nft",
  currentLevel: number,
  wbuxDollars: number,
  wbuxTokens: number,
): boolean => {
  const cost = getUpgradeCost(upgradeType, currentLevel)
  return cost.dollars <= wbuxDollars && cost.tokens <= wbuxTokens
}

// Get maximum level for an upgrade type
export const getMaxUpgradeLevel = (upgradeType: "rate" | "boost" | "time" | "nft"): number => {
  switch (upgradeType) {
    case "rate":
      return MINING_RATE_UPGRADES.length
    case "boost":
      return MINING_BOOST_UPGRADES.length
    case "time":
      return MINING_TIME_UPGRADES.length
    case "nft":
      return NFT_SLOT_UPGRADES.length
    default:
      return 0
  }
}
