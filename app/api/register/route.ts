import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { RegistrationSubmitSchema } from '@/lib/validation'
import { calculatePricing } from '@/lib/proration'
import { buildInvoicePayload } from '@/lib/invoice'
import { sendRegistrationAlert } from '@/lib/email'
import { getSessionById } from '@/lib/curriculum'
import type { WeekBlock } from '@prisma/client'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // ─── 1. Zod validation ───────────────────────────────────────
    const parsed = RegistrationSubmitSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: parsed.error.flatten() },
        { status: 400 }
      )
    }

    const { parent, student, weekSelection, paymentMethod, discountCode, policyAgreed } = parsed.data

    // ─── 2. Resolve and ensure week blocks ─────────────────────────
    const weekBlocks: WeekBlock[] = []
    for (const id of weekSelection.weekBlockIds) {
      const session = getSessionById(id)
      const isLevel2 = id.includes('lvl2') || id.includes('advanced')
      const weekNum = session?.weekNumber ?? (parseInt(id.split('-').pop() || '1') || 1)
      const title = session?.title ?? (isLevel2 ? `Level 2 Session ${weekNum}` : `Beginner Session ${weekNum}`)
      const date = session ? new Date(session.date) : new Date('2026-10-08')

      const block = await prisma.weekBlock.upsert({
        where: { id },
        create: {
          id,
          weekNumber: weekNum,
          season: 'FALL',
          year: 2026,
          startDate: date,
          endDate: date,
          dayOfWeek: 'Thursday',
          startTime: session?.startTime ?? (isLevel2 ? '19:00' : '17:00'),
          endTime: session?.endTime ?? (isLevel2 ? '20:00' : '18:00'),
          curriculumLabel: title,
          description: session?.project ?? session?.concept ?? '',
          requiresPrerequisite: isLevel2,
          level: isLevel2 ? 'INTERMEDIATE' : 'BEGINNER',
          pricePerUnit: session?.pricePerUnit ?? 28.57,
          isActive: true,
          track: null,
        },
        update: {
          curriculumLabel: title,
          weekNumber: weekNum,
          description: session?.project ?? session?.concept ?? '',
        },
      })
      weekBlocks.push(block)
    }

    // ─── 3. Prerequisite check ────────────────────────────────────
    const requiresPrereq = weekBlocks.some((w) => w.requiresPrerequisite)
    if (requiresPrereq && !student.completedBeginnerCourse && !student.hasVerifiedOutsideExp) {
      return NextResponse.json(
        {
          error: 'Prerequisite required. Selected weeks include Python content (Weeks 5–8) which requires completion of the Beginners Course or verified outside experience.',
        },
        { status: 403 }
      )
    }

    // ─── 4. Resolve discount code ─────────────────────────────────
    let discountPercent = 0
    let discountCodeRecord = null

    if (discountCode) {
      discountCodeRecord = await prisma.discountCode.findFirst({
        where: {
          code: discountCode.toUpperCase(),
          isActive: true,
        },
      })

      // Simplified check without self-referential OR
      discountCodeRecord = await prisma.discountCode.findFirst({
        where: {
          code: discountCode.toUpperCase(),
          isActive: true,
        },
      })

      if (discountCodeRecord) {
        if (discountCodeRecord.expiresAt && discountCodeRecord.expiresAt < new Date()) {
          return NextResponse.json({ error: 'This discount code has expired.' }, { status: 400 })
        }
        if (discountCodeRecord.usageLimit !== null && discountCodeRecord.usedCount >= discountCodeRecord.usageLimit) {
          return NextResponse.json({ error: 'This discount code has reached its usage limit.' }, { status: 400 })
        }
        discountPercent = discountCodeRecord.discountPercent
      } else {
        return NextResponse.json({ error: 'Invalid discount code.' }, { status: 400 })
      }
    }

    // ─── 5. Calculate pricing ─────────────────────────────────────
    const vacationDayCount = weekSelection.vacationDates?.length ?? 0
    const pricing = calculatePricing(weekBlocks.length, vacationDayCount, discountPercent)

    // ─── 6. Upsert parent ─────────────────────────────────────────
    let referredById: string | null = null
    if (parent.referralCode) {
      const referrer = await prisma.parent.findFirst({
        where: { referralCode: parent.referralCode },
      })
      if (referrer) referredById = referrer.id
    }

    const parentRecord = await prisma.parent.upsert({
      where: { email: parent.email },
      create: {
        legalName: parent.legalName,
        email: parent.email,
        phone: parent.phone,
        marketingOptIn: parent.marketingOptIn,
        photoMediaOptIn: parent.photoMediaOptIn,
        referredByCode: parent.referralCode || null,
        referredById,
        hasUsedReferralLink: !!parent.referralCode,
      },
      update: {
        legalName: parent.legalName,
        phone: parent.phone,
        marketingOptIn: parent.marketingOptIn,
        photoMediaOptIn: parent.photoMediaOptIn,
      },
    })

    // ─── 7. Create student ────────────────────────────────────────
    const dob = new Date(student.dateOfBirth)
    const age = new Date().getFullYear() - dob.getFullYear()

    const studentRecord = await prisma.student.create({
      data: {
        firstName: student.firstName,
        lastName: student.lastName,
        dateOfBirth: dob,
        age,
        allergies: student.allergies || null,
        medicalNotes: student.medicalNotes || null,
        track: student.track as 'COED' | 'ALL_GIRLS',
        completedBeginnerCourse: student.completedBeginnerCourse,
        beginnerCourseYear: student.beginnerCourseYear || null,
        hasVerifiedOutsideExp: student.hasVerifiedOutsideExp,
        outsideExpDescription: student.outsideExpDescription || null,
        parentId: parentRecord.id,
      },
    })

    // ─── 8. Create registration ───────────────────────────────────
    const registration = await prisma.registration.create({
      data: {
        parentId: parentRecord.id,
        studentId: studentRecord.id,
        track: student.track as 'COED' | 'ALL_GIRLS',
        status: vacationDayCount > 0 ? 'TRAVELING_PACKET_NEEDED' : 'CONFIRMED',
        paymentMethod: paymentMethod as 'ACH_ONLY' | 'ACH_AND_CREDIT_CARD',
        baseTotal: pricing.baseTotal,
        proratedTotal: pricing.proratedTotal,
        discountAmount: pricing.discountAmount,
        finalTotal: pricing.finalTotal,
        discountCodeId: discountCodeRecord?.id || null,
        policyAgreedAt: policyAgreed ? new Date() : null,
        selectedWeeks: {
          create: weekBlocks.map((week) => {
            // Calculate per-week adjusted price accounting for vacation days in this week
            const vacDaysThisWeek = (weekSelection.vacationDates ?? []).filter(
              (v) => v.weekNumber === week.weekNumber
            ).length
            const adjustedPrice = week.pricePerUnit - vacDaysThisWeek * 40
            return {
              weekBlockId: week.id,
              adjustedPrice: Math.max(0, adjustedPrice),
            }
          }),
        },
        vacationDays: vacationDayCount > 0
          ? {
              create: (weekSelection.vacationDates ?? []).map((v) => ({
                missedDate: new Date(v.date),
                weekNumber: v.weekNumber,
                proratedCredit: 40,
                reason: v.reason || null,
              })),
            }
          : undefined,
      },
      include: {
        parent: true,
        student: true,
        selectedWeeks: { include: { weekBlock: true } },
      },
    })

    // ─── 9. Increment discount code usage ─────────────────────────
    if (discountCodeRecord) {
      await prisma.discountCode.update({
        where: { id: discountCodeRecord.id },
        data: { usedCount: { increment: 1 } },
      })
    }

    // ─── 10. Referral ledger ──────────────────────────────────────
    if (referredById) {
      await prisma.referralLedger.create({
        data: {
          referrerId: referredById,
          referredId: parentRecord.id,
          creditAmount: 25,
          status: 'PENDING',
        },
      })
    }

    // ─── 11. Build & store invoice payload ────────────────────────
    const payload = buildInvoicePayload(registration, discountPercent)

    await prisma.invoicePayload.create({
      data: {
        registrationId: registration.id,
        externalId: payload.invoice.externalId,
        payload: payload as object,
        deliveryStatus: 'PENDING',
      },
    })

    // ─── 12. (Optional) Dispatch to Melio webhook ─────────────────
    const melioUrl = process.env.MELIO_WEBHOOK_URL
    if (melioUrl) {
      try {
        await fetch(melioUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        })
        await prisma.invoicePayload.update({
          where: { registrationId: registration.id },
          data: { deliveryStatus: 'SENT', sentAt: new Date() },
        })
      } catch (err) {
        console.error('Melio webhook failed:', err)
        await prisma.invoicePayload.update({
          where: { registrationId: registration.id },
          data: { deliveryStatus: 'FAILED', errorMessage: String(err) },
        })
      }
    }

    // ─── 13. Dispatch business email alert ────────────────────────
    sendRegistrationAlert({
      registrationId: registration.id,
      studentName: `${studentRecord.firstName} ${studentRecord.lastName}`,
      studentAge: studentRecord.age,
      track: registration.track,
      parentName: parentRecord.legalName,
      parentEmail: parentRecord.email,
      parentPhone: parentRecord.phone,
      selectedWeekNumbers: weekBlocks.map((w) => w.weekNumber),
      finalTotal: pricing.finalTotal,
      paymentMethod: registration.paymentMethod,
      vacationDaysCount: vacationDayCount,
      discountCode: discountCodeRecord?.code,
    }).catch((err) => console.error('Failed to send business alert email:', err))

    return NextResponse.json({
      success: true,
      registrationId: registration.id,
      invoicePayload: payload,
      confirmationUrl: `${process.env.NEXT_PUBLIC_APP_URL}/register/confirmation?id=${registration.id}`,
    })
  } catch (error) {
    const isDev = process.env.NODE_ENV === 'development'
    console.error('Registration error:', error)
    return NextResponse.json(
      {
        error: isDev
          ? `Registration failed: ${error instanceof Error ? error.message : String(error)}`
          : 'An unexpected error occurred. Please try again or contact support.',
      },
      { status: 500 }
    )
  }
}
