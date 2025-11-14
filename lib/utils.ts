import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Helper to mask Ethereum address
export function maskAddress(addr: string | null) {
  if (!addr) {
    return "";
  }
  return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
}

// Example: you can map lotteryState to a string if needed
export function formatLotteryState(state: number | null) {
  if (state === null) return "Loading...";
  // Map enum values to human-readable states if you know them
  switch (state) {
    case 0:
      return "Open";
    case 1:
      return "Calculating";
    case 2:
      return "Closed";
    default:
      return `Unknown (${state})`;
  }
}


import { ethers } from "ethers";
import type { Account, Chain, WalletClient } from "viem";

/**
 * Universal helper function to convert WalletClient (from wagmi) to ethers Signer
 * This works on both desktop (browser extensions) and mobile (wallet apps)
 *
 * @param walletClient - The WalletClient from wagmi's useWalletClient hook
 * @returns ethers.Signer instance for signing transactions
 */
export async function walletClientToSigner(walletClient: WalletClient) {
  const { account, chain, transport } = walletClient;
  const network = {
    chainId: (chain as Chain).id,
    name: (chain as Chain).name,
    ensAddress: (chain as Chain).contracts?.ensRegistry?.address,
  };
  const provider = new ethers.BrowserProvider(transport, network);
  const signer = await provider.getSigner((account as Account).address);
  return signer;
}




// "devDependencies": {
//     "@eslint/eslintrc": "^3",
//     "@nomicfoundation/hardhat-ethers": "^3.1.2",
//     "@nomicfoundation/hardhat-ignition": "^3.0.4",
//     "@nomicfoundation/hardhat-network-helpers": "^3.0.2",
//     "@nomicfoundation/hardhat-toolbox": "^3.0.0",
//     "@nomicfoundation/hardhat-verify": "^3.0.5",
//     "@typechain/ethers-v6": "^0.5.1",
//     "@typechain/hardhat": "^9.1.0",
//     "@types/chai": "^4.3.20",
//     "@types/chai-as-promised": "^8.0.2",
//     "@types/mocha": "^10.0.10",
//     "@types/node": "^22.18.8",
//     "@types/react": "^19",
//     "@types/react-dom": "^19",
//     "chai": "^5.3.3",
//     "eslint": "^9",
//     "eslint-config-next": "15.5.4",
//     "ethers": "^6.15.0",
//     "forge-std": "github:foundry-rs/forge-std#v1.9.4",
//     "hardhat": "^3.0.11",
//     "mocha": "^11.7.4",
//     "tailwindcss": "^4.1.14",
//     "tw-animate-css": "^1.4.0",
//     "typechain": "^8.3.2",
//     "typescript": "~5.8.0"
//   },