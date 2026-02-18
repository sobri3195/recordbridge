# Audit Trail & Compliance Dashboard

## Overview
Fitur **Audit Trail + Compliance Dashboard** menyediakan visibilitas penuh terhadap setiap perubahan data dalam sistem. Setiap operasi—dari upload, mapping, transformasi, konflik resolution, sampai export—dicatat dengan detail lengkap termasuk siapa, kapan, apa yang berubah, dan alasan perubahan.

---

## Jejak Perubahan Data (Audit Trail)

### 7.1 Audit Event Types

```typescript
interface AuditEvent {
  eventId: string;
  timestamp: Date;
  
  // Actor
  actor: {
    userId: string;
    userName: string;
    email: string;
    role: string;
    ipAddress: string;
    sessionId: string;
  };
  
  // Action
  action: AuditAction;
  category: AuditCategory;
  
  // Target
  target: {
    type: 'RECORD' | 'FIELD' | 'MAPPING' | 'RULE' | 'PROJECT' | 'USER' | 'SYSTEM';
    id: string;
    name: string;
  };
  
  // Change Details
  changes?: {
    before: any;
    after: any;
    diff: ChangeDiff[];
  };
  
  // Context
  context: {
    projectId?: string;
    recordId?: string;
    sourceSystem?: string;
    reason?: string; // User-provided reason for change
    justification?: string; // Required for sensitive changes
  };
  
  // Compliance
  compliance: {
    dataClassification: 'PUBLIC' | 'INTERNAL' | 'CONFIDENTIAL' | 'RESTRICTED';
    hipaaRelevant: boolean;
    gdprRelevant: boolean;
    retentionPeriod: number; // days
  };
  
  // Integrity
  integrity: {
    hash: string; // SHA-256 of event data
    previousHash: string; // For blockchain-like integrity
    signature?: string; // Digital signature
  };
}

type AuditAction =
  // Data Operations
  | 'DATA_IMPORTED'
  | 'DATA_MAPPED'
  | 'DATA_TRANSFORMED'
  | 'DATA_VALIDATED'
  | 'DATA_EXPORTED'
  | 'DATA_DELETED'
  
  // Conflict & Quality
  | 'CONFLICT_DETECTED'
  | 'CONFLICT_RESOLVED'
  | 'QUALITY_RULE_TRIGGERED'
  | 'QUALITY_EXCEPTION_APPROVED'
  
  // Configuration
  | 'TEMPLATE_CREATED'
  | 'TEMPLATE_MODIFIED'
  | 'RULE_CREATED'
  | 'RULE_MODIFIED'
  | 'MAPPING_UPDATED'
  
  // User & Access
  | 'USER_LOGIN'
  | 'USER_LOGOUT'
  | 'PERMISSION_GRANTED'
  | 'PERMISSION_REVOKED'
  | 'PROJECT_SHARED'
  
  // System
  | 'SYSTEM_BACKUP'
  | 'SYSTEM_RESTORE'
  | 'EXPORT_GENERATED';

type AuditCategory = 
  | 'DATA_CHANGE'
  | 'CONFIGURATION'
  | 'SECURITY'
  | 'COMPLIANCE'
  | 'SYSTEM';
```

### 7.2 Change Diff Format

```typescript
interface ChangeDiff {
  path: string; // JSON path to changed field
  operation: 'ADD' | 'REMOVE' | 'REPLACE';
  oldValue?: any;
  newValue?: any;
}

// Example diff for a mapping change
const exampleDiff: ChangeDiff[] = [
  {
    path: 'mappings[0].canonicalField',
    operation: 'REPLACE',
    oldValue: 'blood_pressure',
    newValue: 'bp_systolic'
  },
  {
    path: 'mappings[0].confidence',
    operation: 'REPLACE',
    oldValue: 0.82,
    newValue: 0.95
  },
  {
    path: 'mappings[0].modifiedBy',
    operation: 'ADD',
    newValue: 'dr.sarah@hospital.id'
  }
];
```

---

## Desain Dashboard

### 7.3 Main Audit Dashboard

