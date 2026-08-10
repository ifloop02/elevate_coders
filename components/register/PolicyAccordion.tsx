'use client'

import { useState } from 'react'
import { CheckCircle, Loader2, Tag } from 'lucide-react'

interface PolicyAccordionProps {
  agreed: boolean
  onAgree: (v: boolean) => void
  paymentMethod: 'ACH_ONLY' | 'ACH_AND_CREDIT_CARD'
  onPaymentMethodChange: (m: 'ACH_ONLY' | 'ACH_AND_CREDIT_CARD') => void
  discountCode: string
  onDiscountCodeChange: (code: string) => void
  discountPercent: number
  onDiscountResolved: (pct: number) => void
}

export default function PolicyAccordion({
  agreed, onAgree,
  paymentMethod, onPaymentMethodChange,
  discountCode, onDiscountCodeChange,
  discountPercent, onDiscountResolved,
}: PolicyAccordionProps) {
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
        Camp Policies & Agreement
      </h2>
      <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginBottom: '24px' }}>
        Please read the TeamCoders Camp Policies carefully before agreeing.
      </p>

      {/* Policy scrollbox */}
      <div className="policy-scroll" style={{ marginBottom: '28px' }}>
        <h3 style={{ fontFamily: 'Outfit, sans-serif', fontSize: '16px', fontWeight: 700, marginBottom: '16px' }}>
          TeamCoders Camp Policies & Guidelines — Summer 2026
        </h3>

        <PolicySection title="1. Cumulative Attendance">
          The Elevate Coders summer curriculum is designed as a cumulative, week-over-week program. Each week
          builds directly upon the prior week&apos;s content in Scratch and Python programming. While families may
          register for any combination of weeks, we strongly encourage continuous attendance for the most
          effective learning experience. Students who miss consecutive weeks may experience gaps in foundational
          knowledge. In cases of travel, a learning packet will be prepared and arranged for pickup or digital
          delivery.
        </PolicySection>

        <PolicySection title="2. California Educational Services — 0% Sales Tax">
          Elevate Coders / TeamCoders is operated as an educational services provider under California Revenue
          and Taxation Code §6361. Charges for educational instruction are exempt from California state sales
          tax. Your invoice will reflect a $0.00 tax line with this notation. This exemption applies to all
          standard weekly camp tuition. Merchandise or non-instructional add-ons, if offered in the future,
          may be subject to standard rates.
        </PolicySection>

        <PolicySection title="3. Photo & Media Opt-Out Policy">
          Elevate Coders may photograph or record students during camp sessions for use in marketing materials,
          social media, and website content. By default, enrollment constitutes consent to this use. Parents
          who do NOT wish their child to be photographed or recorded must (a) deselect the photo consent
          checkbox during registration, or (b) notify the coaching team in writing on or before the first day
          of the enrolled week. Opt-out requests will be honored immediately and applied to all future sessions.
          No images of opted-out students will be published retroactively.
        </PolicySection>

        <PolicySection title="4. Classroom Boundaries & Conduct">
          Elevate Coders classrooms are safe, inclusive, and focused learning environments. All students are
          expected to (a) treat peers and coaches with respect at all times, (b) remain at their assigned
          workstation unless instructed otherwise, (c) use provided devices strictly for curriculum-related
          activities, and (d) refrain from sharing personal information online. Any student whose behavior
          disrupts the classroom environment may be asked to take a break, and in repeated or severe cases,
          parents will be contacted. Elevate Coders reserves the right to remove a student from the program
          without refund in cases of ongoing misconduct.
        </PolicySection>

        <PolicySection title="5. Refund & Cancellation Policy">
          Cancellations made more than 7 days prior to the enrolled week&apos;s start date are eligible for a full
          refund minus a $25 processing fee. Cancellations within 7 days of the enrolled week are non-refundable.
          Vacation proration credits are applied at the time of registration and are not subject to additional
          refund after the session begins. Elevate Coders reserves the right to cancel or reschedule sessions
          due to emergencies; in such cases, a full credit will be issued for the affected week(s).
        </PolicySection>

        <PolicySection title="6. Emergency Contact & Medical">
          A parent or guardian must be reachable via the phone number on file at all times during camp hours.
          In the event of a medical emergency, we will attempt to reach the primary contact immediately and
          call 911 if the situation warrants. Parents are responsible for disclosing all known allergies and
          medical conditions during registration. Elevate Coders staff are not licensed medical professionals
          and are not authorized to administer medication.
        </PolicySection>

        <PolicySection title="7. Payment Terms">
          All invoices are issued via Gusto and processed through Melio. Invoices are due immediately upon
          issuance. Payment may be made via ACH bank transfer, or ACH + Credit Card depending on the option
          selected during registration. Late payments may result in the student&apos;s spot being released.
          Elevate Coders does not store any credit card or bank account information on its own servers.
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

      {/* Discount code */}
      <div style={{ marginBottom: '28px' }}>
        <div style={{ fontWeight: 600, fontSize: '15px', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Tag size={15} color="var(--brand-purple)" />
          Discount / Partner Code
        </div>
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
      </div>

      {/* Policy agreement checkbox */}
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
          style={{ marginTop: '2px', accentColor: 'var(--brand-purple)', width: '18px', height: '18px' }}
        />
        <span style={{ fontSize: '14px', lineHeight: 1.6, color: 'var(--text-secondary)' }}>
          I have read and agree to the <strong>TeamCoders Camp Policies & Guidelines</strong> listed above,
          including the cumulative attendance policy, 0% sales tax compliance, photo/media opt-out terms,
          classroom conduct boundaries, cancellation terms, and payment obligations.
          I confirm that the information provided is accurate to the best of my knowledge.
        </span>
      </label>
    </div>
  )
}

function PolicySection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: '20px' }}>
      <h4 style={{ fontFamily: 'Outfit, sans-serif', fontSize: '14px', fontWeight: 700, marginBottom: '6px', color: 'var(--text-primary)' }}>
        {title}
      </h4>
      <p style={{ fontSize: '13px', lineHeight: 1.75, color: 'var(--text-secondary)' }}>
        {children}
      </p>
    </div>
  )
}
