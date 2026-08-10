'use client'

import { Calendar, Lock } from 'lucide-react'

interface Week {
  id: string
  weekNumber: number
  dates: string
  curriculum: string
  requiresPrerequisite: boolean
}

interface WeekPickerProps {
  weeks: Week[]
  selectedIds: string[]
  prerequisiteVerified: boolean
  onChange: (ids: string[]) => void
}

const phaseColors = {
  scratch: { bg: '#D1FAE5', text: '#065F46' },
  python: { bg: '#EDE9FE', text: '#5B21B6' },
}

export default function WeekPicker({ weeks, selectedIds, prerequisiteVerified, onChange }: WeekPickerProps) {
  const toggle = (id: string, requiresPrereq: boolean) => {
    // If advanced week and not verified, parent flow handles the gate modal
    if (requiresPrereq && !prerequisiteVerified) {
      // Still let them select — the gate will fire on "Continue"
    }
    const next = selectedIds.includes(id)
      ? selectedIds.filter((i) => i !== id)
      : [...selectedIds, id]
    onChange(next)
  }

  const total = selectedIds.length * 200

  return (
    <div>
      <h2 style={{ fontFamily: 'Outfit, sans-serif', fontSize: '22px', fontWeight: 700, marginBottom: '8px' }}>
        Select Your Weeks
      </h2>
      <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginBottom: '28px' }}>
        Choose any combination of weeks. Curriculum is cumulative — attending all selected weeks is encouraged.
        Each week is <strong>$200</strong>.
      </p>

      {/* Week grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(230px, 1fr))', gap: '14px', marginBottom: '20px' }}>
        {weeks.map((week) => {
          const isSelected = selectedIds.includes(week.id)
          const isAdvanced = week.requiresPrerequisite
          const colors = isAdvanced ? phaseColors.python : phaseColors.scratch

          return (
            <button
              key={week.id}
              id={`week-${week.weekNumber}`}
              onClick={() => toggle(week.id, week.requiresPrerequisite)}
              className={`week-card ${isSelected ? 'selected' : ''}`}
              style={{ border: 'none', cursor: 'pointer', textAlign: 'left' }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                <span style={{
                  background: colors.bg, color: colors.text,
                  fontSize: '11px', fontWeight: 700, padding: '3px 10px',
                  borderRadius: 'var(--radius-full)',
                }}>
                  Week {week.weekNumber}
                </span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  {isAdvanced && !prerequisiteVerified && (
                    <Lock size={12} color="var(--text-muted)" />
                  )}
                  <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-secondary)' }}>$200</span>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-muted)', fontSize: '12px', marginBottom: '6px' }}>
                <Calendar size={12} />
                {week.dates}
              </div>

              <div style={{ fontSize: '13px', fontWeight: 500, color: colors.text }}>
                {week.curriculum}
              </div>

              {isAdvanced && !prerequisiteVerified && (
                <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '6px' }}>
                  Prerequisite verification required
                </div>
              )}
            </button>
          )
        })}
      </div>

      {/* Running total */}
      {selectedIds.length > 0 && (
        <div style={{
          padding: '14px 18px',
          background: 'var(--bg-subtle)',
          borderRadius: 'var(--radius-md)',
          border: '1px solid var(--border-purple)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
          <span style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>
            {selectedIds.length} week{selectedIds.length !== 1 ? 's' : ''} selected
          </span>
          <span style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 700, fontSize: '18px', color: 'var(--brand-purple)' }}>
            ${total.toLocaleString()}
          </span>
        </div>
      )}
    </div>
  )
}
