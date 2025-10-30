This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.


# Lottery dApp UI Components

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

## 🎨 Design Features

### Color Scheme

- **Primary**: Purple (#a855f7) to Pink (#ec4899) gradients
- **Background**: Dark theme with gradient overlays
- **Accents**: Green (pool), Blue (players), Yellow (winners), Orange (time)

### Key Features

1. **Fully Responsive** - Mobile-first design that adapts to all screen sizes
2. **Dark Theme Only** - Optimized for crypto/Web3 aesthetic
3. **Gradient Effects** - Modern gradient buttons and backgrounds
4. **Glassmorphism** - Frosted glass effect with backdrop blur
5. **Hover Animations** - Smooth transitions on interactive elements
6. **Custom Scrollbar** - Styled purple/pink gradient scrollbar

## 🧩 Component Guide

### Navbar

- Sticky top navigation
- Wallet connection button (placeholder for MetaMask integration)
- Connected state showing address
- Responsive mobile layout

### EnterLotteryCard

- Entry amount input
- Transaction summary
- Loading state for transactions
- Minimum entry validation

### LotteryPoolCard

- Current prize pool display
- Total players count
- Countdown to next draw
- USD conversion display

### WinnerCard

- Featured latest winner
- Recent winners list
- Etherscan transaction links
- Prize amounts

### PlayersList

- Scrollable list of current players
- Entry count per player
- Visual indicators for multiple entries
- Custom scrollbar styling

### StatsCard

- Reusable component for key metrics
- Customizable icons and gradients
- Responsive grid layout

## 🔧 Integration Points (TODO)

These components have placeholder functions that need to be connected to your smart contract:

### In `Navbar.tsx`:

```typescript
const connectWallet = async () => {
  // TODO: Implement MetaMask connection
  // - Check if MetaMask is installed
  // - Request account access
  // - Get connected address
  // - Handle network switching to Sepolia
};
```

### In `EnterLotteryCard.tsx`:

```typescript
const handleEnterLottery = async () => {
  // TODO: Implement contract interaction
  // - Call enterLottery() function
  // - Send ETH with transaction
  // - Handle transaction confirmation
  // - Update UI on success/failure
};
```

### Data Fetching Points:

- `LotteryPoolCard.tsx` - Fetch `getLotteryBalance()`, `getNumberOfPlayers()`, `getInterval()`
- `WinnerCard.tsx` - Fetch `getRecentWinner()`, listen to `PickedWinner` events
- `PlayersList.tsx` - Fetch `getPlayers()` array
- `StatsCard` (in page.tsx) - Real-time data from contract getters

## 🚀 Running the UI

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build
```

Visit `http://localhost:3000` to view the UI.

## 📝 Next Steps

1. **Install Web3 Libraries**:

   ```bash
   npm install ethers @metamask/sdk
   ```

2. **Create Contract Integration Layer**:

   - Create `app/lib/contract.ts` for contract ABI and address
   - Create `app/hooks/useContract.ts` for contract interaction hooks
   - Create `app/hooks/useWallet.ts` for wallet connection logic

3. **Environment Variables**:
   Create `.env.local`:

   ```
   NEXT_PUBLIC_CONTRACT_ADDRESS=0xf6Eac2EAEcB87Acf68412CA177aD8b6c84667422
   NEXT_PUBLIC_NETWORK_ID=11155111
   ```

4. **Contract ABI**:
   Copy your contract ABI from `artifacts/contracts/Lottery.sol/Lottery.json` to `app/lib/LotteryABI.json`

## 🎯 Features to Implement

- [ ] MetaMask wallet connection
- [ ] Read contract state (pool balance, players, winner)
- [ ] Write contract functions (enter lottery)
- [ ] Event listening (winner selection, new entries)
- [ ] Real-time updates
- [ ] Transaction notifications/toasts
- [ ] Error handling
- [ ] Loading states
- [ ] Network checking (ensure Sepolia)
- [ ] Insufficient balance warnings

## 💡 Tips

- All placeholder data is marked with `// TODO: Replace with actual contract data`
- Components are fully styled and ready for integration
- Use the `"use client"` directive for components that need interactivity
- The UI is optimized for the Sepolia testnet deployment

## 🎨 Customization

To customize colors, update the gradients in:

- Tailwind classes (e.g., `from-purple-500 to-pink-500`)
- `globals.css` for custom scrollbar and animations

To add new components:

1. Create in `app/components/`
2. Use the existing style patterns
3. Import and use in `page.tsx`
