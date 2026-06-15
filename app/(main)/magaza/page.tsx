import type { Metadata } from 'next'
import { prisma } from '@/lib/prisma'
import { ShopClient } from '@/components/shop/ShopClient'

export const metadata: Metadata = {
  title: 'Mağaza | Filiz',
  description: 'Organik tohumlar, fideler, gübreler ve bahçe ekipmanları. Doğal tarım için her şey.',
}

export default async function MagazaPage() {
  const [products, seeds] = await Promise.all([
    prisma.product.findMany({
      where: { publishedAt: { not: null } },
      orderBy: [{ featured: 'desc' }, { createdAt: 'desc' }],
    }),
    prisma.seed.findMany({
      where: { publishedAt: { not: null } },
      orderBy: [{ featured: 'desc' }, { createdAt: 'desc' }],
      select: {
        id: true, slug: true, name: true, scientificName: true,
        price: true, images: true, category: true,
        difficulty: true, waterNeeds: true, sunlight: true, featured: true,
        stock: true,
      },
    }),
  ])

  return <ShopClient products={products} seeds={seeds} />
}
