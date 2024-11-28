import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { User } from '@/types/project'

export async function GET() {
  try {
    const users: User[] = await prisma.user.findMany()
    return NextResponse.json(users)
  } catch (error) {
    console.error('Failed to fetch users:', error)
    return NextResponse.json({ error: 'Failed to fetch users' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  const body = await request.json()
  const { id, name, email } = body

  try {
    const user = await prisma.user.create({
      data: { 
        id: parseInt(id),
        name: name, 
        email: email
      },
    })

    return NextResponse.json(user, { status: 201 })
  } catch (error) {
    console.error('Failed to create user:', error)
    return NextResponse.json({ error: 'ユーザーの作成に失敗しました' }, { status: 500 })
  }
}

