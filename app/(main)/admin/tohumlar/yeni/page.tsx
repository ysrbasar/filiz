import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import type { Metadata } from 'next'
import { SeedForm } from '@/components/admin/SeedForm'
import Link from 'next/link'

export const metadata: Metadata = { title: 'Yeni Tohum — Admin | Filiz' }

export default async function NewSeedPage() {
  const session = await auth()
  if (!session?.user || (session.user as any).role !== 'ADMIN') redirect('/')

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <Link href="/admin/tohumlar" className="text-xs text-text-secondary hover:text-primary-600">← Tohumlar</Link>
        <h1 className="font-display text-xl font-bold text-text-primary mt-0.5">Yeni Tohum Ekle</h1>
      </div>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
        <SeedForm />
      </div>
    </div>
  )
}
