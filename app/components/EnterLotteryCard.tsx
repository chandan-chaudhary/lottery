"use client";

import { useEffect, useState } from "react";
import {
  LOTTERY_ADDRESS,
  useLotteryContract,
} from "../hooks/useLotterContract";
import { ethers } from "ethers";
import { useConnect, useAccount, useWalletClient } from "wagmi";
import { Lottery__factory } from "@/types/ethers-contracts";
import toast from "react-hot-toast";
import type { Account, Chain, WalletClient } from "viem";

// Helper function to convert WalletClient to ethers Signer
function walletClientToSigner(walletClient: WalletClient) {
  const { account, chain, transport } = walletClient;
  const network = {
    chainId: (chain as Chain).id,
    name: (chain as Chain).name,
    ensAddress: (chain as Chain).contracts?.ensRegistry?.address,
  };
  const provider = new ethers.BrowserProvider(transport, network);
  const signer = provider.getSigner((account as Account).address);
  return signer;
}

export default function EnterLotteryCard() {
  const [entryAmount, setEntryAmount] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(false);
  const [gasEstimate, setGasEstimate] = useState<number | null>(null);
  const [totalCost, setTotalCost] = useState<number | null>(null);
  const { getEntryFee, enterLottery } = useLotteryContract();

  useEffect(() => {
    const fetchData = async () => {
      const entryFee = await getEntryFee();
      setEntryAmount(entryFee);
    };
    fetchData();
  }, [getEntryFee]);

  // wagmi hooks - updated for v1+
  const { data: walletClient } = useWalletClient();
  const { connectAsync, connectors } = useConnect();
  const { address, isConnected } = useAccount();

  const [txHash, setTxHash] = useState<string | null>(null);

  const handleEnterLottery = async () => {
    setIsLoading(true);
    setTxHash(null);
    try {
      let signer;

      // Check if wallet is connected
      if (!isConnected || !walletClient) {
        const connector =
          connectors.find((c) => c.id === "injected") || connectors[0];
        if (!connector) throw new Error("No wallet connectors available");

        await connectAsync({ connector });

        // After connecting, wait a bit and get the provider
        const provider = new ethers.BrowserProvider(window.ethereum);
        signer = await provider.getSigner();
      } else {
        // Convert WalletClient to ethers Signer
        signer = await walletClientToSigner(walletClient);
      }

      const value = ethers.parseEther(entryAmount.toString());
      const provider = new ethers.BrowserProvider(window.ethereum);

      // Estimate gas and get fee data
      let gas = 0;
      let total = 0;
      try {
        // Use TypeChain factory to get contract instance
        const contract = Lottery__factory.connect(LOTTERY_ADDRESS, signer);
        // Estimate gas using contract instance and signer
        const gasEstimateBigInt = await contract.enterLottery.estimateGas({
          value,
        });
        const feeData = await provider.getFeeData();
        const gasPrice = feeData.maxFeePerGas ?? feeData.gasPrice ?? BigInt(0);
        // Calculate gas cost in ETH
        const gasCostEth = Number(
          ethers.formatEther(gasEstimateBigInt * gasPrice)
        );
        gas = gasCostEth;
        total = Number(entryAmount) + gas;
        setGasEstimate(gas);
        setTotalCost(total);
      } catch (err) {
        console.warn("Gas estimation failed:", err);
        setGasEstimate(null);
        setTotalCost(null);
      }

      // Check balance
      const balance = await provider.getBalance(address!);
      if (balance < value) {
        toast.error("Insufficient funds to cover entry + gas");
        setIsLoading(false);
        return;
      }

      // Call write helper from hook (returns receipt)
            const receipt = await enterLottery(signer, value);
            // Normalize possible hash fields from different ethers versions
            const txHashValue: string | null =
              receipt && typeof receipt === "object"
                ? (
                    "transactionHash" in receipt
                      ? (receipt as { transactionHash?: string }).transactionHash
                      : (receipt as { hash?: string }).hash
                  ) ?? null
                : null;
            setTxHash(txHashValue);
            toast.success("Entered lottery — transaction confirmed");
    } catch (err) {
      console.log(err);
      
      const e = err as { code?: number; message?: string } | undefined;
      console.error(e?.message ?? err);
      toast.error(e?.message ?? String(err));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-sm border border-purple-500/30 rounded-2xl p-8 shadow-2xl hover:shadow-purple-500/20 transition-all duration-300">
      <div>
        <h2 className="text-2xl font-bold text-white">Enter Lottery</h2>
        <p className="text-gray-400 text-sm">Buy your ticket to win big!</p>
      </div>
      <div className="space-y-4 mt-6">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Entry Amount
          </label>
          <div className="relative">
            <input
              type="number"
              value={entryAmount}
              onChange={(e) => setEntryAmount(Number(e.target.value))}
              placeholder="0.01"
              step="0.01"
              min="0.01"
              className="w-full py-2 px-4 rounded-lg bg-gray-800 text-white border border-purple-500/30 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            <span className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 font-medium">
              ETH
            </span>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Minimum entry: {entryAmount} ETH
          </p>
        </div>
        <div className="bg-gray-900/50 border border-purple-500/20 rounded-lg p-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-gray-400">Your Entry</span>
            <span className="text-sm font-medium text-white">
              {entryAmount} ETH
            </span>
          </div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-gray-400">Gas Fee (est.)</span>
            <span className="text-sm font-medium text-white">
              {gasEstimate !== null ? `~${gasEstimate.toFixed(4)} ETH` : "-"}
            </span>
          </div>
          <div className="border-t border-purple-500/20 pt-2 mt-2">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-300">Total</span>
              <span className="text-lg font-bold text-purple-400">
                {totalCost !== null ? `${totalCost.toFixed(4)} ETH` : "-"}
              </span>
            </div>
          </div>
        </div>
        <button
          onClick={handleEnterLottery}
          disabled={isLoading}
          className="w-full py-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:from-gray-600 disabled:to-gray-700 text-white font-bold rounded-lg transition-all duration-200 shadow-lg shadow-purple-500/50 hover:shadow-purple-500/70 disabled:shadow-none flex items-center justify-center space-x-2"
        >
          {isLoading ? (
            <>
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              <span>Processing...</span>
            </>
          ) : (
            <>
              <span>🎲</span>
              <span>Enter Lottery Now</span>
            </>
          )}
        </button>
        {txHash && (
          <div className="mt-4 text-center">
            <span className="text-sm text-gray-400">Transaction Hash:</span>
            <a
              href={`https://sepolia.etherscan.io/tx/${txHash}`}
              target="_blank"
              rel="noopener noreferrer"
              className="block text-purple-400 font-mono break-all hover:underline"
            >
              {txHash}
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
