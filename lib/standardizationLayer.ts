import { Condition, Medication, Observation, Allergy } from '@/lib/types';

export type StandardCodeSystem = 'ICD-10' | 'ICD-9-CM' | 'LOINC' | 'SNOMED-CT' | 'RXNORM' | 'FHIR';

export interface StandardizedCode {
  code: string;
  system: string;
  display: string;
  version?: string;
}

export interface FHIRResource {
  resourceType: string;
  id: string;
  meta?: {
    versionId?: string;
    lastUpdated?: string;
    source?: string;
    profile?: string[];
  };
  text?: {
    status: string;
    div: string;
  };
  status?: string;
  category?: Array<{ coding: StandardizedCode[] }>;
  code?: { coding: StandardizedCode[] };
  subject?: { reference: string };
  effectiveDateTime?: string;
  valueQuantity?: {
    value: number;
    unit: string;
    system?: string;
    code?: string;
  };
}

export interface FHIRPatient extends FHIRResource {
  resourceType: 'Patient';
  identifier: Array<{
    system?: string;
    value: string;
    type?: StandardizedCode;
  }>;
  name: Array<{
    use?: string;
    text?: string;
    family?: string;
    given?: string[];
  }>;
  gender?: string;
  birthDate?: string;
  address?: Array<{
    use?: string;
    text?: string;
    city?: string;
    postalCode?: string;
    country?: string;
  }>;
}

export interface FHIREncounter extends FHIRResource {
  resourceType: 'Encounter';
  status: string;
  class: StandardizedCode;
  subject: { reference: string };
  period?: {
    start: string;
    end?: string;
  };
  reasonCode?: Array<{
    coding: StandardizedCode[];
    text?: string;
  }>;
}

export interface FHIRCondition extends FHIRResource {
  resourceType: 'Condition';
  clinicalStatus: StandardizedCode;
  verificationStatus?: StandardizedCode;
  code: {
    coding: StandardizedCode[];
    text: string;
  };
  subject: { reference: string };
  onsetDateTime?: string;
}

export interface FHIRMedication extends FHIRResource {
  resourceType: 'Medication';
  code?: {
    coding: StandardizedCode[];
    text: string;
  };
  form?: {
    coding: StandardizedCode[];
  };
}

const ICD_10_MAPPING: Record<string, { code: string; display: string }> = {
  'diabetes': { code: 'E11.9', display: 'Type 2 diabetes mellitus without complications' },
  'type 2 diabetes mellitus': { code: 'E11.9', display: 'Type 2 diabetes mellitus without complications' },
  'kencing manis': { code: 'E11.9', display: 'Type 2 diabetes mellitus without complications' },
  'hipertensi': { code: 'I10', display: 'Essential (primary) hypertension' },
  'hypertension': { code: 'I10', display: 'Essential (primary) hypertension' },
  'penyakit jantung': { code: 'I25.9', display: 'Chronic ischemic heart disease, unspecified' },
  'stroke': { code: 'I64', display: 'Stroke, not specified as haemorrhage or infarction' },
  'asma': { code: 'J45.9', display: 'Asthma, unspecified' },
  'asthma': { code: 'J45.9', display: 'Asthma, unspecified' },
  'tuberkulosis': { code: 'A15.0', display: 'Tuberculosis of lung' },
  'pneumonia': { code: 'J18.9', display: 'Pneumonia, unspecified' },
  'gagal ginjal': { code: 'N18.9', display: 'Chronic kidney disease, unspecified' },
  'ckd': { code: 'N18.9', display: 'Chronic kidney disease, unspecified' },
  'chronic kidney disease': { code: 'N18.9', display: 'Chronic kidney disease, unspecified' },
  'hepatitis': { code: 'K73.9', display: 'Chronic hepatitis, unspecified' },
  'malaria': { code: 'B50.9', display: 'Plasmodium falciparum malaria, unspecified' },
  'demam berdarah': { code: 'A91', display: 'Dengue haemorrhagic fever' },
  'dengue': { code: 'A90', display: 'Dengue fever [classical dengue]' },
  'covid-19': { code: 'U07.1', display: 'COVID-19, virus identified' },
  'infeksi saluran pernapasan': { code: 'J06.9', display: 'Acute upper respiratory infection, unspecified' }
};

