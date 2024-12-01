import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function POST(request: Request, { params }: { params: { id: string } }) {
  const body = await request.json()
  const { name, phaseTemplateId } = body

  try {
    const phase = await prisma.wbsPhase.create({
      data: {
        name,
        wbsId: parseInt(params.id),
        seq: 0, // You might want to implement a proper sequencing logic
        isCustom: phaseTemplateId ? false : true,
        phaseTemplateId: phaseTemplateId ? parseInt(phaseTemplateId) : null,
      },
    })

    return NextResponse.json(phase, { status: 201 })
  } catch (error) {
    console.error('Failed to create phase:', error)
    return NextResponse.json({ error: 'Failed to create phase' }, { status: 500 })
  }
}