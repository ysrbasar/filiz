import { redirect } from 'next/navigation'
import type { Metadata } from 'next'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { ProfilClient } from '@/components/profil/ProfilClient'

export const metadata: Metadata = { title: 'Profilim | Filiz' }

export default async function ProfilPage() {
  const session = await auth()
  if (!session?.user?.id) redirect('/giris?callbackUrl=/profil')

  const [user, orders, badges, activity] = await Promise.all([
    prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        id: true, name: true, email: true, avatar: true,
        city: true, region: true, xp: true, notifications: true,
        createdAt: true,
        _count: { select: { garden: true, orders: true, projects: true } },
      },
    }),
    prisma.order.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: 'desc' },
      take: 10,
      select: {
        id: true, status: true, total: true, createdAt: true, trackingNumber: true,
        items: {
          select: {
            quantity: true, price: true,
            seed: { select: { name: true, images: true } },
            product: { select: { name: true, images: true } },
          },
        },
      },
    }),
    prisma.userBadge.findMany({
      where: { userId: session.user.id },
      include: { badge: true },
      orderBy: { earnedAt: 'desc' },
    }),
    prisma.activityLog.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: 'desc' },
      take: 20,
      select: { id: true, type: true, xpEarned: true, createdAt: true, metadata: true },
    }),
  ])

  if (!user) redirect('/')

  return (
    <ProfilClient
      user={user as any}
      orders={orders as any}
      badges={badges as any}
      activity={activity as any}
    />
  )
}
