import type { Metadata } from 'next'
import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { GardenDashboard } from '@/components/bahcem/GardenDashboard'

export const metadata: Metadata = {
  title: 'Bahçem | Filiz',
  description: 'Dijital bahçenizi yönetin, büyüme süreçlerini takip edin.',
}

export default async function BahchemPage() {
  const session = await auth()
  if (!session?.user?.id) redirect('/giris?callbackUrl=/bahcem')

  const [plantedSeeds, notifications] = await Promise.all([
    prisma.plantedSeed.findMany({
      where: { userId: session.user.id, isActive: true },
      include: {
        seed: {
          select: {
            id: true, slug: true, name: true, images: true,
            stages: { orderBy: { order: 'asc' } },
          },
        },
        logs: { orderBy: { date: 'desc' }, take: 5 },
      },
      orderBy: { plantedDate: 'desc' },
    }),
    prisma.gardenNotification.findMany({
      where: {
        plantedSeed: { userId: session.user.id },
        sent: false,
        scheduledFor: { gte: new Date() },
      },
      orderBy: { scheduledFor: 'asc' },
      take: 10,
    }),
  ])

  return (
    <GardenDashboard
      user={{ id: session.user.id, name: session.user.name ?? '', xp: (session.user as any).xp ?? 0 }}
      plantedSeeds={plantedSeeds as any}
      notifications={notifications as any}
    />
  )
}