const ICD_9_CM_MAPPING: Record<string, { code: string; display: string }> = {
  'diabetes': { code: '250.00', display: 'Diabetes mellitus without mention of complication' },
  'type 2 diabetes mellitus': { code: '250.00', display: 'Diabetes mellitus without mention of complication' },
  'hipertensi': { code: '401.9', display: 'Unspecified essential hypertension' },
  'hypertension': { code: '401.9', display: 'Unspecified essential hypertension' },
  'stroke': { code: '436', display: 'Acute, but ill-defined, cerebrovascular disease' },
  'penyakit jantung': { code: '414.9', display: 'Chronic ischemic heart disease, unspecified' },
  'asma': { code: '493.90', display: 'Asthma, unspecified' },
  'pneumonia': { code: '486', display: 'Pneumonia, organism unspecified' }
};

const LOINC_MAPPING: Record<string, { code: string; display: string }> = {
  'hemoglobin': { code: '718-7', display: 'Hemoglobin [Mass/volume] in Blood' },
  'hba1c': { code: '4548-4', display: 'Hemoglobin A1c/Hemoglobin.total in Blood' },
  'glucose': { code: '2339-0', display: 'Glucose [Mass/volume] in Blood' },
  'gdp': { code: '2339-0', display: 'Glucose [Mass/volume] in Blood' },
  'cholesterol total': { code: '2093-3', display: 'Cholesterol [Mass/volume] in Serum or Plasma' },
  'hdl': { code: '2085-9', display: 'Cholesterol in HDL [Mass/volume] in Serum or Plasma' },
  'ldl': { code: '2089-1', display: 'Cholesterol in LDL [Mass/volume] in Serum or Plasma' },
  'triglyceride': { code: '2571-8', display: 'Triglyceride [Mass/volume] in Serum or Plasma' },
  'creatinine': { code: '2160-0', display: 'Creatinine [Mass/volume] in Serum or Plasma' },
  'ureum': { code: '22664-7', display: 'Urea nitrogen [Mass/volume] in Serum or Plasma' },
  'bun': { code: '3094-0', display: 'Urea nitrogen [Mass/volume] in Serum or Plasma' },
  'uric acid': { code: '3084-1', display: 'Urate [Mass/volume] in Serum or Plasma' },
  'asam urat': { code: '3084-1', display: 'Urate [Mass/volume] in Serum or Plasma' },
  'tsh': { code: '3016-3', display: 'Thyrotropin [Units/volume] in Serum or Plasma' },
  'white blood cell': { code: '6690-2', display: 'Leukocytes [#/volume] in Blood by Automated count' },
  'red blood cell': { code: '789-8', display: 'Erythrocytes [#/volume] in Blood by Automated count' },
  'platelet': { code: '777-3', display: 'Platelets [#/volume] in Blood by Automated count' }
};

const SNOMED_MAPPING: Record<string, { code: string; display: string }> = {
  'diabetes mellitus': { code: '73211009', display: 'Diabetes mellitus' },
  'type 2 diabetes': { code: '44054006', display: 'Diabetes mellitus type 2' },
  'hypertension': { code: '38341003', display: 'Hypertensive disorder' },
  'essential hypertension': { code: '59621000', display: 'Essential hypertension' },
  'asthma': { code: '195967001', display: 'Asthma' },
  'pneumonia': { code: '233604007', display: 'Pneumonia' },
  'penicillin allergy': { code: '91936005', display: 'Allergy to penicillin' },
  'no known allergies': { code: '716186003', display: 'No known allergy' },
  'fever': { code: '386661006', display: 'Fever' },
  'cough': { code: '49727002', display: 'Cough' },
  'chest pain': { code: '29857009', display: 'Chest pain' },
  'shortness of breath': { code: '267036007', display: 'Dyspnea' },
  'sakit dada': { code: '29857009', display: 'Chest pain' },
  'sesak napas': { code: '267036007', display: 'Dyspnea' },
  'demam': { code: '386661006', display: 'Fever' },
  'batuk': { code: '49727002', display: 'Cough' }
};

