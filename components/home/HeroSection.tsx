'use client'

import Link from 'next/link'
import { Zap, ArrowRight } from 'lucide-react'
import { useEffect, useState } from 'react'

const stats = [
  { value: '7–12', label: 'Age Range' },
  { value: '$200', label: 'Per Camp' },
  { value: '7', label: 'Fall Weeks' },
]

export default function HeroSection() {
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 60)
    return () => clearTimeout(t)
  }, [])

  return (
    <section
      className="hero-gradient"
      style={{
        minHeight: 'calc(100vh - 64px)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        padding: '80px 0 60px',
      }}
    >
      <div className="container-app">
        <div
          style={{
            maxWidth: '640px',
            opacity: visible ? 1 : 0,
            transform: visible ? 'translateY(0)' : 'translateY(24px)',
            transition: 'opacity 600ms ease, transform 600ms ease',
          }}
        >
          {/* Announcement pill */}
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              background: 'rgba(124,58,237,0.08)',
              border: '1px solid rgba(124,58,237,0.18)',
              borderRadius: 'var(--radius-full)',
              padding: '6px 14px',
              fontSize: '13px',
              fontWeight: 600,
              color: 'var(--brand-purple)',
              marginBottom: '28px',
            }}
          >
            <Zap size={13} fill="currentColor" />
            Fall 2026 Registration Open — Starts Sept 10th
          </div>

          {/* Headline */}
          <h1
            style={{
              fontFamily: 'Outfit, sans-serif',
              fontSize: 'clamp(38px, 5.5vw, 64px)',
              fontWeight: 900,
              lineHeight: 1.1,
              color: 'var(--text-primary)',
              marginBottom: '22px',
            }}
          >
            Where Young{' '}
            <span className="text-gradient">Coders</span>
            <br />
            Build the Future
          </h1>

          {/* Subheadline */}
          <p
            style={{
              fontSize: '17px',
              color: 'var(--text-secondary)',
              lineHeight: 1.7,
              marginBottom: '36px',
              maxWidth: '480px',
            }}
          >
            7-week Fall coding program for ages 7–12. Every Thursday starting September 10th.
            From Scratch to Python, your child learns real programming skills in a supportive,
            inclusive environment.
          </p>

          {/* CTAs */}
          <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap' }}>
            <Link href="/register" className="btn btn-primary btn-lg">
              Register Your Child
              <ArrowRight size={18} />
            </Link>
            <Link href="#tracks" className="btn btn-secondary btn-lg">
              View Camp Tracks
            </Link>
          </div>

          {/* Stats row */}
          <div
            style={{
              display: 'flex',
              gap: '12px',
              marginTop: '52px',
              flexWrap: 'wrap',
            }}
          >
            {stats.map((s) => (
              <div
                key={s.label}
                style={{
                  background: 'rgba(255,255,255,0.85)',
                  backdropFilter: 'blur(8px)',
                  border: '1px solid rgba(255,255,255,0.8)',
                  borderRadius: 'var(--radius-md)',
                  padding: '16px 24px',
                  minWidth: '110px',
                }}
              >
                <div
                  style={{
                    fontFamily: 'Outfit, sans-serif',
                    fontWeight: 800,
                    fontSize: '22px',
                    color: 'var(--text-primary)',
                  }}
                >
                  {s.value}
                </div>
                <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '2px' }}>
                  {s.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Background decorative orbs */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          top: '10%',
          right: '5%',
          width: '400px',
          height: '400px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(124,58,237,0.08) 0%, transparent 70%)',
          pointerEvents: 'none',
        }}
      />
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          bottom: '5%',
          right: '20%',
          width: '280px',
          height: '280px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(20,184,166,0.1) 0%, transparent 70%)',
          pointerEvents: 'none',
        }}
      />
    </section>
  )
}
