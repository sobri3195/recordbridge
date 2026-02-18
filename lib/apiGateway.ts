import { CanonicalRecord, SourceSystem } from '@/lib/types';
import { RealTimeSyncEngine } from './syncEngine';
import { NationalHealthStandardizationLayer } from './standardizationLayer';

export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';

export interface APIEndpoint {
  path: string;
  method: HttpMethod;
  description: string;
  parameters?: Array<{
    name: string;
    type: string;
    required: boolean;
    description: string;
  }>;
  responses: Record<string, {
    description: string;
    schema?: Record<string, unknown>;
  }>;
}

export interface APIRequest {
  id: string;
  timestamp: string;
  method: HttpMethod;
  path: string;
  headers: Record<string, string>;
  query: Record<string, string>;
  body?: Record<string, unknown>;
  clientId: string;
}

export interface APIResponse {
  id: string;
  requestId: string;
  timestamp: string;
  statusCode: number;
  headers: Record<string, string>;
  body: Record<string, unknown> | Array<Record<string, unknown>>;
  latency: number;
}

export interface APIKey {
  key: string;
  name: string;
  scopes: string[];
  createdAt: string;
  lastUsed?: string;
  rateLimit: number;
}

export interface APIClient {
  id: string;
  name: string;
  apiKey: string;
  scopes: string[];
  requestsToday: number;
  rateLimit: number;
  createdAt: string;
}

export interface ReferralRequest {
  fromHospital: SourceSystem;
  toHospital: SourceSystem;
  patientId: string;
  reason: string;
  urgency: 'routine' | 'urgent' | 'emergency';
  clinicalNotes?: string;
  documents?: string[];
}

export interface ReferralResponse {
  id: string;
  status: 'pending' | 'accepted' | 'rejected' | 'completed';
  request: ReferralRequest;
  createdAt: string;
  updatedAt: string;
  referralNumber: string;
}

export class UniversalHealthAPIGateway {
  private endpoints: APIEndpoint[] = [];
  private clients: Map<string, APIClient> = new Map();
  private requestLog: APIRequest[] = [];
  private responseLog: APIResponse[] = [];
  private syncEngine: RealTimeSyncEngine;
  private standardizationLayer: NationalHealthStandardizationLayer;

  constructor() {
    this.syncEngine = new RealTimeSyncEngine();
    this.standardizationLayer = new NationalHealthStandardizationLayer();
    this.initializeEndpoints();
  }

