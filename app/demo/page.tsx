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

  const selectAllSources = () => {
    setSelectedSources(['EHR_A', 'SIMRS_B', 'CLINIC_C']);
  };

  const clearSources = () => {
    setSelectedSources([]);
  };

  const run = () => {
    if (selectedSources.length === 0) return;
    setLoading(true);
    setTimeout(() => {
      setRecord(runTranslation(selectedSources));
      setLoading(false);
    }, 500);
  };

  const activateAllFeatures = () => {
    const allSources: SourceSystem[] = ['EHR_A', 'SIMRS_B', 'CLINIC_C'];
    setSelectedSources(allSources);
    setShowProvenance(true);
    setLoading(true);
    setTimeout(() => {
      setRecord(runTranslation(allSources));
      setLoading(false);
    }, 500);
  };

  const autoResolveConflicts = () => {
    if (!record) return;
    const unresolved = record.conflicts.filter((c) => !c.resolved);
    if (unresolved.length === 0) return;

    const updated = unresolved.reduce((acc, conflict) => {
      const bestValue = conflict.values.reduce((best, current) =>
        current.confidence > best.confidence ? current : best
      );
      return resolveConflict(acc, conflict.id, 'choose_one', bestValue.value, 'Auto-resolved by highest confidence.');
    }, record);

    setRecord(updated);
  };

  const diagnosisEntities = useMemo(() => record?.conditions ?? [], [record]);

  return (
    <div className="space-y-8">
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 p-8 text-white shadow-2xl animate-gradient">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMtOS45NDEgMC0xOCA4LjA1OS0xOCAxOHM4LjA1OSAxOCAxOCAxOCAxOC04LjA1OSAxOC0xOC04LjA1OS0xOC0xOC0xOHptMCAzMmMtNy43MzIgMC0xNC02LjI2OC0xNC0xNHM2LjI2OC0xNCAxNC0xNCAxNCA2LjI2OCAxNCAxNC02LjI2OCAxNC0xNCAxNHoiIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iLjA1Ii8+PC9nPjwvc3ZnPg==')] opacity-20"></div>
        <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-white/10 blur-3xl animate-pulse-glow"></div>
        
        <div className="relative z-10">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="animate-slideInLeft">
              <h1 className="text-3xl font-extrabold md:text-4xl">
                🩺 Schema-less EHR/SIMRS Translator
              </h1>
              <p className="mt-2 text-lg text-blue-100">
                Feature Tour: mapping • timeline • conflicts • provenance • export
              </p>
            </div>
            <div className="hidden flex-wrap gap-2 md:flex animate-slideInRight">
              {(['mapping', 'timeline', 'conflicts', 'provenance', 'export'] as const).map((f) => (
                <a 
                  key={f} 
                  href={`#${f}`} 
                  className="group rounded-full bg-white/20 px-4 py-2 text-xs font-medium text-white backdrop-blur-sm transition-all hover:bg-white/30 hover:scale-105"
                >
                  #{f}
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <RawViewer
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          selectedSources={selectedSources}
          onToggleSource={toggleSource}
          onSelectAllSources={selectAllSources}
          onClearSources={clearSources}
          onRun={run}
          loading={loading}
        />

        <div className="space-y-6">
          <CanonicalSummary record={record} />
          <MappingTable record={record} showProvenance={showProvenance} />

          <section className="card-gradient">
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="rounded-xl bg-gradient-to-br from-indigo-100 to-purple-100 p-2 shadow-inner">
                  <span className="text-xl">🩺</span>
                </div>
                <h3 className="text-xl font-bold text-gradient">Diagnosis Normalization</h3>
              </div>
              <span className="badge-purple">
                {diagnosisEntities.length} diagnoses
              </span>
            </div>
            <p className="mb-4 text-sm text-slate-600 leading-relaxed">Extracted entities from ICD and free-text (e.g., diabetes, kencing manis) are normalized to canonical conditions.</p>
            {!record ? (
              <div className="rounded-2xl bg-slate-50 p-6 text-center">
                <span className="mb-2 block text-4xl opacity-50">📋</span>
                <p className="text-sm text-slate-500">No diagnosis extraction yet.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {diagnosisEntities.map((d, i) => (
                  <div 
                    key={d.id} 
                    className={`card stagger-${(i % 5) + 1} animate-fadeIn bg-gradient-to-br from-white to-indigo-50/30`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <p className="text-lg font-bold text-slate-800">{d.canonicalName}</p>
                        <p className="mt-1 text-sm text-slate-600">Source entity: "{d.sourceText}"</p>
                        <div className="mt-2 flex items-center gap-2">
                          {d.code && (
                            <span className="rounded-lg bg-gradient-to-r from-blue-100 to-indigo-100 px-3 py-1 text-xs font-mono font-bold text-blue-700 shadow-sm">
                              {d.code}
                            </span>
                          )}
                          <span className={`rounded-full px-3 py-1 text-xs font-bold ${d.confidence >= 0.75 ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                            {d.confidence >= 0.75 ? '✓' : '!'} {Math.round(d.confidence * 100)}%
                          </span>
                        </div>
                      </div>
                    </div>
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

          <section id="provenance" className="card-gradient">
            <div className="mb-4 flex items-center gap-3">
              <div className="rounded-xl bg-gradient-to-br from-blue-100 to-cyan-100 p-2 shadow-inner">
                <span className="text-xl">📋</span>
              </div>
              <h3 className="text-xl font-bold text-gradient">Provenance & Trust</h3>
            </div>
            <label className="group inline-flex cursor-pointer items-center gap-3 rounded-2xl bg-gradient-to-r from-slate-50 to-slate-100 px-5 py-3 text-sm transition-all hover:shadow-md hover:from-blue-50 hover:to-indigo-50">
              <div className="relative">
                <input 
                  type="checkbox" 
                  checked={showProvenance} 
                  onChange={(e) => setShowProvenance(e.target.checked)} 
                  className="peer h-5 w-5 cursor-pointer appearance-none rounded-lg border-2 border-slate-300 bg-white transition-all checked:border-blue-500 checked:bg-blue-500 hover:border-blue-400"
                />
                <svg className="pointer-events-none absolute inset-0 m-auto h-3 w-3 text-white opacity-0 transition-opacity peer-checked:opacity-100" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="4">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <span className="font-medium text-slate-700">Show provenance inline</span>
            </label>
            <p className="mt-4 text-sm text-slate-600 leading-relaxed">When enabled, source system, timestamp, and confidence appear across mappings/timeline to support traceability. Every datapoint can be traced back to its origin.</p>
          </section>

          <section className="card-gradient">
            <div className="mb-4 flex items-center gap-3">
              <div className="rounded-xl bg-gradient-to-br from-emerald-100 to-cyan-100 p-2 shadow-inner">
                <span className="text-xl">⚙️</span>
              </div>
              <h3 className="text-xl font-bold text-gradient">Feature Activation Center</h3>
            </div>
            <p className="mb-4 text-sm text-slate-600">Aktifkan seluruh alur demo secara cepat: pilih semua sumber, jalankan translasi, tampilkan provenance, dan selesaikan konflik otomatis.</p>
            <div className="grid gap-2 sm:grid-cols-2">
              <button onClick={activateAllFeatures} className="btn-primary">
                🚀 Activate all features
              </button>
              <button onClick={autoResolveConflicts} disabled={!record} className="btn-secondary disabled:cursor-not-allowed disabled:opacity-60">
                ✅ Auto-resolve all conflicts
              </button>
            </div>
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
