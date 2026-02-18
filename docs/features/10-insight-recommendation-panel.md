# Insight & Recommendation Panel

## Overview
Fitur **Insight Panel** memberikan rekomendasi optimasi pipeline berdasarkan analisis histori penggunaan. Panel ini mengidentifikasi pola—seperti field yang sering gagal validasi, rule yang sering di-bypass, atau inefficiency dalam proses—dan memberikan actionable recommendations untuk meningkatkan kualitas dan efisiensi.

---

## Sumber Data Insight

### 10.1 Data Collection

```typescript
interface InsightDataSources {
  // Operational data
  operations: {
    jobHistory: JobExecution[];        // Success/failure patterns
    processingTimes: TimeSeries[];     // Performance trends
    resourceUsage: ResourceMetrics[];  // Efficiency metrics
  };
  
  // User behavior
  userBehavior: {
    featureUsage: FeatureUsage[];      // Which features are used
    errorPatterns: ErrorPattern[];     // Common mistakes
    workflowPaths: UserJourney[];      // User navigation patterns
    correctionPatterns: Correction[];  // What users frequently fix
  };
  
  // Data quality metrics
  qualityMetrics: {
    validationFailures: ValidationFailure[];
    conflictPatterns: ConflictPattern[];
    mappingAccuracy: MappingAccuracy[];
    exportIssues: ExportIssue[];
  };
  
  // External context
  external: {
    seasonalityPatterns: Seasonality[];
    industryBenchmarks: Benchmark[];
    bestPractices: BestPractice[];
  };
}
```

### 10.2 Insight Categories

```typescript
type InsightCategory = 
  | 'PERFORMANCE'      // Processing speed, resource usage
  | 'QUALITY'          // Data quality issues
  | 'EFFICIENCY'       // Workflow optimization
  | 'CONFIGURATION'    // Setup improvements
  | 'COST'             // Resource cost optimization
  | 'SECURITY'         // Security recommendations
  | 'COMPLIANCE';      // Compliance improvements

type InsightSeverity = 
  | 'CRITICAL'    // Immediate action required
  | 'HIGH'        // Significant impact
  | 'MEDIUM'      // Moderate improvement
  | 'LOW'         // Nice to have
  | 'INFO';       // Informational

interface Insight {
  id: string;
  category: InsightCategory;
  severity: InsightSeverity;
  title: string;
  description: string;
  
  // Evidence
  evidence: {
    metric: string;
    currentValue: number;
    benchmarkValue?: number;
    trend: 'IMPROVING' | 'STABLE' | 'DEGRADING';
    historicalData: TimeSeriesPoint[];
  };
  
  // Recommendation
  recommendation: {
    action: string;
    steps: string[];
    expectedImpact: {
      metric: string;
      improvement: number; // percentage
      confidence: number;  // 0-1
    };
    automatedFixAvailable: boolean;
  };
  
  // Metadata
  createdAt: Date;
  expiresAt: Date;
  acknowledged: boolean;
  dismissed: boolean;
  appliedAt?: Date;
}
```

---

## Desain Komponen

### 10.3 Insight Panel UI

