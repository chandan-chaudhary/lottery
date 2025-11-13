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
    const players = await contract.getNumberOfPlayers();
    return Number(players);
  }, [contract]);

  const getListOfPlayers = useCallback(async () => {
    const players = await contract.getPlayers();
    return players.map((player) => ({
      address: player,
      entries: 1, // Default to 1 entry per player
    }));
  }, [contract]);
  const getLastWinner = useCallback(async () => {
    return await contract.getRecentWinner();
  }, [contract]);

  const getLotteryState = useCallback(async () => {
    return Number(await contract.getLotteryState());
  }, [contract]);

  const getLastTimeStamp = useCallback(async () => {
    return await contract.getLastTimeStamp();
  }, [contract]);

  // New functions added
  const getAllRecentWinners = useCallback(async () => {
    return await contract.getAllRecentWinners();
  }, [contract]);

  const getInterval = useCallback(async () => {
    return await contract.getInterval();
  }, [contract]);

  const getContractBalance = useCallback(async () => {
    const balance = await contract.getContractBalance();
    return Number(balance) / 1e18;
  }, [contract]);

  const getNumWords = useCallback(async () => {
    return Number(await contract.getNumWords());
  }, [contract]);

  const getRequestConfirmations = useCallback(async () => {
    return Number(await contract.getRequestConfirmations());
  }, [contract]);

  const getOwner = useCallback(async () => {
    return await contract.owner();
  }, [contract]);

  // Temporary getter until TypeChain types are regenerated
  const getMinNoOfPlayers = useCallback(async () => {
    try {
      return 2;
      // Number(await contract.getMinNoOfPlayers());
    } catch (error) {
      console.error("Error fetching min players:", error);
      return 2; // Default value
    }
  }, []);

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

  // Owner function: Change owner
  const changeOwner = useCallback(
    async (signer: ethers.Signer, newOwner: string) => {
      try {
        const contractWithSigner = Lottery__factory.connect(
          LOTTERY_ADDRESS,
          signer
        );
        const tx = await contractWithSigner.changeOwner(newOwner);
        const receipt = await tx.wait();
        return receipt;
      } catch (err) {
        const e = err as { code?: number; message?: string } | undefined;
        if (e?.code === 4001) {
          throw new Error("Transaction rejected by user");
        }
        throw err;
      }
    },
    []
  );

  // Owner function: Emergency withdraw all funds
  const emergencyWithdraw = useCallback(async (signer: ethers.Signer) => {
    try {
      const contractWithSigner = Lottery__factory.connect(
        LOTTERY_ADDRESS,
        signer
      );
      const tx = await contractWithSigner.emergencyWithdraw();
      const receipt = await tx.wait();
      return receipt;
    } catch (err) {
      const e = err as { code?: number; message?: string } | undefined;
      if (e?.code === 4001) {
        throw new Error("Transaction rejected by user");
      }
      throw err;
    }
  }, []);

  // Owner function: Set interval
  const setInterval = useCallback(
    async (signer: ethers.Signer, newInterval: ethers.BigNumberish) => {
      try {
        const contractWithSigner = Lottery__factory.connect(
          LOTTERY_ADDRESS,
          signer
        );
        const tx = await contractWithSigner.setInterval(newInterval);
        const receipt = await tx.wait();
        return receipt;
      } catch (err) {
        const e = err as { code?: number; message?: string } | undefined;
        if (e?.code === 4001) {
          throw new Error("Transaction rejected by user");
        }
        throw err;
      }
    },
    []
  );

  // Owner function: Set lottery entry fee
  const setLotteryEntryFee = useCallback(
    async (signer: ethers.Signer, newFee: ethers.BigNumberish) => {
      try {
        const contractWithSigner = Lottery__factory.connect(
          LOTTERY_ADDRESS,
          signer
        );
        const tx = await contractWithSigner.setLotteryEntryFee(newFee);
        const receipt = await tx.wait();
        return receipt;
      } catch (err) {
        const e = err as { code?: number; message?: string } | undefined;
        if (e?.code === 4001) {
          throw new Error("Transaction rejected by user");
        }
        throw err;
      }
    },
    []
  );

  // Owner function: Set minimum number of players
  const setMinNoOfPlayers = useCallback(
    async (signer: ethers.Signer, minPlayers: number) => {
      try {
        const contractWithSigner = Lottery__factory.connect(
          LOTTERY_ADDRESS,
          signer
        );
        const tx = await contractWithSigner.setMinNoOfPlayers(minPlayers);
        const receipt = await tx.wait();
        return receipt;
      } catch (err) {
        const e = err as { code?: number; message?: string } | undefined;
        if (e?.code === 4001) {
          throw new Error("Transaction rejected by user");
        }
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
    getListOfPlayers,
    enterLottery,
    // New functions
    getAllRecentWinners,
    getInterval,
    getContractBalance,
    getNumWords,
    getRequestConfirmations,
    getOwner,
    // Owner write functions
    changeOwner,
    emergencyWithdraw,
    setInterval,
    setLotteryEntryFee,
    setMinNoOfPlayers,
    getMinNoOfPlayers,
  };
}
