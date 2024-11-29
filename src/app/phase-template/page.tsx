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

  const handleDelete = async (id: number) => {
    const response = await fetch(`/api/phase-templates/${id}`, {
      method: 'DELETE',
    })

    if (response.ok) {
      toast({
        title: "成功",
        description: "テンプレートが正常に削除されました",
      })
      fetchTemplates()
    } else {
      toast({
        title: "エラー",
        description: "テンプレートの削除に失敗しました",
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
              <TableCell>{template.name}</TableCell>
              <TableCell>{template.order}</TableCell>
              <TableCell>
                <Button variant="outline" size="sm" className="mr-2" onClick={() => handleDelete(template.id)}>
                  削除
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}