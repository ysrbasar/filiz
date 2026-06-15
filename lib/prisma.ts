import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import { Pool } from 'pg'

declare global {
  // eslint-disable-next-line no-var
  var __prismaPool: Pool | undefined
  // eslint-disable-next-line no-var
  var __prisma: PrismaClient | undefined
}

function getPool(): Pool {
  if (!globalThis.__prismaPool) {
    globalThis.__prismaPool = new Pool({
      connectionString: process.env.DATABASE_URL,
      max: 5,
      idleTimeoutMillis: 30_000,
      connectionTimeoutMillis: 5_000,
      keepAlive: true,
    })

    globalThis.__prismaPool.on('error', (err) => {
      console.error('[prisma pool error]', err.message)
    })
  }
  return globalThis.__prismaPool
}

function createPrismaClient(): PrismaClient {
  const pool = getPool()
  // noPreparedStatements prevents 08P01 errors from concurrent queries
  const adapter = new PrismaPg(pool, { noPreparedStatements: true } as any)
  return new PrismaClient({
    adapter,
    log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
  })
}

export const prisma: PrismaClient = globalThis.__prisma ?? createPrismaClient()

if (process.env.NODE_ENV !== 'production') {
  globalThis.__prisma = prisma
}
