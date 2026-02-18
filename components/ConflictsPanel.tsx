'use client';

import { useMemo, useState } from 'react';
import { CanonicalRecord } from '@/lib/types';

interface Props {
  record: CanonicalRecord | null;
  onResolve: (id: string, strategy: 'choose_one' | 'keep_both', value: string, note?: string) => void;
}

export function ConflictsPanel({ record, onResolve }: Props) {
  const [selectedConflict, setSelectedConflict] = useState<string | null>(null);
  const [strategy, setStrategy] = useState<'choose_one' | 'keep_both'>('choose_one');
  const [value, setValue] = useState('');
  const [note, setNote] = useState('');

  const conflict = useMemo(() => record?.conflicts.find((c) => c.id === selectedConflict), [record, selectedConflict]);

  if (!record) return <section id="conflicts" className="card text-sm text-slate-500">No conflict analysis yet.</section>;

  return (
    <section id="conflicts" className="card">
      <h3 className="mb-2 text-lg font-semibold">Conflicts Panel</h3>
      <div className="space-y-3">
        {record.conflicts.map((conf) => (
          <div key={conf.id} className="rounded-lg border p-3 text-sm">
            <div className="mb-1 flex items-center justify-between">
              <p><strong>{conf.category}</strong> · {conf.field}</p>
              <span className={`rounded px-2 py-0.5 text-xs ${conf.resolved ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}>
                {conf.resolved ? 'Resolved' : 'Conflict'}
              </span>
            </div>
            {conf.values.map((v, idx) => <p key={idx} className="text-xs text-slate-600">{v.value} ({Math.round(v.confidence * 100)}%) from {v.provenance.source}</p>)}
            {!conf.resolved && (
              <button onClick={() => { setSelectedConflict(conf.id); setValue(conf.values[0]?.value ?? ''); }} className="mt-2 rounded bg-blue-600 px-2 py-1 text-xs text-white">Resolve</button>
            )}
          </div>
        ))}
      </div>

      {conflict && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-md rounded-xl bg-white p-4">
            <h4 className="text-base font-semibold">Resolve {conflict.category} conflict</h4>
            <label className="mt-2 block text-xs">Resolution strategy</label>
            <select value={strategy} onChange={(e) => setStrategy(e.target.value as any)} className="w-full rounded border px-2 py-1 text-sm">
              <option value="choose_one">Choose one value</option>
              <option value="keep_both">Keep both + note</option>
            </select>
            <label className="mt-2 block text-xs">Value</label>
            <input value={value} onChange={(e) => setValue(e.target.value)} className="w-full rounded border px-2 py-1 text-sm" />
            <label className="mt-2 block text-xs">Note</label>
            <textarea value={note} onChange={(e) => setNote(e.target.value)} className="w-full rounded border px-2 py-1 text-sm" rows={3} />
            <div className="mt-3 flex justify-end gap-2">
              <button onClick={() => setSelectedConflict(null)} className="rounded border px-3 py-1.5 text-sm">Cancel</button>
              <button onClick={() => { onResolve(conflict.id, strategy, value, note); setSelectedConflict(null); }} className="rounded bg-blue-600 px-3 py-1.5 text-sm text-white">Save resolution</button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
