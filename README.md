# RecordBridge Demo

Production-quality demo web app for a **schema-less EHR/SIMRS translator** that showcases:
- heterogeneous ingestion,
- deterministic normalization,
- unified canonical record/timeline,
- conflict reconciliation with audit logs,
- referral packet export.

## Tech Stack
- Next.js 14 (App Router)
- React + TypeScript
- TailwindCSS
- Vercel-ready (no env vars required)

## Local Setup
```bash
npm install
npm run dev
```
Open http://localhost:3000.

## Deploy to Vercel
1. Push this repository to GitHub.
2. Import the repo in Vercel.
3. Keep default framework settings (Next.js).
4. Deploy (no environment variables required).

## Routes
- `/` landing + feature cards
- `/demo` interactive translator demo
- `/how-it-works` pipeline and disclaimer

## Disclaimer
This demo is for product illustration only. It is **not medical advice**, not a clinical decision support tool, and not a medical device.
