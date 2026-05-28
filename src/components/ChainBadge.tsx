import type { SupportedChain } from "@/types/intents";

export function ChainBadge({ chain }: { chain: SupportedChain }) {
  return (
    <span className="inline-flex items-center gap-2 rounded-full border border-ink/10 bg-white/70 px-3 py-1 text-sm font-medium text-ink">
      <span className="h-2 w-2 rounded-full bg-base" />
      {chain.name}
    </span>
  );
}

