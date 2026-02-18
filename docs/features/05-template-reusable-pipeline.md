# Template & Reusable Pipeline

## Overview
Fitur **Template Pipeline** memungkinkan user menyimpan konfigurasi lengkap alur transformasi dan mapping sebagai template yang dapat digunakan kembali. Fitur ini meningkatkan efisiensi dengan mengeliminasi setup berulang dan memastikan konsistensi across projects/teams.

---

## Struktur Template

### 5.1 Template Schema

```typescript
interface PipelineTemplate {
  // Metadata
  id: string;
  name: string;
  description: string;
  version: string;
  
  // Ownership & Access
  owner: {
    userId: string;
    organizationId: string;
  };
  visibility: 'PRIVATE' | 'TEAM' | 'PUBLIC';
  sharedWith?: Array<{
    type: 'USER' | 'TEAM' | 'ORGANIZATION';
    id: string;
    permission: 'VIEW' | 'USE' | 'EDIT' | 'ADMIN';
  }>;
  
  // Content
  content: {
    // Import Configuration
    import: {
      format: 'csv' | 'json' | 'excel';
      parsingOptions: ParsingConfig;
      encoding?: string;
      delimiter?: string;
      hasHeader?: boolean;
    };
    
    // Field Mappings
    mappings: Array<{
      sourceField: string;
      sourcePattern?: string; // regex untuk dynamic matching
      canonicalField: string;
      transformations: TransformationStep[];
      conditions?: FieldCondition[];
    }>;
    
    // Transformations
    transformations: Array<{
      id: string;
      name: string;
      type: TransformationType;
      config: Record<string, any>;
      order: number;
    }>;
    
    // Quality Rules
    qualityRules: {
      ruleSetId: string;
      customRules: QualityRule[];
    };
    
    // Conflict Resolution Defaults
    conflictResolution: {
      defaultStrategy: ResolutionStrategy;
      preferredSources: string[];
      autoResolveThreshold: number;
    };
    
    // Export Configuration
    export: {
      format: 'json' | 'csv' | 'fhir' | 'hl7';
      filters?: ExportFilter[];
      transformations?: ExportTransformation[];
    };
  };
  
  // Versioning
  versioning: {
    current: TemplateVersion;
    history: TemplateVersion[];
  };
  
  // Usage Statistics
  stats: {
    createdAt: Date;
    updatedAt: Date;
    lastUsed: Date;
    useCount: number;
    cloneCount: number;
    averageRating: number;
    reviewCount: number;
  };
  
  // Tags & Categorization
  tags: string[];
  category: 'HEALTHCARE' | 'FINANCE' | 'RETAIL' | 'GENERAL' | 'CUSTOM';
  industry?: string;
  complianceFrameworks?: string[]; // e.g., 'HIPAA', 'GDPR'
}

interface TemplateVersion {
  version: string;
  createdAt: Date;
  createdBy: string;
  changelog: string;
  isLatest: boolean;
  contentHash: string;
}
```

### 5.2 Transformation Types

```typescript
type TransformationType =
  // Data Cleaning
  | 'trim'
  | 'lowercase'
  | 'uppercase'
  | 'remove_special_chars'
  | 'normalize_whitespace'
  
  // Type Conversion
  | 'to_string'
  | 'to_number'
  | 'to_boolean'
  | 'to_date'
  | 'parse_json'
  
  // Date/Time
  | 'format_date'
  | 'extract_date_part' // year, month, day
  | 'calculate_age'
  | 'timezone_convert'
  
  // String Manipulation
  | 'substring'
  | 'replace'
  | 'regex_extract'
  | 'concatenate'
  | 'split'
  
  // Lookup/Mapping
  | 'dictionary_lookup'
  | 'code_system_map' // ICD-10, LOINC, etc.
  | 'reference_data_lookup'
  
  // Calculated Fields
  | 'formula'
  | 'aggregation'
  | 'conditional_value'
  
  // Data Enrichment
  | 'geocode'
  | 'validate_address'
  | 'phone_normalize'
  
  // Custom
  | 'custom_javascript'
  | 'custom_python'
  | 'webhook_transform';
```

---

## Hak Akses (Access Control)

### Visibility Levels

| Level | Description | Use Case |
|-------|-------------|----------|
| **PRIVATE** | Hanya owner yang dapat melihat dan menggunakan | Personal workflows, eksperimen |
| **TEAM** | Semua member team dapat melihat, specific roles dapat use/edit | Department standards |
| **PUBLIC** | Semua user dalam organization dapat discover dan use | Organization-wide best practices |
| **MARKETPLACE** | Cross-organization sharing (jika di-enable) | Industry templates |

### Permission Matrix

