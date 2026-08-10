'use client'

import { useState } from 'react'
import { MapPin, X } from 'lucide-react'
import { formatCurrency } from '@/lib/proration'

interface Week {
  id: string
  weekNumber: number
  dates: string
  curriculum: string
  requiresPrerequisite: boolean
}

interface VacationDate {
  date: string
  weekNumber: number
  reason?: string
}

interface VacationTrackerProps {
  weeks: Week[]
  vacationDates: VacationDate[]
  onChange: (dates: VacationDate[]) => void
}

// Generate Mon-Fri for a given week based on its date range string
// Format: "Jun 15 – Jun 19" → we generate 5 specific dates
const WEEK_DATES: Record<number, string[]> = {
  1: ['2026-06-15', '2026-06-16', '2026-06-17', '2026-06-18', '2026-06-19'],
  2: ['2026-06-22', '2026-06-23', '2026-06-24', '2026-06-25', '2026-06-26'],
  3: ['2026-06-29', '2026-06-30', '2026-07-01', '2026-07-02', '2026-07-03'],
  4: ['2026-07-06', '2026-07-07', '2026-07-08', '2026-07-09', '2026-07-10'],
  5: ['2026-07-13', '2026-07-14', '2026-07-15', '2026-07-16', '2026-07-17'],
  6: ['2026-07-20', '2026-07-21', '2026-07-22', '2026-07-23', '2026-07-24'],
  7: ['2026-07-27', '2026-07-28', '2026-07-29', '2026-07-30', '2026-07-31'],
  8: ['2026-08-03', '2026-08-04', '2026-08-05', '2026-08-06', '2026-08-07'],
}

const DAY_LABELS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri']
const CREDIT_PER_DAY = 40 // $200 / 5 days

export default function VacationTracker({ weeks, vacationDates, onChange }: VacationTrackerProps) {
  const [reason, setReason] = useState('')

  const toggleDay = (date: string, weekNumber: number) => {
    const exists = vacationDates.find((v) => v.date === date)
    if (exists) {
      onChange(vacationDates.filter((v) => v.date !== date))
    } else {
      onChange([...vacationDates, { date, weekNumber, reason }])
    }
  }

  const totalCredit = vacationDates.length * CREDIT_PER_DAY
  const adjustedTotal = weeks.length * 200 - totalCredit

  return (
    <div>
      <h2 style={{ fontFamily: 'Outfit, sans-serif', fontSize: '22px', fontWeight: 700, marginBottom: '8px' }}>
        Vacation Tracker
      </h2>
      <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginBottom: '8px' }}>
        Planning to travel? Toggle any days your child will miss. We&apos;ll prorate your invoice at{' '}
        <strong>$40 per missed day</strong> and arrange a learning packet for pickup.
      </p>

      {/* Reason input */}
      <div style={{ marginBottom: '24px' }}>
        <label className="form-label">Travel reason (optional, for our records)</label>
        <input
          className="form-input"
          placeholder='e.g. "Family vacation July 16–30"'
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          style={{ maxWidth: '480px' }}
        />
      </div>

      {/* Week grids */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginBottom: '24px' }}>
        {weeks.map((week) => {
          const days = WEEK_DATES[week.weekNumber] ?? []
          return (
            <div
              key={week.id}
              style={{
                border: '1px solid var(--border-light)',
                borderRadius: 'var(--radius-md)',
                overflow: 'hidden',
              }}
            >
              <div style={{
                background: 'var(--bg-subtle)',
                padding: '10px 16px',
                borderBottom: '1px solid var(--border-light)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}>
                <span style={{ fontWeight: 600, fontSize: '14px' }}>
                  Week {week.weekNumber} — {week.dates}
                </span>
                <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                  {week.curriculum}
                </span>
              </div>

              <div style={{ padding: '16px', display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                {days.map((date, i) => {
                  const isVacation = vacationDates.some((v) => v.date === date)
                  return (
                    <button
                      key={date}
                      id={`day-${date}`}
                      onClick={() => toggleDay(date, week.weekNumber)}
                      className={`day-toggle ${isVacation ? 'vacation' : ''}`}
                      title={isVacation ? `Click to un-mark ${date}` : `Mark ${date} as vacation`}
                    >
                      <div>
                        <div style={{ fontSize: '10px', fontWeight: 600 }}>{DAY_LABELS[i]}</div>
                        <div style={{ fontSize: '11px' }}>{new Date(date + 'T12:00:00').getDate()}</div>
                      </div>
                    </button>
                  )
                })}
              </div>
            </div>
          )
        })}
      </div>

      {/* Proration summary */}
      {vacationDates.length > 0 ? (
        <div style={{
          padding: '18px 20px',
          background: 'linear-gradient(135deg, #FFF7F9 0%, #FCE7F3 100%)',
          border: '1px solid #FBCFE8',
          borderRadius: 'var(--radius-md)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
            <MapPin size={16} color="#9D174D" />
            <span style={{ fontWeight: 600, fontSize: '14px', color: '#9D174D' }}>
              Travel / Packet Delivery Mode Active
            </span>
          </div>
          <div style={{ fontSize: '13px', color: '#6B7280', lineHeight: 1.8 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Days marked as vacation:</span>
              <strong>{vacationDates.length} day{vacationDates.length !== 1 ? 's' : ''}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: '#10B981' }}>
              <span>Proration credit:</span>
              <strong>−{formatCurrency(totalCredit)}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid #FBCFE8', paddingTop: '8px', marginTop: '6px', color: 'var(--text-primary)' }}>
              <span>Adjusted total:</span>
              <strong style={{ fontFamily: 'Outfit, sans-serif', fontSize: '16px', color: 'var(--brand-purple)' }}>
                {formatCurrency(adjustedTotal)}
              </strong>
            </div>
          </div>

          {/* List vacay dates */}
          <div style={{ marginTop: '12px', display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
            {vacationDates.map((v) => (
              <span
                key={v.date}
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: '4px',
                  background: '#FCE7F3', color: '#9D174D',
                  fontSize: '11px', fontWeight: 600,
                  padding: '3px 8px', borderRadius: 'var(--radius-full)',
                }}
              >
                {new Date(v.date + 'T12:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                <button
                  onClick={() => onChange(vacationDates.filter((d) => d.date !== v.date))}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '0', display: 'flex' }}
                >
                  <X size={10} color="#9D174D" />
                </button>
              </span>
            ))}
          </div>
        </div>
      ) : (
        <div style={{
          padding: '16px 20px',
          background: 'var(--bg-subtle)',
          borderRadius: 'var(--radius-md)',
          fontSize: '14px',
          color: 'var(--text-secondary)',
          textAlign: 'center',
        }}>
          No vacation days marked — full program pricing applies.
        </div>
      )}
    </div>
  )
}
