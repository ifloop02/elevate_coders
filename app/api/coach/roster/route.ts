import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  // PIN gate — check Authorization header or query param
  const { searchParams } = new URL(request.url)
  const pin = searchParams.get('pin') || request.headers.get('x-coach-pin')

  if (pin !== process.env.COACH_PIN) {
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
