'use client';

import { RAW_SOURCES, SOURCE_LABELS } from '@/lib/mockData';
import { SourceSystem } from '@/lib/types';

interface Props {
  activeTab: SourceSystem;
  setActiveTab: (tab: SourceSystem) => void;
  selectedSources: SourceSystem[];
  onToggleSource: (source: SourceSystem) => void;
  onRun: () => void;
  loading: boolean;
}

export function RawViewer({ activeTab, setActiveTab, selectedSources, onToggleSource, onRun, loading }: Props) {
  const source = RAW_SOURCES.find((s) => s.source === activeTab) ?? RAW_SOURCES[0];

  return (
    <section className="card">
      <h2 className="text-lg font-semibold">Raw Sources</h2>
      <p className="mb-4 text-sm text-slate-600">Select inputs to merge. The raw schemas intentionally differ to simulate real-world EHR fragmentation.</p>
      <div className="mb-3 flex gap-2">
        {(Object.keys(SOURCE_LABELS) as SourceSystem[]).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`rounded-lg px-3 py-1.5 text-sm ${activeTab === tab ? 'bg-blue-600 text-white' : 'bg-slate-100'}`}
          >
            {SOURCE_LABELS[tab]}
          </button>
        ))}
      </div>

      <div className="mb-4 flex flex-wrap gap-2">
        {(Object.keys(SOURCE_LABELS) as SourceSystem[]).map((src) => (
          <label key={src} className="flex items-center gap-2 rounded border px-2 py-1 text-xs">
            <input type="checkbox" checked={selectedSources.includes(src)} onChange={() => onToggleSource(src)} />
            Merge {SOURCE_LABELS[src]}
          </label>
        ))}
      </div>

      <pre className="max-h-[380px] overflow-auto rounded-lg bg-slate-900 p-3 text-xs text-slate-100">
        {JSON.stringify(source.payload, null, 2)}
      </pre>

      <button
        onClick={onRun}
        className="mt-4 w-full rounded-lg bg-blue-600 px-4 py-2 text-white transition hover:bg-blue-700 disabled:opacity-60"
        disabled={loading}
      >
        {loading ? 'Translating with deterministic mapping rules...' : 'Run Translation'}
      </button>
    </section>
  );
}
