'use client'

import { Monitor, Code2, Receipt, Rocket } from 'lucide-react'

const steps = [
  {
    number: '1',
    label: 'STEP 1',
    title: 'Fill Out Info',
    description: "Enter your details and choose your child's camp track and weeks.",
    icon: Monitor,
  },
  {
    number: '2',
    label: 'STEP 2',
    title: 'Review & Agree',
    description: 'Read camp policies, agree to terms, and confirm pricing.',
    icon: Code2,
  },
  {
    number: '3',
    label: 'STEP 3',
    title: 'Receive Invoice',
    description: 'A Gusto invoice is sent to your email with ACH or card options.',
    icon: Receipt,
  },
  {
    number: '4',
    label: 'STEP 4',
    title: 'Get Started',
    description: 'Download the Welcome Packet and install coding software.',
    icon: Rocket,
  },
]

export default function HowItWorks() {
  return (
    <>
      {/* How Registration Works */}
      <section style={{ padding: '96px 0', background: 'var(--bg-white)' }}>
        <div className="container-app">
          <div style={{ textAlign: 'center', marginBottom: '64px' }}>
            <h2
              style={{
                fontFamily: 'Outfit, sans-serif',
                fontSize: 'clamp(26px, 3.5vw, 40px)',
                fontWeight: 800,
                marginBottom: '12px',
              }}
            >
              How Registration Works
            </h2>
          </div>

          <div
            className="stagger-children"
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
              gap: '32px',
            }}
          >
            {steps.map((step) => {
              const Icon = step.icon
              return (
                <div
                  key={step.number}
                  className="animate-fade-in"
                  style={{ textAlign: 'center' }}
                >
                  <div
                    style={{
                      width: '64px',
                      height: '64px',
                      borderRadius: '50%',
                      background: 'var(--bg-subtle)',
                      border: '2px solid var(--border-purple)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      margin: '0 auto 16px',
                    }}
                  >
                    <Icon size={24} color="var(--brand-purple)" />
                  </div>

                  <div
                    style={{
                      fontSize: '11px',
                      fontWeight: 700,
                      letterSpacing: '0.1em',
                      color: 'var(--brand-purple)',
                      marginBottom: '8px',
                    }}
                  >
                    {step.label}
                  </div>

                  <h3
                    style={{
                      fontFamily: 'Outfit, sans-serif',
                      fontSize: '18px',
                      fontWeight: 700,
                      marginBottom: '8px',
                    }}
                  >
                    {step.title}
                  </h3>

                  <p style={{ fontSize: '14px', color: 'var(--text-secondary)', lineHeight: 1.7 }}>
                    {step.description}
                  </p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer
        style={{
          background: 'var(--bg-base)',
          borderTop: '1px solid var(--border-light)',
          padding: '24px 0',
        }}
      >
        <div
          className="container-app"
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '12px',
            fontSize: '13px',
            color: 'var(--text-muted)',
          }}
        >
          <span>© 2026 Elevate Coders. All rights reserved.</span>
          <span style={{ fontWeight: 500, color: 'var(--text-secondary)' }}>
            California Educational Services — 0% Sales Tax
          </span>
        </div>
      </footer>
    </>
  )
}
