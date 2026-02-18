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

const problems = [
  {
    icon: '🏥',
    title: 'Sistem Terpisah',
    desc: 'SIMRS, EHR, dan klinik menggunakan format data yang berbeda-beda'
  },
  {
    icon: '🔄',
    title: 'Duplikasi Data',
    desc: 'Pasien direkam berulang kali di setiap fasilitas kesehatan'
  },
  {
    icon: '⚠️',
    title: 'Konflik Informasi',
    desc: 'Data yang bertentangan antar sistem menyebabkan kebingungan klinis'
  },
  {
    icon: '⏱️',
    title: 'Waktu Terbuang',
    desc: 'Dokter menghabiskan waktu untuk rekonsiliasi manual data pasien'
  }
];

const solutions = [
  {
    icon: '🤖',
    title: 'AI Clinical Summary',
    desc: 'Ringkasan klinis otomatis dengan analisis tren dan risk flags'
  },
  {
    icon: '🌐',
    title: 'Bilingual Support',
    desc: 'Pemetaan otomatis Bahasa Indonesia ↔ Inggris untuk istilah medis'
  },
  {
    icon: '🔗',
    title: 'Schema-less Translation',
    desc: 'Tidak perlu standardisasi format - data dipetakan secara otomatis'
  },
  {
    icon: '✅',
    title: 'Verified Provenance',
    desc: 'Setiap data memiliki jejak asal untuk audit dan verifikasi'
  }
];

const useCases = [
  {
    icon: '🏛️',
    title: 'RSUD & Faskes Tingkat 1',
    desc: 'Integrasi data antara Puskesmas, Klinik, dan Rumah Sakit dalam satu wilayah. Rujukan pasien dengan riwayat lengkap.',
    target: 'Dinas Kesehatan'
  },
  {
    icon: '🏥',
    title: 'RS Swasta & Klinik',
    desc: 'Menghubungkan sistem lama (legacy) dengan EHR modern tanpa migrasi data yang mahal. Interoperabilitas antar cabang.',
    target: 'Group Rumah Sakit'
  },
  {
    icon: '🚁',
    title: 'Medical Evacuation',
    desc: 'Ringkasan medis darurat yang komprehensif untuk militer, tim SAR, dan evakuasi medis dengan data dari berbagai sumber.',
    target: 'TNI/Polri & SAR'
  },
  {
    icon: '📱',
    title: 'Telemedicine & EHR',
    desc: 'Integrasi data dari aplikasi telemedicine ke sistem EHR utama. Konsultasi online dengan akses riwayat lengkap.',
    target: 'Platform Kesehatan Digital'
  }
];

const securityFeatures = [
  {
    icon: '🔐',
    title: 'End-to-End Encryption',
    desc: 'Semua data dienkripsi saat transit dan istirahat menggunakan AES-256'
  },
  {
    icon: '📋',
    title: 'Audit Trail Lengkap',
    desc: 'Setiap akses dan modifikasi tercatat untuk compliance dan forensik'
  },
  {
    icon: '🛡️',
    title: 'HIPAA & PDPO Compliant',
    desc: 'Memenuhi standar perlindungan data kesehatan internasional dan Indonesia'
  },
  {
    icon: '🔍',
    title: 'Data Provenance',
    desc: 'Jejak asal data untuk verifikasi keaslian dan deteksi manipulasi'
  }
];

const architectureLayers = [
  {
    layer: 'Presentation',
    components: ['AI Clinical Summary', 'Unified Timeline', 'Conflict Resolution UI'],
    color: 'bg-blue-100 border-blue-300'
  },
  {
    layer: 'Translation Engine',
    components: ['Schema Mapper', 'Bilingual NLP', 'Confidence Scoring'],
    color: 'bg-emerald-100 border-emerald-300'
  },
  {
    layer: 'Data Fusion',
    components: ['Entity Resolution', 'Conflict Detection', 'Timeline Builder'],
    color: 'bg-amber-100 border-amber-300'
  },
  {
    layer: 'Connectors',
    components: ['HL7 FHIR', 'SIMRS Adapter', 'REST API', 'DICOM'],
    color: 'bg-purple-100 border-purple-300'
  }
];

