# Real-time Collaboration

## Overview
Fitur **Real-time Collaboration** memungkinkan multiple users bekerja secara bersamaan pada project mapping dan transformasi. Fitur ini menyediakan presence indicators, section locking, inline comments, dan conflict resolution untuk pengalaman kolaboratif yang seamless dan aman.

---

## Kebutuhan UX (User Experience)

### 6.1 Presence Indicators

#### Avatar Stack
```
┌─────────────────────────────────────────────────────────────────┐
│ Mapping Project: RS Jakarta Integration                         │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  Currently viewing:                               [🟢 Live]     │
│  ┌────┐ ┌────┐ ┌────┐ ┌────┐                                   │
│  │ 👩 │ │ 👨 │ │ 👩 │ │ +3 │  dr. Sarah, Ahmad, Lisa + 3 more │
│  │ SR │ │ AK │ │ LM │ │    │                                   │
│  └────┘ └────┘ └────┘ └────┘                                   │
│                                                                 │
│  🔴 dr. Sarah is editing: Field Mappings section               │
│  🟡 Ahmad is viewing: Quality Rules section                    │
│  🟢 Lisa is idle (last active 2m ago)                          │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

#### Cursor Tracking
- **User Cursor**: Real-time cursor position dengan user name label
- **Selection Highlight**: Selected text/fields highlighted dengan user color
- **Viewport Sync**: Optional sync viewport position (follow mode)

```typescript
interface PresenceState {
  userId: string;
  userName: string;
  userColor: string;
  avatar: string;
  
  // Current position
  cursorPosition: {
    section: string;
    field?: string;
    line?: number;
    column?: number;
  };
  
  // Selection
  selection?: {
    start: Position;
    end: Position;
    content: string;
  };
  
  // Status
  status: 'ACTIVE' | 'IDLE' | 'TYPING';
  lastActivity: Date;
  
  // Viewport (optional)
  viewport?: {
    scrollTop: number;
    scrollLeft: number;
  };
}
```

### 6.2 Section Locking

#### Lock Types
| Lock Type | Description | Use Case |
|-----------|-------------|----------|
| **EDIT_LOCK** | Exclusive edit access | Prevent simultaneous editing |
| **REVIEW_LOCK** | Read-only with intent | Marking for review |
| **COMMENT_LOCK** | Comments only | Gathering feedback |

#### Lock UI
```
┌─────────────────────────────────────────────────────────────────┐
│ Field Mappings                                          [🔒]    │
│ 🔒 Locked by you (expires in 4:32)                              │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  source_field ───────────────► canonical_field                  │
│  [blood_pressure_systolic]    [bp_systolic]        [✓] [🗑️]   │
│                                                                 │
│  [Save Changes]  [Cancel]  [🔓 Release Lock]                    │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│ Quality Rules                                           [🔒]    │
│ 🔒 Locked by Ahmad (since 2 min ago)                            │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  [View Only Mode]  [Request Access]  [💬 Comment]              │
│                                                                 │
│  ☑ Patient ID Required (CRITICAL)                 [👁️ View]   │
│  ☐ Valid Date Format (HIGH)                       [👁️ View]   │
│  ☑ BP Range Check (MEDIUM)                        [👁️ View]   │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

#### Lock Management
```typescript
interface SectionLock {
  lockId: string;
  sectionId: string;
  lockType: 'EDIT' | 'REVIEW' | 'COMMENT';
  
  owner: {
    userId: string;
    userName: string;
  };
  
  acquiredAt: Date;
  expiresAt: Date; // Auto-expire after inactivity
  
  // Queue for access requests
  requestQueue: Array<{
    userId: string;
    userName: string;
    requestedAt: Date;
    message?: string;
  }>;
}

// Lock policies
const LOCK_POLICY = {
  autoExpireMinutes: 5,
  maxLockDurationMinutes: 30,
  allowStealAfterMinutes: 10,
  notifyBeforeExpireSeconds: 60,
};
```

### 6.3 Inline Comments

