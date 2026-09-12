'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Printer, RefreshCw, ShieldCheck, LogOut } from 'lucide-react'
import RosterTable from '@/components/coach/RosterTable'

interface RosterEntry {
  id: string
  track: string
  status: string
  student: {
    firstName: string
    lastName: string
    age: number
    allergies: string | null
    medicalNotes: string | null
    track: string
  }
  parent: {
    legalName: string
    phone: string
  }
  selectedWeeks: {
    weekBlock: {
      weekNumber: number
      startDate: string
      endDate: string
      curriculumLabel: string
      startTime: string | null
      endTime: string | null
    }
  }[]
  vacationDays: {
    missedDate: string
    weekNumber: number
    reason: string | null
  }[]
}

export const dynamic = 'force-dynamic'

export default function CoachPage() {
  const router = useRouter()
  const [pin, setPin] = useState('')
  const [authenticated, setAuthenticated] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [roster, setRoster] = useState<RosterEntry[]>([])
  const [generatedAt, setGeneratedAt] = useState<string | null>(null)
  const [rosterLoading, setRosterLoading] = useState(false)

  const handlePinSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const clean = pin.trim()
    if (!clean) return
    setLoading(true)
    setError('')

    try {
      const res = await fetch(`/api/coach/roster?pin=${encodeURIComponent(clean)}`)
      if (res.ok) {
        const data = await res.json()
        setRoster(data.roster)
        setGeneratedAt(data.generatedAt)
        setAuthenticated(true)
      } else {
        setError('Incorrect PIN. Please try again.')
      }
    } catch {
      setError('Connection error. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const refreshRoster = async () => {
    setRosterLoading(true)
    try {
      const res = await fetch(`/api/coach/roster?pin=${encodeURIComponent(pin)}`)
      if (res.ok) {
        const data = await res.json()
        setRoster(data.roster)
        setGeneratedAt(data.generatedAt)
      }
    } finally {
      setRosterLoading(false)
    }
  }

  if (!authenticated) {
    return (
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #1E1B4B 0%, #312E81 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px',
      }}>
        <div style={{
          background: 'white',
          borderRadius: 'var(--radius-xl)',
          padding: '48px',
          maxWidth: '400px',
          width: '100%',
          textAlign: 'center',
        }}>
          <div style={{
            width: '64px', height: '64px',
            borderRadius: '18px',
            background: 'linear-gradient(135deg, #7C3AED 0%, #5B21B6 100%)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 24px',
          }}>
            <ShieldCheck size={28} color="white" />
          </div>

          <h1 style={{ fontFamily: 'Outfit, sans-serif', fontSize: '24px', fontWeight: 800, marginBottom: '8px' }}>
            Coach Portal
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginBottom: '32px' }}>
            Enter your coach access PIN to view today&apos;s roster.
          </p>

          <form onSubmit={handlePinSubmit}>
            <input
              id="coach-pin"
              type="password"
              inputMode="numeric"
              className="form-input"
              placeholder="Enter PIN"
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              style={{ textAlign: 'center', fontSize: '20px', letterSpacing: '0.3em', marginBottom: '16px' }}
              autoFocus
            />
            {error && (
              <div style={{ color: '#EF4444', fontSize: '13px', marginBottom: '12px' }}>{error}</div>
            )}
            <button
              type="submit"
              className="btn btn-primary"
              style={{ width: '100%', justifyContent: 'center' }}
              disabled={loading || !pin}
            >
              {loading ? 'Verifying...' : 'Access Roster →'}
            </button>
          </form>
        </div>
      </div>
    )
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-base)' }}>
      {/* Coach header */}
      <div style={{
        background: 'linear-gradient(135deg, #1E1B4B 0%, #312E81 100%)',
        padding: '20px 0',
        color: 'white',
      }} className="no-print">
        <div className="container-app" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <ShieldCheck size={18} />
              <span style={{ fontWeight: 700, fontFamily: 'Outfit, sans-serif', fontSize: '18px' }}>
                Coach Portal
              </span>
            </div>
            {generatedAt && (
              <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)', marginTop: '2px' }}>
                Roster as of {new Date(generatedAt).toLocaleString()}
              </div>
            )}
          </div>

          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              onClick={refreshRoster}
              className="btn btn-ghost btn-sm"
              style={{ color: 'white', border: '1px solid rgba(255,255,255,0.2)' }}
              disabled={rosterLoading}
            >
              <RefreshCw size={14} className={rosterLoading ? 'animate-spin' : ''} />
              Refresh
            </button>
            <button
              onClick={() => window.print()}
              className="btn btn-ghost btn-sm"
              style={{ color: 'white', border: '1px solid rgba(255,255,255,0.2)' }}
            >
              <Printer size={14} />
              Print Roster
            </button>
            <button
              onClick={() => { setAuthenticated(false); setPin(''); setRoster([]) }}
              className="btn btn-ghost btn-sm"
              style={{ color: 'rgba(255,255,255,0.6)' }}
            >
              <LogOut size={14} />
            </button>
          </div>
        </div>
      </div>

      <div className="container-app" style={{ paddingTop: '32px' }}>
        {/* Print header (only shows when printing) */}
        <div className="print-only" style={{ display: 'none', marginBottom: '24px' }}>
          <h1 style={{ fontFamily: 'Outfit, sans-serif', fontSize: '22px', fontWeight: 800 }}>
            Elevate Coders — Daily Sign-In Roster
          </h1>
          <p style={{ fontSize: '13px', color: '#666', marginTop: '4px' }}>
            {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            {' | '}Generated: {generatedAt ? new Date(generatedAt).toLocaleString() : '—'}
          </p>
        </div>

        <RosterTable roster={roster} />
      </div>
    </div>
  )
}
