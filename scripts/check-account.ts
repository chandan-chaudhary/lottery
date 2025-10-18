import { network } from "hardhat";

const { ethers } = await network.connect();

async function main() {
  console.log("Checking environment variables...");
  console.log("PRIVATE_KEY exists:", !!process.env.PRIVATE_KEY);
  console.log(
    "NEXT_PUBLIC_PRIVATE_KEY exists:",
    !!process.env.NEXT_PUBLIC_PRIVATE_KEY
  );

  const signers = await ethers.getSigners();
  console.log("Number of signers:", signers.length);

  if (signers.length === 0) {
    console.error(
      "❌ No accounts found! Check your .env file has PRIVATE_KEY set"
    );
    process.exit(1);
  }

  const [signer] = signers;
  console.log("✅ Account address:", await signer.getAddress());
  const balance = await ethers.provider.getBalance(await signer.getAddress());
  console.log("✅ Account balance:", ethers.formatEther(balance), "ETH");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
