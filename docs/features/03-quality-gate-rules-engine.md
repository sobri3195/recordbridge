# Quality Gate & Rules Engine

## Overview
Fitur **Quality Gate** adalah sistem validasi berbasis rule engine yang memeriksa kualitas data sebelum diekspor. Sistem ini memastikan data yang keluar memenuhi standar completeness, accuracy, consistency, dan validity melalui serangkaian rules yang dapat dikonfigurasi.

---

## Rule Categories

### 3.1 Rule Types

```typescript
interface QualityRule {
  id: string;
  name: string;
  description: string;
  category: RuleCategory;
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  condition: RuleCondition;
  action: RuleAction;
  enabled: boolean;
  createdBy: string;
  createdAt: Date;
  version: number;
}

type RuleCategory = 
  | 'COMPLETENESS'    // Missing/null values
  | 'CONSISTENCY'     // Format/type uniformity
  | 'VALIDITY'        // Range/domain validation
  | 'UNIQUENESS'      // Duplicate detection
  | 'REFERENTIAL'     // Foreign key integrity
  | 'CUSTOM';         // User-defined logic
```

### 3.2 Built-in Rules

#### Completeness Rules
| Rule | Description | Example |
|------|-------------|---------|
| `required_field` | Field tidak boleh null/empty | patient_id wajib diisi |
| `required_group` | Salah satu dari group fields harus terisi | phone OR email |
| `conditional_required` | Field wajib jika kondisi terpenuhul | allergy_detail wajib jika has_allergy=true |

#### Consistency Rules
| Rule | Description | Example |
|------|-------------|---------|
| `type_match` | Value harus sesuai tipe yang didefinisikan | date_of_birth harus valid date |
| `format_regex` | Value harus match pattern | MRN harus format `MRN-\d{5}` |
| `unit_consistency` | Unit measurement harus konsisten | All BP readings dalam mmHg |

#### Validity Rules
| Rule | Description | Example |
|------|-------------|---------|
| `range_check` | Numeric value dalam range valid | heart_rate: 30-220 bpm |
| `date_range` | Date dalam range yang masuk akal | DOB tidak boleh di masa depan |
| `enum_values` | Value harus dari daftar yang diizinkan | gender: M/F/O |
| `cross_field_validation` | Validasi antar field | discharge_date ≥ admission_date |

#### Uniqueness Rules
| Rule | Description | Example |
|------|-------------|---------|
| `unique_key` | Kombinasi field harus unik | patient_id + source_system |
| `no_duplicates` | Tidak boleh ada duplikat exact | No duplicate patient records |

#### Referential Rules
| Rule | Description | Example |
|------|-------------|---------|
| `foreign_key` | Reference harus valid | diagnosis_code harus ada di ICD-10 master |
| `hierarchy_check` | Validasi hierarki data | City harus valid untuk selected Province |

---

## Mekanisme Konfigurasi Rule

### Configuration Interface

```typescript
interface RuleConfiguration {
  // Rule Selector
  rules: Array<{
    ruleId: string;
    enabled: boolean;
    parameters?: Record<string, any>;
    overrides?: {
      severity?: RuleSeverity;
      message?: string;
    };
  }>;
  
  // Rule Sets (Group of rules)
  ruleSets: Array<{
    id: string;
    name: string;
    description: string;
    rules: string[]; // ruleIds
    applicability: {
      dataSources?: string[];
      recordTypes?: string[];
      conditions?: RuleCondition;
    };
  }>;
  
  // Severity Escalation
  escalation: {
    enabled: boolean;
    thresholds: {
      criticalCount: number; // Alert if N critical errors
      errorRate: number;     // Alert if error rate > X%
    };
    actions: EscalationAction[];
  };
}
```

### Visual Rule Builder

