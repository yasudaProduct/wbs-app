import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET() {
  try {
    const templates = await prisma.phaseTemplate.findMany({
      orderBy: { order: 'asc' },
    })
    return NextResponse.json(templates)
  } catch (error) {
    console.error('Failed to fetch phase templates:', error)
    return NextResponse.json({ error: 'Failed to fetch phase templates' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { name, order } = body

    const template = await prisma.phaseTemplate.create({
      data: { name, order },
    })

    return NextResponse.json(template, { status: 201 })
  } catch (error) {
    console.error('Failed to create phase template:', error)
    return NextResponse.json({ error: 'Failed to create phase template' }, { status: 500 })
  }
}