```
┌─────────────────────────────────────────────────────────────────────────┐
│ Insights & Recommendations                                  [⚙️] [?]   │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  Summary                                                                │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │ 🔴 2 Critical  🟡 5 High  🔵 8 Medium  ℹ️ 12 Info  = 27 Total   │   │
│  │                                                                 │   │
│  │  Potential Improvements:                                        │   │
│  │  • Processing time: -32% estimated                              │   │
│  │  • Error rate: -45% estimated                                   │   │
│  │  • Data quality: +18% estimated                                 │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                                                                         │
│  Filter: [All Categories 🔽]  [Severity: All 🔽]  [Sort: Priority 🔽]  │
│                                                                         │
│  🔴 CRITICAL                                                            │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━   │
│                                                                         │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │ ⚠️  Quality Rule Being Bypassed Regularly                       │   │
│  │     Category: QUALITY | Severity: CRITICAL                      │   │
│  │                                                                 │   │
│  │  The "Patient ID Required" rule was bypassed 23 times in the    │   │
│  │  last 7 days, indicating a potential workflow issue.            │   │
│  │                                                                 │   │
│  │  Evidence:                                                      │   │
│  │  • Bypass rate: 12% of exports (benchmark: < 2%)               │   │
│  │  • Affected records: 1,247                                     │   │
│  │  • Users bypassing: 3                                          │   │
│  │                                                                 │   │
│  │  💡 Recommendation:                                             │   │
│  │     Make this field optional OR add auto-generation logic       │   │
│  │                                                                 │   │
│  │  [View Details] [Apply Fix] [Dismiss]                           │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                                                                         │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │ ⚠️  High Failure Rate on Date Parsing                           │   │
│  │     Category: QUALITY | Severity: CRITICAL                      │   │
│  │                                                                 │   │
│  │  Field "tanggal_lahir" fails validation in 34% of records.      │   │
│  │  Common issue: Multiple date formats (DD/MM/YYYY vs YYYY-MM-DD) │   │
│  │                                                                 │   │
│  │  [View Details] [Configure Multi-Format Parser] [Dismiss]       │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                                                                         │
│  🟡 HIGH PRIORITY                                                       │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━   │
│                                                                         │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │ 📈  Unnecessary Transformations Detected                        │   │
│  │     Category: EFFICIENCY | Severity: HIGH                       │   │
│  │                                                                 │   │
│  │  3 transformation steps can be combined into 1, reducing        │   │
│  │  processing time by estimated 15%.                              │   │
│  │                                                                 │   │
│  │  Current: trim() → lowercase() → replace()                     │   │
│  │  Suggested: normalize_string() [single step]                   │   │
│  │                                                                 │   │
│  │  [View Details] [Auto-Optimize] [Dismiss]                       │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                                                                         │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │ 🎯  Underutilized AI Mapping Feature                            │   │
│  │     Category: EFFICIENCY | Severity: HIGH                       │   │
│  │                                                                 │   │
│  │  You're manually mapping 78% of fields. Using AI Mapping        │   │
│  │  could save ~2 hours per week.                                  │   │
│  │                                                                 │   │
│  │  Users like you save 4.5 hours/week on average with AI.        │   │
│  │                                                                 │   │
│  │  [Try AI Mapping] [Learn More] [Dismiss]                        │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                                                                         │
│  [Load More Insights...]                                                │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

### 10.4 Insight Detail Modal

```
┌─────────────────────────────────────────────────────────────────┐
│ Insight Detail: Quality Rule Being Bypassed           [×]       │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  🔴 CRITICAL | Quality | Detected Jan 16, 2026                 │
│                                                                 │
│  Quality Rule "Patient ID Required" is Being Bypassed          │
│  Regularly                                                      │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │ Trend Analysis (Last 30 Days)                           │   │
│  │                                                         │   │
│  │ 30% ┤                   ╭─────                          │   │
│  │ 25% ┤              ╭────╯                               │   │
│  │ 20% ┤         ╭────╯    ━━━ Bypass Rate                 │   │
│  │ 15% ┤    ╭────╯         ─── Benchmark (2%)              │   │
│  │ 10% ┤╭───╯                                             │   │
│  │  5% ┤╯                                                 │   │
│  │  0% ┼────┬────┬────┬────┬────┬────┬────┬────┬────     │   │
│  │     W1   W2   W3   W4   W5                              │   │
│  │                                                         │   │
│  │ Current: 12% | Trend: ↑ Worsening                      │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
│  Impact Analysis:                                               │
│  • Records exported without Patient ID: 1,247                  │
│  • Compliance risk: HIGH (HIPAA requires patient identification)│
│  • Data quality impact: Cannot link records across sources     │
│                                                                 │
│  Root Cause Analysis:                                           │
│  1. Source system SIMRS_B doesn't always provide patient_id    │
│  2. Users bypass to meet export deadlines                      │
│  3. No alternative field configured                            │
│                                                                 │
│  Recommended Solutions:                                         │
│                                                                 │
│  Option 1: Configure Alternative Identifier (Recommended)      │
│  ├─ Use "no_rm" from SIMRS_B when "patient_id" is missing      │
│  ├─ Auto-populate from patient lookup table                    │
│  └─ Impact: Eliminates 95% of bypasses                         │
│     [Apply This Solution]                                       │
│                                                                 │
│  Option 2: Make Field Optional with Warning                    │
│  ├─ Downgrade to HIGH severity instead of CRITICAL             │
│  ├─ Require justification for missing IDs                      │
│  └─ Impact: Maintains data quality tracking                    │
│     [Apply This Solution]                                       │
│                                                                 │
│  Option 3: Add Auto-Generation                                 │
│  ├─ Generate temporary ID for records without patient_id       │
│  ├─ Flag for manual review                                     │
│  └─ Impact: Ensures all records have identifier                │
│     [Apply This Solution]                                       │
│                                                                 │
│  [Dismiss This Insight]  [Remind Me Later]                      │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## Alur Tindakan (Action Flow)

