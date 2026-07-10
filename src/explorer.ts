import type { Chain } from "viem";

// Build a link to the active chain's block explorer. Returns undefined when
// the chain has no explorer configured so callers can fall back to plain text.
export function explorerUrl(
  chain: Chain | undefined,
  type: "address" | "tx",
  value: string
): string | undefined {
  const base = chain?.blockExplorers?.default?.url;
  if (!base) return undefined;
  return `${base.replace(/\/+$/, "")}/${type}/${value}`;
}