```
┌─────────────────────────────────────────────────────────────────┐
│ Rule Configuration                                              │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  [+ New Rule]  [Import Set]  [Export Config]  [Test Rules]     │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │ Active Rule Sets                               [⚙️]     │   │
│  ├─────────────────────────────────────────────────────────┤   │
│  │                                                         │   │
│  │ ☑ Standard Hospital Data Quality (12 rules)            │   │
│  │   Applicable: All EHR sources                          │   │
│  │   [View] [Edit] [Duplicate] [Deactivate]               │   │
│  │                                                         │   │
│  │ ☑ Lab Results Validation (8 rules)                     │   │
│  │   Applicable: Lab systems only                         │   │
│  │   [View] [Edit] [Duplicate] [Deactivate]               │   │
│  │                                                         │   │
│  │ ☐ Custom Pharmacy Rules (5 rules) [DRAFT]              │   │
│  │   [View] [Edit] [Publish] [Delete]                     │   │
│  │                                                         │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │ Rule Details: Standard Hospital Data Quality            │   │
│  ├─────────────────────────────────────────────────────────┤   │
│  │                                                         │   │
│  │ Severity Filter: [All 🔽]  Search: [________]          │   │
│  │                                                         │   │
│  │ Rule Name                    │ Severity │ Status │ Ops  │   │
│  │ ─────────────────────────────┼──────────┼────────┼───── │   │
│  │ Patient ID Required          │ CRITICAL │ ☑ ON   │ ⚙️ ✕ │   │
│  │ Valid Date of Birth          │ HIGH     │ ☑ ON   │ ⚙️ ✕ │   │
│  │ ICD-10 Code Validity         │ HIGH     │ ☑ ON   │ ⚙️ ✕ │   │
│  │ Blood Pressure Range Check   │ MEDIUM   │ ☑ ON   │ ⚙️ ✕ │   │
│  │ Contact Info Completeness    │ MEDIUM   │ ☐ OFF  │ ⚙️ ✕ │   │
│  │ Duplicate Record Detection   │ LOW      │ ☑ ON   │ ⚙️ ✕ │   │
│  │                                                         │   │
│  │                    [+ Add Rule to Set]                  │   │
│  │                                                         │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### Rule Editor Modal

```
┌────────────────────────────────────────────────────────────────┐
│ Edit Rule: Blood Pressure Range Check                 [×]      │
├────────────────────────────────────────────────────────────────┤
│                                                                │
│  Basic Info:                                                   │
│  Name: [Blood Pressure Range Check                   ]        │
│  Description: [Validates BP is within physiologically    ]    │
│               [possible range                             ]    │
│  Category: [Validity 🔽]  Severity: [MEDIUM 🔽]                │
│                                                                │
│  Condition:                                                    │
│  ┌────────────────────────────────────────────────────────┐   │
│  │ Field: [blood_pressure_systolic 🔽]                    │   │
│  │ Operator: [is between 🔽]                              │   │
│  │ Value: [  70  ] and [  250  ]                          │   │
│  │ Unit: [mmHg 🔽]                                        │   │
│  │                                                        │   │
│  │ AND                                                    │   │
│  │                                                        │   │
│  │ Field: [blood_pressure_diastolic 🔽]                   │   │
│  │ Operator: [is between 🔽]                              │   │
│  │ Value: [  40  ] and [  150  ]                          │   │
│  │ Unit: [mmHg 🔽]                                        │   │
│  └────────────────────────────────────────────────────────┘   │
│                                                                │
│  Action on Failure:                                            │
│  (•) Flag as warning (allow export)                            │
│  ( ) Block export until resolved                               │
│  ( ) Auto-correct if possible [Configure →]                    │
│  ( ) Quarantine record for review                              │
│                                                                │
│  Custom Error Message:                                         │
│  [Blood pressure reading {value} is outside normal range]     │
│                                                                │
│  [Test Rule]  [Save as Draft]  [Publish Rule]                  │
│                                                                │
└────────────────────────────────────────────────────────────────┘
```

---

## Severity Prioritas dan Alur Eskalasi

### Severity Levels

```typescript
const severityConfig = {
  CRITICAL: {
    color: '#DC2626', // red-600
    icon: '🚫',
    defaultAction: 'block',
    notificationChannels: ['email', 'slack', 'in_app'],
    escalationTime: 0, // Immediate
  },
  HIGH: {
    color: '#EA580C', // orange-600
    icon: '⚠️',
    defaultAction: 'warn',
    notificationChannels: ['email', 'in_app'],
    escalationTime: 24 * 60 * 60 * 1000, // 24 hours
  },
  MEDIUM: {
    color: '#CA8A04', // yellow-600
    icon: '⚡',
    defaultAction: 'warn',
    notificationChannels: ['in_app'],
    escalationTime: 7 * 24 * 60 * 60 * 1000, // 7 days
  },
  LOW: {
    color: '#2563EB', // blue-600
    icon: 'ℹ️',
    defaultAction: 'log',
    notificationChannels: [],
    escalationTime: null,
  },
};
```

### Escalation Workflow

```
┌─────────────────┐
│  Quality Check  │
│     Trigger     │
└────────┬────────┘
         ▼
┌─────────────────┐
│  Run Rule Engine│
│  - All active   │
│    rules        │
└────────┬────────┘
         ▼
┌─────────────────┐
│  Severity       │
│  Assessment     │
└────────┬────────┘
         ▼
┌─────────────────────────────────────────────┐
│              Decision Matrix                │
├─────────────────────────────────────────────┤
│                                             │
│  Any CRITICAL?                              │
│  ├── YES → Block Export + Immediate Alert   │
│  │         Notify: Data Owner, Admin        │
│  │                                          │
│  └── NO → Check HIGH errors                 │
│           ├── Count > threshold?            │
│           │   ├── YES → Warn + Email Alert  │
│           │   └── NO  → Log only            │
│           └── Add to Quality Report         │
│                                             │
└─────────────────────────────────────────────┘
```

### Notification Templates

**Critical Error Alert**
```
Subject: 🚫 CRITICAL: Data Quality Gate Blocked Export

