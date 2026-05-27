# Split Intent Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a polished mobile-first LI.FI Intents prototype where badminton participants can pay from different source chains while the organizer receives one final asset on Base.

**Architecture:** A small Next.js app owns the 3-screen flow in client state, reads real LI.FI Intents supported chain/route data through a defensive API utility, and uses mock intent lifecycle data for quote submission and settlement. Submission assets live in `docs/`, while demo-specific content lives in `demo/`.

**Tech Stack:** Next.js, TypeScript, Tailwind CSS, Framer Motion, Vitest, Testing Library, LI.FI Intents public endpoints.

---

## File Structure

- `package.json`: scripts and dependencies.
- `next.config.ts`: static export settings for easy deployment.
- `src/app/layout.tsx`: app metadata and global shell.
- `src/app/page.tsx`: 3-screen flow controller.
- `src/app/globals.css`: Tailwind import, theme tokens, base styling.
- `src/types/intents.ts`: normalized domain types.
- `src/lib/mockData.ts`: badminton split defaults and fallback route data.
- `src/lib/intentMath.ts`: total/share/status calculations.
- `src/lib/lifiIntents.ts`: LI.FI Intents endpoint fetchers and normalizers.
- `src/components/AppShell.tsx`: mobile app frame.
- `src/components/CreateSplitScreen.tsx`: organizer creation screen.
- `src/components/PayShareScreen.tsx`: participant source-chain and intent preview screen.
- `src/components/SettledScreen.tsx`: settlement payoff screen.
- `src/components/ChainBadge.tsx`: chain badge component.
- `src/components/StatusTimeline.tsx`: signed/delivered/settled lifecycle.
- `src/components/PrimaryButton.tsx`: shared CTA.
- `src/lib/*.test.ts`: unit tests for math and API normalization.
- `src/components/*.test.tsx`: focused render tests for key screens.
- `docs/project-description.md`: concise challenge description.
- `docs/api-feedback.md`: LI.FI Intents API feedback.
- `docs/x-post-draft.md`: X / Scribble post draft.
- `docs/demo-script-zh.md`: about 4-minute Chinese narration script.
- `docs/demo-subtitles-bilingual.md`: Chinese and English subtitle lines.
- `docs/final-submission-checklist.md`: final submission checklist.

## Task 1: Scaffold Next.js App

**Files:**
- Create: `package.json`
- Create: `tsconfig.json`
- Create: `next.config.ts`
- Create: `postcss.config.mjs`
- Create: `tailwind.config.ts`
- Create: `vitest.config.ts`
- Create: `src/app/layout.tsx`
- Create: `src/app/globals.css`

- [ ] **Step 1: Create package metadata**

Create `package.json`:

```json
{
  "name": "split-intent",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "lint": "next lint",
    "test": "vitest run",
    "test:watch": "vitest"
  },
  "dependencies": {
    "@vitejs/plugin-react": "^5.0.0",
    "framer-motion": "^12.0.0",
    "lucide-react": "^0.468.0",
    "next": "^15.0.0",
    "react": "^19.0.0",
    "react-dom": "^19.0.0"
  },
  "devDependencies": {
    "@testing-library/jest-dom": "^6.6.3",
    "@testing-library/react": "^16.1.0",
    "@types/node": "^22.10.0",
    "@types/react": "^19.0.0",
    "@types/react-dom": "^19.0.0",
    "autoprefixer": "^10.4.20",
    "eslint": "^9.15.0",
    "eslint-config-next": "^15.0.0",
    "jsdom": "^25.0.1",
    "postcss": "^8.4.49",
    "tailwindcss": "^3.4.16",
    "typescript": "^5.7.0",
    "vitest": "^2.1.8"
  }
}
```

- [ ] **Step 2: Add TypeScript and build config**

Create `tsconfig.json`:

```json
{
  "compilerOptions": {
    "target": "ES2017",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": false,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [{ "name": "next" }],
    "paths": { "@/*": ["./src/*"] }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

Create `next.config.ts`:

```ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: process.env.STATIC_EXPORT === "true" ? "export" : undefined,
  images: {
    unoptimized: true
  }
};

export default nextConfig;
```

Create `postcss.config.mjs`:

```js
const config = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {}
  }
};

