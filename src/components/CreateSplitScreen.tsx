import { ArrowRight, CircleDollarSign } from "lucide-react";
import { PrimaryButton } from "@/components/PrimaryButton";
import { formatUsd, getShareAmount, getSplitTotal } from "@/lib/intentMath";
import type { Split } from "@/types/intents";

export function CreateSplitScreen({ split, onContinue }: { split: Split; onContinue: () => void }) {
  return (
    <section className="flex min-h-[760px] flex-col justify-between p-6">
      <div>
        <div className="mb-8 flex items-center justify-between">
          <div className="rounded-full bg-lime px-4 py-2 text-sm font-bold text-ink">Split Intent</div>
          <CircleDollarSign className="text-court" />
        </div>
        <p className="mb-3 text-sm font-semibold uppercase tracking-[0.18em] text-court">Badminton collection</p>
        <h1 className="text-5xl font-black leading-[0.95] text-ink">One split. One final outcome.</h1>
        <p className="mt-5 text-lg leading-7 text-ink/70">
          Participants can pay from different chains. You define the result: receive {split.receiverAsset} on{" "}
          {split.receiverChain.name}.
        </p>
      </div>

      <div className="space-y-4">
        <div className="rounded-3xl bg-white/75 p-5">
          <div className="flex justify-between text-sm text-ink/60">
            <span>Court fee</span>
            <span>{formatUsd(split.courtFee)}</span>
          </div>
          <div className="mt-3 flex justify-between text-sm text-ink/60">
            <span>Shuttles</span>
            <span>{formatUsd(split.shuttleFee)}</span>
          </div>
          <div className="mt-5 border-t border-ink/10 pt-5">
            <div className="flex items-end justify-between">
              <div>
                <p className="text-sm text-ink/50">Total</p>
                <p className="text-3xl font-black text-ink">{formatUsd(getSplitTotal(split))}</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-ink/50">{split.participants} players</p>
                <p className="text-xl font-bold text-ink">{formatUsd(getShareAmount(split))} each</p>
              </div>
            </div>
          </div>
        </div>
        <PrimaryButton onClick={onContinue}>
          <span className="inline-flex items-center justify-center gap-2">
            Create intent split <ArrowRight size={18} />
          </span>
        </PrimaryButton>
      </div>
    </section>
  );
}

