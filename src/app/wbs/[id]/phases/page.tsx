'use client'

import React, { useState, useEffect } from 'react'
// import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { toast } from '@/hooks/use-toast'
import { WBS, WBSPhase, PhaseTemplate } from '@/types/project'

export default function WBSPhasesPage({ params }: { params: { id: string } }) {
//   const router = useRouter()
  const [wbs, setWbs] = useState<WBS | null>(null)
  const [phaseTemplates, setPhaseTemplates] = useState<PhaseTemplate[]>([])
  const [newPhaseName, setNewPhaseName] = useState('')
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>('')
  const [editingPhase, setEditingPhase] = useState<WBSPhase | null>(null)

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

  const handleAddPhase = async () => {
    if (!wbs) return

    const phaseData = {
      name: newPhaseName,
      wbsId: wbs.id,
      phaseTemplateId: selectedTemplateId ? parseInt(selectedTemplateId) : null,
    }

    const response = await fetch(`/api/wbs/${wbs.id}/phases`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(phaseData),
    })

    if (response.ok) {
      const newPhase = await response.json()
      setWbs(prevWbs => {
        if (!prevWbs) return null
        return {
          ...prevWbs,
          phases: [...prevWbs.phases, newPhase]
        }
      })
      setNewPhaseName('')
      setSelectedTemplateId('')
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

  const handleEditPhase = async (phase: WBSPhase) => {
    if (!wbs || !editingPhase) return

    const response = await fetch(`/api/wbs/${wbs.id}/phases/${phase.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(editingPhase),
    })

    if (response.ok) {
      const updatedPhase = await response.json()
      setWbs(prevWbs => {
        if (!prevWbs) return null
        return {
          ...prevWbs,
          phases: prevWbs.phases.map(p => p.id === updatedPhase.id ? updatedPhase : p)
        }
      })
      setEditingPhase(null)
      toast({
        title: "成功",
        description: "フェーズが正常に更新されました",
      })
    } else {
      const errorData = await response.json()
      toast({
        title: "エラー",
        description: errorData.error || "フェーズの更新に失敗しました",
        variant: "destructive",
      })
    }
  }

  const handleDeletePhase = async (phase: WBSPhase) => {
    if (!wbs) return

    const response = await fetch(`/api/wbs/${wbs.id}/phases/${phase.id}`, {
      method: 'DELETE',
    })

    if (response.ok) {
      setWbs(prevWbs => {
        if (!prevWbs) return null
        return {
          ...prevWbs,
          phases: prevWbs.phases.filter(p => p.id !== phase.id)
        }
      })
      toast({
        title: "成功",
        description: "フェーズが正常に削除されました",
      })
    } else {
      const errorData = await response.json()
      toast({
        title: "エラー",
        description: errorData.error || "フェーズの削除に失敗しました",
        variant: "destructive",
      })
    }
  }

  if (!wbs) {
    return <div>Loading...</div>
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">{wbs.project.name} のフェーズ管理</h1>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>新規フェーズの追加</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <Label htmlFor="newPhaseName">新規フェーズ名</Label>
              <Input
                id="newPhaseName"
                value={newPhaseName}
                onChange={(e) => setNewPhaseName(e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="selectedTemplateId">テンプレート (オプション)</Label>
              <Select value={selectedTemplateId} onValueChange={setSelectedTemplateId}>
                <SelectTrigger>
                  <SelectValue placeholder="テンプレートを選択" />
                </SelectTrigger>
                <SelectContent>
                  {phaseTemplates.map((template) => (
                    <SelectItem key={template.id} value={template.id.toString()}>
                      {template.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button onClick={handleAddPhase}>フェーズを追加</Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>フェーズ一覧</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>フェーズ名</TableHead>
                <TableHead>テンプレート</TableHead>
                <TableHead>アクション</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {wbs.phases.map((phase) => (
                <TableRow key={phase.id}>
                  <TableCell>
                    {editingPhase?.id === phase.id ? (
                      <Input
                        value={editingPhase.name}
                        onChange={(e) => setEditingPhase({...editingPhase, name: e.target.value})}
                      />
                    ) : (
                      phase.name
                    )}
                  </TableCell>
                  <TableCell>
                    {phase.phaseTemplate ? phase.phaseTemplate.name : 'カスタム'}
                  </TableCell>
                  <TableCell>
                    {editingPhase?.id === phase.id ? (
                      <>
                        <Button variant="outline" size="sm" className="mr-2" onClick={() => handleEditPhase(phase)}>
                          保存
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => setEditingPhase(null)}>
                          キャンセル
                        </Button>
                      </>
                    ) : (
                      <>
                        <Button variant="outline" size="sm" className="mr-2" onClick={() => setEditingPhase(phase)}>
                          編集
                        </Button>
                        <Button variant="destructive" size="sm" onClick={() => handleDeletePhase(phase)}>
                          削除
                        </Button>
                      </>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}