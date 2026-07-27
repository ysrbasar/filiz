import NextAuth from 'next-auth'
import Google from 'next-auth/providers/google'
import Credentials from 'next-auth/providers/credentials'
import bcrypt from 'bcryptjs'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const credentialsSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8).max(72),
})

export const { handlers, auth, signIn, signOut } = NextAuth({
  session: { strategy: 'jwt' },
  pages: {
    signIn: '/giris',
    error: '/giris',
  },
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID ?? '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? '',
    }),
    Credentials({
      name: 'credentials',
      credentials: {
        email: { label: 'E-posta', type: 'email' },
        password: { label: 'Şifre', type: 'password' },
      },
      async authorize(credentials) {
        const parsed = credentialsSchema.safeParse(credentials)
        if (!parsed.success) return null

        const user = await prisma.user.findUnique({
          where: { email: parsed.data.email },
          select: { id: true, name: true, email: true, password: true, role: true, avatar: true, xp: true, city: true },
        })

        if (!user?.password) return null

        const isValid = await bcrypt.compare(parsed.data.password, user.password)
        if (!isValid) return null

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          image: user.avatar,
          xp: user.xp,
          city: user.city,
        }
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account }) {
      // Google ile giriş: kullanıcıyı DB'ye kaydet/güncelle
      if (account?.provider === 'google' && user.email) {
        await prisma.user.upsert({
          where: { email: user.email },
          update: { name: user.name ?? undefined, avatar: user.image ?? undefined },
          create: { email: user.email, name: user.name ?? '', avatar: user.image ?? null },
        })
      }
      return true
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.role = (user as { role?: string }).role
        token.xp = (user as { xp?: number }).xp
        token.city = (user as { city?: string }).city
      }
      // Google girişinde DB'den rol bilgisini çek
      if (!token.role && token.email) {
        const dbUser = await prisma.user.findUnique({
          where: { email: token.email },
          select: { id: true, role: true, xp: true, city: true },
        })
        if (dbUser) {
          token.id = dbUser.id
          token.role = dbUser.role
          token.xp = dbUser.xp
          token.city = dbUser.city ?? undefined
        }
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = (token.id ?? token.sub) as string
        ;(session.user as { role?: string }).role = token.role as string
        ;(session.user as { xp?: number }).xp = token.xp as number
        ;(session.user as { city?: string }).city = token.city as string
      }
      return session
    },
  },
})

export const hashPassword = (password: string) => bcrypt.hash(password, 12)
export const verifyPassword = (password: string, hash: string) => bcrypt.compare(password, hash)

export function sanitizeUser<T extends { password?: string | null; pushToken?: string | null }>(user: T) {
  const { password: _p, pushToken: _pt, ...safe } = user
  return safe
}

export const safeUserSelect = {
  id: true,
  name: true,
  email: true,
  role: true,
  avatar: true,
  city: true,
  region: true,
  xp: true,
  notifications: true,
  createdAt: true,
} as const
