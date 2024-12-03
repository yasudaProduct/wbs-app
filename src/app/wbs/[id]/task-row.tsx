'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { TableCell, TableRow } from "@/components/ui/table"
import { toast } from '@/hooks/use-toast'
import { WBSTask, User } from '@/types/project'
import { updateTask, deleteTask } from './actions'

export function TaskRow({ task, users, onUpdate, onDelete }: { task: WBSTask, users: User[], onUpdate: (task: WBSTask) => void, onDelete: (taskId: string) => void }) {
  const [isEditing, setIsEditing] = useState(false)
  const [editedTask, setEditedTask] = useState(task)

  const handleUpdate = async () => {
    try {
      const updatedTask: WBSTask = await updateTask(editedTask)
      setIsEditing(false)
      toast({
        title: "成功",
        description: "タスクが正常に更新されました",
      })
      onUpdate(updatedTask)
    } catch {
      toast({
        title: "エラー",
        description: "タスクの更新に失敗しました",
        variant: "destructive",
      })
    }
  }

  const handleDelete = async () => {
    if (confirm('このタスクを削除してもよろしいですか？')) {
      try {
        await deleteTask(task.id)
        toast({
          title: "成功",
          description: "タスクが正常に削除されました",
        })
        onDelete(task.id)
      } catch {
        toast({
          title: "エラー",
          description: "タスクの削除に失敗しました",
          variant: "destructive",
        })
      }
    }
  }

  const formatDate = (date: Date) => date.toISOString().split('T')[0]

  return (
    <TableRow>
      <TableCell>{task.phaseId}</TableCell>
      <TableCell>
        {isEditing ? (
          <Input
            value={editedTask.name}
            onChange={(e) => setEditedTask({...editedTask, name: e.target.value})}
          />
        ) : (
          task.name
        )}
      </TableCell>
      <TableCell>
        {isEditing ? (
          <Select
            value={editedTask.status}
            onValueChange={(value) => setEditedTask({...editedTask, status: value as 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED'})}
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
        {isEditing ? (
          <Input
            type="date"
            value={formatDate(editedTask.kijunStartDate)}
            onChange={(e) => setEditedTask({...editedTask, kijunStartDate: new Date(e.target.value)})}
          />
        ) : (
          formatDate(task.kijunStartDate)
        )}
      </TableCell>
      <TableCell>
        {isEditing ? (
          <Input
            type="date"
            value={formatDate(editedTask.kijunEndDate)}
            onChange={(e) => setEditedTask({...editedTask, kijunEndDate: new Date(e.target.value)})}
          />
        ) : (
          formatDate(task.kijunEndDate)
        )}
      </TableCell>
      <TableCell>
        {isEditing ? (
          <Input
            type="number"
            value={editedTask.kijunKosu}
            onChange={(e) => setEditedTask({...editedTask, kijunKosu: parseInt(e.target.value)})}
          />
        ) : (
          task.kijunKosu
        )}
      </TableCell>
      <TableCell>
        {isEditing ? (
          <Select
            value={editedTask.tantoId?.toString()}
            onValueChange={(value) => setEditedTask({...editedTask, tantoId: parseInt(value)})}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {users.map((user) => (
                <SelectItem key={user.id} value={user.id.toString()}>
                  {user.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        ) : (
          users.find(user => user.id === task.tantoId)?.name || '未割当'
        )}
      </TableCell>
      <TableCell>
        {isEditing ? (
          <>
            <Button variant="outline" size="sm" className="mr-2" onClick={handleUpdate}>
              保存
            </Button>
            <Button variant="outline" size="sm" onClick={() => setIsEditing(false)}>
              キャンセル
            </Button>
          </>
        ) : (
          <>
            <Button variant="outline" size="sm" className="mr-2" onClick={() => setIsEditing(true)}>
              編集
            </Button>
            <Button variant="destructive" size="sm" onClick={handleDelete}>
              削除
            </Button>
          </>
        )}
      </TableCell>
    </TableRow>
  )
}