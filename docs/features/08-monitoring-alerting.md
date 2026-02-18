# Monitoring & Alerting

## Overview
Fitur **Monitoring & Alerting** menyediakan visibility real-time terhadap kesehatan sistem RecordBridge, termasuk job ingestion, transformasi, dan ekspor data. Sistem ini mendeteksi anomaly, mengirim notifikasi melalui multiple channels, dan menyediakan runbook untuk incident response.

---

## Metrik Utama (Key Metrics)

### 8.1 System Metrics

```typescript
interface SystemMetrics {
  // Infrastructure
  infrastructure: {
    cpuUsage: MetricSeries;        // Percentage
    memoryUsage: MetricSeries;     // Percentage
    diskUsage: MetricSeries;       // Percentage
    networkIO: MetricSeries;       // Bytes/sec
  };
  
  // Application Performance
  application: {
    requestLatency: MetricSeries;  // P50, P95, P99 in ms
    requestRate: MetricSeries;     // Requests/sec
    errorRate: MetricSeries;       // Errors/sec
    activeConnections: MetricSeries;
    queueDepth: MetricSeries;      // Pending jobs
  };
  
  // Database
  database: {
    connectionPool: MetricSeries;
    queryLatency: MetricSeries;
    slowQueries: MetricSeries;     // Count > 1s
    replicationLag: MetricSeries;  // Seconds
  };
}
```

### 8.2 Business Metrics

```typescript
interface BusinessMetrics {
  // Job Processing
  jobs: {
    ingestion: JobMetrics;
    transformation: JobMetrics;
    validation: JobMetrics;
    export: JobMetrics;
  };
  
  // Data Quality
  dataQuality: {
    recordsProcessed: MetricSeries;
    validationPassRate: MetricSeries;  // Percentage
    conflictRate: MetricSeries;        // Conflicts per 1000 records
    autoResolutionRate: MetricSeries;  // Percentage
  };
  
  // User Activity
  userActivity: {
    activeUsers: MetricSeries;
    mappingChanges: MetricSeries;
    exportsGenerated: MetricSeries;
    conflictsResolved: MetricSeries;
  };
}

interface JobMetrics {
  submitted: MetricSeries;
  queued: MetricSeries;
  running: MetricSeries;
  completed: MetricSeries;
  failed: MetricSeries;
  cancelled: MetricSeries;
  
  duration: {
    avg: MetricSeries;
    p50: MetricSeries;
    p95: MetricSeries;
    p99: MetricSeries;
    max: MetricSeries;
  };
  
  throughput: MetricSeries; // Records/sec
}

type MetricSeries = {
  timestamps: Date[];
  values: number[];
  unit: string;
  labels?: Record<string, string>;
};
```

### 8.3 Metric Categories Dashboard

```
┌─────────────────────────────────────────────────────────────────────────┐
│ System Monitoring Dashboard                               [🔧 Settings] │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  Time Range: [Last 1 Hour 🔽]  Auto-refresh: [☑ 30s]                   │
│                                                                         │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │ JOB PROCESSING HEALTH                                           │   │
│  ├─────────────────────────────────────────────────────────────────┤   │
│  │                                                                 │   │
│  │  Ingestion Jobs    Transform Jobs    Validation Jobs   Export  │   │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  ┌──────┐│   │
│  │  │ Processing   │  │ Processing   │  │ Processing   │  │ Ready││   │
│  │  │    12        │  │     5        │  │     8        │  │  23  ││   │
│  │  │              │  │              │  │              │  │      ││   │
│  │  │ Queued: 45   │  │ Queued: 12   │  │ Queued: 8    │  │      ││   │
│  │  │ Avg: 2.3s    │  │ Avg: 5.1s    │  │ Avg: 1.8s    │  │      ││   │
│  │  │              │  │              │  │              │  │      ││   │
│  │  │ Success: 99% │  │ Success: 98% │  │ Success: 99% │  │      ││   │
│  │  └──────────────┘  └──────────────┘  └──────────────┘  └──────┘│   │
│  │                                                                 │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                                                                         │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │ SYSTEM HEALTH                                                   │   │
│  ├─────────────────────────────────────────────────────────────────┤   │
│  │                                                                 │   │
│  │  CPU: ████████████████████░░░░  78%  [▲ 12% vs last hour]      │   │
│  │  Memory: █████████████████░░░░░  65%  [→ Stable]               │   │
│  │  Disk: ██████████░░░░░░░░░░░░░░  42%  [→ Stable]               │   │
│  │                                                                 │   │
│  │  API Latency (p95): 245ms  [▼ 15% improvement]                 │   │
│  │  Error Rate: 0.02%  [→ Stable]                                 │   │
│  │  Active Connections: 142  [▲ 8%]                               │   │
│  │                                                                 │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                                                                         │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │ DATA QUALITY METRICS                                            │   │
│  ├─────────────────────────────────────────────────────────────────┤   │
│  │                                                                 │   │
│  │  Records Processed (1h): 12,456                                │   │
│  │  Validation Pass Rate: 94.2% ████████████████████░░░░          │   │
│  │  Conflict Rate: 2.3/1000 records                               │   │
│  │  Auto-Resolution Rate: 67%                                     │   │
│  │                                                                 │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## Notifikasi (Notification Channels)

### 8.4 Supported Channels

```typescript
interface NotificationConfig {
  channels: {
    email: EmailConfig;
    slack: SlackConfig;
    webhook: WebhookConfig;
    pagerduty: PagerDutyConfig;
    sms: SMSConfig;
    inApp: InAppConfig;
  };
}

