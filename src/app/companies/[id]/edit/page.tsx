'use client'

import React from 'react'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { toast } from '@/hooks/use-toast'
import { Company } from '@/types/project'

export default function EditCompanyPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = React.use(params)
  const router = useRouter()
  const [company, setCompany] = useState<Company | null>(null)
  const [name, setName] = useState('')

  useEffect(() => {
    const fetchCompany = async () => {
      const response = await fetch(`/api/companies/${id}`)
      if (response.ok) {
        const data = await response.json()
        setCompany(data)
        setName(data.name)
      } else {
        toast({
          title: "エラー",
          description: "企業情報の取得に失敗しました",
          variant: "destructive",
        })
      }
    }

    fetchCompany()
  }, [id])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const response = await fetch(`/api/companies/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name }),
    })

    if (response.ok) {
      router.push('/companies')
      toast({
        title: "成功",
        description: "企業情報が正常に更新されました",
      })
    } else {
      const errorData = await response.json()
      toast({
        title: "エラー",
        description: errorData.error || "企業情報の更新に失敗しました",
        variant: "destructive",
      })
    }
  }

  if (!company) {
    return <div>Loading...</div>
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Card>
        <CardHeader>
          <CardTitle>企業情報の編集</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">企業名</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <Button type="submit">更新</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

