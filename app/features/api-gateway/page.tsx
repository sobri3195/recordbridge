'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { createAPIGateway, APIEndpoint, APIRequest, APIResponse, APIClient, HttpMethod } from '@/lib/apiGateway';

const HTTP_METHODS: { method: HttpMethod; color: string }[] = [
  { method: 'GET', color: 'bg-blue-500' },
  { method: 'POST', color: 'bg-emerald-500' },
  { method: 'PUT', color: 'bg-amber-500' },
  { method: 'DELETE', color: 'bg-red-500' },
  { method: 'PATCH', color: 'bg-purple-500' },
];

export default function APIGatewayPage() {
  const [gateway] = useState(() => createAPIGateway());
  const [endpoints, setEndpoints] = useState<APIEndpoint[]>([]);
  const [selectedEndpoint, setSelectedEndpoint] = useState<APIEndpoint | null>(null);
  const [client, setClient] = useState<APIClient | null>(null);
  const [apiKey, setApiKey] = useState('');
  const [requestPath, setRequestPath] = useState('/patients');
  const [requestMethod, setRequestMethod] = useState<HttpMethod>('GET');
  const [requestQuery, setRequestQuery] = useState('hospital=EHR_A&limit=10');
  const [response, setResponse] = useState<APIResponse | null>(null);
  const [stats, setStats] = useState({ total: 0, today: 0, averageLatency: 0, errorRate: 0 });
  const [activeTab, setActiveTab] = useState<'explorer' | 'docs' | 'keys'>('explorer');

  useEffect(() => {
    setEndpoints(gateway.getEndpoints());
    setStats(gateway.getRequestStats());
  }, [gateway]);

  const registerClient = () => {
    const newClient = gateway.registerClient('Demo Client', ['read', 'write']);
    setClient(newClient);
    setApiKey(newClient.apiKey);
  };

  const sendRequest = async () => {
    const query: Record<string, string> = {};
    requestQuery.split('&').forEach(pair => {
      const [key, value] = pair.split('=');
      if (key) query[key] = value || '';
    });

    const result = await gateway.handleRequest(
      requestMethod,
      requestPath,
      { 'x-api-key': apiKey },
      query
    );

    setResponse(result);
    setStats(gateway.getRequestStats());
  };

  const getMethodColor = (method: HttpMethod) => {
    switch (method) {
      case 'GET': return 'bg-blue-500';
      case 'POST': return 'bg-emerald-500';
      case 'PUT': return 'bg-amber-500';
      case 'DELETE': return 'bg-red-500';
      case 'PATCH': return 'bg-purple-500';
      default: return 'bg-slate-500';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Universal Health API Gateway</h1>
          <p className="text-slate-600">Single API for all healthcare integrations - RESTful FHIR-compliant endpoints</p>
        </div>
        <Link href="/demo" className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium hover:bg-slate-50">
          ← Back to Demo
        </Link>
      </div>

      <div className="grid grid-cols-4 gap-4">
        <div className="card bg-gradient-to-br from-blue-50 to-white">
          <p className="text-3xl font-bold text-blue-700">{stats.total}</p>
          <p className="text-sm text-slate-600">Total Requests</p>
        </div>
        <div className="card bg-gradient-to-br from-emerald-50 to-white">
          <p className="text-3xl font-bold text-emerald-700">{stats.today}</p>
          <p className="text-sm text-slate-600">Today</p>
        </div>
        <div className="card bg-gradient-to-br from-purple-50 to-white">
          <p className="text-3xl font-bold text-purple-700">{stats.averageLatency.toFixed(0)}ms</p>
          <p className="text-sm text-slate-600">Avg Latency</p>
        </div>
        <div className="card bg-gradient-to-br from-amber-50 to-white">
          <p className="text-3xl font-bold text-amber-700">{stats.errorRate.toFixed(1)}%</p>
          <p className="text-sm text-slate-600">Error Rate</p>
        </div>
      </div>

      <div className="flex gap-2 border-b border-slate-200">
        {(['explorer', 'docs', 'keys'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
              activeTab === tab
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-slate-600 hover:text-slate-800'
            }`}
          >
            {tab === 'explorer' && '🔍 API Explorer'}
            {tab === 'docs' && '📚 Documentation'}
            {tab === 'keys' && '🔑 API Keys'}
          </button>
        ))}
      </div>

      {activeTab === 'explorer' && (
        <div className="space-y-4">
          <div className="card space-y-4">
            <h3 className="font-semibold text-slate-800">🚀 Try It Now</h3>
            
            {!client ? (
              <div className="rounded-xl bg-amber-50 border border-amber-200 p-4">
                <p className="text-amber-800">⚠️ You need an API key to make requests</p>
                <button
                  onClick={registerClient}
                  className="mt-2 rounded-lg bg-amber-600 px-4 py-2 text-sm font-medium text-white hover:bg-amber-700"
                >
                  Generate API Key
                </button>
              </div>
            ) : (
              <div className="rounded-xl bg-emerald-50 border border-emerald-200 p-4">
                <p className="text-sm text-emerald-800">✅ API Key generated successfully</p>
                <code className="mt-2 block rounded-lg bg-slate-900 px-3 py-2 text-xs text-emerald-400">
                  {client.apiKey}
                </code>
              </div>
            )}

            <div className="flex gap-2">
              <select
                value={requestMethod}
                onChange={(e) => setRequestMethod(e.target.value as HttpMethod)}
                className="rounded-lg border border-slate-300 px-3 py-2 font-mono text-sm"
              >
                {HTTP_METHODS.map(m => (
                  <option key={m.method} value={m.method}>{m.method}</option>
                ))}
              </select>
              <input
                type="text"
                value={requestPath}
                onChange={(e) => setRequestPath(e.target.value)}
                className="flex-1 rounded-lg border border-slate-300 px-3 py-2 font-mono text-sm"
                placeholder="/patients"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700">Query Parameters</label>
              <input
                type="text"
                value={requestQuery}
                onChange={(e) => setRequestQuery(e.target.value)}
                className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 font-mono text-sm"
                placeholder="key=value&key2=value2"
              />
            </div>

            <button
              onClick={sendRequest}
              disabled={!client}
              className="w-full rounded-xl bg-indigo-600 px-4 py-3 font-semibold text-white hover:bg-indigo-700 disabled:opacity-50"
            >
              🚀 Send Request
            </button>

            {response && (
              <div className="rounded-xl border border-slate-200">
                <div className={`rounded-t-xl px-4 py-2 ${
                  response.statusCode < 300 ? 'bg-emerald-500' :
                  response.statusCode < 400 ? 'bg-amber-500' :
                  'bg-red-500'
                }`}>
                  <div className="flex items-center justify-between text-white">
                    <span className="font-semibold">Status: {response.statusCode}</span>
                    <span className="text-sm">Latency: {response.latency}ms</span>
                  </div>
                </div>
                <pre className="max-h-96 overflow-auto rounded-b-xl bg-slate-900 p-4 text-sm text-emerald-400">
                  {JSON.stringify(response.body, null, 2)}
                </pre>
              </div>
            )}
          </div>

          <div className="card">
            <h3 className="font-semibold text-slate-800 mb-4">📋 Available Endpoints</h3>
            <div className="space-y-2">
              {endpoints.map((endpoint) => (
                <button
                  key={`${endpoint.method}-${endpoint.path}`}
                  onClick={() => {
                    setSelectedEndpoint(endpoint);
                    setRequestMethod(endpoint.method);
                    setRequestPath(endpoint.path);
                  }}
                  className="w-full flex items-center gap-3 rounded-lg bg-slate-50 p-3 text-left hover:bg-slate-100"
                >
                  <span className={`rounded px-2 py-1 text-xs font-bold text-white ${getMethodColor(endpoint.method)}`}>
                    {endpoint.method}
                  </span>
                  <span className="font-mono text-sm">{endpoint.path}</span>
                  <span className="ml-auto text-xs text-slate-500">{endpoint.description}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'docs' && (
        <div className="space-y-4">
          <div className="card">
            <h3 className="text-lg font-semibold">📚 API Documentation</h3>
            <div className="mt-4 space-y-6">
              <div>
                <h4 className="font-semibold text-slate-800">Base URL</h4>
                <code className="mt-2 block rounded-lg bg-slate-100 px-4 py-2 font-mono text-sm">
                  https://api.recordbridge.id/v2
                </code>
              </div>

              <div>
                <h4 className="font-semibold text-slate-800">Authentication</h4>
                <p className="mt-2 text-sm text-slate-600">
                  All API requests require an API key to be passed in the header:
                </p>
                <code className="mt-2 block rounded-lg bg-slate-900 px-4 py-2 font-mono text-sm text-emerald-400">
                  X-API-Key: your_api_key_here
                </code>
              </div>

              <div>
                <h4 className="font-semibold text-slate-800">Rate Limiting</h4>
                <p className="mt-2 text-sm text-slate-600">
                  Default rate limit is 1000 requests per day per API key.
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="card border-2 border-blue-200 bg-blue-50">
              <h4 className="font-semibold text-blue-800">🏥 Patient Endpoints</h4>
              <ul className="mt-3 space-y-2 text-sm text-blue-700">
                <li>• <code>GET /patients</code> - List patients</li>
                <li>• <code>GET /patients/&#123;id&#125;</code> - Get patient</li>
                <li>• <code>POST /patients</code> - Create patient</li>
              </ul>
            </div>
            <div className="card border-2 border-emerald-200 bg-emerald-50">
              <h4 className="font-semibold text-emerald-800">🔄 Clinical Endpoints</h4>
              <ul className="mt-3 space-y-2 text-sm text-emerald-700">
                <li>• <code>GET /encounters</code> - Visits</li>
                <li>• <code>GET /labs</code> - Lab results</li>
                <li>• <code>GET /medications</code> - Medications</li>
                <li>• <code>GET /radiology</code> - Imaging</li>
              </ul>
            </div>
          </div>

          <div className="card">
            <h4 className="font-semibold text-slate-800">📝 Example Response</h4>
            <pre className="mt-4 max-h-64 overflow-auto rounded-xl bg-slate-900 p-4 text-sm text-emerald-400">
{`{
  "resourceType": "Patient",
  "id": "MRN-77812",
  "identifier": [
    {
      "system": "http://hospital.go.id/mrn",
      "value": "MRN-77812"
    }
  ],
  "name": [
    {
      "text": "Siti Rahmawati"
    }
  ],
  "gender": "female",
  "birthDate": "1984-03-12",
  "address": [
    {
      "city": "Jakarta"
    }
  ]
}`}
            </pre>
          </div>
        </div>
      )}

      {activeTab === 'keys' && (
        <div className="space-y-4">
          <div className="card">
            <h3 className="text-lg font-semibold">🔑 API Key Management</h3>
            
            {client ? (
              <div className="mt-4 space-y-4">
                <div className="rounded-xl bg-slate-50 p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-slate-800">{client.name}</p>
                      <p className="text-sm text-slate-500">ID: {client.id}</p>
                      <p className="text-sm text-slate-500">Created: {new Date(client.createdAt).toLocaleDateString()}</p>
                    </div>
                    <span className="rounded-full bg-emerald-100 px-3 py-1 text-sm font-medium text-emerald-700">
                      Active
                    </span>
                  </div>
                  <div className="mt-4">
                    <p className="text-sm font-medium text-slate-700">API Key</p>
                    <code className="mt-1 block rounded-lg bg-slate-900 px-3 py-2 font-mono text-sm text-emerald-400">
                      {client.apiKey}
                    </code>
                  </div>
                  <div className="mt-4 grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium text-slate-700">Rate Limit</p>
                      <p className="text-2xl font-bold text-slate-800">{client.rateLimit}</p>
                      <p className="text-xs text-slate-500">requests/day</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-700">Used Today</p>
                      <p className="text-2xl font-bold text-slate-800">{client.requestsToday}</p>
                      <p className="text-xs text-slate-500">requests</p>
                    </div>
                  </div>
                  <div className="mt-4">
                    <p className="text-sm font-medium text-slate-700">Scopes</p>
                    <div className="mt-1 flex gap-2">
                      {client.scopes.map(scope => (
                        <span key={scope} className="rounded-full bg-blue-100 px-2 py-1 text-xs text-blue-700">
                          {scope}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="mt-4 text-center py-8">
                <p className="text-slate-600">No API key generated yet</p>
                <button
                  onClick={registerClient}
                  className="mt-4 rounded-lg bg-indigo-600 px-6 py-2 font-medium text-white hover:bg-indigo-700"
                >
                  Generate API Key
                </button>
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="card border-2 border-indigo-200 bg-indigo-50">
              <h4 className="font-semibold text-indigo-800">🔒 Security</h4>
              <ul className="mt-3 space-y-2 text-sm text-indigo-700">
                <li>✅ TLS 1.3 encryption</li>
                <li>✅ API key authentication</li>
                <li>✅ Rate limiting per key</li>
                <li>✅ Request audit logging</li>
              </ul>
            </div>
            <div className="card border-2 border-emerald-200 bg-emerald-50">
              <h4 className="font-semibold text-emerald-800">📊 Monitoring</h4>
              <ul className="mt-3 space-y-2 text-sm text-emerald-700">
                <li>✅ Real-time request metrics</li>
                <li>✅ Error rate tracking</li>
                <li>✅ Latency monitoring</li>
                <li>✅ Usage analytics</li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
