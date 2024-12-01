'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { toast } from '@/hooks/use-toast'
import { WBS, WBSTask, PhaseTemplate } from '@/types/project'

export default function WBSPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [wbs, setWbs] = useState<WBS | null>(null)
  const [phaseTemplates, setPhaseTemplates] = useState<PhaseTemplate[]>([])
  const [newTaskName, setNewTaskName] = useState('')
  const [newTaskPhaseId, setNewTaskPhaseId] = useState<number | null>(null)
  const [editingTask, setEditingTask] = useState<WBSTask | null>(null)

  useEffect(() => {
    fetchWBS()
    fetchPhaseTemplates()
  }, [params.id])

  const fetchWBS = async () => {
    const response = await fetch(`/api/wbs/${params.id}`)
    if (response.ok) {
      const data = await response.json()
      setWbs(data)
    } else {
      toast({
        title: "エラー",
        description: "WBSの取得に失敗しました",
        variant: "destructive",
      })
    }
  }

  const fetchPhaseTemplates = async () => {
    const response = await fetch('/api/phase-templates')
    if (response.ok) {
      const data = await response.json()
      setPhaseTemplates(data)
    } else {
      toast({
        title: "エラー",
        description: "フェーズテンプレートの取得に失敗しました",
        variant: "destructive",
      })
    }
  }

  const handleAddTask = async () => {
    if (!wbs || !newTaskName || !newTaskPhaseId) return

    const response = await fetch(`/api/wbs/${wbs.id}/phases/${newTaskPhaseId}/tasks`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name: newTaskName }),
    })

    if (response.ok) {
      const newTask = await response.json()
      setWbs(prevWbs => {
        if (!prevWbs) return null
        return {
          ...prevWbs,
          phases: prevWbs.phases.map(phase =>
            phase.id === newTaskPhaseId
              ? { ...phase, tasks: [...phase.tasks, newTask] }
              : phase
          )
        }
      })
      setNewTaskName('')
      setNewTaskPhaseId(null)
      toast({
        title: "成功",
        description: "タスクが正常に追加されました",
      })
    } else {
      const errorData = await response.json()
      toast({
        title: "エラー",
        description: errorData.error || "タスクの追加に失敗しました",
        variant: "destructive",
      })
    }
  }

  const handleEditTask = async (task: WBSTask) => {
    if (!wbs || !editingTask) return

    const response = await fetch(`/api/wbs/${wbs.id}/phases/${task.phaseId}/tasks/${task.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(editingTask),
    })

    if (response.ok) {
      const updatedTask = await response.json()
      setWbs(prevWbs => {
        if (!prevWbs) return null
        return {
          ...prevWbs,
          phases: prevWbs.phases.map(phase =>
            phase.id === task.phaseId
              ? {
                  ...phase,
                  tasks: phase.tasks.map(t =>
                    t.id === updatedTask.id ? updatedTask : t
                  )
                }
              : phase
          )
        }
      })
      setEditingTask(null)
      toast({
        title: "成功",
        description: "タスクが正常に更新されました",
      })
    } else {
      const errorData = await response.json()
      toast({
        title: "エラー",
        description: errorData.error || "タスクの更新に失敗しました",
        variant: "destructive",
      })
    }
  }

  const handleDeleteTask = async (task: WBSTask) => {
    if (!wbs) return

    const response = await fetch(`/api/wbs/${wbs.id}/phases/${task.phaseId}/tasks/${task.id}`, {
      method: 'DELETE',
    })

    if (response.ok) {
      setWbs(prevWbs => {
        if (!prevWbs) return null
        return {
          ...prevWbs,
          phases: prevWbs.phases.map(phase =>
            phase.id === task.phaseId
              ? { ...phase, tasks: phase.tasks.filter(t => t.id !== task.id) }
              : phase
          )
        }
      })
      toast({
        title: "成功",
        description: "タスクが正常に削除されました",
      })
    } else {
      const errorData = await response.json()
      toast({
        title: "エラー",
        description: errorData.error || "タスクの削除に失敗しました",
        variant: "destructive",
      })
    }
  }

  if (!wbs) {
    return <div>Loading...</div>
  }

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
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>フェーズ</TableHead>
                <TableHead>タスク名</TableHead>
                <TableHead>ステータス</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {wbs.phases.map((phase) => (
                <React.Fragment key={phase.id}>
                  <TableRow>
                    <TableCell colSpan={4} className="bg-muted">
                      <span className="font-bold">{phase.name}</span>
                    </TableCell>
                  </TableRow>
                  {phase.tasks.map((task) => (
                    <TableRow key={task.id}>
                      <TableCell>{phase.name}</TableCell>
                      <TableCell>
                        {editingTask?.id === task.id ? (
                          <Input
                            value={editingTask.name}
                            onChange={(e) => setEditingTask({...editingTask, name: e.target.value})}
                          />
                        ) : (
                          task.name
                        )}
                      </TableCell>
                      <TableCell>
                        {editingTask?.id === task.id ? (
                          <Select
                            value={editingTask.status}
                            onValueChange={(value) => setEditingTask({...editingTask, status: value as 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED'})}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="NOT_STARTED">未着手</SelectItem>
                              <SelectItem value="IN_PROGRESS">進行中</SelectItem>
                              <SelectItem value="COMPLETED">完了</SelectItem>
                            </SelectContent>
                          </Select>
                        ) : (
                          task.status
                        )}
                      </TableCell>
                      <TableCell>
                        {editingTask?.id === task.id ? (
                          <>
                            <Button variant="outline" size="sm" className="mr-2" onClick={() => handleEditTask(task)}>
                              保存
                            </Button>
                            <Button variant="outline" size="sm" onClick={() => setEditingTask(null)}>
                              キャンセル
                            </Button>
                          </>
                        ) : (
                          <>
                            <Button variant="outline" size="sm" className="mr-2" onClick={() => setEditingTask(task)}>
                              編集
                            </Button>
                            <Button variant="destructive" size="sm" onClick={() => handleDeleteTask(task)}>
                              削除
                            </Button>
                          </>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </React.Fragment>
              ))}
              <TableRow>
                <TableCell>
                  <Select value={newTaskPhaseId?.toString()} onValueChange={(value) => setNewTaskPhaseId(Number(value))}>
                    <SelectTrigger>
                      <SelectValue placeholder="フェーズを選択" />
                    </SelectTrigger>
                    <SelectContent>
                      {wbs.phases.map((phase) => (
                        <SelectItem key={phase.id} value={phase.id.toString()}>
                          {phase.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </TableCell>
                <TableCell>
                  <Input
                    placeholder="新しいタスク名"
                    value={newTaskName}
                    onChange={(e) => setNewTaskName(e.target.value)}
                  />
                </TableCell>
                <TableCell></TableCell>
                <TableCell>
                  <Button onClick={handleAddTask}>追加</Button>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}