  private initializeEndpoints(): void {
    this.endpoints = [
      {
        path: '/patients',
        method: 'GET',
        description: 'Get list of patients across all connected hospitals',
        parameters: [
          { name: 'hospital', type: 'string', required: false, description: 'Filter by hospital ID' },
          { name: 'limit', type: 'integer', required: false, description: 'Number of results (default: 20)' },
          { name: 'offset', type: 'integer', required: false, description: 'Pagination offset' }
        ],
        responses: {
          '200': { description: 'List of patients' },
          '401': { description: 'Unauthorized' },
          '429': { description: 'Rate limit exceeded' }
        }
      },
      {
        path: '/patients/{id}',
        method: 'GET',
        description: 'Get detailed patient record by ID',
        parameters: [
          { name: 'id', type: 'string', required: true, description: 'Patient ID or MRN' }
        ],
        responses: {
          '200': { description: 'Patient details' },
          '404': { description: 'Patient not found' }
        }
      },
      {
        path: '/patients',
        method: 'POST',
        description: 'Create new patient record',
        responses: {
          '201': { description: 'Patient created' },
          '400': { description: 'Invalid request' }
        }
      },
      {
        path: '/encounters',
        method: 'GET',
        description: 'Get patient encounters/visits',
        parameters: [
          { name: 'patient_id', type: 'string', required: true, description: 'Patient ID' },
          { name: 'from', type: 'date', required: false, description: 'Start date' },
          { name: 'to', type: 'date', required: false, description: 'End date' }
        ],
        responses: {
          '200': { description: 'List of encounters' }
        }
      },
      {
        path: '/encounters',
        method: 'POST',
        description: 'Create new encounter',
        responses: {
          '201': { description: 'Encounter created' }
        }
      },
      {
        path: '/labs',
        method: 'GET',
        description: 'Get laboratory results',
        parameters: [
          { name: 'patient_id', type: 'string', required: true, description: 'Patient ID' },
          { name: 'test_type', type: 'string', required: false, description: 'Filter by test type' }
        ],
        responses: {
          '200': { description: 'List of lab results' }
        }
      },
      {
        path: '/labs',
        method: 'POST',
        description: 'Submit lab results',
        responses: {
          '201': { description: 'Lab results submitted' }
        }
      },
      {
        path: '/radiology',
        method: 'GET',
        description: 'Get radiology/imaging results',
        parameters: [
          { name: 'patient_id', type: 'string', required: true, description: 'Patient ID' },
          { name: 'modality', type: 'string', required: false, description: 'XRAY, CT, MRI, USG' }
        ],
        responses: {
          '200': { description: 'List of radiology results' }
        }
      },
      {
        path: '/medications',
        method: 'GET',
        description: 'Get patient medications',
        parameters: [
          { name: 'patient_id', type: 'string', required: true, description: 'Patient ID' },
          { name: 'active', type: 'boolean', required: false, description: 'Only active medications' }
        ],
        responses: {
          '200': { description: 'List of medications' }
        }
      },
      {
        path: '/medications',
        method: 'POST',
        description: 'Prescribe medication',
        responses: {
          '201': { description: 'Medication prescribed' }
        }
      },
      {
        path: '/referrals',
        method: 'GET',
        description: 'Get referral records',
        parameters: [
          { name: 'patient_id', type: 'string', required: false, description: 'Filter by patient' },
          { name: 'status', type: 'string', required: false, description: 'Filter by status' }
        ],
        responses: {
          '200': { description: 'List of referrals' }
        }
      },
      {
        path: '/referrals',
        method: 'POST',
        description: 'Create new referral',
        responses: {
          '201': { description: 'Referral created' }
        }
      },
      {
        path: '/referrals/{id}/accept',
        method: 'POST',
        description: 'Accept a referral',
        responses: {
          '200': { description: 'Referral accepted' }
        }
      },
      {
        path: '/sync/status',
        method: 'GET',
        description: 'Get sync status across hospitals',
        responses: {
          '200': { description: 'Sync status information' }
        }
      },
      {
        path: '/sync/trigger',
        method: 'POST',
        description: 'Trigger manual sync',
        responses: {
          '202': { description: 'Sync triggered' }
        }
      }
    ];
  }

  registerClient(name: string, scopes: string[]): APIClient {
    const id = `client-${Date.now()}`;
    const apiKey = `rb_${Buffer.from(`${id}:${Date.now()}`).toString('base64')}`;

    const client: APIClient = {
      id,
      name,
      apiKey,
      scopes,
      requestsToday: 0,
      rateLimit: 1000,
      createdAt: new Date().toISOString()
    };

    this.clients.set(apiKey, client);
    return client;
  }

  validateApiKey(apiKey: string): boolean {
    return this.clients.has(apiKey);
  }

  checkRateLimit(apiKey: string): boolean {
    const client = this.clients.get(apiKey);
    if (!client) return false;

    if (client.requestsToday >= client.rateLimit) {
      return false;
    }

    client.requestsToday++;
    return true;
  }

  async handleRequest(
    method: HttpMethod,
    path: string,
    headers: Record<string, string>,
    query: Record<string, string>,
    body?: Record<string, unknown>
  ): Promise<APIResponse> {
    const startTime = Date.now();
    const requestId = `req-${Date.now()}`;

    const request: APIRequest = {
      id: requestId,
      timestamp: new Date().toISOString(),
      method,
      path,
      headers,
      query,
      body,
      clientId: headers['x-api-key'] || 'anonymous'
    };

    this.requestLog.push(request);

    if (!this.validateApiKey(headers['x-api-key'] || '')) {
      return this.createResponse(requestId, 401, { error: 'Unauthorized' }, startTime);
    }

    if (!this.checkRateLimit(headers['x-api-key'] || '')) {
      return this.createResponse(requestId, 429, { error: 'Rate limit exceeded' }, startTime);
    }

    try {
      const result = await this.routeRequest(method, path, query, body);
      return this.createResponse(requestId, 200, result, startTime);
    } catch (error) {
      return this.createResponse(
        requestId,
        500,
        { error: error instanceof Error ? error.message : 'Internal server error' },
        startTime
      );
    }
  }

