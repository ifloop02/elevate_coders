'use client'

import { RegistrationState } from './RegistrationFlow'

type AgeStatus = 'in_range' | 'too_young' | 'too_old' | null
type YoungChildOption = 'waitlist' | 'contact' | null

interface StudentInfoFormProps {
  data: RegistrationState['student']
  onChange: (data: RegistrationState['student']) => void
  ageStatus: AgeStatus
  youngChildOption: YoungChildOption
  olderChildAcknowledged: boolean
  onAgeStatusChange: (status: AgeStatus) => void
  onYoungChildOptionChange: (option: YoungChildOption) => void
  onOlderChildAcknowledgedChange: (ack: boolean) => void
}

// Age is evaluated as of program start date
const PROGRAM_START = new Date('2026-10-08T12:00:00')

function calcAge(dob: string): number | null {
  if (!dob) return null
  const birth = new Date(dob + 'T12:00:00')
  if (isNaN(birth.getTime())) return null
  let age = PROGRAM_START.getFullYear() - birth.getFullYear()
  const m = PROGRAM_START.getMonth() - birth.getMonth()
  if (m < 0 || (m === 0 && PROGRAM_START.getDate() < birth.getDate())) age--
  return age
}

export default function StudentInfoForm({
  data,
  onChange,
  ageStatus,
  youngChildOption,
  olderChildAcknowledged,
  onAgeStatusChange,
  onYoungChildOptionChange,
  onOlderChildAcknowledgedChange,
}: StudentInfoFormProps) {
  const set = (key: keyof RegistrationState['student'], value: string | boolean | number) =>
    onChange({ ...data, [key]: value })

  const handleDobChange = (dob: string) => {
    set('dateOfBirth', dob)
    const age = calcAge(dob)
    if (age === null) {
      onAgeStatusChange(null)
    } else if (age < 7) {
      onAgeStatusChange('too_young')
      onYoungChildOptionChange(null)
      onOlderChildAcknowledgedChange(false)
    } else if (age > 12) {
      onAgeStatusChange('too_old')
      onYoungChildOptionChange(null)
      onOlderChildAcknowledgedChange(false)
    } else {
      onAgeStatusChange('in_range')
      onYoungChildOptionChange(null)
      onOlderChildAcknowledgedChange(false)
    }
  }

  const age = calcAge(data.dateOfBirth)

  return (
    <div>
      <h2 style={{ fontFamily: 'Outfit, sans-serif', fontSize: '22px', fontWeight: 700, marginBottom: '8px' }}>
        Student Information
      </h2>
      <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginBottom: '28px' }}>
        Tell us about your child. Age range for all programs is <strong>7–12 years old</strong>.
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '18px', maxWidth: '560px' }}>
        <div>
          <label className="form-label" htmlFor="student-first-name">First Name *</label>
          <input
            id="student-first-name"
            className="form-input"
            type="text"
            value={data.firstName}
            onChange={(e) => set('firstName', e.target.value)}
            autoComplete="given-name"
          />
        </div>
        <div>
          <label className="form-label" htmlFor="student-last-name">Last Name *</label>
          <input
            id="student-last-name"
            className="form-input"
            type="text"
            value={data.lastName}
            onChange={(e) => set('lastName', e.target.value)}
            autoComplete="family-name"
          />
        </div>
      </div>

      <div style={{ marginTop: '18px', maxWidth: '560px' }}>
        <label className="form-label" htmlFor="student-dob">Date of Birth *</label>
        <input
          id="student-dob"
          className="form-input"
          type="date"
          value={data.dateOfBirth}
          onChange={(e) => handleDobChange(e.target.value)}
          style={{ maxWidth: '220px' }}
        />
        <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px' }}>
          Age is calculated as of program start: <strong>October 8, 2026</strong>.
        </div>

        {/* ── Zone: In Range ── */}
        {ageStatus === 'in_range' && age !== null && (
          <div
            style={{
              marginTop: '12px',
              padding: '10px 14px',
              background: '#F0FDF4',
              border: '1px solid #86EFAC',
              borderRadius: 'var(--radius-md)',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              fontSize: '13px',
              color: '#15803D',
            }}
          >
            <span>✅</span>
            <span>
              <strong>Age {age}</strong> — within the 7–12 program range. You&apos;re all set!
            </span>
          </div>
        )}

        {/* ── Zone: Too Young (hard gate) ── */}
        {ageStatus === 'too_young' && age !== null && (
          <div
            style={{
              marginTop: '12px',
              padding: '14px 16px',
              background: '#FEF2F2',
              border: '1px solid #FCA5A5',
              borderRadius: 'var(--radius-md)',
              fontSize: '13px',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                fontWeight: 700,
                color: '#DC2626',
                marginBottom: '8px',
              }}
            >
              <span>🔴</span>
              <span>Age {age} is below our minimum age of 7</span>
            </div>
            <p style={{ color: '#6B7280', marginBottom: '12px', lineHeight: 1.6, margin: '0 0 12px' }}>
              Our curriculum is paced for students aged 7–12 who have foundational reading and logic-sequencing skills.
              Students under 7 often aren&apos;t yet ready to follow our independent block-coding projects.
            </p>
            <p style={{ color: '#374151', fontWeight: 600, marginBottom: '10px', fontSize: '13px' }}>
              How would you like to proceed?
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {(
                [
                  {
                    value: 'waitlist' as const,
                    label: '📬 Add to waitlist — notify me when a session for younger learners is available',
                  },
                  {
                    value: 'contact' as const,
                    label: '💬 I understand the age gap — please contact me to discuss suitability before finalizing',
                  },
                ]
              ).map((opt) => (
                <label
                  key={opt.value}
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '10px',
                    padding: '10px 12px',
                    borderRadius: 'var(--radius-md)',
                    border: `1.5px solid ${youngChildOption === opt.value ? '#DC2626' : '#FCA5A5'}`,
                    background: youngChildOption === opt.value ? '#FEE2E2' : '#fff',
                    cursor: 'pointer',
                    transition: 'all 200ms ease',
                    fontSize: '13px',
                    color: '#374151',
                    lineHeight: 1.5,
                  }}
                >
                  <input
                    type="radio"
                    name="youngChildOption"
                    value={opt.value}
                    checked={youngChildOption === opt.value}
                    onChange={() => onYoungChildOptionChange(opt.value)}
                    style={{ marginTop: '2px', accentColor: '#DC2626', flexShrink: 0 }}
                  />
                  {opt.label}
                </label>
              ))}
            </div>
            {youngChildOption && (
              <div
                style={{
                  marginTop: '10px',
                  fontSize: '12px',
                  color: '#6B7280',
                  padding: '8px 10px',
                  background: '#fff',
                  borderRadius: 'var(--radius-sm)',
                }}
              >
                ✓ Noted. You can continue — our team will follow up before enrollment is finalized.
              </div>
            )}
          </div>
        )}

        {/* ── Zone: Over Range (soft gate with acknowledgment) ── */}
        {ageStatus === 'too_old' && age !== null && (
          <div
            style={{
              marginTop: '12px',
              padding: '14px 16px',
              background: '#FFFBEB',
              border: '1px solid #FCD34D',
              borderRadius: 'var(--radius-md)',
              fontSize: '13px',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                fontWeight: 700,
                color: '#92400E',
                marginBottom: '8px',
              }}
            >
              <span>🟡</span>
              <span>Age {age} is above our recommended range of 7–12</span>
            </div>
            <p style={{ color: '#6B7280', marginBottom: '12px', lineHeight: 1.6, margin: '0 0 12px' }}>
              This program is paced for students aged 7–12. Older students may find Level 1 less challenging — however,
              Level 2 covers advanced topics (physics engines, AI pathfinding, UI systems) that many teens find engaging.
              Enrollment remains open.
            </p>
            <label
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: '10px',
                cursor: 'pointer',
                padding: '10px 12px',
                borderRadius: 'var(--radius-md)',
                border: `1.5px solid ${olderChildAcknowledged ? '#F59E0B' : '#FCD34D'}`,
                background: olderChildAcknowledged ? '#FEF3C7' : '#fff',
                transition: 'all 200ms ease',
              }}
            >
              <input
                id="older-child-ack"
                type="checkbox"
                checked={olderChildAcknowledged}
                onChange={(e) => onOlderChildAcknowledgedChange(e.target.checked)}
                style={{ marginTop: '2px', accentColor: '#D97706', flexShrink: 0 }}
              />
              <span style={{ fontSize: '13px', color: '#374151', lineHeight: 1.5 }}>
                I understand this program is designed for ages 7–12. I&apos;d like to proceed with enrollment for my{' '}
                <strong>{age}-year-old</strong>, and I accept that the curriculum pace and content are calibrated for
                younger students.
              </span>
            </label>
          </div>
        )}
      </div>

      <div style={{ marginTop: '18px', maxWidth: '560px' }}>
        <label className="form-label" htmlFor="student-allergies">Allergies / Medical Considerations</label>
        <textarea
          id="student-allergies"
          className="form-input"
          rows={3}
          placeholder='e.g. "Peanut allergy — carries EpiPen", "Asthma", or "None"'
          value={data.allergies}
          onChange={(e) => set('allergies', e.target.value)}
          style={{ resize: 'vertical' }}
        />
      </div>

      <div style={{ marginTop: '18px', maxWidth: '560px' }}>
        <label className="form-label" htmlFor="student-medical">Other Medical Notes</label>
        <textarea
          id="student-medical"
          className="form-input"
          rows={2}
          placeholder="Any additional information the coaching team should know..."
          value={data.medicalNotes}
          onChange={(e) => set('medicalNotes', e.target.value)}
          style={{ resize: 'vertical' }}
        />
      </div>
    </div>
  )
}