interface AlertRule {
  ruleId: string;
  name: string;
  description: string;
  
  // Condition
  condition: {
    metric: string;
    operator: 'GT' | 'LT' | 'EQ' | 'GTE' | 'LTE';
    threshold: number;
    duration: number; // seconds (for sustained alerts)
    aggregation: 'AVG' | 'SUM' | 'COUNT' | 'MAX' | 'MIN';
  };
  
  // Severity
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW' | 'INFO';
  
  // Notification
  notify: {
    channels: Array<'email' | 'slack' | 'webhook' | 'pagerduty' | 'sms' | 'inApp'>;
    recipients: string[];
    escalationPolicy?: string;
  };
  
  // Throttling
  throttling: {
    enabled: boolean;
    windowMinutes: number;
    maxAlerts: number;
    cooldownMinutes: number;
  };
  
  // Auto-actions
  autoActions?: {
    restartService?: boolean;
    scaleUp?: boolean;
    runbookUrl?: string;
  };
  
  enabled: boolean;
}
```

### 8.5 Default Alert Rules

| Alert Name | Metric | Condition | Severity | Channel |
|------------|--------|-----------|----------|---------|
| **High CPU Usage** | cpu.usage | > 85% for 5m | HIGH | Email, Slack |
| **Memory Critical** | memory.usage | > 90% for 3m | CRITICAL | All channels |
| **Disk Full** | disk.usage | > 85% for 1m | HIGH | Email, Slack |
| **High Error Rate** | error.rate | > 1% for 5m | CRITICAL | All channels |
| **API Latency High** | api.latency.p95 | > 1000ms for 10m | HIGH | Email, Slack |
| **Job Queue Backlog** | jobs.queued | > 100 for 15m | MEDIUM | Email |
| **Job Failure Spike** | jobs.failed | > 5% for 10m | HIGH | Email, Slack |
| **Database Slow Query** | db.slowQueries | > 10/min for 5m | MEDIUM | Email |
| **Data Quality Drop** | quality.passRate | < 90% for 30m | HIGH | Email, Slack |
| **Export Failure** | export.failed | > 0 | MEDIUM | Email |
| **Security Event** | security.events | > 0 | CRITICAL | All channels |

### 8.6 Notification Templates

#### Email Alert (Critical)
```html
Subject: 🚨 CRITICAL: High Error Rate Detected - RecordBridge

Alert: High Error Rate Detected
Severity: CRITICAL
Time: 2026-01-16 14:32:15 WIB

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

METRIC DETAILS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Metric: error.rate
Current Value: 3.45%
Threshold: 1%
Duration: 10 minutes
Status: BREACHING

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

IMPACT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
• 45 failed requests in last 10 minutes
• Affected endpoints: /api/import, /api/export
• Estimated affected users: ~120

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

RECOMMENDED ACTIONS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
1. Check application logs for error patterns
2. Verify database connectivity
3. Review recent deployments

[View Dashboard] [View Logs] [Acknowledge]

