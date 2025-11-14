"use client";

import { useLotteryData } from "../contexts/LotteryContext";
import PlayersList from "./PlayersList";

export default function LotteryPoolCard() {
  const { contractBalance, isLoading } = useLotteryData();

  return (
    <div className="bg-linear-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-sm border border-purple-500/30 rounded-2xl p-4 sm:p-6 md:p-8 shadow-2xl">
      <div className="flex items-center space-x-2 sm:space-x-3 mb-4 sm:mb-6">
        <div className="w-10 h-10 sm:w-12 md:w-14 sm:h-12 md:h-14 bg-linear-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center text-xl sm:text-2xl md:text-3xl shadow-lg">
          💰
        </div>
        <div>
          <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-white">
            Prize Pool
          </h2>
          <p className="text-gray-400 text-xs sm:text-sm">
            Total jackpot amount
          </p>
        </div>
      </div>

      <div className="space-y-4 sm:space-y-6">
        {/* Main Pool Display */}
        <div className="text-center py-4 sm:py-6 bg-linear-to-br from-purple-900/30 to-pink-900/30 rounded-xl border border-purple-500/20">
          <p className="text-gray-400 text-xs sm:text-sm mb-2">
            Current Prize Pool
          </p>
          {isLoading ? (
            <p className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-400">
              Loading...
            </p>
          ) : (
            <>
              <p className="text-3xl sm:text-4xl md:text-5xl font-bold bg-linear-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent mb-2">
                {contractBalance.toFixed(4)} ETH
              </p>
              <p className="text-xs sm:text-sm text-gray-500">
                ≈ ${(contractBalance * 2400).toFixed(2)} USD
              </p>
            </>
          )}
        </div>

        <PlayersList />

        {/* Additional Info */}

        <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-3 sm:p-4">
          <div className="flex items-start space-x-2 sm:space-x-3">
            <span className="text-base sm:text-xl shrink-0">ℹ️</span>
            <div>
              <p className="text-xs sm:text-sm text-blue-300 font-medium mb-1">
                How it works
              </p>
              <p className="text-xs text-gray-400">
                Winner is selected randomly using Chainlink VRF when the timer
                ends. All pool funds go to the lucky winner!
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
