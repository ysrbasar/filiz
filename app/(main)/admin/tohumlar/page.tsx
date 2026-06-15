import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import Image from 'next/image'
import { Plus, Pencil, Eye, Sprout } from 'lucide-react'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Tohumlar — Admin | Filiz' }

export default async function AdminTohumlarPage() {
  const session = await auth()
  if (!session?.user || (session.user as any).role !== 'ADMIN') redirect('/')

  const seeds = await prisma.seed.findMany({
    orderBy: { createdAt: 'desc' },
    select: {
      id: true, slug: true, name: true, category: true,
      price: true, stock: true, images: true, featured: true,
      publishedAt: true, _count: { select: { plantedBy: true } },
    },
  })

  const CATEGORY_LABELS: Record<string, string> = {
    VEGETABLE: 'Sebze', FRUIT: 'Meyve', HERB: 'Bitki/Ot',
    FLOWER: 'Çiçek', TREE: 'Ağaç', OTHER: 'Diğer',
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
        <div>
          <Link href="/admin" className="text-xs text-text-secondary hover:text-primary-600">← Admin</Link>
          <h1 className="font-display text-xl font-bold text-text-primary mt-0.5">Tohumlar</h1>
        </div>
        <Link
          href="/admin/tohumlar/yeni"
          className="flex items-center gap-2 bg-primary-500 text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-primary-600 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Yeni Tohum
        </Link>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6">
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100 text-xs text-text-secondary uppercase tracking-wide">
                <th className="text-left px-6 py-3">Tohum</th>
                <th className="text-left px-4 py-3 hidden sm:table-cell">Kategori</th>
                <th className="text-right px-4 py-3">Fiyat</th>
                <th className="text-right px-4 py-3 hidden md:table-cell">Stok</th>
                <th className="text-right px-4 py-3 hidden md:table-cell">Yetiştiren</th>
                <th className="text-center px-4 py-3">Durum</th>
                <th className="text-right px-6 py-3">İşlem</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {seeds.map((seed) => (
                <tr key={seed.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg overflow-hidden bg-primary-50 shrink-0">
                        {seed.images[0] ? (
                          <Image src={seed.images[0]} alt={seed.name} width={40} height={40} className="object-cover w-full h-full" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <Sprout className="w-5 h-5 text-primary-300" />
                          </div>
                        )}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-text-primary">{seed.name}</p>
                        <p className="text-xs text-text-secondary">{seed.slug}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4 hidden sm:table-cell">
                    <span className="text-xs bg-primary-50 text-primary-600 px-2 py-1 rounded-lg font-medium">
                      {CATEGORY_LABELS[seed.category] ?? seed.category}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-right text-sm font-medium">{seed.price.toFixed(2)} ₺</td>
                  <td className="px-4 py-4 text-right hidden md:table-cell">
                    <span className={`text-sm font-medium ${seed.stock < 10 ? 'text-red-600' : 'text-text-primary'}`}>
                      {seed.stock}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-right hidden md:table-cell text-sm text-text-secondary">
                    {seed._count.plantedBy}
                  </td>
                  <td className="px-4 py-4 text-center">
                    <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                      seed.publishedAt ? 'bg-primary-100 text-primary-700' : 'bg-gray-100 text-gray-500'
                    }`}>
                      {seed.publishedAt ? 'Yayında' : 'Taslak'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Link href={`/tohum/${seed.slug}`} className="p-1.5 text-text-secondary hover:text-primary-600 transition-colors" title="Görüntüle">
                        <Eye className="w-4 h-4" />
                      </Link>
                      <Link href={`/admin/tohumlar/${seed.id}`} className="p-1.5 text-text-secondary hover:text-primary-600 transition-colors" title="Düzenle">
                        <Pencil className="w-4 h-4" />
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
