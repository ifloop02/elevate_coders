'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Calendar, Zap, Clock } from 'lucide-react'

interface ScheduleWeek {
  num: number
  dates: string
  title: string
  desc: string
  moduleName?: string
}

// 🟢 LEVEL 1 BEGINNER (5:00 PM – 6:00 PM) — ALL 7 WEEKS GREEN
const LEVEL_1_WEEKS: ScheduleWeek[] = [
  { num: 1, dates: 'Oct 8 (Thu)', title: 'Scratch & Coding Foundations', desc: 'Introduction to visual block coding, sprites, motion loops, and X/Y coordinates.' },
  { num: 2, dates: 'Oct 15 (Thu)', title: 'Interactive Game & Animation', desc: 'Sprite collision detection, keypress event triggers, and costume animations.' },
  { num: 3, dates: 'Oct 22 (Thu)', title: 'Logic, Loops & Scoreboards', desc: 'Conditional logic (if/then statements), score variables, and win/loss states.' },
  { num: 4, dates: 'Oct 29 (Thu)', title: 'Custom Blocks & Sound FX', desc: 'Reusable My Blocks functions, sound synthesis, and backdrop stage transitions.' },
  { num: 5, dates: 'Nov 5 (Thu)', title: 'Multi-Level World Design', desc: 'Level switching variables, item collectibles, and health bar mechanics.' },
  { num: 6, dates: 'Nov 12 (Thu)', title: 'UI Polish & Special Effects', desc: 'Screen particle feedback, victory animations, and custom UI design systems.' },
  { num: 7, dates: 'Nov 19 (Thu)', title: 'Beginner Capstone Showcase', desc: 'Final code triage, debugging strategies, and peer review presentation.' },
]

// 🟣 LEVEL 2 ADVANCED (7:00 PM – 8:00 PM) — ALL 7 WEEKS PURPLE
const LEVEL_2_WEEKS: ScheduleWeek[] = [
  {
    num: 1,
    dates: 'Oct 8 (Thu)',
    title: 'Advanced Physics & Gravity Engines',
    moduleName: 'Module 1: System-Driven Game Mechanics',
    desc: 'The Concept: Moving beyond basic change y loops into velocity-based systems.',
  },
  {
    num: 2,
    dates: 'Oct 15 (Thu)',
    title: 'Advanced Event Architecture',
    moduleName: 'Module 1: System-Driven Game Mechanics',
    desc: 'The Concept: Decoupling code strings so multiple elements react to global system triggers without polling.',
  },
  {
    num: 3,
    dates: 'Oct 22 (Thu)',
    title: 'Data Streams & Scoreboards',
    moduleName: 'Module 1: System-Driven Game Mechanics',
    desc: 'The Concept: Local vs global variables, persistent data tracking, and dynamic list arrays.',
  },
  {
    num: 4,
    dates: 'Oct 29 (Thu)',
    title: 'Screen Scrolling & Infinite Maps',
    moduleName: 'Module 2: Complex Game Genres',
    desc: 'The Concept: Moving the world around the player character instead of moving the player across a static canvas.',
  },
  {
    num: 5,
    dates: 'Nov 5 (Thu)',
    title: 'Autonomous AI & Pathfinding',
    moduleName: 'Module 2: Complex Game Genres',
    desc: 'The Concept: Coding smart enemies that track player targets without using simple glide blocks.',
  },
  {
    num: 6,
    dates: 'Nov 12 (Thu)',
    title: 'Code Polish & UI Design Systems',
    moduleName: 'Module 3: Polish, Publishing, and Production',
    desc: 'The Concept: Designing professional game interfaces, particle effect feedback loops, and volume attenuation.',
  },
  {
    num: 7,
    dates: 'Nov 19 (Thu)',
    title: 'Capstone Debugging & Playtesting',
    moduleName: 'Module 3: Polish, Publishing, and Production',
    desc: 'The Concept: Code triage, optimization strategies, identifying memory leaks, and processing user feedback.',
  },
]