export default config;
```

Create `tailwind.config.ts`:

```ts
import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        ink: "#151515",
        paper: "#fbf7ef",
        court: "#1f8f68",
        lime: "#d9ff73",
        base: "#2457ff"
      },
      boxShadow: {
        soft: "0 18px 70px rgba(21, 21, 21, 0.12)"
      }
    }
  },
  plugins: []
};

export default config;
```

Create `vitest.config.ts`:

```ts
import react from "@vitejs/plugin-react";
import { defineConfig } from "vitest/config";

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./src/test/setup.ts"]
  }
});
```

- [ ] **Step 3: Add app shell files**

Create `src/app/layout.tsx`:

```tsx
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Split Intent",
  description: "Pay from different chains. Receive one final outcome."
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
```

Create `src/app/globals.css`:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  color: #151515;
  background: #fbf7ef;
}

* {
  box-sizing: border-box;
}

body {
  min-height: 100vh;
  margin: 0;
  background:
    radial-gradient(circle at 18% 12%, rgba(217, 255, 115, 0.45), transparent 26rem),
    radial-gradient(circle at 90% 4%, rgba(36, 87, 255, 0.18), transparent 22rem),
    linear-gradient(180deg, #fbf7ef 0%, #edf8eb 100%);
  font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
}

button,
input,
select {
  font: inherit;
}
```

- [ ] **Step 4: Install dependencies**

Run: `npm install`

Expected: `package-lock.json` is created and npm exits successfully.

- [ ] **Step 5: Commit**

```bash
git add package.json package-lock.json tsconfig.json next.config.ts postcss.config.mjs tailwind.config.ts vitest.config.ts src/app/layout.tsx src/app/globals.css
git commit -m "chore: scaffold split intent app"
```

## Task 2: Add Types, Mock Data, And Math Tests

**Files:**
- Create: `src/types/intents.ts`
- Create: `src/lib/mockData.ts`
- Create: `src/lib/intentMath.ts`
- Create: `src/lib/intentMath.test.ts`
- Create: `src/test/setup.ts`

- [ ] **Step 1: Add test setup**

Create `src/test/setup.ts`:

```ts
import "@testing-library/jest-dom/vitest";
```

- [ ] **Step 2: Define domain types**

Create `src/types/intents.ts`:

```ts
export type IntentDataState = "loading" | "ready" | "fallback" | "empty" | "error";

export type PaymentStatus = "signed" | "delivered" | "settled";

export type SupportedChain = {
  id: number;
  name: string;
  key: string;
  logoUrl?: string;
};

export type SupportedRoute = {
  fromChainId: number;
  toChainId: number;
  fromToken: string;
  toToken: string;
};

export type Split = {
  title: string;
  courtFee: number;
  shuttleFee: number;
  participants: number;
  receiverChain: SupportedChain;
  receiverAsset: string;
};

export type Participant = {
  id: string;
  name: string;
  sourceChain: SupportedChain;
  amount: number;
  status: PaymentStatus;
};

export type IntentPreview = {
  sourceChain: SupportedChain;
  destinationChain: SupportedChain;
  sourceAsset: string;
  destinationAsset: string;
  amount: number;
  routeAvailable: boolean;
  dataState: IntentDataState;
  solverNote: string;
};
```

- [ ] **Step 3: Add mock data**

Create `src/lib/mockData.ts`:

```ts
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
```

- [ ] **Step 4: Write math tests**

Create `src/lib/intentMath.test.ts`:

```ts
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
```

- [ ] **Step 5: Run tests to verify failure**

Run: `npm test -- src/lib/intentMath.test.ts`

Expected: FAIL because `src/lib/intentMath.ts` does not exist yet.

- [ ] **Step 6: Implement math utilities**

Create `src/lib/intentMath.ts`:

```ts
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
```

- [ ] **Step 7: Run tests**

Run: `npm test -- src/lib/intentMath.test.ts`

Expected: PASS.

- [ ] **Step 8: Commit**

```bash
git add src/test/setup.ts src/types/intents.ts src/lib/mockData.ts src/lib/intentMath.ts src/lib/intentMath.test.ts
git commit -m "feat: add split intent domain model"
```

## Task 3: Add LI.FI Intents API Utility

**Files:**
- Create: `src/lib/lifiIntents.ts`
- Create: `src/lib/lifiIntents.test.ts`

- [ ] **Step 1: Write normalizer tests**

