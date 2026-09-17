'use client'

import { useState, useEffect } from 'react'
import { RegistrationState } from './RegistrationFlow'

interface ParentInfoFormProps {
  data: RegistrationState['parent']
  onChange: (data: RegistrationState['parent']) => void
}

export default function ParentInfoForm({ data, onChange }: ParentInfoFormProps) {
  const [detectedDiscountMsg, setDetectedDiscountMsg] = useState<string | null>(null)

  useEffect(() => {
    const code = data.referralCode?.trim().toUpperCase()
    if (!code || code.length < 3) {
      setDetectedDiscountMsg(null)
      return
    }
    const timer = setTimeout(async () => {
      try {
        const res = await fetch(`/api/discount?code=${encodeURIComponent(code)}`)
        if (res.ok) {
          const d = await res.json()
          if (d.discountPercent !== undefined) {
            setDetectedDiscountMsg(`💡 "${d.code}" is a discount code! It will be pre-filled & applied on Step 4 (Policies) for your ${d.discountPercent}% discount.`)
          } else {
            setDetectedDiscountMsg(null)
          }
        } else {
          setDetectedDiscountMsg(null)
        }
      } catch {
        setDetectedDiscountMsg(null)
      }
    }, 300)
    return () => clearTimeout(timer)
  }, [data.referralCode])

  const set = (key: keyof RegistrationState['parent'], value: string | boolean) =>
    onChange({ ...data, [key]: value })

  return (
    <div>
      <h2 style={{ fontFamily: 'Outfit, sans-serif', fontSize: '22px', fontWeight: 700, marginBottom: '8px' }}>
        Parent / Guardian Information
      </h2>
      <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginBottom: '28px' }}>
        This information is used for billing and communications. Your legal name will appear on your invoice.
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '18px', maxWidth: '560px' }}>
        <div>
          <label className="form-label" htmlFor="parent-legal-name">
            Legal Billing Name <span style={{ color: '#EF4444' }}>*</span>
          </label>
          <input
            id="parent-legal-name"
            className="form-input"
            type="text"
            placeholder="As it appears on your bank account"
            value={data.legalName}
            onChange={(e) => set('legalName', e.target.value)}
            autoComplete="name"
          />
        </div>

        <div>
          <label className="form-label" htmlFor="parent-email">
            Email Address <span style={{ color: '#EF4444' }}>*</span>
          </label>
          <input
            id="parent-email"
            className="form-input"
            type="email"
            placeholder="invoice@youremail.com"
            value={data.email}
            onChange={(e) => set('email', e.target.value)}
            autoComplete="email"
          />
          <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px' }}>
            Your payment receipt will be sent to this address.
          </div>
        </div>

        <div>
          <label className="form-label" htmlFor="parent-phone">
            Preferred Billing Phone <span style={{ color: '#EF4444' }}>*</span>
          </label>
          <input
            id="parent-phone"
            className="form-input"
            type="tel"
            placeholder="(555) 867-5309"
            value={data.phone}
            onChange={(e) => set('phone', e.target.value)}
            autoComplete="tel"
          />
        </div>

        <div>
          <label className="form-label" htmlFor="parent-referral">
            Referral Code or Discount Code (optional)
          </label>
          <input
            id="parent-referral"
            className="form-input"
            type="text"
            placeholder="e.g. GSCS15 or friend's referral code"
            value={data.referralCode}
            onChange={(e) => set('referralCode', e.target.value.toUpperCase())}
          />
          <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px', lineHeight: 1.4 }}>
            Enter a discount code (like GSCS15) or a friend&apos;s referral code here.
          </div>
          {detectedDiscountMsg && (
            <div style={{
              marginTop: '8px',
              padding: '10px 12px',
              background: '#F5F3FF',
              border: '1px solid #DDD6FE',
              borderRadius: 'var(--radius-md)',
              fontSize: '13px',
              color: '#5B21B6',
              fontWeight: 500,
              lineHeight: 1.5,
            }}>
              {detectedDiscountMsg}
            </div>
          )}
        </div>

        {/* Consent checkboxes */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', paddingTop: '8px' }}>
          <label style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', cursor: 'pointer' }}>
            <input
              id="marketing-opt-in"
              type="checkbox"
              checked={data.marketingOptIn}
              onChange={(e) => set('marketingOptIn', e.target.checked)}
              style={{ marginTop: '2px', accentColor: 'var(--brand-purple)' }}
            />
            <span style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
              I&apos;d like to receive updates about future camps, early bird discounts, and coding resources.
            </span>
          </label>

          <label style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', cursor: 'pointer' }}>
            <input
              id="photo-opt-in"
              type="checkbox"
              checked={data.photoMediaOptIn}
              onChange={(e) => set('photoMediaOptIn', e.target.checked)}
              style={{ marginTop: '2px', accentColor: 'var(--brand-purple)' }}
            />
            <span style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
              I consent to my child being photographed / recorded for Elevate Coders marketing materials.
              (You may opt out in the policies section.)
            </span>
          </label>
        </div>
      </div>
    </div>
  )
}
