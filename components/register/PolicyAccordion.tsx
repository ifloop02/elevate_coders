'use client'

import { useState } from 'react'
import Link from 'next/link'
import { CheckCircle, Loader2, Tag, ShieldCheck } from 'lucide-react'

interface PolicyAccordionProps {
  agreed: boolean
  onAgree: (v: boolean) => void
  paymentMethod: 'ACH_ONLY' | 'ACH_AND_CREDIT_CARD'
  onPaymentMethodChange: (m: 'ACH_ONLY' | 'ACH_AND_CREDIT_CARD') => void
  discountCode: string
  onDiscountCodeChange: (code: string) => void
  discountPercent: number
  onDiscountResolved: (pct: number) => void
  selectedWeekCount: number
  onAddAllWeeks: () => void
}

export default function PolicyAccordion({
  agreed, onAgree,
  paymentMethod, onPaymentMethodChange,
  discountCode, onDiscountCodeChange,
  discountPercent, onDiscountResolved,
  selectedWeekCount,
  onAddAllWeeks,
}: PolicyAccordionProps) {
  const isFullProgram = selectedWeekCount >= 7
  const [checkingCode, setCheckingCode] = useState(false)
  const [codeError, setCodeError] = useState<string | null>(null)
  const [codeValid, setCodeValid] = useState(false)

  const applyDiscount = async () => {
    if (!discountCode.trim()) return
    setCheckingCode(true)
    setCodeError(null)
    setCodeValid(false)
    try {
      const res = await fetch(`/api/discount?code=${encodeURIComponent(discountCode.trim())}`)
      const data = await res.json()
      if (res.ok && data.discountPercent !== undefined) {
        onDiscountResolved(data.discountPercent)
        setCodeValid(true)
      } else {
        setCodeError(data.error || 'Invalid discount code.')
        onDiscountResolved(0)
      }
    } catch {
      setCodeError('Could not validate code. Please try again.')
    } finally {
      setCheckingCode(false)
    }
  }

  return (
    <div>
      <h2 style={{ fontFamily: 'Outfit, sans-serif', fontSize: '22px', fontWeight: 700, marginBottom: '8px' }}>
        Terms of Use, Camp Policies & Agreement
      </h2>
      <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginBottom: '24px' }}>
        Please review our legal terms, physical liability waiver, and refund policies below.
      </p>

      {/* Scrollable read-only policy box */}
      <div
        style={{
          maxHeight: '220px',
          overflowY: 'scroll',
          padding: '20px',
          background: 'var(--bg-subtle)',
          borderRadius: 'var(--radius-md)',
          border: '1px solid var(--border-light)',
          fontSize: '13px',
          lineHeight: 1.7,
          color: 'var(--text-secondary)',
          marginBottom: '24px',
        }}
      >
        <h3 style={{ fontFamily: 'Outfit, sans-serif', fontSize: '15px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '12px' }}>
          Terms of Use &amp; Camp Policies — Effective August 22, 2026
        </h3>

        <PolicySection title="1. Registration & Enrollment Prerequisites">
          Registration for upper-level or continuing tracks requires the student to have successfully completed the baseline Beginners Course or possess verified outside coding experience. Elevate Coders reserves the right to review registrations against internal student data.
        </PolicySection>

        <PolicySection title="2. Attendance & Multi-Track Cohorts">
          Parents choose between Track A (Co-Ed) and Track B (All-Girls). Programming is structured week-by-week; regular attendance is strongly encouraged to reach core technical milestones.
        </PolicySection>

        <PolicySection title="3. Dynamic Vacation Tracking & Prorated Billing">
          Parents may log planned travel dates during checkout. The application computes a prorated balance that modifies the invoice payload. Adjustments cannot be made retroactively once locked.
        </PolicySection>

        <PolicySection title="4. Invoicing, Payments & Discounts">
          Invoices are issued via Gusto/Melio set to &quot;Due Immediately.&quot; Payment options follow your selection (ACH Only or ACH + Credit Card). Unpaid invoices may forfeit student seat placement.
        </PolicySection>

        <PolicySection title="5. Bring-a-Friend Referral Program">
          Unique referral tracking links generate partial account credits when new families register. Credits hold no cash value and are non-transferable.
        </PolicySection>

        <PolicySection title="6. Physical Liability Waiver & Hold Harmless Agreement">
          <strong>Assumption of Risk:</strong> Enrolling in in-person programs acknowledges that minor physical mishaps (slipping, tripping, falling) are inherent risks of group activities.<br />
          <strong>Release of Liability:</strong> You agree to release, waive, discharge, and hold harmless Elevate Coders, owners, instructors, and staff from any claims, demands, or liabilities for personal accidental injury or property damage sustained while participating.
        </PolicySection>

        <PolicySection title="7. Refund, Cancellation & Week-Change Policy">
          <strong>7+ Days Prior:</strong> Cancellations made 7 or more full days before camp start receive a full refund.<br />
          <strong>Under 7 Days:</strong> Cancellations under 7 days are non-refundable.<br />
          <strong>Credit Alternatives:</strong> Late cancellations receive no cash/card refund, but Elevate Coders may issue internal account credit toward future tracks at its sole discretion.
        </PolicySection>

        <PolicySection title="8. Legal, Liability & Tax Compliance">
          0% service tax under Cal. Rev. &amp; Tax. Code §6361. Classroom safety rules must be followed; severe misconduct may result in removal. Media release opt-out requests can be submitted prior to start.
        </PolicySection>

        <PolicySection title="9. Privacy Policy & COPPA Compliance">
          We strictly comply with COPPA. We collect parent/guardian contact info, student name/age, and health/allergy notes solely for internal camp safety and operations. Financial data is never stored on our servers.
        </PolicySection>
      </div>

      {/* Payment method selection */}
      <div style={{ marginBottom: '24px' }}>
        <div style={{ fontWeight: 600, fontSize: '15px', marginBottom: '12px' }}>Invoice Payment Options</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {[
            { value: 'ACH_ONLY', label: 'ACH Bank Transfer Only', note: 'Fastest, no processing fee' },
            { value: 'ACH_AND_CREDIT_CARD', label: 'ACH + Credit Card', note: 'Includes credit/debit card option on invoice' },
          ].map((opt) => (
            <label
              key={opt.value}
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: '10px',
                padding: '14px 16px',
                border: `1.5px solid ${paymentMethod === opt.value ? 'var(--brand-purple)' : 'var(--border-light)'}`,
                borderRadius: 'var(--radius-md)',
                cursor: 'pointer',
                background: paymentMethod === opt.value ? 'var(--bg-subtle)' : 'var(--bg-white)',
                transition: 'all var(--transition-fast)',
              }}
            >
              <input
                type="radio"
                name="paymentMethod"
                value={opt.value}
                checked={paymentMethod === opt.value}
                onChange={() => onPaymentMethodChange(opt.value as 'ACH_ONLY' | 'ACH_AND_CREDIT_CARD')}
                style={{ marginTop: '2px', accentColor: 'var(--brand-purple)' }}
              />
              <div>
                <div style={{ fontWeight: 500, fontSize: '14px' }}>{opt.label}</div>
                <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{opt.note}</div>
              </div>
            </label>
          ))}
        </div>
      </div>

      {/* Discount code — only available for full 7-week enrollment */}
      <div style={{ marginBottom: '28px' }}>
        <div style={{ fontWeight: 600, fontSize: '15px', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Tag size={15} color={isFullProgram ? 'var(--brand-purple)' : 'var(--text-muted)'} />
          Discount / Partner Code
        </div>
        {isFullProgram ? (
          <>
            <div style={{ display: 'flex', gap: '10px', maxWidth: '400px' }}>
              <input
                id="discount-code"
                className={`form-input ${codeError ? 'error' : ''}`}
                type="text"
                placeholder="e.g. PARTNER75"
                value={discountCode}
                onChange={(e) => { onDiscountCodeChange(e.target.value.toUpperCase()); setCodeValid(false); setCodeError(null); onDiscountResolved(0) }}
                style={{ flex: 1 }}
              />
              <button
                onClick={applyDiscount}
                className="btn btn-secondary btn-sm"
                disabled={!discountCode.trim() || checkingCode}
              >
                {checkingCode ? <Loader2 size={14} className="animate-spin" /> : 'Apply'}
              </button>
            </div>
            {codeError && <div className="form-error">{codeError}</div>}
            {codeValid && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '6px', fontSize: '13px', color: '#10B981' }}>
                <CheckCircle size={14} />
                {discountPercent}% discount applied!
              </div>
            )}
          </>
        ) : (
          <div style={{
            padding: '12px 16px',
            background: '#F9FAFB',
            border: '1.5px solid var(--border-light)',
            borderRadius: 'var(--radius-md)',
            fontSize: '13px',
            color: 'var(--text-muted)',
            maxWidth: '400px',
            lineHeight: 1.6,
          }}>
            Discount and partner codes are only available for the full 7-week program.{' '}
            <a
              href="#"
              onClick={(e) => { e.preventDefault(); onAddAllWeeks() }}
              style={{ color: 'var(--brand-purple)', fontWeight: 600, textDecoration: 'none' }}
            >
              Add all 7 weeks
            </a>
            {' '}to unlock this field.
          </div>
        )}
      </div>

      {/* Mandatory policy agreement checkbox */}
      <label
        style={{
          display: 'flex',
          alignItems: 'flex-start',
          gap: '12px',
          padding: '18px 20px',
          background: agreed ? 'var(--bg-subtle)' : 'var(--bg-white)',
          border: `2px solid ${agreed ? 'var(--brand-purple)' : 'var(--border-light)'}`,
          borderRadius: 'var(--radius-md)',
          cursor: 'pointer',
          transition: 'all var(--transition-fast)',
        }}
      >
        <input
          id="policy-agree"
          type="checkbox"
          checked={agreed}
          onChange={(e) => onAgree(e.target.checked)}
          style={{ marginTop: '3px', accentColor: 'var(--brand-purple)', width: '18px', height: '18px', cursor: 'pointer' }}
        />
        <span style={{ fontSize: '14px', lineHeight: 1.6, color: 'var(--text-primary)' }}>
          I certify that I am the parent or legal guardian, and I explicitly agree to the{' '}
          <Link href="/terms" target="_blank" style={{ color: 'var(--brand-purple)', fontWeight: 700, textDecoration: 'underline' }}>
            Terms of Use &amp; Camp Policies
          </Link>{' '}
          (including the Physical Liability Waiver and Refund Policy) and{' '}
          <Link href="/privacy" target="_blank" style={{ color: 'var(--brand-purple)', fontWeight: 700, textDecoration: 'underline' }}>
            Privacy Policy
          </Link>.
        </span>
      </label>
    </div>
  )
}

function PolicySection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: '16px' }}>
      <h4 style={{ fontFamily: 'Outfit, sans-serif', fontSize: '13px', fontWeight: 700, marginBottom: '4px', color: 'var(--text-primary)' }}>
        {title}
      </h4>
      <p style={{ fontSize: '12px', lineHeight: 1.6, color: 'var(--text-secondary)', margin: 0 }}>
        {children}
      </p>
    </div>
  )
}
