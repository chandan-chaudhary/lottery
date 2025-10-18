# Lottery Contract Deployment Guide

## Overview

This guide explains how to deploy the Lottery smart contract using Hardhat Ignition with Chainlink VRF 2.5 and Automation.

## Prerequisites

### 1. Get Testnet ETH

- Visit [Sepolia Faucet](https://sepoliafaucet.com/) to get test ETH
- You need ETH for gas fees

### 2. Create Chainlink VRF Subscription

1. Go to [Chainlink VRF](https://vrf.chain.link/)
2. Connect your wallet
3. Click "Create Subscription"
4. Note your **Subscription ID**
5. Fund it with LINK tokens (get from [Chainlink Faucet](https://faucets.chain.link/))

### 3. Configure Network in Hardhat

Make sure your `hardhat.config.ts` has the network configured:

```typescript
networks: {
  sepolia: {
    url: process.env.SEPOLIA_RPC_URL,
    accounts: [process.env.PRIVATE_KEY],
  }
}
```

## Deployment Parameters Explained

### 1. **vrfCoordinator** (address)

- **What**: Address of Chainlink VRF Coordinator contract
- **Why**: Your contract needs to know where to send randomness requests
- **Sepolia**: `0x9DdfaCa8183c41ad55329BdeeD9F6A8d53168B1B`
- **Other networks**: [VRF Addresses](https://docs.chain.link/vrf/v2-5/supported-networks)

### 2. **lotteryEntryFee** (uint256)

- **What**: Minimum ETH required to enter the lottery
- **Why**: Prevents spam and funds the prize pool
- **Example**: `0.01 ETH`
- **Format**: Use `parseEther("0.01")` to convert

### 3. **subscriptionId** (uint256)

- **What**: Your VRF subscription ID from vrf.chain.link
- **Why**: Chainlink needs to know which subscription pays for randomness
- **Important**: Must be funded with LINK tokens
- **How to get**: Create at https://vrf.chain.link/

### 4. **keyHash** (bytes32)

- **What**: Gas lane identifier - determines max gas price
- **Why**: Controls request priority and cost
- **Sepolia Options**:
  - 500 gwei (faster): `0x787d74caea10b2b357790d5b5247c2f63d1d91572a9846f780606e4d953677ae`
  - 150 gwei (cheaper): `0x474e34a077df58807dbe9c96d3c009b23b3c6d0cce433e59bbf5b34f823bc56c`

### 5. **callbackGasLimit** (uint32)

- **What**: Maximum gas for `fulfillRandomWords` callback
- **Why**: Prevents excessive gas costs
- **Recommended**: `100,000` (100k gas)
- **Considerations**:
  - Too low: Transaction fails
  - Too high: Wastes LINK tokens

### 6. **interval** (uint256)

- **What**: Seconds between lottery draws
- **Why**: Controls how often winners are picked
- **Examples**:
  - 5 minutes: `300`
  - 1 hour: `3600`
  - 1 day: `86400`

## Deployment Methods

### Method 1: Default Parameters (Quick Deploy)

```bash
npx hardhat ignition deploy ignition/modules/Lottery.ts --network sepolia
```

### Method 2: Custom Parameters (Recommended)

Create `ignition/parameters/sepolia.json`:

```json
{
  "LotteryModule": {
    "vrfCoordinator": "0x9DdfaCa8183c41ad55329BdeeD9F6A8d53168B1B",
    "lotteryEntryFee": "10000000000000000",
    "subscriptionId": "YOUR_SUBSCRIPTION_ID",
    "keyHash": "0x787d74caea10b2b357790d5b5247c2f63d1d91572a9846f780606e4d953677ae",
    "callbackGasLimit": 100000,
    "interval": 300
  }
}
```

Then deploy:

```bash
npx hardhat ignition deploy ignition/modules/Lottery.ts --network sepolia --parameters ignition/parameters/sepolia.json
```

## Post-Deployment Steps

### 1. Add Contract as Consumer

After deployment, you'll get a contract address. You MUST:

1. Go to [vrf.chain.link](https://vrf.chain.link/)
2. Select your subscription
3. Click "Add Consumer"
4. Paste your deployed contract address
5. Confirm the transaction

**Without this step, the lottery cannot request random numbers!**

### 2. Register Upkeep (Automation)

To automatically pick winners:

1. Go to [automation.chain.link](https://automation.chain.link/)
2. Click "Register New Upkeep"
3. Select "Custom logic"
4. Enter your contract address
5. Set upkeep name (e.g., "Lottery Auto Draw")
6. Fund with LINK tokens
7. Confirm

### 3. Verify Contract (Optional but Recommended)

```bash
npx hardhat verify --network sepolia DEPLOYED_ADDRESS "VRF_COORDINATOR" "ENTRY_FEE" "SUBSCRIPTION_ID" "KEY_HASH" "CALLBACK_GAS_LIMIT" "INTERVAL"
```

## Testing the Deployment

### Check Configuration

```bash
# In Hardhat console
npx hardhat console --network sepolia

const lottery = await ethers.getContractAt("Lottery", "DEPLOYED_ADDRESS");
await lottery.getLotteryEntryFee(); // Should return your entry fee
await lottery.getNoOfPlayer(); // Should return 0 initially
await lottery.lotteryState(); // Should return 0 (OPEN)
```

### Enter Lottery

```bash
# Send transaction with entry fee
const tx = await lottery.enterLottery({ value: ethers.parseEther("0.01") });
await tx.wait();
```

## Common Issues

### Issue 1: "Upkeep not needed"

- **Cause**: Conditions in `checkUpkeep` not met
- **Fix**: Ensure:
  - Lottery is OPEN
  - Interval has passed
  - At least 1 player
  - Contract has balance

### Issue 2: "Subscription not funded"

- **Cause**: VRF subscription has no LINK
- **Fix**: Add LINK tokens to subscription at vrf.chain.link

### Issue 3: "Consumer not added"

- **Cause**: Contract not added as consumer
- **Fix**: Add contract address to subscription consumers

## Network Configurations

### Sepolia Testnet

- VRF Coordinator: `0x9DdfaCa8183c41ad55329BdeeD9F6A8d53168B1B`
- Key Hash (500 gwei): `0x787d74caea10b2b357790d5b5247c2f63d1d91572a9846f780606e4d953677ae`

### Ethereum Mainnet

- VRF Coordinator: `0xD7f86b4b8Cae7D942340FF628F82735b7a20893a`
- [Get Key Hashes](https://docs.chain.link/vrf/v2-5/supported-networks)

## Cost Estimation

### Deployment Cost

- Gas: ~2-3M gas
- Cost: ~0.01-0.05 ETH (depends on gas price)

### Per Draw Cost

- VRF Request: ~0.25 LINK
- Automation Upkeep: ~0.1 LINK
- Total: ~0.35 LINK per lottery draw

## Security Checklist

- [ ] VRF subscription funded with sufficient LINK
- [ ] Contract added as VRF consumer
- [ ] Automation upkeep registered and funded
- [ ] Entry fee is reasonable
- [ ] Interval is appropriate for your use case
- [ ] Callback gas limit is sufficient
- [ ] Contract verified on Etherscan
- [ ] Test with small amounts first

## Resources

- [Chainlink VRF Docs](https://docs.chain.link/vrf)
- [Chainlink Automation Docs](https://docs.chain.link/automation)
- [Hardhat Ignition Docs](https://hardhat.org/ignition)
- [VRF Subscription Manager](https://vrf.chain.link/)
- [Automation Manager](https://automation.chain.link/)
