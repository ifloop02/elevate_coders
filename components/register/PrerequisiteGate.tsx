'use client'

import { AlertTriangle, BookOpen, ExternalLink } from 'lucide-react'
import { useState } from 'react'

interface PrerequisiteGateProps {
  onVerified: (data: {
    completedBeginnerCourse: boolean
    beginnerCourseYear?: number
    hasVerifiedOutsideExp: boolean
    outsideExpDescription: string
  }) => void
  onDismiss: () => void
}

export default function PrerequisiteGate({ onVerified, onDismiss }: PrerequisiteGateProps) {
  const [mode, setMode] = useState<'select' | 'alumni' | 'outside'>('select')
  const [year, setYear] = useState('2026')
  const [description, setDescription] = useState('')

  const handleAlumniVerify = () => {
    onVerified({
      completedBeginnerCourse: true,
      beginnerCourseYear: parseInt(year),
      hasVerifiedOutsideExp: false,
      outsideExpDescription: '',
    })
  }

  const handleOutsideVerify = () => {
    if (description.length < 10) return
    onVerified({
      completedBeginnerCourse: false,
      hasVerifiedOutsideExp: true,
      outsideExpDescription: description,
    })
  }

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '14px', marginBottom: '24px' }}>
          <div style={{
            width: '44px', height: '44px', borderRadius: '12px',
            background: '#FEF3C7', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
          }}>
            <AlertTriangle size={20} color="#92400E" />
          </div>
          <div>
            <h2 style={{ fontFamily: 'Outfit, sans-serif', fontSize: '20px', fontWeight: 700, marginBottom: '4px' }}>
              Python Weeks — Prerequisite Required
            </h2>
            <p style={{ fontSize: '14px', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
              Weeks 5–8 cover Python programming and require a foundational Scratch background.
              Please confirm your child&apos;s experience.
            </p>
          </div>
        </div>

        {mode === 'select' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <button
              id="prereq-alumni"
              onClick={() => setMode('alumni')}
              style={{
                padding: '16px 18px', border: '1.5px solid var(--border-light)',
                borderRadius: 'var(--radius-md)', background: 'var(--bg-white)',
                cursor: 'pointer', textAlign: 'left', transition: 'all var(--transition-fast)',
              }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.borderColor = 'var(--brand-purple)' }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.borderColor = 'var(--border-light)' }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <BookOpen size={18} color="var(--brand-purple)" />
                <div>
                  <div style={{ fontWeight: 600, fontSize: '15px' }}>Completed Elevate Coders Beginners Course</div>
                  <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Summer 2026 or earlier cohort</div>
                </div>
              </div>
            </button>

            <button
              id="prereq-outside"
              onClick={() => setMode('outside')}
              style={{
                padding: '16px 18px', border: '1.5px solid var(--border-light)',
                borderRadius: 'var(--radius-md)', background: 'var(--bg-white)',
                cursor: 'pointer', textAlign: 'left', transition: 'all var(--transition-fast)',
              }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.borderColor = 'var(--brand-purple)' }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.borderColor = 'var(--border-light)' }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <ExternalLink size={18} color="var(--brand-teal)" />
                <div>
                  <div style={{ fontWeight: 600, fontSize: '15px' }}>Verified Outside Experience</div>
                  <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>School course, Code.org, Scratch.mit.edu, etc.</div>
                </div>
              </div>
            </button>

            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '8px' }}>
              <button onClick={onDismiss} className="btn btn-ghost btn-sm" style={{ color: 'var(--text-muted)' }}>
                Remove advanced weeks instead
              </button>
            </div>
          </div>
        )}

        {mode === 'alumni' && (
          <div>
            <label className="form-label">Which year did they complete the Beginners Course?</label>
            <select
              value={year}
              onChange={(e) => setYear(e.target.value)}
              className="form-input"
              style={{ maxWidth: '200px', marginBottom: '20px' }}
            >
              <option value="2026">Summer 2026</option>
            </select>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button onClick={() => setMode('select')} className="btn btn-secondary btn-sm">← Back</button>
              <button onClick={handleAlumniVerify} className="btn btn-primary btn-sm">✓ Confirm & Continue</button>
            </div>
          </div>
        )}

        {mode === 'outside' && (
          <div>
            <label className="form-label">Briefly describe your child&apos;s coding background</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="form-input"
              rows={3}
              placeholder="e.g. Completed Scratch course on Code.org, built several games on Scratch.mit.edu independently..."
              style={{ resize: 'vertical', marginBottom: '20px' }}
            />
            <div style={{ display: 'flex', gap: '10px' }}>
              <button onClick={() => setMode('select')} className="btn btn-secondary btn-sm">← Back</button>
              <button
                onClick={handleOutsideVerify}
                className="btn btn-primary btn-sm"
                disabled={description.length < 10}
                style={{ opacity: description.length < 10 ? 0.5 : 1 }}
              >
                ✓ Confirm & Continue
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
