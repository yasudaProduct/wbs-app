'use client'

import React from 'react'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { toast } from '@/hooks/use-toast'
import { User } from '@/types/project'

export default function EditUserPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = React.use(params)
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [idState, setId] = useState('') // Update 1

  useEffect(() => {
    const fetchUser = async () => {
      const response = await fetch(`/api/users/${id}`)
      if (response.ok) {
        const data = await response.json()
        setUser(data)
        setName(data.name)
        setEmail(data.email)
        setId(data.id.toString()) // Update 2
      } else {
        toast({
          title: "エラー",
          description: "ユーザー情報の取得に失敗しました",
          variant: "destructive",
        })
      }
    }

    fetchUser()
  }, [id])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const response = await fetch(`/api/users/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ id: parseInt(idState), name, email }), // Update 3
    })

    if (response.ok) {
      router.push('/users')
      toast({
        title: "成功",
        description: "ユーザー情報が正常に更新されました",
      })
    } else {
      const errorData = await response.json()
      toast({
        title: "エラー",
        description: errorData.error || "ユーザー情報の更新に失敗しました",
        variant: "destructive",
      })
    }
  }

  if (!user) {
    return <div>Loading...</div>
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Card>
        <CardHeader>
          <CardTitle>ユーザー情報の編集</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="id">ユーザーID (6桁)</Label>
              <Input
                id="id"
                value={idState}
                onChange={(e) => setId(e.target.value)}
                required
                pattern="\d{6}"
                title="6桁の数字を入力してください"
                disabled
              />
            </div> {/* Update 4 */}
            <div className="space-y-2">
              <Label htmlFor="name">名前</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">メールアドレス</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
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