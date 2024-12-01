'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from '@/hooks/use-toast'
import { addPhase } from './actions'

export function AddPhaseForm({ wbsId }: { wbsId: number }) {
  const router = useRouter()
  const [newPhaseName, setNewPhaseName] = useState('')
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await addPhase(wbsId, newPhaseName, selectedTemplateId ? parseInt(selectedTemplateId) : null)
      setNewPhaseName('')
      setSelectedTemplateId('')
      toast({
        title: "成功",
        description: "フェーズが正常に追加されました",
      })
      router.refresh()
    } catch {
      toast({
        title: "エラー",
        description: "フェーズの追加に失敗しました",
        variant: "destructive",
      })
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="newPhaseName">新規フェーズ名</Label>
        <Input
          id="newPhaseName"
          value={newPhaseName}
          onChange={(e) => setNewPhaseName(e.target.value)}
          required
        />
      </div>
      <Button type="submit">フェーズを追加</Button>
    </form>
  )
}