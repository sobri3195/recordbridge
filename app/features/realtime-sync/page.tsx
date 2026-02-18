'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { createSyncEngine, SyncEvent, HospitalConnection, SyncJob, SyncEventType } from '@/lib/syncEngine';
import { SourceSystem } from '@/lib/types';

const EVENT_TYPES = [
  { type: 'PATIENT_CREATED', label: '👤 Patient Created', color: 'blue' },
  { type: 'PATIENT_UPDATED', label: '📝 Patient Updated', color: 'purple' },
  { type: 'ENCOUNTER_CREATED', label: '🏥 Encounter Created', color: 'emerald' },
  { type: 'DIAGNOSIS_ADDED', label: '🔬 Diagnosis Added', color: 'amber' },
  { type: 'MEDICATION_PRESCRIBED', label: '💊 Medication Prescribed', color: 'rose' },
  { type: 'LAB_RESULT_RECEIVED', label: '🧪 Lab Result Received', color: 'cyan' },
  { type: 'VITAL_SIGNS_RECORDED', label: '❤️ Vitals Recorded', color: 'red' },
] as const;

const HOSPITALS: { id: SourceSystem; name: string; color: string }[] = [
  { id: 'EHR_A', name: 'RSUD Dr. Soetomo', color: 'bg-blue-500' },
  { id: 'SIMRS_B', name: 'RS Siloam TB Simatupang', color: 'bg-emerald-500' },
  { id: 'CLINIC_C', name: 'Klinik Medika Keluarga', color: 'bg-purple-500' },
];

