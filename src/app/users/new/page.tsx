'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { toast } from '@/hooks/use-toast'

export default function NewUserPage() {
  const router = useRouter()
  const [id, setId] = useState('')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const response = await fetch('/api/users', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ id: parseInt(id), name, email }),
    })

    if (response.ok) {
      router.push('/users')
      toast({
        title: "成功",
        description: "ユーザーが正常に登録されました",
      })
    } else {
      const errorData = await response.json()
      toast({
        title: "エラー",
        description: errorData.error || "ユーザーの登録に失敗しました",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Card>
        <CardHeader>
          <CardTitle>新規ユーザー登録</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="id">ユーザーID (6桁)</Label>
              <Input
                id="id"
                value={id}
                onChange={(e) => setId(e.target.value)}
                required
                pattern="\d{6}"
                title="6桁の数字を入力してください"
              />
            </div>
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
            <Button type="submit">登録</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

