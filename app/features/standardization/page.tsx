'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  createStandardizationLayer,
  NationalHealthStandardizationLayer,
  StandardizedCode,
  FHIRResource
} from '@/lib/standardizationLayer';

const CODE_SYSTEMS = [
  { id: 'ICD-10', name: 'ICD-10', icon: '🏥', color: 'blue', desc: 'International Classification of Diseases' },
  { id: 'ICD-9-CM', name: 'ICD-9-CM', icon: '📋', color: 'slate', desc: 'ICD-9 Clinical Modification' },
  { id: 'LOINC', name: 'LOINC', icon: '🧪', color: 'purple', desc: 'Logical Observation Identifiers' },
  { id: 'SNOMED-CT', name: 'SNOMED-CT', icon: '🧬', color: 'emerald', desc: 'Systematized Nomenclature of Medicine' },
  { id: 'RXNORM', name: 'RxNorm', icon: '💊', color: 'amber', desc: 'Normalized Drug Names' },
] as const;

const SAMPLE_CONDITIONS = [
  'Type 2 Diabetes Mellitus',
  'Hypertension',
  'Chronic Kidney Disease',
  'Asthma',
  'Pneumonia',
  'Stroke',
  'Penyakit Jantung',
  'Demam Berdarah',
  'Tuberkulosis',
  'COVID-19'
];

const SAMPLE_LABS = [
  'HbA1c',
  'Glucose',
  'Creatinine',
  'Hemoglobin',
  'Cholesterol Total',
  'HDL',
  'LDL',
  'Triglyceride',
  'White Blood Cell',
  'Platelet'
];

const SAMPLE_MEDICATIONS = [
  'Metformin',
  'Amlodipine',
  'Simvastatin',
  'Paracetamol',
  'Amoxicillin',
  'Insulin',
  'Aspirin',
  'Ibuprofen'
];

