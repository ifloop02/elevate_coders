'use client'

import { formatCurrency, PricingBreakdown } from '@/lib/proration'
import { Receipt } from 'lucide-react'

interface Week {
  weekNumber: number
  dates: string
  curriculum: string
  requiresPrerequisite: boolean
}

interface PricingSummaryProps {
  pricing: PricingBreakdown
  selectedWeeks: Week[]
  track: 'COED' | 'ALL_GIRLS' | null
}

export default function PricingSummary({ pricing, selectedWeeks, track }: PricingSummaryProps) {
  return (
    <div className="pricing-panel">
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px' }}>
        <Receipt size={18} color="rgba(255,255,255,0.7)" />
        <span style={{ fontWeight: 600, fontSize: '14px', color: 'rgba(255,255,255,0.7)' }}>
          Pricing Summary
        </span>
      </div>

      {/* Track badge */}
      {track && (
        <div style={{
          display: 'inline-flex', alignItems: 'center',
          background: 'rgba(255,255,255,0.1)', color: 'white',
          fontSize: '11px', fontWeight: 700, letterSpacing: '0.06em',
          padding: '4px 10px', borderRadius: 'var(--radius-full)', marginBottom: '16px',
        }}>
          {track === 'COED' ? '👥 Co-Ed Track' : '✨ All-Girls Track'}
        </div>
      )}

      {/* Week line items */}
      {selectedWeeks.length > 0 ? (
        <div style={{ marginBottom: '12px' }}>
          {selectedWeeks.map((w) => (
            <div key={w.weekNumber} className="pricing-line">
              <span>Week {w.weekNumber}</span>
              <span>$200</span>
            </div>
          ))}
        </div>
      ) : (
        <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.4)', marginBottom: '12px', fontStyle: 'italic' }}>
          No weeks selected yet
        </div>
      )}

      {/* Price breakdown */}
      <div className="pricing-line">
        <span>Subtotal ({pricing.selectedWeeks} weeks)</span>
        <span>{formatCurrency(pricing.baseTotal)}</span>
      </div>

      {pricing.vacationCredit > 0 && (
        <div className="pricing-line">
          <span>Vacation credit ({pricing.totalVacationDays} days)</span>
          <span className="credit">−{formatCurrency(pricing.vacationCredit)}</span>
        </div>
      )}

      {pricing.discountAmount > 0 && (
        <div className="pricing-line">
          <span>Discount ({pricing.discountPercent}% off)</span>
          <span className="credit">−{formatCurrency(pricing.discountAmount)}</span>
        </div>
      )}

      <div className="pricing-line">
        <span>Sales Tax</span>
        <span style={{ color: '#34D399' }}>$0.00</span>
      </div>

      <div className="pricing-line total">
        <span>Total Due</span>
        <span>{formatCurrency(pricing.finalTotal)}</span>
      </div>

      <div style={{ marginTop: '16px', padding: '10px', background: 'rgba(255,255,255,0.06)', borderRadius: 'var(--radius-sm)', fontSize: '11px', color: 'rgba(255,255,255,0.5)', lineHeight: 1.5 }}>
        Invoice sent via Gusto. No credit card data stored on our servers.
        California Educational Services — 0% Sales Tax.
      </div>
    </div>
  )
}
