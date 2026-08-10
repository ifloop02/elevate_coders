import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
// Static imports are safe because next.config.ts marks this package as serverExternalPackages,
// so Next.js will never try to bundle @react-pdf/renderer for the browser.
import { renderToBuffer } from '@react-pdf/renderer'
import React from 'react'
import WelcomePacketPDF from '@/lib/pdf/WelcomePacket'

export const runtime = 'nodejs' // Ensure this route always runs on Node.js, never Edge

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const registrationId = searchParams.get('id')

    let studentName = 'Coder'
    let track = 'Co-Ed'
    let weeks: { weekNumber: number; dates: string; curriculum: string }[] = []

    if (registrationId) {
      const registration = await prisma.registration.findUnique({
        where: { id: registrationId },
        select: {
          track: true,
          student: { select: { firstName: true } },
          selectedWeeks: {
            select: {
              weekBlock: {
                select: {
                  weekNumber: true,
                  startDate: true,
                  endDate: true,
                  curriculumLabel: true,
                },
              },
            },
          },
        },
      })

      if (registration) {
        studentName = registration.student.firstName
        track = registration.track === 'ALL_GIRLS' ? 'All-Girls' : 'Co-Ed'
        weeks = registration.selectedWeeks.map((sw: {
          weekBlock: {
            weekNumber: number
            startDate: Date
            endDate: Date
            curriculumLabel: string
          }
        }) => ({
          weekNumber: sw.weekBlock.weekNumber,
          dates: `${formatDate(sw.weekBlock.startDate)} – ${formatDate(sw.weekBlock.endDate)}`,
          curriculum: sw.weekBlock.curriculumLabel,
        }))
      }
    }

    // Build the PDF document element
    const element = React.createElement(WelcomePacketPDF, { studentName, track, weeks })

    // renderToBuffer returns a Node.js Buffer
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const buffer: Buffer = await renderToBuffer(element as any)

    // Wrap in a ReadableStream — the correct BodyInit for NextResponse
    const stream = new ReadableStream({
      start(controller) {
        controller.enqueue(new Uint8Array(buffer))
        controller.close()
      },
    })

    return new NextResponse(stream, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="Elevate-Coders-Welcome-Packet-2026.pdf"`,
        'Cache-Control': 'no-store',
      },
    })
  } catch (error) {
    console.error('PDF generation error:', error)
    return NextResponse.json({ error: 'Failed to generate PDF.' }, { status: 500 })
  }
}

function formatDate(date: Date | string): string {
  return new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric' }).format(
    new Date(date)
  )
}
