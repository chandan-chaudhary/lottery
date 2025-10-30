"use client";

export default function PlayersList() {
  // TODO: Replace with actual contract data
  const players = [
    { address: "0x742d35Cc6634C0532925a3b844Bc9e7595f8e", entries: 3 },
    { address: "0x9a3f2d1c8b5e4f6a7c8d9e0f1a2b3c4d5e6f7a8b", entries: 2 },
    { address: "0x1b5e8f3a4c6d7e9f0a1b2c3d4e5f6a7b8c9d0e1f", entries: 1 },
    { address: "0x5c7d9e1f3a5b7c9d1e3f5a7b9c1d3e5f7a9b1c3d", entries: 5 },
    { address: "0x2a4b6c8d0e2f4a6b8c0d2e4f6a8b0c2d4e6f8a0b", entries: 1 },
  ];

  return (
    <div className="bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-sm border border-purple-500/30 rounded-2xl p-8 shadow-2xl">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center text-3xl shadow-lg">
            📋
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white">Current Players</h2>
            <p className="text-gray-400 text-sm">Who&apos;s in this round</p>
          </div>
        </div>
        <div className="bg-purple-900/30 px-4 py-2 rounded-lg border border-purple-500/30">
          <p className="text-2xl font-bold text-purple-400">{players.length}</p>
          <p className="text-xs text-gray-400">Total Players</p>
        </div>
      </div>

      <div className="space-y-2 max-h-96 overflow-y-auto custom-scrollbar">
        {players.map((player, index) => (
          <div
            key={index}
            className="flex items-center justify-between p-4 bg-gray-900/50 border border-purple-500/20 rounded-lg hover:border-purple-500/40 transition-all group"
          >
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-sm font-bold">
                #{index + 1}
              </div>
              <div>
                <p className="text-sm font-mono text-white group-hover:text-purple-400 transition-colors">
                  {player.address}
                </p>
                <p className="text-xs text-gray-500">
                  {player.entries} {player.entries === 1 ? "entry" : "entries"}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              {[...Array(player.entries)].map((_, i) => (
                <div
                  key={i}
                  className="w-2 h-2 bg-green-500 rounded-full"
                ></div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 bg-blue-900/20 border border-blue-500/30 rounded-lg p-3">
        <p className="text-xs text-blue-300 flex items-start">
          <span className="mr-2">💡</span>
          <span>
            More entries = higher chance of winning! Each ticket increases your
            odds.
          </span>
        </p>
      </div>
    </div>
  );
}
