import Link from 'next/link';

const features = [
  {
    id: 'mapping',
    icon: '🔄',
    title: 'Instant Schema-less Mapping (Zero Setup)',
    desc: 'Auto-map fields like BP/Tensi and normalize units instantly—no waiting for perfect standards.'
  },
  {
    id: 'timeline',
    icon: '🗓️',
    title: 'Unified Longitudinal Timeline (Across Settings)',
    desc: 'Merge encounters, labs, meds, diagnoses into one chronological story across facilities.'
  },
  {
    id: 'conflicts',
    icon: '⚖️',
    title: 'Conflict Detection + One-click Reconciliation',
    desc: 'Surface contradictions and resolve with a clinician-friendly workflow and audit trail.'
  },
  {
    id: 'provenance',
    icon: '📋',
    title: 'Provenance, Trust, and Auditability',
    desc: 'Every datapoint is traceable: source system, timestamp, mapping confidence, and audit history.'
  },
  {
    id: 'export',
    icon: '📤',
    title: 'Referral Packet / Handover Export',
    desc: 'Generate a clean referral summary for transitions of care in seconds.'
  }
];

const integrations = [
  { name: 'SATUSEHAT', desc: 'Kemenkes Indonesia Standard', icon: '🏥' },
  { name: 'BPJS Kesehatan', desc: 'BPJS Data Integration', icon: '🛡️' },
  { name: 'SIMRS Lokal', desc: 'Hospital Management System', icon: '💻' },
  { name: 'Excel/CSV', desc: 'Manual Data Import', icon: '📊' },
  { name: 'Google Sheets', desc: 'Cloud Spreadsheet Sync', icon: '📑' },
  { name: 'WhatsApp', desc: 'Referral Notifications', icon: '💬' }
];

const stakeholders = [
  { name: 'For Hospitals', icon: '🏥', desc: 'Unified patient records across departments', color: 'bg-blue-600' },
  { name: 'For Clinics', icon: '🏨', desc: 'Seamless referral workflow', color: 'bg-emerald-600' },
  { name: 'For Military Medical', icon: '🎖️', desc: 'Multi-facility military healthcare', color: 'bg-slate-700' },
  { name: 'For Developers', icon: '⚡', desc: 'API-first integration', color: 'bg-purple-600' }
];

const securityFeatures = [
  { icon: '🔒', title: 'End-to-End Encryption', desc: 'All data encrypted at rest and in transit' },
  { icon: '📝', title: 'Complete Audit Log', desc: 'Every action logged with timestamp' },
  { icon: '👥', title: 'Role-Based Access', desc: 'Granular permissions for staff' },
  { icon: '🛡️', title: 'HIPAA-Style Architecture', desc: 'Industry-standard compliance' },
  { icon: '⚔️', title: 'Military-Grade Security', desc: 'Defense-in-depth approach' }
];

const useCases = [
  {
    title: 'Military Clinic → Hospital Referral',
    icon: '🏥→🏨',
    steps: ['Pasien dari Klinik Militer', 'RecordBridge menyatukan data', 'RSUD menerima rekam medis lengkap']
  },
  {
    title: 'Hospital → Hospital Transfer',
    icon: '🏨→🏨',
    steps: ['IGD RSI A', 'Rujukan ke RSI B', 'Data otomatis tersinkronisasi']
  },
  {
    title: 'Multi-Source Data Merge',
    icon: '🔀',
    steps: ['BPJS data', 'SIMRS hospital', 'KlinikSwasta', 'Unified Record']
  }
];

const comparisons = [
  { feature: 'Data Integration', simrs: 'Terpisah per sistem', recordbridge: '✅ Unified' },
  { feature: 'Field Mapping', simrs: 'Manual mapping', recordbridge: '✅ Automatic' },
  { feature: 'Interoperability', simrs: 'Tidak interoperable', recordbridge: '✅ FHIR-ready' },
  { feature: 'Conflict Resolution', simrs: 'Tidak ada', recordbridge: '✅ Visual UI' },
  { feature: 'Timeline View', simrs: 'Per sistem', recordbridge: '✅ Cross-facility' },
  { feature: 'Audit Trail', simrs: 'Limited', recordbridge: '✅ Complete' }
];

