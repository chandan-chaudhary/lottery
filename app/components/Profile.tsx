"use client";
import React from "react";
import Image from "next/image";
import { useAccount, useDisconnect, useEnsAvatar, useEnsName } from "wagmi";

export function Account() {
  const { address } = useAccount();
  const { disconnect } = useDisconnect();
  const { data: ensName } = useEnsName({ address });
  const { data: ensAvatar } = useEnsAvatar({ name: ensName! });

  const [showDropdown, setShowDropdown] = React.useState(false);

  // Mask address: 0x1234...abcd
  const maskAddress = (addr: string) =>
    addr ? `${addr.slice(0, 6)}...${addr.slice(-4)}` : "";

  return (
    <div className="relative inline-block text-left">
      <button
        className="flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-800 hover:bg-gray-700 text-white shadow"
        onClick={() => setShowDropdown((v) => !v)}
      >
        {ensAvatar && (
          <Image
            alt="ENS Avatar"
            src={ensAvatar}
            width={32}
            height={32}
            className="rounded-full border border-gray-600"
          />
        )}
        <span className="font-mono text-sm">
          {ensName ? ensName : maskAddress(address ?? "")}
        </span>
        <svg
          width="16"
          height="16"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          className="ml-1"
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
        <div className="absolute right-0 mt-2 w-40 bg-gray-900 border border-gray-700 rounded-lg shadow-lg z-10">
          <button
            className="block w-full px-4 py-2 text-left text-red-500 hover:bg-gray-800 rounded-lg"
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
