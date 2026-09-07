'use client'

import { useState } from 'react'
import { Calendar, Lock, CheckCircle2, Clock, Lightbulb } from 'lucide-react'
import { PROGRAM_TOTAL_TUITION, PRICE_PER_SESSION, formatCurrency } from '@/lib/proration'

export interface WeekData {
  id: string
  weekNumber: number
  dates: string
  title: string
  moduleName?: string
  concept?: string
  project?: string
  requiresPrerequisite: boolean
}

interface WeekPickerProps {
  selectedIds: string[]
  prerequisiteVerified: boolean
  onChange: (ids: string[], classLevel: 'BEGINNER' | 'LEVEL_2') => void
}

// 🟢 BEGINNER CLASS (5:00 PM – 6:00 PM) — ALL GREEN
const BEGINNER_WEEKS: WeekData[] = [
  {
    id: 'fall-2026-beg-1',
    weekNumber: 1,
    dates: 'Oct 8 (Thu)',
    title: 'Scratch & Coding Foundations',
    concept: 'Introduction to visual block coding, sprites, motion loops, and X/Y coordinates.',
    project: 'Build an interactive animated maze game.',
    requiresPrerequisite: false,
  },
  {
    id: 'fall-2026-beg-2',
    weekNumber: 2,
    dates: 'Oct 15 (Thu)',
    title: 'Interactive Game & Animation',
    concept: 'Sprite collision detection, keypress event triggers, and costume animations.',
    project: 'Create a multi-character arcade dodge game.',
    requiresPrerequisite: false,
  },
  {
    id: 'fall-2026-beg-3',
    weekNumber: 3,
    dates: 'Oct 22 (Thu)',
    title: 'Logic, Loops & Scoreboards',
    concept: 'Conditional logic (if/then statements), score variables, and win/loss states.',
    project: 'Design a space coin catcher with dynamic scoreboards.',
    requiresPrerequisite: false,
  },
  {
    id: 'fall-2026-beg-4',
    weekNumber: 4,
    dates: 'Oct 29 (Thu)',
    title: 'Custom Blocks & Sound FX',
    concept: 'Reusable My Blocks functions, sound synthesis, and backdrop stage transitions.',
    project: 'Build a multi-level platformer stage with sound effects.',
    requiresPrerequisite: false,
  },
  {
    id: 'fall-2026-beg-5',
    weekNumber: 5,
    dates: 'Nov 5 (Thu)',
    title: 'Multi-Level World Design',
    concept: 'Level switching variables, item collectibles, and health bar mechanics.',
    project: 'Develop a 3-level adventure quest game.',
    requiresPrerequisite: false,
  },
  {
    id: 'fall-2026-beg-6',
    weekNumber: 6,
    dates: 'Nov 12 (Thu)',
    title: 'UI Polish & Special Effects',
    concept: 'Screen particle feedback, victory animations, and custom UI design systems.',
    project: 'Add popping particle counters and animated victory screens to your game.',
    requiresPrerequisite: false,
  },
  {
    id: 'fall-2026-beg-7',
    weekNumber: 7,
    dates: 'Nov 19 (Thu)',
    title: 'Beginner Capstone Showcase',
    concept: 'Final code triage, debugging strategies, and peer review presentation.',
    project: 'Present your completed game at the Studio Showcase & Peer Review Session.',
    requiresPrerequisite: false,
  },
]

