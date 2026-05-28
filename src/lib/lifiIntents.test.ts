import { describe, expect, it, vi } from "vitest";
import { FALLBACK_CHAINS } from "@/lib/mockData";
import { fetchIntentData, normalizeChains, normalizeRoutes } from "@/lib/lifiIntents";

describe("lifiIntents", () => {
  it("normalizes chain arrays", () => {
    expect(normalizeChains([{ id: 8453, name: "Base", key: "base" }])).toEqual([
      { id: 8453, name: "Base", key: "base" }
    ]);
  });

  it("normalizes route arrays with common field names", () => {
    expect(
      normalizeRoutes([
        {
          fromChainId: 42161,
          toChainId: 8453,
          fromToken: "USDC",
          toToken: "USDC"
        }
      ])
    ).toEqual([{ fromChainId: 42161, toChainId: 8453, fromToken: "USDC", toToken: "USDC" }]);
  });

  it("falls back when fetch fails", async () => {
    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new Error("network down")));

    const data = await fetchIntentData();

    expect(data.state).toBe("fallback");
    expect(data.chains.length).toBe(FALLBACK_CHAINS.length);

    vi.unstubAllGlobals();
  });
});

