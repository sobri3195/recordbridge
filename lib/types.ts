export type SourceSystem = 'EHR_A' | 'SIMRS_B' | 'CLINIC_C';

export interface Provenance {
  source: SourceSystem;
  sourceRecordId: string;
  timestamp: string;
}

export interface MappingDecision {
  id: string;
  rawField: string;
  canonicalField: string;
  normalizedValue: string;
  unit?: string;
  confidence: number;
  provenance: Provenance;
}

export interface Observation {
  id: string;
  type: 'bloodPressure' | 'heartRate' | 'temperature';
  value: string;
  unit: string;
  confidence: number;
  provenance: Provenance;
}

export interface Condition {
  id: string;
  canonicalName: string;
  sourceText: string;
  code?: string;
  confidence: number;
  provenance: Provenance;
}

export interface Medication {
  id: string;
  canonicalName: string;
  dose: string;
  route: string;
  frequency: string;
  confidence: number;
  provenance: Provenance;
}

export interface Allergy {
  id: string;
  substance: string;
  reaction: string;
  confidence: number;
  provenance: Provenance;
}

export interface TimelineEvent {
  id: string;
  type: 'Encounter' | 'Lab' | 'Meds' | 'Diagnosis' | 'Vitals';
  title: string;
  value: string;
  occurredAt: string;
  confidence: number;
  provenance: Provenance;
  conflict?: boolean;
}

export interface Conflict {
  id: string;
  category: 'Allergy' | 'Medication' | 'Diagnosis';
  field: string;
  values: Array<{
    value: string;
    confidence: number;
    provenance: Provenance;
  }>;
  resolved: boolean;
  resolution?: {
    strategy: 'choose_one' | 'keep_both';
    value: string;
    note?: string;
    resolvedAt: string;
  };
}

export interface AuditEntry {
  id: string;
  action: 'translation_run' | 'conflict_resolved' | 'export_run';
  message: string;
  timestamp: string;
}

export interface CanonicalRecord {
  patient: {
    identifiers: string[];
    demographics: {
      fullName: string;
      dob: string;
      sex: string;
      language: string;
    };
  };
  observations: Observation[];
  conditions: Condition[];
  medications: Medication[];
  allergies: Allergy[];
  timelineEvents: TimelineEvent[];
  mappings: MappingDecision[];
  conflicts: Conflict[];
  auditLog: AuditEntry[];
}

export interface RawSourceRecord {
  source: SourceSystem;
  recordId: string;
  updatedAt: string;
  payload: Record<string, unknown>;
}