  private createResponse(
    requestId: string,
    statusCode: number,
    body: Record<string, unknown> | Array<Record<string, unknown>>,
    startTime: number
  ): APIResponse {
    const response: APIResponse = {
      id: `res-${Date.now()}`,
      requestId,
      timestamp: new Date().toISOString(),
      statusCode,
      headers: {
        'Content-Type': 'application/fhir+json',
        'X-API-Version': '2.0.0'
      },
      body,
      latency: Date.now() - startTime
    };

    this.responseLog.push(response);
    return response;
  }

  private async routeRequest(
    method: HttpMethod,
    path: string,
    query: Record<string, string>,
    body?: Record<string, unknown>
  ): Promise<Record<string, unknown> | Array<Record<string, unknown>>> {
    await new Promise(resolve => setTimeout(resolve, 100));

    if (path === '/patients' && method === 'GET') {
      return this.getPatients(query);
    }

    if (path.startsWith('/patients/') && method === 'GET') {
      const id = path.split('/')[2];
      return this.getPatientById(id);
    }

    if (path === '/patients' && method === 'POST') {
      return this.createPatient(body || {});
    }

    if (path === '/encounters' && method === 'GET') {
      return this.getEncounters(query);
    }

    if (path === '/labs' && method === 'GET') {
      return this.getLabs(query);
    }

    if (path === '/radiology' && method === 'GET') {
      return this.getRadiology(query);
    }

    if (path === '/medications' && method === 'GET') {
      return this.getMedications(query);
    }

    if (path === '/referrals' && method === 'GET') {
      return this.getReferrals(query);
    }

    if (path === '/referrals' && method === 'POST') {
      return this.createReferral(body || {});
    }

    if (path === '/sync/status' && method === 'GET') {
      return this.getSyncStatus();
    }

    throw new Error('Endpoint not found');
  }

  private getPatients(query: Record<string, string>): Record<string, unknown> {
    const hospital = query.hospital;
    const limit = parseInt(query.limit || '20');

    const patients = [
      {
        id: 'MRN-77812',
        name: 'Siti Rahmawati',
        dob: '1984-03-12',
        gender: 'female',
        hospital: 'EHR_A',
        lastVisit: '2026-01-14'
      },
      {
        id: 'MRN-78901',
        name: 'Budi Santoso',
        dob: '1975-08-22',
        gender: 'male',
        hospital: 'SIMRS_B',
        lastVisit: '2026-01-15'
      },
      {
        id: 'MRN-79023',
        name: 'Dewi Kusuma',
        dob: '1990-12-05',
        gender: 'female',
        hospital: 'CLINIC_C',
        lastVisit: '2026-01-16'
      }
    ];

    const filtered = hospital ? patients.filter(p => p.hospital === hospital) : patients;

    return {
      total: filtered.length,
      limit,
      offset: parseInt(query.offset || '0'),
      patients: filtered.slice(0, limit)
    };
  }

  private getPatientById(id: string): Record<string, unknown> {
    return {
      resourceType: 'Patient',
      id,
      identifier: [{ system: 'http://hospital.go.id/mrn', value: id }],
      name: [{ text: 'Siti Rahmawati' }],
      gender: 'female',
      birthDate: '1984-03-12',
      address: [{ city: 'Jakarta' }],
      managingOrganization: { reference: 'Organization/EHR_A' }
    };
  }

  private createPatient(body: Record<string, unknown>): Record<string, unknown> {
    return {
      resourceType: 'Patient',
      id: `MRN-${Date.now()}`,
      ...body,
      meta: {
        created: new Date().toISOString(),
        version: '1'
      }
    };
  }

  private getEncounters(query: Record<string, string>): Record<string, unknown> {
    return {
      total: 2,
      encounters: [
        {
          id: 'enc-001',
          patient_id: query.patient_id,
          date: '2026-01-14',
          type: 'Outpatient',
          reason: 'Diabetes follow-up',
          status: 'completed'
        },
        {
          id: 'enc-002',
          patient_id: query.patient_id,
          date: '2026-01-12',
          type: 'Emergency',
          reason: 'Dizziness',
          status: 'completed'
        }
      ]
    };
  }

