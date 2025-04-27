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

// Swap configuration
export const swapConfig = {
  minSwapAmount: 10000, // 10,000 WhaleBux Dollars
  maxSwapAmount: 100000, // Add this property for compatibility
  dailyLimit: 100000,   // Example: 100,000 WhaleBux Dollars per day
  rate: 0.000025,       // 10,000 WhaleBux Dollars = 0.25 WBUX Tokens => 1 Dollar = 0.000025 WBUX
};

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
    tokenAddress: "0x1234567890123456789012345678901234567890", // Replace with actual WBUX token address on BSC Testnet
    decimals: 18,
    logoUrl: "/chains/bnb.png",
    isTestnet: true,
  },
};