const RXNORM_MAPPING: Record<string, { code: string; display: string }> = {
  'metformin': { code: '6809', display: 'Metformin' },
  'glucophage': { code: '6809', display: 'Metformin' },
  'amlodipine': { code: '17767', display: 'Amlodipine' },
  'norvasc': { code: '17767', display: 'Amlodipine' },
  'simvastatin': { code: '36567', display: 'Simvastatin' },
  'atorvastatin': { code: '83367', display: 'Atorvastatin' },
  'captopril': { code: '1998', display: 'Captopril' },
  'lisinopril': { code: '29046', display: 'Lisinopril' },
  'amoxicillin': { code: '723', display: 'Amoxicillin' },
  'ciprofloxacin': { code: '2551', display: 'Ciprofloxacin' },
  'paracetamol': { code: '161', display: 'Acetaminophen' },
  'acetaminophen': { code: '161', display: 'Acetaminophen' },
  'ibuprofen': { code: '5640', display: 'Ibuprofen' },
  'aspirin': { code: '1191', display: 'Aspirin' },
  'insulin': { code: '5856', display: 'Insulin' }
};

const SATUSEHAT_PROFILES = {
  Patient: 'https://fhir.kemkes.go.id/r4/StructureDefinition/Patient',
  Encounter: 'https://fhir.kemkes.go.id/r4/StructureDefinition/Encounter',
  Condition: 'https://fhir.kemkes.go.id/r4/StructureDefinition/Condition',
  Observation: 'https://fhir.kemkes.go.id/r4/StructureDefinition/Observation',
  Medication: 'https://fhir.kemkes.go.id/r4/StructureDefinition/Medication',
  AllergyIntolerance: 'https://fhir.kemkes.go.id/r4/StructureDefinition/AllergyIntolerance'
};

export class NationalHealthStandardizationLayer {
  toICD10(conditionName: string): StandardizedCode | null {
    const normalized = conditionName.toLowerCase();
    const mapping = ICD_10_MAPPING[normalized] ||
      Object.entries(ICD_10_MAPPING).find(([key]) => normalized.includes(key))?.[1];

    if (mapping) {
      return {
        code: mapping.code,
        system: 'http://hl7.org/fhir/sid/icd-10-cm',
        display: mapping.display,
        version: '2023'
      };
    }

    return null;
  }

  toICD9CM(conditionName: string): StandardizedCode | null {
    const normalized = conditionName.toLowerCase();
    const mapping = ICD_9_CM_MAPPING[normalized] ||
      Object.entries(ICD_9_CM_MAPPING).find(([key]) => normalized.includes(key))?.[1];

    if (mapping) {
      return {
        code: mapping.code,
        system: 'http://hl7.org/fhir/sid/icd-9-cm',
        display: mapping.display,
        version: '2015'
      };
    }

    return null;
  }

  toLOINC(testName: string): StandardizedCode | null {
    const normalized = testName.toLowerCase();
    const mapping = LOINC_MAPPING[normalized] ||
      Object.entries(LOINC_MAPPING).find(([key]) => normalized.includes(key))?.[1];

    if (mapping) {
      return {
        code: mapping.code,
        system: 'http://loinc.org',
        display: mapping.display
      };
    }

    return null;
  }

  toSNOMED(concept: string): StandardizedCode | null {
    const normalized = concept.toLowerCase();
    const mapping = SNOMED_MAPPING[normalized] ||
      Object.entries(SNOMED_MAPPING).find(([key]) => normalized.includes(key))?.[1];

    if (mapping) {
      return {
        code: mapping.code,
        system: 'http://snomed.info/sct',
        display: mapping.display,
        version: 'http://snomed.info/sct/900000000000207008'
      };
    }

    return null;
  }

