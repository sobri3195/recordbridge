import { CanonicalRecord } from '@/lib/types';

export function AuditLog({ record }: { record: CanonicalRecord | null }) {
  return (
    <section className="card">
      <h3 className="mb-2 text-lg font-semibold">Audit Log Viewer</h3>
      <div className="space-y-2 text-xs">
        {record?.auditLog.map((a) => (
          <div key={a.id} className="rounded border border-slate-200 p-2">
            <p className="font-medium">{a.action}</p>
            <p>{a.message}</p>
            <p className="text-slate-500">{new Date(a.timestamp).toLocaleString()}</p>
          </div>
        ))}
        {!record && <p className="text-slate-500">No actions yet.</p>}
      </div>
    </section>
  );
}
