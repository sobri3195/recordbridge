'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { createAIMappingEngine, FieldSimilarity, AIMappingEngine } from '@/lib/aiMappingEngine';
import { MappingRecommendation } from '@/lib/types';

const SAMPLE_SOURCE_FIELDS = [
  'nama_pasien',
  'no_rm',
  'tgl_lahir',
  'jenis_kelamin',
  'alamat',
  'no_telepon',
  'diagnosa_utama',
  'icd10',
  'obat_aktif',
  'tgl_kunjungan',
  'dokter_jaga',
  'hasil_lab',
  'tensi',
  'nadi',
  'suhu',
  'alergi',
  'riwayat_penyakit',
  'berat_badan',
  'tinggi_badan',
  'golongan_darah'
];

const SAMPLE_TARGET_FIELDS = [
  'patient_name',
  'medical_record_number',
  'date_of_birth',
  'gender',
  'address',
  'phone',
  'diagnosis',
  'icd_code',
  'medication',
  'encounter_date',
  'doctor',
  'lab_result',
  'blood_pressure',
  'heart_rate',
  'temperature',
  'allergy',
  'medical_history',
  'weight',
  'height',
  'blood_type'
];

export default function AIMappingPage() {
  const [engine] = useState(() => createAIMappingEngine());
  const [selectedSource, setSelectedSource] = useState<string>('');
  const [selectedTarget, setSelectedTarget] = useState<string>('');
  const [similarity, setSimilarity] = useState<FieldSimilarity | null>(null);
  const [recommendations, setRecommendations] = useState<MappingRecommendation[]>([]);
  const [stats, setStats] = useState<ReturnType<AIMappingEngine['getLearningStats']> | null>(null);
  const [activeTab, setActiveTab] = useState<'single' | 'batch' | 'learning'>('single');
  const [approvedMappings, setApprovedMappings] = useState<Set<string>>(new Set());

  const calculateSimilarity = () => {
    if (!selectedSource || !selectedTarget) return;
    const result = engine.calculateSimilarity(selectedSource, selectedTarget);
    setSimilarity(result);
  };

  const generateRecommendations = () => {
    const results = engine.generateRecommendations(SAMPLE_SOURCE_FIELDS, SAMPLE_TARGET_FIELDS, 0.5);
    setRecommendations(results);
  };

  const loadStats = () => {
    const learningStats = engine.getLearningStats();
    setStats(learningStats);
  };

  const approveMapping = (rec: MappingRecommendation) => {
    setApprovedMappings(prev => new Set(Array.from(prev).concat(rec.id)));
    engine.learnFromMapping(
      'demo_source',
      'demo_target',
      [{
        id: `map-${Date.now()}`,
        sourceField: rec.sourceField,
        canonicalField: rec.suggestedMapping,
        sourceValue: rec.sourceField,
        normalizedValue: rec.suggestedMapping,
        confidence: rec.confidence
      }],
      true
    );
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.9) return 'bg-emerald-500';
    if (confidence >= 0.7) return 'bg-blue-500';
    if (confidence >= 0.5) return 'bg-amber-500';
    return 'bg-red-500';
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Smart Data Mapping AI Engine</h1>
          <p className="text-slate-600">Rule-based + AI mapping with learning capabilities</p>
        </div>
        <Link href="/demo" className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium hover:bg-slate-50">
          ← Back to Demo
        </Link>
      </div>

      <div className="flex gap-2 border-b border-slate-200">
        {(['single', 'batch', 'learning'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => {
              setActiveTab(tab);
              if (tab === 'batch' && recommendations.length === 0) generateRecommendations();
              if (tab === 'learning') loadStats();
            }}
            className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
              activeTab === tab
                ? 'border-purple-600 text-purple-600'
                : 'border-transparent text-slate-600 hover:text-slate-800'
            }`}
          >
            {tab === 'single' && '🎯 Single Field'}
            {tab === 'batch' && '⚡ Batch Processing'}
            {tab === 'learning' && '🧠 Learning Stats'}
          </button>
        ))}
      </div>

      {activeTab === 'single' && (
        <div className="card space-y-6">
          <h3 className="text-lg font-semibold">🎯 Single Field Similarity Analysis</h3>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700">Source Field (SIMRS)</label>
              <select
                value={selectedSource}
                onChange={(e) => setSelectedSource(e.target.value)}
                className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
              >
                <option value="">Select source field...</option>
                {SAMPLE_SOURCE_FIELDS.map(field => (
                  <option key={field} value={field}>{field}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700">Target Field (Canonical)</label>
              <select
                value={selectedTarget}
                onChange={(e) => setSelectedTarget(e.target.value)}
                className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
              >
                <option value="">Select target field...</option>
                {SAMPLE_TARGET_FIELDS.map(field => (
                  <option key={field} value={field}>{field}</option>
                ))}
              </select>
            </div>
          </div>

          <button
            onClick={calculateSimilarity}
            disabled={!selectedSource || !selectedTarget}
            className="w-full rounded-xl bg-purple-600 px-4 py-3 font-semibold text-white hover:bg-purple-700 disabled:opacity-50"
          >
            🔍 Calculate Similarity
          </button>

          {similarity && (
            <div className="rounded-xl bg-slate-50 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600">Source: <span className="font-mono font-medium text-slate-800">{similarity.sourceField}</span></p>
                  <p className="text-sm text-slate-600">Target: <span className="font-mono font-medium text-slate-800">{similarity.targetField}</span></p>
                  <p className="mt-2 text-sm text-slate-600">Reasoning: <span className="text-slate-800">{similarity.reasoning}</span></p>
                </div>
                <div className="text-center">
                  <div className={`mx-auto h-20 w-20 rounded-full ${getConfidenceColor(similarity.similarity)} flex items-center justify-center`}>
                    <span className="text-xl font-bold text-white">{(similarity.similarity * 100).toFixed(0)}%</span>
                  </div>
                  <p className="mt-2 text-sm font-medium text-slate-700">Similarity</p>
                </div>
              </div>
              <div className="mt-4">
                <div className="flex justify-between text-sm">
                  <span>Confidence</span>
                  <span>{(similarity.confidence * 100).toFixed(1)}%</span>
                </div>
                <div className="mt-1 h-2 w-full rounded-full bg-slate-200">
                  <div
                    className={`h-2 rounded-full ${getConfidenceColor(similarity.confidence)}`}
                    style={{ width: `${similarity.confidence * 100}%` }}
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {activeTab === 'batch' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">⚡ Batch Mapping Recommendations</h3>
            <button
              onClick={generateRecommendations}
              className="rounded-lg bg-purple-600 px-4 py-2 text-sm font-medium text-white hover:bg-purple-700"
            >
              🔄 Refresh Recommendations
            </button>
          </div>

          <div className="grid gap-3">
            {recommendations.map((rec) => (
              <div
                key={rec.id}
                className={`card transition-all ${
                  approvedMappings.has(rec.id) ? 'border-2 border-emerald-500 bg-emerald-50' : ''
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-sm text-slate-600">{rec.sourceField}</span>
                      <span className="text-slate-400">→</span>
                      <span className="font-mono text-sm font-semibold text-purple-700">{rec.suggestedMapping}</span>
                      {rec.autoApprove && (
                        <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-medium text-emerald-700">
                          Auto-Approve
                        </span>
                      )}
                    </div>
                    <p className="mt-1 text-xs text-slate-500">{rec.reasoning}</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <div className="text-sm font-medium">{(rec.confidence * 100).toFixed(1)}%</div>
                      <div className="text-xs text-slate-500">Confidence</div>
                    </div>
                    <div className="h-10 w-10">
                      <svg viewBox="0 0 36 36" className="h-full w-full">
                        <path
                          d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                          fill="none"
                          stroke="#e2e8f0"
                          strokeWidth="3"
                        />
                        <path
                          d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                          fill="none"
                          stroke={rec.confidence >= 0.9 ? '#10b981' : rec.confidence >= 0.7 ? '#3b82f6' : '#f59e0b'}
                          strokeWidth="3"
                          strokeDasharray={`${rec.confidence * 100}, 100`}
                        />
                      </svg>
                    </div>
                    <button
                      onClick={() => approveMapping(rec)}
                      disabled={approvedMappings.has(rec.id)}
                      className={`rounded-lg px-3 py-2 text-sm font-medium ${
                        approvedMappings.has(rec.id)
                          ? 'bg-emerald-100 text-emerald-700'
                          : 'bg-purple-100 text-purple-700 hover:bg-purple-200'
                      }`}
                    >
                      {approvedMappings.has(rec.id) ? '✅ Approved' : '👍 Approve'}
                    </button>
                  </div>
                </div>
                {rec.alternatives.length > 0 && (
                  <div className="mt-3 border-t border-slate-200 pt-3">
                    <p className="text-xs text-slate-500">Alternative mappings:</p>
                    <div className="mt-1 flex flex-wrap gap-2">
                      {rec.alternatives.map((alt, idx) => (
                        <span
                          key={idx}
                          className="rounded-full bg-slate-100 px-2 py-1 text-xs text-slate-600"
                        >
                          {alt.field} ({(alt.confidence * 100).toFixed(0)}%)
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'learning' && stats && (
        <div className="space-y-4">
          <div className="grid grid-cols-3 gap-4">
            <div className="card text-center">
              <p className="text-3xl font-bold text-purple-700">{stats.totalMappings}</p>
              <p className="text-sm text-slate-600">Total Mappings Learned</p>
            </div>
            <div className="card text-center">
              <p className="text-3xl font-bold text-emerald-700">{(stats.successRate * 100).toFixed(1)}%</p>
              <p className="text-sm text-slate-600">Success Rate</p>
            </div>
            <div className="card text-center">
              <p className="text-3xl font-bold text-blue-700">{stats.topPatterns.length}</p>
              <p className="text-sm text-slate-600">Common Patterns</p>
            </div>
          </div>

          <div className="card">
            <h4 className="font-semibold text-slate-800">🔥 Top Mapping Patterns</h4>
            <div className="mt-4 space-y-2">
              {stats.topPatterns.slice(0, 10).map((pattern, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between rounded-lg bg-slate-50 px-4 py-2"
                >
                  <span className="font-mono text-sm">{pattern.pattern}</span>
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-32 rounded-full bg-slate-200">
                      <div
                        className="h-2 rounded-full bg-purple-500"
                        style={{ width: `${Math.min(pattern.count * 10, 100)}%` }}
                      />
                    </div>
                    <span className="text-sm text-slate-600">{pattern.count}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="card border-2 border-purple-200 bg-purple-50">
              <h4 className="font-semibold text-purple-800">🧠 AI Features</h4>
              <ul className="mt-3 space-y-2 text-sm text-purple-700">
                <li>✅ Semantic pattern matching</li>
                <li>✅ Jaro-Winkler string similarity</li>
                <li>✅ Multi-word token matching</li>
                <li>✅ Confidence boosting from history</li>
              </ul>
            </div>
            <div className="card border-2 border-emerald-200 bg-emerald-50">
              <h4 className="font-semibold text-emerald-800">📚 Learning System</h4>
              <ul className="mt-3 space-y-2 text-sm text-emerald-700">
                <li>✅ Local storage persistence</li>
                <li>✅ Success rate tracking</li>
                <li>✅ Auto-improvement over time</li>
                <li>✅ Dictionary expansion</li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
