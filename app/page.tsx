"use client";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import StatsCard from "./components/StatsCard";
import EnterLotteryCard from "./components/EnterLotteryCard";
import LotteryPoolCard from "./components/LotteryPoolCard";
import WinnerCard from "./components/WinnerCard";
import PlayersList from "./components/PlayersList";
import { useLotteryContract } from "@/app/hooks/useLotterContract";
import { useEffect, useState } from "react";
import { formatLotteryState } from "@/lib/utils";

// PRODUCTION BEST PRACTICES:
// 1. Always keep your ABI and TypeChain types in sync with your deployed contract (copy after every contract change).
// 2. Use TypeChain types for type safety and autocompletion.
// 3. Add runtime error handling for contract read failures.

export default function Home() {
  const [prizePool, setPrizePool] = useState<number | null>(null);
  const [totalPlayers, setTotalPlayers] = useState<number | null>(null);
  // const [lastWinner, setLastWinner] = useState<string | null>(null);
  const [lastTimeStamp, setLastTimeStamp] = useState<bigint | null>(null);
  const [lotteryState, setLotteryState] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  const {
    getEntryFee,
    getTotalPlayers,
    getLastWinner,
    getLotteryState,
    getLastTimeStamp,
  } = useLotteryContract();

  useEffect(() => {
    async function fetchData() {
      try {
        const entryFee = await getEntryFee();
        setPrizePool(entryFee);
        const players = await getTotalPlayers();
        setTotalPlayers(players);
        const state = await getLotteryState();
        setLotteryState(state);
        const timestamp = await getLastTimeStamp();
        setLastTimeStamp(timestamp);
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("Error fetching contract data");
        }
      }
    }
    // fetchData();
    const intervalId = window.setInterval(() => {
      fetchData();
    }, 10000);

    return () => {
      clearInterval(intervalId);
    };
  }, [
    getEntryFee,
    getTotalPlayers,
    getLastWinner,
    getLotteryState,
    getLastTimeStamp,
  ]);

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-900 via-purple-900/90 to-gray-900">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Hero Section */}
        <div className="text-center mb-8 sm:mb-12">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-3 sm:mb-4 px-2">
            <span className="bg-linear-to-r from-purple-400 via-pink-400 to-purple-400 bg-clip-text text-transparent">
              Decentralized Lottery
            </span>
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-gray-400 max-w-2xl mx-auto px-4">
            Provably fair, transparent, and powered by Chainlink VRF. Your
            chance to win big on the blockchain! 🚀
          </p>
          {/* Highlighted Lottery State */}
          <div className="flex justify-center mt-4 sm:mt-6 px-4">
            {(() => {
              const state = formatLotteryState(lotteryState);
              let bg = "";
              let border = "";
              if (error) {
                bg = "bg-gray-600";
                border = "border-gray-400";
              } else if (state === "Open") {
                bg = "bg-green-600";
                border = "border-green-300";
              } else if (state === "Calculating") {
                bg = "bg-yellow-500";
                border = "border-yellow-300";
              } else if (state === "Closed") {
                bg = "bg-red-600";
                border = "border-red-400";
              } else {
                bg = "bg-gray-700";
                border = "border-gray-500";
              }
              return (
                <div
                  className={`flex items-center px-4 sm:px-6 py-2 sm:py-3 rounded-xl shadow-lg ${bg} animate-pulse border-2 ${border}`}
                  style={{ background: "inherit" }}
                >
                  <span className="flex items-center text-sm sm:text-base lg:text-lg font-bold text-white tracking-wide drop-shadow-lg">
                    <span
                      className={`inline-block w-2 h-2 sm:w-3 sm:h-3 rounded-full mr-2 ${
                        error
                          ? "bg-gray-400"
                          : state === "Open"
                          ? "bg-green-400"
                          : state === "Calculating"
                          ? "bg-yellow-300"
                          : state === "Closed"
                          ? "bg-red-400"
                          : "bg-gray-500"
                      }`}
                      aria-label="Live State Dot"
                    ></span>
                    <span className="hidden sm:inline">Lottery State: </span>
                    <span className="sm:hidden">Status: </span>
                    {error ? "Error" : state}
                  </span>
                </div>
              );
            })()}
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 mb-8 sm:mb-12">
          <StatsCard
            icon="💎"
            label="Prize Pool"
            value={error ? "Error" : prizePool ?? "Loading..."}
            subtext={error ? error : "≈ $USD"}
            linear="from-green-500 to-emerald-500"
          />
          <StatsCard
            icon="👥"
            label="Total Players"
            value={error ? "Error" : totalPlayers?.toString() ?? "Loading..."}
            subtext={error ? error : "Active participants"}
            linear="from-blue-500 to-cyan-500"
          />
          {/* <StatsCard
            icon="🏆"
            label="Last Winner"
            value={
              error
                ? "Error"
                : lastWinner
                ? maskAddress(lastWinner)
                : "Loading..."
            }
            subtext={error ? error : "Recent winner"}
            linear="from-yellow-500 to-orange-500"
          /> */}

          {/* Removed Lottery State from StatsCard and moved to hero section */}
          <StatsCard
            icon="⏱️"
            label="Last TimeStamp"
            value={
              error
                ? "Error"
                : lastTimeStamp !== null
                ? new Date(Number(lastTimeStamp)).toLocaleString()
                : "Loading..."
            }
            subtext={error ? error : "Last timestamp"}
            linear="from-orange-500 to-red-500"
          />
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 mb-8 sm:mb-12">
          {/* Left Column */}
          <div className="space-y-6 sm:space-y-8">
            <EnterLotteryCard />
            <LotteryPoolCard />
          </div>

          {/* Right Column */}
          <div className="space-y-6 sm:space-y-8">
            <WinnerCard />
            <PlayersList />
          </div>
        </div>

        {/* How It Works Section */}
        <div className="bg-linear-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-sm border border-purple-500/30 rounded-2xl p-6 sm:p-8 shadow-2xl">
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4 sm:mb-6 text-center">
            How It Works
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            <div className="text-center">
              <div className="w-12 h-12 sm:w-14 md:w-16 sm:h-14 md:h-16 bg-linear-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-2xl sm:text-3xl mx-auto mb-3 sm:mb-4 shadow-lg">
                1️⃣
              </div>
              <h3 className="text-base sm:text-lg font-bold text-white mb-1 sm:mb-2">
                Connect Wallet
              </h3>
              <p className="text-xs sm:text-sm text-gray-400">
                Connect your MetaMask or compatible Web3 wallet
              </p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 sm:w-14 md:w-16 sm:h-14 md:h-16 bg-linear-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center text-2xl sm:text-3xl mx-auto mb-3 sm:mb-4 shadow-lg">
                2️⃣
              </div>
              <h3 className="text-base sm:text-lg font-bold text-white mb-1 sm:mb-2">
                Enter Lottery
              </h3>
              <p className="text-xs sm:text-sm text-gray-400">
                Buy tickets with minimum 0.01 ETH per entry
              </p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 sm:w-14 md:w-16 sm:h-14 md:h-16 bg-linear-to-br from-orange-500 to-red-500 rounded-full flex items-center justify-center text-2xl sm:text-3xl mx-auto mb-3 sm:mb-4 shadow-lg">
                3️⃣
              </div>
              <h3 className="text-base sm:text-lg font-bold text-white mb-1 sm:mb-2">
                Wait for Draw
              </h3>
              <p className="text-xs sm:text-sm text-gray-400">
                Automated draw happens every 100 seconds
              </p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 sm:w-14 md:w-16 sm:h-14 md:h-16 bg-linear-to-br from-green-500 to-emerald-500 rounded-full flex items-center justify-center text-2xl sm:text-3xl mx-auto mb-3 sm:mb-4 shadow-lg">
                4️⃣
              </div>
              <h3 className="text-base sm:text-lg font-bold text-white mb-1 sm:mb-2">
                Winner Gets All
              </h3>
              <p className="text-xs sm:text-sm text-gray-400">
                Random winner receives entire prize pool instantly
              </p>
            </div>
          </div>

          <div className="mt-6 sm:mt-8 bg-purple-900/20 border border-purple-500/30 rounded-xl p-4 sm:p-6">
            <div className="flex items-start space-x-3 sm:space-x-4">
              <div className="text-2xl sm:text-3xl">🔐</div>
              <div>
                <h4 className="text-base sm:text-lg font-bold text-white mb-1 sm:mb-2">
                  Provably Fair & Transparent
                </h4>
                <p className="text-xs sm:text-sm text-gray-400">
                  Our lottery uses Chainlink VRF (Verifiable Random Function)
                  for cryptographically secure randomness. Every draw is
                  transparent, verifiable on-chain, and cannot be manipulated.
                  All smart contract code is open-source and auditable.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
