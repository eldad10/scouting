# Scouting App — Development Guide

> FRC-style scouting Progressive Web App. Scouts record per-match robot
> performance, the app aggregates the data into rankings and statistics, and
> a per-team "Robot Info" card captures qualitative scouting intel.

---

## 1. Table of Contents

1. [Project Overview](#2-project-overview)
2. [Tech Stack](#3-tech-stack)
3. [Requirements (User-Provided)](#4-requirements-user-provided)
4. [Architecture](#5-architecture)
5. [Data Model](#6-data-model)
6. [Scoring Logic](#7-scoring-logic)
7. [Demo Mode vs. Supabase Mode](#8-demo-mode-vs-supabase-mode)
8. [Known Issues / Bugs](#9-known-issues--bugs)
9. [Further Development / TODO](#10-further-development--todo)
10. [File Reference](#11-file-reference)
11. [Setup & Running](#12-setup--running)

---

## 2. Project Overview

The app is used at robotics competitions. During each match a scout fills in a
form describing how a robot performed (balls scored in autonomous and teleop,
whether it climbed, defence/delivery quality, free-text notes, and reusable
"labels"). The submitted forms feed:

- **Rankings** — teams sorted by averaged performance across all their matches.
- **Statistics** — per-team charts and aggregate numbers.
- **Robot Info (Intel)** — a static, editable card describing each robot
  (shooter type, strengths, weaknesses, etc.), independent of per-match data.

---

## 3. Tech Stack

| Layer            | Technology                                             |
| ---------------- | ------------------------------------------------------ |
| Framework        | Next.js (App Router) — project root is `scouting/`     |
| Language         | TypeScript                                             |
| UI               | shadcn/ui + Tailwind CSS + lucide-react icons          |
| Charts           | Recharts (via shadcn chart wrapper)                    |
| Database         | Supabase (PostgreSQL)                                  |
| Offline / PWA    | IndexedDB local cache, service worker                  |
| Fallback         | In-memory **Demo Mode** (no DB required)               |

---

## 4. Requirements (User-Provided)

These are the requirements gathered across the conversation. They are the
source of truth for expected behaviour.

### 4.1 Form structure change — exact numbers, not ranges

- **OLD behaviour:** `auto_balls` and `teleop_balls` were stored as **string
  ranges** (e.g. `"15-20"`, `"80-100"`) and entered via range buttons.
- **REQUIRED behaviour:** balls must be an **exact integer** typed by the
  scout (a number input), stored as `INT` in the database.
- All averaging / scoring logic must use the raw integer directly, **not** a
  midpoint lookup of a range string.

### 4.2 Team Info ("Robot Info") card

- Each team has a single **Robot Info** record describing the physical robot:
  - Shooter type (`fixed` / `turret`)
  - Shooter width (`single` / `double` / `wide`)
  - Shooting position (`fixed` / `all_around`)
  - Shooting description (free text)
  - Delivery rating (0–5)
  - Defence rating (0–5)
  - Speed / balance rating (0–5)
  - Advantages / Disadvantages / Additional info (free text)
- The card must be **viewable and editable** inline.
- **The card MUST pull its data from the database per team**, and MUST refresh
  when the selected team changes.
- Editing and saving a card must **persist to the database** and be reflected
  on reload.
- Changing a value **directly in the DB** must be reflected in the app.

### 4.3 Data / rendering correctness

- All pages that render team data must actually **pull from the database**
  (no stale in-memory-only rendering).
- The **Intel page** rendering/layout is considered correct — it just needs to
  reliably pull the latest data after a change.

### 4.4 Git / workflow

- Source of truth branch: **`v0/vaskere-1138-1e79aaa9`**.
- Always pull the full, current file set from that branch before editing.

---

## 5. Architecture

### 5.1 Request flow

```
Client page (app/**/page.tsx)
        │  calls
        ▼
api object (lib/api.ts)          ← typed client-side wrapper around fetch
        │  fetch("/api/...")
        ▼
Route handlers (app/api/**/route.ts)
        │
        ├── Demo Mode  → lib/demo-data.ts  (in-memory store)
        └── Live Mode  → Supabase client   (@supabase/supabase-js)
```

### 5.2 Key modules

- **`lib/api.ts`** — defines the domain classes (`Team`, `Form`, `FormInput`,
  `RankingData`) and the `TeamInfo` interface, plus the `api` object with
  methods: `getTeams`, `createTeam`, `getForms`, `getForm`, `createForm`,
  `getRankings`, `getTeamInfo`, `upsertTeamInfo`.
- **`lib/demo-data.ts`** — the in-memory `demoStore` (`teams`, `forms`,
  `teamInfos`) plus helper functions used by route handlers when in demo mode.
- **`app/api/**/route.ts`** — thin HTTP handlers that branch on `isDemoMode()`.
- **`components/team-info-card.tsx`** — the view/edit Robot Info card.

---

## 6. Data Model

### 6.1 `teams`

| Column       | Type           | Notes        |
| ------------ | -------------- | ------------ |
| `teamnumber` | `VARCHAR(100)` | Primary key  |
| `teamname`   | `VARCHAR(100)` | Not null     |

### 6.2 `forms`

| Column               | Type           | Notes                              |
| -------------------- | -------------- | ---------------------------------- |
| `scoutername`        | `VARCHAR(100)` | Not null                           |
| `matchnumber`        | `INT`          | PK part                            |
| `teamnumber`         | `VARCHAR(100)` | PK part, FK → `teams`              |
| `auto_balls`         | `INT`          | **exact count** (was VARCHAR)      |
| `auto_climb`         | `BOOLEAN`      | default false                      |
| `auto_labels`        | `TEXT`         | comma-separated labels             |
| `teleop_balls`       | `INT`          | **exact count** (was VARCHAR)      |
| `teleop_climb_level` | `INT`          | 0–3                                |
| `defence_rating`     | `INT`          | 0–5                                |
| `delivery_rating`    | `INT`          | 0–5                                |
| `teleop_labels`      | `TEXT`         | comma-separated labels             |
| `comments`           | `VARCHAR(300)` |                                    |

Primary key: `(matchnumber, teamnumber)`.

### 6.3 `team_info`

| Column                 | Type           | Notes                        |
| ---------------------- | -------------- | ---------------------------- |
| `teamnumber`           | `VARCHAR(100)` | PK, FK → `teams`             |
| `shooter_type`         | `VARCHAR(20)`  | `fixed` / `turret`           |
| `shooter_width`        | `VARCHAR(20)`  | `single` / `double` / `wide` |
| `shooting_position`    | `VARCHAR(20)`  | `fixed` / `all_around`       |
| `shooting_description` | `TEXT`         |                              |
| `delivery_rating`      | `INT`          | 0–5                          |
| `defence_rating`       | `INT`          | 0–5                          |
| `speed_balance_rating` | `INT`          | 0–5                          |
| `advantages`           | `TEXT`         |                              |
| `disadvantages`        | `TEXT`         |                              |
| `additional_info`      | `TEXT`         |                              |

### 6.4 `rankings` (VIEW)

A SQL view aggregating `forms` per team. Because balls are now integers, the
view uses **direct arithmetic** (no `CASE/WHEN` range→midpoint mapping).

---

## 7. Scoring Logic

All scores are computed from raw integers. The single source of truth is the
`Form` constructor in `lib/api.ts`; the SQL `rankings` view and demo-mode
`getDemoRankings()` must mirror it exactly.

```
autoClimbPts   = auto_climb ? 15 : 0
teleopClimbPts = { 1: 10, 2: 20, 3: 30 }[teleop_climb_level] ?? 0

autoScore   = auto_balls   + autoClimbPts
teleopScore = teleop_balls + teleopClimbPts
climbScore  = autoClimbPts + teleopClimbPts
totalScore  = auto_balls + autoClimbPts + teleop_balls + teleopClimbPts
```

Rankings are the **average** of each score across a team's matches, and the
overall rank is assigned by descending `overall_points`.

> **Consistency rule:** if you change scoring, update all three places:
> `lib/api.ts` (`Form`), `supabase-setup/02_create_rankings_view.sql`, and
> `lib/demo-data.ts` (`getDemoRankings`).

---

## 8. Demo Mode vs. Supabase Mode

- **`isDemoMode()`** (in `lib/demo-data.ts`) decides the data source. It
  returns `true` when Supabase env vars are absent or `DEMO_MODE=true`.
- **Demo mode** uses the in-memory `demoStore`. Note: this resets on every
  server restart / redeploy and is **not** shared between serverless
  instances — good for previews, not for real persistence.
- **Live mode** uses Supabase via `@supabase/supabase-js`, reading:
  - `EXPO_PUBLIC_SUPABASE_URL`
  - `SUPABASE_SERVICE_ROLE_KEY` (preferred) or `EXPO_PUBLIC_SUPABASE_ANON_KEY`

---

## 9. Known Issues / Bugs

### 9.1 CRITICAL — Robot Info card does not refresh on team change

**File:** `components/team-info-card.tsx`

The component seeds state once from props:

```tsx
const [info, setInfo] = useState<TeamInfo>(initialInfo ?? EMPTY_INFO(teamNumber))
const [draft, setDraft] = useState<TeamInfo>(info)
```

Because `useState` only uses its argument on **first mount**, when the parent
re-renders with a different `teamNumber` / `initialInfo` the card keeps showing
the **old** team's data. This is the reported bug: *"when I switch team it stays
the same and not really pulling the data from the DB."*

**Fix direction:** add an effect that re-syncs local state when the inputs
change, and/or fetch fresh data inside the card:

```tsx
useEffect(() => {
  let cancelled = false
  api.getTeamInfo(teamNumber).then((fresh) => {
    if (cancelled) return
    const next = fresh ?? EMPTY_INFO(teamNumber)
    setInfo(next)
    setDraft(next)
    setEditing(false)
  })
  return () => { cancelled = true }
}, [teamNumber])
```

### 9.2 Demo-mode writes are not durable

`upsertTeamInfo` in demo mode mutates the in-memory `demoStore`. Editing a card
"works" until the server restarts, and edits are invisible to other instances.
For real persistence the app must be in **live Supabase mode** with the
`team_info` table created.

### 9.3 `team_info` must exist in the live DB

If the app is pointed at Supabase but `team_info` was never created (run
`supabase-setup/01_create_tables.sql`), `getTeamInfo` returns 404 for every
team and the card silently falls back to an empty template, giving the
impression that "the DB isn't being read."

### 9.4 Rating default mismatch

`EMPTY_INFO` sets `speedBalanceRating: 1` and the other ratings to `0`, while
the SQL defaults differ. Align the defaults between the empty template, SQL
`DEFAULT`s, and demo seed data to avoid confusing initial values.

---

## 10. Further Development / TODO

- [ ] **Fix 9.1** — refresh the Robot Info card on `teamNumber` change (highest
      priority; this is the main reported bug).
- [ ] Verify every consumer page (`teams`, `statistics`, `compare`, `trends`,
      `intel`) fetches fresh data rather than caching stale in-memory results.
- [ ] Add loading & error states around `getTeamInfo` / `upsertTeamInfo`.
- [ ] Confirm `create-form` uses numeric inputs for balls end-to-end and
      validates non-negative integers.
- [ ] Ensure the `rankings` view and `getDemoRankings` stay in sync with the
      `Form` scoring in `lib/api.ts`.
- [ ] Consider optimistic UI + toast feedback on Robot Info save.
- [ ] Add RLS policies before using Supabase in production.
- [ ] Seed `team_info` for all existing teams so cards are never empty.

---

## 11. File Reference

| Path                                            | Responsibility                                  |
| ----------------------------------------------- | ----------------------------------------------- |
| `scouting/lib/api.ts`                           | Domain types + client `api` wrapper             |
| `scouting/lib/demo-data.ts`                     | In-memory store + demo helpers + `isDemoMode()` |
| `scouting/components/team-info-card.tsx`        | Robot Info view/edit card                       |
| `scouting/app/create-form/page.tsx`             | Match scouting form (numeric ball inputs)       |
| `scouting/app/statistics/page.tsx`              | Per-team stats & charts                         |
| `scouting/app/teams/page.tsx`                   | Team list / selection                           |
| `scouting/app/api/getTeamInfo/route.ts`         | Read one team's Robot Info                      |
| `scouting/app/api/upsertTeamInfo/route.ts`      | Create/update Robot Info                        |
| `scouting/app/api/getForms/route.ts`            | Read forms                                      |
| `scouting/app/api/getRankings/route.ts`         | Read aggregated rankings                        |
| `supabase-setup/01_create_tables.sql`           | `teams`, `forms`, `team_info` schema            |
| `supabase-setup/02_create_rankings_view.sql`    | `rankings` aggregation view                     |
| `supabase-setup/03_seed_demo_data.sql`          | Sample/seed data                                |

---

## 12. Setup & Running

1. **Install dependencies** (from `scouting/`):
   ```bash
   npm install
   ```
2. **Environment variables** (for live Supabase mode):
   ```
   EXPO_PUBLIC_SUPABASE_URL=...
   SUPABASE_SERVICE_ROLE_KEY=...        # or EXPO_PUBLIC_SUPABASE_ANON_KEY
   # DEMO_MODE=true                     # force in-memory demo mode
   ```
3. **Create the schema** — run the SQL files in `supabase-setup/` in order
   (`01` → `02` → optionally `03`) in the Supabase SQL editor.
4. **Run the dev server**:
   ```bash
   npm run dev
   ```

> If no Supabase env vars are set, the app runs in **Demo Mode** automatically
> using in-memory data.
