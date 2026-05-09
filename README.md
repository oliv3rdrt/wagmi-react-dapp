# Wagmi - Personal dApp Exploration

Exploring [wagmi](https://wagmi.sh) - React Hooks for Ethereum. Built a small dApp to interact with an ERC-20 contract, testing the full read/write/watch lifecycle.

## What I explored

- `useAccount` - connected wallet state
- `useReadContract` - reading contract state reactively
- `useWriteContract` + `useWaitForTransactionReceipt` - write + confirmation flow
- `useBalance` - ETH and ERC-20 balance fetching
- `useWatchContractEvent` - live event updates
- `useBlockNumber` - subscribing to new blocks
- Config with `createConfig` - multi-chain setup with viem transports

## Setup

```bash
npm install
npm run dev
```

## Key takeaways

- The `useSimulateContract` → `useWriteContract` pattern handles pre-flight revert checks cleanly
- `useWaitForTransactionReceipt` makes showing pending/confirmed state trivial
- Wagmi v2 is built on viem - the type safety flows end-to-end from ABI to React
- `queryClient` integration means reads are cached and deduped by default
