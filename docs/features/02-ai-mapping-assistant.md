# AI Mapping Assistant

## Overview
Fitur **AI Mapping Assistant** menggunakan machine learning dan heuristic-based matching untuk secara otomatis menyarankan pemetaan field dari data sumber ke canonical schema. Fitur ini mengurangi waktu konfigurasi manual dan meningkatkan akurasi pemetaan melalui confidence scoring yang transparan.

---

## Detail Fitur

### 2.1 Auto-Mapping Engine

#### Matching Algorithms

**1. Semantic Similarity (Primary)**
- **Embeddings**: Menggunakan model sentence-transformers (all-MiniLM-L6-v2)
- **Cosine Similarity**: Threshold > 0.75 untuk match
- **Multi-language Support**: Mendukung Bahasa Indonesia dan Inggris

```typescript
// Contoh similarity matching
source: "kencing_manis" 
  → embedding → similarity dengan "diabetes_mellitus" = 0.89 ✓
source: "tekanan_darah"
  → embedding → similarity dengan "blood_pressure" = 0.92 ✓
```

**2. Pattern Matching (Secondary)**
- Regex patterns untuk common abbreviations
- Substring matching dengan fuzzy logic
- Domain-specific dictionaries (medical terminology)

```typescript
const patterns = {
  bloodPressure: /^(bp|tensi|tekanan[_\s]?darah)/i,
  heartRate: /^(hr|pulse|denyut|nadi)/i,
  dateOfBirth: /^(dob|tgl[_\s]?lahir|tanggal[_\s]?lahir|birth[_\s]?date)/i,
  // ...
};
```

**3. Historical Learning (Tertiary)**
- Learning dari mapping decisions sebelumnya
- User-specific preference learning
- Organization-wide pattern accumulation

```typescript
interface HistoricalMapping {
  sourcePattern: string;
  canonicalField: string;
  frequency: number;
  userId?: string;
  organizationId?: string;
  lastUsed: Date;
}
```

**4. Contextual Matching**
- Analisis nilai sample untuk memperkuat confidence
- Cross-field validation (e.g., "sistolik" + "diastolik" → blood_pressure)
- Type compatibility checking

### 2.2 Confidence Score System

#### Score Calculation
```typescript
interface ConfidenceScore {
  overall: number; // 0-1
  breakdown: {
    semantic: number;      // Similarity-based
    pattern: number;       // Regex/pattern match
    historical: number;    // Past usage
    contextual: number;    // Value analysis
  };
  factors: {
    nameSimilarity: number;
    valueCompatibility: number;
    typeMatch: boolean;
    historicalSuccess: number;
  };
}
```

#### Confidence Tiers
| Tier | Range | Visual Indicator | Action |
|------|-------|------------------|--------|
| **High** | 0.90 - 1.00 | 🟢 Green badge | Auto-apply, no review needed |
| **Medium** | 0.70 - 0.89 | 🟡 Yellow badge | Suggested, recommend review |
| **Low** | 0.50 - 0.69 | 🟠 Orange badge | Uncertain, requires approval |
| **No Match** | < 0.50 | 🔴 Red/None | Manual mapping required |

---

## Desain Antarmuka (UI Design)

### Main Mapping Interface

```
┌─────────────────────────────────────────────────────────────────────┐
│  AI Mapping Assistant                                    [?] [⚙️]   │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  Auto-Match Progress: [████████████████████░░░░] 85% Complete       │
│                                                                     │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │ Filter: [All 🔽]  Search: [_____________]  [🔍 AI Suggest]  │   │
│  └─────────────────────────────────────────────────────────────┘   │
│                                                                     │
│  Source Field          │ Detected Type │ AI Suggestion    │ Status │
│  ──────────────────────┼───────────────┼──────────────────┼────────┤
│  ☑ no_rm               │ string        │ patient_id       │ 🟢 96% │
│  ☑ nama                │ string        │ full_name        │ 🟢 94% │
│  ☑ tgl_lahir           │ date          │ date_of_birth    │ 🟢 91% │
│  ☑ tensi_sistolik      │ number        │ bp_systolic      │ 🟡 82% │
│  ☐ diagnosa_icd        │ string        │ diagnosis_code   │ 🟡 78% │
│  ☐ keterangan          │ string        │ (no match)       │ 🔴 --  │
│  ☑ alergi_status       │ category      │ allergies        │ 🟢 88% │
│                                                                     │
│  [✓ Approve All High]  [👁️ Review Medium]  [✏️ Manual Map]         │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

### Field Detail Modal

```
┌─────────────────────────────────────────────────────────────┐
│ Field: "tensi_sistolik"                           [×]       │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  Suggested Mapping: blood_pressure_systolic                 │
│  Confidence: 82% 🟡                                         │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ Confidence Breakdown:                               │   │
│  │ • Name Similarity: 75% (pattern match)              │   │
│  │ • Value Compatibility: 95% (numeric, range 90-180)  │   │
│  │ • Historical Usage: 85% (used 45 times)             │   │
│  │ • Type Match: ✓ (number → number)                   │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│  Sample Values from Source:                                 │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ 120, 118, 122, 119, 121, 117, 125                   │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│  Similar Canonical Fields:                                  │
│  • blood_pressure_systolic (82%) ✓                          │
│  • heart_rate (34%)                                         │
│  • pulse_rate (31%)                                         │
│                                                             │
│  [✓ Approve]  [✗ Reject]  [🔁 Try Another]  [? Help]       │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### Approval/Reject Mechanism

