import { Check } from "lucide-react";
import { getStatusLabel } from "@/lib/intentMath";
import type { PaymentStatus } from "@/types/intents";

const STEPS: PaymentStatus[] = ["signed", "delivered", "settled"];

export function StatusTimeline({ activeStatus }: { activeStatus: PaymentStatus }) {
  const activeIndex = STEPS.indexOf(activeStatus);

  return (
    <div className="grid grid-cols-3 gap-2">
      {STEPS.map((step, index) => {
        const isDone = index <= activeIndex;

        return (
          <div key={step} className="rounded-2xl border border-ink/10 bg-white/70 p-3 text-center">
            <div
              className={`mx-auto mb-2 flex h-7 w-7 items-center justify-center rounded-full ${
                isDone ? "bg-court text-white" : "bg-ink/10 text-ink/40"
              }`}
            >
              <Check size={15} />
            </div>
            <div className="text-xs font-semibold text-ink">{getStatusLabel(step)}</div>
          </div>
        );
      })}
    </div>
  );
}