#### Comment Thread UI
```
┌─────────────────────────────────────────────────────────────────┐
│ Field: blood_pressure_systolic → bp_systolic                   │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  Mapping Configuration:                                        │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │ Source: blood_pressure_systolic                        │   │
│  │ Target: bp_systolic                                    │   │
│  │ Transform: normalize_bp_value                          │   │
│  │ 💬 3 comments                                          │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
│  Comments:                                                      │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │                                                         │   │
│  │  👩‍⚕️ dr. Sarah - 2 hours ago                             │   │
│  │  Suggest adding validation for values > 300?           │   │
│  │  [Reply] [👍 2] [👎] [✓ Resolve]                       │   │
│  │                                                         │   │
│  │  └── 👨 Ahmad - 1 hour ago                              │   │
│  │      Good catch, I'll add that to quality rules.       │   │
│  │      [Reply] [👍] [👎]                                  │   │
│  │                                                         │   │
│  │  👩‍💼 Lisa - 30 min ago                                   │   │
│  │  This field is used in export format v2.               │   │
│  │  [Reply] [👍 1] [👎] [✓ Resolve]                       │   │
│  │                                                         │   │
│  │  [Add a comment...]                          [💬 Post]  │   │
│  │                                                         │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

#### Comment Features
```typescript
interface Comment {
  commentId: string;
  parentId?: string; // For threads
  
  // Context
  projectId: string;
  sectionId: string;
  fieldId?: string;
  
  // Content
  author: {
    userId: string;
    name: string;
    avatar: string;
  };
  content: string;
  createdAt: Date;
  editedAt?: Date;
  
  // Status
  status: 'OPEN' | 'RESOLVED' | 'CLOSED';
  resolvedBy?: string;
  resolvedAt?: Date;
  
  // Engagement
  reactions: Array<{
    emoji: string;
    users: string[];
  }>;
  replies: Comment[];
  mentions: string[]; // @user mentions
}
```

---

## Mekanisme Sinkronisasi Data

### 6.4 Operational Transformation (OT) vs CRDT

#### Chosen Approach: Operational Transformation
```typescript
// For structured data (mappings, rules)
interface Operation {
  id: string;
  type: 'INSERT' | 'UPDATE' | 'DELETE' | 'MOVE';
  
  // Target
  path: string; // e.g., "mappings.0.sourceField"
  
  // Value (for INSERT/UPDATE)
  value?: any;
  
  // Previous value (for undo/conflict detection)
  previousValue?: any;
  
  // Metadata
  timestamp: number; // Lamport timestamp
  clientId: string;
  sequenceNumber: number;
  
  // For OT
  parentOperations: string[];
}

// Transform operation against concurrent operations
function transformOperation(op: Operation, concurrentOps: Operation[]): Operation {
  // OT algorithm implementation
  // Returns transformed operation that can be applied
}
```

### 6.5 Sync Protocol

```
┌─────────────────────────────────────────────────────────────────┐
│                   SYNC ARCHITECTURE                             │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  CLIENT A                                    CLIENT B           │
│     │                                           │               │
│     │ 1. Local change                           │               │
│     │    (Optimistic UI)                        │               │
│     │                                           │               │
│     │ 2. Send operation ──────────────────────▶ │               │
│     │              via WebSocket                  │               │
│     │                                           │               │
│     │ 3. Server broadcasts ───────────────────▶ │               │
│     │    to all clients                         │               │
│     │                                           │               │
│     │ 4. Transform & apply ◀────────────────────│               │
│     │    (if concurrent)                        │               │
│     │                                           │               │
│     │ 5. Ack + Sync state ◀─────────────────────│               │
│     │                                           │               │
│     │ 6. Conflict? ───────────────────────────▶ │               │
│     │    Handle resolution                      │               │
│     │                                           │               │
└─────────────────────────────────────────────────────────────────┘
```

### 6.6 State Management

```typescript
interface CollaborativeState {
  // Document state
  document: {
    version: number;
    content: ProjectData;
    history: Operation[];
  };
  
  // Pending changes (optimistic)
  pending: Operation[];
  
  // Server acknowledged
  acknowledged: number;
  
  // Presence
  collaborators: PresenceState[];
  
  // Locks
  locks: SectionLock[];
  
  // Connection
  connection: {
    status: 'CONNECTED' | 'CONNECTING' | 'DISCONNECTED';
    latency: number;
    lastSync: Date;
  };
}

// Sync actions
interface SyncAction {
  type: 
    | 'OPERATION_SEND'
    | 'OPERATION_RECEIVE'
    | 'OPERATION_ACK'
    | 'PRESENCE_UPDATE'
    | 'LOCK_ACQUIRE'
    | 'LOCK_RELEASE'
    | 'LOCK_REQUEST'
    | 'STATE_SYNC';
  payload: any;
}
```

---

## Penanganan Konflik Edit

### 6.7 Conflict Detection

```typescript
interface EditConflict {
  conflictId: string;
  type: 'CONCURRENT_EDIT' | 'STALE_DATA' | 'LOCK_VIOLATION';
  
