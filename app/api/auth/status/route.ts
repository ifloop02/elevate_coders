import { NextResponse } from 'next/server'

export async function GET() {
  return NextResponse.json({
    hasAdminPin: Boolean(process.env.ADMIN_PIN),
    adminPinLength: process.env.ADMIN_PIN?.length ?? 0,
    hasCoachPin: Boolean(process.env.COACH_PIN),
    coachPinLength: process.env.COACH_PIN?.length ?? 0,
    hasDbUrl: Boolean(process.env.DATABASE_URL),
    nodeEnv: process.env.NODE_ENV,
  })
}
