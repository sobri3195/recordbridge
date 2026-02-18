import { RAW_SOURCES } from '@/lib/mockData';
import {
  AuditEntry,
  CanonicalRecord,
  ClinicalInsight,
  ClinicalSummary,
  Condition,
  Conflict,
  MappingDecision,
  RawSourceRecord,
  SourceSystem,
  TimelineEvent
} from '@/lib/types';

const diagnosisDictionary: Record<string, { canonical: string; confidence: number; code?: string }> = {
  'e11.9': { canonical: 'Type 2 Diabetes Mellitus', confidence: 0.95, code: 'E11.9' },
  i10: { canonical: 'Hypertension', confidence: 0.95, code: 'I10' },
  'e78.5': { canonical: 'Hyperlipidemia', confidence: 0.92, code: 'E78.5' },
  diabetes: { canonical: 'Type 2 Diabetes Mellitus', confidence: 0.84 },
  'kencing manis': { canonical: 'Type 2 Diabetes Mellitus', confidence: 0.87 },
  hipertensi: { canonical: 'Hypertension', confidence: 0.87 },
  'hipertensi stadium 1': { canonical: 'Hypertension Stage 1', confidence: 0.9 },
  'type 2 diabetes mellitus': { canonical: 'Type 2 Diabetes Mellitus', confidence: 0.9 },
  dislipidemia: { canonical: 'Hyperlipidemia', confidence: 0.88 },
  hyperlipidemia: { canonical: 'Hyperlipidemia', confidence: 0.95 },
  'essential hypertension': { canonical: 'Hypertension', confidence: 0.93 },
  ckd: { canonical: 'Chronic Kidney Disease', confidence: 0.72 }
};

const medicationDictionary: Record<string, { canonical: string; confidence: number }> = {
  glucophage: { canonical: 'Metformin', confidence: 0.88 },
  metformin: { canonical: 'Metformin', confidence: 0.93 },
  norvasc: { canonical: 'Amlodipine', confidence: 0.86 },
  amlodipine: { canonical: 'Amlodipine', confidence: 0.93 },
  simvastatin: { canonical: 'Simvastatin', confidence: 0.94 }
};

const allergyDictionary: Record<string, { canonical: string; confidence: number }> = {
  penicillin: { canonical: 'Penicillin', confidence: 0.94 },
  nka: { canonical: 'No Known Allergies', confidence: 0.82 },
  'no known allergy': { canonical: 'No Known Allergies', confidence: 0.82 },
  'tidak ada alergi': { canonical: 'No Known Allergies', confidence: 0.8 }
};

const nowIso = () => new Date().toISOString();

const getSources = (selected: SourceSystem[]) => RAW_SOURCES.filter((s) => selected.includes(s.source));

const parseDiagnosis = (entry: string) => {
  const text = entry.toLowerCase();
  for (const key of Object.keys(diagnosisDictionary)) {
    if (text.includes(key)) {
      return diagnosisDictionary[key];
    }
  }
  return { canonical: entry, confidence: 0.6 };
};

const normalizeDose = (dose: string) => dose.replace('0.5 g', '500 mg').replace(/\s+/g, ' ').trim();

