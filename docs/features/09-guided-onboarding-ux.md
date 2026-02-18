# Guided Onboarding UX

## Overview
Fitur **Guided Onboarding** dirancang untuk membantu pengguna baru mencapai "First Success" dalam waktu singkat—melakukan import, mapping, dan export data tanpa bantuan tim support. Onboarding ini menggabungkan checklist interaktif, sample project, tooltips kontekstual, dan milestone tracking untuk pengalaman yang seamless.

---

## Checklist Setup

### 9.1 Onboarding Checklist

```typescript
interface OnboardingChecklist {
  userId: string;
  startedAt: Date;
  completedAt?: Date;
  
  milestones: Array<{
    id: string;
    title: string;
    description: string;
    order: number;
    
    // Completion criteria
    criteria: {
      event: string;
      condition?: Record<string, any>;
    };
    
    // Status
    status: 'LOCKED' | 'AVAILABLE' | 'IN_PROGRESS' | 'COMPLETED';
    completedAt?: Date;
    
    // Rewards
    reward?: {
      type: 'BADGE' | 'FEATURE_UNLOCK' | 'TEMPLATE_ACCESS';
      value: string;
    };
    
    // Help resources
    helpResources: Array<{
      type: 'VIDEO' | 'ARTICLE' | 'TOOLTIP' | 'INTERACTIVE_GUIDE';
      title: string;
      url: string;
    }>;
  }>;
}

// Default checklist untuk pengguna baru
const DEFAULT_CHECKLIST: OnboardingChecklist['milestones'] = [
  {
    id: 'profile_setup',
    title: 'Lengkapi Profil Anda',
    description: 'Isi informasi dasar untuk personalisasi pengalaman',
    order: 1,
    criteria: { event: 'PROFILE_COMPLETED' },
    status: 'AVAILABLE',
    helpResources: [
      { type: 'VIDEO', title: 'Mengatur Profil', url: '/help/profile-setup' }
    ]
  },
  {
    id: 'first_import',
    title: 'Upload Data Pertama',
    description: 'Import file CSV, JSON, atau Excel Anda',
    order: 2,
    criteria: { event: 'FILE_IMPORTED' },
    status: 'LOCKED',
    reward: { type: 'BADGE', value: 'first_import' },
    helpResources: [
      { type: 'INTERACTIVE_GUIDE', title: 'Smart Import Wizard', url: '/guide/import' },
      { type: 'ARTICLE', title: 'Format File yang Didukung', url: '/help/file-formats' }
    ]
  },
  {
    id: 'ai_mapping',
    title: 'Coba AI Mapping',
    description: 'Biarkan AI membantu memetakan field data Anda',
    order: 3,
    criteria: { event: 'AI_MAPPING_USED' },
    status: 'LOCKED',
    helpResources: [
      { type: 'VIDEO', title: 'Cara Kerja AI Mapping', url: '/help/ai-mapping' }
    ]
  },
  {
    id: 'review_mappings',
    title: 'Review dan Sesuaikan Mapping',
    description: 'Periksa hasil mapping dan lakukan penyesuaian jika perlu',
    order: 4,
    criteria: { event: 'MAPPING_REVIEWED' },
    status: 'LOCKED',
    helpResources: [
      { type: 'ARTICLE', title: 'Best Practices Mapping', url: '/help/mapping-guide' }
    ]
  },
  {
    id: 'quality_check',
    title: 'Jalankan Quality Check',
    description: 'Validasi kualitas data sebelum export',
    order: 5,
    criteria: { event: 'QUALITY_CHECK_RUN' },
    status: 'LOCKED',
    helpResources: [
      { type: 'ARTICLE', title: 'Memahami Quality Gate', url: '/help/quality-gate' }
    ]
  },
  {
    id: 'resolve_conflict',
    title: 'Selesaikan Konflik (jika ada)',
    description: 'Pelajari cara menangani data konflik dari multiple sources',
    order: 6,
    criteria: { event: 'CONFLICT_RESOLVED', condition: { optional: true } },
    status: 'LOCKED',
    helpResources: [
      { type: 'VIDEO', title: 'Conflict Resolution', url: '/help/conflicts' }
    ]
  },
  {
    id: 'first_export',
    title: 'Export Data Anda',
    description: 'Generate dan download hasil transformasi',
    order: 7,
    criteria: { event: 'DATA_EXPORTED' },
    status: 'LOCKED',
    reward: { type: 'BADGE', value: 'export_master' },
    helpResources: [
      { type: 'ARTICLE', title: 'Format Export', url: '/help/export-formats' }
    ]
  },
  {
    id: 'save_template',
    title: 'Simpan sebagai Template',
    description: 'Simpan konfigurasi untuk penggunaan berikutnya',
    order: 8,
    criteria: { event: 'TEMPLATE_SAVED' },
    status: 'LOCKED',
    reward: { type: 'FEATURE_UNLOCK', value: 'advanced_templates' },
    helpResources: [
      { type: 'VIDEO', title: 'Template Management', url: '/help/templates' }
    ]
  }
];
```

