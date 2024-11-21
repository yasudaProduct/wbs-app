import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { CreateProjectInput, Project } from '@/types/project'

const prisma = new PrismaClient()

export async function POST(request: Request) {
  const body: CreateProjectInput = await request.json()
  const { name, projectCode, companyId, startDate, endDate } = body

  try {
    const project: Project = await prisma.project.create({
      data: {
        name,
        projectCode,
        companyId,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
      },
    })

    return NextResponse.json(project, { status: 201 })
  } catch (error) {
    console.error('Failed to create project:', error)
    return NextResponse.json({ error: 'Failed to create project' }, { status: 500 })
  }
}

