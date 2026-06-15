import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { rateLimit } from '@/lib/rate-limit'
import { sanitizeInput } from '@/lib/utils/sanitize'

const schema = z.object({
  name: z.string().min(2).max(80),
  email: z.string().email().max(200),
  password: z.string().min(8).max(128),
  city: z.string().max(100).optional(),
})

export async function POST(req: NextRequest) {
  const limitRes = rateLimit(req, 'auth')
  if (limitRes) return limitRes

  const body = await req.json().catch(() => null)
  const parsed = schema.safeParse(body)
  if (!parsed.success) return NextResponse.json({ error: 'Geçersiz veri.' }, { status: 400 })

  const { name, email, password, city } = parsed.data

  const exists = await prisma.user.findUnique({ where: { email: email.toLowerCase() }, select: { id: true } })
  if (exists) return NextResponse.json({ error: 'Bu e-posta zaten kayıtlı.' }, { status: 409 })

  const hashed = await bcrypt.hash(password, 12)
  await prisma.user.create({
    data: {
      name: sanitizeInput(name, 80),
      email: email.toLowerCase(),
      password: hashed,
      city: city ? sanitizeInput(city, 100) : null,
    },
  })

  return NextResponse.json({ ok: true }, { status: 201 })
}