Runbook: https://wiki/runbooks/high-error-rate
```

#### Slack Notification
```json
{
  "attachments": [{
    "color": "danger",
    "title": "🚨 CRITICAL: High Error Rate",
    "fields": [
      {"title": "Metric", "value": "error.rate", "short": true},
      {"title": "Current", "value": "3.45%", "short": true},
      {"title": "Threshold", "value": "1%", "short": true},
      {"title": "Duration", "value": "10 minutes", "short": true}
    ],
    "actions": [
      {"name": "view_dashboard", "text": "View Dashboard", "type": "button", "url": "..."},
      {"name": "acknowledge", "text": "Acknowledge", "type": "button"}
    ]
  }]
}
```

---

## Threshold Alert

### 8.7 Dynamic Thresholds

```typescript
interface ThresholdConfig {
  // Static threshold
  static?: number;
  
  // Dynamic baseline
  dynamic?: {
    enabled: boolean;
    baselineWindow: '1h' | '1d' | '7d' | '30d';
    deviationPercent: number; // Alert if > X% from baseline
    anomalyDetection: boolean; // Use ML for anomaly detection
  };
  
  // Time-based thresholds
  scheduled?: Array<{
    daysOfWeek: number[]; // 0-6
    startTime: string; // HH:MM
    endTime: string;
    threshold: number;
  }>;
}

// Example: Higher thresholds during business hours
const businessHoursThreshold: ThresholdConfig = {
  scheduled: [
    {
      daysOfWeek: [1, 2, 3, 4, 5], // Mon-Fri
      startTime: '09:00',
      endTime: '17:00',
      threshold: 100, // Higher threshold during business hours
    },
    {
      daysOfWeek: [0, 1, 2, 3, 4, 5, 6], // All days (off-hours)
      startTime: '17:01',
      endTime: '08:59',
      threshold: 50, // Lower threshold during off-hours
    }
  ]
};
```

### 8.8 Anomaly Detection

```typescript
interface AnomalyDetection {
  algorithm: 'Z_SCORE' | 'IQR' | 'ISOLATION_FOREST' | 'LSTM';
  
  // Z-Score parameters
  zScore?: {
    window: number; // Data points
    threshold: number; // Standard deviations
  };
  
  // Seasonality
  seasonality: {
    enabled: boolean;
    patterns: ('HOURLY' | 'DAILY' | 'WEEKLY')[];
  };
  
  // Learning
  learning: {
    warmupPeriod: number; // Days before alerting
    autoAdjust: boolean; // Adjust sensitivity based on feedback
  };
}
```

---

## Runbook: Alur Penanganan Insiden

### 8.9 Incident Response Workflow

```
┌─────────────────────────────────────────────────────────────────────┐
│              INCIDENT RESPONSE WORKFLOW                             │
└─────────────────────────────────────────────────────────────────────┘

PHASE 1: DETEKSI
┌─────────────┐
│ Alert       │
│ Triggered   │
└──────┬──────┘
       │
       ▼
┌─────────────────┐
│ Auto-           │
│ Dedupe &        │
│ Correlate       │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Create Incident │
│ Record          │
└────────┬────────┘
         │
         ▼
PHASE 2: NOTIFIKASI
         ┌───────────────────────────────┐
         │                               │
         ▼                               ▼
┌─────────────────┐             ┌─────────────────┐
│ Route to        │             │ Auto-           │
│ On-Call         │             │ Actions         │
│ Engineer        │             │ (if configured) │
└────────┬────────┘             └─────────────────┘
         │
         ▼
PHASE 3: TRIAGE
┌─────────────────┐
│ Engineer        │
│ Acknowledges    │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Initial         │
│ Assessment:     │
│ Severity?       │
│ Impact?         │
│ Runbook?        │
└────────┬────────┘
         │
    ┌────┴────┐
    ▼         ▼
 FALSE      TRUE
 ALARM      PAGE
   │          │
   ▼          ▼
PHASE 4: RESOLUSI
┌─────────────────┐
│ Follow Runbook  │
│ Diagnostics:    │
│ • Check logs    │
│ • Check metrics │
│ • Check infra   │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Root Cause      │
│ Identified?     │
└────────┬────────┘
         │
    ┌────┴────┐
    ▼         ▼
   NO        YES
    │          │
    ▼          ▼
┌────────┐ ┌─────────────────┐
│Escalate│ │ Apply Fix       │
│to L2   │ │ • Code change   │
│        │ │ • Config change │
│        │ │ • Scale up      │
└────────┘ │ • Restart       │
           └────────┬────────┘
                    │
                    ▼
           ┌─────────────────┐
           │ Verify Fix      │
           │ • Metric check  │
           │ • Health check  │
           └────────┬────────┘
                    │
                    ▼
