'use client'

import { RegistrationState } from './RegistrationFlow'

interface StudentInfoFormProps {
  data: RegistrationState['student']
  onChange: (data: RegistrationState['student']) => void
}

export default function StudentInfoForm({ data, onChange }: StudentInfoFormProps) {
  const set = (key: keyof RegistrationState['student'], value: string | boolean | number) =>
    onChange({ ...data, [key]: value })

  return (
    <div>
      <h2 style={{ fontFamily: 'Outfit, sans-serif', fontSize: '22px', fontWeight: 700, marginBottom: '8px' }}>
        Student Information
      </h2>
      <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginBottom: '28px' }}>
        Tell us about your child. Age range for all camps is <strong>9–12 years old</strong>.
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
          onChange={(e) => set('dateOfBirth', e.target.value)}
          max="2017-06-15"
          min="2013-06-15"
          style={{ maxWidth: '220px' }}
        />
        <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px' }}>
          Student must be 9–12 years old during Summer 2026.
        </div>
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
