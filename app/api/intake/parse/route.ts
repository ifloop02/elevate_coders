import { NextRequest, NextResponse } from 'next/server'
import { checkRateLimit, getClientIP } from '@/lib/ratelimit'

// RegEx patterns for email intake parsing
const PATTERNS = {
  parentName:  /(?:parent|guardian|billing|legal)\s*name[:\s]+([A-Za-z\s\-'.]+?)(?:\n|$|email|phone)/i,
  email:       /[\w.+\-]+@[\w\-]+\.[a-z]{2,}/i,
  phone:       /(?:phone|cell|contact|billing\s*phone)[:\s]*(\+?1?\s?\(?\d{3}\)?[\s.\-]?\d{3}[\s.\-]?\d{4})/i,
  phoneRaw:    /\b(\(?\d{3}\)?[\s.\-]?\d{3}[\s.\-]?\d{4})\b/,
  childName:   /(?:child|student|kid)(?:'s)?\s*name[:\s]+([A-Za-z\s\-'.]+?)(?:\n|$|age|dob|born)/i,
  age:         /(?:age|child\s*age|student\s*age)[:\s]+(\d{1,2})/i,
  allergies:   /(?:allerg(?:y|ies)|medical|health)[:\s]+([^\n]{3,})/i,
  weeks:       /(?:week[s]?|selected\s*week[s]?|camp\s*week[s]?)[:\s]*([\d,\s\-and]+)/i,
  track:       /(?:track|camp\s*type|program)[:\s]+(co\-?ed|all\-?girl[s]?|girls?|coed)/i,
  referral:    /(?:referral|referred\s*by|code)[:\s]+([A-Za-z0-9]+)/i,
}

function clean(str: string | undefined): string {
  return str?.trim().replace(/\s+/g, ' ') ?? ''
}

function parseWeeks(weekStr: string): number[] {
  const nums = weekStr.match(/\d+/g)
  if (!nums) return []
  return nums.map(Number).filter((n) => n >= 1 && n <= 8)
}

function parseTrack(raw: string): 'COED' | 'ALL_GIRLS' | null {
  const lower = raw.toLowerCase()
  if (lower.includes('girl')) return 'ALL_GIRLS'
  if (lower.includes('co') || lower.includes('coed')) return 'COED'
  return null
}

export async function POST(request: NextRequest) {
  // ─── Admin PIN required ───────────────────────────────────
  // This endpoint is an internal admin tool. Without auth, anyone on the
  // internet can POST arbitrary text and receive parsed results.
  const pin = (request.headers.get('x-admin-pin') || '').trim()
  const expectedPin = process.env.ADMIN_PIN?.trim()
  if (!expectedPin || pin !== expectedPin) {
    return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 })
  }

  // ─── Rate limiting: 10 parses per IP per minute ───────────────
  const ip = getClientIP(request)
  const rl = checkRateLimit(`intake:${ip}`, 10, 60 * 1000)
  if (!rl.success) {
    return NextResponse.json(
      { error: 'Too many parse attempts. Please wait a moment.' },
      { status: 429 }
    )
  }

  const body = await request.json()
  const { rawText } = body

  if (!rawText || typeof rawText !== 'string' || rawText.trim().length < 10) {
    return NextResponse.json({ error: 'Please provide raw email text (minimum 10 characters).' }, { status: 400 })
  }

  const results: Record<string, string | number[] | null> = {}
  const confidence: Record<string, 'high' | 'low' | 'missing'> = {}

  // Parent name
  const nameMatch = rawText.match(PATTERNS.parentName)
  results.parentName = clean(nameMatch?.[1]) || null
  confidence.parentName = results.parentName ? 'high' : 'missing'

  // Email
  const emailMatch = rawText.match(PATTERNS.email)
  results.email = clean(emailMatch?.[0]) || null
  confidence.email = results.email ? 'high' : 'missing'

  // Phone
  const phoneMatch = rawText.match(PATTERNS.phone) || rawText.match(PATTERNS.phoneRaw)
  results.phone = clean(phoneMatch?.[1] || phoneMatch?.[0]) || null
  confidence.phone = results.phone ? 'high' : 'missing'

  // Child name
  const childMatch = rawText.match(PATTERNS.childName)
  results.childName = clean(childMatch?.[1]) || null
  confidence.childName = results.childName ? 'high' : 'missing'

  // Age
  const ageMatch = rawText.match(PATTERNS.age)
  results.age = ageMatch ? String(parseInt(ageMatch[1])) : null
  confidence.age = results.age ? 'high' : 'missing'

  // Allergies
  const allergyMatch = rawText.match(PATTERNS.allergies)
  results.allergies = clean(allergyMatch?.[1]) || null
  confidence.allergies = results.allergies ? 'high' : 'low'

  // Weeks
  const weeksMatch = rawText.match(PATTERNS.weeks)
  results.weeks = weeksMatch ? parseWeeks(weeksMatch[1]) : []
  confidence.weeks = (results.weeks as number[]).length > 0 ? 'high' : 'missing'

  // Track
  const trackMatch = rawText.match(PATTERNS.track)
  results.track = trackMatch ? parseTrack(trackMatch[1]) : null
  confidence.track = results.track ? 'high' : 'missing'

  // Referral code
  const refMatch = rawText.match(PATTERNS.referral)
  results.referralCode = clean(refMatch?.[1]) || null
  confidence.referralCode = results.referralCode ? 'high' : 'missing'

  const missingFields = Object.entries(confidence)
    .filter(([, v]) => v === 'missing')
    .map(([k]) => k)

  return NextResponse.json({
    parsed: results,
    confidence,
    missingFields,
    completeness: Math.round(((Object.keys(PATTERNS).length - missingFields.length) / Object.keys(PATTERNS).length) * 100),
  })
}
