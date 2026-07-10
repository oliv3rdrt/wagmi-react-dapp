import { useAccount, useBalance, useBlockNumber, useDisconnect } from "wagmi";
import { ConnectWallet } from "./ConnectWallet.js";
import { TokenBalance } from "./TokenBalance.js";

export function AccountInfo() {
  const { address, chain, isConnected } = useAccount();
  const { disconnect } = useDisconnect();
  const { data: balance } = useBalance({ address });
  const { data: blockNumber } = useBlockNumber({ watch: true });

  if (!isConnected) return <ConnectWallet />;

  return (
    <div>
      <p><strong>Address:</strong> {address}</p>
      <p><strong>Chain:</strong> {chain?.name}</p>
      <p>
        <strong>Balance:</strong>{" "}
        {balance ? `${Number(balance.formatted).toFixed(4)} ${balance.symbol}` : "Loading…"}
      </p>
      <TokenBalance />
      <p><strong>Block:</strong> {blockNumber?.toString()}</p>
      <button onClick={() => disconnect()}>Disconnect</button>
    </div>
  );
}
