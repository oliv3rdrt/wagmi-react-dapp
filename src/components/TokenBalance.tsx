import { useAccount } from "wagmi";
import { useTokenBalance } from "../hooks/useTokenBalance.js";
import { USDC_ADDRESS } from "../tokens.js";

export function TokenBalance() {
  const { address } = useAccount();
  const { balance, symbol, isLoading } = useTokenBalance(USDC_ADDRESS, address);

  if (isLoading) {
    return <p><strong>USDC:</strong> Loading…</p>;
  }

  // No reading available (e.g. connected to a chain without this token).
  if (balance === undefined) return null;

  const display = Number(balance).toLocaleString(undefined, {
    maximumFractionDigits: 2,
  });

  return <p><strong>{symbol ?? "USDC"}:</strong> {display}</p>;
}
