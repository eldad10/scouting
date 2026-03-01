# Logging System Guide

## Overview

This project includes a comprehensive logging system that tracks all API requests, route executions, and application flow. All logs are stored in memory and can be viewed in real-time through the Logs Dashboard.

## Features

- **Real-time Monitoring**: View logs as they happen with auto-refresh capability
- **Multiple Log Levels**: Info, Warn, Error, Debug, Success
- **Performance Tracking**: Automatic timing for API requests and functions
- **Filtering**: Filter by log level, module, or search text
- **In-Memory Storage**: Last 500 logs kept in memory
- **Development-Only Output**: Console logs only appear in development mode

## Accessing Logs

### 1. Web Dashboard
Open your browser to: **`http://localhost:3000/logs`**

The dashboard shows:
- Summary cards with log counts by level
- Real-time log table with all details
- Search and filter capabilities
- Auto-refresh toggle
- Manual refresh button
- Clear logs button

### 2. API Endpoint
Direct API access at: **`GET /api/logs?action=all&limit=100`**

Available actions:
- `action=all` - Get last N logs
- `action=summary` - Get log summary statistics
- `action=byLevel&level=error` - Get logs by level (info, warn, error, debug, success)
- `action=byModule&module=api/getTeams` - Get logs by module

Query parameters:
- `limit` - Number of logs to return (default: 100, max: unlimited)
- `level` - Log level filter (for byLevel action)
- `module` - Module name filter (for byModule action)

## Log Output Format

Each log entry contains:

```typescript
{
  timestamp: "2024-03-01T10:30:45.123Z",
  level: "info" | "warn" | "error" | "debug" | "success",
  module: "api/getTeams",        // File path of the module
  message: "Teams fetched successfully",
  data?: { count: 8 },            // Optional context data
  duration?: 125                  // Optional execution time in ms
}
```

## Using the Logger in Code

### Import
```typescript
import { logger } from '@/lib/logger'
```

### Basic Logging
```typescript
// Info log
logger.info('api/getTeams', 'Fetching teams', { count: 5 })

// Warning log
logger.warn('api/getTeams', 'No rankings found', { teams: 3 })

// Error log
logger.error('api/getTeams', 'Database connection failed', { error: 'ECONNREFUSED' })

// Debug log
logger.debug('api/getTeams', 'Processing team data', { raw: teamsData })

// Success log
logger.success('api/getTeams', 'Operation completed', { duration: 125 })
```

### Performance Tracking
```typescript
const endTimer = logger.time('api/getTeams', 'GET /api/getTeams')

// ... do work ...

endTimer()  // Logs the execution time automatically
```

### Getting Logs Programmatically
```typescript
// Get last 100 logs
const logs = logger.getLogs(100)

// Get logs by level
const errors = logger.getLogsByLevel('error', 50)

// Get logs by module
const apiLogs = logger.getLogsByModule('api/getTeams', 100)

// Get summary statistics
const summary = logger.getSummary()
// Returns: { total: 450, byLevel: {...}, byModule: {...} }

// Clear all logs
logger.clear()
```

## Example API Request Flow

When you create a scouting form, here's what gets logged:

```
[10:30:45.123] INFO     [api/insertForm]      Insert form request { teamNumber: '254', matchNumber: 3, scout: 'John' }
[10:30:45.145] DEBUG    [api/insertForm]      Inserting form into Supabase { teamNumber: '254', matchNumber: 3 }
[10:30:45.267] SUCCESS  [api/insertForm]      Form inserted successfully { teamNumber: '254', matchNumber: 3 }
[10:30:45.267] DEBUG    [api/insertForm]      POST /api/insertForm (122ms)
```

## Troubleshooting Database Issues

### Missing Table Error
If you see: `Could not find the table 'public.forms'`

**Fix**: Run the migrations from `/supabase-setup/`:
1. Open Supabase SQL Editor
2. Run `01_create_tables.sql` first
3. Run `02_create_rankings_view.sql`
4. Run `03_insert_sample_data.sql`
5. Run `04_create_rpc_functions.sql`

Check logs at `/logs` to see exactly which table is missing.

### Connection Errors
Look for logs with level `ERROR` in the dashboard. The error message will include:
- Which endpoint failed (module name)
- Exact error code from Supabase
- Context data (team/match numbers)

Example error log:
```
[10:35:22.000] ERROR    [api/getTeams]       Error fetching teams 
  { error: 'Could not find the table', code: 'PGRST205' }
```

## Performance Optimization

Monitor the `duration` column in logs to identify slow endpoints:

1. **High Duration (>500ms)**: Indicates slow database queries
2. **Consistent Slowness**: May need indexing or query optimization
3. **Variable Duration**: May indicate intermittent network issues

## Log Levels Explained

| Level | Color | Use Case |
|-------|-------|----------|
| **INFO** | Blue | Normal operations, successful API calls |
| **DEBUG** | Magenta | Detailed execution information, query parameters |
| **SUCCESS** | Green | Operation completed successfully |
| **WARN** | Yellow | Unexpected but non-critical issues |
| **ERROR** | Red | Critical failures, exceptions, database errors |

## Demo Mode Logging

When running without Supabase credentials, logs show `Demo mode:` prefix:
```
[10:30:45] INFO     [api/getTeams]       Demo mode: returning mock teams { count: 8 }
```

This indicates the app is using fake data instead of real database.

## Database Table Name Notes

**Important**: All table names are **lowercase**:
- `teams` (not `Teams`)
- `forms` (not `Forms`)
- Column names are also lowercase:
  - `teamnumber` (not `TeamNumber`)
  - `teamname` (not `TeamName`)

The logger will help identify if you use incorrect casing in queries.

## Tips for Debugging

1. **Always check `/logs` first** when things go wrong
2. **Use auto-refresh** during active testing
3. **Search by module** to focus on specific components
4. **Look for ERROR and WARN** logs first
5. **Check duration times** to identify performance issues
6. **Use the summary view** to get overview of system health
