"use client";

export default function LotteryPoolCard() {
  // TODO: Replace with actual contract data
  const poolBalance = "12.45";
  const totalPlayers = 87;
  const nextDrawIn = "2h 34m";

  return (
    <div className="bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-sm border border-purple-500/30 rounded-2xl p-8 shadow-2xl">
      <div className="flex items-center space-x-3 mb-6">
        <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center text-3xl shadow-lg">
          💰
        </div>
        <div>
          <h2 className="text-2xl font-bold text-white">Prize Pool</h2>
          <p className="text-gray-400 text-sm">Total jackpot amount</p>
        </div>
      </div>

      <div className="space-y-6">
        {/* Main Pool Display */}
        <div className="text-center py-6 bg-gradient-to-br from-purple-900/30 to-pink-900/30 rounded-xl border border-purple-500/20">
          <p className="text-gray-400 text-sm mb-2">Current Prize Pool</p>
          <p className="text-5xl font-bold bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent mb-2">
            {poolBalance} ETH
          </p>
          <p className="text-sm text-gray-500">
            ≈ ${(parseFloat(poolBalance) * 2400).toFixed(2)} USD
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-gray-900/50 rounded-lg p-4 border border-purple-500/20">
            <div className="flex items-center space-x-2 mb-2">
              <span className="text-xl">👥</span>
              <p className="text-xs text-gray-400">Total Players</p>
            </div>
            <p className="text-2xl font-bold text-white">{totalPlayers}</p>
          </div>

          <div className="bg-gray-900/50 rounded-lg p-4 border border-purple-500/20">
            <div className="flex items-center space-x-2 mb-2">
              <span className="text-xl">⏱️</span>
              <p className="text-xs text-gray-400">Next Draw</p>
            </div>
            <p className="text-2xl font-bold text-white">{nextDrawIn}</p>
          </div>
        </div>

        {/* Additional Info */}
        <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <span className="text-xl">ℹ️</span>
            <div>
              <p className="text-sm text-blue-300 font-medium mb-1">
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
