
import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import prisma from '@/lib/prisma'
import { User } from '@/types/project'

export default async function UsersPage() {
  const users: User[] = await prisma.user.findMany()

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold">ユーザー一覧</h1>
        <Button asChild>
          <Link href="/users/new">新規ユーザー登録</Link>
        </Button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {users.map((user) => (
          <Card key={user.id}>
            <CardHeader>
              <CardTitle>{user.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-500 mb-4">{user.email}</p>
              <Button asChild className="w-full">
                <Link href={`/users/${user.id}/edit`}>編集</Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

