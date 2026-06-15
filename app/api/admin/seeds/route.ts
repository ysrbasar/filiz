import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAuth } from '@/lib/auth-guard'

async function requireAdmin(req: NextRequest) {
  const auth = await requireAuth(req)
  if (auth instanceof NextResponse) return auth
  if (auth.role !== 'ADMIN') return NextResponse.json({ error: 'Yetkisiz.' }, { status: 403 })
  return auth
}

export async function POST(req: NextRequest) {
  const auth = await requireAdmin(req)
  if (auth instanceof NextResponse) return auth

  const body = await req.json().catch(() => null)
  if (!body?.name || !body?.slug) return NextResponse.json({ error: 'Eksik alan.' }, { status: 400 })

  const { stages, monthlyTasks, regionCalendars, faqs, publishedAt, ...seedData } = body

  const seed = await prisma.seed.create({
    data: {
      ...seedData,
      publishedAt: publishedAt ? new Date(publishedAt) : null,
      stages:          { create: stages ?? [] },
      monthlyTasks:    { create: monthlyTasks ?? [] },
      regionCalendars: { create: regionCalendars ?? [] },
      faqs:            { create: faqs ?? [] },
    },
  })

  return NextResponse.json({ id: seed.id }, { status: 201 })
}
