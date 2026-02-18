'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  AutoConnectorEngine,
  ConnectionParams,
  APIEndpoint,
  DetectedSchema,
  createConnector
} from '@/lib/autoConnector';
import { ConnectorConfig, SupportedFormat } from '@/lib/types';

export default function AutoConnectorPage() {
  const [connectionType, setConnectionType] = useState<'database' | 'api'>('database');
  const [isConnecting, setIsConnecting] = useState(false);
  const [connectionResult, setConnectionResult] = useState<{ success: boolean; message: string; latency: number } | null>(null);
  const [detectedSchema, setDetectedSchema] = useState<DetectedSchema | null>(null);
  const [generatedSchema, setGeneratedSchema] = useState<Record<string, unknown> | null>(null);
  const [activeTab, setActiveTab] = useState<'connect' | 'detect' | 'schema'>('connect');

  const [dbParams, setDbParams] = useState<ConnectionParams>({
    host: '',
    port: 5432,
    database: '',
    username: '',
    password: '',
    type: 'postgresql'
  });

  const [apiParams, setApiParams] = useState<APIEndpoint>({
    url: '',
    authType: 'none',
    headers: {}
  });

  const handleConnect = async () => {
    setIsConnecting(true);

    const config: ConnectorConfig = {
      id: `conn-${Date.now()}`,
      name: 'Auto-Detected Connection',
      connectionType,
      ...(connectionType === 'database' ? {
        host: dbParams.host,
        port: dbParams.port,
        database: dbParams.database,
        username: dbParams.username,
        password: dbParams.password
      } : {
        endpoint: apiParams.url,
        authType: apiParams.authType,
        headers: apiParams.headers
      })
    };

    const engine = createConnector(config);
    const result = await engine.testConnection();
    setConnectionResult(result);

    if (result.success) {
      const schema = await engine.detectSchema();
      setDetectedSchema(schema);

      const integrationSchema = engine.generateIntegrationSchema();
      setGeneratedSchema(integrationSchema);
    }

    setIsConnecting(false);
  };

  const getFormatIcon = (format: SupportedFormat) => {
    switch (format) {
      case 'FHIR': return '🏥';
      case 'HL7': return '📨';
      case 'JSON': return '📄';
      case 'XML': return '📋';
      default: return '📄';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Universal Auto-Connector Engine</h1>
          <p className="text-slate-600">Auto-detect database structure and auto-map fields with plug-and-play connectors</p>
        </div>
        <Link href="/demo" className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium hover:bg-slate-50">
          ← Back to Demo
        </Link>
      </div>

      <div className="flex gap-2 border-b border-slate-200">
        {(['connect', 'detect', 'schema'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
              activeTab === tab
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-600 hover:text-slate-800'
            }`}
          >
            {tab === 'connect' && '🔗 Connection'}
            {tab === 'detect' && '🔍 Auto-Detect'}
            {tab === 'schema' && '📐 Schema'}
          </button>
        ))}
      </div>

      {activeTab === 'connect' && (
        <div className="card space-y-6">
          <div className="flex gap-4">
            <button
              onClick={() => setConnectionType('database')}
              className={`flex-1 rounded-xl border-2 p-4 text-left transition-all ${
                connectionType === 'database'
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-slate-200 hover:border-slate-300'
              }`}
            >
              <span className="text-2xl">💾</span>
              <h3 className="mt-2 font-semibold">Database Connection</h3>
              <p className="text-sm text-slate-600">Connect to PostgreSQL, MySQL, MSSQL, or Oracle</p>
            </button>
            <button
              onClick={() => setConnectionType('api')}
              className={`flex-1 rounded-xl border-2 p-4 text-left transition-all ${
                connectionType === 'api'
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-slate-200 hover:border-slate-300'
              }`}
            >
              <span className="text-2xl">🌐</span>
              <h3 className="mt-2 font-semibold">API Endpoint</h3>
              <p className="text-sm text-slate-600">Connect via REST API with authentication</p>
            </button>
          </div>

          {connectionType === 'database' ? (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700">Database Type</label>
                <select
                  value={dbParams.type}
                  onChange={(e) => setDbParams({ ...dbParams, type: e.target.value as ConnectionParams['type'] })}
                  className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
                >
                  <option value="postgresql">PostgreSQL</option>
                  <option value="mysql">MySQL</option>
                  <option value="mssql">Microsoft SQL Server</option>
                  <option value="oracle">Oracle</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700">Host</label>
                <input
                  type="text"
                  placeholder="192.168.1.100"
                  value={dbParams.host}
                  onChange={(e) => setDbParams({ ...dbParams, host: e.target.value })}
                  className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700">Port</label>
                <input
                  type="number"
                  value={dbParams.port}
                  onChange={(e) => setDbParams({ ...dbParams, port: parseInt(e.target.value) })}
                  className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700">Database Name</label>
                <input
                  type="text"
                  placeholder="simrs_db"
                  value={dbParams.database}
                  onChange={(e) => setDbParams({ ...dbParams, database: e.target.value })}
                  className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700">Username</label>
                <input
                  type="text"
                  placeholder="db_user"
                  value={dbParams.username}
                  onChange={(e) => setDbParams({ ...dbParams, username: e.target.value })}
                  className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700">Password</label>
                <input
                  type="password"
                  placeholder="••••••••"
                  value={dbParams.password}
                  onChange={(e) => setDbParams({ ...dbParams, password: e.target.value })}
                  className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
                />
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700">API URL</label>
                <input
                  type="url"
                  placeholder="https://simrs.hospital.go.id/api/v1"
                  value={apiParams.url}
                  onChange={(e) => setApiParams({ ...apiParams, url: e.target.value })}
                  className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700">Authentication</label>
                <select
                  value={apiParams.authType}
                  onChange={(e) => setApiParams({ ...apiParams, authType: e.target.value as APIEndpoint['authType'] })}
                  className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
                >
                  <option value="none">No Authentication</option>
                  <option value="basic">Basic Auth</option>
                  <option value="bearer">Bearer Token</option>
                  <option value="apikey">API Key</option>
                </select>
              </div>
            </div>
          )}

          <button
            onClick={handleConnect}
            disabled={isConnecting}
            className="w-full rounded-xl bg-blue-600 px-4 py-3 font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
          >
            {isConnecting ? '⏳ Testing Connection...' : '🔗 Test Connection'}
          </button>

          {connectionResult && (
            <div className={`rounded-xl p-4 ${connectionResult.success ? 'bg-emerald-50 border border-emerald-200' : 'bg-red-50 border border-red-200'}`}>
              <div className="flex items-center gap-2">
                <span className="text-xl">{connectionResult.success ? '✅' : '❌'}</span>
                <div>
                  <p className={`font-medium ${connectionResult.success ? 'text-emerald-800' : 'text-red-800'}`}>
                    {connectionResult.message}
                  </p>
                  <p className="text-sm text-slate-600">Latency: {connectionResult.latency}ms</p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {activeTab === 'detect' && detectedSchema && (
        <div className="space-y-4">
          <div className="card">
            <h3 className="text-lg font-semibold">📊 Schema Detection Results</h3>
            <div className="mt-4 grid grid-cols-4 gap-4">
              <div className="rounded-xl bg-blue-50 p-4 text-center">
                <p className="text-2xl font-bold text-blue-700">{detectedSchema.tables.length}</p>
                <p className="text-sm text-slate-600">Tables Detected</p>
              </div>
              <div className="rounded-xl bg-purple-50 p-4 text-center">
                <p className="text-2xl font-bold text-purple-700">{detectedSchema.relationships.length}</p>
                <p className="text-sm text-slate-600">Relationships</p>
              </div>
              <div className="rounded-xl bg-emerald-50 p-4 text-center">
                <p className="text-2xl font-bold text-emerald-700">{detectedSchema.confidence.toFixed(0)}%</p>
                <p className="text-sm text-slate-600">Confidence</p>
              </div>
              <div className="rounded-xl bg-amber-50 p-4 text-center">
                <span className="text-2xl">{getFormatIcon(detectedSchema.estimatedFormat)}</span>
                <p className="text-sm text-slate-600">{detectedSchema.estimatedFormat}</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="card">
              <h4 className="font-semibold text-slate-800">📋 Detected Tables</h4>
              <ul className="mt-3 space-y-2">
                {detectedSchema.tables.map((table) => (
                  <li key={table} className="flex items-center gap-2 rounded-lg bg-slate-50 px-3 py-2">
                    <span className="text-lg">📊</span>
                    <span className="font-mono text-sm">{table}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="card">
              <h4 className="font-semibold text-slate-800">🔗 Relationships</h4>
              <ul className="mt-3 space-y-2">
                {detectedSchema.relationships.map((rel, idx) => (
                  <li key={idx} className="flex items-center gap-2 rounded-lg bg-slate-50 px-3 py-2">
                    <span className="font-mono text-sm text-blue-600">{rel.from}</span>
                    <span className="text-slate-400">→</span>
                    <span className="font-mono text-sm text-emerald-600">{rel.to}</span>
                    <span className="ml-auto rounded-full bg-slate-200 px-2 py-0.5 text-xs">{rel.type}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'schema' && generatedSchema && (
        <div className="card">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-lg font-semibold">📐 Generated Integration Schema</h3>
            <span className="rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-700">
              v{generatedSchema.version as string}
            </span>
          </div>
          <pre className="max-h-96 overflow-auto rounded-xl bg-slate-900 p-4 text-sm text-emerald-400">
            {JSON.stringify(generatedSchema, null, 2)}
          </pre>
          <div className="mt-4 flex gap-2">
            <button className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700">
              📥 Download Schema
            </button>
            <button className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium hover:bg-slate-50">
              📋 Copy to Clipboard
            </button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-2 gap-4">
        <div className="card border-2 border-blue-200 bg-blue-50">
          <h4 className="font-semibold text-blue-800">🚀 Plug & Play Connectors</h4>
          <ul className="mt-3 space-y-2 text-sm text-blue-700">
            <li>✅ Auto-detect 100+ SIMRS schemas</li>
            <li>✅ Support HL7 v2.x, FHIR R4</li>
            <li>✅ JSON, XML, CSV formats</li>
            <li>✅ Minimal configuration needed</li>
          </ul>
        </div>
        <div className="card border-2 border-emerald-200 bg-emerald-50">
          <h4 className="font-semibold text-emerald-800">🔒 Secure by Default</h4>
          <ul className="mt-3 space-y-2 text-sm text-emerald-700">
            <li>✅ Encrypted connections (TLS 1.3)</li>
            <li>✅ Credential vault integration</li>
            <li>✅ IP whitelist support</li>
            <li>✅ Audit logging enabled</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