export function runTranslation(selectedSources: SourceSystem[]): CanonicalRecord {
  const selected = getSources(selectedSources);
  const reference = selected[0] ?? RAW_SOURCES[0];

  const mappings: MappingDecision[] = [];
  const conditions: Condition[] = [];
  const medications: CanonicalRecord['medications'] = [];
  const allergies: CanonicalRecord['allergies'] = [];
  const observations: CanonicalRecord['observations'] = [];
  const timelineEvents: TimelineEvent[] = [];
  const conflicts: Conflict[] = [];

  selected.forEach((source) => {
    const p = source.payload;

    if ('BP' in p && typeof p.BP === 'string') {
      observations.push({
        id: `${source.recordId}-bp`,
        type: 'bloodPressure',
        value: p.BP,
        unit: 'mmHg',
        confidence: 0.95,
        provenance: provenance(source)
      });
      mappings.push({
        id: `${source.recordId}-map-bp`,
        rawField: 'BP',
        canonicalField: 'observations.bloodPressure',
        normalizedValue: p.BP,
        unit: 'mmHg',
        confidence: 0.95,
        provenance: provenance(source)
      });
    }

    if ('Tensi' in p && typeof p.Tensi === 'object' && p.Tensi) {
      const t = p.Tensi as { sistolik: number; diastolik: number; unit: string };
      const bpVal = `${t.sistolik}/${t.diastolik}`;
      observations.push({
        id: `${source.recordId}-tensi`,
        type: 'bloodPressure',
        value: bpVal,
        unit: t.unit,
        confidence: 0.92,
        provenance: provenance(source)
      });
      mappings.push({
        id: `${source.recordId}-map-tensi`,
        rawField: 'Tensi.sistolik/Tensi.diastolik',
        canonicalField: 'observations.bloodPressure',
        normalizedValue: bpVal,
        unit: t.unit,
        confidence: 0.92,
        provenance: provenance(source)
      });
    }

    const dxArray = extractDiagnosis(source);
    dxArray.forEach((dx, idx) => {
      const parsed = parseDiagnosis(dx);
      conditions.push({
        id: `${source.recordId}-dx-${idx}`,
        canonicalName: parsed.canonical,
        sourceText: dx,
        code: parsed.code,
        confidence: parsed.confidence,
        provenance: provenance(source)
      });
      mappings.push({
        id: `${source.recordId}-map-dx-${idx}`,
        rawField: 'diagnosis',
        canonicalField: 'conditions',
        normalizedValue: parsed.canonical,
        confidence: parsed.confidence,
        provenance: provenance(source)
      });
    });

    extractMeds(source).forEach((med, idx) => {
      const key = med.name.toLowerCase();
      const mapped = medicationDictionary[key] ?? { canonical: med.name, confidence: 0.66 };
      medications.push({
        id: `${source.recordId}-med-${idx}`,
        canonicalName: mapped.canonical,
        dose: normalizeDose(med.dose),
        frequency: med.frequency,
        route: med.route,
        confidence: mapped.confidence,
        provenance: provenance(source)
      });
    });

    extractAllergies(source).forEach((allergy, idx) => {
      const lowered = allergy.toLowerCase();
      const hit = Object.keys(allergyDictionary).find((k) => lowered.includes(k));
      const mapped = hit ? allergyDictionary[hit] : { canonical: allergy, confidence: 0.65 };
      allergies.push({
        id: `${source.recordId}-alg-${idx}`,
        substance: mapped.canonical,
        reaction: mapped.canonical === 'No Known Allergies' ? 'N/A' : 'Reported',
        confidence: mapped.confidence,
        provenance: provenance(source)
      });
    });

    timelineEvents.push(...buildTimeline(source));
  });

  const allergyValues = Array.from(new Set(allergies.map((a) => a.substance)));
  if (allergyValues.includes('Penicillin') && allergyValues.includes('No Known Allergies')) {
    conflicts.push({
      id: 'conf-allergy-1',
      category: 'Allergy',
      field: 'allergies',
      values: allergies
        .filter((a) => ['Penicillin', 'No Known Allergies'].includes(a.substance))
        .map((a) => ({ value: a.substance, confidence: a.confidence, provenance: a.provenance })),
      resolved: false
    });
  }

  const amlodipineDoses = Array.from(
    new Set(medications.filter((m) => m.canonicalName === 'Amlodipine').map((m) => m.dose))
  );
  if (amlodipineDoses.length > 1) {
    conflicts.push({
      id: 'conf-med-1',
      category: 'Medication',
      field: 'Amlodipine dose',
      values: medications
        .filter((m) => m.canonicalName === 'Amlodipine')
        .map((m) => ({ value: m.dose, confidence: m.confidence, provenance: m.provenance })),
      resolved: false
    });
  }

  const dxNames = Array.from(new Set(conditions.map((c) => c.canonicalName)));
  if (dxNames.includes('Chronic Kidney Disease') && !dxNames.includes('Hypertension')) {
    conflicts.push({
      id: 'conf-dx-1',
      category: 'Diagnosis',
      field: 'problem list discrepancy',
      values: conditions.map((c) => ({ value: c.canonicalName, confidence: c.confidence, provenance: c.provenance })),
      resolved: false
    });
  }

  const canonical: CanonicalRecord = {
    patient: {
      identifiers: ['MRN-49281', 'SIMRS-49281', 'EXT-49281'],
      demographics: {
        fullName: String(reference.payload.name ?? (reference.payload as any).nama ?? (reference.payload as any).patient?.fullName ?? 'Unknown'),
        dob: '1993-05-15',
        sex: 'Male',
        language: 'Bahasa Indonesia'
      }
    },
    observations,
    conditions,
    medications,
    allergies,
    timelineEvents: timelineEvents.sort((a, b) => +new Date(a.occurredAt) - +new Date(b.occurredAt)),
    mappings,
    conflicts,
    auditLog: [
      {
        id: 'audit-run',
        action: 'translation_run',
        message: `Translation run with ${selectedSources.length} selected source(s).`,
        timestamp: nowIso()
      }
    ]
  };

  return canonical;
}

