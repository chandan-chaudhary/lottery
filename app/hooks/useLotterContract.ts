import { useCallback, useMemo } from "react";
import { ethers } from "ethers";
// artifact JSON not required directly when using TypeChain factory
import type { Lottery } from "@/types/ethers-contracts/Lottery";
// TypeChain factory import - gives typed connect() that accepts a Signer or Provider
import { Lottery__factory } from "@/types/ethers-contracts";

export const LOTTERY_ADDRESS = process.env
  .NEXT_PUBLIC_LOTTERY_CONTRACT_ADDRESS as string;
export const provider = new ethers.JsonRpcProvider(
  process.env.NEXT_PUBLIC_SEPOLIA_RPC_URL
);

export function useLotteryContract() {
  // Optionally, you can keep contract instance in a ref for efficiency
  // Create a typed, read-only contract instance using the TypeChain factory and the JSON-RPC provider.
  // Using the factory improves TypeScript safety and autocompletion.
  const contract = useMemo(() => {
    return Lottery__factory.connect(
      LOTTERY_ADDRESS,
      provider
    ) as unknown as Lottery;
  }, []);

  // Example: reusable fetchers
  const getEntryFee = useCallback(async () => {
    const entryFee = await contract.getLotteryEntryFee();
    return Number(entryFee) / 1e18;
  }, [contract]);

  const getTotalPlayers = useCallback(async () => {
    const players = await contract.getNoOfPlayer();
    return Number(players);
  }, [contract]);

  const getLastWinner = useCallback(async () => {
    return await contract.getRecentWinner();
  }, [contract]);

  const getLotteryState = useCallback(async () => {
    return Number(await contract.lotteryState());
  }, [contract]);

  const getLastTimeStamp = useCallback(async () => {
    return await contract.getLastTimeStamp();
  }, [contract]);

  // Add more contract functions as needed
  // Write function: accepts an ethers.Signer (this can be from wagmi's useSigner or a BrowserProvider signer)
  // Returns the transaction receipt so callers can show tx hash / status.
  const enterLottery = useCallback(
    async (signer: ethers.Signer, value: ethers.BigNumberish) => {
      try {
        // Use the TypeChain factory to connect the contract with the provided signer.
        // This returns a typed contract instance that will send signed transactions.
        const contractWithSigner = Lottery__factory.connect(
          LOTTERY_ADDRESS,
          signer
        );

        // Optional: you can estimate gas here and surface to the UI if needed.
        // const gasEstimate = await contractWithSigner.estimateGas.enterLottery({ value });

        const tx = await contractWithSigner.enterLottery({ value });
        const receipt = await tx.wait(); // wait for 1 confirmation by default
        return receipt;
      } catch (err) {
        // Narrow and handle EIP-1193 user rejection
        const e = err as { code?: number; message?: string } | undefined;
        if (e?.code === 4001) {
          throw new Error("Transaction rejected by user");
        }
        // Re-throw other errors so consuming components can show them.
        throw err;
      }
    },
    []
  );

  return {
    getEntryFee,
    getTotalPlayers,
    getLastWinner,
    getLotteryState,
    getLastTimeStamp,
    enterLottery,
  };
}
