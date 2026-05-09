import { WagmiProvider } from "wagmi";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { config } from "./wagmi.config.js";
import { AccountInfo } from "./components/AccountInfo.js";
import { TransferForm } from "./components/TransferForm.js";

const queryClient = new QueryClient();

export function App() {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <main style={{ maxWidth: "640px", margin: "2rem auto", padding: "0 1rem" }}>
          <h1>wagmi dApp Demo</h1>
          <AccountInfo />
          <hr />
          <TransferForm />
        </main>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
