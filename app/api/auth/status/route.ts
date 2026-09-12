import { NextResponse } from 'next/server'

export async function GET() {
  const adminPin = process.env.ADMIN_PIN ?? ''
  const coachPin = process.env.COACH_PIN ?? ''

  return NextResponse.json({
    hasAdminPin: Boolean(adminPin),
    adminPinLength: adminPin.length,
    adminStartsWithQuote: adminPin.startsWith('"') || adminPin.startsWith("'"),
    adminEndsWithQuote: adminPin.endsWith('"') || adminPin.endsWith("'"),
    adminFirstChar: adminPin[0],
    adminLastChar: adminPin[adminPin.length - 1],
    hasCoachPin: Boolean(coachPin),
    coachPinLength: coachPin.length,
    coachStartsWithQuote: coachPin.startsWith('"') || coachPin.startsWith("'"),
    coachEndsWithQuote: coachPin.endsWith('"') || coachPin.endsWith("'"),
    coachFirstChar: coachPin[0],
    coachLastChar: coachPin[coachPin.length - 1],
    hasDbUrl: Boolean(process.env.DATABASE_URL),
  })
}
