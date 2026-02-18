'use client';

import { useMemo, useState } from 'react';
import { CanonicalRecord, TimelineEvent as Event } from '@/lib/types';

const filters: Event['type'][] = ['Encounter', 'Lab', 'Meds', 'Diagnosis', 'Vitals'];

export function Timeline({ record, showProvenance }: { record: CanonicalRecord | null; showProvenance: boolean }) {
  const [active, setActive] = useState<Event['type'][]>(filters);

  const data = useMemo(() => record?.timelineEvents.filter((e) => active.includes(e.type)) ?? [], [record, active]);

  return (
    <section id="timeline" className="card">
      <h3 className="mb-2 text-lg font-semibold">Unified Timeline</h3>
      <div className="mb-3 flex flex-wrap gap-2 text-xs">
        {filters.map((f) => (
          <button
            key={f}
            onClick={() => setActive((prev) => prev.includes(f) ? prev.filter((v) => v !== f) : [...prev, f])}
            className={`rounded-full px-3 py-1 ${active.includes(f) ? 'bg-blue-600 text-white' : 'bg-slate-100'}`}
          >
            {f}
          </button>
        ))}
      </div>
      <div className="space-y-2 text-sm">
        {data.length === 0 && <p className="text-slate-500">No events in selected filters.</p>}
        {data.map((e) => (
          <div key={e.id} className={`rounded border p-2 ${e.conflict ? 'border-rose-300' : 'border-slate-200'}`}>
            <p><strong>{new Date(e.occurredAt).toLocaleString()}</strong> · {e.type} · {e.title}</p>
            <p>{e.value}</p>
            {showProvenance && <p className="text-xs text-slate-500">{e.provenance.source} · {Math.round(e.confidence * 100)}%</p>}
          </div>
        ))}
      </div>
    </section>
  );
}