PHASE 5: POST-INCIDENT
           ┌─────────────────┐
           │ Resolve Incident│
           │ Update Status   │
           └────────┬────────┘
                    │
                    ▼
           ┌─────────────────┐
           │ Document in     │
           │ Post-Mortem     │
           │ (if severity    │
           │  warrants)      │
           └─────────────────┘
```

### 8.10 Runbook Examples

#### Runbook: High Error Rate

```markdown
# RUNBOOK: High Error Rate Alert

## Alert Details
- **Metric**: error.rate
- **Threshold**: > 1%
- **Severity**: CRITICAL

## Initial Checks (2 minutes)

### 1. Check Recent Deployments
```bash
kubectl get deployments --sort-by=.metadata.creationTimestamp
```
- Was there a recent deployment?
- If yes, consider rollback

### 2. Check Error Logs
```bash
kubectl logs -l app=recordbridge --since=10m | grep ERROR
```
- Look for patterns
- Identify affected components

### 3. Check Database Health
- Connection pool status
- Slow query count
- Replication lag

## Common Causes & Fixes

| Symptom | Likely Cause | Fix |
|---------|--------------|-----|
| DB connection errors | Pool exhausted | Scale DB connections |
| Timeout errors | Slow queries | Kill long queries, optimize |
| 500 errors | Code bug | Rollback deployment |
| Memory errors | OOM | Scale up memory or instances |

## Escalation
- If unresolved in 15 minutes → Escalate to Engineering Lead
- If affecting > 50% of users → Page CTO
```

#### Runbook: Job Processing Backlog

```markdown
# RUNBOOK: Job Queue Backlog

## Alert Details
- **Metric**: jobs.queued
- **Threshold**: > 100 jobs
- **Duration**: > 15 minutes

## Investigation Steps

1. **Check Worker Status**
   ```bash
   kubectl get pods -l app=recordbridge-worker
   ```
   - Are workers running?
   - Any CrashLoopBackOff?

2. **Check Worker Logs**
   ```bash
   kubectl logs -l app=recordbridge-worker --tail=100
   ```
   - Look for processing errors
   - Check for stuck jobs

3. **Check Resource Usage**
   - CPU throttling?
   - Memory pressure?
   - Disk I/O wait?

## Resolution Options

1. **Scale Workers**
   ```bash
   kubectl scale deployment recordbridge-worker --replicas=10
   ```

2. **Clear Stuck Jobs**
   - Identify stuck job IDs
   - Cancel or retry jobs
   - Check for poison pills

3. **Optimize Job Processing**
   - Reduce batch size
   - Increase timeout
   - Check external dependencies
```

---

## Incident Management UI

### 8.11 Incident Dashboard

```
┌─────────────────────────────────────────────────────────────────────────┐
│ Incident Management                                         [+ Create]  │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  Active Incidents                                                       │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │ 🔴 INC-2026-0116-001 - CRITICAL                                 │   │
│  │ High Error Rate - 3.45% (threshold: 1%)                        │   │
│  │ Started: 14:32 WIB | Duration: 12 minutes                      │   │
│  │ Assigned: Ahmad K. | Status: INVESTIGATING                     │   │
│  │ [View Details] [Acknowledge] [Escalate] [Resolve]              │   │
│  ├─────────────────────────────────────────────────────────────────┤   │
│  │ 🟡 INC-2026-0116-002 - MEDIUM                                   │   │
│  │ Job Queue Backlog - 156 queued jobs                            │   │
│  │ Started: 14:15 WIB | Duration: 29 minutes                      │   │
│  │ Assigned: Auto-assigned | Status: AUTO-RECOVERY                │   │
│  │ [View Details] [Acknowledge] [Resolve]                         │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                                                                         │
│  Recent Resolved (Last 24h): 8                                          │
│  Mean Time to Resolution (MTTR): 18 minutes                             │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

### 8.12 Incident Detail View

