import { MappingRecommendation, FieldMapping, SourceSystem } from '@/lib/types';

export interface FieldSimilarity {
  sourceField: string;
  targetField: string;
  similarity: number;
  confidence: number;
  reasoning: string;
}

export interface LearningEntry {
  sourceSchema: string;
  targetSchema: string;
  mappings: FieldMapping[];
  success: boolean;
  timestamp: string;
}

const COMMON_FIELD_ALIASES: Record<string, string[]> = {
  'patient_name': ['nama_pasien', 'nama', 'name', 'full_name', 'patient_name', 'nm_pasien', 'nama_lengkap'],
  'medical_record_number': ['no_rm', 'nomor_rm', 'mrn', 'medical_record_number', 'no_rekam_medis', 'norm'],
  'date_of_birth': ['tgl_lahir', 'tanggal_lahir', 'dob', 'date_of_birth', 'birth_date', 'tgl_lahir_pasien'],
  'gender': ['jenis_kelamin', 'gender', 'sex', 'jk', 'kelamin', 'jns_kelamin'],
  'address': ['alamat', 'address', 'alamat_pasien', 'addr'],
  'phone': ['telepon', 'telp', 'phone', 'no_telp', 'no_hp', 'mobile', 'handphone'],
  'blood_pressure': ['tensi', 'blood_pressure', 'bp', 'tekanan_darah', 'td', 'tensi_darah'],
  'heart_rate': ['heart_rate', 'hr', 'nadi', 'denyut_jantung', 'pulse'],
  'temperature': ['suhu', 'temperature', 'temp', 'suhu_badan', 'suhu_tubuh'],
  'diagnosis': ['diagnosa', 'diagnosis', 'dx', 'icd10', 'kode_icd', 'diagnosa_utama'],
  'medication': ['obat', 'medication', 'meds', 'drug', 'obat_aktif', 'nama_obat', 'medicine'],
  'allergy': ['alergi', 'allergy', 'allergies', 'alergi_pasien'],
  'encounter_date': ['tgl_kunjungan', 'tanggal_kunjungan', 'visit_date', 'encounter_date', 'tgl_periksa'],
  'doctor': ['dokter', 'doctor', 'dr', 'nama_dokter', 'physician', 'dpjp'],
  'lab_result': ['hasil_lab', 'lab_result', 'laboratory', 'pemeriksaan_lab'],
  'visit_type': ['jenis_kunjungan', 'visit_type', 'tipe_kunjungan', 'jenis_perawatan']
};

const SEMANTIC_PATTERNS: Array<{
  pattern: RegExp;
  canonical: string;
  weight: number;
}> = [
  { pattern: /nama.*pasien|pasien.*nama/i, canonical: 'patient_name', weight: 0.95 },
  { pattern: /no.*rm|rm.*no|nomor.*rekam/i, canonical: 'medical_record_number', weight: 0.95 },
  { pattern: /tgl.*lahir|lahir.*tgl/i, canonical: 'date_of_birth', weight: 0.95 },
  { pattern: /jenis.*kelamin|kelamin/i, canonical: 'gender', weight: 0.9 },
  { pattern: /tensi|tekanan.*darah/i, canonical: 'blood_pressure', weight: 0.9 },
  { pattern: /diagnosa|diagnosis/i, canonical: 'diagnosis', weight: 0.9 },
  { pattern: /obat|medication/i, canonical: 'medication', weight: 0.9 },
  { pattern: /alergi/i, canonical: 'allergy', weight: 0.9 },
  { pattern: /kunjungan|visit|encounter/i, canonical: 'encounter_date', weight: 0.85 },
  { pattern: /dokter|doctor|dr/i, canonical: 'doctor', weight: 0.85 },
  { pattern: /lab|laboratorium/i, canonical: 'lab_result', weight: 0.85 }
];

export class AIMappingEngine {
  private learningHistory: LearningEntry[] = [];
  private similarityCache: Map<string, FieldSimilarity> = new Map();

  constructor() {
    this.loadLearningHistory();
  }