  private getLabs(query: Record<string, string>): Record<string, unknown> {
    return {
      patient_id: query.patient_id,
      total: 2,
      results: [
        {
          id: 'lab-001',
          test: 'HbA1c',
          value: '7.8',
          unit: '%',
          reference_range: '4.0 - 6.0',
          status: 'abnormal',
          date: '2026-01-10'
        },
        {
          id: 'lab-002',
          test: 'Glucose',
          value: '180',
          unit: 'mg/dL',
          reference_range: '70 - 100',
          status: 'abnormal',
          date: '2026-01-12'
        }
      ]
    };
  }

  private getRadiology(query: Record<string, string>): Record<string, unknown> {
    return {
      patient_id: query.patient_id,
      total: 1,
      studies: [
        {
          id: 'rad-001',
          modality: 'XRAY',
          description: 'Chest X-Ray',
          date: '2026-01-10',
          status: 'final',
          findings: 'No acute cardiopulmonary process'
        }
      ]
    };
  }

  private getMedications(query: Record<string, string>): Record<string, unknown> {
    return {
      patient_id: query.patient_id,
      active: query.active === 'true',
      medications: [
        {
          id: 'med-001',
          name: 'Metformin',
          dose: '500 mg',
          frequency: 'twice daily',
          route: 'oral',
          status: 'active',
          prescribed: '2026-01-10'
        },
        {
          id: 'med-002',
          name: 'Amlodipine',
          dose: '5 mg',
          frequency: 'daily',
          route: 'oral',
          status: 'active',
          prescribed: '2026-01-10'
        }
      ]
    };
  }

  private getReferrals(query: Record<string, string>): Record<string, unknown> {
    return {
      total: 1,
      referrals: [
        {
          id: 'ref-001',
          referral_number: 'REF-2026-001',
          patient_id: query.patient_id || 'MRN-77812',
          from_hospital: 'EHR_A',
          to_hospital: 'SIMRS_B',
          reason: 'Specialist consultation',
          urgency: 'routine',
          status: 'pending',
          created_at: '2026-01-14T08:30:00Z'
        }
      ]
    };
  }

  private createReferral(body: Record<string, unknown>): Record<string, unknown> {
    const referral: ReferralResponse = {
      id: `ref-${Date.now()}`,
      referralNumber: `REF-${new Date().getFullYear()}-${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`,
      request: body as unknown as ReferralRequest,
      status: 'pending',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    return {
      ...referral,
      message: 'Referral created successfully'
    };
  }

  private getSyncStatus(): Record<string, unknown> {
    const connections = this.syncEngine.getAllConnections();

    return {
      status: 'operational',
      timestamp: new Date().toISOString(),
      connections: connections.map(c => ({
        hospital: c.name,
        status: c.status,
        last_sync: c.lastSync,
        pending: c.pendingChanges,
        latency_ms: c.latency
      })),
      queue: this.syncEngine.getQueueStatus()
    };
  }

  getEndpoints(): APIEndpoint[] {
    return this.endpoints;
  }

  getDocumentation(): Record<string, unknown> {
    return {
      openapi: '3.0.0',
      info: {
        title: 'RecordBridge Universal Health API',
        version: '2.0.0',
        description: 'Unified API for healthcare data interoperability across Indonesian hospitals'
      },
      servers: [
        { url: 'https://api.recordbridge.id/v2', description: 'Production' },
        { url: 'https://staging-api.recordbridge.id/v2', description: 'Staging' }
      ],
      endpoints: this.endpoints
    };
  }

  getRequestStats(): {
    total: number;
    today: number;
    averageLatency: number;
    errorRate: number;
  } {
    const today = new Date().toISOString().split('T')[0];
    const todayRequests = this.requestLog.filter(r => r.timestamp.startsWith(today));
    const responses = this.responseLog.filter(r => r.timestamp.startsWith(today));
    
    const totalLatency = responses.reduce((sum, r) => sum + r.latency, 0);
    const errorResponses = responses.filter(r => r.statusCode >= 400);

    return {
      total: this.requestLog.length,
      today: todayRequests.length,
      averageLatency: responses.length > 0 ? totalLatency / responses.length : 0,
      errorRate: responses.length > 0 ? (errorResponses.length / responses.length) * 100 : 0
    };
  }
}

export const createAPIGateway = (): UniversalHealthAPIGateway => {
  return new UniversalHealthAPIGateway();
};

export const generateAPIKey = (clientName: string): string => {
  return `rb_live_${Buffer.from(`${clientName}:${Date.now()}`).toString('base64').replace(/=/g, '')}`;
};
