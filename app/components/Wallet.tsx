"use client";
import * as React from "react";
import { useConnect } from "wagmi";
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

export function WalletOptions() {
  const { connectors, connect } = useConnect();
  const [open, setOpen] = React.useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button
          className="px-6 py-2.5 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-medium rounded-lg transition-all duration-200 shadow-lg shadow-purple-500/50 hover:shadow-purple-500/70 flex items-center space-x-2"
        >
          <span className="text-lg">🔗</span>
          <span>Connect Wallet</span>
        </button>
      </DialogTrigger>
      <DialogContent className="bg-gray-900 border border-purple-500/30 rounded-2xl p-8 shadow-2xl min-w-[320px] max-w-[90vw]">
        <DialogTitle className="text-xl font-bold text-white mb-6 text-center">
          Select Wallet
        </DialogTitle>
        <div>
          <div className="flex flex-col gap-4">
            {connectors.map((connector) => (
              <button
                key={connector.uid}
                onClick={() => {
                  connect({ connector });
                  setOpen(false);
                }}
                className="w-full px-4 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-medium rounded-lg transition-all duration-200 shadow-md flex items-center justify-between"
              >
                <span>{connector.name}</span>
                <span className="text-lg">→</span>
              </button>
            ))}
          </div>
          <button
            className="mt-8 w-full py-2 text-gray-400 hover:text-white text-sm border-t border-purple-500/20"
            onClick={() => setOpen(false)}
          >
            Cancel
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
