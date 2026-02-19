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

const sourceIcons: Record<SourceSystem, string> = {
  EHR_A: '🏥',
  SIMRS_B: '💻',
  CLINIC_C: '🏨'
};

const sourceColors: Record<SourceSystem, string> = {
  EHR_A: 'border-blue-200 bg-blue-50 text-blue-800',
  SIMRS_B: 'border-emerald-200 bg-emerald-50 text-emerald-800',
  CLINIC_C: 'border-purple-200 bg-purple-50 text-purple-800'
};

export function RawViewer({ activeTab, setActiveTab, selectedSources, onToggleSource, onRun, loading }: Props) {
  const source = RAW_SOURCES.find((s) => s.source === activeTab) ?? RAW_SOURCES[0];

  return (
    <section className="card">
      <div className="mb-4 flex items-center gap-2">
        <h2 className="text-lg font-semibold">📥 Raw Source Data</h2>
        <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-600">
          {selectedSources.length} selected
        </span>
      </div>
      
      <p className="mb-4 text-sm text-slate-600">Select inputs to merge. Untuk implementasi nyata, data bisa masuk lewat upload PDF, Excel, CSV, JSON, atau koneksi API.</p>

      <div className="mb-4 flex flex-wrap gap-2">
        {['PDF', 'Excel', 'CSV', 'JSON', 'API Connector'].map((format) => (
          <span key={format} className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-medium text-slate-600">
            {format}
          </span>
        ))}
      </div>
      
      <div className="mb-4 flex flex-wrap gap-2">
        {(Object.keys(SOURCE_LABELS) as SourceSystem[]).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-all ${activeTab === tab ? 'bg-blue-600 text-white shadow-md' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}`}
          >
            <span>{sourceIcons[tab]}</span>
            {SOURCE_LABELS[tab]}
          </button>
        ))}
      </div>

      <div className="mb-4 rounded-lg border border-slate-200 bg-slate-50 p-3">
        <p className="mb-3 text-sm font-medium text-slate-700">Choose data sources to merge:</p>
        <div className="flex flex-wrap gap-3">
          {(Object.keys(SOURCE_LABELS) as SourceSystem[]).map((src) => (
            <label key={src} className={`flex cursor-pointer items-center gap-2 rounded-lg border-2 px-3 py-2 text-sm transition-all ${selectedSources.includes(src) ? sourceColors[src] : 'border-slate-200 bg-white hover:border-slate-300'}`}>
              <input 
                type="checkbox" 
                checked={selectedSources.includes(src)} 
                onChange={() => onToggleSource(src)} 
                className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="font-medium">{sourceIcons[src]}</span>
              <span>{SOURCE_LABELS[src]}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="relative">
        <div className="mb-2 flex items-center justify-between">
          <p className="text-sm font-medium text-slate-700">
            📄 {sourceIcons[activeTab]} {SOURCE_LABELS[activeTab]} Data Structure
          </p>
          <span className="text-xs text-slate-500">Last updated: {new Date(source.updatedAt).toLocaleString('id-ID')}</span>
        </div>
        <pre className="max-h-[400px] overflow-auto rounded-lg bg-slate-900 p-4 text-xs text-slate-100 shadow-inner">
          {JSON.stringify(source.payload, null, 2)}
        </pre>
      </div>

      <button
        onClick={onRun}
        disabled={loading}
        className={`mt-4 w-full rounded-lg px-4 py-3 text-sm font-semibold transition-all ${loading ? 'bg-slate-400 cursor-not-allowed' : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700'} text-white shadow-lg hover:shadow-xl`}
      >
        {loading ? (
          <div className="flex items-center justify-center gap-2">
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
            Translating with deterministic mapping rules...
          </div>
        ) : (
          <div className="flex items-center justify-center gap-2">
            <span>🚀</span>
            Run Translation
            <span>({selectedSources.length} sources)</span>
          </div>
        )}
      </button>
      
      {selectedSources.length === 0 && !loading && (
        <p className="mt-2 text-center text-xs text-amber-600">⚠️ Please select at least one data source to run translation.</p>
      )}
    </section>
  );
}
