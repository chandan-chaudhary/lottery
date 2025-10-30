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
      return "Closed";
    case 2:
      return "Calculating";
    default:
      return `Unknown (${state})`;
  }
}
