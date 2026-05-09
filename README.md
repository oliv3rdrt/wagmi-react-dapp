```
                          _ 
 __      ____ _  __ _ _ __ (_)
 \ \ /\ / / _` |/ _` | '_ \| |
  \ V  V / (_| | (_| | | | | |
   \_/\_/ \__,_|\__, |_| |_|_|
                |___/         

  React Hooks for Ethereum
```

[![Wagmi](https://img.shields.io/badge/Wagmi-2.x-1e90ff.svg)](https://wagmi.sh)
[![viem](https://img.shields.io/badge/viem-2.x-007acc.svg)](https://viem.sh)
[![Vite](https://img.shields.io/badge/Vite-5.x-646cff.svg)](https://vitejs.dev)
[![React](https://img.shields.io/badge/React-18-61dafb.svg)](https://react.dev)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

A small React dApp built around wagmi v2 and viem. Demonstrates the full read /
write / watch lifecycle of a wallet-connected app: account state, balance
queries, contract reads, simulate-then-write transaction flow, and event
watching.

---

## Table of Contents

- [What this is](#what-this-is)
- [Prerequisites](#prerequisites)
- [Quick start](#quick-start)
- [Project structure](#project-structure)
- [The hooks used](#the-hooks-used)
- [The transaction flow](#the-transaction-flow)
- [Components](#components)
- [Multi-chain config](#multi-chain-config)
- [Why wagmi](#why-wagmi)
- [Build and deploy](#build-and-deploy)
- [Troubleshooting](#troubleshooting)
- [References](#references)

---

## What this is

Wagmi is the React hooks layer that sits on top of viem. If your app touches
Ethereum from a React component, you almost certainly want wagmi rather than
viem directly: the caching, request deduplication, and reactive re-rendering
on chain events are non-trivial to build by hand.

This repo wires up:

- Wallet connection (MetaMask, WalletConnect, Coinbase Wallet)
- Live balance and block-number subscriptions
- A reusable `useTokenBalance(token, holder)` hook
- A "transfer USDC" form using the canonical simulate-then-write pattern

## Prerequisites

| Tool    | Version | Notes                                     |
|---------|---------|-------------------------------------------|
| Node.js | 18+     |                                           |
| npm     | 9+      | pnpm/yarn fine                            |
| Wallet  | any     | MetaMask works for local testing          |

Optional: a [WalletConnect](https://cloud.walletconnect.com) project ID if you
want WalletConnect to work (otherwise injected MetaMask still functions).

## Quick start

```bash
git clone https://github.com/DRT23-mod/wagmi-dapp.git
cd wagmi-dapp
npm install
cp .env.example .env
#  set VITE_MAINNET_RPC_URL and VITE_SEPOLIA_RPC_URL
npm run dev
```

Open http://localhost:5173, click connect, transfer some testnet USDC.

## Project structure

```
wagmi-dapp/
├── index.html              # Vite entry
├── src/
│   ├── main.tsx            # React root
│   ├── App.tsx             # WagmiProvider + QueryClientProvider
│   ├── wagmi.config.ts     # createConfig with chains + connectors
│   ├── components/
│   │   ├── AccountInfo.tsx # address, chain, balance, block, disconnect
│   │   └── TransferForm.tsx# simulate -> write -> wait flow for USDC
│   └── hooks/
│       └── useTokenBalance.ts # reusable balanceOf + decimals + symbol
├── vite.config.ts
├── tsconfig.json
└── README.md
```

## The hooks used

```
                            wagmi v2 hooks
   ┌─────────────────────────────────────────────────────────────┐
   │                                                             │
   │   useAccount()         ┐                                    │
   │   useChainId()         ├─► account / network state         │
   │   useDisconnect()      ┘                                    │
   │                                                             │
   │   useBalance()         ┐                                    │
   │   useBlockNumber()     ├─► reactive chain reads             │
   │   useReadContract()    │                                    │
   │   useReadContracts()   ┘   (multicall under the hood)       │
   │                                                             │
   │   useSimulateContract()┐                                    │
   │   useWriteContract()   ├─► transaction lifecycle            │
   │   useWaitForTransactionReceipt()                            │
   │                                                             │
   │   useWatchContractEvent() ─► event subscription             │
   │                                                             │
   └─────────────────────────────────────────────────────────────┘
```

| Hook                              | Purpose                                |
|-----------------------------------|----------------------------------------|
| `useAccount`                      | `{ address, chain, isConnected }`     |
| `useBalance`                      | Native or ERC-20 balance               |
| `useBlockNumber({ watch: true })` | Subscribes to new blocks               |
| `useReadContract`                 | One contract function read             |
| `useReadContracts`                | Batched reads via multicall            |
| `useSimulateContract`             | Pre-flight a write call (revert check) |
| `useWriteContract`                | Send the actual tx                     |
| `useWaitForTransactionReceipt`    | Resolves on confirmation               |
| `useWatchContractEvent`           | Live event subscription                |

## The transaction flow

The canonical wagmi v2 pattern is **simulate, write, wait**. Doing them as a
single submit handler catches reverts before the user signs:

```
   ┌──────────────┐    ok      ┌──────────────┐    hash    ┌──────────────────┐
   │  simulate    │───────────►│   write      │───────────►│ waitForReceipt   │
   │  Contract    │            │   Contract   │            │                  │
   └──────┬───────┘            └──────────────┘            └────────┬─────────┘
          │ revert                                                  │ confirmed
          ▼                                                          ▼
    show error                                                   show success
```

`TransferForm.tsx` implements exactly this:

```tsx
const { data: simulateData, error: simulateError } = useSimulateContract({
  address: USDC_ADDRESS,
  abi: erc20Abi,
  functionName: "transfer",
  args: [recipient, amount],
});

const { writeContract, data: txHash, isPending } = useWriteContract();
const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash: txHash });

const submit = () => {
  if (simulateData?.request) writeContract(simulateData.request);
};
```

## Components

### `AccountInfo.tsx`

Reads `useAccount`, `useBalance`, and `useBlockNumber({ watch: true })` to show
a live header. Disconnects via `useDisconnect`.

### `TransferForm.tsx`

The simulate-then-write form for USDC transfers. Validates the recipient with
`isAddress`, parses the amount with `parseUnits(value, 6)`, simulates, then
writes. Shows pending / confirming / success states.

### `useTokenBalance(token, user)`

Reusable composite hook that returns `{ balance, symbol, isLoading }` for any
ERC-20 token and holder. Demonstrates how to compose `useReadContract` calls
without flicker by depending on `enabled`.

## Multi-chain config

`wagmi.config.ts`:

```ts
export const config = createConfig({
  chains: [mainnet, sepolia],
  connectors: [
    injected(),
    metaMask(),
    coinbaseWallet({ appName: "wagmi-dapp" }),
  ],
  transports: {
    [mainnet.id]: http(import.meta.env.VITE_MAINNET_RPC_URL),
    [sepolia.id]: http(import.meta.env.VITE_SEPOLIA_RPC_URL),
  },
});
```

To add a chain:

1. Import it from `wagmi/chains` (e.g. `polygon`, `base`).
2. Add it to the `chains` array.
3. Add a transport mapping in `transports`.
4. (Optional) gate UI on `chainId` so users on the wrong chain see a switch
   prompt.

## Why wagmi

Without it, every component that reads chain state has to manage:

- Stale-while-revalidate caching
- Request deduplication (5 components asking for the same balance ⇒ 1 RPC call)
- Subscription to new blocks for re-fetching
- Loading and error state
- Reconnection on chain switch

`@tanstack/react-query` is doing the heavy lifting under the hood; wagmi is
the chain-aware glue.

## Build and deploy

```bash
npm run build      # vite build, outputs to dist/
npm run preview    # serve dist/ locally
```

Static output works on any host: Vercel, Netlify, Cloudflare Pages, S3+CloudFront.

## Troubleshooting

**`window.ethereum is undefined`**
No wallet extension installed. WalletConnect (QR code) still works.

**Transaction silently does nothing**
Check the browser console. wagmi propagates RPC errors to the `error` field of
the hook; nothing gets logged unless you read it.

**`useSimulateContract` shows an error but `useReadContract` does not**
The simulation runs **as the connected account** so it catches reverts that a
plain read does not (e.g. allowance not granted, token paused).

**`Module not found: @react-native-async-storage/async-storage`**
Harmless warning from `@metamask/sdk`. It only matters in React Native builds.

## References

- [Wagmi docs](https://wagmi.sh)
- [TanStack Query](https://tanstack.com/query/latest) (under wagmi)
- [viem](https://viem.sh) (the layer below wagmi)
- [WalletConnect Cloud](https://cloud.walletconnect.com)

## License

MIT
