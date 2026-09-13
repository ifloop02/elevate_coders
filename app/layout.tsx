import type { Metadata } from 'next'
import './globals.css'
import Navbar from '@/components/nav/Navbar'
import Footer from '@/components/nav/Footer'

export const metadata: Metadata = {
  title: 'Elevate Coders — Fall 2026 Coding Program for Ages 7–12',
  description:
    '8-week Thursday coding program for children ages 7–12. Beginner to Level 2 Advanced Game Mechanics in a supportive, inclusive environment.',
  keywords: [
    'kids coding camp',
    'fall coding program',
    'learn to code for kids',
    'Scratch programming',
    'game mechanics for kids',
    'girls coding camp',
    'STEM camp',
    'children tech education',
  ],
  openGraph: {
    title: 'Elevate Coders — Where Young Coders Build the Future',
    description:
      '8-week Thursday coding program for ages 7–12. Co-Ed & All-Girls tracks. Beginner Scratch to Level 2 Advanced Game Mechanics.',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        <Navbar />
        <main style={{ flex: 1 }}>{children}</main>
        <Footer />
      </body>
    </html>
  )
}
