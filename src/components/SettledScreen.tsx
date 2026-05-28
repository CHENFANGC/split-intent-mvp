import { RefreshCcw } from "lucide-react";
import { ChainBadge } from "@/components/ChainBadge";
import { PrimaryButton } from "@/components/PrimaryButton";
import { StatusTimeline } from "@/components/StatusTimeline";
import { formatUsd, getSplitTotal } from "@/lib/intentMath";
import type { Participant, Split } from "@/types/intents";

export function SettledScreen({ split, participants, onReset }: { split: Split; participants: Participant[]; onReset: () => void }) {
  return (
    <section className="flex min-h-[760px] flex-col justify-between p-6">
      <div>
        <p className="mb-3 text-sm font-semibold uppercase tracking-[0.18em] text-court">Settled</p>
        <h2 className="text-4xl font-black leading-tight text-ink">One receiver outcome.</h2>
        <p className="mt-4 text-base leading-7 text-ink/65">
          Different source chains came in. The organizer receives {formatUsd(getSplitTotal(split))} in {split.receiverAsset}{" "}
          on {split.receiverChain.name}.
        </p>
      </div>

      <div className="space-y-4">
        <div className="rounded-3xl bg-white/75 p-5">
          <p className="text-sm text-ink/50">Received</p>
          <p className="text-5xl font-black text-ink">{formatUsd(getSplitTotal(split))}</p>
          <div className="mt-3">
            <ChainBadge chain={split.receiverChain} />
          </div>
        </div>
        <div className="space-y-3">
          {participants.map((participant) => (
            <div key={participant.id} className="rounded-2xl bg-white/70 p-4">
              <div className="mb-3 flex items-center justify-between gap-3">
                <div>
                  <p className="font-bold text-ink">{participant.name}</p>
                  <p className="text-sm text-ink/50">
                    {formatUsd(participant.amount)} from {participant.sourceChain.name}
                  </p>
                </div>
                <ChainBadge chain={participant.sourceChain} />
              </div>
              <StatusTimeline activeStatus={participant.status} />
            </div>
          ))}
        </div>
        <PrimaryButton onClick={onReset}>
          <span className="inline-flex items-center justify-center gap-2">
            <RefreshCcw size={18} /> Create another split
          </span>
        </PrimaryButton>
      </div>
    </section>
  );
}

