import { NextRequest, NextResponse } from 'next/server'

const rateLimitMap = new Map<string, { count: number; resetAt: number }>()

const LIMITS = {
  auth:   { windowMs: 15 * 60 * 1000, maxRequests: 5  },
  ai:     { windowMs: 60 * 60 * 1000, maxRequests: 10 },
  api:    { windowMs:  1 * 60 * 1000, maxRequests: 60 },
  upload: { windowMs:  1 * 60 * 1000, maxRequests: 5  },
  orders: { windowMs: 60 * 60 * 1000, maxRequests: 20 },
} as const

type LimitKey = keyof typeof LIMITS

export function rateLimit(req: NextRequest, type: LimitKey): NextResponse | null {
  const ip =
    req.headers.get('x-forwarded-for')?.split(',')[0] ??
    req.headers.get('x-real-ip') ??
    '127.0.0.1'

  const key    = `${type}:${ip}`
  const config = LIMITS[type]
  const now    = Date.now()
  const entry  = rateLimitMap.get(key)

  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(key, { count: 1, resetAt: now + config.windowMs })
    return null
  }

  if (entry.count >= config.maxRequests) {
    return NextResponse.json(
      { error: 'Çok fazla istek. Lütfen bekleyin.' },
      {
        status: 429,
        headers: {
          'Retry-After':           String(Math.ceil((entry.resetAt - now) / 1000)),
          'X-RateLimit-Limit':     String(config.maxRequests),
          'X-RateLimit-Remaining': '0',
        },
      }
    )
  }

  entry.count++
  return null
}
