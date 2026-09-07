'use client'

import { useState } from 'react'
import { MapPin, X, AlertTriangle } from 'lucide-react'
import { formatCurrency, calculatePricing } from '@/lib/proration'

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

// Fall 2026 — Thursdays for 7 weeks starting Oct 8
const WEEK_DATES: Record<number, string[]> = {
  1: ['2026-10-08'],
  2: ['2026-10-15'],
  3: ['2026-10-22'],
  4: ['2026-10-29'],
  5: ['2026-11-05'],
  6: ['2026-11-12'],
  7: ['2026-11-19'],
}

const DAY_LABELS = ['Thu']

export default function VacationTracker({ weeks, vacationDates, onChange }: VacationTrackerProps) {
  const [reason, setReason] = useState('')
  const [blockMessage, setBlockMessage] = useState<string | null>(null)

  const toggleDay = (date: string, weekNumber: number) => {
    const exists = vacationDates.find((v) => v.date === date)
    if (exists) {
      // Un-marking — always allowed, clear any block message
      setBlockMessage(null)
      onChange(vacationDates.filter((v) => v.date !== date))
    } else {
      // Would this vacation out every selected week?
      const afterToggle = [...vacationDates, { date, weekNumber, reason }]
      const vacationedWeekNums = new Set(afterToggle.map((v) => v.weekNumber))
      const activeWeeks = weeks.filter((w) => !vacationedWeekNums.has(w.weekNumber))
      if (activeWeeks.length === 0) {
        setBlockMessage(
          weeks.length === 1
            ? 'You only have 1 week selected. You cannot mark your only class as a vacation day — please add more weeks or remove this vacation.'
            : 'You cannot mark all of your selected weeks as vacation. At least one week must remain active.'
        )
        return
      }
      setBlockMessage(null)
      onChange(afterToggle)
    }
  }

  const pricing = calculatePricing(weeks.length, vacationDates.length, 0)

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

      {/* Block message */}
      {blockMessage && (
        <div
          role="alert"
          style={{
            marginBottom: '16px',
            padding: '12px 16px',
            background: '#FEF2F2',
            border: '1px solid #FCA5A5',
            borderRadius: 'var(--radius-md)',
            display: 'flex',
            alignItems: 'flex-start',
            gap: '10px',
            fontSize: '13px',
            color: '#DC2626',
            lineHeight: 1.5,
          }}
        >
          <AlertTriangle size={16} style={{ flexShrink: 0, marginTop: '1px' }} />
          <span>{blockMessage}</span>
        </div>
      )}

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
              <strong>−{formatCurrency(pricing.vacationCredit)}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid #FBCFE8', paddingTop: '8px', marginTop: '6px', color: 'var(--text-primary)' }}>
              <span>Adjusted total:</span>
              <strong style={{ fontFamily: 'Outfit, sans-serif', fontSize: '16px', color: 'var(--brand-purple)' }}>
                {formatCurrency(pricing.finalTotal)}
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
