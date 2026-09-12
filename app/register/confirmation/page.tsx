'use client'

import { useSearchParams } from 'next/navigation'
import { Suspense, useEffect, useState, useCallback } from 'react'
import Link from 'next/link'
import { CheckCircle, Download, Zap, Mail } from 'lucide-react'

function ConfirmationInner() {
  const searchParams = useSearchParams()
  const registrationId = searchParams.get('id')
  const [downloaded, setDownloaded] = useState(false)

  const triggerDownload = useCallback(() => {
    const url = registrationId
      ? `/api/pdf/welcome?id=${registrationId}`
      : '/api/pdf/welcome'
    const link = document.createElement('a')
    link.href = url
    link.download = 'Elevate-Coders-Welcome-Packet-2026.pdf'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    setDownloaded(true)
  }, [registrationId])

  useEffect(() => {
    // Auto-trigger PDF download after a short delay
    const timer = setTimeout(() => {
      if (registrationId) triggerDownload()
    }, 1500)
    return () => clearTimeout(timer)
  }, [registrationId, triggerDownload])

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #F5F3FF 0%, #EDE9FE 40%, #F0FDF4 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '40px 24px',
    }}>
      <div style={{ maxWidth: '560px', width: '100%', textAlign: 'center' }}>
        {/* Success icon */}
        <div style={{
          width: '80px', height: '80px',
          borderRadius: '50%',
          background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          margin: '0 auto 24px',
          boxShadow: '0 8px 24px rgba(16,185,129,0.3)',
          animation: 'pulse-glow 2s ease-in-out infinite',
        }}>
          <CheckCircle size={40} color="white" />
        </div>

        <h1 style={{
          fontFamily: 'Outfit, sans-serif', fontSize: '32px', fontWeight: 900,
          marginBottom: '12px', color: 'var(--text-primary)',
        }}>
          You&apos;re Enrolled! 🎉
        </h1>

        <p style={{ fontSize: '16px', color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: '32px' }}>
          Your registration is confirmed. A Gusto invoice has been generated and will be
          sent to your email address with payment instructions.
        </p>

        {registrationId && (
          <div style={{
            display: 'inline-block',
            background: 'rgba(255,255,255,0.8)',
            border: '1px solid var(--border-purple)',
            borderRadius: 'var(--radius-md)',
            padding: '10px 20px',
            fontSize: '13px',
            color: 'var(--text-secondary)',
            marginBottom: '32px',
            fontFamily: 'monospace',
          }}>
            Registration ID: <strong style={{ color: 'var(--brand-purple)' }}>{registrationId.slice(0, 12)}...</strong>
          </div>
        )}

        {/* Next steps */}
        <div style={{
          background: 'rgba(255,255,255,0.9)',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--border-light)',
          padding: '28px',
          marginBottom: '28px',
          textAlign: 'left',
        }}>
          <h2 style={{ fontFamily: 'Outfit, sans-serif', fontSize: '18px', fontWeight: 700, marginBottom: '16px' }}>
            What Happens Next
          </h2>
          {[
            { icon: Mail, text: 'Check your email for a Gusto invoice with payment options (ACH or credit card as selected).' },
            { icon: Download, text: 'Your Summer Welcome Packet is downloading now. It contains software installation guides for Scratch Desktop and Thonny Python IDE.' },
            { icon: Zap, text: 'Your child is officially a TeamCoder! See you at camp.' },
          ].map((item, i) => {
            const Icon = item.icon
            return (
              <div key={i} style={{ display: 'flex', gap: '12px', marginBottom: '14px' }}>
                <div style={{
                  width: '32px', height: '32px', borderRadius: '8px',
                  background: 'var(--bg-subtle)', display: 'flex', alignItems: 'center',
                  justifyContent: 'center', flexShrink: 0,
                }}>
                  <Icon size={16} color="var(--brand-purple)" />
                </div>
                <p style={{ fontSize: '14px', color: 'var(--text-secondary)', lineHeight: 1.6, margin: 0 }}>
                  {item.text}
                </p>
              </div>
            )
          })}
        </div>

        {/* Action buttons */}
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <button
            onClick={triggerDownload}
            className="btn btn-primary"
          >
            <Download size={16} />
            {downloaded ? 'Download Again' : 'Download Welcome Packet'}
          </button>
          <Link href="/" className="btn btn-secondary">
            Back to Home
          </Link>
        </div>

        {downloaded && (
          <div style={{ marginTop: '16px', fontSize: '13px', color: '#10B981' }}>
            ✓ Packet downloaded! Check your Downloads folder.
          </div>
        )}
      </div>
    </div>
  )
}

export default function ConfirmationPage() {
  return (
    <Suspense fallback={<div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Loading...</div>}>
      <ConfirmationInner />
    </Suspense>
  )
}