export default function Home() {
  return (
    <div className="space-y-16">
      {/* Hero Section */}
      <section className="rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 p-8 text-white">
        <div className="max-w-4xl">
          <h1 className="text-4xl font-bold leading-tight">
            Healthcare Interoperability Engine
          </h1>
          <p className="mt-4 text-xl text-blue-100">
            Bukan SIMRS. Tapi <strong>layer di atas SIMRS</strong> yang menghubungkan 
            sistem kesehatan dengan schema-less translation dan AI clinical summary.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link 
              href="/demo" 
              className="rounded-lg bg-white px-6 py-3 text-sm font-bold text-blue-700 hover:bg-blue-50 transition-colors"
            >
              🚀 Lihat Demo
            </Link>
            <Link 
              href="/how-it-works" 
              className="rounded-lg border-2 border-white/40 px-6 py-3 text-sm font-bold hover:bg-white/10 transition-colors"
            >
              Pelajari Cara Kerja
            </Link>
          </div>
          <div className="mt-6 flex items-center gap-4 text-sm text-blue-200">
            <span className="flex items-center gap-1">✅ Schema-less Mapping</span>
            <span className="flex items-center gap-1">✅ Bilingual ID/EN</span>
            <span className="flex items-center gap-1">✅ AI Clinical Summary</span>
          </div>
        </div>
      </section>

      {/* Problem Section */}
      <section>
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-slate-800">Masalah yang Dipecahkan</h2>
          <p className="text-slate-600 mt-2">Indonesia memiliki ribuan fasilitas kesehatan dengan sistem yang terfragmentasi</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {problems.map((p, idx) => (
            <div key={idx} className="card text-center hover:shadow-md transition-shadow">
              <div className="text-4xl mb-3">{p.icon}</div>
              <h3 className="font-semibold text-slate-800">{p.title}</h3>
              <p className="text-sm text-slate-600 mt-2">{p.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Solution Section */}
      <section className="bg-slate-50 -mx-8 px-8 py-12">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-slate-800">Solusi RecordBridge</h2>
          <p className="text-slate-600 mt-2">Interoperabilitas tanpa mengganti sistem yang ada</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {solutions.map((s, idx) => (
            <div key={idx} className="card flex items-start gap-4 hover:shadow-md transition-shadow">
              <div className="text-3xl">{s.icon}</div>
              <div>
                <h3 className="font-bold text-slate-800">{s.title}</h3>
                <p className="text-sm text-slate-600 mt-1">{s.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section>
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-slate-800">Fitur Utama</h2>
          <p className="text-slate-600 mt-2">Demo interaktif dengan data pasien nyata dari 3 sumber berbeda</p>
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {features.map((f) => (
            <article key={f.id} className="card hover:shadow-md transition-shadow">
              <h2 className="text-base font-semibold text-slate-800">{f.title}</h2>
              <p className="mt-2 text-sm text-slate-600">{f.desc}</p>
              <Link href={`/demo#${f.id}`} className="mt-3 inline-block text-sm text-blue-600 font-medium">
                Lihat di demo →
              </Link>
            </article>
          ))}
        </div>
      </section>

      {/* Use Cases Section */}
      <section>
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-slate-800">Use Cases Indonesia</h2>
          <p className="text-slate-600 mt-2">Target pasar dan implementasi untuk ekosistem kesehatan Indonesia</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {useCases.map((uc, idx) => (
            <div key={idx} className="card hover:shadow-lg transition-shadow border-l-4 border-l-indigo-500">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <span className="text-3xl">{uc.icon}</span>
                  <div>
                    <h3 className="font-bold text-slate-800">{uc.title}</h3>
                    <span className="text-xs bg-indigo-100 text-indigo-800 px-2 py-0.5 rounded-full">
                      {uc.target}
                    </span>
                  </div>
                </div>
              </div>
              <p className="text-sm text-slate-600">{uc.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Security Section */}
      <section className="bg-gradient-to-br from-slate-800 to-slate-900 -mx-8 px-8 py-12 text-white">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold">Keamanan & Compliance</h2>
          <p className="text-slate-300 mt-2">Standar keamanan tertinggi untuk data kesehatan sensitif</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {securityFeatures.map((sf, idx) => (
            <div key={idx} className="bg-white/10 backdrop-blur rounded-xl p-5 border border-white/10">
              <div className="text-3xl mb-3">{sf.icon}</div>
              <h3 className="font-semibold">{sf.title}</h3>
              <p className="text-sm text-slate-300 mt-2">{sf.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Architecture Section */}
      <section>
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-slate-800">Arsitektur RecordBridge</h2>
          <p className="text-slate-600 mt-2">Layer interoperability di atas sistem yang sudah ada</p>
        </div>
        <div className="max-w-3xl mx-auto space-y-4">
          {architectureLayers.map((layer, idx) => (
            <div key={idx} className={`rounded-xl border-2 p-4 ${layer.color}`}>
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-bold">{layer.layer}</h3>
                <span className="text-xs bg-white/50 px-2 py-1 rounded">Layer {4 - idx}</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {layer.components.map((comp, cidx) => (
                  <span key={cidx} className="text-xs bg-white/70 px-3 py-1.5 rounded-full font-medium">
                    {comp}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
        <div className="text-center mt-6">
          <p className="text-sm text-slate-500">↓ EHR / SIMRS / Klinik / Pharmacy (Existing Systems)</p>
        </div>
      </section>

      {/* CTA Section */}
      <section className="text-center bg-gradient-to-r from-indigo-600 to-blue-600 rounded-2xl p-8 text-white">
        <h2 className="text-3xl font-bold">Siap untuk Interoperabilitas?</h2>
        <p className="mt-4 text-lg text-indigo-100 max-w-2xl mx-auto">
          Jadilah bagian dari revolusi kesehatan digital Indonesia. 
          Hubungkan sistem Anda tanpa mengganti infrastruktur yang ada.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-4">
          <Link 
            href="/demo" 
            className="rounded-lg bg-white px-8 py-3 text-sm font-bold text-indigo-700 hover:bg-indigo-50 transition-colors"
          >
            🚀 Coba Demo Sekarang
          </Link>
          <Link 
            href="/how-it-works" 
            className="rounded-lg border-2 border-white/40 px-8 py-3 text-sm font-bold hover:bg-white/10 transition-colors"
          >
            📚 Dokumentasi
          </Link>
        </div>
        <p className="mt-6 text-sm text-indigo-200">
          Cocok untuk: RSUD, RS Swasta, Klinik, TNI/Polri Medical Unit, Platform Telemedicine
        </p>
      </section>
    </div>
  );
}
