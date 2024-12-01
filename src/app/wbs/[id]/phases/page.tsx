import { notFound } from 'next/navigation'
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Table, TableBody, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import prisma from '@/lib/prisma'
import { AddPhaseForm } from './add-phase-form'
import { PhaseRow } from './phase-row'

export default async function WBSPhasesPage({ params }: { params: { id: string } }) {
    const wbsId = parseInt(params.id)
    const phases = await prisma.wbsPhase.findMany({
        where: { wbsId: wbsId },
        include: {
            wbs: true,
        },
        orderBy: {
            seq: 'asc'
        }
    })

  if (!phases) {
    notFound()
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">フェーズ管理</h1>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>新規フェーズの追加</CardTitle>
        </CardHeader>
        <CardContent>
          <AddPhaseForm wbsId={wbsId} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>フェーズ一覧</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>フェーズ名</TableHead>
                <TableHead>アクション</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {phases.map((phase) => (
                <PhaseRow key={phase.id} phase={phase} wbsId={wbsId} />
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}