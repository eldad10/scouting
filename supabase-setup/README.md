# Supabase Database Setup Guide

This folder contains all the SQL migrations needed to set up your Supabase database for the scouting app.

## Quick Start

1. Go to [Supabase.com](https://supabase.com) and create a new project
2. Get your **Project URL** and **API Key** from project settings
3. Copy them to your `.env.local` file:
   ```
   EXPO_PUBLIC_SUPABASE_URL=your_project_url
   EXPO_PUBLIC_SUPABASE_KEY=your_api_key
   ```
4. Run the migration scripts in order (see below)

## Setup Steps

### Option A: Using Supabase SQL Editor (Recommended for beginners)

1. Open your Supabase project dashboard
2. Go to **SQL Editor** → **New Query**
3. Copy the contents of `01_create_tables.sql` and paste into the editor
4. Click **Run**
5. Repeat for `02_create_rankings_view.sql`
6. Your database is ready!

### Option B: Using Supabase CLI (For developers)

```bash
# Install Supabase CLI
npm install -g supabase

# Login to your Supabase account
supabase login

# Link to your project
supabase link --project-id YOUR_PROJECT_ID

# Run migrations
supabase db push
```

## Files Overview

| File | Purpose |
|------|---------|
| `01_create_tables.sql` | Creates `teams` and `forms` tables with proper schema |
| `02_create_rankings_view.sql` | Creates `rankings` view that calculates team averages |
| `03_insert_sample_data.sql` | (Optional) Inserts 5 sample teams for testing |

## Database Schema

### Teams Table
```
- team_number (VARCHAR, PRIMARY KEY)
- team_name (VARCHAR)
```

### Forms Table
```
- scouter_name (VARCHAR)
- match_number (INT)
- team_number (VARCHAR, FOREIGN KEY)
- auto_balls (VARCHAR) - ranges like "0-5", "5-10", etc.
- auto_climb (BOOLEAN)
- auto_labels (TEXT) - comma-separated label names
- teleop_balls (VARCHAR) - ranges like "0-10", "10-20", etc.
- teleop_climb_level (INT) - 0, 1, 2, or 3
- defence_rating (INT) - 0-5 scale
- delivery_rating (INT) - 0-5 scale
- teleop_labels (TEXT) - comma-separated label names
- comments (VARCHAR, max 300 chars)
PRIMARY KEY: (match_number, team_number)
```

### Rankings View
Automatically calculates per-team statistics:
- `auto_points` - average auto score
- `teleop_points` - average teleop score
- `climb_points` - average climb score
- `avg_defence` - average defence rating
- `avg_delivery` - average delivery rating
- `overall_points` - total average score

## Scoring System

Ball points are calculated using **midpoints** of ranges:

**Auto balls:**
- 0-5 → 2.5 pts
- 5-10 → 7.5 pts
- 10-15 → 12.5 pts
- 15-20 → 17.5 pts
- 20+ → 22.5 pts

**Teleop balls:**
- 0-10 → 5 pts
- 10-20 → 15 pts
- 20-40 → 30 pts
- 40-60 → 50 pts
- 60-80 → 70 pts
- 80-100 → 90 pts
- 100+ → 110 pts

**Climb:**
- Auto climb → 15 pts
- Teleop Level 1 → 10 pts
- Teleop Level 2 → 20 pts
- Teleop Level 3 → 30 pts

## Troubleshooting

**Error: "relation 'teams' does not exist"**
- Make sure you ran `01_create_tables.sql` first

**Error: "foreign key violation"**
- You must add a team in the Teams table before adding forms for that team

**No data appears in app**
- Check that Supabase credentials are correct in `.env.local`
- Try the demo mode (no database needed) to test the app UI

## Next Steps

Once your database is set up:
1. Remove `DEMO_MODE=true` from your `.env.local` (if present)
2. Restart the dev server: `npm run dev`
3. The app will now connect to your Supabase database
4. Start scouting!

## Questions?

- Supabase Docs: https://supabase.com/docs
- This app's GitHub: Check the project repository
