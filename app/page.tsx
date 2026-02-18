import Link from 'next/link';

const features = [
  {
    id: 'mapping',
    title: 'Instant Schema-less Mapping (Zero Setup)',
    desc: 'Auto-map fields like BP/Tensi and normalize units instantly—no waiting for perfect standards.'
  },
  {
    id: 'timeline',
    title: 'Unified Longitudinal Timeline (Across Settings)',
    desc: 'Merge encounters, labs, meds, diagnoses into one chronological story across facilities.'
  },
  {
    id: 'conflicts',
    title: 'Conflict Detection + One-click Reconciliation',
    desc: 'Surface contradictions and resolve with a clinician-friendly workflow and audit trail.'
  },
  {
    id: 'provenance',
    title: 'Provenance, Trust, and Auditability',
    desc: 'Every datapoint is traceable: source system, timestamp, mapping confidence, and audit history.'
  },
  {
    id: 'export',
    title: 'Referral Packet / Handover Export',
    desc: 'Generate a clean referral summary for transitions of care in seconds.'
  }
];

export default function Home() {
  return (
    <div className="space-y-8">
      <section className="rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 p-8 text-white">
        <h1 className="text-3xl font-bold">Connect any EHR. Translate schema-less. Get a unified patient record.</h1>
        <p className="mt-3 max-w-3xl text-blue-100">Production-style demo for stakeholders: deterministic AI-like mapping, conflict handling, provenance, and referral export.</p>
        <div className="mt-5 flex gap-3">
          <Link href="/demo" className="rounded-lg bg-white px-4 py-2 text-sm font-semibold text-blue-700">Open Demo</Link>
          <Link href="/how-it-works" className="rounded-lg border border-white/40 px-4 py-2 text-sm font-semibold">How it works</Link>
        </div>
      </section>

      <section className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        {features.map((f) => (
          <article key={f.id} className="card">
            <h2 className="text-base font-semibold">{f.title}</h2>
            <p className="mt-2 text-sm text-slate-600">{f.desc}</p>
            <Link href={`/demo#${f.id}`} className="mt-3 inline-block text-sm text-blue-600">See it in demo →</Link>
          </article>
        ))}
      </section>
    </div>
  );
}
