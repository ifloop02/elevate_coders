'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import StepIndicator from '@/components/register/StepIndicator'
import TrackSelector from '@/components/register/TrackSelector'
import WeekPicker from '@/components/register/WeekPicker'
import VacationTracker from '@/components/register/VacationTracker'
import ParentInfoForm from '@/components/register/ParentInfoForm'
import StudentInfoForm from '@/components/register/StudentInfoForm'
import PolicyAccordion from '@/components/register/PolicyAccordion'
import PricingSummary from '@/components/register/PricingSummary'
import PrerequisiteGate from '@/components/register/PrerequisiteGate'
import { calculatePricing } from '@/lib/proration'

export interface RegistrationState {
  track: 'COED' | 'ALL_GIRLS' | null
  selectedWeekIds: string[]
  vacationDates: { date: string; weekNumber: number; reason?: string }[]
  discountCode: string
  discountPercent: number
  paymentMethod: 'ACH_ONLY' | 'ACH_AND_CREDIT_CARD'
  parent: {
    legalName: string
    email: string
    phone: string
    referralCode: string
    marketingOptIn: boolean
    photoMediaOptIn: boolean
  }
  student: {
    firstName: string
    lastName: string
    dateOfBirth: string
    allergies: string
    medicalNotes: string
    completedBeginnerCourse: boolean
    beginnerCourseYear?: number
    hasVerifiedOutsideExp: boolean
    outsideExpDescription: string
  }
  policyAgreed: boolean
  prerequisiteVerified: boolean
}

const STEPS = ['Track', 'Weeks', 'Vacation', 'Your Info', 'Policies', 'Review']

const WEEK_DATA = [
  { id: 'fall-2026-week-1', weekNumber: 1, dates: 'Sep 10 (Thu)', curriculum: 'Scratch & Coding Basics', requiresPrerequisite: false },
  { id: 'fall-2026-week-2', weekNumber: 2, dates: 'Sep 17 (Thu)', curriculum: 'Interactive Game Design', requiresPrerequisite: false },
  { id: 'fall-2026-week-3', weekNumber: 3, dates: 'Sep 24 (Thu)', curriculum: 'Logic, Loops & Variables', requiresPrerequisite: false },
  { id: 'fall-2026-week-4', weekNumber: 4, dates: 'Oct 1 (Thu)', curriculum: 'Animation & Graphics', requiresPrerequisite: false },
  { id: 'fall-2026-week-5', weekNumber: 5, dates: 'Oct 8 (Thu)', curriculum: 'Python IDE & Core Syntax', requiresPrerequisite: true },
  { id: 'fall-2026-week-6', weekNumber: 6, dates: 'Oct 15 (Thu)', curriculum: 'Algorithms & Data Logic', requiresPrerequisite: true },
  { id: 'fall-2026-week-7', weekNumber: 7, dates: 'Oct 22 (Thu)', curriculum: 'Final Project Showcase', requiresPrerequisite: true },
]

const emptyState: RegistrationState = {
  track: null,
  selectedWeekIds: [],
  vacationDates: [],
  discountCode: '',
  discountPercent: 0,
  paymentMethod: 'ACH_ONLY',
  parent: { legalName: '', email: '', phone: '', referralCode: '', marketingOptIn: true, photoMediaOptIn: true },
  student: { firstName: '', lastName: '', dateOfBirth: '', allergies: '', medicalNotes: '', completedBeginnerCourse: false, hasVerifiedOutsideExp: false, outsideExpDescription: '' },
  policyAgreed: false,
  prerequisiteVerified: false,
}