Create `src/lib/lifiIntents.test.ts`:

```ts
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
    ).toEqual([
      { fromChainId: 42161, toChainId: 8453, fromToken: "USDC", toToken: "USDC" }
    ]);
  });

  it("falls back when fetch fails", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockRejectedValue(new Error("network down"))
    );

    const data = await fetchIntentData();

    expect(data.state).toBe("fallback");
    expect(data.chains.length).toBe(FALLBACK_CHAINS.length);

    vi.unstubAllGlobals();
  });
});
```

- [ ] **Step 2: Run tests to verify failure**

Run: `npm test -- src/lib/lifiIntents.test.ts`

Expected: FAIL because `src/lib/lifiIntents.ts` does not exist yet.

- [ ] **Step 3: Implement API utility**

Create `src/lib/lifiIntents.ts`:

```ts
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
  return asArray(input)
    .map((item) => {
      if (!item || typeof item !== "object") return null;
      const record = item as Record<string, unknown>;
      const id = Number(record.id ?? record.chainId);
      const name = String(record.name ?? record.displayName ?? record.key ?? "");
      const key = String(record.key ?? record.name ?? id);
      const logoUrl = typeof record.logoURI === "string" ? record.logoURI : undefined;

      if (!Number.isFinite(id) || !name) return null;
      return { id, name, key: key.toLowerCase(), logoUrl };
    })
    .filter((chain): chain is SupportedChain => Boolean(chain));
}

export function normalizeRoutes(input: unknown): SupportedRoute[] {
  return asArray(input)
    .map((item) => {
      if (!item || typeof item !== "object") return null;
      const record = item as Record<string, unknown>;
      const fromChainId = Number(record.fromChainId ?? record.sourceChainId ?? record.fromChain);
      const toChainId = Number(record.toChainId ?? record.destinationChainId ?? record.toChain);
      const fromToken = String(record.fromToken ?? record.sourceToken ?? record.inputToken ?? "USDC");
      const toToken = String(record.toToken ?? record.destinationToken ?? record.outputToken ?? "USDC");

      if (!Number.isFinite(fromChainId) || !Number.isFinite(toChainId)) return null;
      return { fromChainId, toChainId, fromToken, toToken };
    })
    .filter((route): route is SupportedRoute => Boolean(route));
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
```

- [ ] **Step 4: Run tests**

Run: `npm test -- src/lib/lifiIntents.test.ts`

Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/lib/lifiIntents.ts src/lib/lifiIntents.test.ts
git commit -m "feat: add lifi intents data utility"
```

## Task 4: Build Shared UI Components

**Files:**
- Create: `src/components/PrimaryButton.tsx`
- Create: `src/components/ChainBadge.tsx`
- Create: `src/components/StatusTimeline.tsx`
- Create: `src/components/AppShell.tsx`
- Create: `src/components/StatusTimeline.test.tsx`

- [ ] **Step 1: Write status timeline render test**

Create `src/components/StatusTimeline.test.tsx`:

```tsx
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { StatusTimeline } from "@/components/StatusTimeline";

