import type { Metadata } from 'next'
import { prisma } from '@/lib/prisma'
import { SeedCard } from '@/components/seed/SeedCard'

export const metadata: Metadata = {
  title: 'Tohumlar | Filiz',
  description: '200+ çeşit organik tohum. Bölgesel ekim takvimleri, kişisel büyüme rehberleri ve QR kod desteğiyle.',
}

export default async function TohumlarPage() {
  const seeds = await prisma.seed.findMany({
    where: { publishedAt: { not: null } },
    orderBy: [{ featured: 'desc' }, { createdAt: 'desc' }],
    select: {
      id: true, slug: true, name: true, scientificName: true,
      price: true, images: true, category: true,
      difficulty: true, waterNeeds: true, sunlight: true, featured: true,
    },
  })

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-10">
          <span className="text-sm font-semibold text-primary-500 uppercase tracking-wider block mb-2">
            Tohum Koleksiyonu
          </span>
          <h1 className="font-display text-4xl font-bold text-text-primary">Tüm Tohumlar</h1>
          <p className="text-text-secondary mt-2">{seeds.length} çeşit tohum</p>
        </div>

        {seeds.length === 0 ? (
          <div className="text-center py-20 text-text-secondary">
            <p>Henüz tohum eklenmemiş.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {seeds.map((seed) => (
              <SeedCard
                key={seed.id}
                id={seed.id}
                slug={seed.slug}
                name={seed.name}
                scientificName={seed.scientificName}
                price={seed.price}
                image={seed.images[0] ?? ''}
                category={seed.category}
                difficulty={seed.difficulty}
                waterNeeds={seed.waterNeeds}
                sunlight={seed.sunlight}
                featured={seed.featured}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
