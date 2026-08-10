import type { Metadata } from 'next'
import './globals.css'
import Navbar from '@/components/nav/Navbar'

export const metadata: Metadata = {
  title: 'Elevate Coders — Summer Coding Camps for Ages 9–12',
  description:
    'Week-by-week summer and fall coding camps for children ages 9–12. From Scratch to Python, your child builds real programming skills in a supportive, inclusive environment. California Educational Services — 0% Sales Tax.',
  keywords: [
    'kids coding camp',
    'summer coding camp',
    'learn to code for kids',
    'Scratch programming',
    'Python for kids',
    'girls coding camp',
    'STEM camp',
    'children tech education',
  ],
  openGraph: {
    title: 'Elevate Coders — Where Young Coders Build the Future',
    description:
      'Week-by-week coding camps for ages 9–12. Co-Ed and All-Girls tracks. Scratch to Python curriculum.',
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
      <body>
        <Navbar />
        <main>{children}</main>
      </body>
    </html>
  )
}
