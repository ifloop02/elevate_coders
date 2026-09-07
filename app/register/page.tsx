'use client'

import { useSearchParams } from 'next/navigation'
import { Suspense } from 'react'
import RegistrationFlow from '@/components/register/RegistrationFlow'

function RegisterPageInner() {
  const searchParams = useSearchParams()
  const track = searchParams.get('track') // 'coed' | 'all-girls' | null
  const refCode = searchParams.get('ref') || null

  return <RegistrationFlow initialTrack={track} initialReferralCode={refCode} />
}

export default function RegisterPage() {
  return (
    <Suspense fallback={
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ color: 'var(--brand-purple)' }}>Loading registration...</div>
      </div>
    }>
      <RegisterPageInner />
    </Suspense>
  )
}