export default function Home() {
  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 p-8 text-white shadow-xl">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMtOS45NDEgMC0xOCA4LjA1OS0xOCAxOHM4LjA1OSAxOCAxOCAxOCAxOC04LjA1OSAxOC0xOC04LjA1OS0xOC0xOC0xOHptMCAzMmMtNy43MzIgMC0xNC02LjI2OC0xNC0xNHM2LjI2OC0xNCAxNC0xNCAxNCA2LjI2OCAxNCAxNC02LjI2OCAxNC0xNCAxNHoiIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iLjA1Ii8+PC9nPjwvc3ZnPg==')] opacity-30"></div>
        <div className="relative z-10">
          <div className="mb-4 flex items-center gap-2">
            <span className="rounded-full bg-white/20 px-3 py-1 text-sm font-medium">🏥 Healthcare Interoperability for Indonesia</span>
          </div>
          <h1 className="text-4xl font-bold leading-tight">Connect any EHR. Translate schema-less.<br />Get a unified patient record.</h1>
          <p className="mt-4 max-w-2xl text-lg text-blue-100">Production-style demo for stakeholders: deterministic AI-like mapping, conflict handling, provenance, and referral export.</p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link href="/demo" className="rounded-xl bg-white px-5 py-3 text-sm font-semibold text-blue-700 shadow-lg hover:bg-blue-50 transition-colors">🚀 Open Demo</Link>
            <Link href="/how-it-works" className="rounded-xl border border-white/40 bg-white/10 px-5 py-3 text-sm font-semibold backdrop-blur hover:bg-white/20 transition-colors">📖 How it works</Link>
          </div>
        </div>
      </section>

      {/* Integrations Section */}
      <section className="card">
        <h2 className="mb-4 text-xl font-bold">🔗 Indonesia Healthcare Integrations</h2>
        <p className="mb-6 text-slate-600">RecordBridge dirancang untuk ekosistem kesehatan Indonesia yang terfragmentasi.</p>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
          {integrations.map((item) => (
            <div key={item.name} className="flex flex-col items-center rounded-xl border border-slate-200 p-4 text-center transition-all hover:border-blue-300 hover:shadow-md">
              <span className="mb-2 text-3xl">{item.icon}</span>
              <p className="font-semibold text-slate-800">{item.name}</p>
              <p className="text-xs text-slate-600">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Stakeholder CTAs */}
      <section className="card bg-gradient-to-br from-slate-50 to-white">
        <h2 className="mb-6 text-xl font-bold">🎯 Solutions for Every Stakeholder</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {stakeholders.map((s) => (
            <Link key={s.name} href="/demo" className={`group relative overflow-hidden rounded-2xl ${s.color} p-6 text-white shadow-lg transition-all hover:shadow-xl hover:-translate-y-1`}>
              <div className="relative z-10">
                <span className="mb-3 block text-4xl">{s.icon}</span>
                <p className="font-bold">{s.name}</p>
                <p className="mt-1 text-sm text-white/80">{s.desc}</p>
              </div>
              <div className="absolute -right-4 -bottom-4 text-8xl opacity-20 transition-transform group-hover:scale-110">→</div>
            </Link>
          ))}
        </div>
      </section>

      {/* Features Grid */}
      <section className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        {features.map((f) => (
          <article key={f.id} className="card hover:border-blue-300">
            <div className="mb-3 text-3xl">{f.icon}</div>
            <h2 className="text-base font-semibold">{f.title}</h2>
            <p className="mt-2 text-sm text-slate-600">{f.desc}</p>
            <Link href={`/demo#${f.id}`} className="mt-3 inline-block text-sm font-medium text-blue-600 hover:text-blue-700">See it in demo →</Link>
          </article>
        ))}
      </section>

      {/* Architecture Diagram */}
      <section className="card">
        <h2 className="mb-2 text-xl font-bold">🏗️ Architecture</h2>
        <p className="mb-6 text-slate-600">Arsitektur RecordBridge: Data flow dari berbagai sumber ke unified record.</p>
        <div className="flex flex-col items-center gap-4 lg:flex-row lg:justify-center">
          {[
            { name: 'SIMRS', icon: '💾' },
            { name: 'BPJS', icon: '🛡️' },
            { name: 'Excel', icon: '📊' },
            { name: 'WhatsApp', icon: '💬' }
          ].map((source, i) => (
            <div key={source.name} className="flex items-center">
              <div className="flex flex-col items-center rounded-xl bg-slate-100 px-6 py-4">
                <span className="mb-1 text-2xl">{source.icon}</span>
                <span className="font-semibold text-slate-700">{source.name}</span>
              </div>
              {i < 3 && <span className="mx-2 text-2xl text-slate-400">→</span>}
            </div>
          ))}
          <div className="flex items-center">
            <div className="mx-2 text-3xl font-bold text-blue-600">RecordBridge</div>
            <span className="mx-2 text-2xl text-slate-400">→</span>
            <div className="flex flex-col items-center rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-4 text-white">
              <span className="mb-1 text-2xl">📋</span>
              <span className="font-bold">Unified Record</span>
            </div>
          </div>
        </div>
      </section>

      {/* Security Section */}
      <section className="card border-2 border-emerald-200 bg-gradient-to-br from-emerald-50 to-white">
        <h2 className="mb-6 text-xl font-bold">🔐 Security & Compliance</h2>
        <p className="mb-6 text-slate-600">Keamanan tingkat enterprise untuk data kesehatan sensitif.</p>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {securityFeatures.map((item) => (
            <div key={item.title} className="rounded-xl bg-white p-4 shadow-sm">
              <span className="mb-2 block text-2xl">{item.icon}</span>
              <p className="font-semibold text-slate-800">{item.title}</p>
              <p className="mt-1 text-xs text-slate-600">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Use Cases */}
      <section className="card">
        <h2 className="mb-6 text-xl font-bold">💡 Real Use Cases</h2>
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          {useCases.map((uc) => (
            <div key={uc.title} className="rounded-xl border border-slate-200 p-5">
              <div className="mb-4 flex items-center gap-3">
                <span className="text-3xl">{uc.icon}</span>
                <h3 className="font-semibold text-slate-800">{uc.title}</h3>
              </div>
              <ol className="space-y-2">
                {uc.steps.map((step, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-slate-600">
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-blue-100 text-xs font-bold text-blue-700">{i + 1}</span>
                    {step}
                  </li>
                ))}
              </ol>
            </div>
          ))}
        </div>
      </section>

      {/* Differentiation vs SIMRS */}
      <section className="card">
        <h2 className="mb-2 text-xl font-bold">⚔️ RecordBridge vs SIMRS</h2>
        <p className="mb-6 text-slate-600">Apa yang membedakan RecordBridge dari sistem SIMRS tradisional.</p>
        <div className="overflow-auto">
          <table className="min-w-full text-left">
            <thead className="bg-slate-100">
              <tr>
                <th className="px-4 py-3 font-semibold text-slate-700">Feature</th>
                <th className="px-4 py-3 text-center font-semibold text-slate-700">SIMRS Biasa</th>
                <th className="px-4 py-3 text-center font-semibold text-blue-700">RecordBridge</th>
              </tr>
            </thead>
            <tbody>
              {comparisons.map((row, i) => (
                <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-slate-50'}>
                  <td className="px-4 py-3 font-medium text-slate-800">{row.feature}</td>
                  <td className="px-4 py-3 text-center text-slate-600">{row.simrs}</td>
                  <td className="px-4 py-3 text-center font-medium text-blue-700">{row.recordbridge}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Footer CTA */}
      <section className="rounded-2xl bg-slate-900 p-8 text-center text-white">
        <h2 className="text-2xl font-bold">Siap Transformasi Healthcare Data?</h2>
        <p className="mt-2 text-slate-300">Coba demo interaktif kami untuk melihat RecordBridge dalam aksi.</p>
        <div className="mt-6 flex justify-center gap-4">
          <Link href="/demo" className="rounded-xl bg-blue-500 px-6 py-3 font-semibold hover:bg-blue-600 transition-colors">🚀 Mulai Demo</Link>
          <Link href="/how-it-works" className="rounded-xl border border-slate-600 px-6 py-3 font-semibold hover:bg-slate-800 transition-colors">📖 Pelajari</Link>
        </div>
      </section>
    </div>
  );
}