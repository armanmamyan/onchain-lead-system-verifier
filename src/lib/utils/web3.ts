import { isAddress } from "viem";

export const formatAddress = (address: string) => {
  if (!isAddress(address)) return "Unknown";
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
};


export const getTokenPrice = (contractAddress: string): number => {
  // Implement price fetching from CoinGecko/CMC
  // For now, return 1 for stablecoins
  const stablecoins = [
    "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48", // USDC
    "0xdac17f958d2ee523a2206206994597c13d831ec7", // USDT
  ];

  if (stablecoins.includes(contractAddress.toLowerCase())) {
    return 1;
  }

  // For other tokens, fetch real price
  return 0; // Implement actual price fetching
}

export const getEthPrice = async (): Promise<number> => {
  // Use CoinGecko, CoinMarketCap, or similar
  const response = await fetch(
    "https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd"
  );
  const data = await response.json();
  return data.ethereum.usd;
}

export const walletMessage = (address: `0x${string}`) =>
  `I hereby confirm that I own the following wallet address: ${address} and I give ${process.env.NEXT_PUBLIC_SITE_NAME} permission to use my balance for verification purposes.`;