```
┌─────────────────────────────────────────────────────────────────────────┐
│ Audit Trail & Compliance Dashboard                          [📄 Export] │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  Filters:                                                               │
│  Date: [Last 7 Days 🔽]  User: [All Users 🔽]  Action: [All 🔽]        │
│  Category: [All 🔽]  Record ID: [____________]  [🔍 Search]            │
│                                                                         │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │ Summary Cards                                                   │   │
│  │ ┌─────────────┐ ┌─────────────┐ ┌─────────────┐ ┌─────────────┐ │   │
│  │ │ Total       │ │ Data        │ │ Config      │ │ Security    │ │   │
│  │ │ Events      │ │ Changes     │ │ Changes     │ │ Events      │ │   │
│  │ │   2,847     │ │    1,234    │ │     456     │ │      89     │ │   │
│  │ └─────────────┘ └─────────────┘ └─────────────┘ └─────────────┘ │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                                                                         │
│  Activity Timeline                                                      │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │                                                                 │   │
│  │  Today, 2:34 PM                                                 │   │
│  │  ├─ 👤 dr.sarah@hospital.id                                     │   │
│  │  │  CONFLICT_RESOLVED: Patient Allergy (MRN-77812)              │   │
│  │  │  Resolution: Choose "Penicillin" from Clinic_C               │   │
│  │  │  Reason: "Newer record, has reaction detail"                 │   │
│  │  │  [View Details]  [View Diff]                                │   │
│  │  │                                                              │   │
│  │  ├─ 👤 ahmad@hospital.id                                        │   │
│  │  │  MAPPING_UPDATED: Field "tensi_sistolik"                     │   │
│  │  │  Changed canonical mapping from "blood_pressure"             │   │
│  │  │  to "bp_systolic"                                            │   │
│  │  │  [View Details]  [View Diff]                                │   │
│  │  │                                                              │   │
│  │  Today, 11:20 AM                                                │   │
│  │  ├─ 👤 system                                                   │   │
│  │  │  QUALITY_RULE_TRIGGERED: Invalid ICD-10 code                │   │
│  │  │  Record: MRN-8892 | Rule: VALID_ICD10_FORMAT                │   │
│  │  │  Severity: HIGH | Auto-blocked export                       │   │
│  │  │  [View Details]  [View Record]                              │   │
│  │  │                                                              │   │
│  │  Today, 09:15 AM                                                │   │
│  │  ├─ 👤 lisa@hospital.id                                         │   │
│  │     DATA_EXPORTED: Referral packet                             │   │
│  │     Patient: Siti Rahmawati (MRN-77812)                        │   │
│  │     Format: FHIR Bundle | Records: 12                          │   │
│  │     [View Details]  [Download Export]                          │   │
│  │                                                                 │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                                                                         │
│  [Load More...]  Showing 50 of 2,847 events                            │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

### 7.4 Event Detail Modal

```
┌─────────────────────────────────────────────────────────────────┐
│ Audit Event Detail                                    [×]       │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  Event ID: AUD-2026-0116-0234-XXXX                              │
│  Timestamp: Jan 16, 2026 at 2:34:15 PM WIB (UTC+7)             │
│  Hash: a3f7d2e8...b4c9 [✓ Verified]                            │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │ Actor Information                                       │   │
│  ├─────────────────────────────────────────────────────────┤   │
│  │ User: dr.sarah@hospital.id                              │   │
│  │ Name: Dr. Sarah Rahmawati, M.D.                        │   │
│  │ Role: Clinical Data Steward                             │   │
│  │ Department: Medical Informatics                         │   │
│  │ IP Address: 203.142.XXX.XXX                             │   │
│  │ Session: sess_abc123xyz                                 │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
│  Action: CONFLICT_RESOLVED                                      │
│  Category: DATA_CHANGE                                          │
│  Severity: HIGH                                                 │
│                                                                 │
│  Target:                                                        │
│  • Type: RECORD                                                 │
│  • ID: CNF-2026-0116-001                                        │
│  • Patient MRN: MRN-77812                                       │
│  • Patient Name: Siti Rahmawati                                 │
│                                                                 │
│  Changes:                                                       │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │ Field              │ Before       │ After              │   │
│  ├────────────────────┼──────────────┼────────────────────┤   │
│  │ allergies.substance│ "NKA"        │ "Penicillin"       │   │
│  │ allergies.reaction │ null         │ "Rash"             │   │
│  │ resolution.strategy│ null         │ "CHOOSE_B"         │   │
│  │ resolution.note    │ null         │ "Newer record..."  │   │
│  │ resolution.by      │ null         │ "dr.sarah@..."     │   │
│  │ resolution.at      │ null         │ "2026-01-16..."    │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
│  User-Provided Reason:                                          │
│  "Newer record from Clinic_C appears more complete with         │
│   reaction detail. Patient confirmed penicillin allergy         │
│   during phone verification."                                   │
│                                                                 │
│  Compliance Tags:                                               │
│  🏥 HIPAA Relevant: YES    🌍 GDPR Relevant: NO                │
│  🔒 Classification: CONFIDENTIAL                                │
│  📅 Retention: 7 years (per hospital policy)                   │
│                                                                 │
│  [View Full Record]  [View Patient Chart]  [Export Event]       │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## Filter Audit

