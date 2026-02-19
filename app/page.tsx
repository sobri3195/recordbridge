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
    <div className="space-y-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 p-8 text-white shadow-2xl animate-gradient">
        {/* Animated background patterns */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMtOS45NDEgMC0xOCA4LjA1OS0xOCAxOHM4LjA1OSAxOCAxOCAxOCAxOC04LjA1OSAxOC0xOC04LjA1OS0xOC0xOC0xOHptMCAzMmMtNy43MzIgMC0xNC02LjI2OC0xNC0xNHM2LjI2OC0xNCAxNC0xNCAxNCA2LjI2OCAxNCAxNC02LjI2OCAxNC0xNCAxNHoiIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iLjA1Ii8+PC9nPjwvc3ZnPg==')] opacity-20 animate-float"></div>
          <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-white/10 blur-3xl animate-pulse-glow"></div>
          <div className="absolute -left-20 -bottom-20 h-64 w-64 rounded-full bg-purple-500/20 blur-3xl animate-pulse-glow" style={{animationDelay: '1s'}}></div>
        </div>
        
        <div className="relative z-10">
          <div className="mb-6 flex items-center gap-3 animate-fadeIn">
            <span className="animate-float inline-flex items-center rounded-full bg-white/20 backdrop-blur-sm px-4 py-2 text-sm font-medium shadow-lg">
              <span className="mr-2">🏥</span> Healthcare Interoperability for Indonesia
            </span>
          </div>
          <h1 className="mb-6 text-4xl font-extrabold leading-tight animate-slideInLeft md:text-5xl lg:text-6xl">
            Connect any <span className="text-cyan-300">EHR</span>. <br />
            Translate <span className="text-purple-300">schema-less</span>.<br />
            Get a <span className="bg-gradient-to-r from-yellow-200 to-amber-300 bg-clip-text text-transparent">unified</span> patient record.
          </h1>
          <p className="mb-8 max-w-2xl text-lg text-blue-100/90 animate-slideInRight">
            Production-style demo for stakeholders: deterministic AI-like mapping, conflict handling, provenance, and referral export.
          </p>
          <div className="flex flex-wrap gap-4 animate-scaleIn">
            <Link href="/features" className="btn-primary group">
              <span className="relative z-10 flex items-center gap-2">
                🚀 Core Features
                <span className="transition-transform group-hover:translate-x-1">→</span>
              </span>
            </Link>
            <Link href="/demo" className="btn-secondary group">
              <span className="relative z-10 flex items-center gap-2">
                🧪 Open Demo
                <span className="transition-transform group-hover:translate-x-1">→</span>
              </span>
            </Link>
            <Link href="/how-it-works" className="btn-ghost text-white hover:bg-white/20 hover:text-white">
              📖 How it works
            </Link>
          </div>
        </div>
      </section>

      {/* Integrations Section */}
      <section className="card-gradient animate-fadeIn">
        <div className="mb-6">
          <span className="badge-blue mb-3">🔗 Integrations</span>
          <h2 className="mb-2 text-2xl font-bold text-gradient-blue">Indonesia Healthcare Ecosystem</h2>
          <p className="text-slate-600">RecordBridge dirancang untuk ekosistem kesehatan Indonesia yang terfragmentasi.</p>
        </div>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
          {integrations.map((item, index) => (
            <div 
              key={item.name} 
              className={`card hover-lift flex flex-col items-center p-4 text-center stagger-${(index % 5) + 1} animate-fadeIn`}
            >
              <div className="mb-3 rounded-2xl bg-gradient-to-br from-blue-100 to-indigo-100 p-3 shadow-inner">
                <span className="text-3xl">{item.icon}</span>
              </div>
              <p className="font-semibold text-slate-800">{item.name}</p>
              <p className="mt-1 text-xs text-slate-600">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Stakeholder CTAs */}
      <section className="animate-fadeIn">
        <div className="mb-6 text-center">
          <span className="badge-purple mb-3">🎯 Use Cases</span>
          <h2 className="mb-2 text-2xl font-bold text-gradient">Solutions for Every Stakeholder</h2>
          <p className="text-slate-600">Empowering healthcare organizations across Indonesia</p>
        </div>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {stakeholders.map((s, index) => (
            <Link 
              key={s.name} 
              href="/demo" 
              className={`group relative overflow-hidden rounded-2xl ${s.color} p-6 text-white shadow-2xl transition-all duration-500 hover:shadow-3xl hover:-translate-y-2 hover:scale-105 stagger-${(index % 5) + 1} animate-fadeIn`}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100"></div>
              <div className="relative z-10">
                <span className="mb-4 block text-5xl transition-transform duration-500 group-hover:scale-110 group-hover:rotate-6">{s.icon}</span>
                <p className="text-xl font-bold">{s.name}</p>
                <p className="mt-2 text-sm text-white/90">{s.desc}</p>
              </div>
              <div className="absolute -right-6 -bottom-6 text-9xl opacity-10 transition-transform duration-500 group-hover:scale-125 group-hover:rotate-12">→</div>
            </Link>
          ))}
        </div>
      </section>

      {/* 5 Core Features Section */}
      <section className="card-gradient animate-fadeIn">
        <div className="mb-6">
          <span className="badge-green mb-3">🚀 Technology</span>
          <h2 className="mb-2 text-2xl font-bold text-gradient">5 Core Technologies</h2>
          <p className="text-slate-600">RecordBridge dibangun di atas 5 engine inti untuk interoperabilitas data kesehatan yang komprehensif.</p>
        </div>
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
          {[
            { icon: '🔗', title: 'Auto-Connector Engine', desc: 'Auto-detect SIMRS schema & plug-and-play connectors', color: 'blue', href: '/features/auto-connector' },
            { icon: '🧠', title: 'AI Mapping Engine', desc: 'Smart field mapping with learning capabilities', color: 'purple', href: '/features/ai-mapping' },
            { icon: '🏥', title: 'Standardization Layer', desc: 'FHIR, SATUSEHAT, ICD-10, LOINC, SNOMED', color: 'emerald', href: '/features/standardization' },
            { icon: '⚡', title: 'Real-Time Sync', desc: 'Event-driven multi-hospital synchronization', color: 'amber', href: '/features/realtime-sync' },
            { icon: '🌐', title: 'API Gateway', desc: 'Single API for all healthcare integrations', color: 'indigo', href: '/features/api-gateway' },
          ].map((feature, index) => (
            <Link
              key={feature.title}
              href={feature.href}
              className={`group card hover-glow stagger-${(index % 5) + 1} animate-fadeIn p-5`}
            >
              <div className={`mb-3 inline-flex rounded-2xl bg-gradient-to-br from-${feature.color}-100 to-${feature.color}-200 p-3 shadow-inner`}>
                <span className="text-3xl transition-transform duration-300 group-hover:scale-110">{feature.icon}</span>
              </div>
              <h3 className={`text-lg font-bold bg-gradient-to-r from-${feature.color}-700 to-${feature.color}-500 bg-clip-text text-transparent`}>
                {feature.title}
              </h3>
              <p className={`mt-2 text-sm text-${feature.color}-700/80`}>{feature.desc}</p>
              <span className={`mt-4 inline-flex items-center gap-2 text-sm font-semibold text-${feature.color}-600 transition-all group-hover:gap-3`}>
                Explore
                <span className="transition-transform group-hover:translate-x-1">→</span>
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* Features Grid */}
      <section className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
        {features.map((f, index) => (
          <article key={f.id} className={`card hover-lift group stagger-${(index % 5) + 1} animate-fadeIn`}>
            <div className="mb-4 inline-flex rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-100 p-4 shadow-inner transition-transform duration-300 group-hover:scale-110">
              <span className="text-4xl">{f.icon}</span>
            </div>
            <h2 className="text-lg font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">{f.title}</h2>
            <p className="mt-3 text-sm text-slate-600 leading-relaxed">{f.desc}</p>
            <Link 
              href={`/demo#${f.id}`} 
              className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-blue-600 transition-all group-hover:gap-3 group-hover:text-blue-700"
            >
              See it in demo
              <span className="transition-transform group-hover:translate-x-1">→</span>
            </Link>
          </article>
        ))}
      </section>

      {/* Architecture Diagram */}
      <section className="card-gradient animate-fadeIn">
        <div className="mb-6">
          <span className="badge-indigo mb-3">🏗️ Architecture</span>
          <h2 className="mb-2 text-2xl font-bold text-gradient-blue">Data Flow Pipeline</h2>
          <p className="text-slate-600">Arsitektur RecordBridge: Data flow dari berbagai sumber ke unified record.</p>
        </div>
        <div className="flex flex-col items-center gap-4 lg:flex-row lg:justify-center">
          {[
            { name: 'SIMRS', icon: '💾', color: 'blue' },
            { name: 'BPJS', icon: '🛡️', color: 'emerald' },
            { name: 'Excel', icon: '📊', color: 'amber' },
            { name: 'WhatsApp', icon: '💬', color: 'purple' }
          ].map((source, i) => (
            <div key={source.name} className="flex items-center">
              <div className={`group card hover-lift flex flex-col items-center px-6 py-4 bg-gradient-to-br from-${source.color}-50 to-${source.color}-100 stagger-${(i % 5) + 1} animate-fadeIn`}>
                <div className="mb-2 rounded-xl bg-white p-2 shadow-md transition-transform duration-300 group-hover:scale-110">
                  <span className="text-2xl">{source.icon}</span>
                </div>
                <span className="font-bold text-slate-800">{source.name}</span>
              </div>
              {i < 3 && (
                <span className="mx-3 text-2xl text-slate-400 transition-transform hover:scale-125 hover:text-blue-600">→</span>
              )}
            </div>
          ))}
          <div className="flex items-center">
            <div className="mx-3 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-4 text-white shadow-lg shadow-blue-500/30 animate-pulse-glow">
              <span className="text-2xl font-bold">RecordBridge</span>
            </div>
            <span className="mx-3 text-2xl text-slate-400 transition-transform hover:scale-125 hover:text-blue-600">→</span>
            <div className="group card hover-lift flex flex-col items-center bg-gradient-to-r from-blue-600 to-indigo-600 px-8 py-5 text-white shadow-2xl shadow-blue-500/40">
              <div className="mb-2 rounded-xl bg-white/20 p-2 backdrop-blur-sm transition-transform duration-300 group-hover:scale-110">
                <span className="text-3xl">📋</span>
              </div>
              <span className="text-lg font-bold">Unified Record</span>
            </div>
          </div>
        </div>
      </section>

      {/* Security Section */}
      <section className="relative overflow-hidden rounded-3xl border-2 border-emerald-200/60 bg-gradient-to-br from-emerald-50 via-white to-teal-50 p-8 shadow-xl animate-fadeIn">
        <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-emerald-200/30 blur-3xl"></div>
        <div className="absolute -left-20 -bottom-20 h-64 w-64 rounded-full bg-teal-200/30 blur-3xl"></div>
        
        <div className="relative z-10">
          <div className="mb-6">
            <span className="badge-green mb-3">🔐 Security</span>
            <h2 className="mb-2 text-2xl font-bold bg-gradient-to-r from-emerald-700 to-teal-600 bg-clip-text text-transparent">
              Enterprise-Grade Security
            </h2>
            <p className="text-slate-600">Keamanan tingkat enterprise untuk data kesehatan sensitif.</p>
          </div>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-5">
            {securityFeatures.map((item, index) => (
              <div 
                key={item.title} 
                className={`card hover-lift bg-white stagger-${(index % 5) + 1} animate-fadeIn p-5`}
              >
                <div className="mb-3 inline-flex rounded-2xl bg-gradient-to-br from-emerald-100 to-teal-100 p-3 shadow-inner">
                  <span className="text-2xl transition-transform duration-300 hover:scale-110">{item.icon}</span>
                </div>
                <p className="font-bold text-slate-800">{item.title}</p>
                <p className="mt-2 text-xs text-slate-600 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Use Cases */}
      <section className="card-gradient animate-fadeIn">
        <div className="mb-6">
          <span className="badge-amber mb-3">💡 Use Cases</span>
          <h2 className="mb-2 text-2xl font-bold text-gradient">Real World Scenarios</h2>
          <p className="text-slate-600">Lihat bagaimana RecordBridge bekerja dalam situasi nyata.</p>
        </div>
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {useCases.map((uc, index) => (
            <div 
              key={uc.title} 
              className={`card hover-lift stagger-${(index % 5) + 1} animate-fadeIn`}
            >
              <div className="mb-4 flex items-center gap-3">
                <div className="rounded-2xl bg-gradient-to-br from-amber-100 to-orange-100 p-3 shadow-inner">
                  <span className="text-3xl">{uc.icon}</span>
                </div>
                <h3 className="text-lg font-bold text-slate-800">{uc.title}</h3>
              </div>
              <ol className="space-y-3">
                {uc.steps.map((step, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm text-slate-600">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-indigo-500 text-xs font-bold text-white shadow-md">
                      {i + 1}
                    </span>
                    <span className="pt-0.5 leading-relaxed">{step}</span>
                  </li>
                ))}
              </ol>
            </div>
          ))}
        </div>
      </section>

      {/* Differentiation vs SIMRS */}
      <section className="card-gradient animate-fadeIn">
        <div className="mb-6">
          <span className="badge-purple mb-3">⚔️ Comparison</span>
          <h2 className="mb-2 text-2xl font-bold text-gradient">RecordBridge vs SIMRS Traditional</h2>
          <p className="text-slate-600">Apa yang membedakan RecordBridge dari sistem SIMRS tradisional.</p>
        </div>
        <div className="overflow-auto rounded-2xl border border-slate-200 shadow-lg">
          <table className="min-w-full text-left">
            <thead className="bg-gradient-to-r from-slate-100 to-slate-200">
              <tr>
                <th className="px-6 py-4 font-bold text-slate-800">Feature</th>
                <th className="px-6 py-4 text-center font-bold text-slate-700">SIMRS Biasa</th>
                <th className="px-6 py-4 text-center font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">RecordBridge</th>
              </tr>
            </thead>
            <tbody>
              {comparisons.map((row, i) => (
                <tr 
                  key={i} 
                  className={`transition-colors duration-300 ${i % 2 === 0 ? 'bg-white hover:bg-blue-50/30' : 'bg-slate-50 hover:bg-blue-50/30'}`}
                >
                  <td className="px-6 py-4 font-medium text-slate-800">{row.feature}</td>
                  <td className="px-6 py-4 text-center text-slate-600">{row.simrs}</td>
                  <td className="px-6 py-4 text-center font-bold text-blue-600">{row.recordbridge}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Footer CTA */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 p-10 text-center text-white shadow-2xl animate-gradient">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMtOS45NDEgMC0xOCA4LjA1OS0xOCAxOHM4LjA1OSAxOCAxOCAxOCAxOC04LjA1OSAxOC0xOC04LjA1OS0xOC0xOC0xOHptMCAzMmMtNy43MzIgMC0xNC02LjI2OC0xNC0xNHM2LjI2OC0xNCAxNC0xNCAxNCA2LjI2OCAxNCAxNC02LjI2OCAxNC0xNCAxNHoiIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iLjAzIi8+PC9nPjwvc3ZnPg==')] opacity-30"></div>
        <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-blue-500/20 blur-3xl animate-pulse-glow"></div>
        <div className="absolute -left-20 -bottom-20 h-64 w-64 rounded-full bg-purple-500/20 blur-3xl animate-pulse-glow" style={{animationDelay: '1s'}}></div>
        
        <div className="relative z-10">
          <div className="mb-4 inline-flex animate-float items-center rounded-full bg-white/10 px-6 py-2 backdrop-blur-sm">
            <span className="text-xl">🚀</span>
            <span className="ml-2 font-semibold">Ready to Transform Healthcare Data?</span>
          </div>
          <h2 className="mb-4 text-3xl font-extrabold md:text-4xl">
            Siap <span className="bg-gradient-to-r from-cyan-300 to-blue-400 bg-clip-text text-transparent">Transformasi</span> Healthcare Data?
          </h2>
          <p className="mx-auto mb-8 max-w-2xl text-lg text-blue-100/90">
            Jelajahi 5 core teknologi kami untuk interoperabilitas data kesehatan Indonesia.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/features" className="btn-primary group">
              <span className="flex items-center gap-2">
                🚀 Core Features
                <span className="transition-transform group-hover:translate-x-1">→</span>
              </span>
            </Link>
            <Link href="/demo" className="btn-secondary group">
              <span className="flex items-center gap-2">
                🧪 Demo Interaktif
                <span className="transition-transform group-hover:translate-x-1">→</span>
              </span>
            </Link>
            <Link href="/how-it-works" className="btn-ghost text-white hover:bg-white/10 hover:text-white">
              📖 Pelajari
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}