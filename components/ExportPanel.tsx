'use client';

import { buildExportSummary } from '@/lib/mappingEngine';
import { CanonicalRecord } from '@/lib/types';

export function ExportPanel({ record, onExport }: { record: CanonicalRecord | null; onExport: () => void }) {
  const runExport = () => {
    if (!record) return;
    const blob = new Blob([JSON.stringify(buildExportSummary(record), null, 2)], { type: 'application/json' });
    const href = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = href;
    a.download = 'referral-packet.json';
    a.click();
    URL.revokeObjectURL(href);
    onExport();
  };

  return (
    <section id="export" className="card">
      <h3 className="mb-2 text-lg font-semibold">Export Referral Packet</h3>
      <p className="mb-3 text-sm text-slate-600">Download a handover packet containing problems, meds, allergies, vitals, labs, unresolved conflicts, and provenance footer.</p>
      <button disabled={!record} onClick={runExport} className="rounded-lg bg-blue-600 px-4 py-2 text-sm text-white disabled:opacity-50">Export Referral Packet</button>
    </section>
  );
}
