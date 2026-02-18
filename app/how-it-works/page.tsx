const steps = [
  { title: 'Ingest', text: 'Pull records from EHR A, SIMRS B, and Clinic C with heterogeneous schemas.' },
  { title: 'Normalize', text: 'Deterministic rules map BP/Tensi, ICD/free-text diagnoses, meds, and allergy terms.' },
  { title: 'Merge', text: 'Canonical patient profile and longitudinal timeline are assembled across settings.' },
  { title: 'Conflicts', text: 'Disagreements are detected (allergy/med/diagnosis) with clinician-friendly reconciliation.' },
  { title: 'Audit', text: 'Every run, resolution, and export event is logged for traceability and trust.' }
];

export default function HowItWorksPage() {
  return (
    <div className="space-y-6">
      <section className="card">
        <h1 className="text-2xl font-bold">How it works</h1>
        <p className="mt-2 text-sm text-slate-600">Pipeline overview for non-technical stakeholders.</p>
      </section>

      <section className="grid grid-cols-1 gap-3 md:grid-cols-5">
        {steps.map((step, i) => (
          <div key={step.title} className="card relative">
            <p className="text-xs font-semibold uppercase text-blue-600">Step {i + 1}</p>
            <h2 className="text-lg font-semibold">{step.title}</h2>
            <p className="text-sm text-slate-600">{step.text}</p>
          </div>
        ))}
      </section>

      <section className="card">
        <h2 className="text-lg font-semibold">Limitations & Disclaimer</h2>
        <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-slate-600">
          <li>This is a demo with mock data and deterministic rules; it is not a production clinical decision system.</li>
          <li>Not medical advice and not a medical device.</li>
          <li>Real-world deployments need clinical validation, privacy/security controls, and regulatory review.</li>
        </ul>
      </section>
    </div>
  );
}
