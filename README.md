# wagmi-react-dapp

React dApp using wagmi v2 and viem for wallet connection, token balance queries, and USDC transfers with the simulate-then-write pattern.

## Stack

- React 18 + Vite
- wagmi v2 + viem
- WalletConnect, MetaMask, Coinbase Wallet connectors

## Prerequisites

| Tool | Version |
|------|---------|
| Node.js | 18+ |
| npm | 9+ |
| Wallet | MetaMask works for local |

A WalletConnect project ID is optional. Without it, injected MetaMask still works.

## Quick start

```bash
npm install
cp .env.example .env
# set VITE_MAINNET_RPC_URL and VITE_SEPOLIA_RPC_URL
npm run dev
```

For the RPC URLs, get an Infura key from [MetaMask Developer](https://developer.metamask.io) and use the `https://<chain>.infura.io/v3/<key>` format. Public RPCs work for casual testing but rate-limit aggressively.

Open http://localhost:5173, connect a wallet, transfer some testnet USDC.

## What's in here

- `src/wagmi.config.ts`: chains and connectors via `createConfig`
- `src/hooks/useTokenBalance.ts`: reusable balance hook
- `src/components/TransferForm.tsx`: simulate-then-write USDC transfer
- `src/components/AccountInfo.tsx`: live balance and block subscriptions

## Build

```bash
npm run build
npm run preview
```
