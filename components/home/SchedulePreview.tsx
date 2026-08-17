'use client'

import Link from 'next/link'
import { Calendar, Zap, Clock, BookOpen } from 'lucide-react'

const weeks = [
  { num: 1, dates: 'Sep 10', curriculum: 'Scratch & Coding Basics', phase: 'scratch' },
  { num: 2, dates: 'Sep 17', curriculum: 'Interactive Game Design', phase: 'scratch' },
  { num: 3, dates: 'Sep 24', curriculum: 'Logic, Loops & Variables', phase: 'scratch' },
  { num: 4, dates: 'Oct 1', curriculum: 'Animation & Graphics', phase: 'scratch' },
  { num: 5, dates: 'Oct 8', curriculum: 'Python IDE & Core Syntax', phase: 'python' },
  { num: 6, dates: 'Oct 15', curriculum: 'Algorithms & Data Logic', phase: 'python' },
  { num: 7, dates: 'Oct 22', curriculum: 'Final Project Showcase', phase: 'python' },
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
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <span
            style={{
              display: 'inline-block',
              background: '#EDE9FE',
              color: '#5B21B6',
              fontSize: '12px',
              fontWeight: 700,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              padding: '4px 12px',
              borderRadius: 'var(--radius-full)',
              marginBottom: '12px',
            }}
          >
            Fall 2026 Schedule
          </span>
          <h2
            style={{
              fontFamily: 'Outfit, sans-serif',
              fontSize: 'clamp(28px, 4vw, 44px)',
              fontWeight: 800,
              marginBottom: '12px',
            }}
          >
            7-Week Fall Coding Program
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '16px', maxWidth: '600px', margin: '0 auto' }}>
            Classes run <strong>every Thursday starting September 10th</strong>. Two 1-hour tracks are offered each Thursday.
          </p>
        </div>

        {/* Thursday Class Slots Callout */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '16px',
            marginBottom: '48px',
          }}
        >
          {/* Beginner Slot */}
          <div
            style={{
              padding: '24px',
              background: 'linear-gradient(135deg, #F0FDF4 0%, #DCFCE7 100%)',
              border: '1px solid #A7F3D0',
              borderRadius: 'var(--radius-lg)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', color: '#065F46' }}>
              <Clock size={18} />
              <span style={{ fontWeight: 700, fontSize: '15px' }}>Thursday Class 1 — 5:00 PM to 6:00 PM</span>
            </div>
            <h3 style={{ fontFamily: 'Outfit, sans-serif', fontSize: '18px', fontWeight: 700, color: '#065F46', marginBottom: '4px' }}>
              Beginner Coding Class
            </h3>
            <p style={{ fontSize: '14px', color: '#047857', lineHeight: 1.5, margin: 0 }}>
              Designed for new students (ages 7–12). Learn visual block-based programming with Scratch and foundational computational thinking.
            </p>
          </div>

          {/* Next Level Slot */}
          <div
            style={{
              padding: '24px',
              background: 'linear-gradient(135deg, #F5F3FF 0%, #EDE9FE 100%)',
              border: '1px solid #DDD6FE',
              borderRadius: 'var(--radius-lg)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', color: '#5B21B6' }}>
              <Clock size={18} />
              <span style={{ fontWeight: 700, fontSize: '15px' }}>Thursday Class 2 — 6:00 PM to 7:00 PM</span>
            </div>
            <h3 style={{ fontFamily: 'Outfit, sans-serif', fontSize: '18px', fontWeight: 700, color: '#5B21B6', marginBottom: '4px' }}>
              Next-Level Class (Alumni & Advanced)
            </h3>
            <p style={{ fontSize: '14px', color: '#6D28D9', lineHeight: 1.5, margin: 0 }}>
              For students who completed the Beginners Course or possess verified outside coding experience. Covers Python syntax and project building.
            </p>
          </div>
        </div>

        {/* 7 Week Grid */}
        <div
          className="stagger-children"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
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
                    Thursday
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
            Register for Fall Program
          </Link>
        </div>
      </div>
    </section>
  )
}
