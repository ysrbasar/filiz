import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import { Sprout, ShoppingBag, Users, Package, BarChart3, ArrowRight } from 'lucide-react'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Admin Panel | Filiz' }

export default async function AdminPage() {
  const session = await auth()
  if (!session?.user || (session.user as any).role !== 'ADMIN') redirect('/')

  const [seedCount, orderCount, userCount, productCount] = await Promise.all([
    prisma.seed.count(),
    prisma.order.count(),
    prisma.user.count(),
    prisma.product.count(),
  ])

  const recentOrders = await prisma.order.findMany({
    orderBy: { createdAt: 'desc' },
    take: 5,
    select: {
      id: true, status: true, total: true, createdAt: true,
      user: { select: { name: true, email: true } },
    },
  })

  const stats = [
    { label: 'Tohumlar', value: seedCount, icon: Sprout, href: '/admin/tohumlar', color: 'bg-primary-100 text-primary-600' },
    { label: 'Siparişler', value: orderCount, icon: ShoppingBag, href: '/admin/siparisler', color: 'bg-amber-100 text-amber-600' },
    { label: 'Kullanıcılar', value: userCount, icon: Users, href: '/admin/kullanicilar', color: 'bg-sky-100 text-sky-600' },
    { label: 'Ürünler', value: productCount, icon: Package, href: '/admin/urunler', color: 'bg-earth-100 text-earth-400' },
  ]

  const STATUS_LABELS: Record<string, string> = {
    PENDING: 'Bekliyor',
    CONFIRMED: 'Onaylandı',
    PREPARING: 'Hazırlanıyor',
    SHIPPED: 'Kargoda',
    DELIVERED: 'Teslim Edildi',
    CANCELLED: 'İptal',
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <h1 className="font-display text-xl font-bold text-text-primary">Admin Panel</h1>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        {/* İstatistikler */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {stats.map(({ label, value, icon: Icon, href, color }) => (
            <Link
              key={href}
              href={href}
              className="bg-white rounded-2xl p-5 border border-gray-100 hover:shadow-md transition-all group"
            >
              <div className={`w-10 h-10 rounded-xl ${color} flex items-center justify-center mb-3`}>
                <Icon className="w-5 h-5" />
              </div>
              <p className="text-2xl font-bold text-text-primary">{value}</p>
              <p className="text-sm text-text-secondary flex items-center gap-1 group-hover:text-primary-600">
                {label} <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
              </p>
            </Link>
          ))}
        </div>

        {/* Son Siparişler */}
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
            <h2 className="font-semibold text-text-primary flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-primary-500" />
              Son Siparişler
            </h2>
            <Link href="/admin/siparisler" className="text-xs text-primary-600 hover:underline">
              Tümünü Gör →
            </Link>
          </div>
          <div className="divide-y divide-gray-50">
            {recentOrders.length === 0 ? (
              <p className="text-center py-8 text-text-secondary text-sm">Henüz sipariş yok.</p>
            ) : (
              recentOrders.map((order) => (
                <div key={order.id} className="px-6 py-4 flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-text-primary">{order.user.name ?? order.user.email}</p>
                    <p className="text-xs text-text-secondary">
                      {new Date(order.createdAt).toLocaleDateString('tr-TR')}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${
                      order.status === 'DELIVERED' ? 'bg-primary-100 text-primary-700' :
                      order.status === 'CANCELLED' ? 'bg-red-100 text-red-600' :
                      'bg-amber-100 text-amber-700'
                    }`}>
                      {STATUS_LABELS[order.status] ?? order.status}
                    </span>
                    <span className="text-sm font-bold text-text-primary">{order.total.toFixed(2)} ₺</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
