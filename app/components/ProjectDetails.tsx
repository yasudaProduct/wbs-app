'use client';

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
import { WBSTask } from '../types';

export default function ProjectDetails({ projectId }: { projectId: string }) {
  const { projects } = useProjects();
  const project = projects.find(p => p.id === projectId);

  if (!project) {
    return <div>プロジェクトが見つかりません。</div>;
  }

  const renderTasks = (tasks: WBSTask[], level = 0) => {
    return tasks.map(task => (
      <>
        <TableRow key={task.id}>
          <TableCell style={{ paddingLeft: `${level * 20}px` }}>{task.name}</TableCell>
          <TableCell>{task.startDate.toLocaleDateString()}</TableCell>
          <TableCell>{task.endDate.toLocaleDateString()}</TableCell>
          <TableCell>{task.status}</TableCell>
          <TableCell>{task.priority}</TableCell>
          <TableCell>{task.assignedTo}</TableCell>
          <TableCell>
            <Button variant="outline" size="sm">編集</Button>
          </TableCell>
        </TableRow>
        {task.childTasks && renderTasks(task.childTasks, level + 1)}
      </>
    ));
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-4">{project.name}</h1>
      <p className="mb-4">{project.description}</p>
      <div className="mb-4">
        <strong>開始日:</strong> {project.startDate.toLocaleDateString()} |{' '}
        <strong>終了日:</strong> {project.endDate.toLocaleDateString()}
      </div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold">タスク一覧</h2>
        <Button>新規タスク</Button>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>タスク名</TableHead>
            <TableHead>開始日</TableHead>
            <TableHead>終了日</TableHead>
            <TableHead>ステータス</TableHead>
            <TableHead>優先度</TableHead>
            <TableHead>担当者</TableHead>
            <TableHead>アクション</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {renderTasks(project.tasks)}
        </TableBody>
      </Table>
    </div>
  );
}