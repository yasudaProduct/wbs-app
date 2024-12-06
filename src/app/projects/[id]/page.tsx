import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import prisma from "@/lib/prisma";

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const project = await prisma.project.findUnique({
    where: { id: parseInt(id, 10) },
    include: {
      company: true,
      wbs: {
        include: {
          phases: {
            include: {
              tasks: true,
            },
          },
        },
      },
    },
  });

  if (!project) {
    return <div className="container mx-auto px-4 py-8">Project not found</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Card>
        <CardHeader>
          <CardTitle>{project.name}</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Company: {project.company.name}</p>
          <p>Start Date: {project.startDate.toLocaleDateString()}</p>
          <p>End Date: {project.endDate.toLocaleDateString()}</p>
        </CardContent>
      </Card>

      <h2 className="text-2xl font-bold mt-8 mb-4">WBS</h2>
      <Button asChild>
        <Link href={`/projects/create-wbs/${id}`}>WBSを作成する</Link>
      </Button>
      {project.wbs.length === 0 ? (
        <p className="my-3">WBSがありません</p>
      ) : (
        project.wbs.map((wbs) => (
          <Card key={wbs.id} className="mt-4">
            <CardHeader>
              <CardTitle>Phases</CardTitle>
            </CardHeader>
            <CardContent>
              {wbs.phases.map((phase) => (
                <div key={phase.id} className="mb-4">
                  <h4 className="text-lg font-medium">{phase.name}</h4>
                  <ul className="list-disc pl-8">
                    {phase.tasks.map((task) => (
                      <li key={task.id}>{task.name}</li>
                    ))}
                  </ul>
                </div>
              ))}
              <Button asChild className="mt-4">
                <Link href={`/projects/${project.id}/wbs/${wbs.id}/edit`}>
                  Edit WBS
                </Link>
              </Button>
            </CardContent>
          </Card>
        ))
      )}
    </div>
  );
}
