import Link from 'next/link';

const CORE_FEATURES = [
  {
    id: 'auto-connector',
    icon: '🔗',
    title: 'Universal Auto-Connector Engine',
    shortDesc: 'Auto-detect database structure & auto-map fields',
    description: 'Mampu menghubungkan SEMUA SIMRS hanya dengan IP + credential atau endpoint API. Support HL7, FHIR, JSON, XML dengan plug-and-play connector.',
    capabilities: [
      'Auto-detect struktur database SIMRS',
      'Auto-mapping tabel dan field',
      'Auto-generate integration schema',
      'Support PostgreSQL, MySQL, MSSQL, Oracle',
      'Minimal configuration required'
    ],
    color: 'blue',
    href: '/features/auto-connector'
  },
  {
    id: 'ai-mapping',
    icon: '🧠',
    title: 'Smart Data Mapping AI Engine',
    shortDesc: 'Rule-based + AI mapping with learning',
    description: 'AI dapat mendeteksi kesamaan field, membuat rekomendasi mapping otomatis, dan belajar dari integrasi sebelumnya.',
    capabilities: [
      'Semantic pattern matching',
      'Jaro-Winkler string similarity',
      'Multi-word token matching',
      'Learning from previous integrations',
      'Confidence boosting from history'
    ],
    color: 'purple',
    href: '/features/ai-mapping'
  },
  {
    id: 'standardization',
    icon: '🏥',
    title: 'National Health Standardization Layer',
    shortDesc: 'FHIR compliant, SATUSEHAT compatible',
    description: 'Semua data dikonversi ke FHIR compliant structure dengan SATUSEHAT compatibility, ICD-10 & ICD-9 CM standardized, LOINC & SNOMED support.',
    capabilities: [
      'FHIR R4 compliant resources',
      'SATUSEHAT Indonesia profile',
      'ICD-10 & ICD-9-CM mapping',
      'LOINC for laboratory tests',
      'SNOMED-CT for clinical terms',
      'RxNorm for medications'
    ],
    color: 'emerald',
    href: '/features/standardization'
  },
  {
    id: 'realtime-sync',
    icon: '⚡',
    title: 'Real-Time Multi-Hospital Sync',
    shortDesc: 'Event-driven architecture with queue system',
    description: 'Real-time sync antar RS dengan event-driven architecture, queue system (Kafka/RabbitMQ compatible), dan conflict resolution system.',
    capabilities: [
      'Event-driven architecture',
      'Priority queue system',
      'Cross-hospital synchronization',
      'Conflict detection & resolution',
      'Retry with exponential backoff',
      'Dead letter queue support'
    ],
    color: 'amber',
    href: '/features/realtime-sync'
  },
  {
    id: 'api-gateway',
    icon: '🌐',
    title: 'Universal Health API Gateway',
    shortDesc: 'Single API for all healthcare integrations',
    description: 'Menyediakan API tunggal untuk semua aplikasi eksternal. Cukup integrasi sekali ke RecordBridge untuk akses semua data kesehatan.',
    capabilities: [
      'RESTful FHIR-compliant API',
      'API key authentication',
      'Rate limiting & throttling',
      'Request/response logging',
      'Real-time request metrics',
      'Comprehensive documentation'
    ],
    color: 'indigo',
    href: '/features/api-gateway'
  }
];

export default function FeaturesPage() {
  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-slate-800">🚀 RecordBridge Core Features</h1>
        <p className="mt-2 text-slate-600">5 Core Technologies untuk Interoperabilitas Data Kesehatan Indonesia</p>
      </div>

      <div className="grid gap-6">
        {CORE_FEATURES.map((feature, index) => (
          <Link
            key={feature.id}
            href={feature.href}
            className="group card hover:border-blue-300 transition-all"
          >
            <div className="flex gap-6">
              <div className={`flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-${feature.color}-100 text-3xl`}>
                {feature.icon}
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-sm font-medium text-slate-500">{String(index + 1).padStart(2, '0')}</span>
                    <h2 className="text-xl font-bold text-slate-800 group-hover:text-blue-600 transition-colors">
                      {feature.title}
                    </h2>
                  </div>
                  <span className="rounded-full bg-slate-100 px-3 py-1 text-sm text-slate-600 group-hover:bg-blue-100 group-hover:text-blue-700 transition-colors">
                    Explore →
                  </span>
                </div>
                <p className="mt-1 text-slate-600">{feature.shortDesc}</p>
                <p className="mt-2 text-sm text-slate-500">{feature.description}</p>
                
                <div className="mt-4 flex flex-wrap gap-2">
                  {feature.capabilities.slice(0, 4).map((cap, idx) => (
                    <span
                      key={idx}
                      className={`rounded-full bg-${feature.color}-50 px-3 py-1 text-xs text-${feature.color}-700`}
                    >
                      ✓ {cap}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>

      <div className="rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 p-8 text-white text-center">
        <h2 className="text-2xl font-bold">Siap Integrasi dengan SIMRS Anda?</h2>
        <p className="mt-2 text-blue-100">Coba demo interaktif untuk melihat RecordBridge dalam aksi</p>
        <div className="mt-6 flex justify-center gap-4">
          <Link
            href="/demo"
            className="rounded-xl bg-white px-6 py-3 font-semibold text-blue-700 hover:bg-blue-50 transition-colors"
          >
            🚀 Open Demo
          </Link>
          <Link
            href="/how-it-works"
            className="rounded-xl border border-white/40 bg-white/10 px-6 py-3 font-semibold backdrop-blur hover:bg-white/20 transition-colors"
          >
            📖 How it Works
          </Link>
        </div>
      </div>
    </div>
  );
}
