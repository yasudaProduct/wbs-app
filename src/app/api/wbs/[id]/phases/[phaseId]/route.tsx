import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET(
  request: Request,
  { params }: { params: { id: string; phaseId: string } }
) {
  try {
    const phase = await prisma.wbsPhase.findUnique({
      where: { id: parseInt(params.phaseId) },
      include: { phaseTemplate: true }
    })

    if (!phase) {
      return NextResponse.json({ error: 'Phase not found' }, { status: 404 })
    }

    return NextResponse.json(phase)
  } catch (error) {
    console.error('Failed to fetch phase:', error)
    return NextResponse.json({ error: 'Failed to fetch phase' }, { status: 500 })
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string; phaseId: string } }
) {
  try {
    const body = await request.json()
    const { name } = body

    const updatedPhase = await prisma.wbsPhase.update({
      where: { id: parseInt(params.phaseId) },
      data: { name },
      include: { phaseTemplate: true }
    })

    return NextResponse.json(updatedPhase)
  } catch (error) {
    console.error('Failed to update phase:', error)
    return NextResponse.json({ error: 'Failed to update phase' }, { status: 500 })
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string; phaseId: string } }
) {
  try {
    await prisma.wbsPhase.delete({
      where: { id: parseInt(params.phaseId) },
    })

    return NextResponse.json({ message: 'Phase deleted successfully' })
  } catch (error) {
    console.error('Failed to delete phase:', error)
    return NextResponse.json({ error: 'Failed to delete phase' }, { status: 500 })
  }
}