export default function RegistrationFlow({ initialTrack }: { initialTrack: string | null }) {
  const router = useRouter()
  const [step, setStep] = useState(initialTrack ? 1 : 0) // skip to week picker if track pre-selected
  const [state, setState] = useState<RegistrationState>({
    ...emptyState,
    track: initialTrack === 'all-girls' ? 'ALL_GIRLS' : initialTrack === 'coed' ? 'COED' : null,
  })
  const [showPrereqGate, setShowPrereqGate] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)

  const update = (partial: Partial<RegistrationState>) =>
    setState((s) => ({ ...s, ...partial }))

  const selectedWeeks = WEEK_DATA.filter((w) => state.selectedWeekIds.includes(w.id))
  const hasAdvancedWeeks = selectedWeeks.some((w) => w.requiresPrerequisite)
  const pricing = calculatePricing(
    state.selectedWeekIds.length,
    state.vacationDates.length,
    state.discountPercent
  )

  const canAdvanceFromWeeks = () => {
    if (state.selectedWeekIds.length === 0) return false
    if (hasAdvancedWeeks && !state.prerequisiteVerified) {
      setShowPrereqGate(true)
      return false
    }
    return true
  }

  const handleNext = () => {
    if (step === 1 && !canAdvanceFromWeeks()) return
    setStep((s) => Math.min(s + 1, STEPS.length - 1))
  }

  const handleBack = () => setStep((s) => Math.max(s - 1, 0))

  const handleSubmit = async () => {
    setSubmitting(true)
    setSubmitError(null)
    try {
      const payload = {
        parent: state.parent,
        student: { ...state.student, track: state.track },
        weekSelection: {
          weekBlockIds: state.selectedWeekIds,
          vacationDates: state.vacationDates,
        },
        paymentMethod: state.paymentMethod,
        discountCode: state.discountCode || undefined,
        policyAgreed: true as const,
      }

      const res = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.error || 'Registration failed. Please try again.')
      }

      const data = await res.json()
      router.push(`/register/confirmation?id=${data.registrationId}`)
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Unknown error'
      setSubmitError(message)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-base)', paddingBottom: '80px' }}>
      {/* Page header */}
      <div style={{ background: 'var(--bg-white)', borderBottom: '1px solid var(--border-light)', padding: '32px 0' }}>
        <div className="container-app">
          <h1 style={{ fontFamily: 'Outfit, sans-serif', fontSize: '28px', fontWeight: 800, marginBottom: '24px' }}>
            Register Your Child
          </h1>
          <StepIndicator steps={STEPS} currentStep={step} />
        </div>
      </div>

      <div className="container-app" style={{ paddingTop: '40px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: step >= 1 ? '1fr 320px' : '1fr', gap: '32px', alignItems: 'start' }}>
          {/* Main content */}
          <div>
            {step === 0 && (
              <TrackSelector
                selectedTrack={state.track}
                onSelect={(track) => { update({ track }); setStep(1) }}
              />
            )}
            {step === 1 && (
              <WeekPicker
                weeks={WEEK_DATA}
                selectedIds={state.selectedWeekIds}
                prerequisiteVerified={state.prerequisiteVerified}
                onChange={(ids) => update({ selectedWeekIds: ids })}
              />
            )}
            {step === 2 && (
              <VacationTracker
                weeks={WEEK_DATA.filter((w) => state.selectedWeekIds.includes(w.id))}
                vacationDates={state.vacationDates}
                onChange={(dates) => update({ vacationDates: dates })}
              />
            )}
            {step === 3 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
                <ParentInfoForm
                  data={state.parent}
                  onChange={(parent) => update({ parent })}
                />
                <StudentInfoForm
                  data={state.student}
                  onChange={(student) => update({ student })}
                />
              </div>
            )}
            {step === 4 && (
              <PolicyAccordion
                agreed={state.policyAgreed}
                onAgree={(v) => update({ policyAgreed: v })}
                paymentMethod={state.paymentMethod}
                onPaymentMethodChange={(m) => update({ paymentMethod: m })}
                discountCode={state.discountCode}
                onDiscountCodeChange={(code) => update({ discountCode: code })}
                discountPercent={state.discountPercent}
                onDiscountResolved={(pct) => update({ discountPercent: pct })}
              />
            )}
            {step === 5 && (
              <ReviewStep state={state} pricing={pricing} weekData={WEEK_DATA} />
            )}

            {/* Error message */}
            {submitError && (
              <div style={{
                marginTop: '16px',
                padding: '14px 18px',
                background: '#FEF2F2',
                border: '1px solid #FCA5A5',
                borderRadius: 'var(--radius-md)',
                color: '#DC2626',
                fontSize: '14px',
              }}>
                {submitError}
              </div>
            )}

            {/* Navigation buttons */}
            <div style={{ display: 'flex', gap: '12px', marginTop: '32px', justifyContent: 'space-between' }}>
              {step > 0 && (
                <button onClick={handleBack} className="btn btn-secondary">
                  ← Back
                </button>
              )}
              <div style={{ marginLeft: 'auto' }}>
                {step < STEPS.length - 1 ? (
                  <button
                    onClick={handleNext}
                    className="btn btn-primary"
                    disabled={
                      (step === 0 && !state.track) ||
                      (step === 1 && state.selectedWeekIds.length === 0) ||
                      (step === 4 && !state.policyAgreed)
                    }
                    style={{ opacity: (step === 4 && !state.policyAgreed) ? 0.5 : 1 }}
                  >
                    Continue →
                  </button>
                ) : (
                  <button
                    onClick={handleSubmit}
                    className="btn btn-primary"
                    disabled={submitting}
                    style={{ opacity: submitting ? 0.7 : 1 }}
                  >
                    {submitting ? 'Submitting...' : '🚀 Complete Registration'}
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Pricing sidebar */}
          {step >= 1 && (
            <PricingSummary
              pricing={pricing}
              selectedWeeks={selectedWeeks}
              track={state.track}
            />
          )}
        </div>
      </div>

      {/* Prerequisite Gate Modal */}
      {showPrereqGate && (
        <PrerequisiteGate
          onVerified={(data) => {
            update({
              prerequisiteVerified: true,
              student: { ...state.student, ...data },
            })
            setShowPrereqGate(false)
            setStep(2)
          }}
          onDismiss={() => {
            setShowPrereqGate(false)
            // Deselect all advanced weeks
            update({
              selectedWeekIds: state.selectedWeekIds.filter(
                (id) => !WEEK_DATA.find((w) => w.id === id)?.requiresPrerequisite
              ),
            })
          }}
        />
      )}
    </div>
  )
}

