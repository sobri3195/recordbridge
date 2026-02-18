# RecordBridge Demo

Production-quality demo web app for a **schema-less EHR/SIMRS translator** that showcases:
- heterogeneous ingestion,
- deterministic normalization,
- unified canonical record/timeline,
- conflict reconciliation with audit logs,
- referral packet export.

## Feature Design Documents

This repository includes comprehensive design documents for 10 planned features in the `/docs/features` directory:

1. **[Smart Import Wizard](./docs/features/01-smart-import-wizard.md)** - CSV/JSON/Excel import with auto-detection
2. **[AI Mapping Assistant](./docs/features/02-ai-mapping-assistant.md)** - AI-powered field mapping with confidence scores
3. **[Quality Gate & Rules Engine](./docs/features/03-quality-gate-rules-engine.md)** - Rule-based data validation
4. **[Conflict Resolution Center](./docs/features/04-conflict-resolution-center.md)** - Multi-source conflict management
5. **[Template & Reusable Pipeline](./docs/features/05-template-reusable-pipeline.md)** - Save and reuse pipeline configurations
6. **[Real-time Collaboration](./docs/features/06-realtime-collaboration.md)** - Multi-user editing with presence indicators
7. **[Audit Trail & Compliance Dashboard](./docs/features/07-audit-trail-compliance.md)** - Full audit logging and compliance reporting
8. **[Monitoring & Alerting](./docs/features/08-monitoring-alerting.md)** - System health monitoring and alerts
9. **[Guided Onboarding UX](./docs/features/09-guided-onboarding-ux.md)** - Interactive user onboarding experience
10. **[Insight & Recommendation Panel](./docs/features/10-insight-recommendation-panel.md)** - AI-driven optimization recommendations

See [Feature Design Index](./docs/features/README.md) for complete overview.

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
