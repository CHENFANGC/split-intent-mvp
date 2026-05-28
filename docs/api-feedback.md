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