| Action | Owner | Admin | Editor | User | Viewer |
|--------|-------|-------|--------|------|--------|
| View | ✓ | ✓ | ✓ | ✓ | ✓ |
| Use (Clone/Apply) | ✓ | ✓ | ✓ | ✓ | ✗ |
| Execute Pipeline | ✓ | ✓ | ✓ | ✓ | ✗ |
| Edit Content | ✓ | ✓ | ✓ | ✗ | ✗ |
| Manage Versions | ✓ | ✓ | ✓ | ✗ | ✗ |
| Share/Change Visibility | ✓ | ✓ | ✗ | ✗ | ✗ |
| Delete | ✓ | ✓ | ✗ | ✗ | ✗ |
| Manage Permissions | ✓ | ✓ | ✗ | ✗ | ✗ |

---

## Template Gallery Interface

### Gallery View

```
┌─────────────────────────────────────────────────────────────────────────┐
│ Template Gallery                                            [+ Create]  │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  View: [☑ My Templates] [☑ Team] [☑ Public] [☑ Marketplace]            │
│  Filter: [Category: All 🔽] [Industry: Healthcare 🔽] [Tags 🔽]         │
│  Search: [_________________________________]  [🔍]                     │
│  Sort: [Most Used 🔽]                                                   │
│                                                                         │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │ 🔒 Standard Hospital EHR Import        ★★★★★ (124 uses)        │   │
│  │ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │   │
│  │ Category: Healthcare | Owner: Data Team | Team Access          │   │
│  │                                                                 │   │
│  │ Tags: EHR, HL7, FHIR, Standardization                          │   │
│  │                                                                 │   │
│  │ 📊 Mappings: 45 fields    🔄 Transforms: 12    ✅ Rules: 8     │   │
│  │                                                                 │   │
│  │ [Preview] [Clone & Edit] [Use Now]  [v2.3.1]                   │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                                                                         │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │ 🌐 Universal CSV Normalizer           ★★★★☆ (89 uses)          │   │
│  │ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │   │
│  │ Category: General | Owner: System | Public Access              │   │
│  │                                                                 │   │
│  │ Tags: CSV, Universal, Cross-Industry                           │   │
│  │                                                                 │   │
│  │ 📊 Mappings: Auto-detect  🔄 Transforms: 5     ✅ Rules: 3     │   │
│  │                                                                 │   │
│  │ [Preview] [Clone & Edit] [Use Now]  [v1.5.0]                   │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                                                                         │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │ 👤 My Lab Results Parser              ★★★★★ (12 uses)          │   │
│  │ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │   │
│  │ Category: Healthcare | Owner: You | Private                    │   │
│  │                                                                 │   │
│  │ Tags: Lab, LOINC, Personal                                     │   │
│  │                                                                 │   │
│  │ 📊 Mappings: 23 fields    🔄 Transforms: 8     ✅ Rules: 5     │   │
│  │                                                                 │   │
│  │ [Edit] [Duplicate] [Share]  [v1.0.2]                           │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

### Template Detail View

```
┌─────────────────────────────────────────────────────────────────────────┐
│ ← Back to Gallery                                                       │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  Standard Hospital EHR Import                               [⭐ Favorite]│
│  ═══════════════════════════════════════════════════════════════════    │
│                                                                         │
│  Created by Data Team • Updated Jan 15, 2026 • v2.3.1                  │
│  ★★★★★ 4.8/5 (56 reviews) • 1,247 successful runs                        │
│                                                                         │
│  Description:                                                           │
│  Template standar untuk meng-import data dari berbagai EHR systems     │
│  (SIMRS, EHR A, Clinic C) ke canonical schema. Sudah termasuk:         │
│  - Auto-mapping 45 fields umum                                          │
│  - Normalisasi diagnosis ICD-10                                         │
│  - Validasi medication doses                                            │
│  - Conflict resolution rules                                            │
│                                                                         │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │ Configuration Preview                                           │   │
│  ├─────────────────────────────────────────────────────────────────┤   │
│  │                                                                 │   │
│  │ Import: CSV/JSON/Excel with auto-detection                     │   │
│  │                                                                 │   │
│  │ Key Mappings:                                                   │   │
│  │ • patient_id, mrn, no_rm → patient.identifier                   │   │
│  │ • name, nama, fullName → patient.name                           │   │
│  │ • diagnosis, diagnosa, dx → conditions[]                        │   │
│  │ • meds, obat_aktif → medications[]                              │   │
│  │ ... and 41 more                                                 │   │
│  │                                                                 │   │
│  │ Quality Rules:                                                  │   │
│  │ • Patient ID Required (CRITICAL)                                │   │
│  │ • Valid ICD-10 Check (HIGH)                                     │   │
│  │ • BP Range Validation (MEDIUM)                                  │   │
│  │ ... and 5 more                                                  │   │
│  │                                                                 │   │
│  │ Export: FHIR R4 Bundle                                          │   │
│  │                                                                 │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                                                                         │
│  Version History:                                                       │
│  • v2.3.1 (current) - Added allergy normalization                      │
│  • v2.3.0 - Improved medication mapping                                │
│  • v2.2.0 - Added BP validation rules                                  │
│  • ...                                                                  │
│                                                                         │
│  [🚀 Use This Template]  [📝 Clone & Customize]  [📊 View Analytics]    │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## Alur Clone-Edit-Publish