### 9.2 Checklist UI

```
┌─────────────────────────────────────────────────────────────────┐
│ 🎯 Welcome to RecordBridge!                                     │
│ Complete these steps to master data integration                 │
│                                    [Skip Onboarding] [? Help]   │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  Progress: 3 of 8 completed (37%)                               │
│  ████████████████████░░░░░░░░░░░░░░                             │
│                                                                 │
│  ✅ Lengkapi Profil Anda                                        │
│     Completed on Jan 16, 2026                                  │
│     [View Profile]                                              │
│                                                                 │
│  ✅ Upload Data Pertama                                         │
│     Completed on Jan 16, 2026                                  │
│     🏆 Badge earned: First Import!                             │
│     [View Import]                                               │
│                                                                 │
│  ✅ Coba AI Mapping                                             │
│     Completed on Jan 16, 2026                                  │
│     [View Mappings]                                             │
│                                                                 │
│  ⏳ Review dan Sesuaikan Mapping  ◄── Current Step              │
│     [Continue]  [Learn More]                                    │
│     💡 Tip: AI telah memetakan 15 field dengan confidence 85%  │
│                                                                 │
│  🔒 Jalankan Quality Check                                      │
│     Complete previous step to unlock                           │
│                                                                 │
│  🔒 Selesaikan Konflik (jika ada)                               │
│     Optional - only if conflicts detected                      │
│                                                                 │
│  🔒 Export Data Anda                                            │
│                                                                 │
│  🔒 Simpan sebagai Template                                     │
│     Unlock: Advanced template features!                        │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## Sample Project

### 9.3 Sample Data & Project

```typescript
interface SampleProject {
  id: string;
  name: string;
  description: string;
  difficulty: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';
  estimatedTime: number; // minutes
  
  // Sample data files
  dataFiles: Array<{
    name: string;
    format: 'csv' | 'json' | 'excel';
    size: string;
    recordCount: number;
    downloadUrl: string;
    preview: any[];
  }>;
  
  // Pre-configured solution
  solution: {
    importConfig: ImportConfig;
    mappings: FieldMapping[];
    qualityRules: string[];
    expectedExport: ExportFormat;
  };
  
  // Learning objectives
  objectives: string[];
  
  // Guided steps
  guidedSteps: Array<{
    title: string;
    instruction: string;
    targetElement?: string; // CSS selector for highlight
    action?: string; // Expected user action
  }>;
}