  toRxNorm(medicationName: string): StandardizedCode | null {
    const normalized = medicationName.toLowerCase();
    const mapping = RXNORM_MAPPING[normalized] ||
      Object.entries(RXNORM_MAPPING).find(([key]) => normalized.includes(key))?.[1];

    if (mapping) {
      return {
        code: mapping.code,
        system: 'http://www.nlm.nih.gov/research/umls/rxnorm',
        display: mapping.display
      };
    }

    return null;
  }

  conditionToFHIR(condition: Condition, patientId: string): FHIRCondition {
    const icd10 = this.toICD10(condition.canonicalName);
    const snomed = this.toSNOMED(condition.canonicalName);

    const coding: StandardizedCode[] = [];
    if (icd10) coding.push(icd10);
    if (snomed) coding.push(snomed);

    return {
      resourceType: 'Condition',
      id: condition.id,
      meta: {
        profile: [SATUSEHAT_PROFILES.Condition],
        lastUpdated: new Date().toISOString()
      },
      text: {
        status: 'generated',
        div: `<div xmlns="http://www.w3.org/1999/xhtml">${condition.canonicalName}</div>`
      },
      clinicalStatus: {
        code: 'active',
        system: 'http://terminology.hl7.org/CodeSystem/condition-clinical',
        display: 'Active'
      },
      code: {
        coding,
        text: condition.canonicalName
      },
      subject: { reference: `Patient/${patientId}` },
      onsetDateTime: condition.provenance.timestamp
    };
  }

  observationToFHIR(observation: Observation, patientId: string): FHIRResource {
    const loinc = this.toLOINC(observation.type);

    const coding: StandardizedCode[] = [];
    if (loinc) {
      coding.push(loinc);
    } else {
      coding.push({
        code: observation.type,
        system: 'http://recordbridge.org/local-codes',
        display: observation.type
      });
    }

    return {
      resourceType: 'Observation',
      id: observation.id,
      meta: {
        profile: [SATUSEHAT_PROFILES.Observation],
        lastUpdated: new Date().toISOString()
      },
      text: {
        status: 'generated',
        div: `<div xmlns="http://www.w3.org/1999/xhtml">${observation.type}: ${observation.value}</div>`
      },
      status: 'final',
      category: [{
        coding: [{
          code: 'vital-signs',
          system: 'http://terminology.hl7.org/CodeSystem/observation-category',
          display: 'Vital Signs'
        }]
      }],
      code: {
        coding
      },
      subject: { reference: `Patient/${patientId}` },
      effectiveDateTime: observation.provenance.timestamp,
      valueQuantity: {
        value: parseFloat(observation.value) || 0,
        unit: observation.unit,
        system: 'http://unitsofmeasure.org',
        code: this.mapUnitToUCUM(observation.unit)
      }
    };
  }

  medicationToFHIR(medication: Medication): FHIRMedication {
    const rxnorm = this.toRxNorm(medication.canonicalName);

    const coding: StandardizedCode[] = [];
    if (rxnorm) coding.push(rxnorm);

    return {
      resourceType: 'Medication',
      id: medication.id,
      meta: {
        profile: [SATUSEHAT_PROFILES.Medication],
        lastUpdated: new Date().toISOString()
      },
      text: {
        status: 'generated',
        div: `<div xmlns="http://www.w3.org/1999/xhtml">${medication.canonicalName} ${medication.dose}</div>`
      },
      code: {
        coding,
        text: medication.canonicalName
      },
      form: {
        coding: [{
          code: medication.route.toLowerCase().includes('oral') ? '385055001' : '385268001',
          system: 'http://snomed.info/sct',
          display: medication.route.toLowerCase().includes('oral') ? 'Tablet' : 'Injection'
        }]
      }
    };
  }

