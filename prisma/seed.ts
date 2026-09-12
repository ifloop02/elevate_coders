import dotenv from 'dotenv'
import { Pool } from 'pg'
import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient, SeasonType } from '@prisma/client'

dotenv.config({ path: '.env.local' })
dotenv.config()

const connectionString = process.env.DATABASE_URL
const pool = new Pool({ connectionString })
const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({ adapter })

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
  // FALL 2026 — 7 Thursday Sessions starting October 8th
  // Class 1 (Beginner): 5:00 PM – 6:00 PM
  // Class 2 (Level 2): 7:00 PM – 8:00 PM (Prerequisite required)
  // ─────────────────────────────────────────────────
  const { ALL_FALL_SESSIONS } = await import('../lib/curriculum')

  for (const s of ALL_FALL_SESSIONS) {
    const sessionDate = new Date(s.date)
    await prisma.weekBlock.upsert({
      where: { id: s.id },
      create: {
        id: s.id,
        weekNumber: s.weekNumber,
        season: SeasonType.FALL,
        year: 2026,
        startDate: sessionDate,
        endDate: sessionDate,
        dayOfWeek: s.dayOfWeek,
        startTime: s.startTime,
        endTime: s.endTime,
        curriculumLabel: s.title,
        description: s.project || s.concept,
        requiresPrerequisite: s.requiresPrerequisite,
        level: s.level === 'LEVEL_2' ? 'INTERMEDIATE' : 'BEGINNER',
        pricePerUnit: s.pricePerUnit,
        isActive: true,
        track: null,
      },
      update: {
        curriculumLabel: s.title,
        description: s.project || s.concept,
        weekNumber: s.weekNumber,
        isActive: true,
      },
    })
  }

  console.log('✅ Fall 2026 Thursday sessions seeded with full weekly curriculum titles.')

  console.log('✅ Fall 2026 Thursday sessions seeded.')

  // ─────────────────────────────────────────────────
  // DISCOUNT CODES
  // ─────────────────────────────────────────────────
  console.log('🔄 Cleaning up old discount codes...')
  // Safely decouple any registrations referencing old discounts
  await prisma.registration.updateMany({
    where: { discountCodeId: { not: null } },
    data: { discountCodeId: null },
  })
  await prisma.discountCode.deleteMany({})

  const discountCodes = [
    {
      id: 'discount-fallfirst2',
      code: 'FALLFIRST2',
      description: 'Early Bird Registers — 20% off',
      sponsorName: null,
      discountPercent: 20.0,
      usageLimit: 2,
      usedCount: 0,
      isActive: true,
    },
    {
      id: 'discount-fall50',
      code: 'FALL50',
      description: 'Fall Special 50% Off for Team Elevate',
      sponsorName: 'Team Elevate',
      discountPercent: 50.0,
      usageLimit: 3,
      usedCount: 0,
      isActive: true,
    },
    {
      id: 'discount-alumni10',
      code: 'ALUMNI10',
      description: 'Returning Alumni Family — 10% loyalty discount',
      sponsorName: null,
      discountPercent: 10.0,
      usageLimit: 5,
      usedCount: 0,
      isActive: true,
    },
    {
      id: 'discount-gscs15',
      code: 'GSCS15',
      description: 'School Discount — 15% off',
      sponsorName: 'GSCS',
      discountPercent: 15.0,
      usageLimit: 5,
      usedCount: 0,
      isActive: true,
    },
    {
      id: 'discount-elev8academy',
      code: 'ELEV8ACADEMY',
      description: 'Team Special — 70% off',
      sponsorName: 'Team Special',
      discountPercent: 70.0,
      usageLimit: 2,
      usedCount: 0,
      isActive: true,
    },
    {
      id: 'discount-fallback25',
      code: 'FALLBACK25',
      description: 'Fall Special — $25 off ($175 tuition)',
      sponsorName: 'Fall Special',
      discountPercent: 12.5,
      usageLimit: 5,
      usedCount: 0,
      isActive: true,
    },
  ]

  for (const code of discountCodes) {
    await prisma.discountCode.create({
      data: code,
    })
  }

  console.log('✅ 4 new discount codes created (FALLFIRST2, FALL50, ALUMNI10, GSCS15).')
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
