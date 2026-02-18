import { CanonicalRecord } from '@/lib/types';
import { SOURCE_LABELS } from '@/lib/mockData';

const badge = (confidence: number) =>
  confidence < 0.75 ? 'rounded-full bg-amber-100 px-2 py-0.5 text-amber-700' : 'rounded-full bg-emerald-100 px-2 py-0.5 text-emerald-700';

const sourceColors: Record<keyof typeof SOURCE_LABELS, string> = {
  EHR_A: 'bg-blue-100 text-blue-700 border-blue-200',
  SIMRS_B: 'bg-emerald-100 text-emerald-700 border-emerald-200',
  CLINIC_C: 'bg-purple-100 text-purple-700 border-purple-200'
};

export function MappingTable({ record, showProvenance }: { record: CanonicalRecord | null; showProvenance: boolean }) {
  return (
    <section id="mapping" className="card">
      <div className="mb-3 flex items-center gap-2">
        <h3 className="text-lg font-semibold">🔄 Field Mapping Results</h3>
        <span className="rounded-full bg-indigo-100 px-2 py-0.5 text-xs font-medium text-indigo-700">
          {record?.mappings.length || 0} mappings
        </span>
      </div>
      
      <p className="mb-3 text-xs text-slate-500">🔍 Confidence reflects rule strength (dictionary/code match = higher). Source provenance shows data origin.</p>
      
      {!record ? (
        <div className="rounded-lg bg-slate-50 p-6 text-center text-slate-500">
          <p className="text-sm">No mappings yet.</p>
          <p className="text-xs">Run the translation to see field mappings between systems.</p>
        </div>
      ) : (
        <div className="overflow-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="border-b-2 bg-slate-50">
              <tr>
                {['Raw Field', 'Canonical Field', 'Normalized Value', 'Unit', 'Confidence', 'Sources'].map((h) => (
                  <th key={h} className="px-3 py-3 font-semibold text-slate-700">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {record.mappings.map((m) => (
                <tr key={m.id} className="border-b border-slate-200 transition-colors hover:bg-slate-50">
                  <td className="px-3 py-3 font-mono text-xs text-slate-600">{m.rawField}</td>
                  <td className="px-3 py-3 font-medium text-slate-800">{m.canonicalField}</td>
                  <td className="px-3 py-3">
                    <div className="rounded bg-slate-100 px-2 py-1 text-sm font-medium text-slate-700">
                      {m.normalizedValue}
                    </div>
                  </td>
                  <td className="px-3 py-3 text-slate-600">{m.unit ?? '—'}</td>
                  <td className="px-3 py-3">
                    <span className={badge(m.confidence)}>
                      {Math.round(m.confidence * 100)}%
                    </span>
                  </td>
                  <td className="px-3 py-3">
                    {showProvenance ? (
                      <div className="flex flex-wrap gap-1">
                        <span className={`inline-flex items-center rounded-full border px-2 py-1 text-xs font-medium ${sourceColors[m.provenance.source]}`}>
                          {SOURCE_LABELS[m.provenance.source]}
                        </span>
                        <div className="flex items-center gap-1 text-xs text-slate-500">
                          <span>📅</span>
                          {new Date(m.provenance.timestamp).toLocaleDateString('id-ID')}
                        </div>
                      </div>
                    ) : (
                      <span className="text-xs text-slate-400">Hidden</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}