// Chain configuration for WhaleBux
export interface ChainConfig {
  id: number
  name: string
  symbol: string
  rpcUrl: string
  blockExplorerUrl: string
  tokenAddress: string
  decimals: number
  logoUrl: string
  isTestnet: boolean
}

// Chain configurations
export const chains: Record<string, ChainConfig> = {
  BSC: {
    id: 56,
    name: "Binance Smart Chain",
    symbol: "BNB",
    rpcUrl: "https://bsc-dataseed.binance.org/",
    blockExplorerUrl: "https://bscscan.com",
    tokenAddress: "0x1234567890123456789012345678901234567890", // Replace with actual WBUX token address on BSC
    decimals: 18,
    logoUrl: "/chains/bnb.png",
    isTestnet: false,
  },
  BSC_TESTNET: {
    id: 97,
    name: "BSC Testnet",
    symbol: "tBNB",
    rpcUrl: "https://data-seed-prebsc-1-s1.binance.org:8545/",
    blockExplorerUrl: "https://testnet.bscscan.com",
    tokenAddress: "0x0987654321098765432109876543210987654321", // Replace with testnet token address
    decimals: 18,
    logoUrl: "/chains/bnb.png",
    isTestnet: true,
  },
  MINTME: {
    id: 24734,
    name: "MintMe Chain",
    symbol: "MINTME",
    rpcUrl: "https://node1.mintme.com:443",
    blockExplorerUrl: "https://www.mintme.com/explorer",
    tokenAddress: "0x2345678901234567890123456789012345678901", // Replace with actual WBUX token address on MintMe
    decimals: 18,
    logoUrl: "/chains/mintme.png",
    isTestnet: false,
  },
}

// Treasury wallet addresses
export const treasuryWallets = {
  // Swap treasury (holds tokens for swapping)
  swap: {
    BSC: "0x3456789012345678901234567890123456789012", // Replace with actual BSC treasury address
    MINTME: "0x4567890123456789012345678901234567890123", // Replace with actual MintMe treasury address
  },
  // Payment treasury (receives tokens from in-app purchases)
  payment: {
    BSC: "0x5678901234567890123456789012345678901234", // Replace with actual BSC payment address
    MINTME: "0x6789012345678901234567890123456789012345", // Replace with actual MintMe payment address
  },
}

// Swap rate configuration
export const swapConfig = {
  // Rate: 10,000 WhaleBux Dollars = 0.25 WBUX tokens
  rate: 0.000025, // 0.25 / 10000
  minSwapAmount: 1000, // Minimum amount of Dollars that can be swapped
  maxSwapAmount: 100000, // Maximum amount of Dollars that can be swapped at once
  dailyLimit: 500000, // Daily limit per user
}

// ABI for WBUX token (simplified ERC20 ABI)
export const tokenABI = [
  // Read-only functions
  {
    constant: true,
    inputs: [{ name: "_owner", type: "address" }],
    name: "balanceOf",
    outputs: [{ name: "balance", type: "uint256" }],
    type: "function",
  },
  // Write functions
  {
    constant: false,
    inputs: [
      { name: "_to", type: "address" },
      { name: "_value", type: "uint256" },
    ],
    name: "transfer",
    outputs: [{ name: "success", type: "bool" }],
    type: "function",
  },
  {
    constant: false,
    inputs: [
      { name: "_spender", type: "address" },
      { name: "_value", type: "uint256" },
    ],
    name: "approve",
    outputs: [{ name: "success", type: "bool" }],
    type: "function",
  },
]

// Get chain by ID
export function getChainById(chainId: number): ChainConfig | undefined {
  return Object.values(chains).find((chain) => chain.id === chainId)
}

// Get chain by name
export function getChainByName(name: string): ChainConfig | undefined {
  return chains[name]
}

// Format token amount with proper decimals
export function formatTokenAmount(amount: number, decimals = 18): string {
  return (amount * 10 ** decimals).toString()
}

// Parse token amount from blockchain format
export function parseTokenAmount(amount: string, decimals = 18): number {
  return Number.parseFloat(amount) / 10 ** decimals
}