### 10.5 Action Types

```typescript
interface InsightAction {
  type: 
    | 'AUTO_FIX'           // One-click automated fix
    | 'GUIDED_FIX'         // Step-by-step wizard
    | 'CONFIG_CHANGE'      // Direct configuration update
    | 'LEARN_MORE'         // Documentation/tutorial
    | 'CONTACT_SUPPORT'    // Escalate to support
    | 'SCHEDULE_TASK'      // Create reminder/task
    | 'SHARE'              // Share with team
    | 'IGNORE';            // Dismiss permanently
  
  // Execution
  execute: () => Promise<ActionResult>;
  
  // Rollback
  canRollback: boolean;
  rollback?: () => Promise<void>;
  
  // Confirmation
  requiresConfirmation: boolean;
  confirmationMessage?: string;
}

// Example actions
const INSIGHT_ACTIONS: Record<string, InsightAction> = {
  'combine-transformations': {
    type: 'AUTO_FIX',
    execute: async () => {
      // Automatically combine transformation steps
      const optimized = await optimizeTransformations();
      return { success: true, changes: optimized };
    },
    canRollback: true,
    rollback: async () => {
      await revertTransformationOptimization();
    },
    requiresConfirmation: true,
    confirmationMessage: 'This will modify your transformation pipeline. Continue?'
  },
  
  'enable-ai-mapping': {
    type: 'CONFIG_CHANGE',
    execute: async () => {
      await enableFeature('ai_mapping_suggestions');
      return { success: true };
    },
    canRollback: true,
    rollback: async () => {
      await disableFeature('ai_mapping_suggestions');
    },
    requiresConfirmation: false
  }
};
```

### 10.6 Action Execution Flow

```
┌─────────────────────────────────────────────────────────────────────┐
│              INSIGHT ACTION FLOW                                    │
└─────────────────────────────────────────────────────────────────────┘

USER SELECTS ACTION
┌─────────────────┐
│ User clicks     │
│ action button   │
│ on insight      │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Requires        │
│ Confirmation?   │
└────────┬────────┘
         │
    ┌────┴────┐
    ▼         ▼
   YES        NO
    │          │
    ▼          │
┌────────┐     │
│ Show   │     │
│Confirm │     │
│Dialog  │     │
└───┬────┘     │
    │          │
    ▼          ▼
┌─────────────────┐
│ User confirms?  │
└────────┬────────┘
         │
    ┌────┴────┐
    ▼         ▼
   YES        NO
    │          │
    ▼          ▼
┌────────┐ ┌────────┐
│Execute │ │ Cancel │
│Action  │ │ Action │
└───┬────┘ └────────┘
    │
    ▼
┌─────────────────┐
│ Execute with    │
│ rollback token  │
│ (if supported)  │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Success?        │
└────────┬────────┘
         │
    ┌────┴────┐
    ▼         ▼
   YES        NO
    │          │
    ▼          ▼
┌────────┐ ┌────────┐
│ Show   │ │ Show   │
│Success │ │ Error  │
│Message │ │Message │
│+ Undo   │ │+ Retry  │
└───┬────┘ └────┬───┘
    │             │
    └──────┬──────┘
           │
           ▼
    ┌──────────────┐
    │ Track in     │
    │ Analytics    │
    └──────────────┘
```

---

## Pattern Detection

### 10.7 ML-Based Pattern Detection

```typescript
interface PatternDetector {
  // Anomaly detection
  detectAnomalies: (metrics: MetricSeries) => Anomaly[];
  
  // Trend analysis
  analyzeTrends: (historical: TimeSeriesData) => Trend[];
  
  // Correlation discovery
  findCorrelations: (variables: Variable[]) => Correlation[];
  
  // Prediction
  predictIssues: (currentState: SystemState) => PredictedIssue[];
}

// Detected patterns
const DETECTED_PATTERNS = {
  // Performance patterns
  'slow_processing': {
    description: 'Processing time increasing over time',
    detection: 'trend_analysis',
    threshold: 'p95 latency > 2x baseline',
    severity: 'HIGH'
  },
  
  // Quality patterns  
  'declining_quality': {
    description: 'Data quality score declining',
    detection: 'anomaly_detection',
    threshold: 'quality score < 90% for 3+ days',
    severity: 'CRITICAL'
  },
  
  // Usage patterns
  'feature_underutilized': {
    description: 'Power feature not being used',
    detection: 'usage_analysis',
    threshold: '< 20% adoption vs peer group',
    severity: 'MEDIUM'
  },
  
  // Error patterns
  'repeated_errors': {
    description: 'Same error occurring frequently',
    detection: 'frequency_analysis',
    threshold: '> 10 occurrences per day',
    severity: 'HIGH'
  },
  
  // Efficiency patterns
  'manual_work_detected': {
    description: 'User performing manual steps that could be automated',
    detection: 'behavior_analysis',
    threshold: 'repeated manual corrections > 5x',
    severity: 'MEDIUM'
  }
};
```