  allergyToFHIR(allergy: Allergy, patientId: string): FHIRResource {
    const snomed = this.toSNOMED(allergy.substance);
    const coding: StandardizedCode[] = [];
    if (snomed) coding.push(snomed);

    return {
      resourceType: 'AllergyIntolerance',
      id: allergy.id,
      meta: {
        profile: [SATUSEHAT_PROFILES.AllergyIntolerance],
        lastUpdated: new Date().toISOString()
      },
      text: {
        status: 'generated',
        div: `<div xmlns="http://www.w3.org/1999/xhtml">${allergy.substance}: ${allergy.reaction}</div>`
      },
      clinicalStatus: {
        code: 'active',
        system: 'http://terminology.hl7.org/CodeSystem/allergyintolerance-clinical',
        display: 'Active'
      },
      verificationStatus: {
        code: 'confirmed',
        system: 'http://terminology.hl7.org/CodeSystem/allergyintolerance-verification',
        display: 'Confirmed'
      },
      type: 'allergy',
      category: ['medication'],
      code: {
        coding
      },
      patient: { reference: `Patient/${patientId}` },
      reaction: [{
        manifestation: [{
          text: allergy.reaction
        }]
      }]
    };
  }

  patientToSATUSEHAT(patient: {
    identifiers: string[];
    demographics: {
      fullName: string;
      dob: string;
      sex: string;
    };
  }): FHIRPatient {
    const [familyName, ...givenNames] = patient.demographics.fullName.split(' ');

    return {
      resourceType: 'Patient',
      id: patient.identifiers[0] || `patient-${Date.now()}`,
      meta: {
        profile: [SATUSEHAT_PROFILES.Patient],
        lastUpdated: new Date().toISOString()
      },
      text: {
        status: 'generated',
        div: `<div xmlns="http://www.w3.org/1999/xhtml">${patient.demographics.fullName}</div>`
      },
      identifier: patient.identifiers.map((id, idx) => ({
        system: idx === 0 ? 'http://hl7.org/fhir/sid/nik' : `http://recordbridge.org/system-${idx}`,
        value: id
      })),
      name: [{
        use: 'official',
        text: patient.demographics.fullName,
        family: familyName,
        given: givenNames
      }],
      gender: patient.demographics.sex.toLowerCase() === 'female' ? 'female' : 'male',
      birthDate: patient.demographics.dob
    };
  }

  private mapUnitToUCUM(unit: string): string {
    const mappings: Record<string, string> = {
      'mmHg': 'mm[Hg]',
      'mg/dL': 'mg/dL',
      'mg': 'mg',
      'g': 'g',
      'kg': 'kg',
      'cm': 'cm',
      'mmol/L': 'mmol/L',
      'IU': '[iU]',
      'bpm': '/min',
      'C': 'Cel',
      'F': '[degF]'
    };
    return mappings[unit] || unit;
  }

  validateFHIRResource(resource: FHIRResource): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!resource.resourceType) {
      errors.push('Resource must have a resourceType');
    }

    if (!resource.id) {
      errors.push('Resource must have an id');
    }

    if (resource.resourceType === 'Patient') {
      const patient = resource as FHIRPatient;
      if (!patient.identifier || patient.identifier.length === 0) {
        errors.push('Patient must have at least one identifier');
      }
    }

    return {
      valid: errors.length === 0,
      errors
    };
  }

  generateSATUSEHATBundle(resources: FHIRResource[]): {
    resourceType: 'Bundle';
    id: string;
    meta: { lastUpdated: string };
    type: 'transaction';
    entry: Array<{ resource: FHIRResource; request: { method: string; url: string } }>;
  } {
    return {
      resourceType: 'Bundle',
      id: `bundle-${Date.now()}`,
      meta: {
        lastUpdated: new Date().toISOString()
      },
      type: 'transaction',
      entry: resources.map(r => ({
        resource: r,
        request: {
          method: 'POST',
          url: r.resourceType
        }
      }))
    };
  }
}

export const createStandardizationLayer = (): NationalHealthStandardizationLayer => {
  return new NationalHealthStandardizationLayer();
};
