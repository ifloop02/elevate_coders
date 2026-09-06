import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'

export async function POST(request: NextRequest) {
  // Initialize inside the handler so env vars are guaranteed to be loaded
  const stripeKey = process.env.STRIPE_SECRET_KEY
  if (!stripeKey) {
    return NextResponse.json(
      { error: 'Payment service is not configured. Please contact support.' },
      { status: 500 }
    )
  }

  const stripe = new Stripe(stripeKey, {
    apiVersion: '2026-08-26.dahlia',
  })

  try {
    const { amountCents, parentEmail, parentName, description } = await request.json()

    if (!amountCents || amountCents < 50) {
      return NextResponse.json(
        { error: 'Invalid payment amount.' },
        { status: 400 }
      )
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount: amountCents,
      currency: 'usd',
      payment_method_types: ['card', 'us_bank_account'],
      receipt_email: parentEmail,
      description,
      metadata: {
        parentName: parentName ?? '',
        parentEmail: parentEmail ?? '',
        platform: 'elevate-coders',
      },
    })

    return NextResponse.json({ clientSecret: paymentIntent.client_secret })
  } catch (err) {
    console.error('Stripe payment intent error:', err)
    return NextResponse.json(
      { error: 'Failed to create payment session. Please try again.' },
      { status: 500 }
    )
  }
}
