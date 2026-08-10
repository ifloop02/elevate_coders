'use client'

import Link from 'next/link'
import { Calendar, Zap } from 'lucide-react'

const weeks = [
  { num: 1, dates: 'Jun 15 – Jun 19', curriculum: 'Scratch Foundations', phase: 'scratch' },
  { num: 2, dates: 'Jun 22 – Jun 26', curriculum: 'Scratch Foundations', phase: 'scratch' },
  { num: 3, dates: 'Jun 29 – Jul 3', curriculum: 'Scratch Foundations', phase: 'scratch' },
  { num: 4, dates: 'Jul 6 – Jul 10', curriculum: 'Scratch Foundations', phase: 'scratch' },
  { num: 5, dates: 'Jul 13 – Jul 17', curriculum: 'Python Exploration', phase: 'python' },
  { num: 6, dates: 'Jul 20 – Jul 24', curriculum: 'Python Exploration', phase: 'python' },
  { num: 7, dates: 'Jul 27 – Jul 31', curriculum: 'Python Exploration', phase: 'python' },
  { num: 8, dates: 'Aug 3 – Aug 7', curriculum: 'Python Exploration', phase: 'python' },
]

const phaseColors = {
  scratch: { bg: '#D1FAE5', text: '#065F46', label: '#065F46' },
  python: { bg: '#EDE9FE', text: '#5B21B6', label: '#7C3AED' },
}

export default function SchedulePreview() {
  return (
    <section
      style={{
        padding: '96px 0',
        background: 'var(--bg-base)',
      }}
    >
      <div className="container-app">
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '56px' }}>
          <h2
            style={{
              fontFamily: 'Outfit, sans-serif',
              fontSize: 'clamp(28px, 4vw, 44px)',
              fontWeight: 800,
              marginBottom: '12px',
            }}
          >
            Summer 2026 Schedule
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '16px' }}>
            Select any combination of weeks. Curriculum builds cumulatively.
          </p>
        </div>

        {/* Week grid */}
        <div
          className="stagger-children"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
            gap: '16px',
            marginBottom: '48px',
          }}
        >
          {weeks.map((week) => {
            const colors = phaseColors[week.phase as keyof typeof phaseColors]
            return (
              <div
                key={week.num}
                className="card animate-fade-in"
                style={{ padding: '20px' }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '14px' }}>
                  <span
                    style={{
                      background: colors.bg,
                      color: colors.label,
                      fontSize: '11px',
                      fontWeight: 700,
                      padding: '4px 10px',
                      borderRadius: 'var(--radius-full)',
                      letterSpacing: '0.04em',
                    }}
                  >
                    Week {week.num}
                  </span>
                  <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-secondary)' }}>
                    $200
                  </span>
                </div>

                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    color: 'var(--text-secondary)',
                    fontSize: '13px',
                    marginBottom: '8px',
                  }}
                >
                  <Calendar size={13} />
                  {week.dates}
                </div>

                <div
                  style={{
                    fontSize: '13px',
                    fontWeight: 500,
                    color: colors.text,
                  }}
                >
                  {week.curriculum}
                </div>
              </div>
            )
          })}
        </div>

        {/* CTA */}
        <div style={{ textAlign: 'center' }}>
          <Link href="/register" className="btn btn-primary btn-lg">
            <Zap size={17} />
            Start Registration
          </Link>
        </div>

        {/* Fall schedule note */}
        <div
          style={{
            marginTop: '52px',
            padding: '20px 28px',
            background: 'var(--bg-subtle)',
            borderRadius: 'var(--radius-lg)',
            border: '1px solid var(--border-purple)',
            display: 'flex',
            alignItems: 'flex-start',
            gap: '14px',
          }}
        >
          <div
            style={{
              minWidth: '36px',
              height: '36px',
              borderRadius: '10px',
              background: 'var(--brand-purple)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Calendar size={16} color="white" />
          </div>
          <div>
            <div style={{ fontWeight: 600, fontSize: '15px', marginBottom: '4px' }}>
              Fall 2026 — Thursday Sessions
            </div>
            <div style={{ color: 'var(--text-secondary)', fontSize: '14px', lineHeight: 1.6 }}>
              Starting <strong>September 10th</strong>, every Thursday.{' '}
              <strong>Beginner class: 5:00 PM – 6:00 PM.</strong>{' '}
              <strong>Next-level class (prerequisite required): 6:00 PM – 7:00 PM.</strong>{' '}
              Fall registration opens after summer camp concludes.
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