### 7.5 Advanced Filtering

```typescript
interface AuditFilter {
  // Time range
  dateRange: {
    start: Date;
    end: Date;
    preset?: 'TODAY' | 'YESTERDAY' | 'LAST_7_DAYS' | 'LAST_30_DAYS' | 'CUSTOM';
  };
  
  // Actor filters
  actors?: {
    userIds?: string[];
    roles?: string[];
    departments?: string[];
  };
  
  // Action filters
  actions?: AuditAction[];
  categories?: AuditCategory[];
  
  // Target filters
  targets?: {
    types?: string[];
    ids?: string[];
    projects?: string[];
  };
  
  // Compliance filters
  compliance?: {
    hipaaRelevant?: boolean;
    gdprRelevant?: boolean;
    classifications?: string[];
  };
  
  // Search
  searchQuery?: string;
  
  // Severity
  minSeverity?: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
}
```

### 7.6 Filter UI

```
┌─────────────────────────────────────────────────────────────────┐
│ Advanced Audit Filter                                           │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  Time Range                                                     │
│  [Last 30 Days 🔽] or Custom: [01/01/2026] to [01/31/2026]     │
│                                                                 │
│  Actors                                                         │
│  Users: [All Users 🔽]  Roles: [All Roles 🔽]                   │
│  [+ Add User Filter]                                            │
│                                                                 │
│  Actions                                                        │
│  ☑ Data Imports    ☑ Data Exports    ☑ Mapping Changes         │
│  ☑ Conflict Res    ☐ Quality Rules     ☑ User Access           │
│  ☑ System Events   [Select All]  [Clear All]                   │
│                                                                 │
│  Target Records                                                 │
│  Patient MRN: [____________]  Project: [All Projects 🔽]       │
│                                                                 │
│  Compliance                                                     │
│  ☑ Include HIPAA-relevant events only                          │
│  ☑ Include data classification changes                         │
│  Classification: [All 🔽]                                       │
│                                                                 │
│  Severity                                                       │
│  Minimum: [HIGH 🔽]                                             │
│                                                                 │
│  Search                                                         │
│  [Search in event details...]                                   │
│                                                                 │
│  [Reset Filters]  [Save as Preset]  [Apply Filters]             │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## Export Laporan Compliance

### 7.7 Report Types

```typescript
interface ComplianceReport {
  reportId: string;
  generatedAt: Date;
  generatedBy: string;
  
  reportType: 
    | 'FULL_AUDIT_LOG'
    | 'DATA_ACCESS_REPORT'
    | 'CHANGE_SUMMARY'
    | 'SECURITY_INCIDENTS'
    | 'HIPAA_AUDIT'
    | 'GDPR_AUDIT'
    | 'USER_ACTIVITY'
    | 'CUSTOM';
  
  period: {
    start: Date;
    end: Date;
  };
  
  filters: AuditFilter;
  
  // Content
  summary: {
    totalEvents: number;
    eventsByCategory: Record<AuditCategory, number>;
    eventsByAction: Record<AuditAction, number>;
    topUsers: Array<{ userId: string; count: number }>;
  };
  
  events: AuditEvent[];
  
