import { cache } from 'react'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { prisma } from '@/lib/prisma'
import { SeedDetailClient } from '@/components/tohum/SeedDetailClient'

interface Props {
  params: Promise<{ slug: string }>
}

const getSeed = cache(async (slug: string) => {
  return prisma.seed.findUnique({
    where: { slug, publishedAt: { not: null } },
    include: {
      stages: { orderBy: { order: 'asc' } },
      monthlyTasks: { orderBy: [{ month: 'asc' }, { priority: 'desc' }] },
      regionCalendars: true,
      diseases: true,
      faqs: true,
      relatedProducts: {
        include: { product: { select: { id: true, name: true, price: true, images: true, slug: true } } },
      },
    },
  })
})

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const seed = await getSeed(slug)
  if (!seed) return { title: 'Tohum Bulunamadı' }
  return {
    title: seed.seoTitle ?? `${seed.name} Tohumu | Filiz`,
    description: seed.seoDescription ?? seed.description.slice(0, 160),
    openGraph: {
      title: seed.name,
      description: seed.description.slice(0, 160),
      images: seed.images[0] ? [{ url: seed.images[0] }] : [],
    },
  }
}

export default async function SeedDetailPage({ params }: Props) {
  const { slug } = await params
  const seed = await getSeed(slug)
  if (!seed) notFound()

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: seed.name,
    description: seed.description,
    image: seed.images,
    sku: seed.id,
    brand: { '@type': 'Brand', name: 'Filiz' },
    offers: {
      '@type': 'Offer',
      price: seed.price.toFixed(2),
      priceCurrency: 'TRY',
      availability: seed.stock > 0 ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
      seller: { '@type': 'Organization', name: 'Filiz' },
    },
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <SeedDetailClient seed={seed} />
    </>
  )
}
