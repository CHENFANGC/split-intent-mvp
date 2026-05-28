import { FALLBACK_CHAINS, FALLBACK_ROUTES } from "@/lib/mockData";
import type { IntentDataState, SupportedChain, SupportedRoute } from "@/types/intents";

const ORDER_BASE_URL = "https://order.li.fi";

type IntentDataResult = {
  state: IntentDataState;
  chains: SupportedChain[];
  routes: SupportedRoute[];
  message: string;
};

function asArray(value: unknown): unknown[] {
  if (Array.isArray(value)) return value;
  if (value && typeof value === "object") {
    const record = value as Record<string, unknown>;
    if (Array.isArray(record.chains)) return record.chains;
    if (Array.isArray(record.routes)) return record.routes;
    if (Array.isArray(record.data)) return record.data;
  }
  return [];
}

export function normalizeChains(input: unknown): SupportedChain[] {
  return asArray(input).flatMap((item) => {
      if (!item || typeof item !== "object") return [];
      const record = item as Record<string, unknown>;
      const id = Number(record.id ?? record.chainId);
      const name = String(record.name ?? record.displayName ?? record.key ?? "");
      const key = String(record.key ?? record.name ?? id);
      const logoUrl = typeof record.logoURI === "string" ? record.logoURI : undefined;

      if (!Number.isFinite(id) || !name) return [];
      return [{ id, name, key: key.toLowerCase(), logoUrl }];
    });
}

export function normalizeRoutes(input: unknown): SupportedRoute[] {
  return asArray(input)
    .flatMap((item) => {
      if (!item || typeof item !== "object") return [];
      const record = item as Record<string, unknown>;
      const fromChainId = Number(record.fromChainId ?? record.sourceChainId ?? record.fromChain);
      const toChainId = Number(record.toChainId ?? record.destinationChainId ?? record.toChain);
      const fromToken = String(record.fromToken ?? record.sourceToken ?? record.inputToken ?? "USDC");
      const toToken = String(record.toToken ?? record.destinationToken ?? record.outputToken ?? "USDC");

      if (!Number.isFinite(fromChainId) || !Number.isFinite(toChainId)) return [];
      return [{ fromChainId, toChainId, fromToken, toToken }];
    });
}

export async function fetchIntentData(): Promise<IntentDataResult> {
  try {
    const [chainsResponse, routesResponse] = await Promise.all([
      fetch(`${ORDER_BASE_URL}/chains/supported`, { next: { revalidate: 120 } }),
      fetch(`${ORDER_BASE_URL}/routes`, { next: { revalidate: 120 } })
    ]);

    if (!chainsResponse.ok || !routesResponse.ok) {
      throw new Error("LI.FI Intents endpoints returned a non-OK response");
    }

    const [chainsJson, routesJson] = await Promise.all([chainsResponse.json(), routesResponse.json()]);
    const chains = normalizeChains(chainsJson);
    const routes = normalizeRoutes(routesJson);

    if (chains.length === 0 && routes.length === 0) {
      return {
        state: "empty",
        chains: FALLBACK_CHAINS,
        routes: FALLBACK_ROUTES,
        message: "No live route data was found, so a demo route snapshot is shown."
      };
    }

    return {
      state: "ready",
      chains: chains.length > 0 ? chains : FALLBACK_CHAINS,
      routes: routes.length > 0 ? routes : FALLBACK_ROUTES,
      message: "Live LI.FI Intents chain and route data loaded."
    };
  } catch {
    return {
      state: "fallback",
      chains: FALLBACK_CHAINS,
      routes: FALLBACK_ROUTES,
      message: "Using a demo route snapshot while LI.FI Intents data is unavailable."
    };
  }
}
