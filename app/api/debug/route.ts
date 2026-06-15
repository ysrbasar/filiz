import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  const url = process.env.DATABASE_URL?.slice(0, 50) ?? 'UNDEFINED'
  try {
    const count = await prisma.seed.count()
    return NextResponse.json({ status: 'ok', url, seedCount: count })
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message.slice(0, 200) : String(e)
    return NextResponse.json({ status: 'error', url, error: msg }, { status: 500 })
  }
}