### 10.8 Benchmark Comparison

```typescript
interface BenchmarkComparison {
  user: {
    metric: string;
    value: number;
    percentile: number; // vs peer group
  };
  
  peerGroup: {
    name: string;
    similarUsers: number;
    p50: number;
    p75: number;
    p90: number;
  };
  
  industry: {
    name: string;
    p50: number;
    p90: number;
  };
  
  recommendation: string;
}

// Example benchmark insight
const benchmarkExample: BenchmarkComparison = {
  user: {
    metric: 'avg_mapping_time_per_field',
    value: 45, // seconds
    percentile: 25 // Bottom 25% = slower than 75% of peers
  },
  peerGroup: {
    name: 'Healthcare Data Integrators',
    similarUsers: 1250,
    p50: 25,
    p75: 35,
    p90: 50
  },
  industry: {
    name: 'Healthcare Technology',
    p50: 30,
    p90: 60
  },
  recommendation: 'Your mapping time is slower than 75% of similar users. Try AI Mapping Assistant to reduce time by ~60%.'
};
```

---

## Recommendation Engine

### 10.9 Recommendation Scoring

```typescript
interface RecommendationScore {
  insightId: string;
  
  // Impact score
  impact: {
    value: number; // 0-100
    factors: {
      timeSaved: number; // hours/month
      qualityImprovement: number; // percentage
      costReduction: number; // currency
      riskMitigation: number; // 0-100
    };
  };
  
  // Effort score
  effort: {
    value: number; // 0-100 (lower = easier)
    factors: {
      implementationTime: number; // minutes
      complexity: 'LOW' | 'MEDIUM' | 'HIGH';
      requiresTraining: boolean;
      disruption: 'NONE' | 'MINIMAL' | 'MODERATE' | 'SIGNIFICANT';
    };
  };
  
  // Confidence score
  confidence: number; // 0-1
  
  // Priority score (calculated)
  priorityScore: number; // impact / effort * confidence
  
  // Urgency
  urgency: 'IMMEDIATE' | 'THIS_WEEK' | 'THIS_MONTH' | 'BACKLOG';
}

// Priority calculation
function calculatePriority(impact: number, effort: number, confidence: number): number {
  return (impact / (effort || 1)) * confidence;
}
```

### 10.10 Personalized Recommendations

```typescript
interface PersonalizationContext {
  user: {
    role: string;
    experience: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';
    goals: string[];
    painPoints: string[];
  };
  
  organization: {
    size: string;
    industry: string;
    compliance: string[];
    techStack: string[];
  };
  
  currentContext: {
    activeProject?: string;
    recentActions: string[];
    currentPage: string;
    timeOfDay: string;
  };
}

// Personalization rules
const PERSONALIZATION_RULES = [
  {
    condition: { user: { experience: 'BEGINNER' } },
    filter: { excludeCategories: ['ADVANCED_OPTIMIZATION'] },
    priority: { boostCategories: ['EFFICIENCY', 'LEARNING'] }
  },
  {
    condition: { currentContext: { currentPage: '/mapping' } },
    filter: { includeCategories: ['CONFIGURATION', 'EFFICIENCY'] },
    priority: { boost: 1.5 }
  },
  {
    condition: { user: { role: 'ADMIN' } },
    filter: { includeCategories: ['SECURITY', 'COMPLIANCE', 'COST'] }
  }
];
```

---

## Analytics & Reporting

### 10.11 Insight Analytics

