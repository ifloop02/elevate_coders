import type { Metadata } from 'next'
import HeroSection from '@/components/home/HeroSection'
import TrackCards from '@/components/home/TrackCards'
import SchedulePreview from '@/components/home/SchedulePreview'
import HowItWorks from '@/components/home/HowItWorks'

export const metadata: Metadata = {
  title: 'Elevate Coders — Where Young Coders Build the Future',
  description:
    'Summer coding camps for ages 9–12. Co-Ed and All-Girls tracks. Week-by-week Scratch and Python curriculum. California Educational Services — 0% Sales Tax.',
}

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <TrackCards />
      <SchedulePreview />
      <HowItWorks />
    </>
  )
}
