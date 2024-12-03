'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { TableCell, TableRow } from "@/components/ui/table"
import { toast } from '@/hooks/use-toast'
import { WBS, User, WBSTask } from '@/types/project'
import { addTask } from './actions'

export function AddTaskForm({ wbs, users, onAdd }: { wbs: WBS, users: User[], onAdd: (task: WBSTask) => void }) {
  const [newTaskName, setNewTaskName] = useState('')
  const [newTaskPhaseId, setNewTaskPhaseId] = useState<string>('')
  const [newTaskStartDate, setNewTaskStartDate] = useState('')
  const [newTaskEndDate, setNewTaskEndDate] = useState('')
  const [newTaskKosu, setNewTaskKosu] = useState('')
  const [newTaskTantoId, setNewTaskTantoId] = useState('')

  const handleAddTask = async () => {
    if (!newTaskName || !newTaskPhaseId) return

    try {
      const newTask: WBSTask = await addTask({
        wbsId: wbs.id,
        phaseId: parseInt(newTaskPhaseId),
        name: newTaskName,
        kijunStartDate: newTaskStartDate,
        kijunEndDate: newTaskEndDate,
        kijunKosu: parseInt(newTaskKosu),
        tantoId: parseInt(newTaskTantoId),
      })

      setNewTaskName('')
      setNewTaskPhaseId('')
      setNewTaskStartDate('')
      setNewTaskEndDate('')
      setNewTaskKosu('')
      setNewTaskTantoId('')
      toast({
        title: "成功",
        description: "タスクが正常に追加されました",
      })
      onAdd(newTask)
    } catch {
      toast({
        title: "エラー",
        description: "タスクの追加に失敗しました",
        variant: "destructive",
      })
    }
  }

  return (
    <TableRow>
      <TableCell>
        <Select value={newTaskPhaseId} onValueChange={setNewTaskPhaseId}>
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
        <Input
          type="date"
          value={newTaskStartDate}
          onChange={(e) => setNewTaskStartDate(e.target.value)}
        />
      </TableCell>
      <TableCell>
        <Input
          type="date"
          value={newTaskEndDate}
          onChange={(e) => setNewTaskEndDate(e.target.value)}
        />
      </TableCell>
      <TableCell>
        <Input
          type="number"
          value={newTaskKosu}
          onChange={(e) => setNewTaskKosu(e.target.value)}
        />
      </TableCell>
      <TableCell>
        <Select value={newTaskTantoId} onValueChange={setNewTaskTantoId}>
          <SelectTrigger>
            <SelectValue placeholder="担当者を選択" />
          </SelectTrigger>
          <SelectContent>
            {users.map((user) => (
              <SelectItem key={user.id} value={user.id.toString()}>
                {user.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </TableCell>
      <TableCell>
        <Button onClick={handleAddTask}>追加</Button>
      </TableCell>
    </TableRow>
  )
}