// Sample: Hospital Patient Data Integration
const SAMPLE_HOSPITAL_PROJECT: SampleProject = {
  id: 'hospital-beginner',
  name: 'Integrasi Data Pasien RS',
  description: 'Pelajari cara mengintegrasikan data pasien dari 3 sumber berbeda',
  difficulty: 'BEGINNER',
  estimatedTime: 15,
  
  dataFiles: [
    {
      name: 'ehr_a_patients.csv',
      format: 'csv',
      size: '12 KB',
      recordCount: 50,
      preview: [
        { patient_id: 'P001', name: 'Budi Santoso', bp: '120/80', ... },
        { patient_id: 'P002', name: 'Ani Wijaya', bp: '130/85', ... }
      ]
    },
    {
      name: 'simrs_b_patients.json',
      format: 'json',
      size: '18 KB',
      recordCount: 50,
      preview: [
        { no_rm: 'P001', nama: 'Budi Santoso', tensi: { sys: 118, dia: 82 }, ... },
        { no_rm: 'P002', nama: 'Ani Wijaya', tensi: { sys: 128, dia: 84 }, ... }
      ]
    },
    {
      name: 'clinic_c_patients.xlsx',
      format: 'excel',
      size: '15 KB',
      recordCount: 50
    }
  ],
  
  objectives: [
    'Memahami Smart Import Wizard',
    'Menggunakan AI Mapping Assistant',
    'Menyelesaikan konflik data',
    'Menjalankan Quality Gate',
    'Mengekspor data terintegrasi'
  ],
  
  guidedSteps: [
    {
      title: 'Step 1: Import Data',
      instruction: 'Upload file ehr_a_patients.csv. Sistem akan otomatis mendeteksi format dan struktur data.',
      targetElement: '[data-testid="upload-zone"]',
      action: 'FILE_UPLOAD'
    },
    {
      title: 'Step 2: Lihat Preview',
      instruction: 'Periksa hasil parsing dan konfirmasi struktur data sudah benar.',
      targetElement: '[data-testid="preview-table"]',
      action: 'CONFIRM_PREVIEW'
    },
    {
      title: 'Step 3: AI Mapping',
      instruction: 'Klik "Generate AI Suggestions" untuk melihat pemetaan field otomatis.',
      targetElement: '[data-testid="ai-suggest-btn"]',
      action: 'CLICK_AI_SUGGEST'
    },
    // ... more steps
  ]
};
```

### 9.4 Sample Project Selector

```
┌─────────────────────────────────────────────────────────────────┐
│ 🎓 Choose a Sample Project                                      │
│ Learn by doing with guided examples                             │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │ 🏥 Hospital Patient Data Integration                     │   │
│  │ BEGINNER • 15 minutes • 50 records                       │   │
│  │                                                         │   │
│  │ Learn to integrate patient data from 3 different EHR   │   │
│  │ systems. Covers: import, mapping, conflict resolution. │   │
│  │                                                         │   │
│  │ You'll learn:                                           │   │
│  │ • CSV/JSON/Excel import                                │   │
│  │ • AI field mapping                                     │   │
│  │ • Conflict resolution                                  │   │
│  │ • Quality validation                                   │   │
│  │ • FHIR export                                          │   │
│  │                                                         │   │
│  │ [Start Project]  [Preview Data]                         │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │ 🧪 Laboratory Results Standardization                    │   │
│  │ INTERMEDIATE • 25 minutes • 200 records                  │   │
│  │                                                         │   │
│  │ Standardize lab results with LOINC codes and unit      │   │
│  │ conversion. Covers: advanced mapping, code systems.    │   │
│  │                                                         │   │
│  │ [Start Project]  [Preview Data]                         │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │ 🏭 Multi-facility Supply Chain Integration               │   │
│  │ ADVANCED • 45 minutes • 1000 records                     │   │
│  │                                                         │   │
│  │ Complex multi-source integration with transformation   │   │
│  │ rules and custom quality gates.                        │   │
│  │                                                         │   │
│  │ [Start Project]  [Preview Data]                         │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## Tooltip Interaktif

### 9.5 Contextual Tooltips

