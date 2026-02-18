# Universal SIMRS Connector

## Overview

Fitur **Universal SIMRS Connector** adalah komponen inti RecordBridge yang berfungsi sebagai middleware interoperability layer untuk menghubungkan berbagai sistem informasi rumah sakit (SIMRS) yang berbeda. Dengan 230+ SIMRS yang beredar di Indonesia yang tidak saling interoperable, RecordBridge menyediakan solusi jembatan universal yang memungkinkan integrasi seamless antar sistem.

---

## Detail Fitur

### 1.1 Supported SIMRS Systems

| SIMRS Type | Protocol | Connection Method | Status |
|------------|----------|-------------------|--------|
| Khanza SIMRS | MySQL | Direct Database | Supported |
| SIMRS Custom (Local) | MySQL/PostgreSQL/SQL Server | Database Adapter | Supported |
| SIMRS API-based | REST/GraphQL | API Adapter | Supported |
| SIMRS Non-API | File-based (CSV/Excel) | File Import Bridge | Supported |
| SATUSEHAT | FHIR R4 | FHIR Adapter | Supported |
| BPJS Kesehatan | REST API | API Integration | Supported |

### 1.2 Database Adapters

#### Supported Database Engines
```typescript
interface DatabaseAdapter {
  type: 'mysql' | 'postgresql' | 'sqlserver' | 'oracle';
  connection: {
    host: string;
    port: number;
    database: string;
    username: string;
    password: string;
    ssl?: boolean;
    connectionTimeout?: number;
  };
  schemaMapping: {
    tables: TableMapping[];
    views?: ViewMapping[];
    customQueries?: CustomQuery[];
  };
}

interface TableMapping {
  sourceTable: string;
  targetEntity: 'patient' | 'encounter' | 'observation' | 'medication' | 'allergy' | 'diagnosis';
  fieldMappings: FieldMapping[];
  filterCondition?: string;
  syncStrategy: 'full' | 'incremental' | 'change_data_capture';
}
```

#### Connection Pool Management
- **Pool Size**: Configurable (default: 10 connections)
- **Timeout**: Connection timeout 30s, query timeout 300s
- **Retry Logic**: Exponential backoff (3 retries)
- **Health Check**: Every 60 seconds

### 1.3 API Adapters

#### REST API Adapter
```typescript
interface RestApiAdapter {
  baseUrl: string;
  authentication: {
    type: 'bearer' | 'basic' | 'apikey' | 'oauth2';
    credentials: Record<string, string>;
  };
  endpoints: {
    patients: string;
    encounters: string;
    observations: string;
    medications: string;
    allergies: string;
  };
  rateLimit: {
    requestsPerSecond: number;
    burstSize: number;
  };
  pagination: {
    type: 'offset' | 'cursor' | 'page';
    pageSize: number;
  };
}
```

#### FHIR R4 Adapter (SATUSEHAT)
```typescript
interface FhirAdapter {
  baseUrl: string;
  organizationId: string;
  clientId: string;
  clientSecret: string;
  authUrl: string;
  supportedResources: (
    | 'Patient'
    | 'Encounter'
    | 'Observation'
    | 'Condition'
    | 'Medication'
    | 'AllergyIntolerance'
    | 'Procedure'
  )[];
  searchParameters: Record<string, string[]>;
}
```

---

## 2. Data Mapping Engine

### 2.1 Schema Translation

RecordBridge mengkonversi struktur data berbeda menjadi format standar canonical.

#### Example: SIMRS A to Canonical
```typescript
// SIMRS A Structure
interface SimrsASchema {
  patient_name: string;
  dob: string; // DD/MM/YYYY
  mr_number: string;
  bp_systolic: number;
  bp_diastolic: number;
}

// SIMRS B Structure
interface SimrsBSchema {
  nama_pasien: string;
  tanggal_lahir: string; // YYYY-MM-DD
  no_rm: string;
  tensi: string; // "120/80"
}

// Canonical RecordBridge Format
interface CanonicalPatient {
  patient_id: string;
  name: string;
  date_of_birth: string; // ISO 8601
  medical_record_number: string;
  blood_pressure: {
    systolic: number;
    diastolic: number;
    unit: 'mmHg';
  };
  source_system: string;
  mapped_at: string;
  confidence_score: number;
}
```

### 2.2 Field Mapping Configuration

