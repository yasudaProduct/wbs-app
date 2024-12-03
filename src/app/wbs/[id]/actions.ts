'use server'

import prisma from '@/lib/prisma'
import { WBSTask } from '@/types/project'

export async function addTask(taskData: {
  wbsId: number;
  phaseId: number;
  name: string;
  kijunStartDate: string;
  kijunEndDate: string;
  kijunKosu: number;
  tantoId: number;
}): Promise<WBSTask> {
  const wbsTask = await prisma.wbsTask.create({
    data: {
      ...taskData,
      kijunStartDate: new Date(taskData.kijunStartDate),
      kijunEndDate: new Date(taskData.kijunEndDate),
      status: 'NOT_STARTED',
    },
    include: {
      assignee: true      
    }
  })

  return {
    ...wbsTask,
    phaseName: 'test',
  }
}

export async function updateTask(task: WBSTask) {
  const wbsTask =  await prisma.wbsTask.update({
    where: { id: task.id },
    data: {
      name: task.name,
      kijunStartDate: new Date(task.kijunStartDate),
      kijunEndDate: new Date(task.kijunEndDate),
      kijunKosu: task.kijunKosu,
      tantoId: task.tantoId,
      status: task.status,
    },
    include: {
      assignee: true
    }
  })

  return {
    ...wbsTask,
    phaseName: 'test',
  };
}

export async function deleteTask(taskId: string) {
  return prisma.wbsTask.delete({
    where: { id: taskId },
  })
}