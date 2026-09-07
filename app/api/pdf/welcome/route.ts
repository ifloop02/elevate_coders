import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
// Static imports are safe because next.config.ts marks this package as serverExternalPackages,
// so Next.js will never try to bundle @react-pdf/renderer for the browser.
import { renderToBuffer } from '@react-pdf/renderer'
import React from 'react'
import WelcomePacketPDF, { PDFWeekItem } from '@/lib/pdf/WelcomePacket'
import {
  getSessionById,
  getSessionByWeekAndLevel,
  FALL_BEGINNER_SESSIONS,
} from '@/lib/curriculum'

export const runtime = 'nodejs' // Ensure this route always runs on Node.js, never Edge

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const registrationId = searchParams.get('id')

    let studentName = 'Coder'
    let track = 'Co-Ed'
    let levelName: string | undefined
    let isLevel2 = false
    let weeks: PDFWeekItem[] = []

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
                  id: true,
                  weekNumber: true,
                  startDate: true,
                  endDate: true,
                  curriculumLabel: true,
                  level: true,
                  startTime: true,
                  endTime: true,
                },
              },
            },
          },
        },
      })

      if (registration) {
        studentName = registration.student.firstName
        track = registration.track === 'ALL_GIRLS' ? 'All-Girls' : 'Co-Ed'

        isLevel2 = registration.selectedWeeks.some(
          (sw) => sw.weekBlock.level === 'INTERMEDIATE' || sw.weekBlock.id.includes('lvl2')
        )
        levelName = isLevel2
          ? 'Level 2 Class • 7:00 PM – 8:00 PM'
          : 'Beginner Class • 5:00 PM – 6:00 PM'

        weeks = registration.selectedWeeks
          .map((sw) => {
            const wb = sw.weekBlock
            const session =
              getSessionById(wb.id) ||
              getSessionByWeekAndLevel(wb.weekNumber, isLevel2)

            const curriculumTitle =
              session?.title ||
              wb.curriculumLabel.replace(/ — Session \d+/, '').trim()

            const datesStr = session?.dateFormatted || formatDate(wb.startDate)
            const timeStr =
              session?.timeLabel ||
              (wb.startTime && wb.endTime ? `${wb.startTime} – ${wb.endTime}` : undefined)

            return {
              weekNumber: wb.weekNumber,
              dates: datesStr,
              curriculum: curriculumTitle,
            }
          })
          .sort((a, b) => a.weekNumber - b.weekNumber)
      }
    }

    // If no weeks (or direct preview without registration ID), use default 7 beginner sessions
    if (weeks.length === 0) {
      levelName = 'Beginner Class • 5:00 PM – 6:00 PM'
      weeks = FALL_BEGINNER_SESSIONS.map((s) => ({
        weekNumber: s.weekNumber,
        dates: s.dateFormatted,
        curriculum: s.title,
      }))
    }

    // Build the PDF document element
    const element = React.createElement(WelcomePacketPDF, {
      studentName,
      track,
      levelName,
      isLevel2,
      weeks,
    })

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
  const d = new Date(date)
  const monthDay = new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
  }).format(d)
  return `${monthDay} (Thu)`
}
