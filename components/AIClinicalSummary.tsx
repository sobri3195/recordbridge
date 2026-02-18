'use client';

import { useMemo } from 'react';
import { CanonicalRecord } from '@/lib/types';
import { generateClinicalSummary } from '@/lib/mappingEngine';

interface AIClinicalSummaryProps {
  record: CanonicalRecord | null;
}

const conditionTranslations: Record<string, string> = {
  'Type 2 Diabetes Mellitus': 'Diabetes Melitus Tipe 2',
  'Hypertension': 'Hipertensi',
  'Hypertension Stage 1': 'Hipertensi Stadium 1',
  'Hyperlipidemia': 'Dislipidemia',
  'Chronic Kidney Disease': 'Penyakit Ginjal Kronis'
};

export function AIClinicalSummary({ record }: AIClinicalSummaryProps) {
  const summary = useMemo(() => {
    if (!record) return null;
    return generateClinicalSummary(record);
  }, [record]);

  if (!summary) {
    return (
      <section className="card text-sm text-slate-500">
        Jalankan translasi untuk menghasilkan ringkasan klinis AI.
      </section>
    );
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical':
        return 'bg-rose-100 text-rose-800 border-rose-200';
      case 'warning':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      default:
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'improvement':
        return '📈';
      case 'alert':
        return '⚠️';
      case 'trend':
        return '📊';
      default:
        return '✅';
    }
  };

  return (
    <section className="card bg-gradient-to-br from-indigo-50 to-blue-50 border-indigo-200">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="text-2xl">🤖</span>
          <h3 className="text-lg font-bold text-indigo-900">AI Clinical Summary</h3>
        </div>
        <span className="text-xs text-indigo-600 bg-indigo-100 px-2 py-1 rounded-full">
          AI-Powered
        </span>
      </div>

      {/* Demographics */}
      <div className="bg-white rounded-lg p-4 mb-4 shadow-sm">
        <p className="text-2xl font-bold text-slate-800">{summary.demographics.displayText}</p>
        <div className="mt-2 flex flex-wrap gap-2">
          {summary.primaryConditions.map((condition, idx) => (
            <span
              key={idx}
              className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium"
            >
              {conditionTranslations[condition] || condition}
            </span>
          ))}
        </div>
      </div>

      {/* BP Trend */}
      {summary.bpTrend !== 'unknown' && (
        <div className="mb-4">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-sm font-semibold text-slate-700">Tren Tekanan Darah:</span>
            <span
              className={`px-2 py-0.5 rounded text-xs font-medium ${
                summary.bpTrend === 'improving'
                  ? 'bg-emerald-100 text-emerald-800'
                  : summary.bpTrend === 'worsening'
                  ? 'bg-rose-100 text-rose-800'
                  : 'bg-slate-100 text-slate-800'
              }`}
            >
              {summary.bpTrend === 'improving'
                ? 'Membaik ↗️'
                : summary.bpTrend === 'worsening'
                ? 'Memburuk ↘️'
                : 'Stabil ➡️'}
            </span>
          </div>
        </div>
      )}

      {/* Key Insights */}
      <div className="space-y-2 mb-4">
        <h4 className="text-sm font-semibold text-slate-700">Ringkasan Klinis:</h4>
        {summary.keyInsights.map((insight, idx) => (
          <div
            key={idx}
            className={`p-3 rounded-lg border ${getSeverityColor(insight.severity)}`}
          >
            <div className="flex items-start gap-2">
              <span className="text-lg">{getTypeIcon(insight.type)}</span>
              <div className="flex-1">
                <p className="text-sm font-medium">{insight.message}</p>
                <p className="text-xs opacity-75 mt-1">
                  Berdasarkan: {insight.basedOn.join(', ')}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Risk Flags */}
      {summary.riskFlags.length > 0 && (
        <div className="bg-rose-50 border border-rose-200 rounded-lg p-3">
          <h4 className="text-sm font-semibold text-rose-800 mb-2">⚠️ Risk Flags:</h4>
          <ul className="space-y-1">
            {summary.riskFlags.map((flag, idx) => (
              <li key={idx} className="text-sm text-rose-700 flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-rose-500 rounded-full"></span>
                {flag}
              </li>
            ))}
          </ul>
        </div>
      )}

      <p className="text-xs text-slate-400 mt-4 text-right">
        Diperbarui: {new Date(summary.lastUpdated).toLocaleString('id-ID')}
      </p>
    </section>
  );
}
