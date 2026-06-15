import { prisma } from '@/lib/prisma'

export async function assertOwnsPlantedSeed(id: string, userId: string): Promise<boolean> {
  const record = await prisma.plantedSeed.findFirst({
    where: { id, userId },
    select: { id: true },
  })
  return record !== null
}

export async function assertOwnsOrder(id: string, userId: string): Promise<boolean> {
  const record = await prisma.order.findFirst({
    where: { id, userId },
    select: { id: true },
  })
  return record !== null
}

export async function assertOwnsProject(id: string, userId: string): Promise<boolean> {
  const record = await prisma.project.findFirst({
    where: { id, userId },
    select: { id: true },
  })
  return record !== null
}
