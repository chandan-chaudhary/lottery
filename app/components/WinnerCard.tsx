"use client";

export default function WinnerCard() {
  // TODO: Replace with actual contract data
  const previousWinner = {
    address: "0x742d35Cc6634C0532925a3b844Bc9e7595f8e",
    amount: "8.92",
    timestamp: "2 days ago",
    txHash: "0xabc123...",
  };

  const recentWinners = [
    {
      address: "0x742d...5f8e",
      amount: "8.92",
      time: "2 days ago",
    },
    {
      address: "0x9a3f...2d1c",
      amount: "6.45",
      time: "5 days ago",
    },
    {
      address: "0x1b5e...8f3a",
      amount: "10.20",
      time: "7 days ago",
    },
  ];

  return (
    <div className="bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-sm border border-purple-500/30 rounded-2xl p-8 shadow-2xl">
      <div className="flex items-center space-x-3 mb-6">
        <div className="w-14 h-14 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-xl flex items-center justify-center text-3xl shadow-lg">
          🏆
        </div>
        <div>
          <h2 className="text-2xl font-bold text-white">Latest Winner</h2>
          <p className="text-gray-400 text-sm">Most recent lottery results</p>
        </div>
      </div>

      <div className="space-y-6">
        {/* Featured Winner */}
        <div className="bg-gradient-to-br from-yellow-900/20 to-orange-900/20 border border-yellow-500/30 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-orange-400 rounded-full flex items-center justify-center text-2xl">
                🎉
              </div>
              <div>
                <p className="text-xs text-gray-400 mb-1">Winner Address</p>
                <p className="text-sm font-mono text-white font-medium">
                  {previousWinner.address}
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-gray-400 mb-1">Prize Won</p>
              <p className="text-xl font-bold text-yellow-400">
                {previousWinner.amount} ETH
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-400 mb-1">Time</p>
              <p className="text-sm text-gray-300">
                {previousWinner.timestamp}
              </p>
            </div>
          </div>

          <a
            href={`https://sepolia.etherscan.io/tx/${previousWinner.txHash}`}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 flex items-center justify-center space-x-2 text-sm text-purple-400 hover:text-purple-300 transition-colors"
          >
            <span>View on Etherscan</span>
            <span>↗</span>
          </a>
        </div>

        {/* Recent Winners List */}
        <div>
          <h3 className="text-sm font-medium text-gray-400 mb-3">
            Recent Winners
          </h3>
          <div className="space-y-2">
            {recentWinners.map((winner, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 bg-gray-900/50 border border-purple-500/20 rounded-lg hover:border-purple-500/40 transition-all"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-xs font-bold">
                    #{index + 1}
                  </div>
                  <div>
                    <p className="text-sm font-mono text-white">
                      {winner.address}
                    </p>
                    <p className="text-xs text-gray-500">{winner.time}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-green-400">
                    {winner.amount} ETH
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
