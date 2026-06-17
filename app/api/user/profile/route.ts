import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'

export async function PATCH(req: NextRequest) {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json()
  const { name, city, region, notifications, currentPassword, newPassword } = body

  const updateData: Record<string, unknown> = {}

  if (name !== undefined) updateData.name = name.trim() || null
  if (city !== undefined) updateData.city = city || null
  if (region !== undefined) updateData.region = region || null
  if (notifications !== undefined) updateData.notifications = Boolean(notifications)

  if (newPassword) {
    if (!currentPassword) {
      return NextResponse.json({ error: 'Mevcut şifre gerekli' }, { status: 400 })
    }
    const user = await prisma.user.findUnique({ where: { id: session.user.id }, select: { password: true } })
    if (!user?.password) {
      return NextResponse.json({ error: 'Şifre değiştirme desteklenmiyor' }, { status: 400 })
    }
    const valid = await bcrypt.compare(currentPassword, user.password)
    if (!valid) {
      return NextResponse.json({ error: 'Mevcut şifre yanlış' }, { status: 400 })
    }
    updateData.password = await bcrypt.hash(newPassword, 12)
  }

  const updated = await prisma.user.update({
    where: { id: session.user.id },
    data: updateData,
    select: { id: true, name: true, email: true, city: true, region: true, notifications: true },
  })

  return NextResponse.json({ user: updated })
}
