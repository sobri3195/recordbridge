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

  if (!record) return (
    <section id="conflicts" className="card-gradient">
      <div className="rounded-2xl bg-gradient-to-br from-slate-50 to-slate-100 p-6 text-center">
        <span className="mb-2 block text-4xl opacity-50">🔄</span>
        <p className="text-sm text-slate-500">No conflict analysis yet.</p>
      </div>
    </section>
  );

  return (
    <section id="conflicts" className="card-gradient animate-fadeIn">
      <div className="mb-5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="rounded-xl bg-gradient-to-br from-amber-100 to-orange-100 p-2 shadow-inner">
            <span className="text-xl">🔄</span>
          </div>
          <h3 className="text-xl font-bold text-gradient">Conflict Resolution</h3>
        </div>
        <span className={`badge ${record.conflicts.filter(c => !c.resolved).length === 0 ? 'badge-green' : 'badge-red'}`}>
          {record.conflicts.filter(c => !c.resolved).length} unresolved
        </span>
      </div>
      
      <div className="space-y-4">
        {record.conflicts.length === 0 ? (
          <div className="card bg-gradient-to-br from-emerald-50 to-teal-50 border-emerald-200/60 p-6 text-center">
            <div className="mb-3 inline-flex rounded-2xl bg-white p-3 shadow-md">
              <span className="text-3xl">✨</span>
            </div>
            <p className="font-semibold text-emerald-700">No conflicts detected! Data sources are consistent.</p>
          </div>
        ) : (
          record.conflicts.map((conf, index) => (
            <div 
              key={conf.id} 
              className={`card hover-lift stagger-${(index % 5) + 1} animate-fadeIn ${conf.resolved ? 'bg-gradient-to-br from-emerald-50/50 to-teal-50/50 border-emerald-200/60' : 'border-rose-300/60'}`}
            >
              <div className="mb-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`rounded-xl p-2 shadow-inner ${conf.resolved ? 'bg-gradient-to-br from-emerald-100 to-teal-100' : 'bg-gradient-to-br from-rose-100 to-pink-100'}`}>
                    <span className="text-lg">{conflictIcons[conf.category]}</span>
                  </div>
                  <div>
                    <p className="font-bold text-slate-800">{conf.category}</p>
                    <p className="text-xs text-slate-600">{conf.field}</p>
                  </div>
                </div>
                <span className={`rounded-full px-3 py-1 text-xs font-bold ${
                  conf.resolved 
                    ? 'bg-gradient-to-r from-emerald-100 to-teal-100 text-emerald-700' 
                    : 'bg-gradient-to-r from-rose-100 to-pink-100 text-rose-700'
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
                    className="btn-primary w-full"
                  >
                    <span className="flex items-center justify-center gap-2">
                      🔧 Resolve This Conflict
                    </span>
                  </button>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {conflict && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl border border-slate-200 animate-scaleIn">
            <h4 className="mb-5 text-xl font-bold text-gradient">Resolve {conflict.category} Conflict</h4>
            
            <div className="space-y-5">
              <div>
                <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-slate-600">Resolution strategy</label>
                <select 
                  value={strategy} 
                  onChange={(e) => setStrategy(e.target.value as any)} 
                  className="w-full rounded-xl border-2 border-slate-200 bg-white px-4 py-3 text-sm font-medium focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-500/10 transition-all"
                >
                  <option value="choose_one">Choose one value</option>
                  <option value="keep_both">Keep both + note</option>
                </select>
              </div>
              
              <div>
                <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-slate-600">Value</label>
                <input 
                  value={value} 
                  onChange={(e) => setValue(e.target.value)} 
                  className="w-full rounded-xl border-2 border-slate-200 bg-white px-4 py-3 text-sm font-medium focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-500/10 transition-all"
                />
              </div>
              
              <div>
                <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-slate-600">Note (optional)</label>
                <textarea 
                  value={note} 
                  onChange={(e) => setNote(e.target.value)} 
                  className="w-full rounded-xl border-2 border-slate-200 bg-white px-4 py-3 text-sm focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-500/10 transition-all resize-none"
                  rows={3}
                  placeholder="Add clinical note about the resolution..."
                />
              </div>
            </div>
            
            <div className="mt-6 flex justify-end gap-3">
              <button 
                onClick={() => setSelectedConflict(null)} 
                className="btn-secondary"
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
                className="btn-primary"
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