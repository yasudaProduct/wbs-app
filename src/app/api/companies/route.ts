import { NextResponse } from 'next/server'
import { Company } from '@/types/project'
import prisma from '@/lib/prisma'

export async function GET() {
  try {
    const companies: Company[] = await prisma.company.findMany()
    return NextResponse.json(companies)
  } catch (error) {
    console.error('Failed to fetch companies:', error)
    return NextResponse.json({ error: 'Failed to fetch companies' }, { status: 500 })
  }
}