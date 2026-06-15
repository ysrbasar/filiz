import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAuth } from '@/lib/auth-guard'

async function requireAdmin(req: NextRequest) {
  const auth = await requireAuth(req)
  if (auth instanceof NextResponse) return auth
  if (auth.role !== 'ADMIN') return NextResponse.json({ error: 'Yetkisiz.' }, { status: 403 })
  return auth
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = await requireAdmin(req)
  if (auth instanceof NextResponse) return auth

  const { id } = await params
  const body = await req.json().catch(() => null)
  if (!body) return NextResponse.json({ error: 'Geçersiz veri.' }, { status: 400 })

  const { stages, monthlyTasks, regionCalendars, faqs, publishedAt, ...seedData } = body

  await prisma.$transaction([
    // Mevcut alt tabloları sil, yeniden oluştur
    prisma.growthStage.deleteMany({ where: { seedId: id } }),
    prisma.monthlyTask.deleteMany({ where: { seedId: id } }),
    prisma.regionCalendar.deleteMany({ where: { seedId: id } }),
    prisma.seedFAQ.deleteMany({ where: { seedId: id } }),
    prisma.seed.update({
      where: { id },
      data: {
        ...seedData,
        publishedAt: publishedAt ? new Date(publishedAt) : null,
        stages:          { create: stages ?? [] },
        monthlyTasks:    { create: monthlyTasks ?? [] },
        regionCalendars: { create: regionCalendars ?? [] },
        faqs:            { create: faqs ?? [] },
      },
    }),
  ])

  return NextResponse.json({ id })
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = await requireAdmin(req)
  if (auth instanceof NextResponse) return auth

  const { id } = await params
  await prisma.seed.delete({ where: { id } })
  return NextResponse.json({ ok: true })
}
