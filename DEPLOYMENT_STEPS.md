# 🚀 Lottery Contract Deployment Guide - Step by Step

## ✅ Pre-Deployment Checklist

Before deploying, make sure you have:

### 1. **Sepolia Testnet ETH**

- [ ] Get free testnet ETH from: https://sepoliafaucet.com/
- [ ] Check your balance: You need ~0.05 ETH for deployment

### 2. **Private Key Setup**

- [ ] Create a `.env` file in the project root
- [ ] Add your private key: `PRIVATE_KEY=your_private_key_here`
- [ ] **NEVER commit .env to git!**

### 3. **Chainlink VRF Subscription**

- [x] Subscription ID: `65782800199786290964488167298791493541762207264327220923854487195089363576761`
- [ ] Funded with LINK tokens (get from: https://faucets.chain.link/)
- [ ] Check at: https://vrf.chain.link/

---

## 📦 Step 1: Install Dependencies & Setup Environment

```bash
# Make sure all packages are installed
npm install

# Create .env file if not exists
touch .env
```

**Add to `.env`:**

```env
PRIVATE_KEY=your_wallet_private_key_without_0x
```

**⚠️ Security:** Add `.env` to `.gitignore`:

```bash
echo ".env" >> .gitignore
```

---

## 🔍 Step 2: Verify Configuration

Check your deployment parameters in `ignition/parameters/sepolia.json`:

```json
{
  "LotteryModule": {
    "vrfCoordinator": "0x9DdfaCa8183c41ad55329BdeeD9F6A8d53168B1B",
    "lotteryEntryFee": "10000000000000000", // 0.01 ETH
    "subscriptionId": "YOUR_SUBSCRIPTION_ID",
    "keyHash": "0x787d74caea10b2b357790d5b5247c2f63d1d91572a9846f780606e4d953677ae",
    "callbackGasLimit": 100000,
    "interval": 100 // 100 seconds
  }
}
```

✅ Your config looks good!

---

## 🧪 Step 3: Compile Contracts

```bash
npx hardhat compile
```

**Expected output:**

```
Compiled 3 Solidity files successfully
```

---

## 🎯 Step 4: Deploy to Sepolia Testnet

### Deploy Command:

```bash
npx hardhat ignition deploy ignition/modules/Lottery.ts \
  --network sepolia \
  --parameters ignition/parameters/sepolia.json
```

### What Happens:

1. Connects to Sepolia testnet
2. Reads your configuration
3. Deploys the Lottery contract
4. Saves deployment info to `ignition/deployments/`

### Expected Output:

```
✔ Confirm deploy to network sepolia (11155111)? … yes
Hardhat Ignition 🚀

Deploying [ LotteryModule ]

Batch #1
  Executed LotteryModule#Lottery

[ LotteryModule ] successfully deployed 🚀

Deployed Addresses

LotteryModule#Lottery - 0xYourContractAddress
```

**📝 Copy the deployed contract address!**

---

## ⚡ Step 5: Add Contract as VRF Consumer

**CRITICAL:** Without this step, your lottery cannot request random numbers!

### Go to Chainlink VRF:

1. Visit: https://vrf.chain.link/
2. Connect your wallet (same wallet that deployed)
3. Switch to Sepolia network
4. Find your subscription ID
5. Click "Add Consumer"
6. Paste your deployed contract address
7. Confirm the transaction

### Verify:

- You should see your contract address in the "Consumers" list

---

## 🤖 Step 6: Register Chainlink Automation (Optional but Recommended)

To automatically pick winners:

### Go to Chainlink Automation:

1. Visit: https://automation.chain.link/
2. Connect wallet & switch to Sepolia
3. Click "Register New Upkeep"
4. Select "Custom logic"
5. Enter your contract address
6. Name: "Lottery Auto Winner Picker"
7. Set gas limit: 500,000
8. Fund with testnet LINK
9. Register

---

## ✅ Step 7: Verify Contract on Etherscan

Make your contract code public and verifiable:

```bash
npx hardhat verify --network sepolia \
  YOUR_DEPLOYED_ADDRESS \
  "0x9DdfaCa8183c41ad55329BdeeD9F6A8d53168B1B" \
  "10000000000000000" \
  "YOUR_SUBSCRIPTION_ID" \
  "0x787d74caea10b2b357790d5b5247c2f63d1d91572a9846f780606e4d953677ae" \
  100000 \
  100
```

**Expected:**

```
Successfully verified contract Lottery on Etherscan
https://sepolia.etherscan.io/address/YOUR_ADDRESS#code
```

---

## 🎮 Step 8: Test Your Deployed Contract

### View on Etherscan:

```
https://sepolia.etherscan.io/address/YOUR_DEPLOYED_ADDRESS
```

### Interact with Contract:

1. Go to "Write Contract" tab
2. Connect your wallet
3. Find `enterLottery` function
4. Enter value: 0.01 ETH (or more)
5. Click "Write"
6. Confirm transaction

### Check Results:

1. Go to "Read Contract" tab
2. Call `getNoOfPlayer()` - Should return 1
3. Call `getPlayers()` - Should show your address

---

## 🎰 Complete Deployment Checklist

After deployment, verify:

- [ ] Contract deployed successfully
- [ ] Contract address saved
- [ ] Added as VRF consumer
- [ ] VRF subscription has LINK tokens
- [ ] Automation upkeep registered (optional)
- [ ] Contract verified on Etherscan
- [ ] Test entry works
- [ ] Can see players array

---

## 📊 Deployment Costs Estimate

| Item                | Cost (Sepolia ETH)   |
| ------------------- | -------------------- |
| Contract Deployment | ~0.01 - 0.03 ETH     |
| Add VRF Consumer    | ~0.001 ETH           |
| Register Automation | ~0.001 ETH           |
| Test Entry          | 0.01+ ETH            |
| **Total**           | **~0.02 - 0.05 ETH** |

_Note: Costs vary with gas prices_

---

## 🔧 Troubleshooting

### Error: "Insufficient funds"

**Solution:** Get more Sepolia ETH from faucet

### Error: "Invalid subscription"

**Solution:** Make sure your subscription ID is correct and funded

### Error: "Consumer not added"

**Solution:** Add contract address to VRF subscription consumers

### Error: "Private key not found"

**Solution:** Check your `.env` file has `PRIVATE_KEY=...`

### Error: "Network sepolia not found"

**Solution:** Check `hardhat.config.ts` has sepolia network configured

---

## 📱 Quick Commands Reference

```bash
# Compile
npx hardhat compile

# Deploy to Sepolia
npx hardhat ignition deploy ignition/modules/Lottery.ts \
  --network sepolia \
  --parameters ignition/parameters/sepolia.json

# Verify on Etherscan
npx hardhat verify --network sepolia ADDRESS [CONSTRUCTOR_ARGS]

# Check deployment info
cat ignition/deployments/chain-11155111/deployed_addresses.json

# Run local tests first
npx hardhat test test/Lottery.ts
```

---

## 🎉 Success!

Once deployed:

1. ✅ Contract is live on Sepolia
2. ✅ Users can enter lottery
3. ✅ VRF will provide random numbers
4. ✅ Automation will pick winners
5. ✅ Winners get paid automatically

**Your lottery is ready to use!** 🎰

---

## 📞 Need Help?

- Chainlink VRF Docs: https://docs.chain.link/vrf
- Chainlink Automation Docs: https://docs.chain.link/automation
- Hardhat Ignition Docs: https://hardhat.org/ignition
- Sepolia Faucet: https://sepoliafaucet.com/
- LINK Faucet: https://faucets.chain.link/
