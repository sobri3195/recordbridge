import { CanonicalRecord } from '@/lib/types';

const actionIcons: Record<string, string> = {
  translation_run: '🔄',
  conflict_resolved: '⚖️',
  export_run: '📤'
};

const actionColors: Record<string, string> = {
  translation_run: 'bg-blue-100 text-blue-700',
  conflict_resolved: 'bg-amber-100 text-amber-700',
  export_run: 'bg-emerald-100 text-emerald-700'
};

export function AuditLog({ record }: { record: CanonicalRecord | null }) {
  return (
    <section className="card">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-lg font-semibold">📝 Audit Log</h3>
        {record && (
          <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-600">
            {record.auditLog.length} entries
          </span>
        )}
      </div>
      
      <div className="space-y-2">
        {record && record.auditLog.length > 0 ? (
          record.auditLog.map((a) => (
            <div key={a.id} className="flex items-start gap-3 rounded-lg border border-slate-200 bg-slate-50 p-3 transition-colors hover:bg-slate-100">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white shadow-sm">
                <span className="text-sm">{actionIcons[a.action] || '📋'}</span>
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${actionColors[a.action] || 'bg-slate-200 text-slate-700'}`}>
                    {a.action.replace(/_/g, ' ')}
                  </span>
                </div>
                <p className="mt-1 text-sm text-slate-700">{a.message}</p>
                <p className="mt-1 text-xs text-slate-500">
                  📅 {new Date(a.timestamp).toLocaleString('id-ID', { 
                    year: 'numeric', 
                    month: 'short', 
                    day: 'numeric', 
                    hour: '2-digit', 
                    minute: '2-digit' 
                  })}
                </p>
              </div>
            </div>
          ))
        ) : (
          <div className="rounded-lg bg-slate-50 p-6 text-center">
            <span className="mb-2 block text-3xl">📋</span>
            <p className="text-sm text-slate-500">No audit entries yet.</p>
            <p className="text-xs text-slate-400">Actions like running translation, resolving conflicts, and exports will appear here.</p>
          </div>
        )}
      </div>
    </section>
  );
}