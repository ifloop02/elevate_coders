import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'
import { renderToBuffer } from '@react-pdf/renderer'
import React from 'react'
import { Document, Page, Image as PDFImage, StyleSheet } from '@react-pdf/renderer'

// Standard US Letter dimensions (in points): 612 x 792 (8.5in x 11in)
const styles = StyleSheet.create({
  page: {
    margin: 0,
    padding: 0,
    backgroundColor: '#0F0C20',
  },
  image: {
    width: 612,
    height: 792,
    objectFit: 'contain',
  },
})

export const runtime = 'nodejs'

export async function GET() {
  try {
    const artifactPath = path.join(
      process.env.HOME || '/Users/terrellbyrd',
      '.gemini/antigravity-ide/brain/87751a34-0606-4ff4-851a-16ba945ea82d/elevate_fall_flyer_8weeks_1789238951870.jpg'
    )
    const publicPath = path.join(process.cwd(), 'public', 'flyer.jpg')

    let targetImagePath = artifactPath
    if (fs.existsSync(artifactPath)) {
      try {
        fs.copyFileSync(artifactPath, publicPath)
        targetImagePath = publicPath
      } catch {
        // fallback to artifact path
      }
    } else if (fs.existsSync(publicPath)) {
      targetImagePath = publicPath
    }

    if (!fs.existsSync(targetImagePath)) {
      return NextResponse.json({ error: 'Flyer image not found' }, { status: 404 })
    }

    // Direct binary JPEG embedding in PDF XObject prevents Base64 zoom canvas blanking
    const doc = React.createElement(
      Document,
      { title: 'Elevate Coders Fall 2026 Flyer' },
      React.createElement(
        Page,
        { size: [612, 792], style: styles.page },
        React.createElement(PDFImage, { src: targetImagePath, style: styles.image })
      )
    )

    const pdfBuffer = await renderToBuffer(doc)

    return new NextResponse(new Uint8Array(pdfBuffer), {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'inline; filename="Elevate-Coders-Fall-2026-Flyer.pdf"',
      },
    })
  } catch (err) {
    console.error('Flyer PDF download error:', err)
    return NextResponse.json({ error: 'Failed to generate flyer PDF' }, { status: 500 })
  }
}
