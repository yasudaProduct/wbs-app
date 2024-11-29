import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const body = await request.json()
    const { name, order } = body

    const updatedTemplate = await prisma.phaseTemplate.update({
      where: { id: parseInt(params.id) },
      data: { name, order },
    })

    return NextResponse.json(updatedTemplate)
  } catch (error) {
    console.error('Failed to update phase template:', error)
    return NextResponse.json({ error: 'Failed to update phase template' }, { status: 500 })
  }
}