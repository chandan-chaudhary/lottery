#!/bin/bash

# Lottery Contract Deployment and Verification Script
# This script deploys the Lottery contract to Sepolia and verifies it on Etherscan

echo "🚀 Starting Lottery Contract Deployment..."
echo "================================"

# Deploy the contract with automatic verification
npx hardhat ignition deploy ignition/modules/Lottery.ts \
  --network sepolia \
  --parameters ignition/parameters/sepolia.json \
  --verify

echo ""
echo "================================"
echo "✅ Deployment and Verification Complete!"
echo ""
echo "📝 Next Steps:"
echo "1. Copy the deployed contract address"
echo "2. Add the contract as a consumer to your VRF subscription at https://vrf.chain.link/"
echo "3. Register the contract for Chainlink Automation at https://automation.chain.link/"
echo "4. Update your .env file with NEXT_PUBLIC_LOTTERY_ADDRESS"
echo "5. Copy the ABI to app/lib/Lottery.json"
echo ""
