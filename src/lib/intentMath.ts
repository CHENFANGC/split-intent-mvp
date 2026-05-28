import type { PaymentStatus, Split } from "@/types/intents";

export function getSplitTotal(split: Split): number {
  return split.courtFee + split.shuttleFee;
}

export function getShareAmount(split: Split): number {
  return Number((getSplitTotal(split) / split.participants).toFixed(2));
}

export function formatUsd(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2
  }).format(amount);
}

export function getStatusLabel(status: PaymentStatus): string {
  const labels: Record<PaymentStatus, string> = {
    signed: "Signed",
    delivered: "Delivered",
    settled: "Settled"
  };

  return labels[status];
}

