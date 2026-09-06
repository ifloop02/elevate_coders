import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2026-08-26.dahlia',
})

export async function POST(request: NextRequest) {
  try {
    const { amountCents, parentEmail, parentName, description } = await request.json()

    if (!amountCents || amountCents < 50) {
      return NextResponse.json(
        { error: 'Invalid payment amount.' },
        { status: 400 }
      )
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount: amountCents, // Stripe always works in cents
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
