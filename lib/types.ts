export type SourceSystem = 'EHR_A' | 'SIMRS_B' | 'CLINIC_C';

export type SupportedFormat = 'HL7' | 'FHIR' | 'JSON' | 'XML';

export type ConnectionType = 'database' | 'api' | 'file';

export type SyncStatus = 'idle' | 'syncing' | 'error' | 'paused';

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

export interface FieldMapping {
  id: string;
  sourceField: string;
  canonicalField: string;
  sourceValue: string;
  normalizedValue: string;
  confidence: number;
  transform?: string;
}

export interface MappingRecommendation {
  id: string;
  sourceField: string;
  suggestedMapping: string;
  confidence: number;
  alternatives: Array<{ field: string; confidence: number }>;
  reasoning: string;
  autoApprove: boolean;
}

export interface ConnectorConfig {
  id: string;
  name: string;
  connectionType: ConnectionType;
  host?: string;
  port?: number;
  database?: string;
  username?: string;
  password?: string;
  endpoint?: string;
  headers?: Record<string, string>;
  authType?: 'none' | 'basic' | 'bearer' | 'apikey';
  format?: SupportedFormat;
}

export interface DatabaseSchema {
  tables: Array<{
    name: string;
    columns: Array<{
      name: string;
      type: string;
      nullable: boolean;
    }>;
    primaryKey?: string;
    foreignKeys?: Array<{
      column: string;
      references: { table: string; column: string };
    }>;
  }>;
  relationships: Array<{
    from: string;
    to: string;
    type: 'one-to-one' | 'one-to-many' | 'many-to-many';
  }>;
}

export interface TableMapping {
  id: string;
  sourceTable: string;
  canonicalTable: string;
  confidence: number;
  fieldMappings: Array<{
    sourceField: string;
    canonicalField: string;
    confidence: number;
    transform?: string;
  }>;
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
  action: 'translation_run' | 'conflict_resolved' | 'export_run' | 'sync_completed' | 'api_access';
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

export interface HospitalConnection {
  id: SourceSystem;
  name: string;
  status: 'connected' | 'disconnected' | 'syncing' | 'error';
  lastSync: string;
  pendingChanges: number;
  latency: number;
}

export interface SyncEvent {
  id: string;
  type: string;
  timestamp: string;
  sourceSystem: SourceSystem;
  patientId: string;
  data: Record<string, unknown>;
  priority: 'high' | 'normal' | 'low';
}

export interface APIClient {
  id: string;
  name: string;
  apiKey: string;
  scopes: string[];
  requestsToday: number;
  rateLimit: number;
  createdAt: string;
}

export interface StandardCode {
  code: string;
  system: string;
  display: string;
  version?: string;
}
