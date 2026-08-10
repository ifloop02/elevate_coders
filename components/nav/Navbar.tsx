'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import { Zap, Menu, X } from 'lucide-react'

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/register', label: 'Register' },
  { href: '/coach', label: 'Coach View' },
  { href: '/admin', label: 'Admin' },
]

export default function Navbar() {
  const pathname = usePathname()
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <header
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 40,
        background: 'rgba(255, 255, 255, 0.92)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        borderBottom: '1px solid var(--border-light)',
        boxShadow: '0 1px 8px rgba(0,0,0,0.06)',
      }}
    >
      <div
        className="container-app"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          height: '64px',
        }}
      >
        {/* Logo */}
        <Link
          href="/"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            textDecoration: 'none',
          }}
        >
          {/* Real EC logo — place your logo at public/logo.png */}
          <img
            src="/logo.png"
            alt="Elevate Coders logo"
            width={38}
            height={38}
            style={{ borderRadius: '8px', objectFit: 'contain' }}
            onError={(e) => {
              // Fallback: hide broken image and show text only
              ;(e.target as HTMLImageElement).style.display = 'none'
            }}
          />
          <span
            style={{
              fontFamily: 'Outfit, sans-serif',
              fontWeight: 700,
              fontSize: '18px',
              color: 'var(--text-primary)',
            }}
          >
            Elevate{' '}
            <span style={{ color: 'var(--brand-purple)' }}>Coders</span>
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
          }}
          className="hidden-mobile"
        >
          {navLinks.map((link) => {
            const isActive = pathname === link.href
            return (
              <Link
                key={link.href}
                href={link.href}
                style={{
                  padding: '7px 16px',
                  borderRadius: 'var(--radius-full)',
                  fontSize: '14px',
                  fontWeight: 500,
                  textDecoration: 'none',
                  transition: 'all var(--transition-fast)',
                  background: isActive ? 'var(--bg-subtle)' : 'transparent',
                  color: isActive ? 'var(--brand-purple)' : 'var(--text-secondary)',
                }}
              >
                {link.label}
              </Link>
            )
          })}
        </nav>

        {/* CTA */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Link
            href="/register"
            className="btn btn-primary btn-sm hidden-mobile"
          >
            <Zap size={14} />
            Enroll Now
          </Link>

          {/* Mobile hamburger */}
          <button
            className="show-mobile"
            onClick={() => setMobileOpen(!mobileOpen)}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: '8px',
              color: 'var(--text-primary)',
            }}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div
          style={{
            borderTop: '1px solid var(--border-light)',
            padding: '12px 24px 16px',
            display: 'flex',
            flexDirection: 'column',
            gap: '4px',
            background: 'white',
          }}
        >
          {navLinks.map((link) => {
            const isActive = pathname === link.href
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                style={{
                  padding: '10px 14px',
                  borderRadius: 'var(--radius-md)',
                  fontSize: '15px',
                  fontWeight: 500,
                  textDecoration: 'none',
                  background: isActive ? 'var(--bg-subtle)' : 'transparent',
                  color: isActive ? 'var(--brand-purple)' : 'var(--text-primary)',
                }}
              >
                {link.label}
              </Link>
            )
          })}
          <Link
            href="/register"
            onClick={() => setMobileOpen(false)}
            className="btn btn-primary"
            style={{ marginTop: '8px', justifyContent: 'center' }}
          >
            <Zap size={14} />
            Enroll Now
          </Link>
        </div>
      )}

      <style jsx>{`
        @media (min-width: 640px) {
          .hidden-mobile { display: flex !important; }
          .show-mobile { display: none !important; }
        }
        @media (max-width: 639px) {
          .hidden-mobile { display: none !important; }
          .show-mobile { display: flex !important; }
        }
      `}</style>
    </header>
  )
}
