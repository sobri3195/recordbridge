'use client';

import { useState } from 'react';

interface TermMapping {
  indonesian: string;
  english: string;
  category: 'vitals' | 'labs' | 'diagnosis' | 'medication' | 'general';
}

const bilingualTerms: TermMapping[] = [
  { indonesian: 'Tekanan Darah', english: 'Blood Pressure', category: 'vitals' },
  { indonesian: 'Tensi', english: 'Blood Pressure', category: 'vitals' },
  { indonesian: 'Denyut Nadi', english: 'Heart Rate / Pulse', category: 'vitals' },
  { indonesian: 'Suhu Tubuh', english: 'Body Temperature', category: 'vitals' },
  { indonesian: 'Berat Badan', english: 'Body Weight', category: 'vitals' },
  { indonesian: 'Tinggi Badan', english: 'Height', category: 'vitals' },
  { indonesian: 'Gula Darah Puasa', english: 'Fasting Blood Glucose', category: 'labs' },
  { indonesian: 'Hemoglobin A1C', english: 'HbA1c', category: 'labs' },
  { indonesian: 'Kolesterol LDL', english: 'LDL Cholesterol', category: 'labs' },
  { indonesian: 'Kolesterol HDL', english: 'HDL Cholesterol', category: 'labs' },
  { indonesian: 'Trigliserida', english: 'Triglycerides', category: 'labs' },
  { indonesian: 'Kreatinin', english: 'Creatinine', category: 'labs' },
  { indonesian: 'Asam Urat', english: 'Uric Acid', category: 'labs' },
  { indonesian: 'Riwayat Penyakit', english: 'Medical History', category: 'general' },
  { indonesian: 'Alergi', english: 'Allergies', category: 'general' },
  { indonesian: 'Pengobatan', english: 'Medications', category: 'medication' },
  { indonesian: 'Obat', english: 'Medicine / Drug', category: 'medication' },
  { indonesian: 'Dosis', english: 'Dose', category: 'medication' },
  { indonesian: 'Frekuensi', english: 'Frequency', category: 'medication' },
  { indonesian: 'Rute', english: 'Route', category: 'medication' },
  { indonesian: 'Tablet', english: 'Tablet', category: 'medication' },
  { indonesian: 'Kapsul', english: 'Capsule', category: 'medication' },
  { indonesian: 'Suntik', english: 'Injection', category: 'medication' },
  { indonesian: 'Hipertensi', english: 'Hypertension', category: 'diagnosis' },
  { indonesian: 'Hipertensi Stadium 1', english: 'Hypertension Stage 1', category: 'diagnosis' },
  { indonesian: 'Diabetes / Kencing Manis', english: 'Diabetes Mellitus', category: 'diagnosis' },
  { indonesian: 'Dislipidemia', english: 'Hyperlipidemia / Dyslipidemia', category: 'diagnosis' },
  { indonesian: 'Penyakit Ginjal', english: 'Kidney Disease', category: 'diagnosis' },
  { indonesian: 'Gangguan Jantung', english: 'Heart Disorder', category: 'diagnosis' },
  { indonesian: 'Stroke', english: 'Stroke', category: 'diagnosis' },
  { indonesian: 'Asma', english: 'Asthma', category: 'diagnosis' },
  { indonesian: 'Kunjungan', english: 'Visit / Encounter', category: 'general' },
  { indonesian: 'Keluhan', english: 'Chief Complaint', category: 'general' },
  { indonesian: 'Anamnesis', english: 'Anamnesis / History Taking', category: 'general' },
  { indonesian: 'Pemeriksaan Fisik', english: 'Physical Examination', category: 'general' },
  { indonesian: 'Pasien', english: 'Patient', category: 'general' },
  { indonesian: 'Dokter', english: 'Doctor / Physician', category: 'general' },
  { indonesian: 'Perawat', english: 'Nurse', category: 'general' },
  { indonesian: 'Resep', english: 'Prescription', category: 'medication' },
  { indonesian: 'Pemeriksaan', english: 'Examination / Lab Test', category: 'labs' },
];

const categoryLabels: Record<string, { label: string; color: string; icon: string }> = {
  vitals: { label: 'Tanda Vital', color: 'bg-rose-100 text-rose-800', icon: '🩺' },
  labs: { label: 'Laboratorium', color: 'bg-blue-100 text-blue-800', icon: '🧪' },
  diagnosis: { label: 'Diagnosis', color: 'bg-purple-100 text-purple-800', icon: '📋' },
  medication: { label: 'Obat', color: 'bg-emerald-100 text-emerald-800', icon: '💊' },
  general: { label: 'Umum', color: 'bg-slate-100 text-slate-800', icon: '📝' }
};

export function BilingualTerms() {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const categories = Array.from(new Set(bilingualTerms.map(t => t.category)));
  
  const filteredTerms = bilingualTerms.filter(term => {
    const matchesCategory = !activeCategory || term.category === activeCategory;
    const matchesSearch = 
      term.indonesian.toLowerCase().includes(searchTerm.toLowerCase()) ||
      term.english.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <section className="card">
      <div className="flex items-center gap-2 mb-4">
        <span className="text-2xl">🌐</span>
        <h3 className="text-lg font-bold text-slate-800">Pemetaan Bilingual</h3>
        <span className="text-xs bg-indigo-100 text-indigo-800 px-2 py-1 rounded-full">
          ID ↔ EN
        </span>
      </div>

      <p className="text-sm text-slate-600 mb-4">
        RecordBridge secara otomatis menerjemahkan istilah medis antara Bahasa Indonesia dan Inggris,
        memungkinkan interoperabilitas antara SIMRS lokal dan sistem internasional.
      </p>

      {/* Search */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Cari istilah medis..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>

      {/* Category Filters */}
      <div className="flex flex-wrap gap-2 mb-4">
        <button
          onClick={() => setActiveCategory(null)}
          className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
            activeCategory === null
              ? 'bg-indigo-600 text-white'
              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          }`}
        >
          Semua
        </button>
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors flex items-center gap-1 ${
              activeCategory === cat
                ? categoryLabels[cat].color.replace('bg-', 'bg-opacity-100 ')
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <span>{categoryLabels[cat].icon}</span>
            {categoryLabels[cat].label}
          </button>
        ))}
      </div>

      {/* Terms Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 max-h-64 overflow-y-auto">
        {filteredTerms.map((term, idx) => (
          <div
            key={idx}
            className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-100 hover:border-indigo-200 transition-colors"
          >
            <div className="flex items-center gap-2">
              <span className={`text-xs px-2 py-0.5 rounded ${categoryLabels[term.category].color}`}>
                {categoryLabels[term.category].icon}
              </span>
              <div>
                <p className="text-sm font-medium text-slate-800">{term.indonesian}</p>
                <p className="text-xs text-slate-500">{term.english}</p>
              </div>
            </div>
            <span className="text-lg">↔️</span>
          </div>
        ))}
      </div>

      {filteredTerms.length === 0 && (
        <p className="text-center text-sm text-slate-400 py-8">
          Tidak ada istilah yang cocok dengan pencarian
        </p>
      )}

      <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-lg">
        <p className="text-xs text-amber-800">
          <strong>💡 Contoh Pemetaan Real-time:</strong> Tensi sistolik/diastolik dari SIMRS 
          otomatis dipetakan ke BP (Blood Pressure) format internasional dengan normalisasi unit mmHg.
        </p>
      </div>
    </section>
  );
}
