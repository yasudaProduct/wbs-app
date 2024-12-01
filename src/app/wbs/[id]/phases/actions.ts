'use server'

import prisma from '@/lib/prisma'

export async function addPhase(wbsId: number, name: string, phaseTemplateId: number | null) {
  const lastPhase = await prisma.wbsPhase.findFirst({
    where: { wbsId },
    orderBy: { seq: 'desc' },
  })

  const seq = lastPhase ? lastPhase.seq + 1 : 1

  return prisma.wbsPhase.create({
    data: {
      name,
      wbsId,
      phaseTemplateId,
      seq,
      isTemplateBased: phaseTemplateId === null,
    },
  })
}

export async function updatePhase(wbsId: number, phaseId: number, name: string) {
  return prisma.wbsPhase.update({
    where: { id: phaseId, wbsId },
    data: { name },
  })
}

export async function deletePhase(wbsId: number, phaseId: number) {
  return prisma.wbsPhase.delete({
    where: { id: phaseId, wbsId },
  })
}