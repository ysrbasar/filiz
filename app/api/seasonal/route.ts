import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const month = parseInt(searchParams.get('month') ?? String(new Date().getMonth() + 1))
  const city = searchParams.get('city')

  if (isNaN(month) || month < 1 || month > 12) {
    return NextResponse.json({ error: 'Geçersiz ay.' }, { status: 400 })
  }

  const where = city
    ? { plantingMonths: { has: month }, city }
    : { plantingMonths: { has: month } }

  const calendars = await prisma.regionCalendar.findMany({
    where,
    distinct: ['seedId'],
    take: 6,
    include: {
      seed: {
        select: { id: true, slug: true, name: true, images: true, price: true, publishedAt: true },
      },
    },
  })

  const seeds = calendars
    .map((c) => c.seed)
    .filter((s) => s !== null && s.publishedAt !== null)

  return NextResponse.json({ seeds, month, city }, {
    headers: { 'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400' },
  })
}