  // Compliance attestation
  attestation?: {
    hash: string;
    signature: string;
    certifiedAt: Date;
  };
}
```

### 7.8 Export Formats

| Format | Use Case | Features |
|--------|----------|----------|
| **PDF** | Executive reporting | Formatted, signed, tamper-evident |
| **CSV** | Data analysis | All fields, import to Excel/BI |
| **JSON** | System integration | Structured, machine-readable |
| **LEEF** | SIEM integration | Common security format |
| **CEF** | ArcSight/Splunk | Standardized event format |

### 7.9 Scheduled Reports

```
┌─────────────────────────────────────────────────────────────────┐
│ Scheduled Compliance Reports                                    │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  [+ Schedule New Report]                                        │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │ Monthly HIPAA Compliance Report                          │   │
│  │ Schedule: 1st of every month at 9:00 AM                 │   │
│  │ Recipients: compliance@hospital.id, dpo@hospital.id     │   │
│  │ Format: PDF (signed) + CSV                              │   │
│  │ Last Run: Jan 1, 2026 | Next: Feb 1, 2026               │   │
│  │ [Edit] [Run Now] [Disable] [Delete]                     │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │ Weekly Data Access Summary                               │   │
│  │ Schedule: Every Monday at 8:00 AM                       │   │
│  │ Recipients: security@hospital.id                        │   │
│  │ Format: CSV                                             │   │
│  │ Last Run: Jan 13, 2026 | Next: Jan 20, 2026             │   │
│  │ [Edit] [Run Now] [Disable] [Delete]                     │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## Alur Review Bulanan Governance

### 7.10 Monthly Review Workflow

```
┌─────────────────────────────────────────────────────────────────────┐
│              GOVERNANCE REVIEW WORKFLOW                             │
└─────────────────────────────────────────────────────────────────────┘

WEEK 4 (End of Month)
┌─────────────────┐
│ System Auto-    │
│ generates       │
│ monthly audit   │
│ report          │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Report sent to  │
│ Data Governance │
│ Committee       │
└────────┬────────┘
         │
         ▼
WEEK 1 (Review)
┌─────────────────┐
│ Committee       │
│ reviews:        │
│ • Access        │
│   patterns      │
│ • Anomalies     │
│ • Compliance    │
│   gaps          │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Flag items for  │
│ investigation   │
└────────┬────────┘
         │
         ▼
WEEK 2 (Investigation)
┌─────────────────┐
│ Data Stewards   │
│ investigate     │
│ flagged items   │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Prepare         │
│ findings &      │
│ recommendations │
└────────┬────────┘
         │
         ▼
WEEK 3 (Action)
┌─────────────────┐
│ Implement       │
│ corrective      │
│ actions:        │
│ • Policy        │
│   updates       │
│ • Access        │
│   reviews       │
│ • Training      │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Document        │
│ decisions in    │
│ governance      │
│ log             │
└─────────────────┘
```

### 7.11 Governance Review UI

```
┌─────────────────────────────────────────────────────────────────┐
│ Monthly Governance Review - January 2026                        │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  Review Status: IN PROGRESS                                     │
│  Reviewer: Data Governance Committee                            │
│  Due Date: January 31, 2026                                     │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │ Summary Statistics                                      │   │
│  ├─────────────────────────────────────────────────────────┤   │
│  │ Total Events Reviewed: 2,847                            │   │
│  │ Flagged for Review: 12                                  │   │
│  │ Resolved: 8 | Pending: 4                                │   │
│  │ Compliance Score: 97.2% (↑ 1.3% from last month)       │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
│  Flagged Items:                                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │ ⚠️ 3 Unusual access patterns                             │   │
│  │    └─ User ahmad@hospital.id accessed 500+ records      │   │
│  │       outside normal hours                              │   │
│  │       [Investigate] [Approve as Normal] [Escalate]      │   │
│  ├─────────────────────────────────────────────────────────┤   │
│  │ ⚠️ 2 Quality rule bypasses                               │   │
│  │    └─ Critical rules bypassed for 2 exports             │   │
│  │       [Review Justifications]                           │   │
│  ├─────────────────────────────────────────────────────────┤   │
│  │ ⚠️ 5 Data exports without retention documentation        │   │
│  │    └─ Missing data retention acknowledgment             │   │
│  │       [Request Documentation]                           │   │
│  ├─────────────────────────────────────────────────────────┤   │
│  │ ⚠️ 2 Permission changes without approval                 │   │
│  │    └─ Admin role granted without secondary approval     │   │
│  │       [Review Approval Chain]                           │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
│  Committee Notes:                                               │
│  [                                                             │
│   Reviewed all flagged items. Unusual access pattern           │
│   for Ahmad was due to month-end data reconciliation.          │
│   Approved with note to establish prior notification           │
│   protocol for future month-end activities.                    │
│                                                          ]     │
│                                                                 │
│  [Save Draft]  [Submit for Approval]  [Request Extension]       │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## Data Integrity & Non-Repudiation

### 7.12 Tamper-Evident Logging

```typescript
interface IntegrityChain {
  // Each event includes hash of previous event
  // Creates blockchain-like integrity chain
  
