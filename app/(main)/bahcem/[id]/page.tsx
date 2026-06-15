import { notFound, redirect } from 'next/navigation'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { PlantDetail } from '@/components/bahcem/PlantDetail'

interface Props {
  params: Promise<{ id: string }>
}

export default async function PlantDetailPage({ params }: Props) {
  const { id } = await params
  const session = await auth()
  if (!session?.user?.id) redirect('/giris?callbackUrl=/bahcem')

  const plant = await prisma.plantedSeed.findFirst({
    where: { id, userId: session.user.id },
    include: {
      seed: {
        include: {
          stages: { orderBy: { order: 'asc' } },
          monthlyTasks: { orderBy: { month: 'asc' } },
        },
      },
      logs: { orderBy: { date: 'desc' }, take: 20 },
      notifications: { where: { sent: false }, orderBy: { scheduledFor: 'asc' } },
    },
  })

  if (!plant) notFound()

  return <PlantDetail plant={plant as any} userId={session.user.id} />
}
