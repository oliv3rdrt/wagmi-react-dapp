import { createConfig, http } from "wagmi";
import { mainnet, sepolia } from "wagmi/chains";
import { injected, metaMask, coinbaseWallet } from "wagmi/connectors";

export const config = createConfig({
  chains: [mainnet, sepolia],
  connectors: [
    injected(),
    metaMask(),
    coinbaseWallet({ appName: "wagmi-dapp-exploration" }),
  ],
  transports: {
    [mainnet.id]: http(import.meta.env.VITE_MAINNET_RPC_URL),
    [sepolia.id]: http(import.meta.env.VITE_SEPOLIA_RPC_URL),
  },
});
