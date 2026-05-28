# Final Submission Checklist

## Links

- App URL: add deployed app link after deployment
- GitHub repo: add GitHub repository link after publishing
- Demo video: add final video link after recording
- X / Scribble post: add public post link after posting

## Before posting

- Run `pnpm test`
- Run `pnpm build`
- Open the app on mobile width
- Confirm the LI.FI Intents data badge loads as ready or fallback
- Confirm Create Split -> Pay My Share -> Settled flow works

## Submission copy

Project name: Split Intent

Short description:
Split Intent lets participants pay from different chains while the organizer defines one final receiver outcome, using LI.FI Intents data to ground the route capability.

API usage:
The app reads LI.FI Intents supported chains and routes from public endpoints, normalizes them for a consumer payment flow, and uses a mocked settlement lifecycle for demo safety.