```typescript
interface TooltipConfig {
  id: string;
  target: string; // CSS selector or element ID
  
  content: {
    title: string;
    description: string;
    media?: {
      type: 'IMAGE' | 'VIDEO' | 'GIF';
      url: string;
    };
    tip?: string;
    shortcut?: string;
  };
  
  trigger: 'HOVER' | 'CLICK' | 'FOCUS' | 'AUTO';
  position: 'TOP' | 'BOTTOM' | 'LEFT' | 'RIGHT';
  
  // Display rules
  showCondition?: {
    page?: string;
    userRole?: string[];
    featureFlag?: string;
    minVisits?: number;
  };
  
  // Progression
  dismissible: boolean;
  showCount: number; // How many times to show
  priority: number;
}

const ONBOARDING_TOOLTIPS: TooltipConfig[] = [
  {
    id: 'welcome-tooltip',
    target: 'body',
    content: {
      title: 'Welcome to RecordBridge! 👋',
      description: 'Transform and integrate your healthcare data with AI-powered tools.',
      tip: 'Click "Start Tutorial" for a guided walkthrough.'
    },
    trigger: 'AUTO',
    position: 'BOTTOM',
    showCount: 1,
    priority: 100
  },
  {
    id: 'upload-tooltip',
    target: '[data-testid="upload-zone"]',
    content: {
      title: 'Smart Import',
      description: 'Drag & drop files here or click to browse. We support CSV, JSON, and Excel.',
      tip: 'Try our sample data if you don\'t have files ready.',
      shortcut: 'Ctrl+U'
    },
    trigger: 'HOVER',
    position: 'BOTTOM',
    showCondition: { page: '/import' }
  },
  {
    id: 'ai-mapping-tooltip',
    target: '[data-testid="ai-suggest-btn"]',
    content: {
      title: 'AI Mapping Assistant 🤖',
      description: 'Our AI analyzes your data structure and suggests optimal field mappings.',
      tip: 'Higher confidence scores mean more reliable mappings.',
      media: { type: 'GIF', url: '/help/ai-mapping-demo.gif' }
    },
    trigger: 'CLICK',
    position: 'RIGHT',
    showCondition: { page: '/mapping' }
  },
  {
    id: 'conflict-tooltip',
    target: '[data-testid="conflict-badge"]',
    content: {
      title: 'Data Conflict Detected ⚠️',
      description: 'Multiple sources have different values for the same field.',
      tip: 'Click to review side-by-side comparison and resolve.'
    },
    trigger: 'HOVER',
    position: 'LEFT',
    dismissible: false
  }
];
```

### 9.6 Tooltip UI Components

```
┌─────────────────────────────────────────────────────────────────┐
│ Hover Tooltip                                                   │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  Smart Import                                           │   │
│  │  Drag & drop files here or click to browse.             │   │
│  │  We support CSV, JSON, and Excel.                       │   │
│  │                                                         │   │
│  │  💡 Tip: Try our sample data if you don't have files    │   │
│  │          ready.                                         │   │
│  │                                                         │   │
│  │  ⌨️ Shortcut: Ctrl+U                                    │   │
│  └─────────────────────────────────────────────────────────┘   │
│                              ▲                                  │
│                    ┌─────────┴─────────┐                       │
│                    │   [Upload Zone]   │                       │
│                    └───────────────────┘                       │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│ Interactive Walkthrough Tooltip                                 │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  Step 3 of 8                                            │   │
│  │  ━━━━━━━━━━░░░░░░░░                                     │   │
│  │                                                         │   │
│  │  🤖 AI Mapping Assistant                                │   │
│  │                                                         │   │
│  │  Our AI analyzes your data structure and suggests       │   │
│  │  optimal field mappings automatically.                  │   │
│  │                                                         │   │
│  │  [🎬 Watch Demo]                                        │   │
│  │                                                         │   │
│  │  💡 Tip: Higher confidence scores (green badges) mean   │   │
│  │          more reliable mappings.                        │   │
│  │                                                         │   │
│  │  [◀ Back]  [Next ▶]  [Skip Tour]                        │   │
│  └─────────────────────────────────────────────────────────┘   │
│                    ▲                                            │
│         ┌─────────┴─────────┐                                  │
│         │ [Generate AI      │                                  │
│         │  Suggestions]     │                                  │
│         └───────────────────┘                                  │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## Progress Milestone

### 9.7 Milestone Tracking

```typescript
interface MilestoneSystem {
  levels: Array<{
    level: number;
    name: string;
    minPoints: number;
    maxPoints: number;
    icon: string;
    color: string;
  }>;
  
