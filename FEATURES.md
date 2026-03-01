# Scouting App - Features Overview

## 🎨 Enhanced Label System

### Colorful & Informative Labels
Every label now has:
- **Unique colors** for visual distinction
- **Icons** for quick recognition
- **Category badges** (Performance, Issue, Mechanic, Custom)
- **Phase separation**: Auto (Blue theme) vs Teleop (Green/Purple theme)

### Label Categories

#### Auto Phase Labels (Blue Theme)
- 🟦 **Crossed to middle of field** - Mechanic (cyan)
- ◆ **Collected from human player** - Performance (cyan)
- ◇ **Collected from depot** - Performance (sky)
- ⚠ **Interfered with other robot** - Issue (red)
- ✗ **Robot not working in auto** - Issue (orange)

#### Teleop Phase Labels (Green/Purple Theme)
- ⚠ **Interfered with team robot** - Issue (red)
- ✗ **Robot had issues** - Issue (pink)
- ⚡ **Collects balls very fast** - Performance (emerald)
- ◯ **Misses a lot of shots** - Issue (amber)
- 🛡 **Played very good defence** - Performance (violet)
- ↑ **Fast climb** - Mechanic (purple)
- ★ **Experienced in defence** - Performance (indigo)
- ◆ **Struggles with defence** - Issue (rose)

#### Custom Labels
- ✎ **Custom labels** - User-defined (gray)

---

## 📊 New Features

### 1. Performance Trends (📈 /trends)
Comprehensive analysis of team performance across multiple matches:

**Visualizations:**
- 📉 **Total Score Trend** - Line chart showing overall scores per match
- 📊 **Phase Breakdown** - Compare Auto, Teleop, and Climb contributions
- 📋 **Quality Ratings** - Defence and Delivery bar chart
- 📑 **Match Details Table** - All detailed stats in one view

**Analytics:**
- Average Score
- Best Match (max score)
- Worst Match (min score)
- Consistency Score (lower = more consistent)

**Benefits:**
- Spot trends in team performance
- Identify strengths and weaknesses
- Track improvement over time

---

### 2. Match Comparison (⚖️ /compare)
Side-by-side comparison of two teams in any match:

**Features:**
- Select two teams and their match numbers
- Visual comparison cards for each team
- Display all metrics side-by-side:
  - Auto/Teleop/Climb scores
  - Defence and Delivery ratings
  - Colored labels with categories
  - Scout notes
  - Ball collection ranges

**Use Cases:**
- Compare alliance partners for strategy
- Analyze head-to-head matchups
- Evaluate similar teams' performance
- Prepare scouting reports

---

## 🗂️ Supabase Database Setup

Complete setup folder at `/supabase-setup/` with:

### Files
- **README.md** - Complete setup guide with options
- **01_create_tables.sql** - Creates Teams and Forms tables
- **02_create_rankings_view.sql** - Auto-calculated team rankings view
- **03_insert_sample_data.sql** - 15 sample match records for testing

### Quick Start
1. Create Supabase project
2. Copy `.env.local`:
   ```
   EXPO_PUBLIC_SUPABASE_URL=your_url
   EXPO_PUBLIC_SUPABASE_KEY=your_key
   ```
3. Run migrations in SQL Editor or CLI
4. Start scouting!

### Database Schema
- **Teams** table - Team info
- **Forms** table - All match scouting data
- **Rankings** view - Auto-calculated statistics

---

## 📱 UI/UX Improvements

### Label Badges Component
New `LabelBadge` component in `/components/label-badge.tsx`:
- Displays labels with full styling
- Supports 3 sizes (sm, md, lg)
- Optional remove button
- Category indicator
- Icon display

### Updated Pages
- **Create Form** - Colorful label selection with phase separation
- **Form Detail** - Enhanced label display with categories
- **Trends** - New analytics page with charts
- **Compare** - New comparison page

### Navigation Updates
- Added "Trends" button
- Added "Compare" button
- Integrated into main navigation menu

---

## 🎯 Scoring System (Database)

Points calculated using **midpoint** of ranges:

### Auto Ball Points
- 0-5 → **2.5** pts
- 5-10 → **7.5** pts
- 10-15 → **12.5** pts
- 15-20 → **17.5** pts
- 20+ → **22.5** pts

### Teleop Ball Points
- 0-10 → **5** pts
- 10-20 → **15** pts
- 20-40 → **30** pts
- 40-60 → **50** pts
- 60-80 → **70** pts
- 80-100 → **90** pts
- 100+ → **110** pts

### Climb Points
- Auto Climb → **15** pts
- Teleop Level 1 → **10** pts
- Teleop Level 2 → **20** pts
- Teleop Level 3 → **30** pts

---

## 🚀 Getting Started

### With Demo Data
- No database setup needed
- Colorful labels visible in form creation
- New Trends page shows demo analytics
- New Compare page ready to test

### With Supabase Database
1. Follow `/supabase-setup/README.md`
2. Run the 3 SQL migration files
3. Restart app: `npm run dev`
4. App now connected to real database!

---

## 📚 File Structure

```
scouting/
├── app/
│   ├── compare/          [NEW] Match comparison view
│   ├── trends/           [NEW] Performance analytics
│   ├── forms/
│   │   └── [id]/         [UPDATED] With colorful labels
│   └── create-form/      [UPDATED] Improved label UI
├── components/
│   ├── label-badge.tsx   [NEW] Reusable label component
│   └── navigation.tsx    [UPDATED] Added new routes
├── lib/
│   ├── label-config.ts   [NEW] Label colors & categories
│   └── api.ts            [UPDATED] Demo mode support
└── supabase-setup/       [NEW] Complete setup folder
    ├── README.md
    ├── 01_create_tables.sql
    ├── 02_create_rankings_view.sql
    └── 03_insert_sample_data.sql
```

---

## 🔮 Future Enhancement Ideas

Consider adding:
- **Label Heatmap** - Visual frequency of labels per team
- **Export to CSV/Excel** - Download all data for analysis
- **Robot Issues Tracker** - Dedicated issue tracking section
- **Scout Performance Stats** - Accuracy ratings by scouter
- **Match Notes Archive** - Search through all comments

---

## 💡 Tips

- Use **custom labels** for specific observations
- Check **Trends** to identify patterns
- Use **Compare** for pre-match strategy
- Export rankings data for coaching analysis
- Team up with rankings for alliance selection