#### Per-Field Actions
```typescript
interface MappingDecision {
  sourceField: string;
  suggestedCanonical: string;
  confidence: number;
  decision: 'approved' | 'rejected' | 'modified' | 'pending';
  modifiedTo?: string; // jika user memilih field lain
  note?: string; // alasan reject/modify
  decidedBy: string;
  decidedAt: Date;
}
```

#### Bulk Actions
- **Approve All High**: Setuju semua mapping dengan confidence ≥ 0.90
- **Review Medium**: Tampilkan semua mapping 0.70-0.89 dalam gallery view
- **Clear All**: Reset semua ke pending
- **Apply Template**: Gunakan mapping template yang tersimpan

---

## Alur Revisi dan Audit

### Revision History
```typescript
interface MappingRevision {
  revisionId: string;
  timestamp: Date;
  userId: string;
  action: 'create' | 'update' | 'approve' | 'reject';
  fieldChanges: Array<{
    sourceField: string;
    oldMapping?: string;
    newMapping: string;
    confidence: number;
  }>;
  reason?: string; // Optional reason for change
}
```

### Audit Trail Features
1. **Timeline View**: Visualisasi perubahan mapping kronologis
2. **Diff Mode**: Perbandingan before/after
3. **User Attribution**: Siapa yang mengubah apa dan kapan
4. **Export Audit**: PDF/CSV report untuk compliance

```
┌──────────────────────────────────────────────────────────────┐
│ Mapping Audit Trail                                          │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│  Today, 14:30 WIB                                           │
│  ├─ user@hospital.id approved "tensi_sistolik" → "bp_sys"   │
│  └─ user@hospital.id rejected "keterangan" (manual entry)   │
│                                                              │
│  Today, 14:25 WIB                                           │
│  └─ AI Assistant suggested 15 mappings (confidence avg 84%) │
│                                                              │
│  Yesterday, 09:15 WIB                                       │
│  └─ admin@hospital.id imported template "Standard RS"       │
│                                                              │
└──────────────────────────────────────────────────────────────┘
```

---

## Transparency & Explainability

### Explainability Panel
Setiap AI suggestion dapat dijelaskan:

1. **Why this match?**
   - Semantic similarity score
   - Pattern yang cocok
   - Historical usage count
   - Sample values yang mendukung

2. **Alternative options**
   - Top 3 canonical fields lainnya dengan score
   - Quick-switch button

3. **Uncertainty indicators**
   - ⚠️ Low sample size (< 10 values)
   - ⚠️ Ambiguous field name
   - ⚠️ Type mismatch potential

### User Feedback Loop
```typescript
interface UserFeedback {
  mappingId: string;
  rating: 'correct' | 'incorrect' | 'partial';
  comment?: string;
  betterSuggestion?: string;
}
```

Feedback digunakan untuk:
- Melatih ulang model (batch updates)
- Meningkatkan historical patterns
- Identifikasi area untuk improvement

---

## Technical Implementation

### ML Pipeline
```
┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│  Text       │───▶│  Embedding  │───▶│  Similarity │
│  Preprocess │    │  Model      │    │  Search     │
└─────────────┘    └─────────────┘    └──────┬──────┘
                                              │
┌─────────────┐    ┌─────────────┐           │
│  Pattern    │───▶│  Score      │◀──────────┘
│  Matcher    │    │  Ensemble   │
└─────────────┘    └──────┬──────┘
                          │
                    ┌─────▼─────┐
                    │  Confidence│
                    │  Calibration│
                    └─────┬─────┘
                          │
                    ┌─────▼─────┐
                    │  Suggestion│
                    │  Output    │
                    └───────────┘
```

### API Endpoints
```typescript
// Generate mapping suggestions
POST /api/mapping/suggest
Request: {
  sourceFields: Array<{
    name: string;
    type: string;
    sampleValues: any[];
  }>;
  canonicalSchema: string[]; // available canonical fields
  context?: string; // e.g., 'hospital_a', 'lab_system_b'
}
Response: {
  suggestions: Array<{
    sourceField: string;
    suggestedCanonical: string;
    confidence: number;
    alternatives: Array<{ field: string; confidence: number; }>;
    explanation: ExplanationBreakdown;
  }>;
}

// Apply user decisions
POST /api/mapping/decisions
Request: {
  sessionId: string;
  decisions: MappingDecision[];
}
Response: { saved: boolean; revisionId: string; }

// Get revision history
GET /api/mapping/revisions/:sessionId
Response: { revisions: MappingRevision[]; }
```

### Model Serving
- **Local Mode**: Model ONNX ringan untuk self-hosted
- **Cloud Mode**: API call ke embedding service
- **Hybrid**: Cache frequent embeddings locally

---

## Performance Targets

| Metric | Target |
|--------|--------|
| Suggestion latency | < 500ms untuk 50 fields |
| Auto-apply rate | > 60% (high confidence matches) |
| User correction rate | < 15% (post-approval) |
| Mapping time | < 2 menit untuk 100 fields |
| Model accuracy | > 85% top-1, > 95% top-3 |

---

## Integration dengan Smart Import

```
┌─────────────────┐
│  Smart Import   │
│  Wizard         │
└────────┬────────┘
         │ schema detected
         ▼
┌─────────────────┐
│  AI Mapping     │
│  Assistant      │
│  - Generate     │
│    suggestions  │
│  - Calculate    │
│    confidence   │
└────────┬────────┘
         │ mappings confirmed
         ▼
┌─────────────────┐
│  Quality Gate   │
│  (Next Step)    │
└─────────────────┘
```
