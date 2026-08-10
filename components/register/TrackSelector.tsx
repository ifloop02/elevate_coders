'use client'

import { Users, Sparkles, CheckCircle } from 'lucide-react'

interface TrackSelectorProps {
  selectedTrack: 'COED' | 'ALL_GIRLS' | null
  onSelect: (track: 'COED' | 'ALL_GIRLS') => void
}

const tracks = [
  {
    id: 'COED' as const,
    name: 'Co-Ed Coding Camp',
    label: 'TRACK A',
    description: 'All students ages 9–12 learn together in a collaborative, supportive environment.',
    icon: Users,
    iconBg: '#D1FAE5',
    iconColor: '#065F46',
    accentColor: '#10B981',
    badgeBg: '#D1FAE5',
    badgeColor: '#065F46',
  },
  {
    id: 'ALL_GIRLS' as const,
    name: 'All-Girls Coding Camp',
    label: 'TRACK B',
    description: 'A dedicated cohort designed to empower girls in technology. Same curriculum, separate roster.',
    icon: Sparkles,
    iconBg: '#EDE9FE',
    iconColor: 'var(--brand-purple)',
    accentColor: 'var(--brand-purple)',
    badgeBg: '#EDE9FE',
    badgeColor: '#5B21B6',
  },
]

export default function TrackSelector({ selectedTrack, onSelect }: TrackSelectorProps) {
  return (
    <div>
      <h2 style={{ fontFamily: 'Outfit, sans-serif', fontSize: '22px', fontWeight: 700, marginBottom: '8px' }}>
        Choose Your Camp Track
      </h2>
      <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginBottom: '28px' }}>
        Both tracks follow the exact same curriculum and pricing. The difference is roster composition.
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '16px' }}>
        {tracks.map((track) => {
          const Icon = track.icon
          const isSelected = selectedTrack === track.id
          return (
            <button
              key={track.id}
              id={`track-${track.id.toLowerCase()}`}
              onClick={() => onSelect(track.id)}
              style={{
                border: `2px solid ${isSelected ? track.accentColor : 'var(--border-light)'}`,
                borderRadius: 'var(--radius-lg)',
                padding: '24px',
                background: isSelected ? (track.id === 'COED' ? '#F0FDF4' : 'var(--bg-subtle)') : 'var(--bg-white)',
                cursor: 'pointer',
                textAlign: 'left',
                transition: 'all var(--transition-fast)',
                position: 'relative',
                boxShadow: isSelected ? `0 0 0 3px ${track.id === 'COED' ? 'rgba(16,185,129,0.15)' : 'var(--brand-purple-glow)'}` : 'none',
              }}
            >
              {isSelected && (
                <div style={{ position: 'absolute', top: '14px', right: '14px', color: track.accentColor }}>
                  <CheckCircle size={20} />
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