```typescript
interface FieldMapping {
  sourceField: string;
  targetField: string;
  transformation?: {
    type: 'direct' | 'concat' | 'split' | 'date_format' | 'lookup' | 'custom';
    config?: Record<string, any>;
    customFunction?: string; // JavaScript function as string
  };
  validation?: {
    required: boolean;
    type: 'string' | 'number' | 'date' | 'email' | 'regex';
    regex?: string;
    min?: number;
    max?: number;
  };
  confidence: number;
}

// Example Mappings
const simrsAMappings: FieldMapping[] = [
  { sourceField: 'patient_name', targetField: 'name', transformation: { type: 'direct' }, confidence: 1.0 },
  { 
    sourceField: 'dob', 
    targetField: 'date_of_birth', 
    transformation: { type: 'date_format', config: { from: 'DD/MM/YYYY', to: 'ISO8601' } },
    confidence: 0.95
  },
  { sourceField: 'mr_number', targetField: 'medical_record_number', transformation: { type: 'direct' }, confidence: 1.0 },
];

const simrsBMappings: FieldMapping[] = [
  { sourceField: 'nama_pasien', targetField: 'name', transformation: { type: 'direct' }, confidence: 0.9 },
  { 
    sourceField: 'tanggal_lahir', 
    targetField: 'date_of_birth', 
    transformation: { type: 'date_format', config: { from: 'YYYY-MM-DD', to: 'ISO8601' } },
    confidence: 0.95
  },
  { sourceField: 'no_rm', targetField: 'medical_record_number', transformation: { type: 'direct' }, confidence: 0.9 },
  { 
    sourceField: 'tensi', 
    targetField: 'blood_pressure', 
    transformation: { type: 'split', config: { separator: '/', targetFields: ['systolic', 'diastolic'] } },
    confidence: 0.85
  },
];
```

### 2.3 Built-in Transformations

| Transformation | Description | Example |
|---------------|-------------|---------|
| `direct` | Direct field mapping | `name` → `name` |
| `concat` | Combine multiple fields | `first_name` + `last_name` → `full_name` |
| `split` | Split single field to multiple | `tensi` → `systolic` + `diastolic` |
| `date_format` | Convert date formats | `DD/MM/YYYY` → `YYYY-MM-DD` |
| `lookup` | Value mapping via dictionary | `L` → `Male`, `P` → `Female` |
| `unit_convert` | Unit conversion | `kg` → `g`, `°C` → `°F` |
| `custom` | Custom JavaScript function | Complex logic |

---

## 3. Universal Health API

### 3.1 API Specification

RecordBridge menyediakan API standar sehingga aplikasi eksternal hanya perlu integrasi sekali.

#### REST Endpoints

```typescript
// GET /api/v1/patients
// List all patients with pagination
interface ListPatientsRequest {
  page?: number;
  limit?: number;
  search?: string;
  facility?: string;
  dateFrom?: string;
  dateTo?: string;
}

interface ListPatientsResponse {
  data: Patient[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// GET /api/v1/patients/{id}
// Get single patient by ID
interface GetPatientResponse {
  patient: Patient;
  medical_records: MedicalRecord[];
  encounters: Encounter[];
  source_systems: string[];
}

// GET /api/v1/medical-records
// List medical records
interface ListMedicalRecordsRequest {
  patientId?: string;
  facility?: string;
  recordType?: 'diagnosis' | 'medication' | 'lab' | 'imaging';
  dateFrom?: string;
  dateTo?: string;
}

// POST /api/v1/referral
// Create referral to another facility
interface CreateReferralRequest {
  patientId: string;
  fromFacility: string;
  toFacility: string;
  reason: string;
  urgency: 'routine' | 'urgent' | 'emergency';
  includeRecords: string[];
  notes?: string;
}

interface CreateReferralResponse {
  referralId: string;
  status: 'pending' | 'sent' | 'acknowledged';
  accessUrl: string;
  expiresAt: string;
}
```

### 3.2 GraphQL API (Optional)

```graphql
type Patient {
  id: ID!
  name: String!
  dateOfBirth: Date!
  medicalRecordNumber: String!
  encounters: [Encounter!]!
  conditions: [Condition!]!
  medications: [Medication!]!
  allergies: [Allergy!]!
}

type Query {
  patients(search: String, facility: String, limit: Int): [Patient!]!
  patient(id: ID!): Patient
  encounters(patientId: ID!): [Encounter!]!
  medicalRecords(patientId: ID!, type: String): [MedicalRecord!]!
}

type Mutation {
  createReferral(input: ReferralInput!): Referral!
  syncPatient(patientId: ID!, sourceSystems: [String!]!): SyncResult!
}
```

