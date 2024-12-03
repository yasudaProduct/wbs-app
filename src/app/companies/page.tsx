import Link from 'next/link'
import { Button } from "@/components/ui/button"
import prisma from '@/lib/prisma'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Company } from '@prisma/client'

export default async function CompaniesPage() {
  const companies: Company[] = await prisma.company.findMany()

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold">企業一覧</h1>
        <Button asChild>
          <Link href="/companies/new">新規企業登録</Link>
        </Button>
      </div>
      <div className="rounded-md border">
      <Table>
          <TableHeader>
            <TableRow>
              <TableHead>名前</TableHead>
              <TableHead className="text-right"></TableHead>
              </TableRow>
          </TableHeader>
          <TableBody>
          {companies.map((company) => (
            <TableRow key={company.id}>
            <TableCell className="font-medium">{company.name}</TableCell>
            <TableCell className="text-right">
              <Button asChild variant="outline" size="sm">
                <Link href={`/companies/${company.id}/edit`}>編集</Link>
              </Button>
              <Button asChild variant="outline" size="sm">
                <Link href={`/companies/${company.id}`}>詳細</Link>
              </Button>
            </TableCell>
          </TableRow>
          ))}
          </TableBody>
          </Table>
      </div>
    </div>
  )
}

