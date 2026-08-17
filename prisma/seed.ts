import { PrismaClient, SeasonType, CampTrack } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding Elevate Coders database...')

  // ─────────────────────────────────────────────────
  // SUMMER 2026 — 8 Weeks (Mon–Fri, $200/week) - I will make changes to the scheduling later. 
  // ─────────────────────────────────────────────────
  const summerWeeks = [
    {
      weekNumber: 1,
      startDate: new Date('2026-06-15'),
      endDate: new Date('2026-06-19'),
      curriculumLabel: 'Scratch Foundations',
      description: 'Introduction to visual block-based coding with Scratch. Build your first games and animations.',
      requiresPrerequisite: false,
      level: 'BEGINNER',
    },
    {
      weekNumber: 2,
      startDate: new Date('2026-06-22'),
      endDate: new Date('2026-06-26'),
      curriculumLabel: 'Scratch Foundations',
      description: 'Deepen Scratch skills: conditionals, loops, and sprite interactions.',
      requiresPrerequisite: false,
      level: 'BEGINNER',
    },
    {
      weekNumber: 3,
      startDate: new Date('2026-06-29'),
      endDate: new Date('2026-07-03'),
      curriculumLabel: 'Scratch Foundations',
      description: 'Collaborative Scratch projects and end-of-week showcase.',
      requiresPrerequisite: false,
      level: 'BEGINNER',
    },
    {
      weekNumber: 4,
      startDate: new Date('2026-07-06'),
      endDate: new Date('2026-07-10'),
      curriculumLabel: 'Scratch Foundations',
      description: 'Advanced Scratch: cloning, custom blocks, and project publishing.',
      requiresPrerequisite: false,
      level: 'BEGINNER',
    },
    {
      weekNumber: 5,
      startDate: new Date('2026-07-13'),
      endDate: new Date('2026-07-17'),
      curriculumLabel: 'Python Exploration',
      description: 'Introduction to Thonny Python IDE. Variables, data types, and basic I/O.',
      requiresPrerequisite: true,
      level: 'INTERMEDIATE',
    },
    {
      weekNumber: 6,
      startDate: new Date('2026-07-20'),
      endDate: new Date('2026-07-24'),
      curriculumLabel: 'Python Exploration',
      description: 'Python control flow: if/else, for loops, while loops, and functions.',
      requiresPrerequisite: true,
      level: 'INTERMEDIATE',
    },
    {
      weekNumber: 7,
      startDate: new Date('2026-07-27'),
      endDate: new Date('2026-07-31'),
      curriculumLabel: 'Python Exploration',
      description: 'Python projects: text-based games and beginner data structures.',
      requiresPrerequisite: true,
      level: 'INTERMEDIATE',
    },
    {
      weekNumber: 8,
      startDate: new Date('2026-08-03'),
      endDate: new Date('2026-08-07'),
      curriculumLabel: 'Python Exploration',
      description: 'Final Python showcase project and portfolio presentation.',
      requiresPrerequisite: true,
      level: 'INTERMEDIATE',
    },
  ]

  for (const week of summerWeeks) {
    await prisma.weekBlock.upsert({
      where: {
        id: `summer-2026-week-${week.weekNumber}`,
      },
      create: {
        id: `summer-2026-week-${week.weekNumber}`,
        season: SeasonType.SUMMER,
        year: 2026,
        pricePerUnit: 200.0,
        isActive: true,
        track: null,
        ...week,
      },
      update: week,
    })
  }

  console.log('✅ Summer 2026 weeks seeded.')

  // ─────────────────────────────────────────────────
  // FALL 2026 — 7 Thursday Sessions starting September 10th
  // Class 1 (Beginner): 5:00 PM – 6:00 PM
  // Class 2 (Next Level): 6:00 PM – 7:00 PM (Prerequisite required)
  // ─────────────────────────────────────────────────
  const fallStartDate = new Date('2026-09-10') // First Thursday

  const fallSessions = []
  for (let i = 0; i < 7; i++) {
    // 7 Thursday sessions
    const sessionDate = new Date(fallStartDate)
    sessionDate.setDate(fallStartDate.getDate() + i * 7)

    const sessionNumber = i + 1

    // Beginner session (5pm–6pm)
    fallSessions.push({
      id: `fall-2026-beginner-session-${sessionNumber}`,
      weekNumber: sessionNumber,
      season: SeasonType.FALL,
      year: 2026,
      startDate: sessionDate,
      endDate: sessionDate,
      dayOfWeek: 'Thursday',
      startTime: '17:00',
      endTime: '18:00',
      curriculumLabel: `Scratch & Coding Basics — Session ${sessionNumber}`,
      description: 'Thursday beginner coding class (5:00 PM - 6:00 PM). Scratch visual programming.',
      requiresPrerequisite: false,
      level: 'BEGINNER',
      pricePerUnit: 30.0,
      isActive: true,
      track: null,
    })

    // Next-level session (6pm–7pm)
    fallSessions.push({
      id: `fall-2026-advanced-session-${sessionNumber}`,
      weekNumber: sessionNumber,
      season: SeasonType.FALL,
      year: 2026,
      startDate: sessionDate,
      endDate: sessionDate,
      dayOfWeek: 'Thursday',
      startTime: '18:00',
      endTime: '19:00',
      curriculumLabel: `Python Exploration — Session ${sessionNumber}`,
      description: 'Thursday next-level coding class (6:00 PM - 7:00 PM). Python programming (prerequisite required).',
      requiresPrerequisite: true,
      level: 'INTERMEDIATE',
      pricePerUnit: 30.0,
      isActive: true,
      track: null,
    })
  }

  for (const session of fallSessions) {
    await prisma.weekBlock.upsert({
      where: { id: session.id },
      create: session,
      update: {
        curriculumLabel: session.curriculumLabel,
        description: session.description,
        isActive: session.isActive,
      },
    })
  }

  console.log('✅ Fall 2026 Thursday sessions seeded.')

  // ─────────────────────────────────────────────────
  // DISCOUNT CODES
  // ─────────────────────────────────────────────────
  const discountCodes = [
    {
      id: 'discount-partner75',
      code: 'PARTNER75',
      description: 'Corporate Partner Scholarship — 75% off all weeks',
      sponsorName: 'Corporate Partner',
      discountPercent: 75.0,
      usageLimit: 10,
      isActive: true,
    },
    {
      id: 'discount-alumni10',
      code: 'ALUMNI10',
      description: 'Returning Alumni Family — 10% loyalty discount',
      sponsorName: null,
      discountPercent: 10.0,
      usageLimit: null,
      isActive: true,
    },
    {
      id: 'discount-earlybird20',
      code: 'EARLYBIRD20',
      description: 'Early Bird Registration — 20% off (first 20 families)',
      sponsorName: null,
      discountPercent: 20.0,
      usageLimit: 20,
      isActive: true,
    },
  ]

  for (const code of discountCodes) {
    await prisma.discountCode.upsert({
      where: { id: code.id },
      create: { ...code, usedCount: 0 },
      update: { description: code.description, isActive: code.isActive },
    })
  }

  console.log('✅ Discount codes seeded.')
  console.log('🎉 Database seeding complete!')
}

main()
  .catch((e) => {
    console.error('❌ Seed error:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
