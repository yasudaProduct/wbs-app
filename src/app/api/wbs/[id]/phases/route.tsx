import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function POST(request: Request, { params }: { params: { id: string } }) {
  const body = await request.json()
  const { name } = body

  try {
    const phase = await prisma.wbsPhase.create({
      data: {
        name,
        wbsId: parseInt(params.id),
        seq: 0,
        isTemplateBased: true,
      },
    })

    return NextResponse.json(phase, { status: 201 })
  } catch (error) {
    console.error('Failed to create phase:', error)
    return NextResponse.json({ error: 'Failed to create phase' }, { status: 500 })
  }
}