  // Conflicting operations
  localOperation: Operation;
  remoteOperation: Operation;
  
  // Context
  field: string;
  localValue: any;
  remoteValue: any;
  baseValue: any; // Common ancestor
  
  // Users involved
  localUser: string;
  remoteUser: string;
}

// Conflict resolution strategies
enum ConflictStrategy {
  LAST_WRITE_WINS = 'LWW',
  FIRST_WRITE_WINS = 'FWW',
  MERGE = 'MERGE',
  MANUAL_RESOLUTION = 'MANUAL',
}
```

### 6.8 Conflict Resolution UI

```
┌─────────────────────────────────────────────────────────────────┐
│ ⚠️ Edit Conflict Detected                             [×]       │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  Field: mappings[0].sourceField                                 │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │ Original Value:                                         │   │
│  │ "blood_pressure_systolic"                               │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
│  Conflicting Changes:                                           │
│  ┌─────────────────────────┐  ┌─────────────────────────┐      │
│  │ YOUR VERSION (2:15 PM)  │  │ SARAH'S VERSION         │      │
│  │                         │  │ (2:14 PM)               │      │
│  ├─────────────────────────┤  ├─────────────────────────┤      │
│  │ "bp_systolic_value"     │  │ "blood_pressure_sys"    │      │
│  │                         │  │                         │      │
│  │ ✓ Your change           │  │ ✓ Sarah's change        │      │
│  └─────────────────────────┘  └─────────────────────────┘      │
│                                                                 │
│  Resolution Options:                                            │
│  (•) Keep my version                                            │
│  ( ) Accept Sarah's version                                     │
│  ( ) Merge manually:                                            │
│      [____________________________________________]            │
│  ( ) Ask Sarah to review                                        │
│                                                                 │
│  [Cancel]  [Apply Resolution]  [💬 Discuss]                     │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## Alur Kerja Tim End-to-End

### 6.9 Complete Collaboration Workflow

```
┌─────────────────────────────────────────────────────────────────────┐
│              TEAM COLLABORATION WORKFLOW                            │
└─────────────────────────────────────────────────────────────────────┘

PHASE 1: PROJECT SETUP
┌─────────────┐
│ Admin       │
│ Creates     │
│ Project     │
└──────┬──────┘
       │
       ▼
┌─────────────────┐
│ Add Team        │
│ Members with    │
│ Roles:          │
│ • Data Steward  │
│ • Clinical      │
│   Reviewer      │
│ • QA Engineer   │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Assign Sections │
│ to Owners:      │
│ • Mappings:     │
│   Data Steward  │
│ • Rules: QA     │
│ • Review:       │
│   Clinical      │
└────────┬────────┘
         │
         ▼
PHASE 2: COLLABORATIVE WORK
         ┌────────────────────────────────────────────────┐
         │                                                │
    ┌────┴────┐     ┌──────────┐     ┌──────────┐       │
    │  DATA   │     │   QA     │     │ CLINICAL │       │
    │ STEWARD │     │ ENGINEER │     │ REVIEWER │       │
    └────┬────┘     └────┬─────┘     └────┬─────┘       │
         │               │                │              │
         ▼               ▼                ▼              │
    ┌─────────┐    ┌──────────┐    ┌──────────┐        │
    │ Configure│    │ Review   │    │ Approve  │        │
    │ Mappings │    │ Quality  │    │ Clinical │        │
    │ (Locked) │    │ Rules    │    │ Accuracy │        │
    └────┬─────┘    └────┬─────┘    └────┬─────┘        │
         │               │                │              │
         └───────────────┼────────────────┘              │
                         │                               │
                         ▼                               │
                   ┌───────────┐                         │
                   │ Comments &│◄────────────────────────┘
                   │ Feedback  │
                   │ Exchange  │
                   └─────┬─────┘
                         │
         ┌───────────────┼───────────────┐
         ▼               ▼               ▼
PHASE 3: RESOLUTION & APPROVAL
    ┌──────────┐   ┌──────────┐   ┌──────────┐
    │ Resolve  │   │ Update   │   │ Final    │
    │ Conflicts│   │ Based on │   │ Approval │
    │          │   │ Feedback │   │          │
    └────┬─────┘   └────┬─────┘   └────┬─────┘
         │              │              │
         └──────────────┼──────────────┘
                        │
                        ▼
               ┌────────────────┐
               │ Project Status │
               │   APPROVED     │
               └────────┬───────┘
                        │
                        ▼
PHASE 4: DEPLOYMENT
               ┌────────────────┐
               │ Deploy to      │
               │ Production     │
               └────────────────┘
```

