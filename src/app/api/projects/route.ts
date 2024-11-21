import { NextResponse } from 'next/server'
import prisma from "@/lib/prisma";

export async function POST(request: Request) {
  const body = await request.json()
  const { name, projectCode, companyId, startDate, endDate } = body

  try {
    const project = await prisma.project.create({
        data: {
          name,
          projectCode,
          companyId: parseInt(companyId),
          startDate: new Date(startDate),
          endDate: new Date(endDate),
        },
      })
  

    console.log(body)

    return NextResponse.json(project, { status: 201 })
  } catch (error) {
    console.log('Failed to create project:', error)
    return NextResponse.json({ error: 'Failed to create project' }, { status: 500 })
  }
}