```
┌─────────────────────────────────────────────────────────────────┐
│ Insights Analytics                                              │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  Insight Performance (Last 30 Days)                             │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │                                                         │   │
│  │  Total Insights Generated: 156                          │   │
│  │  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │   │
│  │                                                         │   │
│  │  By Category:                                           │   │
│  │  Quality       ████████████████████████████████  45%   │   │
│  │  Efficiency    ██████████████████████████        35%   │   │
│  │  Performance   ████████████                      15%   │   │
│  │  Security      ███                                5%   │   │
│  │                                                         │   │
│  │  User Engagement:                                       │   │
│  │  • Viewed: 142 (91%)                                   │   │
│  │  • Acknowledged: 98 (63%)                              │   │
│  │  • Actions Applied: 67 (43%)                           │   │
│  │  • Dismissed: 34 (22%)                                 │   │
│  │                                                         │   │
│  │  Most Impactful Actions:                                │   │
│  │  1. Enable AI Mapping → Saved 4.5 hrs/user/week        │   │
│  │  2. Combine Transformations → 23% faster processing    │   │
│  │  3. Fix Date Parsing → 89% fewer validation errors     │   │
│  │                                                         │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
│  Top Recommendations by Impact                                  │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │ 1. Quality Rule Bypass Detection        Impact: HIGH    │   │
│  │    Applied by 78% of users who received it             │   │
│  │                                                         │   │
│  │ 2. AI Mapping Adoption                  Impact: HIGH    │   │
│  │    Saved average 3.2 hours/week per user               │   │
│  │                                                         │   │
│  │ 3. Transformation Optimization          Impact: MEDIUM  │   │
│  │    Reduced processing time by 15-30%                   │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## Integration Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│ Insight Engine Architecture                                     │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │                DATA COLLECTION LAYER                    │   │
│  │  ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐       │   │
│  │  │ Job     │ │ User    │ │ Quality │ │ System  │       │   │
│  │  │ Events  │ │ Events  │ │ Metrics │ │ Metrics │       │   │
│  │  └────┬────┘ └────┬────┘ └────┬────┘ └────┬────┘       │   │
│  │       └───────────┴───────────┴───────────┘             │   │
│  │                   │                                      │   │
│  │                   ▼                                      │   │
│  │            ┌─────────────┐                               │   │
│  │            │ Event Store │                               │   │
│  │            │  (Kafka)    │                               │   │
│  │            └──────┬──────┘                               │   │
│  └───────────────────┼─────────────────────────────────────┘   │
│                      │                                          │
│                      ▼                                          │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │              ANALYSIS ENGINE                            │   │
│  │  ┌─────────────┐ ┌─────────────┐ ┌─────────────────┐   │   │
│  │  │  Pattern    │ │  Anomaly    │ │  Benchmark      │   │   │
│  │  │  Detection  │ │  Detection  │ │  Comparison     │   │   │
│  │  │  (Rules)    │ │  (ML)       │ │  (Stats)        │   │   │
│  │  └──────┬──────┘ └──────┬──────┘ └────────┬────────┘   │   │
│  │         └───────────────┼─────────────────┘             │   │
│  │                         ▼                               │   │
│  │              ┌─────────────────────┐                    │   │
│  │              │   Insight Generator │                    │   │
│  │              └──────────┬──────────┘                    │   │
│  └─────────────────────────┼───────────────────────────────┘   │
│                            │                                    │
│                            ▼                                    │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │              RECOMMENDATION ENGINE                      │   │
│  │  ┌─────────────┐ ┌─────────────┐ ┌─────────────────┐   │   │
│  │  │  Scoring    │ │Personalization│ │  Action        │   │   │
│  │  │  Engine     │ │   Engine      │ │  Recommender   │   │   │
│  │  └─────────────┘ └─────────────┘ └─────────────────┘   │   │
│  │                      │                                   │   │
│  │                      ▼                                   │   │
│  │              ┌─────────────────────┐                    │   │
│  │              │   Insight Store     │                    │   │
│  │              │   (PostgreSQL)      │                    │   │
│  │              └──────────┬──────────┘                    │   │
│  └─────────────────────────┼───────────────────────────────┘   │
│                            │                                    │
│                            ▼                                    │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │              PRESENTATION LAYER                         │   │
│  │  ┌─────────────┐ ┌─────────────┐ ┌─────────────────┐   │   │
│  │  │  Insight    │ │  Action     │ │  Analytics      │   │   │
│  │  │  Panel UI   │ │  Handlers   │ │  Dashboard      │   │   │
│  │  └─────────────┘ └─────────────┘ └─────────────────┘   │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```
