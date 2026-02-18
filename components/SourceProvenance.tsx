'use client';

import { CanonicalRecord, SourceSystem } from '@/lib/types';

interface SourceProvenanceProps {
  record: CanonicalRecord | null;
}

const sourceColors: Record<SourceSystem, { bg: string; border: string; text: string; icon: string }> = {
  EHR_A: {
    bg: 'bg-blue-50',
    border: 'border-blue-200',
    text: 'text-blue-800',
    icon: '🏥'
  },
  SIMRS_B: {
    bg: 'bg-emerald-50',
    border: 'border-emerald-200',
    text: 'text-emerald-800',
    icon: '🏛️'
  },
  CLINIC_C: {
    bg: 'bg-amber-50',
    border: 'border-amber-200',
    text: 'text-amber-800',
    icon: '🏪'
  }
};

const sourceDescriptions: Record<SourceSystem, { name: string; description: string; location: string }> = {
  EHR_A: {
    name: 'EHR System A',
    description: 'Electronic Health Record - Format internasional',
    location: 'RS Swasta Jakarta'
  },
  SIMRS_B: {
    name: 'SIMRS B',
    description: 'Sistem Informasi Manajemen RS - Format lokal Indonesia',
    location: 'RSUD Regional'
  },
  CLINIC_C: {
    name: 'Clinic C',
    description: 'Data dari klinik/telemedicine',
    location: 'Klinik Pratama'
  }
};

export function SourceProvenance({ record }: SourceProvenanceProps) {
  if (!record) {
    return (
      <section className="card text-sm text-slate-500">
        Jalankan translasi untuk melihat visualisasi asal data.
      </section>
    );
  }

  const sources = Array.from(new Set(record.mappings.map(m => m.provenance.source)));
  
  const getSourceStats = (source: SourceSystem) => {
    const sourceMappings = record.mappings.filter(m => m.provenance.source === source);
    const avgConfidence = sourceMappings.reduce((sum, m) => sum + m.confidence, 0) / sourceMappings.length;
    return {
      count: sourceMappings.length,
      avgConfidence: Math.round(avgConfidence * 100),
      lastUpdated: sourceMappings[0]?.provenance.timestamp
    };
  };

  return (
    <section className="card">
      <div className="flex items-center gap-2 mb-4">
        <span className="text-2xl">📡</span>
        <h3 className="text-lg font-bold text-slate-800">Sumber Data & Provenance</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {sources.map((source) => {
          const colors = sourceColors[source];
          const desc = sourceDescriptions[source];
          const stats = getSourceStats(source);
          
          return (
            <div
              key={source}
              className={`rounded-lg border-2 ${colors.border} ${colors.bg} p-4 transition-all hover:shadow-md`}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{colors.icon}</span>
                  <div>
                    <h4 className={`font-bold ${colors.text}`}>{desc.name}</h4>
                    <p className="text-xs text-slate-500">{desc.location}</p>
                  </div>
                </div>
                <span className={`text-xs px-2 py-1 rounded-full bg-white font-medium ${colors.text}`}>
                  {stats.avgConfidence}% confidence
                </span>
              </div>
              
              <p className="text-sm text-slate-600 mb-3">{desc.description}</p>
              
              <div className="space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-500">Field yang dipetakan:</span>
                  <span className="font-medium">{stats.count}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Terakhir update:</span>
                  <span className="font-medium">
                    {stats.lastUpdated ? new Date(stats.lastUpdated).toLocaleDateString('id-ID') : '-'}
                  </span>
                </div>
              </div>

              {/* Data Flow Indicator */}
              <div className="mt-3 pt-3 border-t border-slate-200">
                <div className="flex items-center gap-1">
                  <div className="flex-1 h-2 bg-slate-200 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${
                        source === 'EHR_A' ? 'bg-blue-500' :
                        source === 'SIMRS_B' ? 'bg-emerald-500' : 'bg-amber-500'
                      }`}
                      style={{ width: `${stats.avgConfidence}%` }}
                    />
                  </div>
                </div>
                <p className="text-xs text-slate-400 mt-1 text-center">Kualitas pemetaan data</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Data Fusion Summary */}
      <div className="mt-4 p-4 bg-slate-50 rounded-lg border border-slate-200">
        <h4 className="text-sm font-semibold text-slate-700 mb-2">🔄 Proses Fusi Data</h4>
        <div className="flex flex-wrap items-center gap-2 text-sm">
          {sources.map((source, idx) => (
            <span key={source} className="flex items-center gap-2">
              <span className={`px-2 py-1 rounded ${sourceColors[source].bg} ${sourceColors[source].text} font-medium`}>
                {source}
              </span>
              {idx < sources.length - 1 && (
                <span className="text-slate-400">+</span>
              )}
            </span>
          ))}
          <span className="text-slate-400">→</span>
          <span className="px-3 py-1 bg-indigo-100 text-indigo-800 rounded font-medium">
            Unified Record
          </span>
        </div>
        <p className="text-xs text-slate-500 mt-2">
          Data dari {sources.length} sistem berbeda telah dinormalisasi dan digabungkan 
          dengan total {record.mappings.length} field yang dipetakan.
        </p>
      </div>
    </section>
  );
}
