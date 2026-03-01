'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { ArrowLeft, RefreshCw, Trash2 } from 'lucide-react'

interface LogEntry {
  timestamp: string
  level: 'info' | 'warn' | 'error' | 'debug' | 'success'
  module: string
  message: string
  data?: any
  duration?: number
}

interface LogsResponse {
  action: string
  limit: number
  data: LogEntry[]
  timestamp: string
}

export default function LogsPage() {
  const [logs, setLogs] = useState<LogEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<'all' | 'error' | 'info' | 'warn' | 'debug' | 'success'>('all')
  const [moduleFilter, setModuleFilter] = useState<string>('')
  const [searchQuery, setSearchQuery] = useState<string>('')
  const [summary, setSummary] = useState<any>(null)
  const [autoRefresh, setAutoRefresh] = useState(false)

  const fetchLogs = async (action: string = 'all') => {
    try {
      setLoading(true)
      const params = new URLSearchParams({ action, limit: '200' })
      if (action === 'byLevel' && filter !== 'all') {
        params.append('level', filter)
      }
      if (action === 'byModule' && moduleFilter) {
        params.append('module', moduleFilter)
      }

      const response = await fetch(`/api/logs?${params}`)
      const result: LogsResponse = await response.json()
      setLogs(result.data)
    } catch (error) {
      console.error('Failed to fetch logs:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchSummary = async () => {
    try {
      const response = await fetch('/api/logs?action=summary')
      const result: any = await response.json()
      setSummary(result.data)
    } catch (error) {
      console.error('Failed to fetch summary:', error)
    }
  }

  const clearLogs = async () => {
    if (!confirm('Are you sure you want to clear all logs?')) return
    try {
      await fetch('/api/logs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'clear' }),
      })
      setLogs([])
      fetchSummary()
    } catch (error) {
      console.error('Failed to clear logs:', error)
    }
  }

  useEffect(() => {
    fetchLogs()
    fetchSummary()

    if (autoRefresh) {
      const interval = setInterval(() => {
        fetchLogs()
        fetchSummary()
      }, 5000)
      return () => clearInterval(interval)
    }
  }, [autoRefresh])

  useEffect(() => {
    if (filter !== 'all' || moduleFilter) {
      fetchLogs(moduleFilter ? 'byModule' : filter !== 'all' ? 'byLevel' : 'all')
    }
  }, [filter, moduleFilter])

  const filteredLogs = logs.filter((log) => {
    if (searchQuery && !log.message.toLowerCase().includes(searchQuery.toLowerCase()) && !log.module.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false
    }
    return true
  })

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'error':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
      case 'warn':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
      case 'success':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
      case 'debug':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200'
      default:
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
    }
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 py-6 sm:py-10">
      <div className="mb-8">
        <Link href="/">
          <Button variant="ghost" className="mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
        </Link>
        <h1 className="text-3xl font-bold text-foreground mb-2">System Logs</h1>
        <p className="text-muted-foreground">Real-time monitoring of application requests and routes</p>
      </div>

      {/* Summary Cards */}
      {summary && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Total Logs</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{summary.total}</div>
              <p className="text-xs text-muted-foreground">in memory</p>
            </CardContent>
          </Card>

          {Object.entries(summary.byLevel).map(([level, count]: [string, any]) => (
            <Card key={level}>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium capitalize">{level}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{count}</div>
                <p className="text-xs text-muted-foreground">entries</p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Controls */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="text-lg">Filters & Options</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Search</label>
              <Input
                placeholder="Search message, module..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Level Filter</label>
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value as any)}
                className="w-full px-3 py-2 border border-input rounded-md bg-background"
              >
                <option value="all">All Levels</option>
                <option value="error">Errors</option>
                <option value="warn">Warnings</option>
                <option value="success">Success</option>
                <option value="info">Info</option>
                <option value="debug">Debug</option>
              </select>
            </div>
          </div>

          {summary && Object.keys(summary.byModule).length > 0 && (
            <div>
              <label className="block text-sm font-medium mb-2">Module Filter</label>
              <select
                value={moduleFilter}
                onChange={(e) => setModuleFilter(e.target.value)}
                className="w-full px-3 py-2 border border-input rounded-md bg-background"
              >
                <option value="">All Modules</option>
                {Object.keys(summary.byModule)
                  .sort()
                  .map((module) => (
                    <option key={module} value={module}>
                      {module}
                    </option>
                  ))}
              </select>
            </div>
          )}

          <div className="flex gap-2">
            <Button
              onClick={() => fetchLogs()}
              className="flex-1"
              variant="outline"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
            <Button
              onClick={() => setAutoRefresh(!autoRefresh)}
              variant={autoRefresh ? 'default' : 'outline'}
              className="flex-1"
            >
              {autoRefresh ? 'Auto-refresh ON' : 'Auto-refresh OFF'}
            </Button>
            <Button
              onClick={clearLogs}
              variant="destructive"
              className="flex-1"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Clear Logs
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Logs Table */}
      <Card>
        <CardHeader>
          <CardTitle>Log Entries</CardTitle>
          <CardDescription>{filteredLogs.length} entries</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8 text-muted-foreground">Loading logs...</div>
          ) : filteredLogs.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">No logs found</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-3 px-4 font-medium">Time</th>
                    <th className="text-left py-3 px-4 font-medium">Level</th>
                    <th className="text-left py-3 px-4 font-medium">Module</th>
                    <th className="text-left py-3 px-4 font-medium">Message</th>
                    <th className="text-left py-3 px-4 font-medium">Data</th>
                    <th className="text-left py-3 px-4 font-medium">Duration</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredLogs.map((log, index) => (
                    <tr key={index} className="border-b border-border hover:bg-muted/50 transition-colors">
                      <td className="py-3 px-4 text-xs text-muted-foreground">
                        {new Date(log.timestamp).toLocaleTimeString()}
                      </td>
                      <td className="py-3 px-4">
                        <Badge className={getLevelColor(log.level)}>
                          {log.level.toUpperCase()}
                        </Badge>
                      </td>
                      <td className="py-3 px-4 font-mono text-xs">{log.module}</td>
                      <td className="py-3 px-4">{log.message}</td>
                      <td className="py-3 px-4 text-xs text-muted-foreground">
                        {log.data && Object.keys(log.data).length > 0 ? (
                          <details className="cursor-pointer">
                            <summary className="underline">View</summary>
                            <pre className="mt-2 p-2 bg-muted rounded text-xs overflow-auto max-h-40">
                              {JSON.stringify(log.data, null, 2)}
                            </pre>
                          </details>
                        ) : (
                          '—'
                        )}
                      </td>
                      <td className="py-3 px-4 text-xs font-mono text-muted-foreground">
                        {log.duration ? `${log.duration}ms` : '—'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
