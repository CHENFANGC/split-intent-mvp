import { ArrowRight, Route } from "lucide-react";
import { ChainBadge } from "@/components/ChainBadge";
import { PrimaryButton } from "@/components/PrimaryButton";
import { formatUsd, getShareAmount } from "@/lib/intentMath";
import type { IntentDataState, Split, SupportedChain } from "@/types/intents";

export function PayShareScreen({
  split,
  sourceChain,
  dataState,
  message,
  onContinue
}: {
  split: Split;
  sourceChain: SupportedChain;
  dataState: IntentDataState;
  message: string;
  onContinue: () => void;
}) {
  return (
    <section className="flex min-h-[760px] flex-col justify-between p-6">
      <div>
        <p className="mb-3 text-sm font-semibold uppercase tracking-[0.18em] text-base">Intent preview</p>
        <h2 className="text-4xl font-black leading-tight text-ink">Pay from {sourceChain.name}. Receiver gets Base USDC.</h2>
        <p className="mt-4 text-base leading-7 text-ink/65">{message}</p>
      </div>

      <div className="space-y-4">
        <div className="rounded-3xl bg-white/75 p-5">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <p className="text-sm text-ink/50">Your share</p>
              <p className="text-4xl font-black text-ink">{formatUsd(getShareAmount(split))}</p>
            </div>
            <Route className="text-court" size={32} />
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <ChainBadge chain={sourceChain} />
            <ArrowRight size={16} className="text-ink/40" />
            <ChainBadge chain={split.receiverChain} />
          </div>
          <div className="mt-5 rounded-2xl bg-ink p-4 text-white">
            <p className="text-xs uppercase tracking-[0.18em] text-white/50">Outcome</p>
            <p className="mt-2 text-lg font-semibold">
              Deliver {split.receiverAsset} on {split.receiverChain.name}
            </p>
          </div>
          <p className="mt-4 text-xs font-semibold uppercase tracking-[0.16em] text-court">
            LI.FI Intents data: {dataState}
          </p>
        </div>
        <PrimaryButton onClick={onContinue}>Pay my share</PrimaryButton>
      </div>
    </section>
  );
}

