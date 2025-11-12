"use client";

import { useEffect, useState } from "react";
import { useLotteryContract } from "../hooks/useLotterContract";

export default function WinnerCard() {
  const { getLastWinner, getAllRecentWinners } = useLotteryContract();
  const [lastWinner, setLastWinner] = useState<string | null>(null);
  const [allWinners, setAllWinners] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchWinners() {
      try {
        setLoading(true);
        const recentWinner = await getLastWinner();
        const winners = await getAllRecentWinners();

        setLastWinner(recentWinner);
        setAllWinners(winners);
      } catch (error) {
        console.error("Error fetching winners:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchWinners();

    // Refetch every 10 seconds
    const interval = setInterval(fetchWinners, 300000);
    return () => clearInterval(interval);
  }, [getLastWinner, getAllRecentWinners]);

  // Helper to mask address
  const maskAddress = (addr: string) =>
    addr && addr !== "0x0000000000000000000000000000000000000000"
      ? `${addr.slice(0, 6)}...${addr.slice(-4)}`
      : "No winner yet";

  const hasWinner =
    lastWinner && lastWinner !== "0x0000000000000000000000000000000000000000";

  if (loading) {
    return (
      <div className="bg-linear-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-sm border border-purple-500/30 rounded-2xl p-4 sm:p-6 md:p-8 shadow-2xl">
        <div className="flex items-center justify-center h-64">
          <div className="flex space-x-2">
            <div className="w-3 h-3 bg-yellow-500 rounded-full animate-bounce"></div>
            <div className="w-3 h-3 bg-orange-500 rounded-full animate-bounce [animation-delay:0.2s]"></div>
            <div className="w-3 h-3 bg-yellow-500 rounded-full animate-bounce [animation-delay:0.4s]"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-linear-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-sm border border-purple-500/30 rounded-2xl p-4 sm:p-6 md:p-8 shadow-2xl">
      <div className="flex items-center space-x-2 sm:space-x-3 mb-4 sm:mb-6">
        <div className="w-10 h-10 sm:w-12 md:w-14 sm:h-12 md:h-14 bg-linear-to-br from-yellow-500 to-orange-500 rounded-xl flex items-center justify-center text-xl sm:text-2xl md:text-3xl shadow-lg">
          🏆
        </div>
        <div>
          <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-white">
            Latest Winner
          </h2>
          <p className="text-gray-400 text-xs sm:text-sm">
            Most recent lottery results
          </p>
        </div>
      </div>

      <div className="space-y-4 sm:space-y-6">
        {/* Featured Winner */}
        {hasWinner ? (
          <div className="bg-linear-to-br from-yellow-900/20 to-orange-900/20 border border-yellow-500/30 rounded-xl p-4 sm:p-6">
            <div className="flex items-center justify-between mb-3 sm:mb-4 gap-2">
              <div className="flex items-center space-x-2 sm:space-x-3 min-w-0 flex-1">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-linear-to-br from-yellow-400 to-orange-400 rounded-full flex items-center justify-center text-xl sm:text-2xl shrink-0">
                  🎉
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs text-gray-400 mb-1">Winner Address</p>
                  <p className="text-xs sm:text-sm font-mono text-white font-medium truncate">
                    {lastWinner}
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 sm:gap-4">
              <div>
                <p className="text-xs text-gray-400 mb-1">Status</p>
                <p className="text-lg sm:text-xl font-bold text-yellow-400">
                  Winner Selected
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-400 mb-1">Time</p>
                <p className="text-xs sm:text-sm text-gray-300">Recently</p>
              </div>
            </div>

            <a
              href={`https://sepolia.etherscan.io/address/${lastWinner}`}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 sm:mt-4 flex items-center justify-center space-x-2 text-xs sm:text-sm text-purple-400 hover:text-purple-300 transition-colors"
            >
              <span>View on Etherscan</span>
              <span>↗</span>
            </a>
          </div>
        ) : (
          <div className="bg-linear-to-br from-gray-900/20 to-gray-800/20 border border-gray-500/30 rounded-xl p-4 sm:p-6 text-center">
            <div className="w-16 h-16 mx-auto mb-3 bg-gray-700/50 rounded-full flex items-center justify-center text-3xl">
              🎲
            </div>
            <p className="text-white font-medium mb-1">No Winner Yet</p>
            <p className="text-xs sm:text-sm text-gray-400">
              Be the first to win! Enter the lottery now.
            </p>
          </div>
        )}

        {/* Recent Winners List */}
        <div>
          <h3 className="text-xs sm:text-sm font-medium text-gray-400 mb-2 sm:mb-3">
            Recent Winners ({allWinners.length})
          </h3>
          <div className="space-y-2">
            {allWinners.length > 0 ? (
              allWinners.slice(0, 5).map((winner, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-2 sm:p-3 bg-gray-900/50 border border-purple-500/20 rounded-lg hover:border-purple-500/40 transition-all gap-2"
                >
                  <div className="flex items-center space-x-2 sm:space-x-3 min-w-0 flex-1">
                    <div className="w-7 h-7 sm:w-8 sm:h-8 bg-linear-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-xs font-bold shrink-0">
                      #{index + 1}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs sm:text-sm font-mono text-white truncate">
                        {maskAddress(winner)}
                      </p>
                      <p className="text-xs text-gray-500">Previous Winner</p>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <a
                      href={`https://sepolia.etherscan.io/address/${winner}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs sm:text-sm font-bold text-purple-400 hover:text-purple-300"
                    >
                      View ↗
                    </a>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-6 text-gray-500 text-sm">
                No winners yet. Be the first!
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
