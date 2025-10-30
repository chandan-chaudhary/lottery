// Contract Configuration
// This file contains the contract address and network configuration

export const CONTRACT_CONFIG = {
  // Your deployed Lottery contract address on Sepolia
  address: "0xf6Eac2EAEcB87Acf68412CA177aD8b6c84667422",

  // Sepolia testnet configuration
  chainId: 11155111,
  chainName: "Sepolia",
  rpcUrl: "https://ethereum-sepolia-rpc.publicnode.com",
  blockExplorer: "https://sepolia.etherscan.io",

  // VRF Configuration (for reference)
  vrfCoordinator: "0x9DdfaCa8183c41ad55329BdeeD9F6A8d53168B1B",
  subscriptionId:
    "65782800199786290964488167298791493541762207264327220923854487195089363576761",

  // Lottery Parameters
  entryFee: "0.01", // ETH
  interval: 100, // seconds
};

// Helper function to format address
export const formatAddress = (address: string): string => {
  if (!address) return "";
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
};

// Helper function to format ETH amount
export const formatEth = (wei: string | bigint): string => {
  // TODO: Implement using ethers.formatEther
  return wei.toString();
};

// Helper function to check if on correct network
export const isCorrectNetwork = (chainId: number): boolean => {
  return chainId === CONTRACT_CONFIG.chainId;
};