describe("StatusTimeline", () => {
  it("renders signed, delivered, and settled steps", () => {
    render(<StatusTimeline activeStatus="delivered" />);

    expect(screen.getByText("Signed")).toBeInTheDocument();
    expect(screen.getByText("Delivered")).toBeInTheDocument();
    expect(screen.getByText("Settled")).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run test to verify failure**

Run: `npm test -- src/components/StatusTimeline.test.tsx`

Expected: FAIL because the component does not exist yet.

- [ ] **Step 3: Implement shared components**

Create `src/components/PrimaryButton.tsx`:

```tsx
import type { ButtonHTMLAttributes, ReactNode } from "react";

type PrimaryButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode;
};

export function PrimaryButton({ children, className = "", ...props }: PrimaryButtonProps) {
  return (
    <button
      className={`w-full rounded-2xl bg-ink px-5 py-4 text-base font-semibold text-white shadow-soft transition active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
```

Create `src/components/ChainBadge.tsx`:

```tsx
import type { SupportedChain } from "@/types/intents";

export function ChainBadge({ chain }: { chain: SupportedChain }) {
  return (
    <span className="inline-flex items-center gap-2 rounded-full border border-ink/10 bg-white/70 px-3 py-1 text-sm font-medium text-ink">
      <span className="h-2 w-2 rounded-full bg-base" />
      {chain.name}
    </span>
  );
}
```

Create `src/components/StatusTimeline.tsx`:

```tsx
import { Check } from "lucide-react";
import type { PaymentStatus } from "@/types/intents";
import { getStatusLabel } from "@/lib/intentMath";

const STEPS: PaymentStatus[] = ["signed", "delivered", "settled"];

export function StatusTimeline({ activeStatus }: { activeStatus: PaymentStatus }) {
  const activeIndex = STEPS.indexOf(activeStatus);

  return (
    <div className="grid grid-cols-3 gap-2">
      {STEPS.map((step, index) => {
        const isDone = index <= activeIndex;
        return (
          <div key={step} className="rounded-2xl border border-ink/10 bg-white/70 p-3 text-center">
            <div className={`mx-auto mb-2 flex h-7 w-7 items-center justify-center rounded-full ${isDone ? "bg-court text-white" : "bg-ink/10 text-ink/40"}`}>
              <Check size={15} />
            </div>
            <div className="text-xs font-semibold text-ink">{getStatusLabel(step)}</div>
          </div>
        );
      })}
    </div>
  );
}
```

Create `src/components/AppShell.tsx`:

```tsx
import type { ReactNode } from "react";

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <main className="flex min-h-screen items-center justify-center px-4 py-6">
      <div className="min-h-[760px] w-full max-w-[430px] overflow-hidden rounded-[2rem] border border-ink/10 bg-paper/90 shadow-soft backdrop-blur">
        {children}
      </div>
    </main>
  );
}
```

- [ ] **Step 4: Run component test**

Run: `npm test -- src/components/StatusTimeline.test.tsx`

Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/components/PrimaryButton.tsx src/components/ChainBadge.tsx src/components/StatusTimeline.tsx src/components/AppShell.tsx src/components/StatusTimeline.test.tsx
git commit -m "feat: add shared payment UI components"
```

## Task 5: Build The 3-Screen Flow

**Files:**
- Create: `src/components/CreateSplitScreen.tsx`
- Create: `src/components/PayShareScreen.tsx`
- Create: `src/components/SettledScreen.tsx`
- Modify: `src/app/page.tsx`
- Create: `src/app/page.test.tsx`

- [ ] **Step 1: Write app flow smoke test**

Create `src/app/page.test.tsx`:

```tsx
import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import Page from "@/app/page";

describe("Split Intent app", () => {
  it("moves from create to pay to settled", async () => {
    render(<Page />);

    expect(screen.getByText("Split Intent")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: /create intent split/i }));
    expect(await screen.findByText(/Pay from/i)).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: /pay my share/i }));
    expect(await screen.findByText(/One receiver outcome/i)).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run test to verify failure**

Run: `npm test -- src/app/page.test.tsx`

Expected: FAIL because `src/app/page.tsx` and screen components do not exist yet.

- [ ] **Step 3: Implement create screen**

Create `src/components/CreateSplitScreen.tsx`:

```tsx
import { ArrowRight, CircleDollarSign } from "lucide-react";
import { PrimaryButton } from "@/components/PrimaryButton";
import { getShareAmount, getSplitTotal, formatUsd } from "@/lib/intentMath";
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
          Participants can pay from different chains. You define the result: receive {split.receiverAsset} on {split.receiverChain.name}.
        </p>
      </div>

      <div className="space-y-4">
        <div className="rounded-3xl bg-white/75 p-5">
          <div className="flex justify-between text-sm text-ink/60"><span>Court fee</span><span>{formatUsd(split.courtFee)}</span></div>
          <div className="mt-3 flex justify-between text-sm text-ink/60"><span>Shuttles</span><span>{formatUsd(split.shuttleFee)}</span></div>
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
          <span className="inline-flex items-center justify-center gap-2">Create intent split <ArrowRight size={18} /></span>
        </PrimaryButton>
      </div>
    </section>
  );
}
```

- [ ] **Step 4: Implement pay and settled screens**

Create `src/components/PayShareScreen.tsx`:

```tsx
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
            <p className="mt-2 text-lg font-semibold">Deliver {split.receiverAsset} on {split.receiverChain.name}</p>
          </div>
          <p className="mt-4 text-xs font-semibold uppercase tracking-[0.16em] text-court">LI.FI Intents data: {dataState}</p>
        </div>
        <PrimaryButton onClick={onContinue}>Pay my share</PrimaryButton>
      </div>
    </section>
  );
}
```

Create `src/components/SettledScreen.tsx`:

```tsx
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
          Different source chains came in. The organizer receives {formatUsd(getSplitTotal(split))} in {split.receiverAsset} on {split.receiverChain.name}.
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
              <div className="mb-3 flex items-center justify-between">
                <div>
                  <p className="font-bold text-ink">{participant.name}</p>
                  <p className="text-sm text-ink/50">{formatUsd(participant.amount)} from {participant.sourceChain.name}</p>
                </div>
                <ChainBadge chain={participant.sourceChain} />
              </div>
              <StatusTimeline activeStatus={participant.status} />
            </div>
          ))}
        </div>
        <PrimaryButton onClick={onReset}>
          <span className="inline-flex items-center justify-center gap-2"><RefreshCcw size={18} /> Create another split</span>
        </PrimaryButton>
      </div>
    </section>
  );
}
```

- [ ] **Step 5: Wire the app page**

Create `src/app/page.tsx`:

```tsx
"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { AppShell } from "@/components/AppShell";
import { CreateSplitScreen } from "@/components/CreateSplitScreen";
import { PayShareScreen } from "@/components/PayShareScreen";
import { SettledScreen } from "@/components/SettledScreen";
import { DEFAULT_PARTICIPANTS, DEFAULT_SPLIT, FALLBACK_CHAINS } from "@/lib/mockData";
import { fetchIntentData } from "@/lib/lifiIntents";
import type { IntentDataState } from "@/types/intents";

