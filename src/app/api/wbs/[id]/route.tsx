import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const wbs = await prisma.wbs.findUnique({
      where: { id: parseInt(params.id) },
      include: {
        project: true,
        phases: {
          include: {
            tasks: true,
          },
        },
      },
    })

    if (!wbs) {
      return NextResponse.json({ error: 'WBS not found' }, { status: 404 })
    }

    return NextResponse.json(wbs)
  } catch (error) {
    console.error('Failed to fetch WBS:', error)
    return NextResponse.json({ error: 'Failed to fetch WBS' }, { status: 500 })
  }
}