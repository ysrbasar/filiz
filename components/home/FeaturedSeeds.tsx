import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { prisma } from '@/lib/prisma'
import { SeedCard } from '@/components/seed/SeedCard'

async function getFeaturedSeeds() {
  return prisma.seed.findMany({
    where: { featured: true, publishedAt: { not: null } },
    take: 6,
    orderBy: { createdAt: 'desc' },
    select: {
      id: true, slug: true, name: true, scientificName: true,
      price: true, images: true, category: true,
      difficulty: true, waterNeeds: true, sunlight: true, featured: true,
    },
  })
}

export async function FeaturedSeeds() {
  const seeds = await getFeaturedSeeds()

  if (seeds.length === 0) return null

  return (
    <section className="py-20 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-10">
          <div>
            <span className="text-sm font-semibold text-primary-500 uppercase tracking-wider block mb-2">
              Öne Çıkan Tohumlar
            </span>
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-text-primary">
              Bu Sezonun Favorileri
            </h2>
          </div>
          <Link
            href="/tohum"
            className="hidden sm:flex items-center gap-1 text-sm font-medium text-primary-600 hover:text-primary-500 transition-colors"
          >
            Tümünü Gör
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {seeds.map((seed) => (
            <SeedCard
              key={seed.id}
              id={seed.id}
              slug={seed.slug}
              name={seed.name}
              scientificName={seed.scientificName}
              price={seed.price}
              image={seed.images[0] ?? 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400'}
              category={seed.category}
              difficulty={seed.difficulty}
              waterNeeds={seed.waterNeeds}
              sunlight={seed.sunlight}
              featured={seed.featured}
            />
          ))}
        </div>

        <div className="mt-8 text-center sm:hidden">
          <Link
            href="/tohum"
            className="inline-flex items-center gap-1 text-sm font-medium text-primary-600 underline underline-offset-4"
          >
            Tüm tohumları gör
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  )
}