type Screen = "create" | "pay" | "settled";

export default function Page() {
  const [screen, setScreen] = useState<Screen>("create");
  const [dataState, setDataState] = useState<IntentDataState>("loading");
  const [message, setMessage] = useState("Loading LI.FI Intents route data...");

  useEffect(() => {
    let mounted = true;

    fetchIntentData().then((data) => {
      if (!mounted) return;
      setDataState(data.state);
      setMessage(data.message);
    });

    return () => {
      mounted = false;
    };
  }, []);

  const sourceChain = FALLBACK_CHAINS[1];

  return (
    <AppShell>
      <AnimatePresence mode="wait">
        <motion.div
          key={screen}
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -18 }}
          transition={{ duration: 0.28, ease: "easeOut" }}
        >
          {screen === "create" && <CreateSplitScreen split={DEFAULT_SPLIT} onContinue={() => setScreen("pay")} />}
          {screen === "pay" && (
            <PayShareScreen
              split={DEFAULT_SPLIT}
              sourceChain={sourceChain}
              dataState={dataState}
              message={message}
              onContinue={() => setScreen("settled")}
            />
          )}
          {screen === "settled" && (
            <SettledScreen split={DEFAULT_SPLIT} participants={DEFAULT_PARTICIPANTS} onReset={() => setScreen("create")} />
          )}
        </motion.div>
      </AnimatePresence>
    </AppShell>
  );
}
```

- [ ] **Step 6: Run flow test**

Run: `npm test -- src/app/page.test.tsx`

Expected: PASS.

- [ ] **Step 7: Commit**

```bash
git add src/components/CreateSplitScreen.tsx src/components/PayShareScreen.tsx src/components/SettledScreen.tsx src/app/page.tsx src/app/page.test.tsx
git commit -m "feat: build split intent flow"
```

## Task 6: Add Submission Documents

**Files:**
- Create: `README.md`
- Create: `docs/project-description.md`
- Create: `docs/api-feedback.md`
- Create: `docs/x-post-draft.md`
- Create: `docs/final-submission-checklist.md`

- [ ] **Step 1: Create README**

Create `README.md`:

```md
# Split Intent

Split Intent is a mobile-first LI.FI Intents prototype for shared payments.

The demo uses a badminton cost split as the concrete scenario: participants can pay from different source chains, while the organizer defines one final receiver outcome: USDC on Base.

## Why it exists

Most cross-chain products make users think in routes. Split Intent starts with the outcome:

> Different chains in. One receiver outcome out.

## LI.FI Intents usage

