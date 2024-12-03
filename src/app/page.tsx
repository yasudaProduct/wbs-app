import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">WBS</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border-none">
          <CardHeader>
            <CardTitle>プロジェクト</CardTitle>
            <CardDescription></CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild className="w-full">
              <Link href="/projects">プロジェクト一覧</Link>
            </Button>
            <Button asChild className="w-full my-10">
              <Link href="/phase-templates">工程テンプレート</Link>
            </Button>
          </CardContent>
        </Card>
        <Card className="border-none">
          <CardHeader>
            <CardTitle>企業</CardTitle>
            <CardDescription></CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild className="w-full">
              <Link href="/companies">企業一覧</Link>
            </Button>
          </CardContent>
        </Card>
        <Card className="border-none">
          <CardHeader>
            <CardTitle>ユーザー</CardTitle>
            <CardDescription></CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild className="w-full">
              <Link href="/users">ユーザー一覧</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

