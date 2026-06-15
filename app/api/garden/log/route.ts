import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { requireAuth } from '@/lib/auth-guard'
import { rateLimit } from '@/lib/rate-limit'

const schema = z.object({
  plantedSeedId: z.string().cuid(),
  type: z.enum(['PLANTING','WATERING','FERTILIZING','HARVESTING','PRUNING','TREATING','CHECKING','REPOTTING']),
  note: z.string().max(1000).optional(),
  weather: z.string().max(100).optional(),
})

export async function POST(req: NextRequest) {
  const auth = await requireAuth(req)
  if (auth instanceof NextResponse) return auth

  const limitRes = rateLimit(req, 'api')
  if (limitRes) return limitRes

  const body = await req.json().catch(() => null)
  const parsed = schema.safeParse(body)
  if (!parsed.success) return NextResponse.json({ error: 'Geçersiz veri.' }, { status: 400 })

  const { plantedSeedId, type, note, weather } = parsed.data

  // Kullanıcının bitkisi olduğunu doğrula
  const plant = await prisma.plantedSeed.findFirst({ where: { id: plantedSeedId, userId: auth.userId } })
  if (!plant) return NextResponse.json({ error: 'Bitki bulunamadı.' }, { status: 404 })

  const log = await prisma.gardenLog.create({
    data: { plantedSeedId, type, note: note ?? null, weather: weather ?? null, date: new Date() },
  })

  // Günlük kaydı için XP
  await Promise.all([
    prisma.activityLog.create({
      data: { userId: auth.userId, type: 'LOG_ENTRY', xpEarned: 5, metadata: { logId: log.id } },
    }),
    prisma.user.update({ where: { id: auth.userId }, data: { xp: { increment: 5 } } }),
  ])

  return NextResponse.json({ log }, { status: 201 })
}
