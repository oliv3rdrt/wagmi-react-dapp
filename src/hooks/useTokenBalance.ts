import { useReadContract } from "wagmi";
import { erc20Abi, formatUnits } from "viem";

export function useTokenBalance(tokenAddress: `0x${string}`, userAddress?: `0x${string}`) {
  const { data: rawBalance, isLoading } = useReadContract({
    address: tokenAddress,
    abi: erc20Abi,
    functionName: "balanceOf",
    args: userAddress ? [userAddress] : undefined,
    query: { enabled: !!userAddress },
  });

  const { data: decimals } = useReadContract({
    address: tokenAddress,
    abi: erc20Abi,
    functionName: "decimals",
  });

  const { data: symbol } = useReadContract({
    address: tokenAddress,
    abi: erc20Abi,
    functionName: "symbol",
  });

  const formatted =
    rawBalance !== undefined && decimals !== undefined
      ? formatUnits(rawBalance, decimals)
      : undefined;

  return { balance: formatted, symbol, isLoading };
}