---

## 4. Real-Time Sync Engine

### 4.1 Sync Strategies

```typescript
type SyncStrategy = 
  | 'realtime'      // WebSocket/SSE based
  | 'event_driven'  // Webhook/trigger based
  | 'polling'       // Periodic polling
  | 'cdc'           // Change Data Capture
  | 'batch';        // Scheduled batch sync

interface SyncConfiguration {
  sourceSystem: string;
  targetSystem: string;
  entities: ('patient' | 'encounter' | 'observation' | 'medication')[];
  strategy: SyncStrategy;
  schedule?: {
    frequency: 'minutely' | 'hourly' | 'daily' | 'weekly';
    interval: number;
    timezone: string;
  };
  conflictResolution: 'source_wins' | 'target_wins' | 'manual' | 'timestamp';
  filters?: {
    include?: string[];
    exclude?: string[];
    condition?: string;
  };
}
```

### 4.2 Event-Based Update

```typescript
interface SyncEvent {
  id: string;
  timestamp: string;
  sourceSystem: string;
  entityType: string;
  entityId: string;
  operation: 'CREATE' | 'UPDATE' | 'DELETE';
  payload: Record<string, any>;
  checksum: string;
}

// Webhook Handler
interface WebhookConfig {
  url: string;
  headers: Record<string, string>;
  events: string[];
  retryPolicy: {
    maxRetries: number;
    backoffMultiplier: number;
  };
}
```

### 4.3 Background Sync

```typescript
interface BackgroundSyncJob {
  jobId: string;
  status: 'queued' | 'running' | 'completed' | 'failed';
  sourceSystem: string;
  startedAt: string;
  completedAt?: string;
  stats: {
    totalRecords: number;
    processed: number;
    failed: number;
    conflicts: number;
  };
  logs: SyncLogEntry[];
}
```

---

## 5. Multi-Hospital Integration

### 5.1 Supported Facility Types

| Facility Type | Integration Method | Data Types |
|--------------|-------------------|------------|
| Rumah Sakit (Hospital) | Database/API | Full EMR |
| Klinik (Clinic) | API/File | Basic Records |
| Laboratorium (Lab) | HL7 FHIR | Lab Results |
| Apotek (Pharmacy) | API | Medications |
| Telemedicine Platform | REST API | Consultations |
| Puskesmas | Database/API | Primary Care |

### 5.2 Cross-Facility Patient Matching

```typescript
interface PatientMatchingEngine {
  // Match patients across facilities
  match(patient: Patient, candidates: Patient[]): MatchResult[];
  
  // Configurable matching rules
  rules: {
    exact: string[];      // Fields requiring exact match
    fuzzy: string[];      // Fields with fuzzy matching
    threshold: number;    // Minimum confidence threshold
  };
}

interface MatchResult {
  patientId: string;
  confidence: number;
  matchedFields: string[];
  mismatchedFields: string[];
  recommendation: 'match' | 'review' | 'no_match';
}
```

---

## 6. Security & Compliance

### 6.1 Security Standards

| Feature | Implementation | Details |
|---------|---------------|---------|
| End-to-End Encryption | TLS 1.3 | All data in transit |
| Data at Rest | AES-256 | Database encryption |
| Token-Based Auth | JWT + Refresh Tokens | 15-min access, 7-day refresh |
| Role-Based Access | RBAC | Admin, Doctor, Nurse, Viewer |
| Audit Logging | Tamper-evident | All actions logged |
| API Rate Limiting | Sliding Window | 1000 req/min per API key |

### 6.2 Authentication Flow

```typescript
interface AuthConfiguration {
  jwt: {
    secret: string;
    accessTokenExpiry: '15m';
    refreshTokenExpiry: '7d';
    algorithm: 'RS256';
  };
  mfa?: {
    enabled: boolean;
    methods: ('totp' | 'sms' | 'email')[];
  };
  sso?: {
    provider: 'saml' | 'oauth2' | 'openid';
    metadataUrl: string;
  };
}

interface UserRole {
  name: string;
  permissions: Permission[];
  dataAccess: {
    facilities: string[];
    patientTypes: string[];
    recordTypes: string[];
    timeRange?: { from: string; to: string };
  };
}
```

### 6.3 Compliance Standards

