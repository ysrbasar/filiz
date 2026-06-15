import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { requireAuth } from '@/lib/auth-guard'
import { rateLimit } from '@/lib/rate-limit'

const schema = z.object({
  seedId: z.string().cuid(),
  city: z.string().max(100).optional(),
  notes: z.string().max(200).optional(),
})

export async function POST(req: NextRequest) {
  const auth = await requireAuth(req)
  if (auth instanceof NextResponse) return auth

  const limitRes = rateLimit(req, 'api')
  if (limitRes) return limitRes

  const body = await req.json().catch(() => null)
  const parsed = schema.safeParse(body)
  if (!parsed.success) return NextResponse.json({ error: 'Geçersiz veri.' }, { status: 400 })

  const { seedId, city, notes } = parsed.data

  const seed = await prisma.seed.findUnique({ where: { id: seedId }, select: { id: true } })
  if (!seed) return NextResponse.json({ error: 'Tohum bulunamadı.' }, { status: 404 })

  const existing = await prisma.plantedSeed.findFirst({ where: { userId: auth.userId, seedId } })
  if (existing) return NextResponse.json({ id: existing.id }, { status: 200 })

  const planted = await prisma.plantedSeed.create({
    data: {
      userId: auth.userId,
      seedId,
      notes: notes ?? null,
      city: city ?? null,
      plantedDate: new Date(),
      currentStageOrder: 0,
    },
  })

  await Promise.all([
    prisma.activityLog.create({
      data: {
        userId: auth.userId,
        type: 'PLANT',
        xpEarned: 10,
        metadata: { plantedSeedId: planted.id, seedId },
      },
    }),
    prisma.user.update({
      where: { id: auth.userId },
      data: { xp: { increment: 10 } },
    }),
  ])

  return NextResponse.json({ id: planted.id }, { status: 201 })
}
