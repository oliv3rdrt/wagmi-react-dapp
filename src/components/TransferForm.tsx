import { useState } from "react";
import { useAccount, useWriteContract, useWaitForTransactionReceipt, useSimulateContract } from "wagmi";
import { erc20Abi, parseUnits, isAddress } from "viem";
import { USDC_ADDRESS, USDC_DECIMALS } from "../tokens.js";
import { explorerUrl } from "../explorer.js";

export function TransferForm() {
  const { isConnected, chain } = useAccount();
  const [to, setTo] = useState("");
  const [amount, setAmount] = useState("");

  const toAddr = isAddress(to) ? (to as `0x${string}`) : undefined;
  const parsedAmount = amount ? parseUnits(amount, USDC_DECIMALS) : undefined;

  const { data: simulateData, error: simulateError } = useSimulateContract({
    address: USDC_ADDRESS,
    abi: erc20Abi,
    functionName: "transfer",
    args: toAddr && parsedAmount ? [toAddr, parsedAmount] : undefined,
    query: { enabled: !!toAddr && !!parsedAmount && isConnected },
  });

  const { writeContract, data: txHash, isPending } = useWriteContract();

  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash: txHash,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (simulateData?.request) {
      writeContract(simulateData.request);
    }
  };

  if (!isConnected) return <p>Connect your wallet to transfer tokens.</p>;

  return (
    <form onSubmit={handleSubmit}>
      <h2>Transfer USDC</h2>
      <input
        placeholder="Recipient address (0x...)"
        value={to}
        onChange={(e) => setTo(e.target.value)}
      />
      <input
        placeholder="Amount (USDC)"
        type="number"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
      />
      {simulateError && <p style={{ color: "red" }}>Error: {simulateError.message}</p>}
      <button type="submit" disabled={!simulateData?.request || isPending || isConfirming}>
        {isPending ? "Awaiting signature…" : isConfirming ? "Confirming…" : "Transfer"}
      </button>
      {isSuccess && txHash && (
        <p style={{ color: "green" }}>
          Transfer confirmed!{" "}
          {explorerUrl(chain, "tx", txHash) ? (
            <a
              href={explorerUrl(chain, "tx", txHash)}
              target="_blank"
              rel="noreferrer"
            >
              View transaction
            </a>
          ) : (
            `Tx: ${txHash}`
          )}
        </p>
      )}
    </form>
  );
}