| Standard | Status | Features |
|----------|--------|----------|
| SATUSEHAT Kemenkes | ✅ Compliant | FHIR R4, Patient ID matching |
| HL7 FHIR R4 | ✅ Compliant | Standard resources |
| ISO 27001 | ✅ Ready | Security management |
| HIPAA | ✅ Ready | PHI protection |
| PDPA Indonesia | ✅ Compliant | Data privacy |

---

## Use Cases

### 1. Rujukan Pasien Antar RS

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│  RS A       │────▶│RecordBridge │────▶│  RS B       │
│  (Rujuk)    │     │  (Bridge)   │     │  (Terima)   │
└─────────────┘     └─────────────┘     └─────────────┘

Flow:
1. Dokter di RS A membuat rujukan
2. RecordBridge mengumpulkan data pasien dari semua sumber
3. Data ditransformasi ke format standar
4. RS B menerima data lengkap tanpa input ulang
5. Pasien langsung dilayani dengan rekam medis tersedia
```

### 2. Integrasi dengan Mobile App

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│ Mobile App  │◄───▶│RecordBridge │◄───▶│  Various    │
│  (Pasien)   │     │  (Unified   │     │   SIMRS     │
│             │     │   API)      │     │             │
└─────────────┘     └─────────────┘     └─────────────┘

Features:
- Pasien melihat rekam medis dari berbagai RS
- Jadwal kontrol terintegrasi
- Notifikasi hasil lab
- Riwayat obat terintegrasi
```

### 3. Integrasi Telemedicine

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│ Telemedicine│◄───▶│RecordBridge │◄───▶│  Hospital   │
│  Platform   │     │  (EMR Hub)  │     │   EMRs      │
└─────────────┘     └─────────────┘     └─────────────┘

Benefits:
- Dokter akses riwayat lengkap pasien
- Diagnosis lebih akurat
- Resep terintegrasi dengan apotek
- Rujukan ke RS fisik jika diperlukan
```

### 4. Health Super App Integration

```
┌─────────────────────────────────────────────────────┐
│                  Health Super App                   │
├─────────┬─────────┬─────────┬─────────┬─────────────┤
│  BPJS   │  Lab    │  Apotek │  Klinik │  Rumah Sakit│
│         │         │         │         │             │
└────┬────┴────┬────┴────┬────┴────┬────┴──────┬──────┘
     │         │         │         │           │
     └─────────┴─────────┴─────────┴───────────┘
                         │
                    RecordBridge
                   (Universal API)
```

---

## Value Proposition

### Masalah Saat Ini

| Problem | Impact |
|---------|--------|
| 230+ SIMRS berbeda di Indonesia | Fragmentasi data |
| Tidak interoperable | Duplikasi input data |
| Standar berbeda-beda | Kesulitan integrasi |
| Rujukan manual | Delay pelayanan pasien |
| Data terisolir | Tidak ada longitudinal record |

### Solusi RecordBridge

| Solution | Benefit |
|----------|---------|
| 1 Universal Bridge | Semua SIMRS terhubung |
| Schema-less Mapping | Konversi otomatis |
| Real-time Sync | Data selalu up-to-date |
| Unified API | Integrasi sekali, akses semua |
| Complete Audit | Compliance & traceability |

---

## Arsitektur Integrasi

```
┌─────────────────────────────────────────────────────────────────┐
│                     RECORD BRIDGE PLATFORM                      │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │              UNIVERSAL SIMRS CONNECTOR                    │  │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐  │  │
│  │  │ Database │  │   API    │  │   FHIR   │  │  File    │  │  │
│  │  │ Adapter  │  │ Adapter  │  │ Adapter  │  │ Adapter  │  │  │
│  │  └────┬─────┘  └────┬─────┘  └────┬─────┘  └────┬─────┘  │  │
│  │       └─────────────┴─────────────┴─────────────┘        │  │
│  │                         │                                │  │
│  │                         ▼                                │  │
│  │              ┌──────────────────────┐                    │  │
│  │              │   Data Mapping       │                    │  │
│  │              │   Engine             │                    │  │
│  │              └──────────┬───────────┘                    │  │
│  └─────────────────────────┼────────────────────────────────┘  │
│                            │                                    │
│                            ▼                                    │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │              UNIVERSAL HEALTH API                         │  │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐  │  │
│  │  │ REST API │  │ GraphQL  │  │  FHIR    │  │ Webhook  │  │  │
│  │  │  /v1/    │  │  /gql    │  │  /fhir   │  │ Events   │  │  │
│  │  └──────────┘  └──────────┘  └──────────┘  └──────────┘  │  │
│  └──────────────────────────────────────────────────────────┘  │
│                            │                                    │
│                            ▼                                    │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │              REAL-TIME SYNC ENGINE                        │  │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐  │  │
│  │  │ Real-time│  │  Event   │  │Background│  │    CDC   │  │  │
│  │  │   Sync   │  │  Driven  │  │   Sync   │  │   Sync   │  │  │
│  │  └──────────┘  └──────────┘  └──────────┘  └──────────┘  │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## API Endpoints Summary

