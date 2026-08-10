// lib/proration.ts — Week and vacation day price calculator

export const PRICE_PER_WEEK = 200.0
export const DAYS_PER_WEEK = 5
export const PRICE_PER_DAY = PRICE_PER_WEEK / DAYS_PER_WEEK // $40/day

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
  const baseTotal = selectedWeekCount * PRICE_PER_WEEK
  const vacationCredit = vacationDayCount * PRICE_PER_DAY
  const proratedTotal = Math.max(0, baseTotal - vacationCredit)
  const discountAmount = proratedTotal * (discountPercent / 100)
  const finalTotal = Math.max(0, proratedTotal - discountAmount)

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
