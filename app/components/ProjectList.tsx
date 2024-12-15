'use client';

import Link from 'next/link';
import { useProjects } from '../contexts/ProjectContext';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

export default function ProjectList() {
  const { projects } = useProjects();

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold">プロジェクト一覧</h2>
        <Button>新規プロジェクト</Button>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>プロジェクト名</TableHead>
            <TableHead>開始日</TableHead>
            <TableHead>終了日</TableHead>
            <TableHead>ステータス</TableHead>
            <TableHead>アクション</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {projects.map((project) => (
            <TableRow key={project.id}>
              <TableCell>{project.name}</TableCell>
              <TableCell>{project.startDate.toLocaleDateString()}</TableCell>
              <TableCell>{project.endDate.toLocaleDateString()}</TableCell>
              <TableCell>
                {project.tasks.every((task) => task.status === 'DONE')
                  ? '完了'
                  : '進行中'}
              </TableCell>
              <TableCell>
                <Link href={`/projects/${project.id}`}>
                  <Button variant="outline">詳細</Button>
                </Link>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}