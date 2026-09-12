'use client'

import Link from 'next/link'
import { Users, Sparkles, CheckCircle, Clock } from 'lucide-react'

const tracks = [
  {
    id: 'coed',
    label: 'TRACK A',
    name: 'Co-Ed Fall Coding Program',
    description:
      'All students ages 7–12 learn together in a collaborative environment. 7-week program running every Thursday starting October 8th.',
    features: [
      'Beginner Class: 5:00 PM – 6:00 PM',
      'Level 2 Class: 7:00 PM – 8:00 PM',
      'Scratch & Python project building',
      'End-of-program portfolio showcase',
    ],
    icon: Users,
    iconBg: '#D1FAE5',
    iconColor: '#065F46',
    badgeColor: 'badge-green',
    ctaHref: '/register?track=coed',
    ctaLabel: 'Register for Co-Ed Track',
    ctaBg: '#D1FAE5',
    ctaColor: '#065F46',
    isAvailable: true,
  },
  {
    id: 'all-girls',
    label: 'TRACK B',
    name: 'All-Girls Coding Program',
    description:
      'A dedicated cohort designed to empower girls in technology. Same hands-on curriculum, separate roster to foster confidence.',
    features: [
      'Supportive all-girls environment',
      'Women-in-tech mentorship moments',
      'Same Scratch + Python curriculum',
      'Community showcase events',
    ],
    icon: Sparkles,
    iconBg: '#F3E8FF',
    iconColor: 'var(--brand-purple)',
    badgeColor: 'badge-purple',
    ctaHref: '#',
    ctaLabel: 'Coming Soon',
    ctaBg: '#F3F4F6',
    ctaColor: '#9CA3AF',
    isAvailable: false,
  },
]

export default function TrackCards() {
  return (
    <section
      id="tracks"
      style={{
        padding: '96px 0',
        background: 'var(--bg-white)',
        scrollMarginTop: '80px',
      }}
    >
      <div className="container-app">
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '60px' }}>
          <h2
            style={{
              fontFamily: 'Outfit, sans-serif',
              fontSize: 'clamp(28px, 4vw, 44px)',
              fontWeight: 800,
              marginBottom: '14px',
            }}
          >
            Fall Program Tracks
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '16px', maxWidth: '520px', margin: '0 auto' }}>
            Choose your child&apos;s program track. Both Beginner and Level 2 sessions run every Thursday starting October 8th.
          </p>
        </div>

        {/* Cards grid */}
        <div
          className="stagger-children"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '24px',
          }}
        >
          {tracks.map((track) => {
            const Icon = track.icon
            return (
              <div
                key={track.id}
                className="card animate-fade-in"
                style={{
                  padding: '0',
                  overflow: 'hidden',
                  position: 'relative',
                  opacity: track.isAvailable ? 1 : 0.85,
                }}
              >
                {!track.isAvailable && (
                  <div
                    style={{
                      position: 'absolute',
                      top: '16px',
                      right: '16px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                      background: '#F3E8FF',
                      color: '#7E22CE',
                      fontSize: '11px',
                      fontWeight: 700,
                      padding: '4px 10px',
                      borderRadius: 'var(--radius-full)',
                    }}
                  >
                    <Clock size={11} />
                    Coming Soon
                  </div>
                )}

                <div style={{ padding: '32px 28px' }}>
                  {/* Icon */}
                  <div
                    style={{
                      width: '52px',
                      height: '52px',
                      borderRadius: '14px',
                      background: track.iconBg,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginBottom: '20px',
                    }}
                  >
                    <Icon size={24} color={track.iconColor} />
                  </div>

                  {/* Track label */}
                  <span className={`badge ${track.badgeColor}`} style={{ marginBottom: '12px' }}>
                    {track.label}
                  </span>

                  <h3
                    style={{
                      fontFamily: 'Outfit, sans-serif',
                      fontSize: '22px',
                      fontWeight: 700,
                      marginBottom: '12px',
                      marginTop: '8px',
                    }}
                  >
                    {track.name}
                  </h3>

                  <p style={{ color: 'var(--text-secondary)', fontSize: '14px', lineHeight: 1.7, marginBottom: '20px' }}>
                    {track.description}
                  </p>

                  {/* Features */}
                  <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {track.features.map((f) => (
                      <li
                        key={f}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                          fontSize: '14px',
                          color: 'var(--text-secondary)',
                        }}
                      >
                        <CheckCircle size={14} color={track.iconColor} />
                        {f}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* CTA footer */}
                {track.isAvailable ? (
                  <Link
                    href={track.ctaHref}
                    style={{
                      display: 'block',
                      textAlign: 'center',
                      padding: '16px',
                      background: track.ctaBg,
                      color: track.ctaColor,
                      fontSize: '14px',
                      fontWeight: 600,
                      textDecoration: 'none',
                      transition: 'opacity var(--transition-fast)',
                      borderTop: '1px solid var(--border-light)',
                    }}
                  >
                    {track.ctaLabel}
                  </Link>
                ) : (
                  <div
                    style={{
                      display: 'block',
                      textAlign: 'center',
                      padding: '16px',
                      background: '#F9FAFB',
                      color: '#9CA3AF',
                      fontSize: '14px',
                      fontWeight: 600,
                      borderTop: '1px solid var(--border-light)',
                      cursor: 'not-allowed',
                    }}
                  >
                    Coming Soon
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
