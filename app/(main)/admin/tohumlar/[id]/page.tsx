import { auth } from '@/lib/auth'
import { redirect, notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { prisma } from '@/lib/prisma'
import { SeedForm } from '@/components/admin/SeedForm'
import Link from 'next/link'

export const metadata: Metadata = { title: 'Tohum Düzenle — Admin | Filiz' }

export default async function EditSeedPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await auth()
  if (!session?.user || (session.user as any).role !== 'ADMIN') redirect('/')

  const { id } = await params
  const seed = await prisma.seed.findUnique({
    where: { id },
    include: {
      stages: { orderBy: { order: 'asc' } },
      monthlyTasks: { orderBy: [{ month: 'asc' }] },
      regionCalendars: true,
      faqs: { orderBy: { order: 'asc' } },
    },
  })
  if (!seed) notFound()

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <Link href="/admin/tohumlar" className="text-xs text-text-secondary hover:text-primary-600">← Tohumlar</Link>
        <h1 className="font-display text-xl font-bold text-text-primary mt-0.5">
          Düzenle: {seed.name}
        </h1>
      </div>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
        <SeedForm seed={seed as any} />
      </div>
    </div>
  )
}
