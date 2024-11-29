import Link from 'next/link'
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import prisma from '@/lib/prisma'
import { Project } from '@/types/project'

export default async function ProjectsPage() {
  const projects: Project[] = await prisma.project.findMany({
    include: { company: true },
  })

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">プロジェクト一覧</h1>
        <Button asChild>
          <Link href="/projects/new">新規プロジェクト作成</Link>
        </Button>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>プロジェクト名</TableHead>
            <TableHead>企業名</TableHead>
            <TableHead>開始日</TableHead>
            <TableHead>終了日</TableHead>
            <TableHead>アクション</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {projects.map((project) => (
            <TableRow key={project.id}>
              <TableCell>{project.name}</TableCell>
              <TableCell>{project.company.name}</TableCell>
              <TableCell>{project.startDate.toLocaleDateString()}</TableCell>
              <TableCell>{project.endDate.toLocaleDateString()}</TableCell>
              <TableCell>
                <Button asChild variant="outline" size="sm">
                  <Link href={`/projects/${project.id}`}>詳細</Link>
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}