### Template Lifecycle Workflow

```
┌─────────────────────────────────────────────────────────────────────┐
│                  TEMPLATE LIFECYCLE                                 │
└─────────────────────────────────────────────────────────────────────┘

CREATE NEW
┌─────────────┐
│   START     │
│   Create    │
│   Blank /   │
│   Clone     │
└──────┬──────┘
       │
       ▼
┌─────────────────┐
│  DRAFT MODE     │
│  (Private)      │
│                 │
│  • Edit config  │
│  • Test runs    │
│  • Save progress│
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Ready to       │
│  Publish?       │
└────────┬────────┘
         │
    ┌────┴────┐
    ▼         ▼
  NO        YES
   │          │
   ▼          ▼
┌────────┐ ┌─────────────────┐
│ Continue│ │ Version Bump:   │
│ Editing │ │ • MAJOR: Breaking│
└────────┘ │ • MINOR: Feature │
           │ • PATCH: Fix     │
           └────────┬────────┘
                    │
                    ▼
           ┌─────────────────┐
           │  Select         │
           │  Visibility:    │
           │  • Private      │
           │  • Team         │
           │  • Public       │
           └────────┬────────┘
                    │
                    ▼
           ┌─────────────────┐
           │  Publish        │
           │  Template       │
           └────────┬────────┘
                    │
                    ▼
           ┌─────────────────┐
           │  LIVE / ACTIVE  │
           │                 │
           │  Available for  │
           │  use by others  │
           └────────┬────────┘
                    │
     ┌──────────────┼──────────────┐
     │              │              │
     ▼              ▼              ▼
┌─────────┐  ┌──────────┐  ┌──────────┐
│ Update  │  │ Deprecate│  │  Delete  │
│ Create  │  │ (Soft    │  │  (Hard   │
│ New Ver │  │  delete) │  │  delete) │
└────┬────┘  └────┬─────┘  └────┬─────┘
     │            │             │
     ▼            ▼             ▼
┌─────────────────────────────────────┐
│        VERSION HISTORY              │
│  Maintained for audit & rollback    │
└─────────────────────────────────────┘
```

### Clone Workflow

```typescript
interface CloneOperation {
  sourceTemplateId: string;
  newTemplate: {
    name: string; // Default: "Copy of {original}"
    description?: string;
    visibility: 'PRIVATE'; // Always start as private
  };
  options: {
    copyMappings: boolean;
    copyTransformations: boolean;
    copyQualityRules: boolean;
    linkToOriginal: boolean; // Track lineage
  };
}

// Lineage tracking
interface TemplateLineage {
  originalTemplateId: string;
  originalVersion: string;
  clonedBy: string;
  clonedAt: Date;
  modifications: Array<{
    field: string;
    changeType: 'ADDED' | 'MODIFIED' | 'REMOVED';
    timestamp: Date;
  }>;
}
```

---

## Version Management

### Semantic Versioning for Templates

```
Format: MAJOR.MINOR.PATCH

MAJOR (X.0.0):
- Breaking changes to mapping structure
- Removed fields
- Changed transformation behavior
- Migration required for existing pipelines

MINOR (x.Y.0):
- New mappings added
- New transformations
- New quality rules
- Backward compatible

PATCH (x.y.Z):
- Bug fixes
- Documentation updates
- Rule adjustments
- No functional changes
```

### Version Comparison

