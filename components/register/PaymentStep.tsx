'use client'

import { useState, useEffect } from 'react'
import { loadStripe } from '@stripe/stripe-js'
import {
  Elements,
  PaymentElement,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js'
import { formatCurrency } from '@/lib/proration'

// Load Stripe outside component to avoid re-instantiation on re-renders
const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
)

// ── Inner form that has access to Stripe hooks ──────────────────────
function CheckoutForm({
  finalTotal,
  parentEmail,
  onSuccess,
  onError,
}: {
  finalTotal: number
  parentEmail: string
  onSuccess: () => void
  onError: (msg: string) => void
}) {
  const stripe = useStripe()
  const elements = useElements()
  const [processing, setProcessing] = useState(false)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!stripe || !elements) return

    setProcessing(true)
    setErrorMsg(null)

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/register/confirmation`,
        payment_method_data: {
          billing_details: {
            email: parentEmail,
          },
        },
      },
      redirect: 'if_required',
    })

    if (error) {
      const msg =
        error.type === 'card_error' || error.type === 'validation_error'
          ? (error.message ?? 'Payment failed. Please check your details.')
          : 'An unexpected error occurred. Please try again.'
      setErrorMsg(msg)
      onError(msg)
      setProcessing(false)
    } else {
      // Payment succeeded
      onSuccess()
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      {/* Stripe Payment Element — renders card + ACH tabs automatically */}
      <div
        style={{
          padding: '20px',
          background: 'var(--bg-white)',
          border: '1px solid var(--border-light)',
          borderRadius: 'var(--radius-md)',
          marginBottom: '20px',
        }}
      >
        <PaymentElement
          options={{
            layout: 'tabs',
            fields: { billingDetails: { email: 'never' } }, // we already have email
          }}
        />
      </div>

      {errorMsg && (
        <div
          role="alert"
          style={{
            marginBottom: '16px',
            padding: '12px 16px',
            background: '#FEF2F2',
            border: '1px solid #FCA5A5',
            borderRadius: 'var(--radius-md)',
            fontSize: '13px',
            color: '#DC2626',
          }}
        >
          {errorMsg}
        </div>
      )}

      <button
        type="submit"
        disabled={!stripe || !elements || processing}
        className="btn btn-primary"
        style={{
          width: '100%',
          justifyContent: 'center',
          fontSize: '16px',
          padding: '14px',
          opacity: !stripe || !elements || processing ? 0.6 : 1,
        }}
      >
        {processing ? (
          '⏳ Processing payment...'
        ) : (
          <>🔒 Pay {formatCurrency(finalTotal)} &amp; Complete Registration</>
        )}
      </button>

      <p
        style={{
          textAlign: 'center',
          fontSize: '12px',
          color: 'var(--text-muted)',
          marginTop: '10px',
        }}
      >
        Secured by Stripe. Your card details are never stored on our servers.
      </p>
    </form>
  )
}

// ── Outer component: fetches clientSecret, then mounts Elements ─────
interface PaymentStepProps {
  finalTotal: number
  parentEmail: string
  parentName: string
  onSuccess: () => void
}

export default function PaymentStep({
  finalTotal,
  parentEmail,
  parentName,
  onSuccess,
}: PaymentStepProps) {
  const [clientSecret, setClientSecret] = useState<string | null>(null)
  const [fetchError, setFetchError] = useState<string | null>(null)
  const [payError, setPayError] = useState<string | null>(null)

  useEffect(() => {
    const amountCents = Math.round(finalTotal * 100)
    fetch('/api/stripe/payment-intent', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        amountCents,
        parentEmail,
        parentName,
        description: `Elevate Coders Fall 2026 — ${parentName}`,
      }),
    })
      .then((r) => r.json())
      .then((data) => {
        if (data.clientSecret) {
          setClientSecret(data.clientSecret)
        } else {
          setFetchError(data.error ?? 'Failed to initialize payment. Please try again.')
        }
      })
      .catch(() => setFetchError('Network error. Please check your connection and try again.'))
  }, [finalTotal, parentEmail, parentName])

  return (
    <div>
      <h2
        style={{
          fontFamily: 'Outfit, sans-serif',
          fontSize: '22px',
          fontWeight: 700,
          marginBottom: '8px',
        }}
      >
        Payment
      </h2>
      <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginBottom: '24px' }}>
        Choose your payment method below. We accept credit/debit cards and ACH bank transfer (US accounts).
      </p>

      {/* Amount summary */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '14px 18px',
          background: 'linear-gradient(135deg, #F5F3FF 0%, #EDE9FE 100%)',
          border: '1px solid #DDD6FE',
          borderRadius: 'var(--radius-md)',
          marginBottom: '24px',
        }}
      >
        <span style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)' }}>
          Total due today
        </span>
        <span
          style={{
            fontFamily: 'Outfit, sans-serif',
            fontSize: '24px',
            fontWeight: 900,
            color: 'var(--brand-purple)',
          }}
        >
          {formatCurrency(finalTotal)}
        </span>
      </div>

      {fetchError && (
        <div
          role="alert"
          style={{
            padding: '14px 16px',
            background: '#FEF2F2',
            border: '1px solid #FCA5A5',
            borderRadius: 'var(--radius-md)',
            fontSize: '13px',
            color: '#DC2626',
            marginBottom: '16px',
          }}
        >
          {fetchError}
        </div>
      )}

      {!clientSecret && !fetchError && (
        <div
          style={{
            padding: '40px',
            textAlign: 'center',
            color: 'var(--text-muted)',
            fontSize: '14px',
          }}
        >
          <div style={{ marginBottom: '8px', fontSize: '24px' }}>⏳</div>
          Preparing secure payment form...
        </div>
      )}

      {clientSecret && (
        <Elements
          stripe={stripePromise}
          options={{
            clientSecret,
            appearance: {
              theme: 'stripe',
              variables: {
                colorPrimary: '#7C3AED',
                colorBackground: '#ffffff',
                colorText: '#1F2937',
                colorDanger: '#DC2626',
                fontFamily: 'Inter, system-ui, sans-serif',
                borderRadius: '8px',
              },
            },
          }}
        >
          <CheckoutForm
            finalTotal={finalTotal}
            parentEmail={parentEmail}
            onSuccess={onSuccess}
            onError={setPayError}
          />
        </Elements>
      )}
    </div>
  )
}