```
┌─────────────────────────────────────────────────────────────────┐
│ Incident INC-2026-0116-001                          [Update ▼] │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  Status: 🔴 CRITICAL - INVESTIGATING                           │
│  Alert: High Error Rate                                         │
│  Duration: 12 minutes                                           │
│                                                                 │
│  Timeline:                                                      │
│  ├── 14:32:15 - Alert triggered (error.rate: 3.45%)            │
│  ├── 14:32:20 - Page sent to on-call engineer                  │
│  ├── 14:35:00 - Acknowledged by Ahmad K.                       │
│  ├── 14:38:00 - Root cause identified: DB connection pool      │
│  │              exhaustion                                      │
│  └── 14:40:00 - Scaling DB connections...                      │
│                                                                 │
│  Related Metrics:                                               │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │ Error Rate (last 1 hour)                                │   │
│  │                                                         │   │
│  │ 5% ┤                                          ╭──────   │   │
│  │ 4% ┤                                    ╭────╯         │   │
│  │ 3% ┤        ╭──────── Alert ───────────╯               │   │
│  │ 2% ┤  ╭────╯                                         │   │
│  │ 1% ┼──╯ Threshold                                     │   │
│  │ 0% ┤                                                 │   │
│  │    └┬────┬────┬────┬────┬────┬────┬────┬────┬────┬   │   │
│  │    14:00                                              │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
│  Actions Taken:                                                 │
│  [Add Note]  [Link Runbook]  [Attach Logs]  [Escalate]         │
│                                                                 │
│  Notes:                                                         │
│  Ahmad K. (14:35): Acknowledged. Checking application logs.    │
│  Ahmad K. (14:38): Found DB connection pool exhausted.         │
│                   Current connections: 100/100. Scaling up.    │
│                                                                 │
│  [Runbook: High Error Rate]  [View Similar Incidents]          │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## Integration dengan External Tools

### 8.13 PagerDuty Integration

```typescript
interface PagerDutyConfig {
  serviceKey: string;
  severityMapping: {
    CRITICAL: 'critical';
    HIGH: 'error';
    MEDIUM: 'warning';
    LOW: 'info';
  };
  escalationPolicy: string;
  autoResolve: boolean;
}

// Alert → PagerDuty
const pagerDutyPayload = {
  routing_key: config.serviceKey,
  event_action: 'trigger',
  dedup_key: `recordbridge-${alert.ruleId}`,
  payload: {
    summary: alert.name,
    severity: config.severityMapping[alert.severity],
    source: 'recordbridge-monitoring',
    custom_details: {
      metric: alert.condition.metric,
      currentValue: alert.currentValue,
      threshold: alert.condition.threshold,
      runbookUrl: alert.autoActions?.runbookUrl,
    }
  }
};
```

### 8.14 Prometheus/Grafana Integration

```yaml
# Prometheus metrics export
metrics:
  - name: recordbridge_jobs_total
    type: counter
    labels: [job_type, status]
  
  - name: recordbridge_job_duration_seconds
    type: histogram
    labels: [job_type]
    buckets: [0.1, 0.5, 1, 2, 5, 10, 30, 60]
  
  - name: recordbridge_data_quality_score
    type: gauge
    labels: [source_system]
  
  - name: recordbridge_conflicts_total
    type: counter
    labels: [category, resolution_strategy]
```

---

## SLA Monitoring

### 8.15 Service Level Indicators (SLIs)

| SLI | Description | Target |
|-----|-------------|--------|
| **Availability** | Uptime percentage | 99.9% |
| **Latency** | p95 response time | < 500ms |
| **Error Rate** | Failed requests % | < 0.1% |
| **Job Success** | Completed / Total jobs | > 99% |
| **Data Quality** | Valid records / Total | > 95% |

### 8.16 SLA Dashboard

```
┌─────────────────────────────────────────────────────────────────┐
│ SLA Dashboard - January 2026                                    │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  Current Status                                                 │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐ ┌───────────┐ │
│  │ Availability│ │    p95      │ │   Error     │ │   Job     │ │
│  │             │ │   Latency   │ │    Rate     │ │  Success  │ │
│  │   99.95%    │ │   245ms     │ │   0.02%     │ │   99.7%   │ │
│  │   ✓ SLO     │ │   ✓ SLO     │ │   ✓ SLO     │ │   ✓ SLO   │ │
│  └─────────────┘ └─────────────┘ └─────────────┘ └───────────┘ │
│                                                                 │
│  SLO Compliance (Last 30 Days)                                  │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │                                                         │   │
│  │ Availability: 100% ████████████████████████████████ ✓  │   │
│  │ Target: 99.9%                                           │   │
│  │                                                         │   │
│  │ Latency: 98.5% ████████████████████████████████░░░░ ✓  │   │
│  │ Target: 95% of requests < 500ms                         │   │
│  │                                                         │   │
│  │ Error Rate: 99.98% ████████████████████████████████ ✓  │   │
│  │ Target: < 0.1%                                          │   │
│  │                                                         │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
│  Error Budget Burn Rate: 12% (Healthy)                         │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```
