import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { AyarlarClient } from '@/components/profil/AyarlarClient'

export const metadata: Metadata = { title: 'Profil Ayarları | Filiz' }

export default async function AyarlarPage() {
  const session = await auth()
  if (!session?.user?.id) redirect('/giris?callbackUrl=/profil/ayarlar')

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: {
      id: true, name: true, email: true,
      city: true, region: true, notifications: true,
      password: true,
    },
  })

  if (!user) redirect('/')

  return (
    <AyarlarClient
      user={{
        id: user.id,
        name: user.name,
        email: user.email,
        city: user.city,
        region: user.region,
        notifications: user.notifications,
        hasPassword: !!user.password,
      }}
    />
  )
}
