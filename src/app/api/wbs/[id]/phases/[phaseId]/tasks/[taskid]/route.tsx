import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function PUT(
  request: Request,
  { params }: { params: { id: string; phaseId: string; taskId: string } }
) {
  try {
    const body = await request.json()
    const { name, status } = body

    const updatedTask = await prisma.wbsTask.update({
      where: { id: params.taskId },
      data: { name, status },
    })

    return NextResponse.json(updatedTask)
  } catch (error) {
    console.error('Failed to update task:', error)
    return NextResponse.json({ error: 'Failed to update task' }, { status: 500 })
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string; phaseId: string; taskId: string } }
) {
  try {
    await prisma.wbsTask.delete({
      where: { id: params.taskId },
    })

    return NextResponse.json({ message: 'Task deleted successfully' })
  } catch (error) {
    console.error('Failed to delete task:', error)
    return NextResponse.json({ error: 'Failed to delete task' }, { status: 500 })
  }
}