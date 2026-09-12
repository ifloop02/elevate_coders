'use client'

import { useState } from 'react'
import { Send, CheckCircle, AlertCircle, Loader2, ClipboardCopy, Download } from 'lucide-react'

interface ParsedResult {
  parsed: Record<string, string | number[] | null>
  confidence: Record<string, 'high' | 'low' | 'missing'>
  missingFields: string[]
  completeness: number
}

const SAMPLE_EMAIL = `Hi TeamCoders,

I'd like to register my daughter for the summer camp.

Parent Name: Sarah Johnson
Email: sarah.johnson@email.com
Phone: (555) 234-5678

Child's Name: Mia Johnson
Age: 10
Allergies: None

We'd like to enroll in Week 1, Week 2, Week 3 and Week 5.
Track: All-Girls
Referral: ALUMNI10

Thank you!`

export default function AdminIntakePage() {
  const [rawText, setRawText] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<ParsedResult | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [adminPin, setAdminPin] = useState('')
  const [authenticated, setAuthenticated] = useState(false)
  const [pinLoading, setPinLoading] = useState(false)
  const [pinError, setPinError] = useState('')

  const handlePinSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setPinLoading(true)
    setPinError('')
    try {
      const res = await fetch(`/api/admin/export-marketing?pin=${encodeURIComponent(adminPin)}&limit=1`)
      if (res.ok) {
        setAuthenticated(true)
      } else {
        setPinError('Incorrect admin PIN.')
      }
    } catch {
      setPinError('Connection error. Please try again.')
    } finally {
      setPinLoading(false)
    }
  }

  const handleParse = async () => {
    if (!rawText.trim()) return
    setLoading(true)
    setError(null)
    setResult(null)

    try {
      const res = await fetch('/api/intake/parse', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rawText }),
      })
      const data = await res.json()
      if (res.ok) setResult(data)
      else setError(data.error || 'Parse failed.')
    } catch {
      setError('Connection error. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (!authenticated) {
    return (
      <div style={{
        minHeight: '100vh', background: 'linear-gradient(135deg, #1E1B4B 0%, #312E81 100%)',
        display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px',
      }}>
        <div style={{ background: 'white', borderRadius: 'var(--radius-xl)', padding: '48px', maxWidth: '400px', width: '100%', textAlign: 'center' }}>
          <h1 style={{ fontFamily: 'Outfit, sans-serif', fontSize: '22px', fontWeight: 800, marginBottom: '8px' }}>
            Admin Access
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginBottom: '28px' }}>
            Enter your admin PIN to access the intake parser and management tools.
          </p>
          <form onSubmit={handlePinSubmit}>
            <input
              type="password"
              className="form-input"
              placeholder="Admin PIN"
              value={adminPin}
              onChange={(e) => setAdminPin(e.target.value)}
              style={{ textAlign: 'center', fontSize: '18px', letterSpacing: '0.3em', marginBottom: '14px' }}
              autoFocus
            />
            {pinError && <div style={{ color: '#EF4444', fontSize: '13px', marginBottom: '12px' }}>{pinError}</div>}
            <button type="submit" className="btn btn-primary" disabled={pinLoading} style={{ width: '100%', justifyContent: 'center' }}>
              {pinLoading ? <Loader2 size={16} className="animate-spin" /> : 'Access Admin →'}
            </button>
          </form>
        </div>
      </div>
    )
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-base)' }}>
      <div style={{ background: 'linear-gradient(135deg, #1E1B4B 0%, #312E81 100%)', padding: '24px 0', color: 'white' }}>
        <div className="container-app" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <h1 style={{ fontFamily: 'Outfit, sans-serif', fontSize: '24px', fontWeight: 800 }}>
              Admin Portal
            </h1>
            <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '14px', marginTop: '4px' }}>
              Intake parsing and parent marketing contact exports.
            </p>
          </div>
          <div style={{ display: 'flex', gap: '12px' }}>
            <a
              href={`/api/admin/export-marketing?pin=${encodeURIComponent(adminPin)}&format=csv`}
              download
              className="btn btn-secondary btn-sm"
              style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'white', color: '#1E1B4B', textDecoration: 'none', padding: '8px 16px', borderRadius: '8px', fontWeight: 600 }}
            >
              <Download size={15} />
              Export Marketing Contacts (CSV)
            </a>
          </div>
        </div>
      </div>

      <div className="container-app" style={{ paddingTop: '40px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px', alignItems: 'start' }}>
          {/* Input side */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
              <label className="form-label" style={{ margin: 0 }}>
                Raw Email Text
              </label>
              <button
                onClick={() => setRawText(SAMPLE_EMAIL)}
                className="btn btn-ghost btn-sm"
                style={{ fontSize: '12px', color: 'var(--brand-purple)', padding: '4px 10px' }}
              >
                Load Sample
              </button>
            </div>
            <textarea
              id="intake-raw-text"
              className="form-input"
              rows={20}
              placeholder="Paste the full email or inquiry text here..."
              value={rawText}
              onChange={(e) => setRawText(e.target.value)}
              style={{ resize: 'vertical', fontFamily: 'monospace', fontSize: '13px' }}
            />
            <button
              onClick={handleParse}
              className="btn btn-primary"
              style={{ marginTop: '14px', width: '100%', justifyContent: 'center' }}
              disabled={loading || !rawText.trim()}
            >
              {loading ? (
                <><Loader2 size={16} /> Parsing...</>
              ) : (
                <><Send size={16} /> Parse Email</>
              )}
            </button>
          </div>

          {/* Results side */}
          <div>
            <div style={{ fontWeight: 600, fontSize: '15px', marginBottom: '16px' }}>
              Parsed Results
            </div>

            {error && (
              <div style={{
                padding: '14px 18px', background: '#FEF2F2',
                border: '1px solid #FCA5A5', borderRadius: 'var(--radius-md)',
                color: '#DC2626', fontSize: '14px', display: 'flex', gap: '8px',
              }}>
                <AlertCircle size={16} style={{ flexShrink: 0, marginTop: '1px' }} />
                {error}
              </div>
            )}

            {result && (
              <>
                {/* Completeness bar */}
                <div style={{ marginBottom: '20px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                    <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>Extraction completeness</span>
                    <span style={{ fontSize: '13px', fontWeight: 700, color: result.completeness >= 80 ? '#10B981' : result.completeness >= 50 ? '#F59E0B' : '#EF4444' }}>
                      {result.completeness}%
                    </span>
                  </div>
                  <div style={{ height: '6px', background: '#E5E7EB', borderRadius: '100px', overflow: 'hidden' }}>
                    <div style={{
                      height: '100%',
                      width: `${result.completeness}%`,
                      background: result.completeness >= 80 ? '#10B981' : result.completeness >= 50 ? '#F59E0B' : '#EF4444',
                      borderRadius: '100px',
                      transition: 'width 600ms ease',
                    }} />
                  </div>
                </div>

                {/* Field cards */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {Object.entries(result.parsed).map(([key, value]) => {
                    const conf = result.confidence[key]
                    return (
                      <div
                        key={key}
                        style={{
                          padding: '12px 14px',
                          border: `1px solid ${conf === 'high' ? '#D1FAE5' : conf === 'low' ? '#FEF3C7' : '#FEE2E2'}`,
                          borderRadius: 'var(--radius-md)',
                          background: conf === 'high' ? '#F0FDF4' : conf === 'low' ? '#FFFBEB' : '#FFF5F5',
                          display: 'flex',
                          alignItems: 'flex-start',
                          gap: '10px',
                        }}
                      >
                        {conf === 'high' ? (
                          <CheckCircle size={15} color="#10B981" style={{ marginTop: '1px', flexShrink: 0 }} />
                        ) : (
                          <AlertCircle size={15} color={conf === 'low' ? '#F59E0B' : '#EF4444'} style={{ marginTop: '1px', flexShrink: 0 }} />
                        )}
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--text-muted)', marginBottom: '2px' }}>
                            {key.replace(/([A-Z])/g, ' $1').trim()}
                          </div>
                          <div style={{ fontSize: '14px', color: value ? 'var(--text-primary)' : '#EF4444', fontStyle: value ? 'normal' : 'italic' }}>
                            {value === null ? 'Not found' : Array.isArray(value) ? value.length === 0 ? 'Not found' : `Weeks: ${(value as number[]).join(', ')}` : String(value)}
                          </div>
                        </div>
                        {value && (
                          <button
                            onClick={() => navigator.clipboard.writeText(Array.isArray(value) ? (value as number[]).join(', ') : String(value))}
                            style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', padding: '2px' }}
                            title="Copy"
                          >
                            <ClipboardCopy size={14} />
                          </button>
                        )}
                      </div>
                    )
                  })}
                </div>

                {result.missingFields.length > 0 && (
                  <div style={{
                    marginTop: '16px', padding: '12px 14px',
                    background: '#FFF5F5', border: '1px solid #FECACA',
                    borderRadius: 'var(--radius-md)', fontSize: '13px',
                  }}>
                    <div style={{ fontWeight: 600, color: '#DC2626', marginBottom: '4px' }}>Missing fields — follow up needed:</div>
                    <div style={{ color: '#7F1D1D' }}>{result.missingFields.join(', ')}</div>
                  </div>
                )}
              </>
            )}

            {!result && !error && (
              <div style={{
                padding: '60px 20px', textAlign: 'center', color: 'var(--text-muted)',
                background: 'var(--bg-white)', borderRadius: 'var(--radius-lg)',
                border: '1px dashed var(--border-light)',
              }}>
                <div style={{ fontSize: '32px', marginBottom: '12px' }}>📧</div>
                <div>Paste email text on the left, then click Parse.</div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
