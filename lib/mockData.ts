import { RawSourceRecord } from '@/lib/types';

export const RAW_SOURCES: RawSourceRecord[] = [
  {
    source: 'EHR_A',
    recordId: 'A-1001',
    updatedAt: '2026-01-14T08:30:00Z',
    payload: {
      patient_id: 'MRN-77812',
      name: 'Siti Rahmawati',
      dob: '1984-03-12',
      sex: 'Female',
      language: 'id',
      BP: '120/80',
      hr: 76,
      diagnosis_icd10: ['E11.9', 'I10'],
      allergies: ['Penicillin'],
      meds: [
        { brand: 'Glucophage', dose: '500mg', route: 'PO', freq: 'BID' },
        { generic: 'Amlodipine', dose: '5 mg', route: 'PO', freq: 'OD' }
      ],
      encounters: [
        { date: '2026-01-10T07:00:00Z', type: 'Outpatient', reason: 'Diabetes follow-up' }
      ],
      labs: [{ ts: '2026-01-10T08:15:00Z', name: 'HbA1c', value: '7.8', unit: '%' }]
    }
  },
  {
    source: 'SIMRS_B',
    recordId: 'SIMRS-233',
    updatedAt: '2026-01-15T09:10:00Z',
    payload: {
      no_rm: '77812',
      nama: 'Siti Rahmawati',
      tanggal_lahir: '12-03-1984',
      jenis_kelamin: 'P',
      bahasa: 'Bahasa Indonesia',
      Tensi: { sistolik: 118, diastolik: 82, unit: 'mmHg' },
      suhu: 36.9,
      diagnosa: ['kencing manis', 'hipertensi'],
      alergi: ['Tidak ada alergi / NKA'],
      obat_aktif: [
        { nama_obat: 'metformin', dosis: '0.5 g', frekuensi: '2x sehari', rute: 'oral' },
        { nama_obat: 'Norvasc', dosis: '10mg', frekuensi: '1x sehari', rute: 'oral' }
      ],
      kunjungan: [
        { waktu: '2026-01-12T05:30:00Z', jenis: 'IGD', keluhan: 'Pusing' }
      ],
      lab_result: [{ waktu: '2026-01-12T06:00:00Z', pemeriksaan: 'GDP', hasil: '180', satuan: 'mg/dL' }]
    }
  },
  {
    source: 'CLINIC_C',
    recordId: 'CLN-909',
    updatedAt: '2026-01-16T11:45:00Z',
    payload: {
      id: 'EXT-77812',
      patient: {
        fullName: 'Siti R.',
        birthDate: '1984/03/12',
        gender: 'F'
      },
      vitals: {
        blood_pressure_systolic: 122,
        blood_pressure_diastolic: 78,
        pulse_bpm: 80
      },
      dx_text: ['type 2 diabetes mellitus', 'possible CKD stage 2'],
      allergy_status: [{ substance: 'penicillin', reaction: 'rash' }],
      medication_list: ['Metformin 500 mg twice daily', 'Amlodipine 5 mg daily'],
      visits: [
        { at: '2026-01-16T10:00:00Z', setting: 'Telemedicine', note: 'Blood sugar review' }
      ],
      results: [{ at: '2026-01-16T10:20:00Z', test: 'Creatinine', result: '1.1', unit: 'mg/dL' }]
    }
  }
];

export const SOURCE_LABELS = {
  EHR_A: 'EHR A',
  SIMRS_B: 'SIMRS B',
  CLINIC_C: 'Clinic C'
} as const;
