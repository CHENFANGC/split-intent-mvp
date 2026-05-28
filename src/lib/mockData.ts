import type { Participant, Split, SupportedChain, SupportedRoute } from "@/types/intents";

export const BASE_CHAIN: SupportedChain = { id: 8453, key: "base", name: "Base" };

export const FALLBACK_CHAINS: SupportedChain[] = [
  { id: 8453, key: "base", name: "Base" },
  { id: 42161, key: "arbitrum", name: "Arbitrum" },
  { id: 10, key: "optimism", name: "Optimism" },
  { id: 137, key: "polygon", name: "Polygon" },
  { id: 1, key: "ethereum", name: "Ethereum" }
];

export const FALLBACK_ROUTES: SupportedRoute[] = [
  { fromChainId: 42161, toChainId: 8453, fromToken: "USDC", toToken: "USDC" },
  { fromChainId: 10, toChainId: 8453, fromToken: "USDC", toToken: "USDC" },
  { fromChainId: 137, toChainId: 8453, fromToken: "USDC", toToken: "USDC" },
  { fromChainId: 1, toChainId: 8453, fromToken: "USDC", toToken: "USDC" }
];

export const DEFAULT_SPLIT: Split = {
  title: "Wednesday Badminton Split",
  courtFee: 96,
  shuttleFee: 30,
  participants: 6,
  receiverChain: BASE_CHAIN,
  receiverAsset: "USDC"
};

export const DEFAULT_PARTICIPANTS: Participant[] = [
  { id: "mei", name: "Mei", sourceChain: FALLBACK_CHAINS[1], amount: 21, status: "settled" },
  { id: "jay", name: "Jay", sourceChain: FALLBACK_CHAINS[2], amount: 21, status: "delivered" },
  { id: "lin", name: "Lin", sourceChain: FALLBACK_CHAINS[3], amount: 21, status: "signed" },
  { id: "chen", name: "Chen", sourceChain: FALLBACK_CHAINS[4], amount: 21, status: "settled" }
];