  verifyChain(): {
    valid: boolean;
    brokenAt?: string; // eventId where chain breaks
    eventsVerified: number;
  };
  
  // Merkle tree for efficient verification
  generateMerkleRoot(events: AuditEvent[]): string;
  verifyEvent(eventId: string, proof: MerkleProof): boolean;
}

// Cryptographic signing
interface SignedAuditEvent extends AuditEvent {
  signature: {
    algorithm: 'Ed25519' | 'ECDSA' | 'RSA-PSS';
    publicKey: string;
    signature: string;
    timestamp: Date;
  };
}
```

### 7.13 Retention Policies

```typescript
interface RetentionPolicy {
  eventTypes: AuditAction[];
  retentionPeriod: number; // days
  
  // Archive settings
  archiveAfter: number; // days
  archiveLocation: 'GLACIER' | 'COLD_STORAGE' | 'LOCAL';
  
  // Deletion
  canDelete: boolean;
  deletionRequires: string[]; // roles
  deletionAudit: boolean; // Log deletions
  
  // Legal hold
  legalHoldSupport: boolean;
}

const DEFAULT_POLICIES: RetentionPolicy[] = [
  {
    eventTypes: ['DATA_EXPORTED', 'DATA_DELETED'],
    retentionPeriod: 2555, // 7 years (HIPAA)
    archiveAfter: 365,
    canDelete: false,
  },
  {
    eventTypes: ['USER_LOGIN', 'USER_LOGOUT'],
    retentionPeriod: 365, // 1 year
    archiveAfter: 90,
    canDelete: false,
  },
  {
    eventTypes: ['SYSTEM_BACKUP'],
    retentionPeriod: 90,
    canDelete: true,
    deletionRequires: ['ADMIN'],
  },
];
```

---

## Integration dengan Sistem

```
┌─────────────────────────────────────────────────────────────────┐
│ Audit System Integration                                        │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│   ┌─────────────┐                                               │
│   │   Record    │                                               │
│   │   Bridge    │                                               │
│   │   Core      │                                               │
│   └──────┬──────┘                                               │
│          │ Events                                                │
│          ▼                                                      │
│   ┌─────────────────────────────────────────────────────────┐   │
│   │              AUDIT EVENT BUS                            │   │
│   │         (Kafka / RabbitMQ / SNS)                        │   │
│   └──────┬─────────────────────────┬────────────────────────┘   │
│          │                         │                            │
│          ▼                         ▼                            │
│   ┌─────────────┐          ┌─────────────┐                     │
│   │  Audit DB   │          │  External   │                     │
│   │  (Primary)  │          │  Systems    │                     │
│   │             │          │             │                     │
│   │ • Events    │          │ • SIEM      │                     │
│   │ • Changes   │          │ • Log       │                     │
│   │ • Integrity │          │   Aggregator│                     │
│   └──────┬──────┘          │ • Data Lake │                     │
│          │                 └─────────────┘                     │
│          │                                                      │
│          ▼                                                      │
│   ┌─────────────────────────────────────────────────────────┐   │
│   │              AUDIT SERVICES                             │   │
│   │  ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐       │   │
│   │  │ Query   │ │ Report  │ │ Export  │ │ Alert   │       │   │
│   │  │ Service │ │ Service │ │ Service │ │ Service │       │   │
│   │  └─────────┘ └─────────┘ └─────────┘ └─────────┘       │   │
│   └─────────────────────────────────────────────────────────┘   │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```
