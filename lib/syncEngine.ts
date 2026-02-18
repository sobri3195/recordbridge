import { SourceSystem, Conflict, CanonicalRecord, SyncStatus } from '@/lib/types';

export type SyncEventType = 
  | 'PATIENT_CREATED'
  | 'PATIENT_UPDATED'
  | 'ENCOUNTER_CREATED'
  | 'DIAGNOSIS_ADDED'
  | 'MEDICATION_PRESCRIBED'
  | 'LAB_RESULT_RECEIVED'
  | 'ALLERGY_UPDATED'
  | 'VITAL_SIGNS_RECORDED';

export interface SyncEvent {
  id: string;
  type: SyncEventType;
  timestamp: string;
  sourceSystem: SourceSystem;
  patientId: string;
  data: Record<string, unknown>;
  priority: 'high' | 'normal' | 'low';
  retryCount: number;
}

export interface QueueMessage {
  id: string;
  event: SyncEvent;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  enqueuedAt: string;
  processedAt?: string;
  error?: string;
}

export interface SyncJob {
  id: string;
  sourceSystem: SourceSystem;
  targetSystems: SourceSystem[];
  recordType: string;
  status: 'queued' | 'syncing' | 'completed' | 'failed';
  progress: number;
  startedAt?: string;
  completedAt?: string;
  error?: string;
}

export interface ConflictResolutionStrategy {
  type: 'source_wins' | 'target_wins' | 'timestamp_wins' | 'manual';
  sourceSystem?: SourceSystem;
  customRule?: (conflict: DataConflict) => string;
}

export interface DataConflict {
  id: string;
  field: string;
  sourceValue: unknown;
  targetValue: unknown;
  sourceTimestamp: string;
  targetTimestamp: string;
  sourceSystem: SourceSystem;
  targetSystem: SourceSystem;
}

export type ConnectionStatus = 'connected' | 'disconnected' | 'syncing' | 'error';

export interface HospitalConnection {
  id: SourceSystem;
  name: string;
  status: ConnectionStatus;
  lastSync: string;
  pendingChanges: number;
  latency: number;
}

export class RealTimeSyncEngine {
  private eventQueue: QueueMessage[] = [];
  private activeJobs: Map<string, SyncJob> = new Map();
  private connections: Map<SourceSystem, HospitalConnection> = new Map();
  private eventHandlers: Map<SyncEventType, Array<(event: SyncEvent) => void>> = new Map();
  private conflictResolutions: Map<string, ConflictResolutionStrategy> = new Map();
  private isProcessing: boolean = false;
  private processingInterval: NodeJS.Timeout | null = null;

  constructor() {
    this.initializeConnections();
    this.startQueueProcessor();
  }

  private initializeConnections(): void {
    const systems: SourceSystem[] = ['EHR_A', 'SIMRS_B', 'CLINIC_C'];
    
    systems.forEach(id => {
      this.connections.set(id, {
        id,
        name: this.getSystemName(id),
        status: 'connected',
        lastSync: new Date().toISOString(),
        pendingChanges: 0,
        latency: Math.floor(Math.random() * 100) + 20
      });
    });
  }

  private getSystemName(id: SourceSystem): string {
    const names: Record<SourceSystem, string> = {
      'EHR_A': 'RSUD Dr. Soetomo',
      'SIMRS_B': 'RS Siloam TB Simatupang',
      'CLINIC_C': 'Klinik Medika Keluarga'
    };
    return names[id];
  }

  private startQueueProcessor(): void {
    if (typeof window !== 'undefined') {
      this.processingInterval = setInterval(() => {
        this.processQueue();
      }, 2000);
    }
  }

  private async processQueue(): Promise<void> {
    if (this.isProcessing) return;
    this.isProcessing = true;

    const pendingMessages = this.eventQueue.filter(m => m.status === 'pending');

    for (const message of pendingMessages.slice(0, 5)) {
      message.status = 'processing';
      
      try {
        await this.processEvent(message.event);
        message.status = 'completed';
        message.processedAt = new Date().toISOString();
      } catch (error) {
        message.status = 'failed';
        message.error = error instanceof Error ? error.message : 'Unknown error';
        
        if (message.event.retryCount < 3) {
          message.event.retryCount++;
          message.status = 'pending';
        }
      }
    }

    this.isProcessing = false;
  }

