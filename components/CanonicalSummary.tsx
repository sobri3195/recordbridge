import { CanonicalRecord } from '@/lib/types';

export function CanonicalSummary({ record }: { record: CanonicalRecord | null }) {
  if (!record) return (
    <section className="card">
      <div className="rounded-lg bg-slate-50 p-6 text-center">
        <span className="mb-2 block text-4xl">👤</span>
        <p className="text-sm text-slate-500">Run translation to generate canonical patient summary.</p>
      </div>
    </section>
  );

  const keyConditions = record.conditions
    .map((condition) => condition.canonicalName)
    .filter((name, index, names) => names.indexOf(name) === index)
    .join(', ');

  const uniqueAllergies = Array.from(new Set(record.allergies.map((a) => a.substance)));
  const uniqueMeds = record.medications.map((m) => `${m.canonicalName} (${m.dose})`).filter((v, i, a) => a.indexOf(v) === i);

  return (
    <section className="card">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-lg font-semibold">👤 Unified Patient Profile</h3>
        <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-medium text-emerald-700">
          ✅ Normalized
        </span>
      </div>
      
      {/* Patient Demographics Card */}
      <div className="mb-4 rounded-xl bg-gradient-to-r from-blue-50 to-indigo-50 p-4">
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div>
            <p className="text-xs text-slate-500">Patient Name</p>
            <p className="font-semibold text-slate-800">{record.patient.demographics.fullName}</p>
          </div>
          <div>
            <p className="text-xs text-slate-500">Date of Birth</p>
            <p className="font-semibold text-slate-800">{record.patient.demographics.dob}</p>
          </div>
          <div>
            <p className="text-xs text-slate-500">Identifiers</p>
            <p className="font-mono text-sm text-slate-800">{record.patient.identifiers.join(', ')}</p>
          </div>
          <div>
            <p className="text-xs text-slate-500">Language</p>
            <p className="font-semibold text-slate-800">{record.patient.demographics.language === 'id' ? 'Bahasa Indonesia' : record.patient.demographics.language}</p>
          </div>
        </div>
      </div>

      {/* Clinical Summary */}
      <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
        {/* Allergies */}
        <div className="rounded-lg border border-rose-200 bg-rose-50 p-3">
          <div className="mb-2 flex items-center gap-1">
            <span>⚠️</span>
            <p className="font-semibold text-rose-800">Allergies</p>
          </div>
          <div className="flex flex-wrap gap-1">
            {uniqueAllergies.length > 0 ? uniqueAllergies.map((a, i) => (
              <span key={i} className="rounded-full bg-rose-200 px-2 py-0.5 text-xs font-medium text-rose-800">
                {a}
              </span>
            )) : (
              <span className="text-xs text-rose-600">None captured</span>
            )}
          </div>
        </div>

        {/* Medications */}
        <div className="rounded-lg border border-blue-200 bg-blue-50 p-3">
          <div className="mb-2 flex items-center gap-1">
            <span>💊</span>
            <p className="font-semibold text-blue-800">Active Medications</p>
          </div>
          <div className="space-y-1">
            {uniqueMeds.slice(0, 3).map((m, i) => (
              <p key={i} className="text-xs text-blue-800">{m}</p>
            ))}
            {uniqueMeds.length > 3 && (
              <p className="text-xs text-blue-600">+{uniqueMeds.length - 3} more</p>
            )}
          </div>
        </div>

        {/* Conditions */}
        <div className="rounded-lg border border-purple-200 bg-purple-50 p-3">
          <div className="mb-2 flex items-center gap-1">
            <span>🩺</span>
            <p className="font-semibold text-purple-800">Key Conditions</p>
          </div>
          <div className="space-y-1">
            {keyConditions ? keyConditions.split(', ').slice(0, 3).map((c, i) => (
              <p key={i} className="text-xs text-purple-800">{c}</p>
            )) : (
              <p className="text-xs text-purple-600">None captured</p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}