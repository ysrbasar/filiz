import { auth } from '@/lib/auth'
import { NextRequest, NextResponse } from 'next/server'

type Role = 'USER' | 'ADMIN' | 'MODERATOR'

export async function requireAuth(
  _req: NextRequest,
  requiredRole?: Role
): Promise<{ userId: string; role: Role } | NextResponse> {
  const session = await auth()

  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Oturum açmanız gerekiyor' }, { status: 401 })
  }

  const userRole = (session.user as { role?: string }).role as Role | undefined

  if (requiredRole && userRole !== requiredRole) {
    if (requiredRole === 'ADMIN' && userRole !== 'ADMIN') {
      return NextResponse.json({ error: 'Bu işlem için admin yetkisi gerekiyor' }, { status: 403 })
    }
  }

  return { userId: session.user.id, role: userRole ?? 'USER' }
}