// 🟣 LEVEL 2 CLASS (7:00 PM – 8:00 PM) — ALL PURPLE
const LEVEL_2_WEEKS: WeekData[] = [
  // Module 1: System-Driven Game Mechanics (Weeks 1–3)
  {
    id: 'fall-2026-lvl2-1',
    weekNumber: 1,
    dates: 'Oct 8 (Thu)',
    title: 'Advanced Physics & Gravity Engines',
    moduleName: 'Module 1: System-Driven Game Mechanics',
    concept: 'Moving beyond basic change y loops into velocity-based systems.',
    project: 'Build a Flappy Bird clone or Doodle Jump mechanics engine featuring elastic bouncing platforms and terminal velocity acceleration.',
    requiresPrerequisite: true,
  },
  {
    id: 'fall-2026-lvl2-2',
    weekNumber: 2,
    dates: 'Oct 15 (Thu)',
    title: 'Advanced Event Architecture',
    moduleName: 'Module 1: System-Driven Game Mechanics',
    concept: 'Decoupling code strings so multiple elements instantly react to global system triggers without constant polling.',
    project: 'Create a Secret Agent Security Gate or a multi-stage boss fight where destroying a shield block triggers the boss to switch attack styles automatically.',
    requiresPrerequisite: true,
  },
  {
    id: 'fall-2026-lvl2-3',
    weekNumber: 3,
    dates: 'Oct 22 (Thu)',
    title: 'Data Streams & Scoreboards',
    moduleName: 'Module 1: System-Driven Game Mechanics',
    concept: 'Local vs. global variables, persistent data tracking, and dynamic list arrays.',
    project: 'Build an arcade-style upgrade shop game where collected items are added to a visual inventory list array, tracking coin deductions and multipliers dynamically.',
    requiresPrerequisite: true,
  },
  // Module 2: Complex Game Genres (Weeks 4–5)
  {
    id: 'fall-2026-lvl2-4',
    weekNumber: 4,
    dates: 'Oct 29 (Thu)',
    title: 'Screen Scrolling & Infinite Maps',
    moduleName: 'Module 2: Complex Game Genres',
    concept: 'Moving the world around the player character instead of moving the player across a static canvas.',
    project: 'Design a horizontal platformer or a top-down car racing game where terrain tiles dynamically wrap back around the screen edges based on relative X/Y offsets.',
    requiresPrerequisite: true,
  },
  {
    id: 'fall-2026-lvl2-5',
    weekNumber: 5,
    dates: 'Nov 5 (Thu)',
    title: 'Autonomous AI & Pathfinding',
    moduleName: 'Module 2: Complex Game Genres',
    concept: 'Coding smart enemies that track player targets without using simple, basic glide blocks.',
    project: 'Build a classic Pac-Man style maze game featuring automated enemy ghost mobs that calculate real-time distance formulas to stalk the player through narrow hallways.',
    requiresPrerequisite: true,
  },
  // Module 3: Polish, Publishing, and Production (Weeks 6–7)
  {
    id: 'fall-2026-lvl2-6',
    weekNumber: 6,
    dates: 'Nov 12 (Thu)',
    title: 'Code Polish & UI Design Systems',
    moduleName: 'Module 3: Polish, Publishing, and Production',
    concept: 'Designing professional game interfaces, particle effect feedback loops, and volume attenuation systems.',
    project: 'Take a previous raw project and design animated health bars, screen shakes on impact, popping particle point counters, and distinct audio tracks.',
    requiresPrerequisite: true,
  },
  {
    id: 'fall-2026-lvl2-7',
    weekNumber: 7,
    dates: 'Nov 19 (Thu)',
    title: 'Capstone Debugging & Playtesting',
    moduleName: 'Module 3: Polish, Publishing, and Production',
    concept: 'Code triage, optimization strategies, identifying memory leaks, and processing constructive user feedback.',
    project: 'Run a professional Studio Showcase & Peer Review Session where students pitch custom creations, trade laptops to fish for optimization bugs, and document revisions.',
    requiresPrerequisite: true,
  },
]

