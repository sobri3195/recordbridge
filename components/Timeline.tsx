'use client';

import { useMemo, useState } from 'react';
import { CanonicalRecord, TimelineEvent as Event, SourceSystem } from '@/lib/types';
import { SOURCE_LABELS } from '@/lib/mockData';

const filters: Event['type'][] = ['Encounter', 'Lab', 'Meds', 'Diagnosis', 'Vitals'];

const sourceColors: Record<SourceSystem, string> = {
  EHR_A: 'bg-blue-100 text-blue-700 border-blue-200',
  SIMRS_B: 'bg-emerald-100 text-emerald-700 border-emerald-200',
  CLINIC_C: 'bg-purple-100 text-purple-700 border-purple-200'
};

const typeIcons: Record<Event['type'], string> = {
  Encounter: '🏥',
  Lab: '🔬',
  Meds: '💊',
  Diagnosis: '🩺',
  Vitals: '📊'
};

export function Timeline({ record, showProvenance }: { record: CanonicalRecord | null; showProvenance: boolean }) {
  const [active, setActive] = useState<Event['type'][]>(filters);

  const data = useMemo(() => record?.timelineEvents.filter((e) => active.includes(e.type)) ?? [], [record, active]);

  const getUniqueSources = (event: Event): SourceSystem[] => {
    return [event.provenance.source];
  };

  return (
    <section id="timeline" className="card">
      <div className="mb-3 flex items-center gap-2">
        <h3 className="text-lg font-semibold">🗓️ Patient Timeline</h3>
        <span className="rounded-full bg-indigo-100 px-2 py-0.5 text-xs font-medium text-indigo-700">
          {data.length} events
        </span>
      </div>
      
      <div className="mb-3 flex flex-wrap gap-2 text-xs">
        {filters.map((f) => (
          <button
            key={f}
            onClick={() => setActive((prev) => prev.includes(f) ? prev.filter((v) => v !== f) : [...prev, f])}
            className={`rounded-full px-3 py-1.5 transition-all ${active.includes(f) ? 'bg-blue-600 text-white shadow-md' : 'bg-slate-100 hover:bg-slate-200'}`}
          >
            {typeIcons[f]} {f}
          </button>
        ))}
      </div>
      
      <div className="space-y-3 text-sm">
        {data.length === 0 && <p className="rounded-lg bg-slate-50 p-4 text-center text-slate-500">No events in selected filters.</p>}
        {data.map((e) => (
          <div 
            key={e.id} 
            className={`relative rounded-lg border p-3 transition-all ${e.conflict ? 'border-rose-300 bg-rose-50' : 'border-slate-200 bg-white hover:shadow-md'}`}
          >
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="text-lg">{typeIcons[e.type]}</span>
                <div>
                  <p className="font-semibold text-slate-800">
                    {new Date(e.occurredAt).toLocaleDateString('id-ID', { 
                      year: 'numeric', 
                      month: 'short', 
                      day: 'numeric' 
                    })}
                  </p>
                  <p className="text-xs text-slate-600">{e.title}</p>
                </div>
              </div>
              {showProvenance && (
                <span className={`rounded-full border px-2 py-0.5 text-xs font-medium ${sourceColors[e.provenance.source]}`}>
                  {SOURCE_LABELS[e.provenance.source]}
                </span>
              )}
            </div>
            
            <div className="mt-2 flex items-center justify-between">
              <p className="rounded bg-slate-100 px-2 py-1 text-sm font-medium text-slate-700">{e.value}</p>
              {showProvenance && (
                <div className="flex items-center gap-1">
                  <span className={`text-xs ${e.confidence >= 0.75 ? 'text-emerald-600' : 'text-amber-600'}`}>
                    {Math.round(e.confidence * 100)}%
                  </span>
                </div>
              )}
            </div>
            
            {e.conflict && (
              <div className="mt-2 flex items-center gap-1 text-xs text-rose-600">
                <span>⚠️</span> Conflict detected
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
