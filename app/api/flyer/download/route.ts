import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'
import { renderToBuffer } from '@react-pdf/renderer'
import React from 'react'
import { Document, Page, Image as PDFImage, StyleSheet } from '@react-pdf/renderer'

const styles = StyleSheet.create({
  page: {
    margin: 0,
    padding: 0,
    backgroundColor: '#0F0C20',
  },
  image: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
})

export const runtime = 'nodejs'

export async function GET() {
  try {
    const imagePath = path.join(
      process.env.HOME || '/Users/terrellbyrd',
      '.gemini/antigravity-ide/brain/87751a34-0606-4ff4-851a-16ba945ea82d/elevate_fall_flyer_8weeks_1789238951870.jpg'
    )

    if (!fs.existsSync(imagePath)) {
      return NextResponse.json({ error: 'Flyer image not found' }, { status: 404 })
    }

    const imageBuffer = fs.readFileSync(imagePath)
    const base64Src = `data:image/jpeg;base64,${imageBuffer.toString('base64')}`

    const doc = React.createElement(
      Document,
      {},
      React.createElement(
        Page,
        { size: 'A4', style: styles.page },
        React.createElement(PDFImage, { src: base64Src, style: styles.image })
      )
    )

    const pdfBuffer = await renderToBuffer(doc)

    return new NextResponse(new Uint8Array(pdfBuffer), {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'attachment; filename="Elevate-Coders-Fall-2026-Flyer.pdf"',
      },
    })
  } catch (err) {
    console.error('Flyer PDF download error:', err)
    return NextResponse.json({ error: 'Failed to generate flyer PDF' }, { status: 500 })
  }
}
