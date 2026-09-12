// lib/validation.ts — Shared Zod schemas

import { z } from 'zod'

export const ParentInfoSchema = z.object({
  legalName: z.string().min(2, 'Legal name is required').max(100),
  email: z.string().email('Valid email required'),
  phone: z
    .string()
    .regex(/^(\+?1?\s?)?(\(?\d{3}\)?[\s.\-]?\d{3}[\s.\-]?\d{4})$/, 'Valid US phone number required'),
  referralCode: z.string().optional(),
  marketingOptIn: z.boolean().default(true),
  photoMediaOptIn: z.boolean().default(true),
})

export const StudentInfoSchema = z.object({
  firstName: z.string().min(1, 'First name is required').max(50),
  lastName: z.string().min(1, 'Last name is required').max(50),
  dateOfBirth: z.string().refine((val) => {
    const dob = new Date(val)
    const today = new Date()
    const age = today.getFullYear() - dob.getFullYear()
    return age >= 7 && age <= 12
  }, 'Student must be between 7–12 years old'),
  allergies: z.string().max(500).optional(),
  medicalNotes: z.string().max(500).optional(),
  track: z.enum(['COED', 'ALL_GIRLS']),
  completedBeginnerCourse: z.boolean().default(false),
  beginnerCourseYear: z.number().optional(),
  hasVerifiedOutsideExp: z.boolean().default(false),
  outsideExpDescription: z.string().max(500).optional(),
})

export const WeekSelectionSchema = z.object({
  weekBlockIds: z
    .array(z.string())
    .min(1, 'Please select at least one week'),
  vacationDates: z
    .array(
      z.object({
        date: z.string(),
        weekNumber: z.number(),
        reason: z.string().optional(),
      })
    )
    .optional()
    .default([]),
})

export const RegistrationSubmitSchema = z.object({
  parent: ParentInfoSchema,
  student: StudentInfoSchema,
  weekSelection: WeekSelectionSchema,
  paymentMethod: z.enum(['ACH_ONLY', 'ACH_AND_CREDIT_CARD']).default('ACH_ONLY'),
  discountCode: z.string().optional(),
  policyAgreed: z.literal(true, {
    error: 'You must agree to the camp policies to continue.',
  }),
})

export type RegistrationSubmitPayload = z.infer<typeof RegistrationSubmitSchema>
export type ParentInfo = z.infer<typeof ParentInfoSchema>
export type StudentInfo = z.infer<typeof StudentInfoSchema>
export type WeekSelection = z.infer<typeof WeekSelectionSchema>

// Email Intake Parser schema
export const IntakeParseSchema = z.object({
  rawText: z.string().min(10, 'Please paste at least 10 characters of email text'),
})
