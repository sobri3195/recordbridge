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
    <div className="space-y-12">
      <div className="text-center animate-fadeIn">
        <span className="badge-green mb-4 inline-block">🚀 Technology</span>
        <h1 className="mb-4 text-4xl font-extrabold md:text-5xl">
          <span className="text-gradient">RecordBridge Core Features</span>
        </h1>
        <p className="max-w-2xl mx-auto text-lg text-slate-600">5 Core Technologies untuk Interoperabilitas Data Kesehatan Indonesia</p>
      </div>

      <div className="grid gap-6">
        {CORE_FEATURES.map((feature, index) => (
          <Link
            key={feature.id}
            href={feature.href}
            className={`group card hover-lift stagger-${(index % 5) + 1} animate-fadeIn`}
          >
            <div className="flex gap-6">
              <div className={`flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-${feature.color}-100 to-${feature.color}-200 text-4xl shadow-inner transition-transform duration-300 group-hover:scale-110`}>
                {feature.icon}
              </div>
              <div className="flex-1">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <span className="mb-2 inline-block rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-600">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                    <h2 className="text-2xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent group-hover:from-blue-700 group-hover:to-indigo-600 transition-all">
                      {feature.title}
                    </h2>
                  </div>
                  <span className="badge-blue hidden sm:inline-flex">
                    Explore →
                  </span>
                </div>
                <p className="mt-2 text-base font-semibold text-slate-700">{feature.shortDesc}</p>
                <p className="mt-2 text-sm text-slate-600 leading-relaxed">{feature.description}</p>
                
                <div className="mt-4 flex flex-wrap gap-2">
                  {feature.capabilities.slice(0, 4).map((cap, idx) => (
                    <span
                      key={idx}
                      className={`rounded-full bg-gradient-to-r from-${feature.color}-50 to-${feature.color}-100 px-3 py-1.5 text-xs font-semibold text-${feature.color}-700 shadow-sm transition-transform hover:scale-105`}
                    >
                      ✓ {cap}
                    </span>
                  ))}
                  {feature.capabilities.length > 4 && (
                    <span className="rounded-full bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-600">
                      +{feature.capabilities.length - 4} more
                    </span>
                  )}
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>

      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 p-10 text-center text-white shadow-2xl animate-gradient">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMtOS45NDEgMC0xOCA4LjA1OS0xOCAxOHM4LjA1OSAxOCAxOCAxOCAxOC04LjA1OSAxOC0xOC04LjA1OS0xOC0xOC0xOHptMCAzMmMtNy43MzIgMC0xNC02LjI2OC0xNC0xNHM2LjI2OC0xNCAxNC0xNCAxNCA2LjI2OCAxNCAxNC02LjI2OCAxNC0xNCAxNHoiIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iLjAzIi8+PC9nPjwvc3ZnPg==')] opacity-20"></div>
        <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-white/10 blur-3xl animate-pulse-glow"></div>
        <div className="absolute -left-20 -bottom-20 h-64 w-64 rounded-full bg-purple-500/20 blur-3xl animate-pulse-glow" style={{animationDelay: '1s'}}></div>
        
        <div className="relative z-10">
          <h2 className="text-3xl font-extrabold">Siap Integrasi dengan SIMRS Anda?</h2>
          <p className="mt-3 text-lg text-blue-100/90">Coba demo interaktif untuk melihat RecordBridge dalam aksi</p>
          <div className="mt-8 flex justify-center gap-4">
            <Link
              href="/demo"
              className="btn-primary group"
            >
              <span className="flex items-center gap-2">
                🚀 Open Demo
                <span className="transition-transform group-hover:translate-x-1">→</span>
              </span>
            </Link>
            <Link
              href="/how-it-works"
              className="btn-secondary"
            >
              <span className="flex items-center gap-2">
                📖 How it Works
              </span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