Export Job: #12345
Blocked By: 3 CRITICAL errors

Errors:
1. Patient ID missing (Record: P-8892)
2. Invalid ICD-10 code: XYZ123 (Record: P-8893)
3. Future date in admission_date: 2027-01-01 (Record: P-8894)

Action Required: Review and resolve errors before export.
[View in RecordBridge] [Escalate to Team]
```

**Quality Report Digest**
```
Subject: Daily Data Quality Report - 15 Jan 2026

Summary:
• Total Records Processed: 1,247
• Pass Rate: 94.2%
• Critical Issues: 0
• High Issues: 3
• Medium Issues: 42

Top Issues:
1. Missing phone number (23 records)
2. Unmapped diagnosis codes (12 records)
3. BP unit inconsistency (7 records)

[View Full Report]
```

---

## Execution Engine

### Rule Evaluation Flow

```typescript
class QualityGateEngine {
  async evaluate(record: CanonicalRecord): Promise<QualityResult> {
    const violations: Violation[] = [];
    
    for (const rule of this.activeRules) {
      if (!rule.enabled) continue;
      
      const isValid = await this.evaluateRule(rule, record);
      
      if (!isValid) {
        violations.push({
          ruleId: rule.id,
          severity: rule.severity,
          message: this.generateMessage(rule, record),
          field: rule.condition.field,
          value: this.getFieldValue(record, rule.condition.field),
          suggestedFix: this.suggestFix(rule, record),
        });
      }
    }
    
    return {
      passed: !violations.some(v => v.severity === 'CRITICAL'),
      violations,
      score: this.calculateQualityScore(violations),
      timestamp: new Date(),
    };
  }
}
```

### Performance Optimization

```typescript
interface EngineOptimization {
  // Parallel evaluation for independent rules
  parallelExecution: boolean;
  
  // Early termination on critical
  failFast: boolean;
  
  // Caching for expensive checks
  cache: {
    referentialChecks: boolean;
    lookupResults: number; // cache size
  };
  
  // Batch processing
  batchSize: number;
  streaming: boolean;
}
```

---

## Dashboard dan Reporting

### Quality Dashboard

```
┌─────────────────────────────────────────────────────────────────┐
│ Data Quality Dashboard                              [Export 📊] │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐ ┌───────────┐ │
│  │ Pass Rate   │ │ Records     │ │ Critical    │ │ Avg       │ │
│  │             │ │ Checked     │ │ Issues      │ │ Score     │ │
│  │   94.2%     │ │   12,847    │ │     0       │ │   8.4/10  │ │
│  │   ↑ 2.1%    │ │   Today     │ │   (24h)     │ │   ↑ 0.3   │ │
│  └─────────────┘ └─────────────┘ └─────────────┘ └───────────┘ │
│                                                                 │
│  Quality Trend (Last 30 Days)                                   │
│  ┌───────────────────────────────────────────────────────────┐ │
│  │                                                           │ │
│  │    100% ┤                          ╭────                  │ │
│  │     90% ┤        ╭────╮           ╭╯                     │ │
│  │     80% ┤   ╭───╯    ╰────╮  ╭───╯                       │ │
│  │     70% ┤──╯              ╰──╯                           │ │
│  │         └┬────┬────┬────┬────┬────┬────┬────┬────┬────┬  │ │
│  │         16   17   18   19   20   21   22   23   24   25  │ │
│  │                                                           │ │
│  └───────────────────────────────────────────────────────────┘ │
│                                                                 │
│  Issues by Category                                             │
│  ┌──────────────────────────┐  ┌────────────────────────────┐  │
│  │ Completeness   ████████  │  │ Top Failing Rules          │  │
│  │ Consistency    █████     │  │ 1. Missing Patient ID (23) │  │
│  │ Validity       ████      │  │ 2. Invalid ICD-10 (12)     │  │
│  │ Uniqueness     ██        │  │ 3. BP Range Check (7)      │  │
│  │ Referential    █         │  │ 4. Future Date (3)         │  │
│  └──────────────────────────┘  └────────────────────────────┘  │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### Drill-Down Reports
- Per-field quality statistics
- Per-source quality comparison
- Trend analysis over time
- User action audit trail

---

## Integration Points

```
┌─────────────────┐
│  AI Mapping     │
│  Assistant      │
└────────┬────────┘
         │ mappings confirmed
         ▼
┌─────────────────────────────┐
│      QUALITY GATE           │
│  ┌───────────────────────┐  │
│  │ 1. Load Active Rules  │  │
│  │ 2. Evaluate Record    │  │
│  │ 3. Generate Report    │  │
│  │ 4. Apply Actions      │  │
│  └───────────────────────┘  │
└────────┬────────────────────┘
         │
    ┌────┴────┐
    ▼         ▼
┌────────┐ ┌────────┐
│  PASS  │ │  FAIL  │
│ Export │ │ Review │
│ Queue  │ │ Queue  │
└────────┘ └────────┘
```
