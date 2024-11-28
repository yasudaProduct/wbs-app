import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import prisma from '@/lib/prisma'
import { Company } from '@/types/project'

export default async function CompanyPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const company: Company = await prisma.company.findUnique({
    where: { id: parseInt(id) },
    include: { projects: true },
  })

  if (!company) {
    return <div className="container mx-auto px-4 py-8">企業が見つかりません</div>
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Card>
        <CardHeader>
          <CardTitle>{company.name}</CardTitle>
        </CardHeader>
        <CardContent>
          <h2 className="text-2xl font-bold mt-4 mb-2">プロジェクト一覧</h2>
          {company.projects.length === 0 ? (
            <p>プロジェクトはありません</p>
          ) : (
            <ul className="list-disc pl-5">
              {company.projects.map((project) => (
                <li key={project.id}>
                  <Link href={`/projects/${project.id}`} className="text-blue-500 hover:underline">
                    {project.name}
                  </Link>
                </li>
              ))}
            </ul>
          )}
          <div className="mt-4">
            <Button asChild>
              <Link href={`/companies/${company.id}/edit`}>企業情報を編集</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