export function resolveConflict(
  record: CanonicalRecord,
  conflictId: string,
  strategy: 'choose_one' | 'keep_both',
  value: string,
  note?: string
): CanonicalRecord {
  const updated = structuredClone(record);
  const target = updated.conflicts.find((c) => c.id === conflictId);
  if (!target) return record;

  target.resolved = true;
  target.resolution = { strategy, value, note, resolvedAt: nowIso() };

  if (target.category === 'Allergy') {
    if (strategy === 'choose_one') {
      updated.allergies = updated.allergies.filter((a) => a.substance === value);
    }
  }

  if (target.category === 'Medication' && strategy === 'choose_one') {
    updated.medications = updated.medications.map((m) =>
      m.canonicalName === 'Amlodipine' ? { ...m, dose: value, confidence: 0.9 } : m
    );
  }

  updated.auditLog.unshift({
    id: `audit-resolve-${target.id}`,
    action: 'conflict_resolved',
    message: `Resolved ${target.category} conflict (${target.field}) with strategy ${strategy}.`,
    timestamp: nowIso()
  });

  return updated;
}

export function buildExportSummary(record: CanonicalRecord) {
  return {
    generatedAt: nowIso(),
    patient: record.patient,
    problemList: record.conditions.map((c) => ({ condition: c.canonicalName, confidence: c.confidence })),
    activeMeds: record.medications.map((m) => ({ name: m.canonicalName, dose: m.dose, frequency: m.frequency })),
    allergies: record.allergies.map((a) => a.substance),
    lastVitals: record.observations.slice(-3),
    keyLabs: record.timelineEvents.filter((t) => t.type === 'Lab').slice(-3),
    unresolvedConflicts: record.conflicts.filter((c) => !c.resolved),
    provenanceFooter: 'This packet includes source-level provenance and mapping confidence for every section.'
  };
}

export function generateClinicalSummary(record: CanonicalRecord): ClinicalSummary {
  const dob = new Date(record.patient.demographics.dob);
  const now = new Date();
  const age = Math.floor((now.getTime() - dob.getTime()) / (365.25 * 24 * 60 * 60 * 1000));
  const gender = record.patient.demographics.sex;

  const uniqueConditions = Array.from(new Set(record.conditions.map(c => c.canonicalName)));
  const bpObservations = record.observations.filter(o => o.type === 'bloodPressure');
  
  const bpTrend = analyzeBPTrend(bpObservations);
  const insights: ClinicalInsight[] = [];
  const riskFlags: string[] = [];

  // Generate insights based on conditions
  if (uniqueConditions.includes('Hypertension')) {
    if (bpTrend === 'improving') {
      insights.push({
        type: 'improvement',
        message: 'Tekanan darah membaik dalam 2 bulan terakhir',
        severity: 'info',
        basedOn: bpObservations.map(o => o.provenance.source)
      });
    } else if (bpTrend === 'worsening') {
      insights.push({
        type: 'alert',
        message: 'Tren tekanan darah meningkat - perlu evaluasi',
        severity: 'warning',
        basedOn: bpObservations.map(o => o.provenance.source)
      });
      riskFlags.push('Hypertension uncontrolled');
    }
  }

  if (uniqueConditions.includes('Type 2 Diabetes Mellitus')) {
    const hasCKD = uniqueConditions.includes('Chronic Kidney Disease');
    if (hasCKD) {
      insights.push({
        type: 'alert',
        message: 'Pasien dengan DM dan komplikasi ginjal - monitor fungsi renal',
        severity: 'warning',
        basedOn: ['Combined diagnosis analysis']
      });
      riskFlags.push('DM with renal complication');
    }
  }

  // Check for medication conflicts
  const hasAllergyConflict = record.conflicts.some(c => c.category === 'Allergy' && !c.resolved);
  if (hasAllergyConflict) {
    insights.push({
      type: 'alert',
      message: 'Konflik alergi terdeteksi - verifikasi diperlukan',
      severity: 'critical',
      basedOn: ['Allergy reconciliation']
    });
    riskFlags.push('Unresolved allergy conflict');
  }

  // Add stable conditions
  if (insights.length === 0) {
    insights.push({
      type: 'stable',
      message: 'Kondisi stabil, tidak ada perubahan signifikan',
      severity: 'info',
      basedOn: ['Latest encounter data']
    });
  }

  return {
    demographics: {
      age,
      gender,
      displayText: `${gender === 'Male' ? 'Laki-laki' : 'Perempuan'}, ${age} tahun`
    },
    primaryConditions: uniqueConditions,
    bpTrend,
    keyInsights: insights,
    riskFlags,
    lastUpdated: nowIso()
  };
}

