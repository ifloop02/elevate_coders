'use client'

import { Users, Sparkles, CheckCircle, Clock } from 'lucide-react'

interface TrackSelectorProps {
  selectedTrack: 'COED' | 'ALL_GIRLS' | null
  onSelect: (track: 'COED' | 'ALL_GIRLS') => void
}

const tracks = [
  {
    id: 'COED' as const,
    name: 'Co-Ed Fall Coding Program',
    label: 'TRACK A',
    description: 'All students ages 7–12 learn together in a collaborative, supportive environment.',
    icon: Users,
    iconBg: '#D1FAE5',
    iconColor: '#065F46',
    accentColor: '#10B981',
    badgeBg: '#D1FAE5',
    badgeColor: '#065F46',
    isAvailable: true,
  },
  {
    id: 'ALL_GIRLS' as const,
    name: 'All-Girls Coding Program',
    label: 'TRACK B — COMING SOON',
    description: 'A dedicated cohort designed to empower girls in technology. Launching in an upcoming session.',
    icon: Sparkles,
    iconBg: '#F3E8FF',
    iconColor: 'var(--brand-purple)',
    accentColor: 'var(--brand-purple)',
    badgeBg: '#F3E8FF',
    badgeColor: '#7E22CE',
    isAvailable: false,
  },
]

export default function TrackSelector({ selectedTrack, onSelect }: TrackSelectorProps) {
  return (
    <div>
      <h2 style={{ fontFamily: 'Outfit, sans-serif', fontSize: '22px', fontWeight: 700, marginBottom: '8px' }}>
        Choose Your Program Track
      </h2>
      <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginBottom: '28px' }}>
        Select your cohort track below. Registration is currently open for the Co-Ed Fall Program.
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '16px' }}>
        {tracks.map((track) => {
          const Icon = track.icon
          const isSelected = selectedTrack === track.id
          return (
            <button
              key={track.id}
              id={`track-${track.id.toLowerCase()}`}
              onClick={() => track.isAvailable && onSelect(track.id)}
              disabled={!track.isAvailable}
              style={{
                border: `2px solid ${isSelected ? track.accentColor : 'var(--border-light)'}`,
                borderRadius: 'var(--radius-lg)',
                padding: '24px',
                background: !track.isAvailable ? '#F9FAFB' : isSelected ? '#F0FDF4' : 'var(--bg-white)',
                cursor: track.isAvailable ? 'pointer' : 'not-allowed',
                textAlign: 'left',
                transition: 'all var(--transition-fast)',
                position: 'relative',
                opacity: track.isAvailable ? 1 : 0.75,
                boxShadow: isSelected ? '0 0 0 3px rgba(16,185,129,0.15)' : 'none',
              }}
            >
              {isSelected && (
                <div style={{ position: 'absolute', top: '14px', right: '14px', color: track.accentColor }}>
                  <CheckCircle size={20} />
                </div>
              )}

              {!track.isAvailable && (
                <div style={{
                  position: 'absolute', top: '14px', right: '14px',
                  background: '#F3E8FF', color: '#7E22CE',
                  fontSize: '10px', fontWeight: 700, padding: '3px 8px',
                  borderRadius: 'var(--radius-full)', display: 'flex', alignItems: 'center', gap: '4px'
                }}>
                  <Clock size={10} /> Coming Soon
                </div>
              )}

              <div style={{
                width: '48px', height: '48px', borderRadius: '12px',
                background: track.iconBg, display: 'flex', alignItems: 'center',
                justifyContent: 'center', marginBottom: '16px',
              }}>
                <Icon size={22} color={track.iconColor} />
              </div>

              <span style={{
                display: 'inline-block',
                background: track.badgeBg, color: track.badgeColor,
                fontSize: '10px', fontWeight: 700, letterSpacing: '0.1em',
                textTransform: 'uppercase', padding: '3px 8px',
                borderRadius: 'var(--radius-full)', marginBottom: '10px',
              }}>
                {track.label}
              </span>

              <h3 style={{ fontFamily: 'Outfit, sans-serif', fontSize: '18px', fontWeight: 700, marginBottom: '8px', marginTop: '6px' }}>
                {track.name}
              </h3>
              <p style={{ fontSize: '14px', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                {track.description}
              </p>
            </button>
          )
        })}
      </div>
    </div>
  )
}