### Connector Management

```typescript
// List all connected systems
GET /api/v1/connectors

// Add new connector
POST /api/v1/connectors
{
  name: string;
  type: 'database' | 'api' | 'fhir' | 'file';
  configuration: DatabaseAdapter | RestApiAdapter | FhirAdapter;
}

// Test connection
POST /api/v1/connectors/{id}/test

// Sync now
POST /api/v1/connectors/{id}/sync

// Get sync status
GET /api/v1/connectors/{id}/status

// Get sync logs
GET /api/v1/connectors/{id}/logs
```

### Mapping Management

```typescript
// Get field mappings for a connector
GET /api/v1/connectors/{id}/mappings

// Update field mappings
PUT /api/v1/connectors/{id}/mappings

// Preview mapping result
POST /api/v1/connectors/{id}/mappings/preview

// Auto-generate mappings
POST /api/v1/connectors/{id}/mappings/auto
```

---

## Success Metrics

| Metric | Target |
|--------|--------|
| Connection Success Rate | > 99% |
| Data Mapping Accuracy | > 95% |
| Sync Latency (Real-time) | < 1 second |
| Sync Latency (Batch) | < 5 minutes |
| API Response Time | < 200ms |
| Uptime SLA | 99.9% |
| Supported SIMRS Systems | 50+ within 1 year |

---

## Roadmap

### Phase 1 (MVP - Month 1-2)
- [ ] Database adapter for MySQL, PostgreSQL
- [ ] REST API adapter
- [ ] Basic field mapping engine
- [ ] Universal REST API v1
- [ ] Khanza SIMRS integration

### Phase 2 (Enhancement - Month 3-4)
- [ ] FHIR R4 adapter (SATUSEHAT)
- [ ] Real-time sync engine
- [ ] GraphQL API
- [ ] Webhook events
- [ ] SQL Server, Oracle adapters

### Phase 3 (Scale - Month 5-6)
- [ ] CDC (Change Data Capture)
- [ ] Multi-tenant architecture
- [ ] Advanced patient matching
- [ ] Custom connector SDK
- [ ] Marketplace for connectors

---

## Technical Requirements

### Dependencies

```json
{
  "database": {
    "mysql2": "^3.6.0",
    "pg": "^8.11.0",
    "tedious": "^16.0.0",
    "oracledb": "^6.0.0"
  },
  "fhir": {
    "fhir": "^4.11.0",
    "@asymmetrik/node-fhir-server-core": "^2.2.0"
  },
  "api": {
    "axios": "^1.5.0",
    "graphql": "^16.8.0",
    "apollo-server": "^4.9.0"
  },
  "sync": {
    "bull": "^4.11.0",
    "ioredis": "^5.3.0",
    "ws": "^8.13.0"
  }
}
```

### Infrastructure

| Component | Recommendation |
|-----------|----------------|
| Database | PostgreSQL 15+ |
| Cache | Redis 7+ |
| Message Queue | Redis / RabbitMQ |
| WebSocket | Socket.io |
| Load Balancer | Nginx / AWS ALB |

---

## Security Checklist

- [ ] All connections use TLS 1.3
- [ ] Database credentials encrypted at rest
- [ ] API keys with rotation support
- [ ] Rate limiting per API key
- [ ] Input validation and sanitization
- [ ] SQL injection prevention
- [ ] XSS protection
- [ ] CSRF tokens for web UI
- [ ] Audit logging enabled
- [ ] Regular security scanning

---

## Notes

Dokumen ini merupakan living document yang akan diupdate seiring:
- Penambahan dukungan SIMRS baru
- Perubahan standar SATUSEHAT
- Feedback dari implementasi
- Kebutuhan regulasi baru

Semua fitur didesain dengan mempertimbangkan:
- **Scalability**: Dapat menangani ratusan SIMRS
- **Security**: Data encryption dan access control
- **Compliance**: SATUSEHAT, HIPAA, PDPA
- **Reliability**: High availability dan disaster recovery