```
┌─────────────────────────────────────────────────────────────────┐
│ Compare Versions: Standard Hospital EHR Import                  │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  From: [v2.2.0 🔽]  →  To: [v2.3.1 (current) 🔽]  [Compare]     │
│                                                                 │
│  Changes (v2.2.0 → v2.3.1):                                    │
│                                                                 │
│  🆕 ADDED (3):                                                  │
│  ├─ Mapping: allergy_status → allergies[]                      │
│  ├─ Transform: normalize_allergy_reaction                      │
│  └─ Rule: allergy_required_if_reaction_present                 │
│                                                                 │
│  📝 MODIFIED (2):                                               │
│  ├─ Mapping: diagnosis → conditions[]                          │
│  │   └─ Added synonym: "penyakit"                              │
│  └─ Transform: normalize_bp                                    │
│      └─ Changed: Handle "mm Hg" variant                        │
│                                                                 │
│  🗑️ REMOVED (0)                                                │
│                                                                 │
│  Migration Notes:                                               │
│  • Auto-migration available for pipelines using v2.2.0         │
│  • Review allergy mappings if upgrading                        │
│                                                                 │
│  [View Diff]  [Upgrade Pipeline]  [Keep Current Version]        │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## Pipeline Instance vs Template

### Relationship Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                    TEMPLATE SYSTEM                          │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│   TEMPLATE (Blueprint)                                      │
│   ┌─────────────────────────────────────────────────────┐   │
│   │ Standard Hospital EHR Import (v2.3.1)               │   │
│   │                                                     │   │
│   │ Mappings ◄─────────────────────────┐                │   │
│   │ Transformations ◄──────────────────┤                │   │
│   │ Quality Rules ◄────────────────────┤                │   │
│   │ Export Config ◄────────────────────┘                │   │
│   └────────────────────┬────────────────────────────────┘   │
│                        │                                    │
│            ┌───────────┼───────────┐                        │
│            │ Clone/Instance        │                        │
│            ▼           ▼           ▼                        │
│     ┌──────────┐ ┌──────────┐ ┌──────────┐                 │
│     │Pipeline A│ │Pipeline B│ │Pipeline C│                 │
│     │(RS A)    │ │(RS B)    │ │(Klinik X)│                 │
│     └────┬─────┘ └────┬─────┘ └────┬─────┘                 │
│          │            │            │                        │
│          ▼            ▼            ▼                        │
│     ┌──────────┐ ┌──────────┐ ┌──────────┐                 │
│     │Instance  │ │Instance  │ │Instance  │                 │
│     │+ Custom  │ │+ Custom  │ │+ Custom  │                 │
│     │Mappings  │ │Rules     │ │Transforms│                 │
│     └──────────┘ └──────────┘ └──────────┘                 │
│                                                             │
│   Key Points:                                               │
│   • Template changes don't auto-update instances           │
│   • Instances can override template settings               │
│   • Updates to template can be offered to instances        │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## Template Analytics

### Usage Metrics

```typescript
interface TemplateAnalytics {
  usage: {
    totalRuns: number;
    successfulRuns: number;
    failedRuns: number;
    averageRuntime: number;
    lastUsed: Date;
    uniqueUsers: number;
    uniqueOrganizations: number;
  };
  
  performance: {
    averageMappingAccuracy: number;
    averageQualityScore: number;
    commonErrors: Array<{
      errorType: string;
      frequency: number;
    }>;
  };
  
  adoption: {
    clones: number;
    activeInstances: number;
    versionDistribution: Record<string, number>;
  };
  
  feedback: {
    ratings: number[];
    reviews: TemplateReview[];
    featureRequests: string[];
  };
}
```

---

## Integration dengan Workflow

```
┌─────────────────────────────────────────────────────────────────┐
│ Template dalam End-to-End Workflow                              │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  1. USER MEMILIH TEMPLATE                                       │
│     ┌─────────────┐                                             │
│     │   Browse    │                                             │
│     │   Gallery   │                                             │
│     └──────┬──────┘                                             │
│            │ Select "Standard Hospital EHR Import"               │
│            ▼                                                    │
│     ┌─────────────┐                                             │
│     │   Preview   │                                             │
│     │  & Confirm  │                                             │
│     └──────┬──────┘                                             │
│            │                                                    │
│  2. KONFIGURASI INSTANCE                                        │
│            ▼                                                    │
│     ┌─────────────┐                                             │
│     │   Apply     │                                             │
│     │  Template   │                                             │
│     └──────┬──────┘                                             │
│            │                                                    │
│            ▼                                                    │
│     ┌─────────────┐     ┌─────────────┐                        │
│     │   Override  │────▶│  Custom     │                        │
│     │   Settings  │◀────│  Settings   │                        │
│     └──────┬──────┘     └─────────────┘                        │
│            │                                                    │
│  3. EKSEKUSI PIPELINE                                           │
│            ▼                                                    │
│     ┌─────────────┐                                             │
│     │   Smart     │                                             │
│     │   Import    │                                             │
│     └──────┬──────┘                                             │
│            │                                                    │
│            ▼                                                    │
│     ┌─────────────┐                                             │
│     │  AI Mapping │                                             │
│     │ (Template   │                                             │
│     │  mappings)  │                                             │
│     └──────┬──────┘                                             │
│            │                                                    │
│            ▼                                                    │
│     ┌─────────────┐                                             │
│     │  Quality    │                                             │
│     │   Gate      │                                             │
│     │(Template    │                                             │
│     │  rules)     │                                             │
│     └──────┬──────┘                                             │
│            │                                                    │
│            ▼                                                    │
│     ┌─────────────┐                                             │
│     │   Export    │                                             │
│     │ (Template   │                                             │
│     │  format)    │                                             │
│     └─────────────┘                                             │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```
