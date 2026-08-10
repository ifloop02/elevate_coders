'use client'

import { CheckCircle } from 'lucide-react'

interface StepIndicatorProps {
  steps: string[]
  currentStep: number
}

export default function StepIndicator({ steps, currentStep }: StepIndicatorProps) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', overflowX: 'auto', gap: '0' }}>
      {steps.map((step, i) => (
        <div key={i} style={{ display: 'flex', alignItems: 'center', flex: i < steps.length - 1 ? '1' : 'none', minWidth: 0 }}>
          {/* Dot */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', flexShrink: 0 }}>
            <div
              className={`step-dot ${i === currentStep ? 'active' : i < currentStep ? 'completed' : ''}`}
            >
              {i < currentStep ? <CheckCircle size={16} /> : i + 1}
            </div>
            <span style={{
              fontSize: '11px',
              fontWeight: i === currentStep ? 600 : 400,
              color: i === currentStep ? 'var(--brand-purple)' : i < currentStep ? 'var(--brand-green)' : 'var(--text-muted)',
              whiteSpace: 'nowrap',
            }}>
              {step}
            </span>
          </div>
          {/* Connector */}
          {i < steps.length - 1 && (
            <div className={`step-connector ${i < currentStep ? 'completed' : ''}`} />
          )}
        </div>
      ))}
    </div>
  )
}
