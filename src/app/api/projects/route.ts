import { NextResponse } from 'next/server'
import { CreateProjectInput, Project, WBS } from '@/types/project'
import prisma from '@/lib/prisma'

export async function GET() {
    try {
        const projects: Project[] = await prisma.project.findMany()
        return NextResponse.json(projects)
    } catch (error) {
        console.error('Failed to fetch users:', error)
        return NextResponse.json({ error: 'Failed to fetch users' }, { status: 500 })
    }
}

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

