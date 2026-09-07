'use client'

import { RegistrationState } from './RegistrationFlow'

interface ParentInfoFormProps {
  data: RegistrationState['parent']
  onChange: (data: RegistrationState['parent']) => void
}

export default function ParentInfoForm({ data, onChange }: ParentInfoFormProps) {
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
            Referral Code (optional)
          </label>
          <input
            id="parent-referral"
            className="form-input"
            type="text"
            placeholder="Enter a friend's referral code"
            value={data.referralCode}
            onChange={(e) => set('referralCode', e.target.value)}
          />
          <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px', lineHeight: 1.4 }}>
            Your friend gets a $25 credit when you enroll. (Note: Referral codes cannot be combined with discount codes).
          </div>
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
