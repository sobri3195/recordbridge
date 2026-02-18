'use client';

import { useMemo, useState } from 'react';
import { AuditLog } from '@/components/AuditLog';
import { CanonicalSummary } from '@/components/CanonicalSummary';
import { ConflictsPanel } from '@/components/ConflictsPanel';
import { ExportPanel } from '@/components/ExportPanel';
import { MappingTable } from '@/components/MappingTable';
import { RawViewer } from '@/components/RawViewer';
import { Timeline } from '@/components/Timeline';
import { resolveConflict, runTranslation } from '@/lib/mappingEngine';
import { CanonicalRecord, SourceSystem } from '@/lib/types';

export default function DemoPage() {
  const [activeTab, setActiveTab] = useState<SourceSystem>('EHR_A');
  const [selectedSources, setSelectedSources] = useState<SourceSystem[]>(['EHR_A', 'SIMRS_B', 'CLINIC_C']);
  const [record, setRecord] = useState<CanonicalRecord | null>(null);
  const [loading, setLoading] = useState(false);
  const [showProvenance, setShowProvenance] = useState(true);

  const toggleSource = (source: SourceSystem) => {
    setSelectedSources((prev) => prev.includes(source) ? prev.filter((s) => s !== source) : [...prev, source]);
  };

  const run = () => {
    setLoading(true);
    setTimeout(() => {
      setRecord(runTranslation(selectedSources));
      setLoading(false);
    }, 500);
  };

  const diagnosisEntities = useMemo(() => record?.conditions ?? [], [record]);

  return (
    <div className="space-y-6">
      <div className="card bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">🩺 Schema-less EHR/SIMRS Translator Demo</h1>
            <p className="mt-1 text-blue-100">Feature Tour: mapping • timeline • conflicts • provenance • export</p>
          </div>
          <div className="hidden flex-wrap gap-2 md:flex">
            {(['mapping', 'timeline', 'conflicts', 'provenance', 'export'] as const).map((f) => (
              <a key={f} href={`#${f}`} className="rounded-full bg-white/20 px-3 py-1 text-xs font-medium text-white hover:bg-white/30">
                #{f}
              </a>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <RawViewer
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          selectedSources={selectedSources}
          onToggleSource={toggleSource}
          onRun={run}
          loading={loading}
        />

        <div className="space-y-6">
          <CanonicalSummary record={record} />
          <MappingTable record={record} showProvenance={showProvenance} />

          <section className="card">
            <div className="mb-3 flex items-center gap-2">
              <h3 className="text-lg font-semibold">🩺 Diagnosis Normalization</h3>
              <span className="rounded-full bg-indigo-100 px-2 py-0.5 text-xs font-medium text-indigo-700">
                {diagnosisEntities.length} diagnoses
              </span>
            </div>
            <p className="mb-3 text-sm text-slate-600">Extracted entities from ICD and free-text (e.g., diabetes, kencing manis) are normalized to canonical conditions.</p>
            {!record ? <p className="rounded-lg bg-slate-50 p-4 text-center text-sm text-slate-500">No diagnosis extraction yet.</p> : (
              <div className="space-y-2">
                {diagnosisEntities.map((d) => (
                  <div key={d.id} className="rounded-lg border border-slate-200 bg-slate-50 p-3">
                    <div className="flex items-center justify-between">
                      <p className="font-semibold text-slate-800">{d.canonicalName}</p>
                      {d.code && (
                        <span className="rounded bg-blue-100 px-2 py-0.5 text-xs font-mono text-blue-700">
                          {d.code}
                        </span>
                      )}
                    </div>
                    <p className="mt-1 text-xs text-slate-600">Source entity: "{d.sourceText}"</p>
                    <p className="mt-1 text-xs">
                      <span className={`font-medium ${d.confidence >= 0.75 ? 'text-emerald-600' : 'text-amber-600'}`}>
                        Confidence: {Math.round(d.confidence * 100)}%
                      </span>
                    </p>
                  </div>
                ))}
              </div>
            )}
          </section>

          <ConflictsPanel
            record={record}
            onResolve={(id, strategy, value, note) => {
              if (!record) return;
              setRecord(resolveConflict(record, id, strategy, value, note));
            }}
          />

          <section id="provenance" className="card">
            <h3 className="mb-3 text-lg font-semibold">📋 Provenance & Trust</h3>
            <label className="inline-flex cursor-pointer items-center gap-2 rounded-lg bg-slate-100 px-4 py-2 text-sm">
              <input 
                type="checkbox" 
                checked={showProvenance} 
                onChange={(e) => setShowProvenance(e.target.checked)} 
                className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
              />
              <span>Show provenance inline</span>
            </label>
            <p className="mt-3 text-xs text-slate-500">When enabled, source system, timestamp, and confidence appear across mappings/timeline to support traceability. Every datapoint can be traced back to its origin.</p>
          </section>

          <Timeline record={record} showProvenance={showProvenance} />
          
          <ExportPanel
            record={record}
            onExport={() => {
              if (!record) return;
              setRecord({
                ...record,
                auditLog: [
                  {
                    id: `audit-export-${Date.now()}`,
                    action: 'export_run',
                    message: 'Referral packet exported as JSON.',
                    timestamp: new Date().toISOString()
                  },
                  ...record.auditLog
                ]
              });
            }}
          />
          <AuditLog record={record} />
        </div>
      </div>
    </div>
  );
}