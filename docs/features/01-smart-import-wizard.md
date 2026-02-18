# Smart Import Wizard

## Overview
Fitur **Smart Import Wizard** adalah komponen inti RecordBridge yang memungkinkan pengguna mengunggah data dari berbagai format file (CSV, JSON, Excel) dengan deteksi struktur data otomatis. Fitur ini mengurangi kesalahan manual dan mempercepat proses ingest data heterogen.

---

## Detail Fitur

### 1.1 Format File yang Didukung

| Format | Ekstensi | Parsing Library | Max File Size |
|--------|----------|-----------------|---------------|
| CSV | .csv, .txt | PapaParse | 100 MB |
| JSON | .json, .jsonl | Native JSON.parse | 50 MB |
| Excel | .xlsx, .xls | SheetJS (xlsx) | 100 MB |
| NDJSON | .ndjson, .jsonl | Streaming Parser | 200 MB |

### 1.2 Deteksi Struktur Data Otomatis

#### Header Detection
- **CSV**: Mendeteksi header baris pertama dengan heuristik:
  - Perbandingan tipe data baris 1 vs baris 2
  - Analisis pola naming (camelCase, snake_case, Title Case)
  - Deteksi metadata row (timestamp, version info)

- **Excel**: 
  - Deteksi sheet utama (sheet terbesar/pertama)
  - Identifikasi merged cells dan hidden rows
  - Deteksi tabel multi-level (header berlapis)

- **JSON**:
  - Analisis schema dari sample records (default: 100 rows)
  - Deteksi nested vs flat structure
  - Identifikasi array of objects vs single object

#### Type Inference
```typescript
interface TypeInference {
  field: string;
  detectedType: 'string' | 'number' | 'date' | 'boolean' | 'category' | 'unknown';
  confidence: number;
  sampleValues: any[];
  format?: string; // e.g., 'YYYY-MM-DD', 'DD/MM/YYYY'
  nullable: boolean;
  uniqueRatio: number;
}
```

Heuristik type detection:
- **Date**: Regex pattern matching (ISO 8601, common formats)
- **Number**: Parseable sebagai number, deteksi decimal/thousand separator
- **Boolean**: Nilai seperti "yes/no", "true/false", "1/0", "Y/N"
- **Category**: Cardinality rendah (< 10% unique values)

---

## Kebutuhan Teknis

### Arsitektur Komponen

```
SmartImportWizard/
├── FileDropzone.tsx          # Drag & drop area dengan validasi
├── FormatDetector.ts         # Deteksi format file
├── ParsingEngine.ts          # Parser untuk masing-masing format
├── SchemaAnalyzer.ts         # Analisis struktur & tipe data
├── PreviewTable.tsx          # Preview data dengan kolom mapping
├── ImportConfigPanel.tsx     # Konfigurasi encoding, delimiter, dsb
└── ValidationSummary.tsx     # Ringkasan error/warning
```

### API Endpoints

```typescript
// Upload dan deteksi
POST /api/import/upload
Request: multipart/form-data (file)
Response: {
  uploadId: string;
  detectedFormat: 'csv' | 'json' | 'excel';
  detectedSchema: TypeInference[];
  previewRows: any[];
  totalRows: number;
  warnings: string[];
}

// Konfigurasi parsing
POST /api/import/configure/:uploadId
Request: {
  encoding?: 'utf-8' | 'latin1';
  delimiter?: string;
  hasHeader?: boolean;
  dateFormat?: string;
  sheetIndex?: number; // untuk Excel
}
Response: { previewRows: any[]; updatedSchema: TypeInference[]; }

// Final import
POST /api/import/confirm/:uploadId
Request: { fieldMappings: FieldMapping[]; }
Response: { jobId: string; status: 'queued' | 'processing'; }
```

### Dependencies

```json
{
  "papaparse": "^5.4.1",
  "xlsx": "^0.18.5",
  "chardet": "^2.0.0",
  "iconv-lite": "^0.6.3"
}
```

---

## Validasi Data

### Pre-Parsing Validation
- [ ] File size check
- [ ] Format extension validation
- [ ] MIME type verification
- [ ] Virus scan (opsional untuk enterprise)

### Parsing Validation
- [ ] Encoding detection & conversion
- [ ] Malformed row detection
- [ ] Delimiter auto-detection (CSV)
- [ ] JSON structure validation

### Post-Parsing Validation
- [ ] Required fields check
- [ ] Data type consistency
- [ ] Date format validation
- [ ] Referential integrity (jika ada foreign key)

### Severity Levels
| Level | Deskripsi | Action |
|-------|-----------|--------|
| ERROR | Data corrupt atau format tidak valid | Blok import, tampilkan error |
| WARNING | Data mungkin tidak akurat (e.g., ambiguous date) | Tampilkan warning, lanjutkan dengan konfirmasi |
| INFO | Informasi tentang transformasi otomatis | Tampilkan sebagai catatan |

---

## Fallback Mechanism

### Jika Parsing Gagal

