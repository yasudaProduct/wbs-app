import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { projectId } = body

    console.log('Received projectId:', projectId);

    if (!projectId) {
      return NextResponse.json({ error: 'projectId is required' }, { status: 400 })
    }

    const numericProjectId = parseInt(projectId, 10);

    if (isNaN(numericProjectId)) {
      return NextResponse.json({ error: 'Invalid projectId' }, { status: 400 })
    }

    const wbs = await prisma.wbs.create({
      data: {
        projectId: numericProjectId,
      },
      include: {
        project: true,
        phases: true,
      },
    })

    return NextResponse.json(wbs, { status: 201 })
  } catch (error) {
    console.error('Failed to create WBS:', error)
    return NextResponse.json({ error: 'Failed to create WBS', details: error }, { status: 500 })
  }
}