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
pnpm install
pnpm dev
```

## Verification

```bash
pnpm test
pnpm build
```

## Demo scope

This is a challenge prototype. It does not submit real orders or move live funds yet. The next step is connecting quote request, wallet signing, and order submission.

