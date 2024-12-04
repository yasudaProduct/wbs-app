'use client'

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";
import { Label } from "@radix-ui/react-label";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function CreateWBSPage() {
    const params = useParams();
    const router = useRouter()
    const [name, setName] = useState('')  

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        const projectId = params.id;

        const response = await fetch('/api/wbs', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ projectId, name }),
          })

          if (response.ok) {
            toast({
              title: "成功",
              description: "企業が正常に登録されました",
            })
          } else {
            const errorData = await response.json()
            toast({
              title: "エラー",
              description: errorData.error || "企業の登録に失敗しました",
              variant: "destructive",
            })
          }
    }

    return (
        <Card>
        <CardHeader>
          <CardTitle>新規WBS作成</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="projectId">WBS名</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <Button type="submit">WBSを作成</Button>
          </form>
        </CardContent>
      </Card>
    )
}