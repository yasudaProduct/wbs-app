import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import prisma from '@/lib/prisma'
import { WBS } from '@/types/project'

export default async function WBSListPage() {
  const wbsList: WBS[] = await prisma.wbs.findMany({
    include: {
      project: true,
      phases: {
        include: {
          tasks: true
        }
      }
    }
  })

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold">WBS一覧</h1>
        <Button asChild>
          <Link href="/wbs/new">新規WBS作成</Link>
        </Button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {wbsList.map((wbs) => (
          <Card key={wbs.id}>
            <CardHeader>
              <CardTitle>{wbs.project.name} のWBS</CardTitle>
            </CardHeader>
            <CardContent>
              <p>フェーズ数: {wbs.phases.length}</p>
              <p>タスク数: {wbs.phases.reduce((acc, phase) => acc + phase.tasks.length, 0)}</p>
              <Button asChild className="mt-4">
                <Link href={`/wbs/${wbs.id}`}>詳細を見る</Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

