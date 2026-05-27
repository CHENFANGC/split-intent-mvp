# Split Intent Design Spec

## Project Summary

Split Intent is a mobile-first prototype for the LI.FI Intents Mini Builder Challenge. It uses a badminton cost-sharing scenario as the concrete background: an organizer creates one collection intent for court and shuttle costs, participants can pay from different source chains, and the organizer only defines the desired final outcome.

The product message is:

> Participants pay from different chains. The organizer receives one final asset on one destination chain.

The app should make LI.FI Intents understandable without turning the experience into a routing dashboard. The user-facing story is not that collecting money is hard; the story is that the receiver can express the final result and let solver execution handle the path.

## Official Grounding

The implementation should use the LI.FI Intents documentation and public endpoints as the source of truth where possible.

- Product site: https://li.fi/intents
- Intents API overview: https://docs.li.fi/lifi-intents/intents-api/api-overview
- Solver / marketplace introduction: https://docs.li.fi/lifi-intents/introduction

Important source facts for the prototype:

- The Intents API is the integrator-facing interface for requesting quotes, submitting orders, and tracking status.
- The API overview says endpoints are open and require no API key.
- The production order server is `https://order.li.fi`; the development environment is `https://order-dev.li.fi`.
- Useful public endpoints include supported chains and supported routes.
- The order lifecycle can be presented as signed, delivered, and settled.
- The solver marketplace model lets users specify desired outcomes while solver inventory handles same-chain or cross-chain delivery.

## Target User And Scenario

The main user is a badminton organizer collecting a shared payment from several participants.

Default demo setup:

- Event: Wednesday badminton session
- Cost categories: court fee and shuttle fee
- Participants: 6
- Total amount: 126 USDC
- Share per person: 21 USDC
- Receiver outcome: receive USDC on Base
- Example payer source chains: Arbitrum, Optimism, Polygon, Ethereum

The scenario is intentionally familiar, but the product should not over-index on badminton. Badminton is a demonstration context for a broader pattern: many payers, many chains, one final receiver outcome.

## Product Flow

The app should have three primary screens.

### 1. Create Split

The organizer creates a payment request.

Required content:

- Product name: Split Intent
- Event title, defaulting to a badminton session
- Cost inputs for court fee and shuttle fee
- Participant count
- Computed total and per-person share
- Destination chain and asset, defaulting to Base USDC
- A concise explanation of the receiver outcome
- Primary CTA: Create intent split

The screen should feel like a simple consumer payment product, not a DeFi configuration form.

### 2. Pay My Share

A participant chooses or sees their source chain and previews the intent.

Required content:

- Amount due
- Source chain options using supported route data where possible
- Destination outcome: receiver gets USDC on Base
- Intent preview showing input, output, solver path, and settlement status
- Real data indicator when supported chains or routes loaded from LI.FI Intents
- Mock fallback indicator if endpoint data is unavailable
- Primary CTA: Pay my share

This screen should explain the key Intents idea in the UI: the payer does not need to understand the route; the receiver outcome is fixed.

### 3. Settled

The app shows the collection outcome.

Required content:

- Total received on the destination chain
- Participant rows with different source chains
- Status progression for each payment: signed, delivered, settled
- A short final line: different chains in, one outcome out
- Primary CTA: Create another split

Submission demo should make this screen the payoff: multiple source chains collapse into one final receiver result.

## Technical Scope

Use a small, polished frontend stack:

- Next.js
- TypeScript
- Tailwind CSS
- Framer Motion
- Reusable components
- Mobile-first layout

The app should use real LI.FI Intents data where it is safe and reliable:

- Fetch supported chains from `https://order.li.fi/chains/supported`
- Fetch supported routes from `https://order.li.fi/routes`
- Normalize responses defensively because endpoint shapes may evolve
- Show loading, success, fallback, and empty states

Quote and order submission should be implemented as a believable preview first. If request quote parameters are easy to verify during implementation, the app may add a real quote preview. Full signing, live order submission, and real settlement are out of scope for the first version because the demo must be stable and should not require live funds.

## Data Model

Core local models:

- `Split`: event title, court fee, shuttle fee, participants, total, share amount, receiver chain, receiver asset
- `Participant`: name, source chain, amount, status
- `IntentPreview`: source chain, destination chain, source asset, destination asset, amount, route availability, solver note
- `IntentDataState`: loading, ready, fallback, empty, error

Mock data should be realistic and should clearly align with the badminton split story.

## UI Direction

The design should feel like a modern payments app:

- Mobile-first
- Clean, bright, and confident
- Not a dark DeFi dashboard by default
- Clear chain badges and payment status
- Familiar payment controls
- Minimal jargon
- Motion should support state transitions, not distract from the payment story

Recommended tone:

- Practical
- Light
- Friendly
- Trustworthy

The app can use badminton context visually, but it should avoid looking like a sports app. It is a payment and settlement product.

## Error Handling And Fallbacks

The app should remain demo-ready even if LI.FI Intents endpoints fail.

States to support:

- `loading`: endpoint calls are in progress
- `ready`: live Intents data is available
- `fallback`: app uses curated fallback chains/routes
- `empty`: endpoint responds but no usable chains/routes are found
- `error`: endpoint failed and fallback is shown with a small explanation

Fallback copy should be honest and non-alarming. It should say the app is using a demo route snapshot, while the product flow remains visible.

## Demo Video And Submission Package

The final project should include a submission package:

- README
- Short project description
- X / Scribble post draft
- API usage feedback
- Final checklist
- Demo script
- Bilingual subtitle script
- Final submission packet

The demo video target is about 4 minutes.

Video requirements:

- Chinese voiceover script
- Chinese and English subtitles
- Clear explanation that participants can pay from different source chains
- Clear explanation that the receiver defines the final desired chain and asset
- Show the 3-screen flow
- Explain which parts use real LI.FI Intents data and which parts are mocked for safety

## Success Criteria

The project is successful if:

- A viewer understands the Intents concept within 20 seconds.
- The app demonstrates multiple source chains converging into one receiver outcome.
- At least one part of the product uses real LI.FI Intents API data.
- The flow feels like a consumer payment product rather than a DeFi dashboard.
- The repo contains enough submission materials for the user to post and submit quickly.
- The demo remains reliable even if live endpoint behavior changes.

## Out Of Scope For First Version

- Real wallet signing
- Real order submission with funds
- Solver operator integration
- Persistent backend
- User accounts
- Full payment link sharing
- Production payment compliance handling

