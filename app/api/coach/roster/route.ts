import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { checkRateLimit, getClientIP } from '@/lib/ratelimit'

export async function GET(request: NextRequest) {
  // ─── PIN from header only (never from URL query param) ────────────
  const pin = (request.headers.get('x-coach-pin') || '').trim()

  // ─── Env var check ────────────────────────────────────────────────
  const expectedPin = process.env.COACH_PIN?.trim()
  if (!expectedPin) {
    console.error('[SECURITY] COACH_PIN env var is not configured. Coach access is disabled.')
    return NextResponse.json(
      { error: 'Coach access is not configured. Please set COACH_PIN in your environment variables.' },
      { status: 503 }
    )
  }

  // ─── Rate limiting: 5 PIN attempts per IP per 10 minutes ─────────
  const ip = getClientIP(request)
  const rl = checkRateLimit(`coach-pin:${ip}`, 5, 10 * 60 * 1000)
  if (!rl.success) {
    return NextResponse.json(
      { error: 'Too many access attempts. Please wait 10 minutes and try again.' },
      { status: 429 }
    )
  }

  if (pin !== expectedPin) {
    return NextResponse.json({ error: 'Unauthorized. Invalid coach PIN.' }, { status: 401 })
  }

  // Query with explicit field selection — strips ALL financial data
  const registrations = await prisma.registration.findMany({
    where: {
      status: { in: ['CONFIRMED', 'TRAVELING_PACKET_NEEDED'] },
    },
    select: {
      id: true,
      track: true,
      status: true,
      student: {
        select: {
          firstName: true,
          lastName: true,
          age: true,
          allergies: true,
          medicalNotes: true,
          track: true,
          // ❌ NO: completedBeginnerCourse, hasVerifiedOutsideExp — not relevant to coach
        },
      },
      parent: {
        select: {
          legalName: true,
          phone: true,  // Emergency backup contact
          // ❌ NO: email, referralCode, marketingOptIn, hasUsedReferralLink
        },
      },
      selectedWeeks: {
        select: {
          weekBlock: {
            select: {
              weekNumber: true,
              startDate: true,
              endDate: true,
              curriculumLabel: true,
              startTime: true,
              endTime: true,
            },
          },
          // ❌ NO: adjustedPrice — financial data stripped
        },
      },
      vacationDays: {
        select: {
          missedDate: true,
          weekNumber: true,
          reason: true,
          // ❌ NO: proratedCredit — financial data stripped
        },
      },
      // ❌ NO: baseTotal, proratedTotal, discountAmount, finalTotal, discountCodeId, invoicePayload
    },
    orderBy: [
      { track: 'asc' },
      { student: { lastName: 'asc' } },
    ],
  })

  return NextResponse.json({ roster: registrations, generatedAt: new Date().toISOString() })
}