  private loadLearningHistory(): void {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('rb_mapping_history');
      if (saved) {
        this.learningHistory = JSON.parse(saved);
      }
    }
  }

  private saveLearningHistory(): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem('rb_mapping_history', JSON.stringify(this.learningHistory));
    }
  }

  calculateSimilarity(sourceField: string, targetField: string): FieldSimilarity {
    const cacheKey = `${sourceField}:${targetField}`;
    if (this.similarityCache.has(cacheKey)) {
      return this.similarityCache.get(cacheKey)!;
    }

    const lowerSource = sourceField.toLowerCase();
    const lowerTarget = targetField.toLowerCase();

    let similarity = 0;
    let reasoning = '';

    if (lowerSource === lowerTarget) {
      similarity = 1.0;
      reasoning = 'Exact match';
    } else {
      const aliases = COMMON_FIELD_ALIASES[targetField];
      if (aliases?.includes(lowerSource)) {
        similarity = 0.9;
        reasoning = 'Known alias in dictionary';
      }

      if (similarity === 0) {
        for (const { pattern, canonical, weight } of SEMANTIC_PATTERNS) {
          if (pattern.test(lowerSource) && canonical === targetField) {
            similarity = weight;
            reasoning = 'Semantic pattern match';
            break;
          }
        }
      }

      if (similarity === 0) {
        const jaroWinkler = this.jaroWinklerSimilarity(lowerSource, lowerTarget);
        if (jaroWinkler > 0.7) {
          similarity = jaroWinkler;
          reasoning = 'String similarity (Jaro-Winkler)';
        }
      }

      if (similarity === 0) {
        const sourceWords = lowerSource.split(/[_\s]+/);
        const targetWords = lowerTarget.split(/[_\s]+/);
        const commonWords = sourceWords.filter(w => targetWords.includes(w));
        if (commonWords.length > 0) {
          similarity = commonWords.length / Math.max(sourceWords.length, targetWords.length) * 0.7;
          reasoning = `Shared words: ${commonWords.join(', ')}`;
        }
      }
    }

    const confidence = this.adjustConfidenceByHistory(sourceField, targetField, similarity);

    const result: FieldSimilarity = {
      sourceField,
      targetField,
      similarity,
      confidence,
      reasoning
    };

    this.similarityCache.set(cacheKey, result);
    return result;
  }

  private jaroWinklerSimilarity(s1: string, s2: string): number {
    if (s1 === s2) return 1.0;
    if (s1.length === 0 || s2.length === 0) return 0.0;

    const matchDistance = Math.floor(Math.max(s1.length, s2.length) / 2) - 1;
    const s1Matches = new Array(s1.length).fill(false);
    const s2Matches = new Array(s2.length).fill(false);
    let matches = 0;
    let transpositions = 0;

    for (let i = 0; i < s1.length; i++) {
      const start = Math.max(0, i - matchDistance);
      const end = Math.min(i + matchDistance + 1, s2.length);

      for (let j = start; j < end; j++) {
        if (s2Matches[j] || s1[i] !== s2[j]) continue;
        s1Matches[i] = s2Matches[j] = true;
        matches++;
        break;
      }
    }

    if (matches === 0) return 0.0;

    let k = 0;
    for (let i = 0; i < s1.length; i++) {
      if (!s1Matches[i]) continue;
      while (!s2Matches[k]) k++;
      if (s1[i] !== s2[k]) transpositions++;
      k++;
    }

    const jaro = (matches / s1.length + matches / s2.length + (matches - transpositions / 2) / matches) / 3;

    let prefixLength = 0;
    for (let i = 0; i < Math.min(s1.length, s2.length, 4); i++) {
      if (s1[i] === s2[i]) prefixLength++;
      else break;
    }

    return jaro + prefixLength * 0.1 * (1 - jaro);
  }

  private adjustConfidenceByHistory(sourceField: string, targetField: string, baseSimilarity: number): number {
    const relevantHistory = this.learningHistory.filter(h =>
      h.mappings.some(m =>
        m.sourceField === sourceField && m.canonicalField === targetField
      )
    );

    if (relevantHistory.length === 0) {
      return baseSimilarity;
    }

    const successRate = relevantHistory.filter(h => h.success).length / relevantHistory.length;
    return baseSimilarity * (0.7 + 0.3 * successRate);
  }

  generateRecommendations(
    sourceFields: string[],
    targetFields: string[],
    threshold: number = 0.6
  ): MappingRecommendation[] {
    const recommendations: MappingRecommendation[] = [];

    for (const sourceField of sourceFields) {
      const similarities: FieldSimilarity[] = [];

      for (const targetField of targetFields) {
        const similarity = this.calculateSimilarity(sourceField, targetField);
        if (similarity.similarity >= threshold) {
          similarities.push(similarity);
        }
      }

      similarities.sort((a, b) => b.similarity - a.similarity);

      if (similarities.length > 0) {
        const topMatch = similarities[0];
        recommendations.push({
          id: `rec-${sourceField}-${Date.now()}`,
          sourceField,
          suggestedMapping: topMatch.targetField,
          confidence: topMatch.confidence,
          alternatives: similarities.slice(1, 4).map(s => ({
            field: s.targetField,
            confidence: s.confidence
          })),
          reasoning: topMatch.reasoning,
          autoApprove: topMatch.confidence > 0.95
        });
      }
    }

    return recommendations.sort((a, b) => b.confidence - a.confidence);
  }

  learnFromMapping(sourceSchema: string, targetSchema: string, mappings: FieldMapping[], success: boolean): void {
    const entry: LearningEntry = {
      sourceSchema,
      targetSchema,
      mappings,
      success,
      timestamp: new Date().toISOString()
    };

    this.learningHistory.push(entry);

    if (this.learningHistory.length > 100) {
      this.learningHistory = this.learningHistory.slice(-100);
    }

    this.saveLearningHistory();

    if (success && typeof window !== 'undefined') {
      mappings.forEach(m => {
        if (m.confidence > 0.9) {
          this.addToDictionary(m.sourceField, m.canonicalField);
        }
      });
    }
  }

  private addToDictionary(sourceField: string, canonicalField: string): void {
    if (!COMMON_FIELD_ALIASES[canonicalField]) {
      COMMON_FIELD_ALIASES[canonicalField] = [];
    }
    if (!COMMON_FIELD_ALIASES[canonicalField].includes(sourceField)) {
      COMMON_FIELD_ALIASES[canonicalField].push(sourceField);
    }
  }

  getLearningStats(): {
    totalMappings: number;
    successRate: number;
    topPatterns: Array<{ pattern: string; count: number }>;
    recentActivity: LearningEntry[];
  } {
    const total = this.learningHistory.length;
    const successful = this.learningHistory.filter(h => h.success).length;

    const patternCounts: Record<string, number> = {};
    this.learningHistory.forEach(h => {
      h.mappings.forEach(m => {
        const key = `${m.sourceField} → ${m.canonicalField}`;
        patternCounts[key] = (patternCounts[key] || 0) + 1;
      });
    });

    const topPatterns = Object.entries(patternCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([pattern, count]) => ({ pattern, count }));

    return {
      totalMappings: this.learningHistory.reduce((sum, h) => sum + h.mappings.length, 0),
      successRate: total > 0 ? successful / total : 0,
      topPatterns,
      recentActivity: this.learningHistory.slice(-5)
    };
  }

  batchProcessMappings(
    sourceRecords: Array<Record<string, unknown>>,
    sourceSystem: SourceSystem
  ): Array<{ record: Record<string, unknown>; mappings: FieldMapping[]; confidence: number }> {
    if (sourceRecords.length === 0) return [];

    const sampleRecord = sourceRecords[0];
    const sourceFields = Object.keys(sampleRecord);
    const canonicalFields = Object.keys(COMMON_FIELD_ALIASES);

    const recommendations = this.generateRecommendations(sourceFields, canonicalFields, 0.5);

    return sourceRecords.map(record => {
      const mappings: FieldMapping[] = [];
      let totalConfidence = 0;

      for (const rec of recommendations) {
        const value = record[rec.sourceField];
        if (value !== undefined) {
          mappings.push({
            id: `map-${rec.sourceField}-${Date.now()}`,
            sourceField: rec.sourceField,
            canonicalField: rec.suggestedMapping,
            sourceValue: String(value),
            normalizedValue: this.normalizeValue(value, rec.suggestedMapping),
            confidence: rec.confidence,
            transform: this.detectTransform(rec.suggestedMapping)
          });
          totalConfidence += rec.confidence;
        }
      }

      return {
        record,
        mappings,
        confidence: mappings.length > 0 ? totalConfidence / mappings.length : 0
      };
    });
  }

  private normalizeValue(value: unknown, targetField: string): string {
    if (value === null || value === undefined) return '';

    const strValue = String(value);

    switch (targetField) {
      case 'date_of_birth':
      case 'encounter_date':
        return this.normalizeDate(strValue);
      case 'gender':
        return this.normalizeGender(strValue);
      case 'blood_pressure':
        return this.normalizeBloodPressure(strValue);
      default:
        return strValue;
    }
  }

  private normalizeDate(value: string): string {
    const formats = [
      /^(\d{2})-(\d{2})-(\d{4})$/,  // DD-MM-YYYY
      /^(\d{4})\/(\d{2})\/(\d{2})$/, // YYYY/MM/DD
      /^(\d{2})\/(\d{2})\/(\d{4})$/  // MM/DD/YYYY
    ];

    for (const format of formats) {
      const match = value.match(format);
      if (match) {
        return `${match[3] || match[1]}-${match[2]}-${match[1] || match[3]}`;
      }
    }

    return value;
  }

  private normalizeGender(value: string): string {
    const male = ['l', 'laki', 'laki-laki', 'male', 'm', 'pria'];
    const female = ['p', 'perempuan', 'female', 'f', 'wanita'];

    const lower = value.toLowerCase();
    if (male.includes(lower)) return 'male';
    if (female.includes(lower)) return 'female';
    return value;
  }

  private normalizeBloodPressure(value: string): string {
    if (typeof value === 'object') {
      const obj = value as Record<string, number>;
      if (obj.sistolik && obj.diastolik) {
        return `${obj.sistolik}/${obj.diastolik}`;
      }
    }
    return String(value);
  }

  private detectTransform(targetField: string): string | undefined {
    const transforms: Record<string, string> = {
      'date_of_birth': 'date',
      'encounter_date': 'datetime',
      'gender': 'gender_map',
      'blood_pressure': 'bp_normalize'
    };
    return transforms[targetField];
  }
}

export const createAIMappingEngine = (): AIMappingEngine => {
  return new AIMappingEngine();
};
