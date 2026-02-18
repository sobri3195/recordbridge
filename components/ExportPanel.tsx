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
    a.download = `referral-packet-${record.patient.identifiers[0] || 'patient'}-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(href);
    onExport();
  };

  const exportStats = record ? {
    conditions: record.conditions.length,
    medications: record.medications.length,
    allergies: record.allergies.length,
    observations: record.observations.length,
    timeline: record.timelineEvents.length,
    conflicts: record.conflicts.filter(c => !c.resolved).length
  } : null;

  return (
    <section id="export" className="card">
      <div className="mb-3 flex items-center gap-2">
        <h3 className="text-lg font-semibold">📤 Export Referral Packet</h3>
        {record && (
          <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-medium text-emerald-700">
            Ready to export
          </span>
        )}
      </div>
      
      <p className="mb-4 text-sm text-slate-600">Generate a comprehensive handover packet containing patient problems, medications, allergies, vital signs, labs, unresolved conflicts, and full provenance trail for seamless care transitions.</p>
      
      {exportStats && (
        <div className="mb-4 rounded-lg bg-slate-50 p-3">
          <p className="mb-2 text-sm font-medium text-slate-700">Export will include:</p>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="flex items-center gap-2">
              <span>🩺</span>
              <span>{exportStats.conditions} diagnoses</span>
            </div>
            <div className="flex items-center gap-2">
              <span>💊</span>
              <span>{exportStats.medications} medications</span>
            </div>
            <div className="flex items-center gap-2">
              <span>⚠️</span>
              <span>{exportStats.allergies} allergies</span>
            </div>
            <div className="flex items-center gap-2">
              <span>📊</span>
              <span>{exportStats.observations} observations</span>
            </div>
            <div className="flex items-center gap-2">
              <span>🗓️</span>
              <span>{exportStats.timeline} timeline events</span>
            </div>
            <div className="flex items-center gap-2">
              <span>⚠️</span>
              <span>{exportStats.conflicts} unresolved conflicts</span>
            </div>
          </div>
        </div>
      )}
      
      <button 
        disabled={!record} 
        onClick={runExport} 
        className={`w-full rounded-lg px-4 py-3 text-sm font-semibold transition-all ${record ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white hover:from-emerald-700 hover:to-teal-700 shadow-lg hover:shadow-xl' : 'bg-slate-200 text-slate-500 cursor-not-allowed'} flex items-center justify-center gap-2`}
      >
        {record ? (
          <>
            <span>📥</span>
            Download Referral Packet
          </>
        ) : (
          <>
            <span>⏳</span>
            Run translation first
          </>
        )}
      </button>
      
      {record && (
        <div className="mt-3 rounded-lg border border-emerald-200 bg-emerald-50 p-3">
          <p className="text-xs text-emerald-800">✨ Export includes full provenance trail for transparency and compliance. File format: JSON with complete audit log.</p>
        </div>
      )}
    </section>
  );
}