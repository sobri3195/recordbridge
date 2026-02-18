'use client';

import { useMemo, useState } from 'react';
import { AIClinicalSummary } from '@/components/AIClinicalSummary';
import { AuditLog } from '@/components/AuditLog';
import { BilingualTerms } from '@/components/BilingualTerms';
import { CanonicalSummary } from '@/components/CanonicalSummary';
import { ConflictsPanel } from '@/components/ConflictsPanel';
import { ExportPanel } from '@/components/ExportPanel';
import { MappingTable } from '@/components/MappingTable';
import { RawViewer } from '@/components/RawViewer';
import { SourceProvenance } from '@/components/SourceProvenance';
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
    <div className="space-y-5">
      <div className="card">
        <h1 className="text-2xl font-bold">Schema-less EHR/SIMRS Translator Demo</h1>
        <p className="text-sm text-slate-600">Feature Tour: 
          <a href="#mapping" className="ml-2 text-blue-600">#mapping</a>
          <a href="#timeline" className="ml-2 text-blue-600">#timeline</a>
          <a href="#conflicts" className="ml-2 text-blue-600">#conflicts</a>
          <a href="#provenance" className="ml-2 text-blue-600">#provenance</a>
          <a href="#export" className="ml-2 text-blue-600">#export</a>
        </p>
      </div>

      {/* AI Clinical Summary - New Feature */}
      <AIClinicalSummary record={record} />

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        <RawViewer
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          selectedSources={selectedSources}
          onToggleSource={toggleSource}
          onRun={run}
          loading={loading}
        />

        <div className="space-y-5">
          {/* Source Provenance Visual - New Feature */}
          <SourceProvenance record={record} />
          
          <CanonicalSummary record={record} />
          <MappingTable record={record} showProvenance={showProvenance} />

          <section className="card">
            <h3 className="mb-2 text-lg font-semibold">Diagnosis Normalization</h3>
            <p className="mb-3 text-sm text-slate-600">Extracted entities from ICD and free-text (e.g., diabetes, kencing manis) are normalized to canonical conditions.</p>
            {!record ? <p className="text-sm text-slate-500">No diagnosis extraction yet.</p> : (
              <div className="space-y-2 text-sm">
                {diagnosisEntities.map((d) => (
                  <div key={d.id} className="rounded border p-2">
                    <p><strong>{d.canonicalName}</strong> {d.code ? `(${d.code})` : ''}</p>
                    <p className="text-xs text-slate-600">Source entity: “{d.sourceText}” · Confidence {Math.round(d.confidence * 100)}%</p>
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
            <h3 className="mb-2 text-lg font-semibold">Provenance & Trust</h3>
            <label className="inline-flex items-center gap-2 text-sm">
              <input type="checkbox" checked={showProvenance} onChange={(e) => setShowProvenance(e.target.checked)} />
              Show provenance inline
            </label>
            <p className="mt-2 text-xs text-slate-500">When enabled, source system, timestamp, and confidence appear across mappings/timeline to support traceability.</p>
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
          
          {/* Bilingual Terminology - New Feature */}
          <BilingualTerms />
        </div>
      </div>
    </div>
  );
}
