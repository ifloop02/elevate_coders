'use client'

import Link from 'next/link'

export default function Footer() {
  return (
    <footer
      style={{
        borderTop: '1px solid var(--border-light)',
        background: 'var(--bg-white)',
        padding: '32px 0',
        marginTop: 'auto',
      }}
    >
      <div
        className="container-app"
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '12px',
          textAlign: 'center',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', justifyContent: 'center' }}>
          <img
            src="/logo.png"
            alt="Elevate Coders logo"
            width={24}
            height={24}
            style={{ borderRadius: '4px', objectFit: 'contain' }}
            onError={(e) => {
              ;(e.target as HTMLImageElement).style.display = 'none'
            }}
          />
          <span style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 700, fontSize: '15px', color: 'var(--text-primary)' }}>
            Elevate <span style={{ color: 'var(--brand-purple)' }}>Coders</span>
          </span>
        </div>

        <div style={{ fontSize: '13px', color: 'var(--text-secondary)', display: 'flex', gap: '8px', flexWrap: 'wrap', justifyContent: 'center', alignItems: 'center' }}>
          <span>© 2026 Elevate Coders. All rights reserved.</span>
          <span>|</span>
          <Link
            href="/privacy"
            style={{ color: 'var(--text-secondary)', textDecoration: 'underline', textUnderlineOffset: '3px' }}
          >
            Privacy Policy
          </Link>
          <span>|</span>
          <Link
            href="/terms"
            style={{ color: 'var(--text-secondary)', textDecoration: 'underline', textUnderlineOffset: '3px' }}
          >
            Terms of Use & Camp Policies
          </Link>
        </div>

        <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
          California Educational Services — 0% Sales Tax (Cal. Rev. & Tax. Code §6361)
        </div>
      </div>
    </footer>
  )
}