- Reads supported chains from `https://order.li.fi/chains/supported`
- Reads supported routes from `https://order.li.fi/routes`
- Normalizes live data into a consumer payment UI
- Uses a mocked settlement lifecycle for demo safety

## Local development

```bash
npm install
npm run dev
```

## Verification

```bash
npm test
npm run build
```

## Demo scope

This is a challenge prototype. It does not submit real orders or move live funds yet. The next step is connecting quote request, wallet signing, and order submission.
```

- [ ] **Step 2: Create project description**

Create `docs/project-description.md`:

```md
# Project Description

## Split Intent

Split Intent is a mobile-first prototype built for the LI.FI Intents Mini Builder Challenge.

It demonstrates a simple shared payment flow: participants can pay from different chains, while the organizer only defines the final desired outcome. In the demo, a badminton organizer collects court and shuttle costs and wants to receive USDC on Base.

The product is designed to explain the core Intents idea in consumer language:

> Users express the result. Solvers handle the path.

## What it does

- Creates a shared payment request
- Calculates the per-person amount
- Lets a participant pay from a source chain
- Shows the receiver outcome on Base USDC
- Loads real LI.FI Intents supported chain and route data
- Simulates signed, delivered, and settled states for demo reliability

## Why it matters

Cross-chain payments are still usually explained as routes, bridges, assets, and chain choices. Split Intent reframes the experience around the receiver's desired outcome. This makes Intents easier to understand for normal payment scenarios.
```

- [ ] **Step 3: Create API feedback**

Create `docs/api-feedback.md`:

```md
# LI.FI Intents API Feedback

## What worked well

- The Intents API documentation clearly explains the integrator flow: request quotes, submit orders, and track status.
- The public endpoints requiring no API key are helpful for hackathon prototyping.
- `GET /chains/supported` and `GET /routes` are useful for grounding a demo in live network capability.
- The lifecycle language around signed, delivered, and settled is easy to translate into user-facing status.

## What was harder

- Route data still needs a product translation layer before it feels natural in a consumer payment UI.
- It would be helpful to have example payloads optimized for common payment stories such as stablecoin settlement.
- A lightweight demo mode or sandbox recipe for quote preview would make builder onboarding faster.

## Feature request

A consumer-friendly route summary endpoint would be useful. For example: source chain, destination chain, stablecoin support, estimated delivery behavior, and whether the route is recommended for payments.
```

- [ ] **Step 4: Create X / Scribble draft**

Create `docs/x-post-draft.md`:

```md
# X / Scribble Draft

## Chinese

我做了一个 LI.FI Intents 小项目：Split Intent。

它用羽毛球 AA 收款作为场景：参与者可以从不同链付款，组织者只定义最终想收到的结果，比如 Base 上的 USDC。

核心是：
不同链付款，一个最终收款 outcome。

Demo: add final video link after recording
App: add deployed app link after deployment
Code: add GitHub repository link after publishing

## English

I built Split Intent with LI.FI Intents.

Participants can pay from different chains, while the organizer defines one final receiver outcome: USDC on Base.

Different chains in. One outcome out.

Demo: add final video link after recording
App: add deployed app link after deployment
Code: add GitHub repository link after publishing
```

- [ ] **Step 5: Create checklist**

Create `docs/final-submission-checklist.md`:

```md
# Final Submission Checklist

## Links

- App URL: add deployed app link after deployment
- GitHub repo: add GitHub repository link after publishing
- Demo video: add final video link after recording
- X / Scribble post: add public post link after posting

## Before posting

- Run `npm test`
- Run `npm run build`
- Open the app on mobile width
- Confirm the LI.FI Intents data badge loads as ready or fallback
- Confirm Create Split -> Pay My Share -> Settled flow works

## Submission copy

Project name: Split Intent

Short description:
Split Intent lets participants pay from different chains while the organizer defines one final receiver outcome, using LI.FI Intents data to ground the route capability.

API usage:
The app reads LI.FI Intents supported chains and routes from public endpoints, normalizes them for a consumer payment flow, and uses a mocked settlement lifecycle for demo safety.
```

- [ ] **Step 6: Commit**

```bash
git add README.md docs/project-description.md docs/api-feedback.md docs/x-post-draft.md docs/final-submission-checklist.md
git commit -m "docs: add split intent submission packet"
```

## Task 7: Add Demo Script And Bilingual Subtitle Draft

**Files:**
- Create: `docs/demo-script-zh.md`
- Create: `docs/demo-subtitles-bilingual.md`
- Create: `demo/README.md`

- [ ] **Step 1: Create Chinese narration script**

Create `docs/demo-script-zh.md` with a 4-minute structure:

```md
# Split Intent Demo Script

