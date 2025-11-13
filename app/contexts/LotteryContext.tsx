"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";
import { useLotteryContract } from "../hooks/useLotterContract";

interface LotteryContextType {
  // Data
  prizePool: number;
  totalPlayers: number;
  lastWinner: string | null;
  allWinners: string[];
  lastTimeStamp: bigint | null;
  lotteryState: number | null;
  players: { address: string; entries: number }[];
  contractBalance: number;
  interval: bigint | null;
  entryFee: number;

  // Loading states
  isLoading: boolean;
  error: string | null;

  // Methods
  refreshData: () => Promise<void>;
}

const LotteryContext = createContext<LotteryContextType | undefined>(undefined);

export function LotteryProvider({ children }: { children: React.ReactNode }) {
  // State
  const [prizePool, setPrizePool] = useState<number>(0);
  const [totalPlayers, setTotalPlayers] = useState<number>(0);
  const [lastWinner, setLastWinner] = useState<string | null>(null);
  const [allWinners, setAllWinners] = useState<string[]>([]);
  const [lastTimeStamp, setLastTimeStamp] = useState<bigint | null>(null);
  const [lotteryState, setLotteryState] = useState<number | null>(null);
  const [players, setPlayers] = useState<
    { address: string; entries: number }[]
  >([]);
  const [contractBalance, setContractBalance] = useState<number>(0);
  const [interval, setInterval] = useState<bigint | null>(null);
  const [entryFee, setEntryFee] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const {
    getEntryFee,
    getTotalPlayers,
    getLastWinner,
    getLotteryState,
    getLastTimeStamp,
    getListOfPlayers,
    getAllRecentWinners,
    getInterval,
    getContractBalance,
  } = useLotteryContract();

  // Centralized data fetching function
  const refreshData = useCallback(async () => {
    try {
      setError(null);

      // Fetch all data in parallel for better performance
      const [
        entryFeeData,
        playersCount,
        state,
        timestamp,
        playersList,
        recentWinner,
        winners,
        intervalData,
        balance,
      ] = await Promise.all([
        getEntryFee(),
        getTotalPlayers(),
        getLotteryState(),
        getLastTimeStamp(),
        getListOfPlayers(),
        getLastWinner(),
        getAllRecentWinners(),
        getInterval(),
        getContractBalance(),
      ]);

      // Update all states at once
      setEntryFee(entryFeeData);
      setPrizePool(entryFeeData);
      setTotalPlayers(playersCount);
      setLotteryState(state);
      setLastTimeStamp(timestamp);
      setPlayers(playersList);
      setLastWinner(recentWinner);
      setAllWinners(winners);
      setInterval(intervalData);
      setContractBalance(balance);
    } catch (err: unknown) {
      console.error("Error fetching lottery data:", err);
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Error fetching contract data");
      }
    } finally {
      setIsLoading(false);
    }
  }, [
    getEntryFee,
    getTotalPlayers,
    getLotteryState,
    getLastTimeStamp,
    getListOfPlayers,
    getLastWinner,
    getAllRecentWinners,
    getInterval,
    getContractBalance,
  ]);

  // Initial load
  useEffect(() => {
    refreshData();
  }, [refreshData]);

  // Auto-refresh every 5 seconds
  useEffect(() => {
    const intervalId = window.setInterval(() => {
      void refreshData();
    }, 5000); // Faster refresh for better UX

    return () => clearInterval(intervalId);
  }, [refreshData]);

  const value: LotteryContextType = {
    prizePool,
    totalPlayers,
    lastWinner,
    allWinners,
    lastTimeStamp,
    lotteryState,
    players,
    contractBalance,
    interval,
    entryFee,
    isLoading,
    error,
    refreshData,
  };

  return (
    <LotteryContext.Provider value={value}>{children}</LotteryContext.Provider>
  );
}

// Custom hook to use lottery context
export function useLotteryData() {
  const context = useContext(LotteryContext);
  if (context === undefined) {
    throw new Error("useLotteryData must be used within a LotteryProvider");
  }
  return context;
}
