import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const email = searchParams.get('email')?.toLowerCase().trim()

    if (!email || !email.includes('@')) {
      return NextResponse.json({ availableCredit: 0, count: 0 })
    }

    const parent = await prisma.parent.findUnique({
      where: { email },
      select: {
        id: true,
        legalName: true,
        referralLedger: {
          where: {
            status: 'PENDING',
          },
          select: {
            id: true,
            creditAmount: true,
            createdAt: true,
          },
        },
      },
    })

    if (!parent || !parent.referralLedger || parent.referralLedger.length === 0) {
      return NextResponse.json({ availableCredit: 0, count: 0 })
    }

    const availableCredit = parent.referralLedger.reduce(
      (acc, item) => acc + item.creditAmount,
      0
    )

    return NextResponse.json({
      availableCredit: Number(availableCredit.toFixed(2)),
      count: parent.referralLedger.length,
      parentName: parent.legalName,
    })
  } catch (error) {
    console.error('Error fetching referral credits:', error)
    return NextResponse.json({ availableCredit: 0, count: 0 })
  }
}
