import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import prisma from '@/lib/prisma'
import { Project } from '@/types/project'

export default async function ProjectsPage() {
  const projects: Project[] = await prisma.project.findMany({
    include: { company: true },
  })

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold">プロジェクト</h1>
        <Button asChild>
          <Link href="/projects/new">プロジェクト作成</Link>
        </Button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project) => (
          <Card key={project.id}>
            <CardHeader>
              <CardTitle>{project.name}</CardTitle>
              <CardDescription>{project.company.name}</CardDescription>
            </CardHeader>
            <CardContent>
              <p>開始日: {project.startDate.toLocaleDateString()}</p>
              <p>終了日: {project.endDate.toLocaleDateString()}</p>
              <Button asChild className="mt-4">
                <Link href={`/projects/${project.id}`}>View Project</Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

