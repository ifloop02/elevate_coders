import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { checkRateLimit, getClientIP } from '@/lib/ratelimit'

export async function GET(request: NextRequest) {
  // ─── PIN from header only (never from URL query param) ────────────
  // Accepting the PIN in the URL exposes it in browser history, server
  // access logs, and any analytics tools. Always pass via x-admin-pin header.
  const pin = (request.headers.get('x-admin-pin') || '').trim()

  // ─── Env var check ────────────────────────────────────────────────
  // If ADMIN_PIN is not configured in Vercel env vars, disable access
  // entirely rather than silently falling back to a default.
  const expectedPin = process.env.ADMIN_PIN?.trim()
  if (!expectedPin) {
    console.error('[SECURITY] ADMIN_PIN env var is not configured. Admin access is disabled.')
    return NextResponse.json(
      { error: 'Admin access is not configured. Please set ADMIN_PIN in your environment variables.' },
      { status: 503 }
    )
  }

  // ─── Rate limiting: 5 PIN attempts per IP per 10 minutes ─────────
  // Blocks brute-force guessing of the admin PIN without affecting
  // any legitimate admin user who would never fail 5+ times.
  const ip = getClientIP(request)
  const rl = checkRateLimit(`admin-pin:${ip}`, 5, 10 * 60 * 1000)
  if (!rl.success) {
    return NextResponse.json(
      { error: 'Too many access attempts. Please wait 10 minutes and try again.' },
      { status: 429 }
    )
  }

  if (pin !== expectedPin) {
    return NextResponse.json({ error: 'Unauthorized. Invalid admin PIN.' }, { status: 401 })
  }

  const { searchParams } = new URL(request.url)
  const optedInOnly = searchParams.get('opted_in_only') === 'true' || searchParams.get('optedInOnly') === 'true'

  try {
    const parents = await prisma.parent.findMany({
      where: optedInOnly ? { marketingOptIn: true } : undefined,
      select: {
        id: true,
        legalName: true,
        email: true,
        phone: true,
        marketingOptIn: true,
        photoMediaOptIn: true,
        referralCode: true,
        createdAt: true,
        students: {
          select: {
            firstName: true,
            lastName: true,
            age: true,
            track: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    })

    const format = searchParams.get('format') // 'csv' or 'json'

    if (format === 'csv') {
      const headers = [
        'Legal Name',
        'Email',
        'Phone',
        'Marketing Consent',
        'Photo Consent',
        'Referral Code',
        'Student Names',
        'Student Ages',
        'Enrolled Tracks',
        'Registered Date',
      ]

      const rows = parents.map((p) => [
        `"${p.legalName.replace(/"/g, '""')}"`,
        `"${p.email.replace(/"/g, '""')}"`,
        `"${p.phone.replace(/"/g, '""')}"`,
        `"${p.marketingOptIn ? 'YES' : 'NO'}"`,
        `"${p.photoMediaOptIn ? 'YES' : 'NO'}"`,
        `"${p.referralCode}"`,
        `"${p.students.map((s) => `${s.firstName} ${s.lastName}`).join(', ')}"`,
        `"${p.students.map((s) => s.age).join(', ')}"`,
        `"${p.students.map((s) => s.track).join(', ')}"`,
        `"${p.createdAt.toISOString().slice(0, 10)}"`,
      ])

      const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n')

      return new NextResponse(csvContent, {
        status: 200,
        headers: {
          'Content-Type': 'text/csv; charset=utf-8',
          'Content-Disposition': `attachment; filename="elevate_coders_contacts_${new Date().toISOString().slice(0, 10)}.csv"`,
        },
      })
    }

    return NextResponse.json({
      totalContacts: parents.length,
      optedInCount: parents.filter((p) => p.marketingOptIn).length,
      parents: parents.map((p) => ({
        name: p.legalName,
        email: p.email,
        phone: p.phone,
        marketingOptIn: p.marketingOptIn,
        photoMediaOptIn: p.photoMediaOptIn,
        referralCode: p.referralCode,
        students: p.students,
        registeredAt: p.createdAt,
      })),
    })
  } catch (error) {
    console.error('Failed to export marketing list:', error)
    return NextResponse.json({ error: 'Failed to retrieve contacts list.' }, { status: 500 })
  }
}
