'use client'

import { useState, useMemo } from 'react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { WBS, User, WBSTask } from '@/types/project'
import { AddTaskForm } from './add-task-form'
import { TaskRow } from './task-row'
import React from 'react'

export function TaskList({ wbs, users }: { wbs: WBS, users: User[] }) {
  const [tasks, setTasks] = useState(wbs.tasks)

  const tasksByPhase = useMemo(() => {
    const taskMap = new Map()
    wbs.phases.forEach(phase => {
      taskMap.set(phase.id, [])
    })
    tasks.forEach(task => {
      const phaseTasks = taskMap.get(task.phaseId) || []
      phaseTasks.push(task)
      taskMap.set(task.phaseId, phaseTasks)
    })
    return taskMap
  }, [tasks, wbs.phases])

  const handleTaskAdded = (newTask: WBSTask) => {
    setTasks([...tasks, newTask])
  }

  const handleTaskUpdated = (updatedTask: WBSTask) => {
    setTasks(tasks.map(task => task.id === updatedTask.id ? updatedTask : task))
  }

  const handleTaskDeleted = (deletedTaskId: string) => {
    setTasks(tasks.filter(task => task.id !== deletedTaskId))
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>フェーズ</TableHead>
          <TableHead>タスク名</TableHead>
          <TableHead>ステータス</TableHead>
          <TableHead>基準開始日</TableHead>
          <TableHead>基準終了日</TableHead>
          <TableHead>基準工数</TableHead>
          <TableHead>担当者</TableHead>
          <TableHead>アクション</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {wbs.phases.map((phase) => (
          <React.Fragment key={phase.id}>
            <TableRow>
              <TableCell colSpan={8} className="bg-muted">
                <span className="font-bold">{phase.name}</span>
              </TableCell>
            </TableRow>
            {(tasksByPhase.get(phase.id) || []).map((task: WBSTask) => (
              <TaskRow 
                key={task.id} 
                task={task} 
                users={users} 
                onUpdate={handleTaskUpdated}
                onDelete={handleTaskDeleted}
              />
            ))}
          </React.Fragment>
        ))}
        <AddTaskForm wbs={wbs} users={users} onAdd={handleTaskAdded} />
      </TableBody>
    </Table>
  )
}