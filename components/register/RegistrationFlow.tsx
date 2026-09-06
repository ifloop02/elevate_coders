'use client'

import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { AlertCircle } from 'lucide-react'
import StepIndicator from '@/components/register/StepIndicator'
import TrackSelector from '@/components/register/TrackSelector'
import WeekPicker from '@/components/register/WeekPicker'
import VacationTracker from '@/components/register/VacationTracker'
import ParentInfoForm from '@/components/register/ParentInfoForm'
import StudentInfoForm from '@/components/register/StudentInfoForm'
import PolicyAccordion from '@/components/register/PolicyAccordion'
import PricingSummary from '@/components/register/PricingSummary'
import PrerequisiteGate from '@/components/register/PrerequisiteGate'
import PaymentStep from '@/components/register/PaymentStep'
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
  ageStatus: 'in_range' | 'too_young' | 'too_old' | null
  youngChildOption: 'waitlist' | 'contact' | null
  olderChildAcknowledged: boolean
  policyAgreed: boolean
  prerequisiteVerified: boolean
}

const STEPS = ['Track', 'Weeks', 'Vacation', 'Your Info', 'Policies', 'Review', 'Payment']

const WEEK_DATA = [
  // 🟢 Level 1 Beginner (5:00 PM – 6:00 PM) — All 7 Weeks
  { id: 'fall-2026-beg-1', weekNumber: 1, dates: 'Oct 8 (Thu)', curriculum: 'Scratch & Coding Foundations', requiresPrerequisite: false },
  { id: 'fall-2026-beg-2', weekNumber: 2, dates: 'Oct 15 (Thu)', curriculum: 'Interactive Game & Animation', requiresPrerequisite: false },
  { id: 'fall-2026-beg-3', weekNumber: 3, dates: 'Oct 22 (Thu)', curriculum: 'Logic, Loops & Scoreboards', requiresPrerequisite: false },
  { id: 'fall-2026-beg-4', weekNumber: 4, dates: 'Oct 29 (Thu)', curriculum: 'Custom Blocks & Sound FX', requiresPrerequisite: false },
  { id: 'fall-2026-beg-5', weekNumber: 5, dates: 'Nov 5 (Thu)', curriculum: 'Multi-Level World Design', requiresPrerequisite: false },
  { id: 'fall-2026-beg-6', weekNumber: 6, dates: 'Nov 12 (Thu)', curriculum: 'UI Polish & Special Effects', requiresPrerequisite: false },
  { id: 'fall-2026-beg-7', weekNumber: 7, dates: 'Nov 19 (Thu)', curriculum: 'Beginner Capstone Showcase', requiresPrerequisite: false },

  // 🟣 Level 2 Advanced (7:00 PM – 8:00 PM) — All 7 Weeks
  { id: 'fall-2026-lvl2-1', weekNumber: 1, dates: 'Oct 8 (Thu)', curriculum: 'Module 1: Advanced Physics & Gravity Engines', requiresPrerequisite: true },
  { id: 'fall-2026-lvl2-2', weekNumber: 2, dates: 'Oct 15 (Thu)', curriculum: 'Module 1: Advanced Event Architecture', requiresPrerequisite: true },
  { id: 'fall-2026-lvl2-3', weekNumber: 3, dates: 'Oct 22 (Thu)', curriculum: 'Module 1: Data Streams & Scoreboards', requiresPrerequisite: true },
  { id: 'fall-2026-lvl2-4', weekNumber: 4, dates: 'Oct 29 (Thu)', curriculum: 'Module 2: Screen Scrolling & Infinite Maps', requiresPrerequisite: true },
  { id: 'fall-2026-lvl2-5', weekNumber: 5, dates: 'Nov 5 (Thu)', curriculum: 'Module 2: Autonomous AI & Pathfinding', requiresPrerequisite: true },
  { id: 'fall-2026-lvl2-6', weekNumber: 6, dates: 'Nov 12 (Thu)', curriculum: 'Module 3: Code Polish & UI Design Systems', requiresPrerequisite: true },
  { id: 'fall-2026-lvl2-7', weekNumber: 7, dates: 'Nov 19 (Thu)', curriculum: 'Module 3: Capstone Debugging & Group Playtesting', requiresPrerequisite: true },
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
  ageStatus: null,
  youngChildOption: null,
  olderChildAcknowledged: false,
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
  const [toast, setToast] = useState<string | null>(null)
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  const showToast = (message: string) => {
    if (toastTimer.current) clearTimeout(toastTimer.current)
    setToast(message)
    toastTimer.current = setTimeout(() => setToast(null), 3500)
  }

  const update = (partial: Partial<RegistrationState>) =>
    setState((s) => ({ ...s, ...partial }))

  const selectedWeeks = WEEK_DATA.filter((w) => state.selectedWeekIds.includes(w.id))
  const hasAdvancedWeeks = selectedWeeks.some((w) => w.requiresPrerequisite)
  const pricing = calculatePricing(
    state.selectedWeekIds.length,
    state.vacationDates.length,
    state.discountPercent
  )

  const ALL_BEGINNER_IDS = WEEK_DATA.filter((w) => !w.requiresPrerequisite).map((w) => w.id)
  const ALL_LEVEL2_IDS = WEEK_DATA.filter((w) => w.requiresPrerequisite).map((w) => w.id)

  const addAllWeeks = () => {
    const isLevel2 = state.selectedWeekIds.some((id) => ALL_LEVEL2_IDS.includes(id))
    update({ selectedWeekIds: isLevel2 ? ALL_LEVEL2_IDS : ALL_BEGINNER_IDS })
  }


  const canAdvanceFromWeeks = () => {
    if (state.selectedWeekIds.length === 0) {
      showToast('Select at least one week to continue')
      return false
    }
    if (hasAdvancedWeeks && !state.prerequisiteVerified) {
      setShowPrereqGate(true)
      return false
    }
    return true
  }

  const canAdvanceFromInfo = () => {
    const { legalName, email, phone } = state.parent
    if (!legalName.trim()) {
      showToast('Please enter your legal billing name to continue')
      return false
    }
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      showToast('Please enter a valid email address to continue')
      return false
    }
    if (!phone.trim()) {
      showToast('Please enter your billing phone number to continue')
      return false
    }
    if (
      state.ageStatus === null ||
      (state.ageStatus === 'too_young' && state.youngChildOption === null) ||
      (state.ageStatus === 'too_old' && !state.olderChildAcknowledged)
    ) {
      showToast("Please complete your child's information to continue")
      return false
    }
    return true
  }

  const handleNext = () => {
    if (step === 1 && !canAdvanceFromWeeks()) return
    if (step === 3 && !canAdvanceFromInfo()) return
    setStep((s) => Math.min(s + 1, STEPS.length - 1))
  }

  const handleBack = () => setStep((s) => Math.max(s - 1, 0))

  // Called by PaymentStep after Stripe confirms payment — then writes DB record
  const handlePaymentSuccess = async () => {
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
                selectedIds={state.selectedWeekIds}
                prerequisiteVerified={state.prerequisiteVerified}
                onChange={(ids, level) => {
                  update({ selectedWeekIds: ids })
                  if (level === 'LEVEL_2' && !state.prerequisiteVerified) {
                    setShowPrereqGate(true)
                  }
                }}
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
                  ageStatus={state.ageStatus}
                  youngChildOption={state.youngChildOption}
                  olderChildAcknowledged={state.olderChildAcknowledged}
                  onAgeStatusChange={(ageStatus) => update({ ageStatus })}
                  onYoungChildOptionChange={(youngChildOption) => update({ youngChildOption })}
                  onOlderChildAcknowledgedChange={(olderChildAcknowledged) => update({ olderChildAcknowledged })}
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
                selectedWeekCount={state.selectedWeekIds.length}
                onAddAllWeeks={addAllWeeks}
              />
            )}
            {step === 5 && (
              <ReviewStep state={state} pricing={pricing} weekData={WEEK_DATA} />
            )}
            {step === 6 && (
              <PaymentStep
                finalTotal={pricing.finalTotal}
                parentEmail={state.parent.email}
                parentName={state.parent.legalName}
                onSuccess={handlePaymentSuccess}
              />
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

            {/* Navigation buttons — hidden on Payment step (PaymentStep owns its submit) */}
            {step < 6 && (
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
                        (step === 4 && !state.policyAgreed)
                      }
                      style={{
                        opacity: (
                          (step === 4 && !state.policyAgreed)
                        ) ? 0.5 : 1
                      }}
                    >
                      {step === 5 ? 'Proceed to Payment →' : 'Continue →'}
                    </button>
                  ) : null}
                </div>
              </div>
            )}
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

      {/* ── Validation Toast ── */}
      {toast && (
        <div
          role="alert"
          aria-live="assertive"
          style={{
            position: 'fixed',
            bottom: '32px',
            right: '32px',
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            padding: '14px 18px',
            background: '#111827',
            color: '#F9FAFB',
            borderRadius: 'var(--radius-md)',
            boxShadow: '0 8px 32px rgba(0,0,0,0.30)',
            fontSize: '14px',
            fontWeight: 500,
            maxWidth: '360px',
            animation: 'toastSlideIn 220ms cubic-bezier(0.16,1,0.3,1)',
          }}
        >
          <AlertCircle size={18} style={{ flexShrink: 0, color: '#FBBF24' }} />
          <span style={{ flex: 1, lineHeight: 1.5 }}>{toast}</span>
          <button
            onClick={() => { setToast(null); if (toastTimer.current) clearTimeout(toastTimer.current) }}
            aria-label="Dismiss"
            style={{
              background: 'none',
              border: 'none',
              color: '#9CA3AF',
              cursor: 'pointer',
              padding: '0 0 0 8px',
              fontSize: '16px',
              lineHeight: 1,
              flexShrink: 0,
            }}
          >
            ✕
          </button>
          {/* Auto-drain progress bar */}
          <div
            style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              height: '3px',
              width: '100%',
              borderRadius: '0 0 var(--radius-md) var(--radius-md)',
              background: 'rgba(255,255,255,0.15)',
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                height: '100%',
                background: 'var(--brand-purple)',
                animation: 'toastProgress 3.5s linear forwards',
              }}
            />
          </div>
        </div>
      )}

      {/* Keyframe styles for toast */}
      <style>{`
        @keyframes toastSlideIn {
          from { opacity: 0; transform: translateX(24px) scale(0.97); }
          to   { opacity: 1; transform: translateX(0)  scale(1); }
        }
        @keyframes toastProgress {
          from { width: 100%; }
          to   { width: 0%; }
        }
      `}</style>

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
          {state.ageStatus === 'too_young' && (
            <div style={{ color: '#DC2626' }}>
              <strong>Age Note:</strong>{' '}
              {state.youngChildOption === 'waitlist'
                ? '⚠️ Under 7 — added to waitlist for a future younger-learner session.'
                : '⚠️ Under 7 — team will contact parent to discuss suitability before finalizing.'}
            </div>
          )}
          {state.ageStatus === 'too_old' && (
            <div style={{ color: '#92400E' }}>
              <strong>Age Note:</strong> 🟡 Over 12 — parent acknowledged curriculum is designed for ages 7–12.
            </div>
          )}
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
