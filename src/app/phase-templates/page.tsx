'use client'

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { PhaseTemplate } from '@/types/project'
import { toast } from '@/hooks/use-toast'

export default function PhaseTemplatesPage() {
  const [templates, setTemplates] = useState<PhaseTemplate[]>([])
  const [newTemplateName, setNewTemplateName] = useState('')
  const [newTemplateOrder, setNewTemplateOrder] = useState('')
  const [editingTemplate, setEditingTemplate] = useState<PhaseTemplate | null>(null)

  useEffect(() => {
    fetchTemplates()
  }, [])

  const fetchTemplates = async () => {
    const response = await fetch('/api/phase-templates')
    if (response.ok) {
      const data = await response.json()
      setTemplates(data)
    } else {
      toast({
        title: "エラー",
        description: "テンプレートの取得に失敗しました",
        variant: "destructive",
      })
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const response = await fetch('/api/phase-templates', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name: newTemplateName, order: parseInt(newTemplateOrder) }),
    })

    if (response.ok) {
      toast({
        title: "成功",
        description: "テンプレートが正常に作成されました",
      })
      setNewTemplateName('')
      setNewTemplateOrder('')
      fetchTemplates()
    } else {
      const errorData = await response.json()
      toast({
        title: "エラー",
        description: errorData.error || "テンプレートの作成に失敗しました",
        variant: "destructive",
      })
    }
  }

  const handleEdit = (template: PhaseTemplate) => {
    setEditingTemplate(template)
  }

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingTemplate) return

    const response = await fetch(`/api/phase-templates/${editingTemplate.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(editingTemplate),
    })

    if (response.ok) {
      toast({
        title: "成功",
        description: "テンプレートが正常に更新されました",
      })
      setEditingTemplate(null)
      fetchTemplates()
    } else {
      const errorData = await response.json()
      toast({
        title: "エラー",
        description: errorData.error || "テンプレートの更新に失敗しました",
        variant: "destructive",
      })
    }
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">フェーズテンプレート管理</h1>
      
      <form onSubmit={handleSubmit} className="mb-8 space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">テンプレート名</label>
          <Input
            id="name"
            value={newTemplateName}
            onChange={(e) => setNewTemplateName(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="order" className="block text-sm font-medium text-gray-700">順序</label>
          <Input
            id="order"
            type="number"
            value={newTemplateOrder}
            onChange={(e) => setNewTemplateOrder(e.target.value)}
            required
          />
        </div>
        <Button type="submit">新規テンプレート作成</Button>
      </form>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>テンプレート名</TableHead>
            <TableHead>順序</TableHead>
            <TableHead>アクション</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {templates.map((template) => (
            <TableRow key={template.id}>
              <TableCell>{template.id}</TableCell>
              <TableCell>
                {editingTemplate?.id === template.id ? (
                  <Input
                    value={editingTemplate.name}
                    onChange={(e) => setEditingTemplate({...editingTemplate, name: e.target.value})}
                  />
                ) : (
                  template.name
                )}
              </TableCell>
              <TableCell>
                {editingTemplate?.id === template.id ? (
                  <Input
                    type="number"
                    value={editingTemplate.order}
                    onChange={(e) => setEditingTemplate({...editingTemplate, order: parseInt(e.target.value)})}
                  />
                ) : (
                  template.order
                )}
              </TableCell>
              <TableCell>
                {editingTemplate?.id === template.id ? (
                  <>
                    <Button variant="outline" size="sm" className="mr-2" onClick={handleUpdate}>
                      保存
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => setEditingTemplate(null)}>
                      キャンセル
                    </Button>
                  </>
                ) : (
                  <Button variant="outline" size="sm" onClick={() => handleEdit(template)}>
                    編集
                  </Button>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}