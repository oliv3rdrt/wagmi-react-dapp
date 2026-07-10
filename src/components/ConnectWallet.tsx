import { useConnect } from "wagmi";

export function ConnectWallet() {
  const { connectors, connect, isPending, error } = useConnect();

  // Wallets can register more than one connector under the same name
  // (e.g. injected + a dedicated SDK connector), so de-duplicate by name.
  const uniqueConnectors = connectors.filter(
    (connector, index) =>
      connectors.findIndex((c) => c.name === connector.name) === index
  );

  return (
    <div>
      <p>Connect a wallet to get started:</p>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
        {uniqueConnectors.map((connector) => (
          <button
            key={connector.uid}
            onClick={() => connect({ connector })}
            disabled={isPending}
          >
            {isPending ? "Connecting…" : connector.name}
          </button>
        ))}
      </div>
      {error && <p style={{ color: "red" }}>{error.message}</p>}
    </div>
  );
}
