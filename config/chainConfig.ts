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
    tokenAddress: "0x1234567890123456789012345678901234567890", // Replace with actual WBUX token address on BSC Testnet
    decimals: 18,
    logoUrl: "/chains/bnb.png",
    isTestnet: true,
  },
};
