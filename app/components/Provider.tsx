"use client";
import { WagmiProvider } from "wagmi";
import { config } from "../lib/wagmi.config";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { LotteryProvider } from "../contexts/LotteryContext";

const queryClient = new QueryClient();

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <LotteryProvider>{children}</LotteryProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