#### Scenario 1: Encoding Issues
```
Error: "File contains invalid characters"
Fallback:
1. Coba deteksi encoding dengan chardet
2. Tampilkan dropdown pilihan encoding (UTF-8, Latin1, Windows-1252)
3. Preview real-time saat encoding diubah
```

#### Scenario 2: Malformed CSV
```
Error: "Inconsistent column count"
Fallback:
1. Deteksi baris bermasalah
2. Opsi: Skip baris error / Pad dengan null / Manual fix
3. Tampilkan baris bermasalah dengan highlight
```

#### Scenario 3: Large File
```
Error: "File size exceeds limit"
Fallback:
1. Opsi chunking/streaming upload
2. Background processing dengan progress notification
3. Email notification saat selesai
```

#### Scenario 4: Unknown Format
```
Error: "Format tidak dikenali"
Fallback:
1. Tampilkan format manual selection
2. Preview raw file dengan text viewer
3. Guided parser configuration
```

---

## Alur Pengguna (User Flow)

### Step-by-Step Workflow

```
┌─────────────────┐
│   START         │
└────────┬────────┘
         ▼
┌─────────────────┐     ┌─────────────────┐
│  Upload File    │────▶│ Format Detection │
│  (Drag/Drop)    │     │   (Auto/Manual)  │
└─────────────────┘     └────────┬────────┘
                                 ▼
                        ┌─────────────────┐
                        │ Parsing Config  │
                        │  (Optional)     │
                        └────────┬────────┘
                                 ▼
                        ┌─────────────────┐
                        │ Schema Detection│
                        │  & Type Infer   │
                        └────────┬────────┘
                                 ▼
                        ┌─────────────────┐
            ┌──────────│ Preview & Edit  │──────────┐
            │          │   (25 rows)     │          │
            │          └─────────────────┘          │
            ▼                                       ▼
┌─────────────────┐                      ┌─────────────────┐
│ Validation Error│                      │   Looks Good    │
│   (if any)      │                      │                 │
└────────┬────────┘                      └────────┬────────┘
         │                                        │
         ▼                                        ▼
┌─────────────────┐                      ┌─────────────────┐
│ Fix & Retry     │─────────────────────▶│ Confirm Import  │
└─────────────────┘                      └────────┬────────┘
                                                  ▼
                                         ┌─────────────────┐
                                         │  Import Job     │
                                         │   Queued        │
                                         └────────┬────────┘
                                                  ▼
                                         ┌─────────────────┐
                                         │ Progress Track  │
                                         └────────┬────────┘
                                                  ▼
                                         ┌─────────────────┐
                                         │  Mapping Screen │
                                         │   (Next Step)   │
                                         └─────────────────┘
```

### UI Mockup Description

#### 1. Upload Zone
- Drag & drop area dengan visual feedback
- Icon format yang didukung (CSV, JSON, Excel)
- Maximum file size indicator
- Recent uploads list

#### 2. Configuration Panel (Collapsible)
- Encoding selector (auto-detected default)
- Delimiter input (untuk CSV)
- Header row checkbox
- Date format pattern input
- Excel sheet selector

#### 3. Data Preview Table
- 25 rows preview dengan pagination
- Kolom dengan type badge (string, number, date)
- Confidence indicator per kolom
- Quick edit untuk header mapping
- Column statistics (unique count, null count)

#### 4. Validation Panel
- Error/warning list dengan row reference
- Filter by severity
- One-click jump to problematic row

---

## Integrasi dengan Sistem

### State Management
```typescript
interface ImportWizardState {
  step: 'upload' | 'configure' | 'preview' | 'confirm' | 'processing';
  file: File | null;
  uploadId: string | null;
  detectedFormat: FileFormat | null;
  config: ParsingConfig;
  schema: TypeInference[];
  previewData: any[];
  validationResult: ValidationResult;
  progress: number;
}
```

### Event Hooks
```typescript
interface ImportWizardHooks {
  onFileSelect: (file: File) => void;
  onFormatDetected: (format: FileFormat) => void;
  onSchemaDetected: (schema: TypeInference[]) => void;
  onConfigChange: (config: ParsingConfig) => void;
  onValidationComplete: (result: ValidationResult) => void;
  onImportConfirm: (mappings: FieldMapping[]) => void;
  onImportComplete: (jobId: string) => void;
  onError: (error: ImportError) => void;
}
```

---

## Success Metrics

| Metric | Target |
|--------|--------|
| Auto-format detection accuracy | > 95% |
| Type inference accuracy | > 90% |
| Average time to preview | < 3 seconds (< 10MB file) |
| User correction rate | < 10% (minimal manual adjustment) |
| Import success rate | > 98% |

---

## Roadmap

### Phase 1 (MVP)
- [ ] CSV/JSON support basic
- [ ] Auto header detection
- [ ] Basic type inference
- [ ] Preview 25 rows

### Phase 2
- [ ] Excel support
- [ ] Advanced type detection
- [ ] Encoding auto-detection
- [ ] Validation rules

### Phase 3
- [ ] Large file streaming
- [ ] Custom parser plugins
- [ ] Batch upload multiple files
- [ ] Template save/load
