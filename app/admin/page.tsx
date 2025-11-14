"use client";

import { useState, useEffect } from "react";
import { useAccount, useWalletClient } from "wagmi";
import { parseEther } from "ethers";
import Link from "next/link";
import { useLotteryContract } from "@/app/hooks/useLotterContract";
import { walletClientToSigner } from "@/lib/utils";

export default function AdminPage() {
  const { address, isConnected } = useAccount();
  const { data: walletClient } = useWalletClient();

  const [newOwner, setNewOwner] = useState("");
  const [newEntryFee, setNewEntryFee] = useState("");
  const [newInterval, setNewInterval] = useState("");
  const [newMinPlayers, setNewMinPlayers] = useState("");
  const [isPending, setIsPending] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // Use the hook to get contract data and write functions
  const {
    getOwner,
    getEntryFee,
    getInterval,
    getContractBalance,
    getMinNoOfPlayers,
    changeOwner,
    emergencyWithdraw,
    setInterval: setIntervalHook,
    setLotteryEntryFee,
    setMinNoOfPlayers,
  } = useLotteryContract();

  // State for contract data
  const [currentOwner, setCurrentOwner] = useState<string | undefined>();
  const [currentEntryFee, setCurrentEntryFee] = useState<number>(0);
  const [currentInterval, setCurrentInterval] = useState<bigint | undefined>();
  const [currentMinPlayers, setCurrentMinPlayers] = useState<number>(0);
  const [contractBalance, setContractBalance] = useState<number>(0);

  // Fetch contract data
  useEffect(() => {
    async function fetchData() {
      try {
        const owner = await getOwner();
        const entryFee = await getEntryFee();
        const interval = await getInterval();
        const balance = await getContractBalance();
        const minPlayers = await getMinNoOfPlayers();

        setCurrentOwner(owner);
        setCurrentEntryFee(entryFee);
        setCurrentInterval(interval);
        setContractBalance(balance);
        setCurrentMinPlayers(minPlayers);
      } catch (error) {
        console.error("Error fetching contract data:", error);
      }
    }

    fetchData();

    // Refetch every 5 seconds
    const interval = setInterval(fetchData, 5000);

    return () => clearInterval(interval);
  }, [
    getOwner,
    getEntryFee,
    getInterval,
    getContractBalance,
    getMinNoOfPlayers,
  ]);

  const isOwner =
    address &&
    currentOwner &&
    address.toLowerCase() === currentOwner.toLowerCase();

  const handleChangeOwner = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newOwner) return;

    try {
      setIsPending(true);
      setIsSuccess(false);
      if (!walletClient) throw new Error("Wallet not connected");
      const signer = await walletClientToSigner(walletClient);
      const receipt = await changeOwner(signer, newOwner as `0x${string}`);
      console.log("Owner changed successfully:", receipt?.hash);
      setIsSuccess(true);
      setNewOwner("");
    } catch (error) {
      console.error("Error changing owner:", error);
      alert(error instanceof Error ? error.message : "Failed to change owner");
    } finally {
      setIsPending(false);
    }
  };

  const handleUpdateEntryFee = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEntryFee) return;

    try {
      setIsPending(true);
      setIsSuccess(false);
      if (!walletClient) throw new Error("Wallet not connected");
      const signer = await walletClientToSigner(walletClient);
      const receipt = await setLotteryEntryFee(signer, parseEther(newEntryFee));
      console.log("Entry fee updated successfully:", receipt?.hash);
      setIsSuccess(true);
      setNewEntryFee("");
    } catch (error) {
      console.error("Error updating entry fee:", error);
      alert(
        error instanceof Error ? error.message : "Failed to update entry fee"
      );
    } finally {
      setIsPending(false);
    }
  };

  const handleUpdateInterval = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newInterval) return;

    try {
      setIsPending(true);
      setIsSuccess(false);
      if (!walletClient) throw new Error("Wallet not connected");
      const signer = await walletClientToSigner(walletClient);
      const receipt = await setIntervalHook(signer, BigInt(newInterval));
      console.log("Interval updated successfully:", receipt?.hash);
      setIsSuccess(true);
      setNewInterval("");
    } catch (error) {
      console.error("Error updating interval:", error);
      alert(
        error instanceof Error ? error.message : "Failed to update interval"
      );
    } finally {
      setIsPending(false);
    }
  };

  const handleEmergencyWithdraw = async () => {
    if (
      !confirm("Are you sure you want to withdraw all funds from the contract?")
    ) {
      return;
    }

    try {
      setIsPending(true);
      setIsSuccess(false);
      if (!walletClient) throw new Error("Wallet not connected");
      const signer = await walletClientToSigner(walletClient);
      const receipt = await emergencyWithdraw(signer);
      console.log("Emergency withdrawal successful:", receipt?.hash);
      setIsSuccess(true);
    } catch (error) {
      console.error("Error withdrawing funds:", error);
      alert(
        error instanceof Error ? error.message : "Failed to withdraw funds"
      );
    } finally {
      setIsPending(false);
    }
  };

  const handleUpdateMinPlayers = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMinPlayers) return;

    try {
      setIsPending(true);
      setIsSuccess(false);
      if (!walletClient) throw new Error("Wallet not connected");
      const signer = await walletClientToSigner(walletClient);
      const receipt = await setMinNoOfPlayers(signer, parseInt(newMinPlayers));
      console.log("Min players updated successfully:", receipt?.hash);
      setIsSuccess(true);
      setNewMinPlayers("");
    } catch (error) {
      console.error("Error updating min players:", error);
      alert(
        error instanceof Error ? error.message : "Failed to update min players"
      );
    } finally {
      setIsPending(false);
    }
  };

  if (!isConnected) {
    return (
      <div className="min-h-screen bg-linear-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center p-4">
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20 shadow-2xl">
          <h1 className="text-3xl font-bold text-white mb-4">Admin Panel</h1>
          <p className="text-white/80">
            Please connect your wallet to access the admin panel.
          </p>
        </div>
      </div>
    );
  }

  // Loading state while fetching owner
  if (!currentOwner) {
    return (
      <div className="min-h-screen bg-linear-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center p-4">
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20 shadow-2xl">
          <h1 className="text-3xl font-bold text-white mb-4">Loading...</h1>
          <div className="flex items-center justify-center space-x-2">
            <div className="w-3 h-3 bg-purple-500 rounded-full animate-bounce"></div>
            <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce [animation-delay:0.2s]"></div>
            <div className="w-3 h-3 bg-indigo-500 rounded-full animate-bounce [animation-delay:0.4s]"></div>
          </div>
          <p className="text-white/80 mt-4">
            Fetching contract owner information...
          </p>
        </div>
      </div>
    );
  }

  if (!isOwner) {
    return (
      <div className="min-h-screen bg-linear-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center p-4">
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20 shadow-2xl">
          <h1 className="text-3xl font-bold text-white mb-4">Access Denied</h1>
          <p className="text-white/80">
            You are not the owner of this contract.
          </p>
          <p className="text-sm text-white/60 mt-2">
            Current Owner: {currentOwner as string}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-purple-900 via-blue-900 to-indigo-900 p-3 sm:p-4 md:p-6 lg:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-white/10 backdrop-blur-lg rounded-xl sm:rounded-2xl p-4 sm:p-6 md:p-8 border border-white/20 shadow-2xl mb-4 sm:mb-6">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-2">
            🔐 Admin Control Panel
          </h1>
          <p className="text-sm sm:text-base text-white/80">
            Manage lottery contract settings and funds
          </p>
          <p className="text-xs sm:text-sm text-emerald-400 mt-2 break-all">
            ✅ Connected as Owner: {address}
          </p>
        </div>

        {/* Current Settings */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mb-4 sm:mb-6">
          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-4 sm:p-5 md:p-6 border border-white/20">
            <h3 className="text-white/60 text-xs sm:text-sm font-medium mb-2">
              Current Entry Fee
            </h3>
            <p className="text-xl sm:text-2xl font-bold text-white">
              {currentEntryFee ? currentEntryFee.toFixed(4) : "0"} ETH
            </p>
          </div>
          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-4 sm:p-5 md:p-6 border border-white/20">
            <h3 className="text-white/60 text-xs sm:text-sm font-medium mb-2">
              Current Interval
            </h3>
            <p className="text-xl sm:text-2xl font-bold text-white">
              {currentInterval ? currentInterval.toString() : "0"} seconds
            </p>
          </div>
          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-4 sm:p-5 md:p-6 border border-white/20">
            <h3 className="text-white/60 text-xs sm:text-sm font-medium mb-2">
              Min Players Required
            </h3>
            <p className="text-xl sm:text-2xl font-bold text-white">
              {currentMinPlayers}
            </p>
          </div>
          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-4 sm:p-5 md:p-6 border border-white/20">
            <h3 className="text-white/60 text-xs sm:text-sm font-medium mb-2">
              Contract Balance
            </h3>
            <p className="text-xl sm:text-2xl font-bold text-white">
              {contractBalance ? contractBalance.toFixed(4) : "0"} ETH
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
          {/* Change Owner */}
          <div className="bg-white/10 backdrop-blur-lg rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-white/20 shadow-xl">
            <h2 className="text-xl sm:text-2xl font-bold text-white mb-3 sm:mb-4">
              👤 Change Ownership
            </h2>
            <form
              onSubmit={handleChangeOwner}
              className="space-y-3 sm:space-y-4"
            >
              <div>
                <label className="block text-white/80 text-xs sm:text-sm font-medium mb-2">
                  New Owner Address
                </label>
                <input
                  type="text"
                  value={newOwner}
                  onChange={(e) => setNewOwner(e.target.value)}
                  placeholder="0x..."
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
              <button
                type="submit"
                disabled={isPending || !newOwner}
                className="w-full bg-linear-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold text-sm sm:text-base py-2.5 sm:py-3 px-4 sm:px-6 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isPending ? "Changing Owner..." : "Change Owner"}
              </button>
            </form>
          </div>

          {/* Update Entry Fee */}
          <div className="bg-white/10 backdrop-blur-lg rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-white/20 shadow-xl">
            <h2 className="text-xl sm:text-2xl font-bold text-white mb-3 sm:mb-4">
              💰 Update Entry Fee
            </h2>
            <form
              onSubmit={handleUpdateEntryFee}
              className="space-y-3 sm:space-y-4"
            >
              <div>
                <label className="block text-white/80 text-xs sm:text-sm font-medium mb-2">
                  New Entry Fee (ETH)
                </label>
                <input
                  type="number"
                  step="0.001"
                  value={newEntryFee}
                  onChange={(e) => setNewEntryFee(e.target.value)}
                  placeholder="0.01"
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
              <button
                type="submit"
                disabled={isPending || !newEntryFee}
                className="w-full bg-linear-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white font-semibold text-sm sm:text-base py-2.5 sm:py-3 px-4 sm:px-6 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isPending ? "Updating Fee..." : "Update Entry Fee"}
              </button>
            </form>
          </div>

          {/* Update Interval */}
          <div className="bg-white/10 backdrop-blur-lg rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-white/20 shadow-xl">
            <h2 className="text-xl sm:text-2xl font-bold text-white mb-3 sm:mb-4">
              ⏱️ Update Interval
            </h2>
            <form
              onSubmit={handleUpdateInterval}
              className="space-y-3 sm:space-y-4"
            >
              <div>
                <label className="block text-white/80 text-xs sm:text-sm font-medium mb-2">
                  New Interval (seconds)
                </label>
                <input
                  type="number"
                  value={newInterval}
                  onChange={(e) => setNewInterval(e.target.value)}
                  placeholder="300"
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
                <p className="text-xs text-white/60 mt-1">
                  {newInterval &&
                    `≈ ${Math.floor(parseInt(newInterval) / 60)} minutes`}
                </p>
              </div>
              <button
                type="submit"
                disabled={isPending || !newInterval}
                className="w-full bg-linear-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-semibold text-sm sm:text-base py-2.5 sm:py-3 px-4 sm:px-6 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isPending ? "Updating Interval..." : "Update Interval"}
              </button>
            </form>
          </div>

          {/* Update Min Players */}
          <div className="bg-white/10 backdrop-blur-lg rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-white/20 shadow-xl">
            <h2 className="text-xl sm:text-2xl font-bold text-white mb-3 sm:mb-4">
              👥 Update Min Players
            </h2>
            <form
              onSubmit={handleUpdateMinPlayers}
              className="space-y-3 sm:space-y-4"
            >
              <div>
                <label className="block text-white/80 text-xs sm:text-sm font-medium mb-2">
                  Minimum Players Required
                </label>
                <input
                  type="number"
                  min="1"
                  max="255"
                  value={newMinPlayers}
                  onChange={(e) => setNewMinPlayers(e.target.value)}
                  placeholder="1"
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
                <p className="text-xs text-white/60 mt-1">
                  Lottery won&apos;t start until this many players join
                </p>
              </div>
              <button
                type="submit"
                disabled={isPending || !newMinPlayers}
                className="w-full bg-linear-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white font-semibold text-sm sm:text-base py-2.5 sm:py-3 px-4 sm:px-6 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isPending ? "Updating Min Players..." : "Update Min Players"}
              </button>
            </form>
          </div>

          {/* Emergency Withdraw */}
          <div className="bg-white/10 backdrop-blur-lg rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-red-500/50 shadow-xl">
            <h2 className="text-xl sm:text-2xl font-bold text-white mb-3 sm:mb-4">
              🚨 Emergency Withdrawal
            </h2>
            <div className="space-y-3 sm:space-y-4">
              <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-3 sm:p-4">
                <p className="text-white/90 text-xs sm:text-sm">
                  ⚠️ <strong>Warning:</strong> This will withdraw all funds from
                  the contract to your address. Only use in emergency
                  situations.
                </p>
              </div>
              <div className="bg-white/5 rounded-lg p-3 sm:p-4">
                <p className="text-white/80 text-xs sm:text-sm mb-1">
                  Available to Withdraw:
                </p>
                <p className="text-2xl sm:text-3xl font-bold text-white">
                  {contractBalance ? contractBalance.toFixed(4) : "0"} ETH
                </p>
              </div>
              <button
                onClick={handleEmergencyWithdraw}
                disabled={isPending}
                className="w-full bg-linear-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 text-white font-semibold text-sm sm:text-base py-2.5 sm:py-3 px-4 sm:px-6 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isPending ? "Withdrawing..." : "Emergency Withdraw All Funds"}
              </button>
            </div>
          </div>
        </div>

        {/* Success Message */}
        {isSuccess && (
          <div className="mt-4 sm:mt-6 bg-green-500/20 border border-green-500/50 rounded-xl p-3 sm:p-4">
            <p className="text-green-400 font-medium text-sm sm:text-base">
              ✅ Transaction submitted successfully!
            </p>
          </div>
        )}

        {/* Back to Home */}
        <div className="mt-4 sm:mt-6 text-center">
          <Link
            href="/"
            className="inline-block text-sm sm:text-base text-white/80 hover:text-white transition-colors duration-200"
          >
            ← Back to Lottery
          </Link>
        </div>
      </div>
    </div>
  );
}
