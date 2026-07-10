import { useState } from "react";
import { useAccount, useBalance, useBlockNumber, useDisconnect } from "wagmi";
import { ConnectWallet } from "./ConnectWallet.js";
import { TokenBalance } from "./TokenBalance.js";
import { explorerUrl } from "../explorer.js";
import { truncateAddress } from "../format.js";

export function AccountInfo() {
  const { address, chain, isConnected } = useAccount();
  const { disconnect } = useDisconnect();
  const { data: balance } = useBalance({ address });
  const { data: blockNumber } = useBlockNumber({ watch: true });
  const [copied, setCopied] = useState(false);

  if (!isConnected || !address) return <ConnectWallet />;

  const addressLink = explorerUrl(chain, "address", address);
  const shortAddress = truncateAddress(address);

  const copyAddress = async () => {
    await navigator.clipboard.writeText(address);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div>
      <p>
        <strong>Address:</strong>{" "}
        {addressLink ? (
          <a href={addressLink} target="_blank" rel="noreferrer" title={address}>
            {shortAddress}
          </a>
        ) : (
          <span title={address}>{shortAddress}</span>
        )}{" "}
        <button type="button" onClick={copyAddress}>
          {copied ? "Copied!" : "Copy"}
        </button>
      </p>
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