## 0:00-0:30 Opening
Split Intent 展示的是一个很简单的 Intents 场景：参与者可以从不同链付款，但收款人只需要定义最终想收到什么。

## 0:30-1:15 Scenario
这里用羽毛球场地和球费 AA 作为背景。组织者创建一次收款，目标是最终在 Base 收到 USDC。

## 1:15-2:15 Product Flow
第一屏创建 split，第二屏参与者选择来源链并看到 intent preview，第三屏展示不同来源链最终汇总到同一个 Base USDC outcome。

## 2:15-3:20 LI.FI Intents
LI.FI Intents 的核心是表达结果，而不是指定路径。App 使用 Intents supported chains 和 routes 数据来证明这个 flow 对接真实网络能力。

## 3:20-4:00 Demo Boundary
当前版本为了演示稳定性，quote 和 settlement 使用 preview lifecycle。下一步可以接入真实 quote、签名和 order submission。
```

- [ ] **Step 2: Create bilingual subtitle draft**

Create `docs/demo-subtitles-bilingual.md`:

```md
# Demo Subtitles

## 0:00-0:30

中文：Split Intent 展示的是一个很简单的 Intents 场景：参与者可以从不同链付款，但收款人只定义最终想收到什么。

English: Split Intent shows a simple Intents flow: participants can pay from different chains, while the receiver defines the final outcome.

## 0:30-1:15

中文：这里用羽毛球场地和球费 AA 作为背景。组织者创建一次收款，目标是最终在 Base 收到 USDC。

English: The demo uses a badminton cost split. The organizer creates one collection request and wants to receive USDC on Base.

## 1:15-2:15

中文：第一屏创建 split，第二屏参与者选择来源链并看到 intent preview，第三屏展示不同来源链最终汇总到同一个 Base USDC outcome。

English: The first screen creates the split, the second previews payment from a source chain, and the third shows many chains converging into one Base USDC outcome.

## 2:15-3:20

中文：LI.FI Intents 的核心是表达结果，而不是指定路径。这个 app 使用 supported chains 和 routes 数据来证明 flow 对接真实网络能力。

English: LI.FI Intents are about expressing outcomes, not manually choosing paths. This app uses supported chains and routes data to ground the flow in live network capability.

## 3:20-4:00

中文：当前版本为了演示稳定性，quote 和 settlement 使用 preview lifecycle。下一步可以接入真实 quote、签名和 order submission。

English: For demo reliability, quote and settlement are shown as a preview lifecycle. The next step is real quotes, wallet signing, and order submission.
```

- [ ] **Step 3: Add demo folder note**

Create `demo/README.md`:

```md
# Demo Assets

Store final demo videos in this folder.

Recommended filename:

`split-intent-demo.mp4`

The narration script lives at `docs/demo-script-zh.md`.
The bilingual subtitle draft lives at `docs/demo-subtitles-bilingual.md`.
```

- [ ] **Step 4: Commit**

```bash
git add docs/demo-script-zh.md docs/demo-subtitles-bilingual.md demo/README.md
git commit -m "docs: add demo script and bilingual subtitles"
```

## Task 8: Final Verification And Local Demo

**Files:**
- Modify only if verification reveals a specific issue.

- [ ] **Step 1: Run tests**

Run: `npm test`

Expected: all tests pass.

- [ ] **Step 2: Run build**

Run: `npm run build`

Expected: production build completes.

- [ ] **Step 3: Start dev server**

Run: `npm run dev -- --port 3001`

Expected: app is available at `http://localhost:3001`.

- [ ] **Step 4: Inspect mobile UI**

Use browser or Playwright to verify:

- Create screen fits mobile viewport.
- Pay screen shows source chain to Base USDC outcome.
- Settled screen shows different source chains converging into one result.
- No visible text overlaps.

- [ ] **Step 5: Commit final fixes**

If fixes were needed:

```bash
git add .
git commit -m "fix: polish split intent demo"
```

If no fixes were needed, do not create an empty commit.