  achievements: Array<{
    id: string;
    name: string;
    description: string;
    icon: string;
    points: number;
    criteria: {
      event: string;
      count?: number;
      condition?: Record<string, any>;
    };
    rarity: 'COMMON' | 'RARE' | 'EPIC' | 'LEGENDARY';
  }>;
}

const MILESTONE_CONFIG: MilestoneSystem = {
  levels: [
    { level: 1, name: 'Data Novice', minPoints: 0, maxPoints: 100, icon: '🌱', color: '#84CC16' },
    { level: 2, name: 'Data Explorer', minPoints: 100, maxPoints: 300, icon: '🔍', color: '#3B82F6' },
    { level: 3, name: 'Mapping Specialist', minPoints: 300, maxPoints: 600, icon: '🗺️', color: '#8B5CF6' },
    { level: 4, name: 'Integration Expert', minPoints: 600, maxPoints: 1000, icon: '⚡', color: '#F59E0B' },
    { level: 5, name: 'Data Master', minPoints: 1000, maxPoints: 999999, icon: '👑', color: '#EC4899' }
  ],
  
  achievements: [
    {
      id: 'first_import',
      name: 'First Steps',
      description: 'Complete your first data import',
      icon: '📥',
      points: 10,
      criteria: { event: 'FILE_IMPORTED' },
      rarity: 'COMMON'
    },
    {
      id: 'mapping_master',
      name: 'Mapping Master',
      description: 'Map 100 fields using AI suggestions',
      icon: '🤖',
      points: 50,
      criteria: { event: 'AI_MAPPING_USED', count: 100 },
      rarity: 'RARE'
    },
    {
      id: 'conflict_resolver',
      name: 'Peacekeeper',
      description: 'Resolve 50 data conflicts',
      icon: '⚖️',
      points: 100,
      criteria: { event: 'CONFLICT_RESOLVED', count: 50 },
      rarity: 'RARE'
    },
    {
      id: 'quality_perfect',
      name: 'Perfect Score',
      description: 'Achieve 100% quality score on an export',
      icon: '✨',
      points: 200,
      criteria: { event: 'DATA_EXPORTED', condition: { qualityScore: 1.0 } },
      rarity: 'EPIC'
    },
    {
      id: 'power_user',
      name: 'Power User',
      description: 'Use RecordBridge for 30 consecutive days',
      icon: '🔥',
      points: 500,
      criteria: { event: 'DAILY_LOGIN', count: 30 },
      rarity: 'LEGENDARY'
    }
  ]
};
```

### 9.8 Progress Dashboard

```
┌─────────────────────────────────────────────────────────────────┐
│ Your Progress                                                   │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  Level 2: Data Explorer 🔍                                      │
│  245 / 300 XP (55 XP to next level)                            │
│  ██████████████████████████████░░░░░░░░░░░░░░░░ 82%            │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │ Recent Achievements                                     │   │
│  ├─────────────────────────────────────────────────────────┤   │
│  │                                                         │   │
│  │  📥 First Steps                        +10 XP          │   │
│  │  Complete your first data import                       │   │
│  │  Earned: Jan 16, 2026                                  │   │
│  │                                                         │   │
│  │  🤖 AI Helper                          +25 XP          │   │
│  │  Accept 10 AI mapping suggestions                      │   │
│  │  Earned: Jan 16, 2026                                  │   │
│  │                                                         │   │
│  │  📊 Quality First                      +20 XP          │   │
│  │  Run your first quality check                          │   │
│  │  Earned: Jan 16, 2026                                  │   │
│  │                                                         │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
│  Next Achievements:                                             │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │ ⚖️ Peacekeeper (20 more conflicts)                     │   │
│  │    Progress: 30/50 █████████████████░░░░░░░░░░         │   │
│  │                                                         │   │
│  │ ✨ Perfect Score (0/1)                                  │   │
│  │    Export with 100% quality score                      │   │
│  │                                                         │   │
│  │ 🗺️ Mapping Master (45 more fields)                     │   │
│  │    Progress: 55/100 ██████████████░░░░░░░░░░░░░░       │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
│  [View All Achievements]  [Share Progress]                      │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## Alur Onboarding Hari Pertama