function VerticalLevelDots({ filledCount, color, label }: { filledCount: number; color: string; label: string }) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '4px',
        paddingTop: '2px',
        flexShrink: 0,
      }}
      title={`${label} (${filledCount} out of 10 level dots filled from bottom)`}
    >
      <span style={{ fontSize: '9px', fontWeight: 800, color, marginBottom: '2px' }}>{label}</span>
      {Array.from({ length: 10 }).map((_, index) => {
        const isFilled = index >= 10 - filledCount
        return (
          <div
            key={index}
            style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              background: isFilled ? color : 'transparent',
              border: isFilled ? 'none' : `1.5px solid ${color}50`,
              boxShadow: isFilled ? `0 0 6px ${color}60` : 'none',
              transition: 'all 300ms ease',
            }}
          />
        )
      })}
    </div>
  )
}

export default function SchedulePreview() {
  const [selectedLevel, setSelectedLevel] = useState<'LEVEL_1' | 'LEVEL_2'>('LEVEL_1')

  const isLevel1 = selectedLevel === 'LEVEL_1'
  const activeWeeks: ScheduleWeek[] = isLevel1 ? LEVEL_1_WEEKS : LEVEL_2_WEEKS
  const brandColor = isLevel1 ? '#059669' : '#7C3AED'

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
            7-Week Thursday Coding Programs
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '16px', maxWidth: '640px', margin: '0 auto' }}>
            Starts <strong>October 8th</strong>. Both Level 1 and Level 2 run for 7 Thursdays. Complete 7-week program tuition is <strong>$200</strong>.
          </p>
        </div>

        {/* Thursday Class Slots Callout */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '20px',
            marginBottom: '40px',
          }}
        >
          {/* Class 1 — Level 1 Beginner (1 dot filled at bottom) */}
          <div
            onClick={() => setSelectedLevel('LEVEL_1')}
            style={{
              padding: '28px',
              background: isLevel1 ? 'linear-gradient(135deg, #F0FDF4 0%, #DCFCE7 100%)' : 'var(--bg-white)',
              border: `2px solid ${isLevel1 ? '#10B981' : 'var(--border-light)'}`,
              borderRadius: 'var(--radius-lg)',
              display: 'flex',
              gap: '20px',
              alignItems: 'flex-start',
              cursor: 'pointer',
              transition: 'all 300ms ease',
              boxShadow: isLevel1 ? '0 4px 20px rgba(16,185,129,0.15)' : 'none',
            }}
          >
            <VerticalLevelDots filledCount={1} color="#059669" label="LVL 1" />

            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px', color: '#065F46' }}>
                <Clock size={18} />
                <span style={{ fontWeight: 700, fontSize: '15px' }}>5:00 PM – 6:00 PM (Every Thursday)</span>
              </div>
              <h3 style={{ fontFamily: 'Outfit, sans-serif', fontSize: '20px', fontWeight: 800, color: '#065F46', marginBottom: '8px' }}>
                🟢 Level 1: Beginner Coding Class (Full 7 Weeks)
              </h3>
              <p style={{ fontSize: '14px', color: '#047857', lineHeight: 1.6, margin: 0 }}>
                Designed for new students (ages 7–12). Complete 7-week foundational track covering Scratch visual block coding, game mechanics, and computational thinking.
              </p>
            </div>
          </div>

          {/* Class 2 — Level 2 Advanced (2 dots filled at bottom) */}
          <div
            onClick={() => setSelectedLevel('LEVEL_2')}
            style={{
              padding: '28px',
              background: !isLevel1 ? 'linear-gradient(135deg, #F5F3FF 0%, #EDE9FE 100%)' : 'var(--bg-white)',
              border: `2px solid ${!isLevel1 ? '#7C3AED' : 'var(--border-light)'}`,
              borderRadius: 'var(--radius-lg)',
              display: 'flex',
              gap: '20px',
              alignItems: 'flex-start',
              cursor: 'pointer',
              transition: 'all 300ms ease',
              boxShadow: !isLevel1 ? '0 4px 20px rgba(124,58,237,0.15)' : 'none',
            }}
          >
            <VerticalLevelDots filledCount={2} color="#7C3AED" label="LVL 2" />

            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px', color: '#5B21B6' }}>
                <Clock size={18} />
                <span style={{ fontWeight: 700, fontSize: '15px' }}>7:00 PM – 8:00 PM (Every Thursday)</span>
              </div>
              <h3 style={{ fontFamily: 'Outfit, sans-serif', fontSize: '20px', fontWeight: 800, color: '#5B21B6', marginBottom: '8px' }}>
                🟣 Level 2: Advanced Coding Class (Full 7 Weeks)
              </h3>
              <p style={{ fontSize: '14px', color: '#6D28D9', lineHeight: 1.6, margin: 0 }}>
                For students who completed Level 1 or have verified outside experience. Complete 7-week 3-module track: Physics Engines, AI Pathfinding, and UI Production.
              </p>
            </div>
          </div>
        </div>

        {/* Selected Level Title Banner */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <h3 style={{ fontFamily: 'Outfit, sans-serif', fontSize: '22px', fontWeight: 800, color: brandColor, margin: 0 }}>
              {isLevel1 ? '🟢 Level 1 Beginner — Full 7-Week Curriculum Roadmap (5:00 PM – 6:00 PM)' : '🟣 Level 2 Advanced — Full 7-Week Curriculum Roadmap (7:00 PM – 8:00 PM)'}
            </h3>
            <p style={{ fontSize: '14px', color: 'var(--text-secondary)', margin: '4px 0 0 0' }}>
              Click either class box above to toggle between Level 1 and Level 2 curriculum details.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              onClick={() => setSelectedLevel('LEVEL_1')}
              style={{
                padding: '6px 14px',
                borderRadius: 'var(--radius-full)',
                fontSize: '13px',
                fontWeight: 700,
                border: 'none',
                cursor: 'pointer',
                background: isLevel1 ? '#D1FAE5' : '#E5E7EB',
                color: isLevel1 ? '#065F46' : '#4B5563',
              }}
            >
              🟢 View Level 1
            </button>
            <button
              onClick={() => setSelectedLevel('LEVEL_2')}
              style={{
                padding: '6px 14px',
                borderRadius: 'var(--radius-full)',
                fontSize: '13px',
                fontWeight: 700,
                border: 'none',
                cursor: 'pointer',
                background: !isLevel1 ? '#EDE9FE' : '#E5E7EB',
                color: !isLevel1 ? '#5B21B6' : '#4B5563',
              }}
            >
              🟣 View Level 2
            </button>
          </div>
        </div>

        {/* 7 Week Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: '18px',
            marginBottom: '48px',
          }}
        >
          {activeWeeks.map((w) => {
            return (
              <div
                key={w.num}
                className="card animate-fade-in"
                style={{
                  padding: '24px',
                  background: 'var(--bg-white)',
                  display: 'flex',
                  flexDirection: 'column',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                  <span
                    style={{
                      background: isLevel1 ? '#D1FAE5' : '#EDE9FE',
                      color: isLevel1 ? '#065F46' : '#5B21B6',
                      fontSize: '11px',
                      fontWeight: 800,
                      padding: '3px 10px',
                      borderRadius: 'var(--radius-full)',
                    }}
                  >
                    Week {w.num}
                  </span>
                  <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Calendar size={12} /> {w.dates}
                  </span>
                </div>

                {w.moduleName && (
                  <div style={{ fontSize: '11px', fontWeight: 700, color: '#7E22CE', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                    {w.moduleName}
                  </div>
                )}

                <h4 style={{ fontFamily: 'Outfit, sans-serif', fontSize: '17px', fontWeight: 800, color: brandColor, marginBottom: '10px' }}>
                  {w.title}
                </h4>

                <div style={{ fontSize: '13px', lineHeight: 1.6, color: 'var(--text-secondary)', whiteSpace: 'pre-line' }}>
                  {w.desc}
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
              Choose Level 1 (5:00 PM) or Level 2 (7:00 PM). Complete 7-week course program.
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
