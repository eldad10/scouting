type LogLevel = 'info' | 'warn' | 'error' | 'debug' | 'success'

interface LogEntry {
  timestamp: string
  level: LogLevel
  module: string
  message: string
  data?: any
  duration?: number
}

const isDevelopment = process.env.NODE_ENV === 'development'
const logs: LogEntry[] = []
const MAX_LOGS = 500 // Keep last 500 logs in memory

const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  dim: '\x1b[2m',
  info: '\x1b[36m', // cyan
  warn: '\x1b[33m', // yellow
  error: '\x1b[31m', // red
  debug: '\x1b[35m', // magenta
  success: '\x1b[32m', // green
}

function formatTimestamp(): string {
  return new Date().toISOString()
}

function getColorCode(level: LogLevel): string {
  switch (level) {
    case 'info':
      return colors.info
    case 'warn':
      return colors.warn
    case 'error':
      return colors.error
    case 'debug':
      return colors.debug
    case 'success':
      return colors.success
    default:
      return colors.reset
  }
}

function addLog(entry: LogEntry) {
  logs.push(entry)
  if (logs.length > MAX_LOGS) {
    logs.shift()
  }
}

function formatConsoleOutput(entry: LogEntry): string {
  const color = getColorCode(entry.level)
  const levelUpper = entry.level.toUpperCase().padEnd(7)
  const module = `[${entry.module}]`.padEnd(20)
  let output = `${colors.dim}${entry.timestamp}${colors.reset} ${color}${levelUpper}${colors.reset} ${module} ${entry.message}`

  if (entry.data && Object.keys(entry.data).length > 0) {
    output += ` ${colors.dim}${JSON.stringify(entry.data)}${colors.reset}`
  }

  if (entry.duration !== undefined) {
    output += ` ${colors.dim}(${entry.duration}ms)${colors.reset}`
  }

  return output
}

export const logger = {
  info(module: string, message: string, data?: any) {
    const entry: LogEntry = {
      timestamp: formatTimestamp(),
      level: 'info',
      module,
      message,
      data,
    }
    addLog(entry)
    if (isDevelopment) {
      console.log(formatConsoleOutput(entry))
    }
  },

  warn(module: string, message: string, data?: any) {
    const entry: LogEntry = {
      timestamp: formatTimestamp(),
      level: 'warn',
      module,
      message,
      data,
    }
    addLog(entry)
    console.warn(formatConsoleOutput(entry))
  },

  error(module: string, message: string, data?: any) {
    const entry: LogEntry = {
      timestamp: formatTimestamp(),
      level: 'error',
      module,
      message,
      data,
    }
    addLog(entry)
    console.error(formatConsoleOutput(entry))
  },

  debug(module: string, message: string, data?: any) {
    const entry: LogEntry = {
      timestamp: formatTimestamp(),
      level: 'debug',
      module,
      message,
      data,
    }
    addLog(entry)
    if (isDevelopment) {
      console.debug(formatConsoleOutput(entry))
    }
  },

  success(module: string, message: string, data?: any) {
    const entry: LogEntry = {
      timestamp: formatTimestamp(),
      level: 'success',
      module,
      message,
      data,
    }
    addLog(entry)
    if (isDevelopment) {
      console.log(formatConsoleOutput(entry))
    }
  },

  // For tracking request/function timing
  time(module: string, label: string): () => void {
    const startTime = performance.now()
    return () => {
      const duration = Math.round(performance.now() - startTime)
      const entry: LogEntry = {
        timestamp: formatTimestamp(),
        level: 'debug',
        module,
        message: label,
        duration,
      }
      addLog(entry)
      if (isDevelopment) {
        console.log(formatConsoleOutput(entry))
      }
    }
  },

  // Get all logs
  getLogs(limit: number = 100): LogEntry[] {
    return logs.slice(-limit)
  },

  // Get logs by level
  getLogsByLevel(level: LogLevel, limit: number = 100): LogEntry[] {
    return logs.filter((log) => log.level === level).slice(-limit)
  },

  // Get logs by module
  getLogsByModule(module: string, limit: number = 100): LogEntry[] {
    return logs.filter((log) => log.module === module).slice(-limit)
  },

  // Clear all logs
  clear() {
    logs.length = 0
  },

  // Get logs summary
  getSummary() {
    const summary = {
      total: logs.length,
      byLevel: {
        info: 0,
        warn: 0,
        error: 0,
        debug: 0,
        success: 0,
      },
      byModule: {} as Record<string, number>,
    }

    logs.forEach((log) => {
      summary.byLevel[log.level]++
      summary.byModule[log.module] = (summary.byModule[log.module] || 0) + 1
    })

    return summary
  },
}