### 9.9 First Day Success Journey

```
┌─────────────────────────────────────────────────────────────────────┐
│         FIRST DAY SUCCESS JOURNEY                                   │
│         Goal: Complete Import → Mapping → Export                    │
└─────────────────────────────────────────────────────────────────────┘

MINUTE 0-2: WELCOME
┌─────────────────┐
│ 1. Welcome      │
│    Screen       │
│                 │
│ • Product       │
│   overview      │
│ • Value prop    │
│ • Quick tour    │
│   option        │
└────────┬────────┘
         │
         ▼
MINUTE 2-5: SETUP
┌─────────────────┐
│ 2. Quick Setup  │
│                 │
│ • Profile       │
│   (optional)    │
│ • Preferences   │
│ • Sample data   │
│   offer         │
└────────┬────────┘
         │
         ▼
MINUTE 5-10: FIRST IMPORT
┌─────────────────────────────┐
│ 3. Smart Import             │
│    (Guided)                 │
│                             │
│ • Upload sample file       │
│ • Auto-detection demo      │
│ • Preview explanation      │
│ • 🎉 Celebrate first step! │
└────────┬────────────────────┘
         │
         ▼
MINUTE 10-15: AI MAPPING
┌─────────────────────────────┐
│ 4. AI Mapping               │
│    (Interactive)            │
│                             │
│ • Generate suggestions     │
│ • Explain confidence       │
│ • Review & adjust          │
│ • 🎉 Celebrate!            │
└────────┬────────────────────┘
         │
         ▼
MINUTE 15-20: QUALITY CHECK
┌─────────────────────────────┐
│ 5. Quality Gate             │
│                             │
│ • Run validation           │
│ • Explain results          │
│ • Fix issues (if any)      │
│ • 🎉 Celebrate!            │
└────────┬────────────────────┘
         │
         ▼
MINUTE 20-25: EXPORT
┌─────────────────────────────┐
│ 6. Export                   │
│                             │
│ • Choose format            │
│ • Generate export          │
│ • Download file            │
│ • 🎉 FIRST SUCCESS!        │
└────────┬────────────────────┘
         │
         ▼
MINUTE 25-30: NEXT STEPS
┌─────────────────────────────┐
│ 7. Completion               │
│                             │
│ • Summary of achievement   │
│ • Badges earned            │
│ • Advanced features        │
│   preview                  │
│ • Support resources        │
└─────────────────────────────┘

Total Time: ~30 minutes
Success Rate Target: > 80%
```

---

## Smart Assistance

### 9.10 Contextual Help System

