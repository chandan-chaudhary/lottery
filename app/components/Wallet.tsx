"use client";
import * as React from "react";
import { useConnect } from "wagmi";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export function WalletOptions() {
  const { connectors, connect } = useConnect();
  const [open, setOpen] = React.useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button className="px-2 py-0.5 sm:px-4 sm:py-2.5 bg-linear-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-medium text-sm sm:text-base rounded-lg transition-all duration-200 shadow-lg shadow-purple-500/20 hover:shadow-purple-500/70 flex items-center space-x-1.5 sm:space-x-2">
          <span className="text-base sm:text-lg">🔗</span>
          <span className="hidden sm:inline">Connect Wallet</span>
          <span className="sm:hidden">Connect</span>
        </button>
      </DialogTrigger>
      <DialogContent className="bg-gray-900 border border-purple-500/30 rounded-2xl p-6 sm:p-8 shadow-2xl min-w-[280px] sm:min-w-[320px] max-w-[90vw] sm:max-w-md">
        <DialogTitle className="text-lg sm:text-xl font-bold text-white mb-4 sm:mb-6 text-center">
          Select Wallet
        </DialogTitle>
        <div>
          <div className="flex flex-col gap-3 sm:gap-4">
            {connectors.map((connector) => (
              <button
                key={connector.uid}
                onClick={() => {
                  connect({ connector });
                  setOpen(false);
                }}
                className="w-full px-4 py-2.5 sm:py-3 bg-linear-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-medium text-sm sm:text-base rounded-lg transition-all duration-200 shadow-md flex items-center justify-between"
              >
                <span>{connector.name}</span>
                <span className="text-base sm:text-lg">→</span>
              </button>
            ))}
          </div>
          <button
            className="mt-6 sm:mt-8 w-full py-2 text-gray-400 hover:text-white text-xs sm:text-sm border-t border-purple-500/20"
            onClick={() => setOpen(false)}
          >
            Cancel
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
