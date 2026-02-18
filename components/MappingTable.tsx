import { CanonicalRecord } from '@/lib/types';

const badge = (confidence: number) =>
  confidence < 0.75 ? 'rounded bg-amber-100 px-2 py-0.5 text-amber-700' : 'rounded bg-emerald-100 px-2 py-0.5 text-emerald-700';

export function MappingTable({ record, showProvenance }: { record: CanonicalRecord | null; showProvenance: boolean }) {
  return (
    <section id="mapping" className="card">
      <h3 className="mb-2 text-lg font-semibold">Mapping Table (Vitals + Core Fields)</h3>
      <p className="mb-3 text-xs text-slate-500">Tooltip equivalent: confidence reflects rule strength (dictionary/code match = higher).</p>
      {!record ? (
        <p className="text-sm text-slate-500">No mappings yet.</p>
      ) : (
        <div className="overflow-auto">
          <table className="min-w-full text-left text-xs">
            <thead className="border-b bg-slate-50">
              <tr>
                {['Raw Field', 'Canonical Field', 'Normalized Value', 'Unit', 'Confidence', 'Provenance'].map((h) => (
                  <th key={h} className="px-2 py-2 font-medium">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {record.mappings.map((m) => (
                <tr key={m.id} className="border-b">
                  <td className="px-2 py-2">{m.rawField}</td>
                  <td className="px-2 py-2">{m.canonicalField}</td>
                  <td className="px-2 py-2">{m.normalizedValue}</td>
                  <td className="px-2 py-2">{m.unit ?? '-'}</td>
                  <td className="px-2 py-2"><span className={badge(m.confidence)}>{Math.round(m.confidence * 100)}%</span></td>
                  <td className="px-2 py-2">{showProvenance ? `${m.provenance.source} @ ${m.provenance.timestamp}` : 'Hidden'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
