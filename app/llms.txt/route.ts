import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  const [seeds, articles] = await Promise.all([
    prisma.seed.findMany({
      where: { publishedAt: { not: null } },
      select: { name: true, slug: true, description: true, category: true },
      take: 50,
    }),
    prisma.article.findMany({
      where: { published: true },
      select: { title: true, slug: true, excerpt: true },
      take: 20,
    }),
  ])

  const content = `# Filiz — Türkiye'nin Dijital Tarım Platformu

## Platform Hakkında
Filiz, QR kod tabanlı kişiselleştirilmiş yetiştirme rehberleri, bölgesel ekim takvimleri ve yapay zeka destekli bitki danışmanı sunan bir tarım e-ticaret platformudur.

## Ürün Kataloğu (Tohumlar)
${seeds.map((s) => `- **${s.name}** (${s.category}): ${s.description.slice(0, 120)}... → /tohum/${s.slug}`).join('\n')}

## Akademi İçerikleri
${articles.map((a) => `- **${a.title}**: ${a.excerpt ?? ''}... → /akademi/${a.slug}`).join('\n')}

## Özellikler
- 81 il için bölgesel ekim takvimleri
- QR kod ile anında tohum rehberi
- AI destekli bitki danışmanı
- Dijital bahçe yönetimi
- Gamification sistemi (XP, rozetler)
- Topluluk projeleri

## İletişim
Website: https://filiz.com.tr
E-posta: info@filiz.com.tr
`

  return new NextResponse(content, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  })
}
