'use client'

import Link from 'next/link'
import { Calendar, Zap, Clock } from 'lucide-react'

const weeks = [
  { num: 1, dates: 'Oct 8 (Thu)', curriculum: 'Scratch & Coding Foundations', phase: 'scratch' },
  { num: 2, dates: 'Oct 15 (Thu)', curriculum: 'Interactive Game & Animation', phase: 'scratch' },
  { num: 3, dates: 'Oct 22 (Thu)', curriculum: 'Logic, Loops & Conditionals', phase: 'scratch' },
  { num: 4, dates: 'Oct 29 (Thu)', curriculum: 'Custom Blocks & Cloning', phase: 'scratch' },
  { num: 5, dates: 'Nov 5 (Thu)', curriculum: 'Python IDE & Variables', phase: 'python' },
  { num: 6, dates: 'Nov 12 (Thu)', curriculum: 'Control Flow & Data Logic', phase: 'python' },
  { num: 7, dates: 'Nov 19 (Thu)', curriculum: 'Final Portfolio & Showcase', phase: 'python' },
]

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
            7-Week Thursday Coding Program
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '16px', maxWidth: '640px', margin: '0 auto' }}>
            Starts <strong>October 8th</strong>. Every Thursday for 7 weeks. Complete 7-week program tuition is <strong>$200</strong>.
          </p>
        </div>

        {/* Thursday Class Slots Callout */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '20px',
            marginBottom: '48px',
          }}
        >
          {/* Class 1 — Beginner */}
          <div
            style={{
              padding: '28px',
              background: 'linear-gradient(135deg, #F0FDF4 0%, #DCFCE7 100%)',
              border: '1px solid #A7F3D0',
              borderRadius: 'var(--radius-lg)',
              position: 'relative',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px', color: '#065F46' }}>
              <Clock size={18} />
              <span style={{ fontWeight: 700, fontSize: '15px' }}>5:00 PM – 6:00 PM (Every Thursday)</span>
            </div>
            <h3 style={{ fontFamily: 'Outfit, sans-serif', fontSize: '20px', fontWeight: 800, color: '#065F46', marginBottom: '8px' }}>
              Beginner Coding Class
            </h3>
            <p style={{ fontSize: '14px', color: '#047857', lineHeight: 1.6, margin: 0 }}>
              Designed for new students (ages 7–12). Learn Scratch block coding, computational thinking, and game mechanics in a hands-on environment.
            </p>
          </div>

          {/* Class 2 — Level 2 (With Vertical Purple Dots) */}
          <div
            style={{
              padding: '28px',
              background: 'linear-gradient(135deg, #F5F3FF 0%, #EDE9FE 100%)',
              border: '1px solid #DDD6FE',
              borderRadius: 'var(--radius-lg)',
              display: 'flex',
              gap: '20px',
              alignItems: 'flex-start',
            }}
          >
            {/* Level 2 Vertical Purple Dots Indicator (2 out of 10 filled) */}
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '5px',
                paddingTop: '4px',
              }}
              title="Level 2 (2 out of 10 level dots)"
            >
              {Array.from({ length: 10 }).map((_, index) => {
                // Fill 2 dots out of 10 (top to bottom: first 2 filled, rest outlined)
                const isFilled = index < 2
                return (
                  <div
                    key={index}
                    style={{
                      width: '8px',
                      height: '8px',
                      borderRadius: '50%',
                      background: isFilled ? '#7C3AED' : 'transparent',
                      border: isFilled ? 'none' : '1.5px solid #A78BFA',
                      boxShadow: isFilled ? '0 0 6px rgba(124,58,237,0.4)' : 'none',
                    }}
                  />
                )
              })}
              <span style={{ fontSize: '9px', fontWeight: 800, color: '#7C3AED', marginTop: '4px' }}>LVL 2</span>
            </div>

            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px', color: '#5B21B6' }}>
                <Clock size={18} />
                <span style={{ fontWeight: 700, fontSize: '15px' }}>7:00 PM – 8:00 PM (Every Thursday)</span>
              </div>
              <h3 style={{ fontFamily: 'Outfit, sans-serif', fontSize: '20px', fontWeight: 800, color: '#5B21B6', marginBottom: '8px' }}>
                Level 2 Class (Advanced / Alumni)
              </h3>
              <p style={{ fontSize: '14px', color: '#6D28D9', lineHeight: 1.6, margin: 0 }}>
                For students who completed the Beginners Course or have verified outside experience. Moves into Python syntax, data logic, and independent project creation.
              </p>
            </div>
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
            return (
              <div
                key={week.num}
                className="card animate-fade-in"
                style={{ padding: '20px' }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '14px' }}>
                  <span
                    style={{
                      background: week.phase === 'scratch' ? '#D1FAE5' : '#EDE9FE',
                      color: week.phase === 'scratch' ? '#065F46' : '#5B21B6',
                      fontSize: '11px',
                      fontWeight: 700,
                      padding: '4px 10px',
                      borderRadius: 'var(--radius-full)',
                      letterSpacing: '0.04em',
                    }}
                  >
                    Week {week.num}
                  </span>
                  <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)' }}>
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
                    color: week.phase === 'scratch' ? '#065F46' : '#5B21B6',
                  }}
                >
                  {week.curriculum}
                </div>
              </div>
            )
          })}
        </div>

        {/* Pricing banner */}
        <div
          style={{
            background: 'linear-gradient(135deg, #1E1B4B 0%, #312E81 100%)',
            borderRadius: 'var(--radius-xl)',
            padding: '32px 40px',
            color: 'white',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '20px',
          }}
        >
          <div>
            <div style={{ fontSize: '13px', color: '#A78BFA', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '4px' }}>
              Full 7-Week Program Tuition
            </div>
            <div style={{ fontFamily: 'Outfit, sans-serif', fontSize: '32px', fontWeight: 900 }}>
              $200 <span style={{ fontSize: '16px', fontWeight: 400, color: 'rgba(255,255,255,0.7)' }}>flat for all 7 Thursdays</span>
            </div>
            <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.7)', marginTop: '4px' }}>
              Includes both 5:00 PM Beginner and 7:00 PM Level 2 class tracks.
            </div>
          </div>

          <Link href="/register" className="btn btn-primary btn-lg">
            <Zap size={17} />
            Register for Fall Program
          </Link>
        </div>
      </div>
    </section>
  )
}
