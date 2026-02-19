import Link from 'next/link';

const steps = [
  { 
    title: '1. Upload', 
    icon: '📥',
    text: 'Upload data from berbagai sumber dengan cara yang simpel: drag-and-drop atau pilih file.',
    details: 'Mendukung PDF, Excel (XLS/XLSX), CSV, JSON, SATUSEHAT, BPJS, SIMRS lokal, dan Google Sheets.'
  },
  { 
    title: '2. Normalize', 
    icon: '🔄',
    text: 'Deterministic rules map BP/Tensi, ICD/free-text diagnoses, meds, and allergy terms.',
    details: 'Automatic field mapping with confidence scoring for every transformation.'
  },
  { 
    title: '3. Merge', 
    icon: '🔀',
    text: 'Canonical patient profile and longitudinal timeline are assembled across settings.',
    details: 'Unified timeline view spanning multiple healthcare facilities.'
  },
  { 
    title: '4. Conflicts', 
    icon: '⚖️',
    text: 'Disagreements are detected (allergy/med/diagnosis) with clinician-friendly reconciliation.',
    details: 'Visual conflict resolution with system recommendations and audit trail.'
  },
  { 
    title: '5. Export', 
    icon: '📤',
    text: 'Every run, resolution, and export event is logged for traceability and trust.',
    details: 'Complete referral packets with full provenance information.'
  }
];

export default function HowItWorksPage() {
  return (
    <div className="space-y-8">
      <section className="card bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
        <h1 className="text-2xl font-bold">📖 How RecordBridge Works</h1>
        <p className="mt-2 text-blue-100">Alur kerja dibuat sesederhana mungkin: upload → rapikan → gabungkan → cek konflik → export.</p>
        <div className="mt-4 flex gap-3">
          <Link href="/demo" className="rounded-lg bg-white px-4 py-2 text-sm font-semibold text-blue-700">🚀 Try Demo</Link>
        </div>
      </section>

      <section className="card border border-blue-100 bg-blue-50/60">
        <h2 className="text-lg font-semibold text-blue-900">🧾 Format Upload Fleksibel</h2>
        <p className="mt-2 text-sm text-blue-800">
          Supaya onboarding data lebih simpel, tim cukup upload file dari format yang sudah ada tanpa perlu ubah struktur manual dulu.
        </p>
        <div className="mt-4 flex flex-wrap gap-2 text-xs font-medium">
          {['PDF', 'Excel', 'CSV', 'JSON', 'Google Sheets', 'SATUSEHAT/BPJS API'].map((format) => (
            <span key={format} className="rounded-full border border-blue-200 bg-white px-3 py-1 text-blue-700">
              {format}
            </span>
          ))}
        </div>
      </section>

      {/* Pipeline Steps */}
      <section className="card">
        <h2 className="mb-6 text-xl font-bold">🔄 Data Processing Pipeline</h2>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-5">
          {steps.map((step, i) => (
            <div key={step.title} className="relative rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition-all hover:shadow-md">
              <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-xl">
                {step.icon}
              </div>
              <p className="text-xs font-semibold uppercase text-blue-600">Step {i + 1}</p>
              <h3 className="text-lg font-semibold text-slate-800">{step.title}</h3>
              <p className="mt-2 text-sm text-slate-600">{step.text}</p>
              <p className="mt-2 text-xs text-slate-500">{step.details}</p>
              {i < steps.length - 1 && (
                <div className="absolute -right-4 top-1/2 hidden -translate-y-1/2 text-2xl text-slate-300 lg:block">→</div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Technical Details */}
      <section className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <div className="card">
          <h3 className="mb-4 text-lg font-semibold">🔧 Technical Implementation</h3>
          <div className="space-y-3 text-sm text-slate-600">
            <div className="flex items-start gap-3 rounded-lg bg-slate-50 p-3">
              <span className="text-xl">📊</span>
              <div>
                <p className="font-medium text-slate-800">Deterministic Mapping Engine</p>
                <p className="text-xs">Rule-based translation without AI dependency. 100% reproducible results.</p>
              </div>
            </div>
            <div className="flex items-start gap-3 rounded-lg bg-slate-50 p-3">
              <span className="text-xl">🏷️</span>
              <div>
                <p className="font-medium text-slate-800">Confidence Scoring</p>
                <p className="text-xs">Every mapping has confidence score based on dictionary/code matches.</p>
              </div>
            </div>
            <div className="flex items-start gap-3 rounded-lg bg-slate-50 p-3">
              <span className="text-xl">🔒</span>
              <div>
                <p className="font-medium text-slate-800">Provenance Tracking</p>
                <p className="text-xs">Full audit trail from source system to canonical record.</p>
              </div>
            </div>
          </div>
        </div>

        <div className="card">
          <h3 className="mb-4 text-lg font-semibold">🏥 Indonesia Healthcare Integration</h3>
          <div className="space-y-3 text-sm text-slate-600">
            <div className="flex items-start gap-3 rounded-lg bg-emerald-50 p-3">
              <span className="text-xl">🏥</span>
              <div>
                <p className="font-medium text-slate-800">SATUSEHAT Ready</p>
                <p className="text-xs">Compatible with Kemenkes Indonesia health data exchange standard.</p>
              </div>
            </div>
            <div className="flex items-start gap-3 rounded-lg bg-emerald-50 p-3">
              <span className="text-xl">🛡️</span>
              <div>
                <p className="font-medium text-slate-800">BPJS Integration</p>
                <p className="text-xs">Seamless integration with BPJS Kesehatan data systems.</p>
              </div>
            </div>
            <div className="flex items-start gap-3 rounded-lg bg-emerald-50 p-3">
              <span className="text-xl">🎖️</span>
              <div>
                <p className="font-medium text-slate-800">Military Healthcare</p>
                <p className="text-xs">Designed for multi-facility military health networks.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Limitations */}
      <section className="card border-l-4 border-amber-400">
        <h2 className="text-lg font-semibold">⚠️ Limitations & Disclaimer</h2>
        <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-slate-600">
          <li>This is a demo with mock data and deterministic rules; it is <strong>not</strong> a production clinical decision system.</li>
          <li>Not medical advice and not a medical device per FDA/Indonesia Kemenkes regulations.</li>
          <li>Real-world deployments need clinical validation, privacy/security controls, and regulatory review.</li>
          <li>Data encryption, role-based access, and compliance audits required for production use.</li>
        </ul>
      </section>

      {/* CTA */}
      <section className="card bg-gradient-to-br from-slate-800 to-slate-900 text-white">
        <div className="text-center">
          <h2 className="text-xl font-bold">Siap mencoba RecordBridge?</h2>
          <p className="mt-2 text-slate-300">Coba demo interaktif untuk melihat fitur-fitur dalam aksi.</p>
          <Link href="/demo" className="mt-4 inline-block rounded-xl bg-blue-500 px-6 py-3 font-semibold hover:bg-blue-600 transition-colors">
            🚀 Buka Demo Sekarang
          </Link>
        </div>
      </section>
    </div>
  );
}
