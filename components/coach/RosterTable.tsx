'use client'

import { AlertTriangle } from 'lucide-react'

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

interface RosterTableProps {
  roster: RosterEntry[]
}

const TRACK_COLORS = {
  COED: { bg: '#D1FAE5', text: '#065F46', label: 'Co-Ed' },
  ALL_GIRLS: { bg: '#EDE9FE', text: '#5B21B6', label: 'All-Girls' },
}

export default function RosterTable({ roster }: RosterTableProps) {
  if (roster.length === 0) {
    return (
      <div style={{
        padding: '60px 20px', textAlign: 'center',
        color: 'var(--text-muted)', background: 'var(--bg-white)',
        borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-light)',
      }}>
        <div style={{ fontSize: '40px', marginBottom: '12px' }}>📋</div>
        <div style={{ fontSize: '16px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '4px' }}>
          No active registrations
        </div>
        <div style={{ fontSize: '14px' }}>
          No confirmed students found. Check back after registration opens.
        </div>
      </div>
    )
  }

  // Group by track
  const coedRoster = roster.filter((r) => r.track === 'COED')
  const girlsRoster = roster.filter((r) => r.track === 'ALL_GIRLS')

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
      {[
        { entries: coedRoster, track: 'COED' as const, title: 'Co-Ed Track — Roster' },
        { entries: girlsRoster, track: 'ALL_GIRLS' as const, title: 'All-Girls Track — Roster' },
      ].map(({ entries, track, title }) => entries.length === 0 ? null : (
        <div key={track}>
          <h2 style={{
            fontFamily: 'Outfit, sans-serif', fontSize: '18px', fontWeight: 700,
            marginBottom: '16px', color: TRACK_COLORS[track].text,
          }}>
            {title} ({entries.length} students)
          </h2>

          <div style={{ overflowX: 'auto', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-light)', background: 'white' }}>
            <table className="roster-table" style={{ minWidth: '800px' }}>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Student Name</th>
                  <th>Age</th>
                  <th>Weeks Enrolled</th>
                  <th>Sign In</th>
                  <th>Sign Out</th>
                  <th>Emergency Phone</th>
                  <th>Alerts</th>
                </tr>
              </thead>
              <tbody>
                {entries.map((entry, idx) => {
                  const today = new Date()
                  const todayVacation = entry.vacationDays.find((v) => {
                    const d = new Date(v.missedDate)
                    return d.toDateString() === today.toDateString()
                  })

                  return (
                    <tr key={entry.id} style={{ background: todayVacation ? '#FFF7F9' : undefined }}>
                      <td style={{ color: 'var(--text-muted)', fontSize: '13px' }}>{idx + 1}</td>
                      <td>
                        <div style={{ fontWeight: 600 }}>
                          {entry.student.firstName} {entry.student.lastName}
                        </div>
                        <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>
                          Parent: {entry.parent.legalName}
                        </div>
                      </td>
                      <td style={{ fontSize: '14px' }}>{entry.student.age}</td>
                      <td>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                          {entry.selectedWeeks.map((sw) => (
                            <span
                              key={sw.weekBlock.weekNumber}
                              style={{
                                background: TRACK_COLORS[track].bg,
                                color: TRACK_COLORS[track].text,
                                fontSize: '10px', fontWeight: 700,
                                padding: '2px 6px', borderRadius: '100px',
                              }}
                            >
                              W{sw.weekBlock.weekNumber}
                            </span>
                          ))}
                        </div>
                      </td>
                      {/* Sign-in / out boxes for clipboard */}
                      <td>
                        <div style={{
                          width: '80px', height: '28px',
                          border: '1px solid #D1D5DB', borderRadius: '4px',
                        }} />
                      </td>
                      <td>
                        <div style={{
                          width: '80px', height: '28px',
                          border: '1px solid #D1D5DB', borderRadius: '4px',
                        }} />
                      </td>
                      <td style={{ fontFamily: 'monospace', fontSize: '13px' }}>
                        {entry.parent.phone}
                      </td>
                      <td>
                        {entry.student.allergies && entry.student.allergies !== 'None' && (
                          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#DC2626', fontSize: '12px', fontWeight: 600 }}>
                            <AlertTriangle size={12} />
                            Allergy
                          </div>
                        )}
                        {todayVacation && (
                          <div style={{ fontSize: '11px', color: '#9D174D', marginTop: '2px' }}>
                            📦 Packet today
                          </div>
                        )}
                        {entry.status === 'TRAVELING_PACKET_NEEDED' && !todayVacation && (
                          <div style={{ fontSize: '11px', color: '#92400E' }}>
                            ✈️ Travel week
                          </div>
                        )}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      ))}
    </div>
  )
}
