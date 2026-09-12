// lib/invoice.ts — Elevate Coders invoice payload builder (v2)

import type { Registration, Parent, Student, RegistrationWeek, WeekBlock } from '@prisma/client'

export interface InvoiceLineItem {
  description: string
  quantity: number
  unitPrice: number
  discount: number
  lineTotal: number
}

export interface GustoMelioPayload {
  invoice: {
    externalId: string
    dueDate: 'immediate'
    customer: {
      legalName: string
      email: string
      phone: string
    }
    lineItems: InvoiceLineItem[]
    subtotal: number
    vacationCredit: number
    discountAmount: number
    tax: number
    taxNote: string
    total: number
    paymentOptions: ('ACH' | 'CREDIT_CARD')[]
    notes: string
    metadata: {
      track: string
      campSeason: string
      studentName: string
      registrationId: string
      policyAgreedAt: string | null
    }
  }
}

export type SelectedWeekItem = RegistrationWeek & { weekBlock: WeekBlock }

export type RegistrationWithRelations = Registration & {
  parent: Parent
  student: Student
  selectedWeeks: SelectedWeekItem[]
}

export function buildInvoicePayload(
  registration: RegistrationWithRelations,
  discountPercent: number = 0
): GustoMelioPayload {
  const { parent, student, selectedWeeks } = registration

  const lineItems: InvoiceLineItem[] = selectedWeeks.map((rw: SelectedWeekItem) => {
    const week = rw.weekBlock
    const weekDiscount = week.pricePerUnit * (discountPercent / 100)
    return {
      description: `${week.curriculumLabel} — Week ${week.weekNumber} (${formatDate(week.startDate)}–${formatDate(week.endDate)})`,
      quantity: 1,
      unitPrice: week.pricePerUnit,
      discount: weekDiscount,
      lineTotal: rw.adjustedPrice,
    }
  })

  const subtotal = selectedWeeks.reduce((sum: number, rw: SelectedWeekItem) => sum + rw.weekBlock.pricePerUnit, 0)
  const paymentOptions: ('ACH' | 'CREDIT_CARD')[] =
    registration.paymentMethod === 'ACH_AND_CREDIT_CARD' ? ['ACH', 'CREDIT_CARD'] : ['ACH']

  return {
    invoice: {
      externalId: `EC-2026-${registration.id}`,
      dueDate: 'immediate',
      customer: {
        legalName: parent.legalName,
        email: parent.email,
        phone: parent.phone,
      },
      lineItems,
      subtotal,
      vacationCredit: registration.baseTotal - registration.proratedTotal,
      discountAmount: registration.discountAmount,
      tax: 0,
      taxNote: 'California Educational Services — 0% Sales Tax (Cal. Rev. & Tax. Code §6361)',
      total: registration.finalTotal,
      paymentOptions,
      notes: `Elevate Coders Fall 2026 — ${registration.track === 'COED' ? 'Co-Ed Coding Camp' : 'All-Girls Coding Camp'}. Curriculum is cumulative; attendance in all selected weeks is strongly encouraged.`,
      metadata: {
        track: registration.track,
        campSeason: 'FALL_2026',
        studentName: `${student.firstName} ${student.lastName}`,
        registrationId: registration.id,
        policyAgreedAt: registration.policyAgreedAt?.toISOString() ?? null,
      },
    },
  }
}

function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric' }).format(new Date(date))
}
