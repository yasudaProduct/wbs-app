import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function POST(request: Request, { params }: { params: { id: string, phaseId: string } }) {
  const body = await request.json()
  const { name } = body

  try {
    const task = await prisma.wbsTask.create({
      data: {
        name,
        wbsId: parseInt(params.id),
        phaseId: parseInt(params.phaseId),
        kijunStartDate: new Date(), // You might want to accept this as input
        kijunEndDate: new Date(), // You might want to accept this as input
        kijunKosu: 0, // You might want to accept this as input
        status: 'NOT_STARTED',
      },
    })

    return NextResponse.json(task, { status: 201 })
  } catch (error) {
    console.error('Failed to create task:', error)
    return NextResponse.json({ error: 'Failed to create task' }, { status: 500 })
  }
}

