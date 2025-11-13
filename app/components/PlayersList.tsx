"use client";

import React from "react";
import { useLotteryData } from "../contexts/LotteryContext";

export default function PlayersList() {
  const { players } = useLotteryData();

  return (
    <div className="bg-linear-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-sm border border-purple-500/30 rounded-2xl p-4 sm:p-6 md:p-8 shadow-2xl">
      <div className="flex items-center justify-between mb-4 sm:mb-6 gap-2">
        <div className="flex items-center space-x-2 sm:space-x-3">
          <div className="w-10 h-10 sm:w-12 md:w-14 sm:h-12 md:h-14 bg-linear-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center text-xl sm:text-2xl md:text-3xl shadow-lg">
            📋
          </div>
          <div>
            <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-white">
              Current Players
            </h2>
            <p className="text-gray-400 text-xs sm:text-sm">
              Who&apos;s in this round
            </p>
          </div>
        </div>
        <div className="bg-purple-900/30 px-2 sm:px-3 md:px-4 py-1.5 sm:py-2 rounded-lg border border-purple-500/30">
          <p className="text-lg sm:text-xl md:text-2xl font-bold text-purple-400">
            {players.length}
          </p>
          <p className="text-xs text-gray-400 hidden sm:block">Total Players</p>
        </div>
      </div>

      <div className="space-y-2 max-h-64 sm:max-h-80 md:max-h-96 overflow-y-auto custom-scrollbar">
        {players.map((player, index) => (
          <div
            key={index}
            className="flex items-center justify-between p-3 sm:p-4 bg-gray-900/50 border border-purple-500/20 rounded-lg hover:border-purple-500/40 transition-all group"
          >
            <div className="flex items-center space-x-2 sm:space-x-3 min-w-0 flex-1">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-linear-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-xs sm:text-sm font-bold shrink-0">
                #{index + 1}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs sm:text-sm font-mono text-white group-hover:text-purple-400 transition-colors truncate">
                  {player.address}
                </p>
                <p className="text-xs text-gray-500">
                  {player.entries} {player.entries === 1 ? "entry" : "entries"}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-1 sm:space-x-2 shrink-0 ml-2">
              {[...Array(Math.min(player.entries, 5))].map((_, i) => (
                <div
                  key={i}
                  className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-green-500 rounded-full"
                ></div>
              ))}
              {player.entries > 5 && (
                <span className="text-xs text-green-500 ml-1">
                  +{player.entries - 5}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-3 sm:mt-4 bg-blue-900/20 border border-blue-500/30 rounded-lg p-2 sm:p-3">
        <p className="text-xs text-blue-300 flex items-start">
          <span className="mr-2 shrink-0">💡</span>
          <span>
            More entries = higher chance of winning! Each ticket increases your
            odds.
          </span>
        </p>
      </div>
    </div>
  );
}
