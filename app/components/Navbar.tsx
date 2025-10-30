"use client";

import { useAccount } from "wagmi";
import { Account } from "./Profile";
import { WalletOptions } from "./Wallet";

export default function Navbar() {
  const { isConnected } = useAccount();

  return (
    <nav className="bg-gray-900/80 backdrop-blur-md border-b border-purple-500/20 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo/Brand */}
          <div className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
              <span className="text-2xl">🎰</span>
            </div>
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                CryptoLottery
              </h1>
              <p className="text-xs text-gray-400">Decentralized & Fair</p>
            </div>
          </div>

          {/* Connect Wallet Button */}
          <div className="flex items-center space-x-4">
            {!isConnected ? <WalletOptions /> : <Account />}
          </div>
        </div>
      </div>
    </nav>
  );
}
