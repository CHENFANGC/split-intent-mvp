import { describe, expect, it } from "vitest";
import { DEFAULT_SPLIT } from "@/lib/mockData";
import { formatUsd, getShareAmount, getSplitTotal, getStatusLabel } from "@/lib/intentMath";

describe("intentMath", () => {
  it("calculates the total badminton split", () => {
    expect(getSplitTotal(DEFAULT_SPLIT)).toBe(126);
  });

  it("calculates each participant share", () => {
    expect(getShareAmount(DEFAULT_SPLIT)).toBe(21);
  });

  it("formats USD amounts", () => {
    expect(formatUsd(21)).toBe("$21.00");
  });

  it("returns human status labels", () => {
    expect(getStatusLabel("delivered")).toBe("Delivered");
  });
});