// ─── Review Step (inline) ───────────────────────────────────────────────────
function ReviewStep({
  state,
  pricing,
  weekData,
}: {
  state: RegistrationState
  pricing: ReturnType<typeof calculatePricing>
  weekData: typeof WEEK_DATA
}) {
  const selectedWeeks = weekData.filter((w) => state.selectedWeekIds.includes(w.id))

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <h2 style={{ fontFamily: 'Outfit, sans-serif', fontSize: '22px', fontWeight: 700 }}>
        Review Your Registration
      </h2>

      <ReviewCard title="Camp Track">
        <span className={`badge ${state.track === 'COED' ? 'badge-green' : 'badge-purple'}`}>
          {state.track === 'COED' ? 'Co-Ed Coding Camp' : 'All-Girls Coding Camp'}
        </span>
      </ReviewCard>

      <ReviewCard title="Selected Weeks">
        {selectedWeeks.map((w) => (
          <div key={w.id} style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>
            Week {w.weekNumber}: {w.dates} — {w.curriculum}
          </div>
        ))}
        {state.vacationDates.length > 0 && (
          <div style={{ marginTop: '8px', fontSize: '13px', color: '#EC4899' }}>
            {state.vacationDates.length} vacation day(s) flagged — packet delivery will be arranged.
          </div>
        )}
      </ReviewCard>

      <ReviewCard title="Parent / Billing">
        <div style={{ fontSize: '14px', color: 'var(--text-secondary)', lineHeight: 2 }}>
          <div><strong>Name:</strong> {state.parent.legalName}</div>
          <div><strong>Email:</strong> {state.parent.email}</div>
          <div><strong>Phone:</strong> {state.parent.phone}</div>
          <div><strong>Payment:</strong> {state.paymentMethod === 'ACH_ONLY' ? 'ACH Only' : 'ACH + Credit Card'}</div>
        </div>
      </ReviewCard>

      <ReviewCard title="Student">
        <div style={{ fontSize: '14px', color: 'var(--text-secondary)', lineHeight: 2 }}>
          <div><strong>Name:</strong> {state.student.firstName} {state.student.lastName}</div>
          {state.student.allergies && <div><strong>Allergies:</strong> {state.student.allergies}</div>}
        </div>
      </ReviewCard>
    </div>
  )
}

function ReviewCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{
      border: '1px solid var(--border-light)',
      borderRadius: 'var(--radius-md)',
      overflow: 'hidden',
    }}>
      <div style={{
        background: 'var(--bg-subtle)',
        padding: '10px 16px',
        fontSize: '12px',
        fontWeight: 700,
        letterSpacing: '0.08em',
        textTransform: 'uppercase',
        color: 'var(--brand-purple)',
        borderBottom: '1px solid var(--border-light)',
      }}>
        {title}
      </div>
      <div style={{ padding: '14px 16px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
        {children}
      </div>
    </div>
  )
}
