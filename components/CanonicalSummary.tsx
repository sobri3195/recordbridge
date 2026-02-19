import { CanonicalRecord } from '@/lib/types';

export function CanonicalSummary({ record }: { record: CanonicalRecord | null }) {
  if (!record) return (
    <section className="card-gradient">
      <div className="rounded-2xl bg-gradient-to-br from-slate-50 to-slate-100 p-8 text-center">
        <div className="mb-4 inline-flex rounded-2xl bg-white p-4 shadow-md">
          <span className="text-4xl">👤</span>
        </div>
        <p className="text-sm font-medium text-slate-500">Run translation to generate canonical patient summary.</p>
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
    <section className="card-gradient animate-fadeIn">
      <div className="mb-5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="rounded-xl bg-gradient-to-br from-emerald-100 to-teal-100 p-2 shadow-inner">
            <span className="text-xl">👤</span>
          </div>
          <h3 className="text-xl font-bold text-gradient">Unified Patient Profile</h3>
        </div>
        <span className="badge-green">
          ✅ Normalized
        </span>
      </div>
      
      {/* Patient Demographics Card */}
      <div className="mb-5 overflow-hidden rounded-2xl bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-5 shadow-lg shadow-blue-100/50">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="rounded-xl bg-white/60 p-4 backdrop-blur-sm">
            <p className="mb-1 text-xs font-semibold text-slate-500 uppercase tracking-wide">Patient Name</p>
            <p className="text-base font-bold text-slate-800">{record.patient.demographics.fullName}</p>
          </div>
          <div className="rounded-xl bg-white/60 p-4 backdrop-blur-sm">
            <p className="mb-1 text-xs font-semibold text-slate-500 uppercase tracking-wide">Date of Birth</p>
            <p className="text-base font-bold text-slate-800">{record.patient.demographics.dob}</p>
          </div>
          <div className="rounded-xl bg-white/60 p-4 backdrop-blur-sm">
            <p className="mb-1 text-xs font-semibold text-slate-500 uppercase tracking-wide">Identifiers</p>
            <p className="text-sm font-mono font-bold text-slate-800">{record.patient.identifiers.join(', ')}</p>
          </div>
          <div className="rounded-xl bg-white/60 p-4 backdrop-blur-sm">
            <p className="mb-1 text-xs font-semibold text-slate-500 uppercase tracking-wide">Language</p>
            <p className="text-base font-bold text-slate-800">{record.patient.demographics.language === 'id' ? 'Bahasa Indonesia' : record.patient.demographics.language}</p>
          </div>
        </div>
      </div>

      {/* Clinical Summary */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {/* Allergies */}
        <div className="card hover-lift group bg-gradient-to-br from-rose-50 to-pink-50 border-rose-200/60">
          <div className="mb-3 flex items-center gap-2">
            <div className="rounded-xl bg-white p-2 shadow-sm transition-transform duration-300 group-hover:scale-110">
              <span className="text-lg">⚠️</span>
            </div>
            <p className="font-bold text-rose-800">Allergies</p>
          </div>
          <div className="flex flex-wrap gap-2">
            {uniqueAllergies.length > 0 ? uniqueAllergies.map((a, i) => (
              <span key={i} className="rounded-full bg-gradient-to-r from-rose-200 to-pink-200 px-3 py-1 text-xs font-bold text-rose-800 shadow-sm">
                {a}
              </span>
            )) : (
              <span className="text-sm text-rose-600">None captured</span>
            )}
          </div>
        </div>

        {/* Medications */}
        <div className="card hover-lift group bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200/60">
          <div className="mb-3 flex items-center gap-2">
            <div className="rounded-xl bg-white p-2 shadow-sm transition-transform duration-300 group-hover:scale-110">
              <span className="text-lg">💊</span>
            </div>
            <p className="font-bold text-blue-800">Active Medications</p>
          </div>
          <div className="space-y-2">
            {uniqueMeds.slice(0, 3).map((m, i) => (
              <p key={i} className="rounded-lg bg-white/60 px-3 py-2 text-sm font-medium text-blue-800 backdrop-blur-sm">{m}</p>
            ))}
            {uniqueMeds.length > 3 && (
              <p className="text-sm font-semibold text-blue-600">+{uniqueMeds.length - 3} more</p>
            )}
          </div>
        </div>

        {/* Conditions */}
        <div className="card hover-lift group bg-gradient-to-br from-purple-50 to-violet-50 border-purple-200/60">
          <div className="mb-3 flex items-center gap-2">
            <div className="rounded-xl bg-white p-2 shadow-sm transition-transform duration-300 group-hover:scale-110">
              <span className="text-lg">🩺</span>
            </div>
            <p className="font-bold text-purple-800">Key Conditions</p>
          </div>
          <div className="space-y-2">
            {keyConditions ? keyConditions.split(', ').slice(0, 3).map((c, i) => (
              <p key={i} className="rounded-lg bg-white/60 px-3 py-2 text-sm font-medium text-purple-800 backdrop-blur-sm">{c}</p>
            )) : (
              <p className="text-sm text-purple-600">None captured</p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}