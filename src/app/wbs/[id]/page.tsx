'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { toast } from '@/hooks/use-toast'
import { WBS, WBSPhase, WBSTask } from '@/types/project'

export default function WBSPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = React.use(params)
  const router = useRouter()
  const [wbs, setWbs] = useState<WBS | null>(null)
  const [newPhaseName, setNewPhaseName] = useState('')
  const [newTaskName, setNewTaskName] = useState('')
  const [selectedPhaseId, setSelectedPhaseId] = useState<number | null>(null)

  useEffect(() => {
    const fetchWBS = async () => {
      const response = await fetch(`/api/wbs/${id}`)
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

    fetchWBS()
  }, [id])

  const handleAddPhase = async (e: React.FormEvent) => {
    e.preventDefault()
    const response = await fetch(`/api/wbs/${id}/phases`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name: newPhaseName }),
    })

    if (response.ok) {
      const newPhase = await response.json()
      setWbs(prevWbs => ({
        ...prevWbs!,
        phases: [...prevWbs!.phases, newPhase]
      }))
      setNewPhaseName('')
      toast({
        title: "成功",
        description: "フェーズが正常に追加されました",
      })
    } else {
      const errorData = await response.json()
      toast({
        title: "エラー",
        description: errorData.error || "フェーズの追加に失敗しました",
        variant: "destructive",
      })
    }
  }

  const handleAddTask = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedPhaseId) return

    const response = await fetch(`/api/wbs/${id}/phases/${selectedPhaseId}/tasks`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name: newTaskName }),
    })

    if (response.ok) {
      const newTask = await response.json()
      setWbs(prevWbs => ({
        ...prevWbs!,
        phases: prevWbs!.phases.map(phase =>
          phase.id === selectedPhaseId
            ? { ...phase, tasks: [...phase.tasks, newTask] }
            : phase
        )
      }))
      setNewTaskName('')
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

  if (!wbs) {
    return <div>Loading...</div>
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">{wbs.project.name} のWBS</h1>
      
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>フェーズの追加</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleAddPhase} className="flex items-end gap-4">
            <div className="flex-grow">
              <Label htmlFor="newPhaseName">フェーズ名</Label>
              <Input
                id="newPhaseName"
                value={newPhaseName}
                onChange={(e) => setNewPhaseName(e.target.value)}
                required
              />
            </div>
            <Button type="submit">フェーズを追加</Button>
          </form>
        </CardContent>
      </Card>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>タスクの追加</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleAddTask} className="flex items-end gap-4">
            <div className="flex-grow">
              <Label htmlFor="selectedPhaseId">フェーズ</Label>
              <select
                id="selectedPhaseId"
                value={selectedPhaseId || ''}
                onChange={(e) => setSelectedPhaseId(Number(e.target.value))}
                className="w-full p-2 border rounded"
                required
              >
                <option value="">フェーズを選択</option>
                {wbs.phases.map((phase) => (
                  <option key={phase.id} value={phase.id}>
                    {phase.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex-grow">
              <Label htmlFor="newTaskName">タスク名</Label>
              <Input
                id="newTaskName"
                value={newTaskName}
                onChange={(e) => setNewTaskName(e.target.value)}
                required
              />
            </div>
            <Button type="submit">タスクを追加</Button>
          </form>
        </CardContent>
      </Card>

      <div className="space-y-8">
        {wbs.phases.map((phase) => (
          <Card key={phase.id}>
            <CardHeader>
              <CardTitle>{phase.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="list-disc pl-5">
                {phase.tasks.map((task) => (
                  <li key={task.id}>{task.name}</li>
                ))}
              </ul>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}