# 🎲 Lottery dApp (Next.js + Ethers + Chainlink VRF)

This project is a fully responsive, production-ready decentralized lottery application built with Next.js, TypeScript, Ethers.js, and Chainlink VRF. Users can enter the lottery, view the prize pool, see recent winners, and connect their wallet (MetaMask/mobile supported). The UI is styled with TailwindCSS and shadcn/ui for a modern, glassmorphic look.

## 🚀 Features

- Enter the lottery with ETH (Sepolia testnet)
- Real-time prize pool and player count
- Recent winners and Etherscan links
- Mobile and desktop wallet support
- Owner/admin controls (set interval, entry fee, min players)
- Chainlink VRF for provable randomness
- Professional UI with gradients, blur, and custom scrollbars

## 🗂️ Project Structure

```
app/
   components/
      Navbar.tsx
      Footer.tsx
      StatsCard.tsx
      EnterLotteryCard.tsx
      LotteryPoolCard.tsx
      WinnerCard.tsx
      PlayersList.tsx
   page.tsx
   layout.tsx
   globals.css
contracts/
   Lottery.sol
lib/
   web3-utils.ts
   LotteryABI.json
hooks/
   useLotterContract.ts
public/
   ...assets
```

## 🛠️ Setup Instructions

1. **Clone the repo**
2. **Install dependencies**
   ```bash
   npm install
   ```
3. **Configure environment variables**
   - Copy `.env.example` to `.env.local` and fill in your contract address and RPC URL:
   ```
   NEXT_PUBLIC_LOTTERY_CONTRACT_ADDRESS=0xYourContractAddressHere
   NEXT_PUBLIC_SEPOLIA_RPC_URL=https://sepolia.infura.io/v3/your-infura-key
   NEXT_PUBLIC_NETWORK_ID=11155111
   ```
4. **Run the development server**
   ```bash
   npm run dev
   ```
5. **Open [http://localhost:3000](http://localhost:3000)**

## 📝 Environment Variables Example

See `.env.example` for required variables:

```
NEXT_PUBLIC_LOTTERY_CONTRACT_ADDRESS=0xYourContractAddressHere
NEXT_PUBLIC_SEPOLIA_RPC_URL=https://sepolia.infura.io/v3/your-infura-key
NEXT_PUBLIC_NETWORK_ID=11155111
```

## ⚡ Smart Contract Integration

- Contract: `contracts/Lottery.sol` (Sepolia testnet)
- All reads/writes use Ethers.js and TypeChain for type safety
- Chainlink VRF used for random winner selection

## 🧩 Main Components

- **EnterLotteryCard**: Enter lottery, handles wallet connection and transaction
- **LotteryPoolCard**: Shows prize pool, total players
- **WinnerCard**: Displays latest and recent winners
- **PlayersList**: Shows all current players and their entry counts
- **StatsCard**: Used for dashboard metrics (pool, players, timer, last draw)

## 🎨 UI/UX Features

- TailwindCSS gradients and dark theme
- shadcn/ui Card components
- Glassmorphism (backdrop blur)
- Custom scrollbar
- Responsive for mobile and desktop

## 🧪 Testing

- Use Sepolia testnet for contract deployment
- All contract addresses and RPC URLs are set via `.env.local`

## 📦 Build & Deploy

```bash
npm run build
# then
npm start
```

## 💡 Notes

- This dApp is for demonstration and educational purposes
- Make sure your contract is deployed and funded on Sepolia
- Wallet connection supports MetaMask and mobile wallets
- Owner/admin features require contract owner wallet

## 📄 License

MIT

This directory contains all the UI components for the CryptoLottery decentralized application.

## 📁 Folder Structure

```
app/
├── components/           # Reusable UI components
│   ├── Navbar.tsx       # Navigation bar with wallet connection
│   ├── Footer.tsx       # Footer with contract info and links
│   ├── StatsCard.tsx    # Reusable stats display card
│   ├── EnterLotteryCard.tsx   # Entry form for lottery
│   ├── LotteryPoolCard.tsx    # Prize pool display
│   ├── WinnerCard.tsx         # Latest winner information
│   └── PlayersList.tsx        # List of current players
├── page.tsx             # Main landing page
├── layout.tsx           # Root layout wrapper
└── globals.css          # Global styles and custom classes
```