export default function WeekPicker({ selectedIds, prerequisiteVerified, onChange }: WeekPickerProps) {
  const [activeLevel, setActiveLevel] = useState<'BEGINNER' | 'LEVEL_2'>('BEGINNER')

  const currentWeeks = activeLevel === 'BEGINNER' ? BEGINNER_WEEKS : LEVEL_2_WEEKS

  const toggle = (id: string) => {
    const next = selectedIds.includes(id)
      ? selectedIds.filter((i) => i !== id)
      : [...selectedIds, id]
    onChange(next, activeLevel)
  }

  const selectAll = () => {
    onChange(currentWeeks.map((w) => w.id), activeLevel)
  }

  const isAllSelected = currentWeeks.every((w) => selectedIds.includes(w.id))

  return (
    <div>
      {/* Level selector tabs */}
      <div style={{ marginBottom: '24px' }}>
        <div style={{ fontSize: '13px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-secondary)', marginBottom: '10px' }}>
          Select Class Level & Time Slot
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', maxWidth: '640px' }}>
          {/* Beginner Tab — ALL GREEN */}
          <button
            type="button"
            onClick={() => {
              setActiveLevel('BEGINNER')
              onChange(BEGINNER_WEEKS.map((w) => w.id), 'BEGINNER')
            }}
            style={{
              padding: '16px',
              borderRadius: 'var(--radius-lg)',
              border: `2px solid ${activeLevel === 'BEGINNER' ? '#10B981' : 'var(--border-light)'}`,
              background: activeLevel === 'BEGINNER' ? '#F0FDF4' : 'var(--bg-white)',
              textAlign: 'left',
              cursor: 'pointer',
              transition: 'all var(--transition-fast)',
              boxShadow: activeLevel === 'BEGINNER' ? '0 0 0 3px rgba(16,185,129,0.15)' : 'none',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#065F46', fontSize: '12px', fontWeight: 700, marginBottom: '4px' }}>
              <Clock size={14} /> 5:00 PM – 6:00 PM (Every Thu)
            </div>
            <div style={{ fontFamily: 'Outfit, sans-serif', fontSize: '16px', fontWeight: 800, color: '#065F46' }}>
              🟢 Beginner Coding Class
            </div>
            <div style={{ fontSize: '12px', color: '#047857', marginTop: '2px' }}>
              All 7 Weeks Green — Ages 7–12
            </div>
          </button>

          {/* Level 2 Tab — ALL PURPLE */}
          <button
            type="button"
            onClick={() => {
              setActiveLevel('LEVEL_2')
              onChange(LEVEL_2_WEEKS.map((w) => w.id), 'LEVEL_2')
            }}
            style={{
              padding: '16px',
              borderRadius: 'var(--radius-lg)',
              border: `2px solid ${activeLevel === 'LEVEL_2' ? '#7C3AED' : 'var(--border-light)'}`,
              background: activeLevel === 'LEVEL_2' ? '#F5F3FF' : 'var(--bg-white)',
              textAlign: 'left',
              cursor: 'pointer',
              transition: 'all var(--transition-fast)',
              boxShadow: activeLevel === 'LEVEL_2' ? '0 0 0 3px rgba(124,58,237,0.15)' : 'none',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#5B21B6', fontSize: '12px', fontWeight: 700, marginBottom: '4px' }}>
              <Clock size={14} /> 7:00 PM – 8:00 PM (Every Thu)
            </div>
            <div style={{ fontFamily: 'Outfit, sans-serif', fontSize: '16px', fontWeight: 800, color: '#5B21B6' }}>
              🟣 Level 2 Class (Advanced)
            </div>
            <div style={{ fontSize: '12px', color: '#6D28D9', marginTop: '2px' }}>
              All 7 Weeks Purple — 3 Modules
            </div>
          </button>
        </div>
      </div>

      {/* Header & Quick Action */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px', marginBottom: '16px' }}>
        <div>
          <h2 style={{ fontFamily: 'Outfit, sans-serif', fontSize: '20px', fontWeight: 700, margin: 0 }}>
            {activeLevel === 'BEGINNER' ? '🟢 Beginner Class 7-Week Sessions (5:00 PM – 6:00 PM)' : '🟣 Level 2 Class 7-Week Sessions (7:00 PM – 8:00 PM)'}
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '13px', marginTop: '4px', margin: 0 }}>
            Full 7-week program tuition is <strong>$200</strong> flat for all 7 Thursdays starting October 8th.
          </p>
        </div>

        <button
          type="button"
          onClick={selectAll}
          className="btn btn-secondary btn-sm"
          style={{ fontSize: '12px', padding: '6px 12px' }}
        >
          <CheckCircle2 size={14} color={activeLevel === 'BEGINNER' ? '#10B981' : '#7C3AED'} />
          {isAllSelected ? 'All 7 Sessions Enrolled' : 'Select Full 7-Session Package ($200)'}
        </button>
      </div>

      {/* Partial-selection advisory banner */}
      {selectedIds.length > 0 && !isAllSelected && (
        <div
          style={{
            marginBottom: '18px',
            padding: '14px 18px',
            background: 'linear-gradient(135deg, #FFFBEB 0%, #FEF3C7 100%)',
            border: '1.5px solid #FCD34D',
            borderRadius: 'var(--radius-md)',
            display: 'flex',
            gap: '12px',
            alignItems: 'flex-start',
          }}
        >
          <Lightbulb size={18} color="#D97706" style={{ flexShrink: 0, marginTop: '1px' }} />
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 700, fontSize: '14px', color: '#92400E', marginBottom: '4px' }}>
              We recommend enrolling in all 7 weeks for the best results
            </div>
            <div style={{ fontSize: '13px', color: '#78350F', lineHeight: 1.6 }}>
              Each week in this program builds directly on the last — the concepts, code patterns, and
              projects are designed as a progressive sequence. Students who attend the full 7-week track
              leave with a <strong>complete, portfolio-ready game project</strong> and a strong foundation
              for continued learning. Partial attendance may result in gaps that make later sessions
              harder to follow.
            </div>
            <button
              type="button"
              onClick={selectAll}
              style={{
                marginTop: '10px',
                padding: '6px 14px',
                background: '#D97706',
                color: '#fff',
                border: 'none',
                borderRadius: 'var(--radius-full)',
                fontSize: '12px',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
              }}
            >
              <CheckCircle2 size={13} />
              Add all 7 weeks — $200 flat
            </button>
          </div>
        </div>
      )}

      {/* Week Cards Grid */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '24px' }}>
        {currentWeeks.map((week) => {
          const isSelected = selectedIds.includes(week.id)
          const isLevel2 = activeLevel === 'LEVEL_2'

          return (
            <div
              key={week.id}
              onClick={() => toggle(week.id)}
              style={{
                border: `2px solid ${isSelected ? (isLevel2 ? '#7C3AED' : '#10B981') : 'var(--border-light)'}`,
                background: isSelected ? (isLevel2 ? '#F5F3FF' : '#F0FDF4') : 'var(--bg-white)',
                borderRadius: 'var(--radius-md)',
                padding: '18px 20px',
                cursor: 'pointer',
                transition: 'all var(--transition-fast)',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px', flexWrap: 'wrap', gap: '8px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{
                    background: isLevel2 ? '#EDE9FE' : '#D1FAE5',
                    color: isLevel2 ? '#5B21B6' : '#065F46',
                    fontSize: '11px', fontWeight: 800, padding: '3px 10px',
                    borderRadius: 'var(--radius-full)', letterSpacing: '0.04em'
                  }}>
                    Week {week.weekNumber} — {week.dates}
                  </span>

                  {week.moduleName && (
                    <span style={{
                      background: '#F3E8FF', color: '#7E22CE',
                      fontSize: '11px', fontWeight: 700, padding: '3px 10px',
                      borderRadius: 'var(--radius-full)',
                    }}>
                      {week.moduleName}
                    </span>
                  )}
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  {week.requiresPrerequisite && !prerequisiteVerified && (
                    <Lock size={13} color="var(--text-muted)" />
                  )}
                  <span style={{ fontSize: '12px', fontWeight: 700, color: isLevel2 ? '#5B21B6' : '#065F46' }}>
                    {isSelected ? '✓ Enrolled' : `${formatCurrency(PRICE_PER_SESSION)}/session`}
                  </span>
                </div>
              </div>

              <h4 style={{ fontFamily: 'Outfit, sans-serif', fontSize: '16px', fontWeight: 700, color: isLevel2 ? '#5B21B6' : '#065F46', marginBottom: '6px' }}>
                {week.title}
              </h4>

              {week.concept && (
                <div style={{ fontSize: '13px', color: 'var(--text-primary)', marginBottom: '4px', lineHeight: 1.5 }}>
                  <strong>The Concept:</strong> {week.concept}
                </div>
              )}

              {week.project && (
                <div style={{ fontSize: '13px', color: isLevel2 ? '#6D28D9' : '#047857', lineHeight: 1.5 }}>
                  <strong>The Project:</strong> {week.project}
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* Running total footer */}
      {selectedIds.length > 0 && (
        <div style={{
          padding: '16px 20px',
          background: activeLevel === 'BEGINNER' ? '#F0FDF4' : '#F5F3FF',
          borderRadius: 'var(--radius-md)',
          border: `1.5px solid ${activeLevel === 'BEGINNER' ? '#A7F3D0' : '#DDD6FE'}`,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '8px',
        }}>
          <div>
            <span style={{ fontSize: '14px', color: 'var(--text-primary)', fontWeight: 600 }}>
              {activeLevel === 'BEGINNER' ? '🟢 Beginner Class' : '🟣 Level 2 Class'} — {selectedIds.length} of 7 sessions selected
            </span>
            {!isAllSelected && (
              <div style={{ fontSize: '12px', color: activeLevel === 'BEGINNER' ? '#047857' : '#6D28D9', marginTop: '2px' }}>
                💡 {7 - selectedIds.length} session{7 - selectedIds.length !== 1 ? 's' : ''} remaining — full 7-week track recommended
              </div>
            )}
          </div>
          <div style={{ textAlign: 'right' }}>
            <span style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 800, fontSize: '20px', color: activeLevel === 'BEGINNER' ? '#065F46' : '#5B21B6' }}>
              {isAllSelected
                ? `${formatCurrency(PROGRAM_TOTAL_TUITION)}`
                : formatCurrency(selectedIds.length * PRICE_PER_SESSION)}
            </span>
            <div style={{ fontSize: '11px', fontWeight: 400, color: 'var(--text-muted)', marginTop: '2px' }}>
              {isAllSelected ? 'full program — best value' : `${selectedIds.length} × ${formatCurrency(PRICE_PER_SESSION)}/session — prorated`}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
