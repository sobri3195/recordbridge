import { CanonicalRecord } from '@/lib/types';

export function CanonicalSummary({ record }: { record: CanonicalRecord | null }) {
  if (!record) return <section className="card text-sm text-slate-500">Run translation to generate canonical patient summary.</section>;

  const keyConditions = record.conditions
    .map((condition) => condition.canonicalName)
    .filter((name, index, names) => names.indexOf(name) === index)
    .join(', ');

  return (
    <section className="card">
      <h3 className="mb-3 text-lg font-semibold">Canonical Patient Summary</h3>
      <div className="grid grid-cols-1 gap-2 text-sm md:grid-cols-2">
        <p><strong>Name:</strong> {record.patient.demographics.fullName}</p>
        <p><strong>DOB:</strong> {record.patient.demographics.dob}</p>
        <p><strong>Identifiers:</strong> {record.patient.identifiers.join(', ')}</p>
        <p><strong>Language:</strong> {record.patient.demographics.language}</p>
      </div>
      <div className="mt-3 space-y-2 text-sm">
        <p><strong>Allergies:</strong> {record.allergies.map((a) => a.substance).join(', ') || 'None captured'}</p>
        <p><strong>Active meds:</strong> {record.medications.map((m) => `${m.canonicalName} ${m.dose}`).join(' • ')}</p>
        <p><strong>Key conditions:</strong> {keyConditions}</p>
      </div>
    </section>
  );
}