export default function RealtimeSyncPage() {
  const [syncEngine] = useState(() => createSyncEngine());
  const [connections, setConnections] = useState<HospitalConnection[]>([]);
  const [events, setEvents] = useState<SyncEvent[]>([]);
  const [jobs, setJobs] = useState<SyncJob[]>([]);
  const [queueStatus, setQueueStatus] = useState({ total: 0, pending: 0, processing: 0, completed: 0, failed: 0 });
  const [isSimulating, setIsSimulating] = useState(false);
  const [selectedSource, setSelectedSource] = useState<SourceSystem>('EHR_A');
  const [selectedTargets, setSelectedTargets] = useState<SourceSystem[]>(['SIMRS_B', 'CLINIC_C']);

  const updateStatus = useCallback(() => {
    setConnections(syncEngine.getAllConnections());
    setEvents(syncEngine.getRecentEvents(20));
    setJobs(syncEngine.getActiveJobs());
    setQueueStatus(syncEngine.getQueueStatus());
  }, [syncEngine]);

  useEffect(() => {
    updateStatus();
    const interval = setInterval(updateStatus, 2000);
    return () => clearInterval(interval);
  }, [updateStatus]);

  const emitEvent = (eventType: SyncEventType) => {
    syncEngine.emitEvent({
      type: eventType,
      sourceSystem: selectedSource,
      patientId: `MRN-${77812 + Math.floor(Math.random() * 100)}`,
      data: { timestamp: Date.now(), simulated: true },
      priority: Math.random() > 0.7 ? 'high' : 'normal'
    });
    updateStatus();
  };

  const startSync = async () => {
    const mockRecord = {
      patient: {
        identifiers: ['MRN-77812'],
        demographics: {
          fullName: 'Siti Rahmawati',
          dob: '1984-03-12',
          sex: 'Female',
          language: 'id'
        }
      },
      observations: [],
      conditions: [],
      medications: [],
      allergies: [],
      timelineEvents: [],
      mappings: [],
      conflicts: [],
      auditLog: []
    };

    await syncEngine.syncBetweenHospitals(selectedSource, selectedTargets, mockRecord);
    updateStatus();
  };

  const toggleSimulation = () => {
    if (isSimulating) {
      setIsSimulating(false);
    } else {
      setIsSimulating(true);
      syncEngine.simulateRealTimeSync();
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'connected': return 'bg-emerald-500';
      case 'syncing': return 'bg-blue-500 animate-pulse';
      case 'error': return 'bg-red-500';
      default: return 'bg-slate-400';
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-700';
      case 'normal': return 'bg-blue-100 text-blue-700';
      case 'low': return 'bg-slate-100 text-slate-700';
      default: return 'bg-slate-100 text-slate-700';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Real-Time Multi-Hospital Sync</h1>
          <p className="text-slate-600">Event-driven architecture with queue system and conflict resolution</p>
        </div>
        <Link href="/demo" className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium hover:bg-slate-50">
          ← Back to Demo
        </Link>
      </div>

      <div className="grid grid-cols-4 gap-4">
        <div className="card bg-gradient-to-br from-blue-50 to-white">
          <p className="text-3xl font-bold text-blue-700">{queueStatus.total}</p>
          <p className="text-sm text-slate-600">Total Events</p>
        </div>
        <div className="card bg-gradient-to-br from-amber-50 to-white">
          <p className="text-3xl font-bold text-amber-700">{queueStatus.pending}</p>
          <p className="text-sm text-slate-600">Pending</p>
        </div>
        <div className="card bg-gradient-to-br from-purple-50 to-white">
          <p className="text-3xl font-bold text-purple-700">{queueStatus.processing}</p>
          <p className="text-sm text-slate-600">Processing</p>
        </div>
        <div className="card bg-gradient-to-br from-emerald-50 to-white">
          <p className="text-3xl font-bold text-emerald-700">{queueStatus.completed}</p>
          <p className="text-sm text-slate-600">Completed</p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {connections.map((conn) => (
          <div key={conn.id} className="card">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`h-3 w-3 rounded-full ${getStatusColor(conn.status)}`} />
                <div>
                  <h3 className="font-semibold text-slate-800">{conn.name}</h3>
                  <p className="text-xs text-slate-500">ID: {conn.id}</p>
                </div>
              </div>
              <span className={`rounded-full px-2 py-1 text-xs font-medium ${
                conn.status === 'connected' ? 'bg-emerald-100 text-emerald-700' :
                conn.status === 'syncing' ? 'bg-blue-100 text-blue-700' :
                'bg-red-100 text-red-700'
              }`}>
                {conn.status}
              </span>
            </div>
            <div className="mt-4 space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-600">Last Sync</span>
                <span className="font-medium">{new Date(conn.lastSync).toLocaleTimeString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Pending</span>
                <span className="font-medium">{conn.pendingChanges} changes</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Latency</span>
                <span className="font-medium">{conn.latency}ms</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="card space-y-4">
          <h3 className="font-semibold text-slate-800">🎮 Manual Event Trigger</h3>
          
          <div>
            <label className="block text-sm font-medium text-slate-700">Source Hospital</label>
            <select
              value={selectedSource}
              onChange={(e) => setSelectedSource(e.target.value as SourceSystem)}
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
            >
              {HOSPITALS.map(h => (
                <option key={h.id} value={h.id}>{h.name}</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-2">
            {EVENT_TYPES.map((event) => (
              <button
                key={event.type}
                onClick={() => emitEvent(event.type)}
                className={`rounded-lg ${
                  event.color === 'blue' ? 'bg-blue-100 text-blue-700 hover:bg-blue-200' :
                  event.color === 'purple' ? 'bg-purple-100 text-purple-700 hover:bg-purple-200' :
                  event.color === 'emerald' ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200' :
                  event.color === 'amber' ? 'bg-amber-100 text-amber-700 hover:bg-amber-200' :
                  event.color === 'rose' ? 'bg-rose-100 text-rose-700 hover:bg-rose-200' :
                  event.color === 'cyan' ? 'bg-cyan-100 text-cyan-700 hover:bg-cyan-200' :
                  'bg-red-100 text-red-700 hover:bg-red-200'
                } px-3 py-2 text-sm font-medium transition-colors`}
              >
                {event.label}
              </button>
            ))}
          </div>

          <button
            onClick={toggleSimulation}
            className={`w-full rounded-xl px-4 py-3 font-semibold transition-colors ${
              isSimulating
                ? 'bg-red-600 text-white hover:bg-red-700'
                : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}
          >
            {isSimulating ? '⏹ Stop Simulation' : '▶ Start Auto Simulation'}
          </button>
        </div>

        <div className="card space-y-4">
          <h3 className="font-semibold text-slate-800">🔄 Cross-Hospital Sync</h3>
          
          <div>
            <label className="block text-sm font-medium text-slate-700">Source</label>
            <select
              value={selectedSource}
              onChange={(e) => setSelectedSource(e.target.value as SourceSystem)}
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
            >
              {HOSPITALS.map(h => (
                <option key={h.id} value={h.id}>{h.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700">Target Hospitals</label>
            <div className="mt-2 space-y-2">
              {HOSPITALS.filter(h => h.id !== selectedSource).map(h => (
                <label key={h.id} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={selectedTargets.includes(h.id)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedTargets([...selectedTargets, h.id]);
                      } else {
                        setSelectedTargets(selectedTargets.filter(id => id !== h.id));
                      }
                    }}
                    className="h-4 w-4 rounded border-slate-300"
                  />
                  <span className="text-sm text-slate-700">{h.name}</span>
                </label>
              ))}
            </div>
          </div>

          <button
            onClick={startSync}
            disabled={selectedTargets.length === 0}
            className="w-full rounded-xl bg-emerald-600 px-4 py-3 font-semibold text-white hover:bg-emerald-700 disabled:opacity-50"
          >
            🚀 Start Sync
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="card">
          <h3 className="font-semibold text-slate-800 mb-4">📜 Recent Events</h3>
          <div className="max-h-64 space-y-2 overflow-auto">
            {events.length === 0 ? (
              <p className="text-center text-slate-500 py-8">No events yet. Trigger some events!</p>
            ) : (
              events.slice().reverse().map((event) => (
                <div key={event.id} className="flex items-center gap-3 rounded-lg bg-slate-50 p-3">
                  <span className={`rounded-full px-2 py-1 text-xs font-medium ${getPriorityBadge(event.priority)}`}>
                    {event.priority}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{event.type}</p>
                    <p className="text-xs text-slate-500">
                      {event.sourceSystem} • {new Date(event.timestamp).toLocaleTimeString()}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="card">
          <h3 className="font-semibold text-slate-800 mb-4">⚙️ Active Sync Jobs</h3>
          <div className="max-h-64 space-y-2 overflow-auto">
            {jobs.length === 0 ? (
              <p className="text-center text-slate-500 py-8">No active jobs</p>
            ) : (
              jobs.map((job) => (
                <div key={job.id} className="rounded-lg bg-slate-50 p-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">{job.id}</span>
                    <span className={`rounded-full px-2 py-1 text-xs font-medium ${
                      job.status === 'completed' ? 'bg-emerald-100 text-emerald-700' :
                      job.status === 'failed' ? 'bg-red-100 text-red-700' :
                      job.status === 'syncing' ? 'bg-blue-100 text-blue-700' :
                      'bg-amber-100 text-amber-700'
                    }`}>
                      {job.status}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-1">
                    {job.sourceSystem} → {job.targetSystems.join(', ')}
                  </p>
                  {job.status === 'syncing' && (
                    <div className="mt-2">
                      <div className="h-2 w-full rounded-full bg-slate-200">
                        <div
                          className="h-2 rounded-full bg-blue-500 transition-all"
                          style={{ width: `${job.progress}%` }}
                        />
                      </div>
                      <p className="mt-1 text-xs text-right text-slate-600">{job.progress.toFixed(0)}%</p>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="card border-2 border-blue-200 bg-blue-50">
          <h4 className="font-semibold text-blue-800">⚡ Event-Driven Architecture</h4>
          <ul className="mt-3 space-y-2 text-sm text-blue-700">
            <li>✅ Kafka/RabbitMQ compatible</li>
            <li>✅ Priority queue system</li>
            <li>✅ Retry with exponential backoff</li>
            <li>✅ Dead letter queue support</li>
          </ul>
        </div>
        <div className="card border-2 border-emerald-200 bg-emerald-50">
          <h4 className="font-semibold text-emerald-800">🛠 Conflict Resolution</h4>
          <ul className="mt-3 space-y-2 text-sm text-emerald-700">
            <li>✅ Source wins strategy</li>
            <li>✅ Timestamp-based resolution</li>
            <li>✅ Custom business rules</li>
            <li>✅ Manual override capability</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
