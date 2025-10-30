// app/lib/abi.ts

import artifact from "./Lottery.json";
import type { Lottery } from "@/types/ethers-contracts/Lottery";

export const LOTTERY_ABI = artifact.abi;
export type { Lottery };

// // Placeholder for Contract ABI
// // Copy your contract ABI from artifacts/contracts/Lottery.sol/Lottery.json here

// export const LOTTERY_ABI = [
//   // Constructor and View Functions
//   "function getLotteryState() view returns (uint8)",
//   "function getLotteryBalance() view returns (uint256)",
//   "function getNumberOfPlayers() view returns (uint256)",
//   "function getPlayers() view returns (address[] memory)",
//   "function getRecentWinner() view returns (address)",
//   "function getInterval() view returns (uint256)",
//   "function getLastTimeStamp() view returns (uint256)",
//   "function getLotteryEntryFee() view returns (uint256)",

//   // Write Functions
//   "function enterLottery() payable",

//   // Events
//   "event LotteryEntered(address indexed player, uint256 amount)",
//   "event RequestedLotteryWinner(uint256 indexed requestId)",
//   "event PickedWinner(address indexed winner, uint256 amount)",
// ];

// // Full ABI will be added when you integrate with the contract
// // For now, this provides the essential function signatures
