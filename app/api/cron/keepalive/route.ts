import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    // Ultra-lightweight query to keep Supabase database active
    const sample = await prisma.discountCode.findFirst({
      select: { id: true },
    })

    return NextResponse.json({
      status: 'active',
      timestamp: new Date().toISOString(),
      databaseConnected: true,
      hasRecords: Boolean(sample),
    })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Database ping failed'
    console.error('Keep-alive cron ping error:', message)
    return NextResponse.json(
      { status: 'error', error: message, timestamp: new Date().toISOString() },
      { status: 500 }
    )
  }
}
