import Link from 'next/link'
import { Button } from "@/components/ui/button"

export function Header() {
  return (
    <header className="bg-primary text-primary-foreground">
      <div className="container mx-auto px-4 py-4">
        <nav className="flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold">WBS Tool</Link>
          <ul className="flex space-x-4">
            <li>
              <Button variant="ghost" asChild>
                <Link href="/">ホーム</Link>
              </Button>
            </li>
            <li>
              <Button variant="ghost" asChild>
                <Link href="/projects">プロジェクト</Link>
              </Button>
            </li>
            <li>
              <Button variant="ghost" asChild>
                <Link href="/wbs">WBS</Link>
              </Button>
            </li>
            <li>
              <Button variant="ghost" asChild>
                <Link href="/phase-templates">フェーズテンプレート</Link>
              </Button>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  )
}