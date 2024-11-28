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

export async function POST(request: Request) {
    const body = await request.json()
    const { name } = body
  
    try {
      const company = await prisma.company.create({
        data: { name },
      })
  
      return NextResponse.json(company, { status: 201 })
    } catch (error) {
      console.error('Failed to create company:', error)
      return NextResponse.json({ error: '企業の作成に失敗しました' }, { status: 500 })
    }
  }
  