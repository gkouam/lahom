import { NextRequest, NextResponse } from 'next/server'
import { LRUCache } from 'lru-cache'

interface RateLimitConfig {
  windowMs: number
  max: number
  message?: string
  skipSuccessfulRequests?: boolean
  keyGenerator?: (req: NextRequest) => string
}

interface RateLimitInfo {
  count: number
  resetAt: number
}

const createRateLimiter = (options: { max: number; ttl: number }) => {
  return new LRUCache<string, RateLimitInfo>({
    max: options.max,
    ttl: options.ttl,
  })
}

const rateLimiters = new Map<string, LRUCache<string, RateLimitInfo>>()

export const getClientId = (req: NextRequest): string => {
  const forwarded = req.headers.get('x-forwarded-for')
  const realIp = req.headers.get('x-real-ip')
  const ip = forwarded?.split(',')[0].trim() || realIp || 'unknown'

  const userAgent = req.headers.get('user-agent') || ''
  const simpleHash = (str: string) => {
    let hash = 0
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i)
      hash = ((hash << 5) - hash) + char
      hash = hash & hash
    }
    return Math.abs(hash).toString(16).padStart(8, '0')
  }

  return `${ip}:${simpleHash(`${ip}:${userAgent}`)}`
}

export const withRateLimit = async (
  req: NextRequest,
  config: RateLimitConfig,
  handler: () => Promise<NextResponse>
): Promise<NextResponse> => {
  const key = config.keyGenerator?.(req) || `${getClientId(req)}:${req.nextUrl.pathname}`
  const limiterKey = `${config.windowMs}:${config.max}`

  let limiter = rateLimiters.get(limiterKey)
  if (!limiter) {
    limiter = createRateLimiter({ max: 10000, ttl: config.windowMs })
    rateLimiters.set(limiterKey, limiter)
  }

  const now = Date.now()
  let info = limiter.get(key)

  if (!info || info.resetAt < now) {
    info = { count: 0, resetAt: now + config.windowMs }
  }

  if (info.count >= config.max) {
    const retryAfter = Math.ceil((info.resetAt - now) / 1000)
    return NextResponse.json(
      { error: config.message || 'Too many requests', retryAfter },
      {
        status: 429,
        headers: {
          'Retry-After': retryAfter.toString(),
          'X-RateLimit-Limit': config.max.toString(),
          'X-RateLimit-Remaining': '0',
          'X-RateLimit-Reset': new Date(info.resetAt).toISOString(),
        },
      }
    )
  }

  const response = await handler()

  if (!config.skipSuccessfulRequests || response.status >= 400) {
    info.count++
    limiter.set(key, info)
  }

  const remaining = Math.max(0, config.max - info.count)
  response.headers.set('X-RateLimit-Limit', config.max.toString())
  response.headers.set('X-RateLimit-Remaining', remaining.toString())
  response.headers.set('X-RateLimit-Reset', new Date(info.resetAt).toISOString())

  return response
}

export const rateLimitConfigs = {
  auth: {
    signin: {
      windowMs: 15 * 60 * 1000,
      max: 5,
      message: 'Too many login attempts. Please try again later.',
    },
    signup: {
      windowMs: 60 * 60 * 1000,
      max: 3,
      message: 'Too many signup attempts. Please try again later.',
    },
    forgotPassword: {
      windowMs: 60 * 60 * 1000,
      max: 3,
      message: 'Too many password reset requests. Please try again later.',
    },
  },
  api: {
    default: {
      windowMs: 60 * 1000,
      max: 60,
      skipSuccessfulRequests: false,
    },
    join: {
      windowMs: 60 * 60 * 1000,
      max: 5,
      message: 'Too many join requests. Please try again later.',
    },
  },
}