```typescript
interface SmartAssistance {
  // Detect when user is stuck
  detectStuckUser: (session: UserSession) => {
    isStuck: boolean;
    reason: 'TIME_ON_PAGE' | 'REPEATED_ERRORS' | 'NO_PROGRESS' | 'IDLE';
    suggestedAction: string;
  };
  
  // Proactive help
  proactiveHelp: Array<{
    trigger: {
      event?: string;
      timeOnPage?: number;
      errorCount?: number;
    };
    action: 'SHOW_TOOLTIP' | 'OFFER_CHAT' | 'SUGGEST_VIDEO' | 'OFFER_SAMPLE';
    content: string;
  }>;
  
  // In-app chat
  chatSupport: {
    botEnabled: boolean;
    handoffThreshold: number; // Confidence score to handoff to human
    suggestedResponses: string[];
  };
}

const PROACTIVE_HELP_TRIGGERS = [
  {
    trigger: { timeOnPage: 120, page: '/import' }, // 2 minutes
    action: 'SHOW_TOOLTIP',
    content: 'Need help? Try using our sample data to get started quickly!'
  },
  {
    trigger: { errorCount: 3, page: '/mapping' },
    action: 'OFFER_CHAT',
    content: 'Having trouble with mapping? Our support team can help!'
  },
  {
    trigger: { event: 'IMPORT_FAILED' },
    action: 'SUGGEST_VIDEO',
    content: 'Watch our 2-minute guide on fixing common import issues.'
  }
];
```

### 9.11 Help Widget

```
┌─────────────────────────────────────────────────────────────────┐
│ Help & Support                    [×]                          │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  Quick Help:                                                    │
│  [📖 Documentation]  [🎓 Tutorials]  [💬 Chat Support]         │
│                                                                 │
│  Suggested for You:                                             │
│  • How to handle date format issues                             │
│  • Understanding confidence scores                              │
│  • Resolving medication dose conflicts                          │
│                                                                 │
│  🔍 Search help articles...                                     │
│                                                                 │
│  Popular Articles:                                              │
│  1. Getting Started Guide (5 min read)                         │
│  2. AI Mapping Best Practices                                  │
│  3. Quality Gate Explained                                     │
│  4. Export Format Comparison                                   │
│                                                                 │
│  [📹 Watch Video Tutorial]  [🎮 Try Interactive Demo]          │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## Analytics & Improvement

### 9.12 Onboarding Analytics

```typescript
interface OnboardingAnalytics {
  funnel: {
    stepCompletions: Array<{
      stepId: string;
      started: number;
      completed: number;
      dropOffRate: number;
      avgTimeSpent: number;
    }>;
  };
  
  successMetrics: {
    firstDaySuccessRate: number; // % completing onboarding
    avgTimeToFirstExport: number; // minutes
    supportTicketRate: number; // % users filing tickets during onboarding
    returnRate: number; // % users returning within 7 days
  };
  
  painPoints: Array<{
    stepId: string;
    errorFrequency: number;
    helpRequests: number;
    commonIssues: string[];
  }>;
}
```

---

## Integration dengan Sistem

```
┌─────────────────────────────────────────────────────────────────┐
│ Onboarding Integration                                          │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│   User Sign Up                                                  │
│        │                                                        │
│        ▼                                                        │
│   ┌─────────────────────────────────────────────────────────┐   │
│   │              ONBOARDING ENGINE                          │   │
│   │  ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐       │   │
│   │  │Checklist│ │Progress │ │Tooltip  │ │Milestone│       │   │
│   │  │ Manager │ │ Tracker │ │ System  │ │ System  │       │   │
│   │  └────┬────┘ └────┬────┘ └────┬────┘ └────┬────┘       │   │
│   │       └───────────┴───────────┴───────────┘             │   │
│   │                   │                                      │   │
│   │              ┌────┴────┐                                 │   │
│   │              │ Event   │                                 │   │
│   │              │ Bus     │                                 │   │
│   │              └────┬────┘                                 │   │
│   └───────────────────┼─────────────────────────────────────┘   │
│                       │                                         │
│        ┌──────────────┼──────────────┐                         │
│        ▼              ▼              ▼                         │
│   ┌─────────┐   ┌─────────┐   ┌─────────┐                     │
│   │   UI    │   │Analytics│   │ Support │                     │
│   │Components│   │  DB     │   │ System  │                     │
│   └─────────┘   └─────────┘   └─────────┘                     │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```
