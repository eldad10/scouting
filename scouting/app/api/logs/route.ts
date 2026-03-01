import { logger } from '@/lib/logger'
import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams
  const action = searchParams.get('action') || 'all'
  const limit = parseInt(searchParams.get('limit') || '100')
  const module = searchParams.get('module')
  const level = searchParams.get('level')

  try {
    let data: any

    switch (action) {
      case 'summary':
        data = logger.getSummary()
        break
      case 'byModule':
        if (!module) {
          return NextResponse.json(
            { error: 'module parameter required for byModule action' },
            { status: 400 }
          )
        }
        data = logger.getLogsByModule(module, limit)
        break
      case 'byLevel':
        if (!level) {
          return NextResponse.json(
            { error: 'level parameter required for byLevel action' },
            { status: 400 }
          )
        }
        data = logger.getLogsByLevel(level as any, limit)
        break
      case 'all':
      default:
        data = logger.getLogs(limit)
    }

    return NextResponse.json(
      {
        action,
        limit,
        data,
        timestamp: new Date().toISOString(),
      },
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-store',
        },
      }
    )
  } catch (error) {
    logger.error('api/logs', 'Failed to retrieve logs', { error: String(error) })
    return NextResponse.json(
      { error: 'Failed to retrieve logs' },
      { status: 500 }
    )
  }
}

// Clear logs endpoint (POST)
export async function POST(req: NextRequest) {
  try {
    const { action } = await req.json()

    if (action === 'clear') {
      logger.clear()
      return NextResponse.json(
        { message: 'Logs cleared successfully' },
        { status: 200 }
      )
    }

    return NextResponse.json(
      { error: 'Unknown action' },
      { status: 400 }
    )
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to process request' },
      { status: 500 }
    )
  }
}
