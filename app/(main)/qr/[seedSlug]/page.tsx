import { notFound, redirect } from 'next/navigation'
import type { Metadata } from 'next'
import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth'
import { QRLanding } from '@/components/qr/QRLanding'

interface Props {
  params: Promise<{ seedSlug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { seedSlug } = await params
  const seed = await prisma.seed.findUnique({
    where: { slug: seedSlug },
    select: { name: true, seoDescription: true },
  })
  if (!seed) return { title: 'Tohum Bulunamadı' }
  return {
    title: `${seed.name} — QR Rehberiniz | Filiz`,
    description: seed.seoDescription ?? `${seed.name} için kişiselleştirilmiş yetiştirme rehberi.`,
  }
}

export default async function QRPage({ params }: Props) {
  const { seedSlug } = await params
  const [seed, session] = await Promise.all([
    prisma.seed.findUnique({
      where: { slug: seedSlug, publishedAt: { not: null } },
      include: {
        stages: { orderBy: { order: 'asc' } },
        regionCalendars: true,
        faqs: true,
      },
    }),
    auth(),
  ])

  if (!seed) notFound()

  const userId = session?.user?.id ?? null
  const plantedSeed = userId
    ? await prisma.plantedSeed.findFirst({
        where: { userId, seedId: seed.id },
        select: { id: true, currentStageOrder: true },
      })
    : null

  return (
    <QRLanding
      seed={seed}
      userId={userId}
      plantedSeed={plantedSeed}
    />
  )
}
