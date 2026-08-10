import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const code = searchParams.get('code')

  if (!code) {
    return NextResponse.json({ error: 'Code is required.' }, { status: 400 })
  }

  const discount = await prisma.discountCode.findFirst({
    where: {
      code: code.toUpperCase(),
      isActive: true,
    },
    select: {
      code: true,
      discountPercent: true,
      description: true,
      expiresAt: true,
      usageLimit: true,
      usedCount: true,
    },
  })

  if (!discount) {
    return NextResponse.json({ error: 'Invalid discount code.' }, { status: 404 })
  }

  if (discount.expiresAt && discount.expiresAt < new Date()) {
    return NextResponse.json({ error: 'This discount code has expired.' }, { status: 400 })
  }

  if (discount.usageLimit !== null && discount.usedCount >= discount.usageLimit) {
    return NextResponse.json({ error: 'This discount code has reached its usage limit.' }, { status: 400 })
  }

  return NextResponse.json({
    code: discount.code,
    discountPercent: discount.discountPercent,
    description: discount.description,
  })
}
