// lib/proration.ts — 7-Week Fall Program Tuition & Proration Calculator

export const PROGRAM_TOTAL_TUITION = 200.0 // $200 total for the full 7-week Fall program
export const TOTAL_PROGRAM_WEEKS = 7
export const PRICE_PER_SESSION = PROGRAM_TOTAL_TUITION / TOTAL_PROGRAM_WEEKS // ~$28.57 per Thursday session
export const VACATION_CREDIT_PER_SESSION = PRICE_PER_SESSION

export interface PricingBreakdown {
  selectedWeeks: number
  totalVacationDays: number
  baseTotal: number
  vacationCredit: number
  proratedTotal: number
  discountPercent: number
  discountAmount: number
  finalTotal: number
}

export function calculatePricing(
  selectedWeekCount: number,
  vacationDayCount: number,
  discountPercent: number = 0
): PricingBreakdown {
  // If all 7 weeks selected, base total is $200. Otherwise proportional at ~$28.57/session
  const baseTotal = selectedWeekCount === TOTAL_PROGRAM_WEEKS
    ? PROGRAM_TOTAL_TUITION
    : Number((selectedWeekCount * PRICE_PER_SESSION).toFixed(2))

  const vacationCredit = Number((vacationDayCount * VACATION_CREDIT_PER_SESSION).toFixed(2))
  const proratedTotal = Math.max(0, baseTotal - vacationCredit)
  const discountAmount = Number((proratedTotal * (discountPercent / 100)).toFixed(2))
  const finalTotal = Math.max(0, Number((proratedTotal - discountAmount).toFixed(2)))

  return {
    selectedWeeks: selectedWeekCount,
    totalVacationDays: vacationDayCount,
    baseTotal,
    vacationCredit,
    proratedTotal,
    discountPercent,
    discountAmount,
    finalTotal,
  }
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
  }).format(amount)
}
