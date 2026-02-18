'use client';

import { useMemo, useState } from 'react';
import { CanonicalRecord } from '@/lib/types';
import { SOURCE_LABELS } from '@/lib/mockData';

interface Props {
  record: CanonicalRecord | null;
  onResolve: (id: string, strategy: 'choose_one' | 'keep_both', value: string, note?: string) => void;
}

const conflictIcons: Record<string, string> = {
  Allergy: '⚠️',
  Medication: '💊',
  Diagnosis: '🩺'
};

const sourceColors: Record<string, string> = {
  EHR_A: 'bg-blue-100 text-blue-700 border-blue-200',
  SIMRS_B: 'bg-emerald-100 text-emerald-700 border-emerald-200',
  CLINIC_C: 'bg-purple-100 text-purple-700 border-purple-200'
};

export function ConflictsPanel({ record, onResolve }: Props) {
  const [selectedConflict, setSelectedConflict] = useState<string | null>(null);
  const [strategy, setStrategy] = useState<'choose_one' | 'keep_both'>('choose_one');
  const [value, setValue] = useState('');
  const [note, setNote] = useState('');

  const conflict = useMemo(() => record?.conflicts.find((c) => c.id === selectedConflict), [record, selectedConflict]);

  // Calculate system recommendation based on highest confidence
  const getSystemRecommendation = (conflict: any) => {
    if (!conflict || conflict.values.length === 0) return null;
    
    const highestConfidence = Math.max(...conflict.values.map((v: any) => v.confidence));
    const recommendedValue = conflict.values.find((v: any) => v.confidence === highestConfidence);
    
    return {
      value: recommendedValue?.value || '',
      confidence: highestConfidence * 100,
      source: recommendedValue?.provenance.source
    };
  };

  if (!record) return <section id="conflicts" className="card text-sm text-slate-500">No conflict analysis yet.</section>;

  return (
    <section id="conflicts" className="card">
      <div className="mb-3 flex items-center gap-2">
        <h3 className="text-lg font-semibold">🔄 Conflict Resolution</h3>
        <span className="rounded-full bg-rose-100 px-2 py-0.5 text-xs font-medium text-rose-700">
          {record.conflicts.filter(c => !c.resolved).length} unresolved
        </span>
      </div>
      
      <div className="space-y-3">
        {record.conflicts.length === 0 ? (
          <div className="rounded-lg bg-emerald-50 p-4 text-center text-sm text-emerald-700">
            ✨ No conflicts detected! Data sources are consistent.
          </div>
        ) : (
          record.conflicts.map((conf) => (
            <div key={conf.id} className="rounded-lg border-2 border-slate-200 p-4 text-sm">
              <div className="mb-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-lg">{conflictIcons[conf.category]}</span>
                  <div>
                    <p className="font-semibold text-slate-800">{conf.category}</p>
                    <p className="text-xs text-slate-600">{conf.field}</p>
                  </div>
                </div>
                <span className={`rounded-full px-3 py-1 text-xs font-medium ${
                  conf.resolved 
                    ? 'bg-emerald-100 text-emerald-700' 
                    : 'bg-rose-100 text-rose-700'
                }`}>
                  {conf.resolved ? '✅ Resolved' : '⚠️ Conflict'}
                </span>
              </div>
              
              {conf.resolved && conf.resolution ? (
                <div className="rounded-lg bg-emerald-50 p-3">
                  <p className="font-medium text-emerald-800">Resolution Applied:</p>
                  <p className="text-sm text-emerald-700">{conf.resolution.value}</p>
                  <p className="text-xs text-emerald-600">
                    Strategy: {conf.resolution.strategy} • {new Date(conf.resolution.resolvedAt).toLocaleString('id-ID')}
                  </p>
                  {conf.resolution.note && <p className="mt-1 text-xs text-emerald-600">Note: {conf.resolution.note}</p>}
                </div>
              ) : (
                <div className="space-y-3">
                  <div>
                    <p className="mb-2 font-medium text-slate-700">Conflicting Values:</p>
                    <div className="space-y-2">
                      {conf.values.map((v, idx) => (
                        <div key={idx} className="flex items-center justify-between rounded border border-slate-200 bg-slate-50 p-2">
                          <div className="flex items-center gap-2">
                            <span className={`rounded border px-2 py-0.5 text-xs font-medium ${sourceColors[v.provenance.source]}`}>
                              {SOURCE_LABELS[v.provenance.source]}
                            </span>
                            <span className="font-medium text-slate-800">{v.value}</span>
                          </div>
                          <span className={`text-xs ${v.confidence >= 0.75 ? 'text-emerald-600' : 'text-amber-600'}`}>
                            {Math.round(v.confidence * 100)}%
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="rounded-lg bg-blue-50 p-3">
                    <p className="mb-1 font-medium text-blue-800">🤖 System Recommendation:</p>
                    {(() => {
                      const recommendation = getSystemRecommendation(conf);
                      return recommendation ? (
                        <div className="flex items-center justify-between">
                          <span className="text-blue-700">→ Selected: <strong>{recommendation.value}</strong></span>
                          <span className="rounded-full bg-blue-200 px-2 py-0.5 text-xs font-medium text-blue-800">
                            {Math.round(recommendation.confidence)}%
                          </span>
                        </div>
                      ) : <p className="text-blue-600">No recommendation available</p>;
                    })()}
                  </div>
                  
                  <button 
                    onClick={() => { 
                      const recommendation = getSystemRecommendation(conf);
                      setSelectedConflict(conf.id); 
                      setValue(recommendation?.value || conf.values[0]?.value || ''); 
                    }} 
                    className="w-full rounded-lg bg-blue-600 px-3 py-2 text-sm font-medium text-white hover:bg-blue-700 transition-colors"
                  >
                    🔧 Resolve This Conflict
                  </button>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {conflict && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl">
            <h4 className="mb-4 text-lg font-semibold">Resolve {conflict.category} conflict</h4>
            
            <div className="space-y-4">
              <div>
                <label className="mb-1 block text-xs font-medium">Resolution strategy</label>
                <select 
                  value={strategy} 
                  onChange={(e) => setStrategy(e.target.value as any)} 
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                >
                  <option value="choose_one">Choose one value</option>
                  <option value="keep_both">Keep both + note</option>
                </select>
              </div>
              
              <div>
                <label className="mb-1 block text-xs font-medium">Value</label>
                <input 
                  value={value} 
                  onChange={(e) => setValue(e.target.value)} 
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none" 
                />
              </div>
              
              <div>
                <label className="mb-1 block text-xs font-medium">Note (optional)</label>
                <textarea 
                  value={note} 
                  onChange={(e) => setNote(e.target.value)} 
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none" 
                  rows={3}
                  placeholder="Add clinical note about the resolution..."
                />
              </div>
            </div>
            
            <div className="mt-6 flex justify-end gap-3">
              <button 
                onClick={() => setSelectedConflict(null)} 
                className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button 
                onClick={() => { 
                  onResolve(conflict.id, strategy, value, note); 
                  setSelectedConflict(null);
                  setValue('');
                  setNote('');
                }} 
                className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
              >
                Save Resolution
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}