---

## Real-time Notifications

### 6.10 Notification System

```typescript
interface CollaborationNotification {
  id: string;
  type: 
    | 'USER_JOINED'
    | 'USER_LEFT'
    | 'SECTION_LOCKED'
    | 'SECTION_UNLOCKED'
    | 'LOCK_REQUESTED'
    | 'COMMENT_ADDED'
    | 'COMMENT_REPLIED'
    | 'CONFLICT_DETECTED'
    | 'PROJECT_UPDATED';
  
  sender: {
    userId: string;
    name: string;
  };
  
  recipient: string; // userId or 'ALL'
  
  content: {
    title: string;
    message: string;
    link?: string;
  };
  
  timestamp: Date;
  read: boolean;
}

// Toast notifications
const notificationToasts = {
  USER_JOINED: '{name} joined the project',
  SECTION_LOCKED: '{name} started editing {section}',
  COMMENT_REPLIED: '{name} replied to your comment',
  CONFLICT_DETECTED: 'Edit conflict detected with {name}',
  LOCK_REQUESTED: '{name} requested access to {section}',
};
```

### 6.11 Activity Feed

```
┌─────────────────────────────────────────────────────────────────┐
│ Activity Feed                                                   │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  Today                                                          │
│  ├── 2:34 PM 🟢 dr. Sarah joined the project                   │
│  ├── 2:30 PM 💬 Ahmad commented on "BP mapping"                │
│  ├── 2:28 PM ✏️ Lisa updated "Quality Rules" section           │
│  ├── 2:25 PM 🔒 Lisa locked "Quality Rules" section            │
│  ├── 2:15 PM ⚠️ Edit conflict resolved in "Field Mappings"     │
│  └── 2:10 PM ✓ dr. Sarah approved 3 mappings                   │
│                                                                 │
│  Yesterday                                                      │
│  ├── 4:45 PM 🚀 Project deployed to staging                    │
│  ├── 3:20 PM 💬 12 comments resolved                           │
│  └── 9:00 AM 📁 Project created by Admin                       │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## Technical Architecture

### 6.12 WebSocket Events

```typescript
// Server → Client events
interface ServerEvents {
  'presence:update': PresenceState[];
  'operation:broadcast': Operation;
  'operation:ack': { operationId: string; version: number };
  'lock:acquired': SectionLock;
  'lock:released': { lockId: string; sectionId: string };
  'lock:requested': { sectionId: string; userId: string };
  'comment:new': Comment;
  'comment:updated': Comment;
  'conflict:detected': EditConflict;
  'user:joined': { userId: string; name: string };
  'user:left': { userId: string };
}

// Client → Server events
interface ClientEvents {
  'presence:ping': { cursorPosition: Position; selection?: Selection };
  'operation:send': Operation;
  'lock:acquire': { sectionId: string; lockType: LockType };
  'lock:release': { lockId: string };
  'lock:approve': { lockId: string; userId: string };
  'comment:create': { sectionId: string; content: string };
  'comment:resolve': { commentId: string };
  'conflict:resolve': { conflictId: string; resolution: Resolution };
}
```

### 6.13 Reconnection Handling

```typescript
interface ReconnectionStrategy {
  // Steps on reconnect
  onReconnect: () => {
    // 1. Get current server state
    serverState: RequestStateSnapshot;
    
    // 2. Check for missed operations
    missedOps: RequestOperationsSince(lastKnownVersion);
    
    // 3. Reconcile local state
    reconcile: () => {
      // Apply missed operations
      // Resolve any conflicts
      // Update UI
    };
    
    // 4. Re-establish presence
    broadcastPresence: () => void;
  };
  
  // Offline support
  offlineQueue: {
    maxSize: number;
    flushOnReconnect: boolean;
    conflictResolution: 'LOCAL_WINS' | 'SERVER_WINS' | 'MANUAL';
  };
}
```

---

## Security Considerations

```typescript
interface CollaborationSecurity {
  // Authorization
  canEdit: (userId: string, sectionId: string) => boolean;
  canLock: (userId: string, sectionId: string) => boolean;
  canComment: (userId: string, sectionId: string) => boolean;
  
  // Rate limiting
  maxOperationsPerMinute: number;
  maxLocksPerUser: number;
  maxCommentsPerMinute: number;
  
  // Audit
  logAllOperations: boolean;
  logPresenceChanges: boolean;
  retentionDays: number;
}
```
