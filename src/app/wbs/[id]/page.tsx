import { notFound } from 'next/navigation'
import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import prisma from '@/lib/prisma'
import { TaskList } from './task-list'
import { WBS, WBSPhase, WBSTask } from '@/types/project'

export default async function WBSPage({ params }: { params: { id: string } }) {
  const wbsFromDb = await prisma.wbs.findUnique({
    where: { id: parseInt(params.id) },
    include: {
      project: true,
      phases: {
        include: {
          phaseTemplate: true
        },
        orderBy: {
          seq: 'asc'
        }
      },
      tasks: {
        include: {
          assignee: true
        }
      }
    }
  })

  if (!wbsFromDb) {
    notFound()
  }

  const wbs: WBS = {
    ...wbsFromDb,
    phases: wbsFromDb.phases.map((phase) => ({
      ...phase,
      tasks: wbsFromDb.tasks.filter((task) => task.phaseId === phase.id).map((task) => ({
        ...task,
        phaseName: phase.name,
        assignee: task.assignee
      } as WBSTask))
    } as WBSPhase))
  }

  const users = await prisma.user.findMany()

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">{wbs.project.name} のWBS</h1>

      <div className="mb-8">
        <Button asChild>
          <Link href={`/wbs/${wbs.id}/phases`}>フェーズ管理</Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>WBSタスク一覧</CardTitle>
        </CardHeader>
        <CardContent>
          <TaskList wbs={wbs} users={users} />
        </CardContent>
      </Card>
    </div>
  )
}