  private async processEvent(event: SyncEvent): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 300));

    const handlers = this.eventHandlers.get(event.type) || [];
    handlers.forEach(handler => {
      try {
        handler(event);
      } catch (error) {
        console.error('Event handler error:', error);
      }
    });

    this.updateConnectionStatus(event.sourceSystem);
  }

  private updateConnectionStatus(systemId: SourceSystem): void {
    const connection = this.connections.get(systemId);
    if (connection) {
      connection.lastSync = new Date().toISOString();
      connection.pendingChanges = Math.max(0, connection.pendingChanges - 1);
    }
  }

  emitEvent(event: Omit<SyncEvent, 'id' | 'timestamp' | 'retryCount'>): SyncEvent {
    const fullEvent: SyncEvent = {
      ...event,
      id: `evt-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date().toISOString(),
      retryCount: 0
    };

    const message: QueueMessage = {
      id: `msg-${Date.now()}`,
      event: fullEvent,
      status: 'pending',
      enqueuedAt: new Date().toISOString()
    };

    this.eventQueue.push(message);

    const connection = this.connections.get(event.sourceSystem);
    if (connection) {
      connection.pendingChanges++;
    }

    return fullEvent;
  }

  on(eventType: SyncEventType, handler: (event: SyncEvent) => void): () => void {
    if (!this.eventHandlers.has(eventType)) {
      this.eventHandlers.set(eventType, []);
    }
    this.eventHandlers.get(eventType)!.push(handler);

    return () => {
      const handlers = this.eventHandlers.get(eventType);
      if (handlers) {
        const index = handlers.indexOf(handler);
        if (index > -1) handlers.splice(index, 1);
      }
    };
  }

  async syncBetweenHospitals(
    source: SourceSystem,
    targets: SourceSystem[],
    record: CanonicalRecord
  ): Promise<SyncJob> {
    const job: SyncJob = {
      id: `sync-${Date.now()}`,
      sourceSystem: source,
      targetSystems: targets,
      recordType: 'patient_record',
      status: 'queued',
      progress: 0
    };

    this.activeJobs.set(job.id, job);

    job.status = 'syncing';
    job.startedAt = new Date().toISOString();

    for (let i = 0; i < targets.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 800));
      job.progress = ((i + 1) / targets.length) * 100;
      
      this.emitEvent({
        type: 'PATIENT_UPDATED',
        sourceSystem: source,
        patientId: record.patient.identifiers[0],
        data: { syncedTo: targets[i] },
        priority: 'normal'
      });
    }

    job.status = 'completed';
    job.completedAt = new Date().toISOString();
    job.progress = 100;

    return job;
  }

  detectConflicts(
    sourceData: Record<string, unknown>,
    targetData: Record<string, unknown>,
    sourceSystem: SourceSystem,
    targetSystem: SourceSystem
  ): DataConflict[] {
    const conflicts: DataConflict[] = [];

    const allKeys = new Set([...Object.keys(sourceData), ...Object.keys(targetData)]);

    for (const key of Array.from(allKeys)) {
      const sourceValue = sourceData[key];
      const targetValue = targetData[key];

      if (JSON.stringify(sourceValue) !== JSON.stringify(targetValue)) {
        conflicts.push({
          id: `conflict-${Date.now()}-${key}`,
          field: key,
          sourceValue,
          targetValue,
          sourceTimestamp: new Date().toISOString(),
          targetTimestamp: new Date(Date.now() - 3600000).toISOString(),
          sourceSystem,
          targetSystem
        });
      }
    }

    return conflicts;
  }

  resolveConflict(
    conflict: DataConflict,
    strategy: ConflictResolutionStrategy
  ): { winner: SourceSystem; value: unknown; reason: string } {
    switch (strategy.type) {
      case 'source_wins':
        return {
          winner: conflict.sourceSystem,
          value: conflict.sourceValue,
          reason: 'Source wins strategy applied'
        };

      case 'target_wins':
        return {
          winner: conflict.targetSystem,
          value: conflict.targetValue,
          reason: 'Target wins strategy applied'
        };

      case 'timestamp_wins':
        const sourceTime = new Date(conflict.sourceTimestamp).getTime();
        const targetTime = new Date(conflict.targetTimestamp).getTime();
        
        if (sourceTime > targetTime) {
          return {
            winner: conflict.sourceSystem,
            value: conflict.sourceValue,
            reason: 'Source has newer timestamp'
          };
        } else {
          return {
            winner: conflict.targetSystem,
            value: conflict.targetValue,
            reason: 'Target has newer timestamp'
          };
        }

      case 'manual':
        if (strategy.customRule) {
          const result = strategy.customRule(conflict);
          return {
            winner: result === 'source' ? conflict.sourceSystem : conflict.targetSystem,
            value: result === 'source' ? conflict.sourceValue : conflict.targetValue,
            reason: 'Custom rule applied'
          };
        }
        return {
          winner: conflict.sourceSystem,
          value: conflict.sourceValue,
          reason: 'Default to source (no custom rule)'
        };

      default:
        return {
          winner: conflict.sourceSystem,
          value: conflict.sourceValue,
          reason: 'Default strategy applied'
        };
    }
  }

  getConnectionStatus(systemId: SourceSystem): HospitalConnection | undefined {
    return this.connections.get(systemId);
  }

  getAllConnections(): HospitalConnection[] {
    return Array.from(this.connections.values());
  }

  getQueueStatus(): {
    total: number;
    pending: number;
    processing: number;
    completed: number;
    failed: number;
  } {
    return {
      total: this.eventQueue.length,
      pending: this.eventQueue.filter(m => m.status === 'pending').length,
      processing: this.eventQueue.filter(m => m.status === 'processing').length,
      completed: this.eventQueue.filter(m => m.status === 'completed').length,
      failed: this.eventQueue.filter(m => m.status === 'failed').length
    };
  }

  getActiveJobs(): SyncJob[] {
    return Array.from(this.activeJobs.values());
  }

  getRecentEvents(limit: number = 10): SyncEvent[] {
    return this.eventQueue
      .filter(m => m.status === 'completed')
      .slice(-limit)
      .map(m => m.event);
  }

  setConflictResolution(field: string, strategy: ConflictResolutionStrategy): void {
    this.conflictResolutions.set(field, strategy);
  }

  async simulateRealTimeSync(): Promise<void> {
    const eventTypes: SyncEventType[] = [
      'PATIENT_UPDATED',
      'ENCOUNTER_CREATED',
      'DIAGNOSIS_ADDED',
      'MEDICATION_PRESCRIBED',
      'LAB_RESULT_RECEIVED',
      'VITAL_SIGNS_RECORDED'
    ];

    const systems: SourceSystem[] = ['EHR_A', 'SIMRS_B', 'CLINIC_C'];

    setInterval(() => {
      const randomType = eventTypes[Math.floor(Math.random() * eventTypes.length)];
      const randomSystem = systems[Math.floor(Math.random() * systems.length)];

      this.emitEvent({
        type: randomType,
        sourceSystem: randomSystem,
        patientId: `MRN-${77812 + Math.floor(Math.random() * 100)}`,
        data: { simulated: true, timestamp: Date.now() },
        priority: Math.random() > 0.8 ? 'high' : 'normal'
      });
    }, 5000);
  }

  disconnect(): void {
    if (this.processingInterval) {
      clearInterval(this.processingInterval);
      this.processingInterval = null;
    }
  }
}

export const createSyncEngine = (): RealTimeSyncEngine => {
  return new RealTimeSyncEngine();
};

export const simulateMultiHospitalSync = async (
  source: SourceSystem,
  targets: SourceSystem[],
  record: CanonicalRecord
): Promise<{ success: boolean; syncedTo: SourceSystem[]; failed: SourceSystem[] }> => {
  const syncedTo: SourceSystem[] = [];
  const failed: SourceSystem[] = [];

  for (const target of targets) {
    await new Promise(resolve => setTimeout(resolve, 600));
    
    if (Math.random() > 0.1) {
      syncedTo.push(target);
    } else {
      failed.push(target);
    }
  }

  return {
    success: failed.length === 0,
    syncedTo,
    failed
  };
};
