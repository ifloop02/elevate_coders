// lib/ratelimit.ts — Lightweight in-memory rate limiter
//
// ⚠️  PER-INSTANCE NOTE: Vercel serverless functions may run across multiple
// concurrent instances, each with their own memory. This means rate limit
// counters are not shared globally. For a low-traffic camp registration site
// this is sufficient — it blocks accidental double-submissions and basic abuse.
//
// To upgrade to GLOBAL rate limiting (e.g. for high-traffic scenarios):
//   1. Install: npm install @upstash/ratelimit @upstash/redis
//   2. Set UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN in Vercel env vars
//   3. Replace checkRateLimit() calls with the Upstash SDK

interface RateEntry {
  count: number
  resetAt: number
}

const store = new Map<string, RateEntry>()

export interface RateLimitResult {
  success: boolean
  remaining: number
  reset: number // Unix timestamp (ms) when the window resets
}

/**
 * Check whether a given key is within its rate limit.
 * @param key       Unique identifier — typically `"route:ip"` e.g. `"register:192.168.1.1"`
 * @param limit     Maximum allowed requests in the window
 * @param windowMs  Time window in milliseconds
 */
export function checkRateLimit(
  key: string,
  limit: number,
  windowMs: number
): RateLimitResult {
  const now = Date.now()
  const entry = store.get(key)

  // Probabilistic cleanup: ~1% of calls sweep expired keys to prevent unbounded growth
  if (Math.random() < 0.01) {
    for (const [k, e] of store.entries()) {
      if (e.resetAt <= now) store.delete(k)
    }
  }

  if (!entry || entry.resetAt <= now) {
    // New window
    const resetAt = now + windowMs
    store.set(key, { count: 1, resetAt })
    return { success: true, remaining: limit - 1, reset: resetAt }
  }

  if (entry.count >= limit) {
    return { success: false, remaining: 0, reset: entry.resetAt }
  }

  entry.count += 1
  return { success: true, remaining: limit - entry.count, reset: entry.resetAt }
}

/** Extract the client IP from Next.js request headers (Vercel sets x-forwarded-for) */
export function getClientIP(request: Request): string {
  const forwarded = (request.headers as Headers).get('x-forwarded-for')
  if (forwarded) return forwarded.split(',')[0].trim()
  return 'unknown'
}
