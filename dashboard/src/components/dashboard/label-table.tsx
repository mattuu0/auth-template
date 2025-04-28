"use client"

import { useState, useEffect } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Pencil, Search, SlidersHorizontal, Trash2 } from "lucide-react"
import { LabelEditDialog } from "@/components/dashboard/label-edit-dialog"
import { getLabels, searchLabels, deleteLabel } from "@/services/label-service"

export function LabelTable() {
  const [labels, setLabels] = useState<any[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [editingLabel, setEditingLabel] = useState<any | null>(null)
  const [loading, setLoading] = useState(true)

  // ラベルデータの取得
  useEffect(() => {
    const fetchLabels = async () => {
      try {
        setLoading(true)
        const data = await getLabels()
        setLabels(data)
      } catch (error) {
        console.error("ラベルデータの取得に失敗しました:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchLabels()
  }, [])

  // 検索処理
  useEffect(() => {
    const handleSearch = async () => {
      if (!searchTerm) {
        // 検索語がなければ全ラベルを取得
        const data = await getLabels()
        setLabels(data)
        return
      }

      try {
        setLoading(true)
        const data = await searchLabels(searchTerm)
        setLabels(data)
      } catch (error) {
        console.error("ラベル検索に失敗しました:", error)
      } finally {
        setLoading(false)
      }
    }

    // 検索処理を実行（実際のアプリではデバウンスを実装するとよい）
    const timer = setTimeout(handleSearch, 300)
    return () => clearTimeout(timer)
  }, [searchTerm])

  // ラベルの削除
  const handleDeleteLabel = async (labelId: string) => {
    try {
      // サービスを呼び出してラベルを削除
      await deleteLabel(labelId)

      // 成功したらラベルリストを更新
      setLabels(labels.filter((label) => label.id !== labelId))
    } catch (error) {
      console.error("ラベルの削除に失敗しました:", error)
    }
  }

  // ラベルの編集
  const handleEditLabel = (label: any) => {
    setEditingLabel(label)
  }

  // レスポンシブ対応
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }

    // 初期チェック
    checkIsMobile()

    // リサイズイベントのリスナーを追加
    window.addEventListener("resize", checkIsMobile)

    // クリーンアップ
    return () => window.removeEventListener("resize", checkIsMobile)
  }, [])

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
          <Input
            placeholder="ラベル名で検索..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Button variant="outline" size="icon">
          <SlidersHorizontal className="h-4 w-4" />
        </Button>
      </div>

      <div className="rounded-md border shadow-sm overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50">
              <TableHead>ラベル名</TableHead>
              <TableHead>ラベル色</TableHead>
              <TableHead>作成日</TableHead>
              <TableHead className="w-[100px]">操作</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              // ローディング状態
              Array(3)
                .fill(0)
                .map((_, index) => (
                  <TableRow key={`loading-${index}`}>
                    <TableCell>
                      <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                    </TableCell>
                    <TableCell>
                      <div className="h-6 w-20 bg-gray-200 rounded animate-pulse"></div>
                    </TableCell>
                    <TableCell>
                      <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                    </TableCell>
                    <TableCell>
                      <div className="h-8 w-16 bg-gray-200 rounded animate-pulse"></div>
                    </TableCell>
                  </TableRow>
                ))
            ) : labels.length > 0 ? (
              labels.map((label) => (
                <TableRow key={label.id}>
                  <TableCell>{label.name}</TableCell>
                  <TableCell>
                    <Badge className={label.color}>{label.name}</Badge>
                  </TableCell>
                  <TableCell>{label.createdAt}</TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEditLabel(label)}
                        className="text-blue-500 hover:text-blue-600"
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDeleteLabel(label.id)}
                        className="text-red-500 hover:text-red-600"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={4} className="h-24 text-center">
                  該当するラベルが見つかりませんでした。
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {editingLabel && (
        <LabelEditDialog
          label={editingLabel}
          open={!!editingLabel}
          onOpenChange={(open) => !open && setEditingLabel(null)}
        />
      )}
    </div>
  )
}
