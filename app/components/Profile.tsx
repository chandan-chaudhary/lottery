"use client";
import React from "react";
import Image from "next/image";
import Link from "next/link";
import { useAccount, useDisconnect, useEnsAvatar, useEnsName } from "wagmi";
import { useLotteryContract } from "@/app/hooks/useLotterContract";

export function Account() {
  const { address } = useAccount();
  const { disconnect } = useDisconnect();
  const { data: ensName } = useEnsName({ address });
  const { data: ensAvatar } = useEnsAvatar({ name: ensName! });

  const [showDropdown, setShowDropdown] = React.useState(false);
  const [currentOwner, setCurrentOwner] = React.useState<string | undefined>();

  const { getOwner } = useLotteryContract();

  // Fetch contract owner
  React.useEffect(() => {
    async function fetchOwner() {
      try {
        const owner = await getOwner();
        setCurrentOwner(owner);
      } catch (error) {
        console.error("Error fetching owner:", error);
      }
    }
    fetchOwner();
  }, [getOwner]);

  // Check if connected address is the owner
  const isOwner =
    address &&
    currentOwner &&
    address.toLowerCase() === currentOwner.toLowerCase();

  // Mask address: 0x1234...abcd
  const maskAddress = (addr: string) =>
    addr ? `${addr.slice(0, 6)}...${addr.slice(-4)}` : "";

  return (
    <div className="relative inline-block text-left">
      <button
        className="flex items-center gap-1.5 sm:gap-2 px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg bg-gray-800 hover:bg-gray-700 text-white shadow text-sm sm:text-base"
        onClick={() => setShowDropdown((v) => !v)}
      >
        {ensAvatar && (
          <Image
            alt="ENS Avatar"
            src={ensAvatar}
            width={28}
            height={28}
            className="w-6 h-6 sm:w-8 sm:h-8 rounded-full border border-gray-600"
          />
        )}
        <span className="font-mono text-xs sm:text-sm truncate max-w-[100px] sm:max-w-none">
          {ensName ? ensName : maskAddress(address ?? "")}
        </span>
        <svg
          width="14"
          height="14"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          className="ml-0.5 sm:ml-1 shrink-0"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>
      {showDropdown && (
        <div className="absolute right-0 mt-2 w-44 sm:w-48 bg-gray-900 border border-gray-700 rounded-lg shadow-lg z-10">
          {isOwner && (
            <Link
              href="/admin"
              className="block w-full px-3 sm:px-4 py-2 text-left text-sm text-purple-400 hover:bg-gray-800 rounded-t-lg"
              onClick={() => setShowDropdown(false)}
            >
              🔐 Admin Panel
            </Link>
          )}
          <button
            className="block w-full px-3 sm:px-4 py-2 text-left text-sm text-red-500 hover:bg-gray-800 rounded-b-lg"
            onClick={() => {
              disconnect();
              setShowDropdown(false);
            }}
          >
            Disconnect
          </button>
        </div>
      )}
    </div>
  );
}
