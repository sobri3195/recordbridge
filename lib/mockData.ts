import { RawSourceRecord } from '@/lib/types';

export const RAW_SOURCES: RawSourceRecord[] = [
  {
    source: 'EHR_A',
    recordId: 'A-1001',
    updatedAt: '2026-01-14T08:30:00Z',
    payload: {
      patient_id: 'MRN-49281',
      name: 'Budi Santoso',
      dob: '1993-05-15',
      sex: 'Male',
      language: 'id',
      BP: '135/85',
      hr: 72,
      weight_kg: 78,
      height_cm: 172,
      diagnosis_icd10: ['I10', 'E78.5'],
      allergies: ['No Known Allergies'],
      meds: [
        { generic: 'Amlodipine', dose: '5 mg', route: 'PO', freq: 'OD' },
        { generic: 'Simvastatin', dose: '20mg', route: 'PO', freq: 'HS' }
      ],
      encounters: [
        { date: '2026-01-14T08:00:00Z', type: 'Outpatient', reason: 'Hypertension follow-up' },
        { date: '2025-11-20T09:00:00Z', type: 'Outpatient', reason: 'Annual checkup' }
      ],
      labs: [
        { ts: '2026-01-14T08:15:00Z', name: 'LDL Cholesterol', value: '142', unit: 'mg/dL' },
        { ts: '2025-11-20T09:30:00Z', name: 'LDL Cholesterol', value: '156', unit: 'mg/dL' }
      ]
    }
  },
  {
    source: 'SIMRS_B',
    recordId: 'SIMRS-49281',
    updatedAt: '2026-01-15T09:10:00Z',
    payload: {
      no_rm: '49281',
      nama: 'Budi Santoso',
      tanggal_lahir: '15-05-1993',
      jenis_kelamin: 'L',
      bahasa: 'Bahasa Indonesia',
      Tensi: { sistolik: 128, diastolik: 82, unit: 'mmHg' },
      berat_badan: 77,
      tinggi_badan: 172,
      suhu: 36.7,
      diagnosa: ['hipertensi stadium 1', 'dislipidemia'],
      alergi: ['tidak ada alergi'],
      obat_aktif: [
        { nama_obat: 'Amlodipine', dosis: '5 mg', frekuensi: '1x sehari', rute: 'oral' },
        { nama_obat: 'Simvastatin', dosis: '20 mg', frekuensi: 'malam hari', rute: 'oral' }
      ],
      kunjungan: [
        { waktu: '2026-01-15T09:00:00Z', jenis: 'Poli Jantung', keluhan: 'Kontrol rutin hipertensi' },
        { waktu: '2025-12-10T10:30:00Z', jenis: 'Poli Jantung', keluhan: 'Tekanan darah tinggi' }
      ],
      lab_result: [
        { waktu: '2026-01-15T09:30:00Z', pemeriksaan: 'Kolesterol LDL', hasil: '138', satuan: 'mg/dL' },
        { waktu: '2025-12-10T11:00:00Z', pemeriksaan: 'Kolesterol LDL', hasil: '148', satuan: 'mg/dL' }
      ]
    }
  },
  {
    source: 'CLINIC_C',
    recordId: 'CLN-49281',
    updatedAt: '2026-01-16T11:45:00Z',
    payload: {
      id: 'EXT-49281',
      patient: {
        fullName: 'Budi S.',
        birthDate: '1993/05/15',
        gender: 'M'
      },
      vitals: {
        blood_pressure_systolic: 126,
        blood_pressure_diastolic: 80,
        pulse_bpm: 70,
        weight_kg: 76.5
      },
      dx_text: ['essential hypertension', 'hyperlipidemia'],
      allergy_status: [{ substance: 'none', reaction: 'N/A' }],
      medication_list: ['Amlodipine 5 mg daily', 'Simvastatin 20 mg at bedtime'],
      visits: [
        { at: '2026-01-16T11:00:00Z', setting: 'Telemedicine', note: 'BP improving, continue current regimen' },
        { at: '2025-10-05T14:00:00Z', setting: 'Clinic', note: 'Newly diagnosed hypertension' }
      ],
      results: [
        { at: '2026-01-16T11:30:00Z', test: 'LDL', result: '135', unit: 'mg/dL' },
        { at: '2025-10-05T15:00:00Z', test: 'LDL', result: '162', unit: 'mg/dL' }
      ]
    }
  }
];

export const SOURCE_LABELS = {
  EHR_A: 'EHR A',
  SIMRS_B: 'SIMRS B',
  CLINIC_C: 'Clinic C'
} as const;