function analyzeBPTrend(observations: CanonicalRecord['observations']): 'improving' | 'worsening' | 'stable' | 'unknown' {
  const bpReadings = observations
    .filter(o => o.type === 'bloodPressure')
    .map(o => {
      const match = o.value.match(/(\d+)\/(\d+)/);
      if (!match) return null;
      return {
        systolic: parseInt(match[1]),
        diastolic: parseInt(match[2]),
        timestamp: o.provenance.timestamp
      };
    })
    .filter((o): o is NonNullable<typeof o> => o !== null)
    .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());

  if (bpReadings.length < 2) return 'unknown';

  const first = bpReadings[0];
  const last = bpReadings[bpReadings.length - 1];
  
  const firstAvg = (first.systolic + first.diastolic) / 2;
  const lastAvg = (last.systolic + last.diastolic) / 2;
  
  const diff = lastAvg - firstAvg;
  
  if (diff < -3) return 'improving';
  if (diff > 3) return 'worsening';
  return 'stable';
}

const provenance = (source: RawSourceRecord) => ({
  source: source.source,
  sourceRecordId: source.recordId,
  timestamp: source.updatedAt
});

function extractDiagnosis(source: RawSourceRecord): string[] {
  const p = source.payload as any;
  return p.diagnosis_icd10 ?? p.diagnosa ?? p.dx_text ?? [];
}

function extractAllergies(source: RawSourceRecord): string[] {
  const p = source.payload as any;
  if (p.allergies) return p.allergies;
  if (p.alergi) return p.alergi;
  if (p.allergy_status) return p.allergy_status.map((a: any) => a.substance);
  return [];
}

function extractMeds(source: RawSourceRecord): Array<{ name: string; dose: string; route: string; frequency: string }> {
  const p = source.payload as any;
  if (p.meds) {
    return p.meds.map((m: any) => ({ name: m.generic ?? m.brand, dose: m.dose, route: m.route, frequency: m.freq }));
  }
  if (p.obat_aktif) {
    return p.obat_aktif.map((m: any) => ({ name: m.nama_obat, dose: m.dosis, route: m.rute, frequency: m.frekuensi }));
  }
  if (p.medication_list) {
    return p.medication_list.map((line: string) => {
      const [name, amount, unit, ...rest] = line.split(' ');
      return { name, dose: `${amount} ${unit}`, route: 'oral', frequency: rest.join(' ') || 'daily' };
    });
  }
  return [];
}

function buildTimeline(source: RawSourceRecord): TimelineEvent[] {
  const p = source.payload as any;
  const events: TimelineEvent[] = [];

  (p.encounters ?? p.kunjungan ?? p.visits ?? []).forEach((e: any, idx: number) => {
    const occurredAt = e.date ?? e.waktu ?? e.at;
    const title = e.type ?? e.jenis ?? e.setting;
    const value = e.reason ?? e.keluhan ?? e.note;
    events.push({
      id: `${source.recordId}-enc-${idx}`,
      type: 'Encounter',
      title,
      value,
      occurredAt,
      confidence: 0.91,
      provenance: provenance(source)
    });
  });

  (p.labs ?? p.lab_result ?? p.results ?? []).forEach((l: any, idx: number) => {
    events.push({
      id: `${source.recordId}-lab-${idx}`,
      type: 'Lab',
      title: l.name ?? l.pemeriksaan ?? l.test,
      value: `${l.value ?? l.hasil ?? l.result} ${l.unit ?? l.satuan}`,
      occurredAt: l.ts ?? l.waktu ?? l.at,
      confidence: 0.9,
      provenance: provenance(source)
    });
  });

  return events;
}
