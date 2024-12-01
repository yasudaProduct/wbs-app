'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { TableCell, TableRow } from "@/components/ui/table"
import { toast } from '@/hooks/use-toast'
import { updatePhase, deletePhase } from './actions'
import { useRouter } from 'next/navigation'
import { WbsPhase } from '@prisma/client'

export function PhaseRow({ phase, wbsId }: { phase: WbsPhase, wbsId: number }) {
  const router = useRouter()
  const [isEditing, setIsEditing] = useState(false)
  const [editedName, setEditedName] = useState(phase.name)

  const handleUpdate = async () => {
    try {
      await updatePhase(wbsId, phase.id, editedName)
      setIsEditing(false)
      toast({
        title: "成功",
        description: "フェーズが正常に更新されました",
      })
      router.refresh()
    } catch {
      toast({
        title: "エラー",
        description: "フェーズの更新に失敗しました",
        variant: "destructive",
      })
    }
  }

  const handleDelete = async () => {
    if (confirm('このフェーズを削除してもよろしいですか？')) {
      try {
        await deletePhase(wbsId, phase.id)
        toast({
          title: "成功",
          description: "フェーズが正常に削除されました",
        })
        router.refresh()
      } catch {
        toast({
          title: "エラー",
          description: "フェーズの削除に失敗しました",
          variant: "destructive",
        })
      }
    }
  }

  return (
    <TableRow>
      <TableCell>
        {isEditing ? (
          <Input
            value={editedName}
            onChange={(e) => setEditedName(e.target.value)}
          />
        ) : (
          phase.name
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