export default function StandardizationPage() {
  const [layer] = useState(() => createStandardizationLayer());
  const [activeSystem, setActiveSystem] = useState<string>('ICD-10');
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<StandardizedCode | null>(null);
  const [fhirResource, setFhirResource] = useState<FHIRResource | null>(null);
  const [activeTab, setActiveTab] = useState<'codes' | 'fhir' | 'satu_sehat'>('codes');

  const handleSearch = () => {
    if (!searchTerm) return;

    let result: StandardizedCode | null = null;

    switch (activeSystem) {
      case 'ICD-10':
        result = layer.toICD10(searchTerm);
        break;
      case 'ICD-9-CM':
        result = layer.toICD9CM(searchTerm);
        break;
      case 'LOINC':
        result = layer.toLOINC(searchTerm);
        break;
      case 'SNOMED-CT':
        result = layer.toSNOMED(searchTerm);
        break;
      case 'RXNORM':
        result = layer.toRxNorm(searchTerm);
        break;
    }

    setSearchResults(result);
  };

  const generateSampleFHIR = () => {
    const patient = layer.patientToSATUSEHAT({
      identifiers: ['MRN-77812', 'NIK-3171234567890'],
      demographics: {
        fullName: 'Siti Rahmawati',
        dob: '1984-03-12',
        sex: 'Female'
      }
    });
    setFhirResource(patient);
  };

  const getSystemColor = (systemId: string) => {
    switch (systemId) {
      case 'ICD-10': return 'bg-blue-500';
      case 'ICD-9-CM': return 'bg-slate-500';
      case 'LOINC': return 'bg-purple-500';
      case 'SNOMED-CT': return 'bg-emerald-500';
      case 'RXNORM': return 'bg-amber-500';
      default: return 'bg-slate-500';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">National Health Standardization Layer</h1>
          <p className="text-slate-600">FHIR compliant, SATUSEHAT compatible, with ICD-10, LOINC & SNOMED support</p>
        </div>
        <Link href="/demo" className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium hover:bg-slate-50">
          ← Back to Demo
        </Link>
      </div>

      <div className="grid grid-cols-5 gap-3">
        {CODE_SYSTEMS.map((system) => (
          <button
            key={system.id}
            onClick={() => {
              setActiveSystem(system.id);
              setSearchResults(null);
            }}
            className={`rounded-xl border-2 p-4 text-left transition-all ${
              activeSystem === system.id
                ? `border-${system.color}-500 bg-${system.color}-50`
                : 'border-slate-200 hover:border-slate-300'
            }`}
          >
            <span className="text-2xl">{system.icon}</span>
            <h3 className={`mt-2 font-semibold text-${system.color}-800`}>{system.name}</h3>
            <p className="text-xs text-slate-600">{system.desc}</p>
          </button>
        ))}
      </div>

      <div className="flex gap-2 border-b border-slate-200">
        {(['codes', 'fhir', 'satu_sehat'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => {
              setActiveTab(tab);
              if (tab === 'fhir' && !fhirResource) generateSampleFHIR();
            }}
            className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
              activeTab === tab
                ? 'border-emerald-600 text-emerald-600'
                : 'border-transparent text-slate-600 hover:text-slate-800'
            }`}
          >
            {tab === 'codes' && '🔍 Code Lookup'}
            {tab === 'fhir' && '🏥 FHIR Resources'}
            {tab === 'satu_sehat' && '🇮🇩 SATUSEHAT'}
          </button>
        ))}
      </div>

      {activeTab === 'codes' && (
        <div className="space-y-4">
          <div className="card">
            <div className="flex gap-4">
              <div className="flex-1">
                <label className="block text-sm font-medium text-slate-700">Search Term</label>
                <div className="mt-1 flex gap-2">
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder={`Enter ${activeSystem} term...`}
                    className="flex-1 rounded-lg border border-slate-300 px-3 py-2"
                    onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                  />
                  <button
                    onClick={handleSearch}
                    className={`rounded-lg px-4 py-2 font-medium text-white ${getSystemColor(activeSystem)} hover:opacity-90`}
                  >
                    🔍 Search
                  </button>
                </div>
              </div>
            </div>

            {searchResults && (
              <div className="mt-6 rounded-xl bg-slate-50 p-6">
                <div className="flex items-start gap-4">
                  <div className={`rounded-xl ${getSystemColor(activeSystem)} p-4`}>
                    <span className="text-3xl text-white">
                      {CODE_SYSTEMS.find(s => s.id === activeSystem)?.icon}
                    </span>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-slate-600">Code</p>
                    <p className="text-2xl font-bold font-mono text-slate-800">{searchResults.code}</p>
                    <p className="mt-2 text-sm text-slate-600">Display</p>
                    <p className="text-lg font-medium text-slate-800">{searchResults.display}</p>
                    <p className="mt-2 text-sm text-slate-600">System</p>
                    <p className="font-mono text-sm text-slate-700">{searchResults.system}</p>
                    {searchResults.version && (
                      <>
                        <p className="mt-2 text-sm text-slate-600">Version</p>
                        <p className="text-sm text-slate-700">{searchResults.version}</p>
                      </>
                    )}
                  </div>
                </div>
              </div>
            )}

            {!searchResults && searchTerm && (
              <div className="mt-6 rounded-xl bg-amber-50 border border-amber-200 p-4">
                <p className="text-amber-800">⚠️ No code found for &quot;{searchTerm}&quot; in {activeSystem}</p>
              </div>
            )}
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="card">
              <h4 className="font-semibold text-slate-800 mb-3">🏥 Sample Conditions</h4>
              <div className="flex flex-wrap gap-2">
                {SAMPLE_CONDITIONS.map((condition) => (
                  <button
                    key={condition}
                    onClick={() => { setSearchTerm(condition); handleSearch(); }}
                    className="rounded-full bg-blue-100 px-3 py-1 text-sm text-blue-700 hover:bg-blue-200"
                  >
                    {condition}
                  </button>
                ))}
              </div>
            </div>
            <div className="card">
              <h4 className="font-semibold text-slate-800 mb-3">🧪 Sample Lab Tests</h4>
              <div className="flex flex-wrap gap-2">
                {SAMPLE_LABS.map((lab) => (
                  <button
                    key={lab}
                    onClick={() => { setSearchTerm(lab); setActiveSystem('LOINC'); handleSearch(); }}
                    className="rounded-full bg-purple-100 px-3 py-1 text-sm text-purple-700 hover:bg-purple-200"
                  >
                    {lab}
                  </button>
                ))}
              </div>
            </div>
            <div className="card">
              <h4 className="font-semibold text-slate-800 mb-3">💊 Sample Medications</h4>
              <div className="flex flex-wrap gap-2">
                {SAMPLE_MEDICATIONS.map((med) => (
                  <button
                    key={med}
                    onClick={() => { setSearchTerm(med); setActiveSystem('RXNORM'); handleSearch(); }}
                    className="rounded-full bg-amber-100 px-3 py-1 text-sm text-amber-700 hover:bg-amber-200"
                  >
                    {med}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'fhir' && fhirResource && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">🏥 FHIR R4 Resource</h3>
            <div className="flex gap-2">
              <button className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700">
                📥 Download
              </button>
              <button className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium hover:bg-slate-50">
                📋 Copy
              </button>
            </div>
          </div>
          <pre className="max-h-96 overflow-auto rounded-xl bg-slate-900 p-4 text-sm text-emerald-400">
            {JSON.stringify(fhirResource, null, 2)}
          </pre>

          <div className="grid grid-cols-2 gap-4">
            <div className="card border-2 border-emerald-200 bg-emerald-50">
              <h4 className="font-semibold text-emerald-800">✅ FHIR R4 Compliant</h4>
              <ul className="mt-3 space-y-2 text-sm text-emerald-700">
                <li>• Valid FHIR Patient resource</li>
                <li>• Proper resourceType and id</li>
                <li>• Standard identifier system</li>
                <li>• ISO 8601 date formats</li>
              </ul>
            </div>
            <div className="card border-2 border-blue-200 bg-blue-50">
              <h4 className="font-semibold text-blue-800">🔧 Resource Types</h4>
              <ul className="mt-3 space-y-2 text-sm text-blue-700">
                <li>• Patient demographics</li>
                <li>• Condition/Diagnosis</li>
                <li>• Observation (vitals, labs)</li>
                <li>• Medication & AllergyIntolerance</li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'satu_sehat' && (
        <div className="space-y-4">
          <div className="card bg-gradient-to-r from-red-50 to-white border-red-200">
            <div className="flex items-center gap-4">
              <span className="text-4xl">🇮🇩</span>
              <div>
                <h3 className="text-lg font-semibold text-red-800">SATUSEHAT Integration Ready</h3>
                <p className="text-slate-600">Full compatibility with Kemenkes Indonesia health data platform</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="card">
              <h4 className="font-semibold text-slate-800">📋 Supported Profiles</h4>
              <ul className="mt-3 space-y-2">
                {['Patient', 'Encounter', 'Condition', 'Observation', 'Medication', 'AllergyIntolerance'].map((profile) => (
                  <li key={profile} className="flex items-center gap-2">
                    <span className="text-emerald-500">✓</span>
                    <span className="text-sm text-slate-700">{profile}</span>
                    <span className="ml-auto text-xs text-slate-500">SATUSEHAT Profile</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="card">
              <h4 className="font-semibold text-slate-800">🔄 Data Synchronization</h4>
              <ul className="mt-3 space-y-2 text-sm text-slate-600">
                <li>• Auto-format to SATUSEHAT standards</li>
                <li>• NIK integration for patient matching</li>
                <li>• Kode fasyankes validation</li>
                <li>• HTTPS/TLS encrypted transmission</li>
                <li>• OAuth 2.0 authentication</li>
              </ul>
            </div>
          </div>

          <div className="card">
            <h4 className="font-semibold text-slate-800">📤 Example SATUSEHAT Bundle</h4>
            <pre className="mt-4 max-h-64 overflow-auto rounded-xl bg-slate-900 p-4 text-sm text-emerald-400">
{`{
  "resourceType": "Bundle",
  "id": "satu-sehat-bundle-001",
  "meta": {
    "profile": ["https://fhir.kemkes.go.id/r4/StructureDefinition/Bundle"]
  },
  "type": "transaction",
  "entry": [
    {
      "fullUrl": "Patient/MRN-77812",
      "resource": {
        "resourceType": "Patient",
        "meta": {
          "profile": ["https://fhir.kemkes.go.id/r4/StructureDefinition/Patient"]
        },
        "identifier": [
          {
            "system": "http://hl7.org/fhir/sid/nik",
            "value": "3171234567890"
          }
        ],
        "name": [{ "text": "Siti Rahmawati" }],
        "gender": "female",
        "birthDate": "1984-03-12"
      },
      "request": {
        "method": "POST",
        "url": "Patient"
      }
    }
  ]
}`}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
}
