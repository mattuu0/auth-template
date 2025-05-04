"use client"

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Trash2, Loader2, AlertCircle, Copy, Check, Filter, SlidersHorizontal } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { deleteSession } from "@/services/session-service"
import { Skeleton } from "@/components/ui/skeleton"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { SessionDeleteDialog } from "@/components/dashboard/session-delete-dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuCheckboxItem,
} from "@/components/ui/dropdown-menu"
import { useRouter } from "next/navigation"

interface SessionTableProps {
  sessions: any[]
  loading: boolean
  users: any[]
}

type Column = {
  id: string
  label: string
  visible: boolean
}

export function SessionTable({ sessions, loading, users }: SessionTableProps) {
  const router = useRouter()
  const [actionInProgress, setActionInProgress] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [sessionToDelete, setSessionToDelete] = useState<any | null>(null)
  const [copied, setCopied] = useState<Record<string, boolean>>({})

  // 表示する列の設定（デフォルトでユーザーIDは非表示）
  const [columns, setColumns] = useState<Column[]>([
    { id: "sessionId", label: "セッションID", visible: true },
    { id: "userId", label: "ユーザーID", visible: false },
    { id: "ipAddress", label: "IPアドレス", visible: true },
    { id: "userAgent", label: "ユーザーエージェント", visible: true },
    { id: "createdAt", label: "作成日時", visible: true },
    { id: "expiresAt", label: "有効期限", visible: true },
    { id: "actions", label: "操作", visible: true },
  ])

  // 列の表示/非表示を切り替える
  const toggleColumn = (columnId: string) => {
    setColumns(columns.map((column) => (column.id === columnId ? { ...column, visible: !column.visible } : column)))
  }

  // ユーザー名を取得
  const getUserName = (userId: string) => {
    const user = users.find((u) => u.id === userId)
    return user ? user.name : "不明なユーザー"
  }

  // セッションの削除
  const handleDeleteSession = async (sessionId: string) => {
    try {
      setActionInProgress(sessionId)
      setError(null)
      await deleteSession(sessionId)
      // 成功したら親コンポーネントに通知（実際の実装では必要に応じて実装）
      // onSessionDeleted()
    } catch (error) {
      console.error("セッションの削除に失敗しました:", error)
      setError("セッションの削除に失敗しました")
    } finally {
      setActionInProgress(null)
    }
  }

  // 削除ダイアログを表示
  const openDeleteDialog = (session: any) => {
    setSessionToDelete(session)
    setDeleteDialogOpen(true)
  }

  // ユーザーでフィルター
  const filterByUser = (userId: string) => {
    router.push(`/dashboard/sessions?userId=${userId}`)
  }

  // テキストをクリップボードにコピー
  const copyToClipboard = (text: string, field: string) => {
    navigator.clipboard.writeText(text)
    setCopied({ ...copied, [field]: true })
    setTimeout(() => {
      setCopied({ ...copied, [field]: false })
    }, 2000)
  }

  // ユーザーエージェントを短縮表示
  const formatUserAgent = (userAgent: string) => {
    if (userAgent.length > 50) {
      return userAgent.substring(0, 50) + "..."
    }
    return userAgent
  }

  // 日時をフォーマット
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleString("ja-JP", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  // ローディング中のスケルトン表示
  const renderSkeletonRow = (index: number) => {
    return (
      <TableRow key={`skeleton-row-${index}`}>
        {columns
          .filter((c) => c.visible)
          .map((column) => (
            <TableCell key={`skeleton-${index}-${column.id}`}>
              {column.id === "actions" ? (
                <div className="flex justify-end">
                  <Skeleton className="h-8 w-8 rounded-md" />
                  <Skeleton className="h-8 w-8 rounded-md ml-2" />
                </div>
              ) : (
                <Skeleton className="h-5 w-full" />
              )}
            </TableCell>
          ))}
      </TableRow>
    )
  }

  return (
    <div className="space-y-4">
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="flex justify-end">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="ml-auto">
              <SlidersHorizontal className="h-4 w-4 mr-2" />
              表示項目
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            {columns.map((column) => (
              <DropdownMenuCheckboxItem
                key={column.id}
                checked={column.visible}
                onCheckedChange={() => toggleColumn(column.id)}
              >
                {column.label}
              </DropdownMenuCheckboxItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="rounded-md border shadow-sm overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50">
              {columns.find((c) => c.id === "sessionId" && c.visible) && <TableHead>セッションID</TableHead>}
              {columns.find((c) => c.id === "userId" && c.visible) && <TableHead>ユーザーID</TableHead>}
              {columns.find((c) => c.id === "ipAddress" && c.visible) && <TableHead>IPアドレス</TableHead>}
              {columns.find((c) => c.id === "userAgent" && c.visible) && <TableHead>ユーザーエージェント</TableHead>}
              {columns.find((c) => c.id === "createdAt" && c.visible) && <TableHead>作成日時</TableHead>}
              {columns.find((c) => c.id === "expiresAt" && c.visible) && <TableHead>有効期限</TableHead>}
              {columns.find((c) => c.id === "actions" && c.visible) && (
                <TableHead className="text-right">操作</TableHead>
              )}
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              // ローディング状態
              Array(5)
                .fill(0)
                .map((_, index) => renderSkeletonRow(index))
            ) : sessions.length > 0 ? (
              sessions.map((session) => (
                <TableRow key={session.id}>
                  {columns.find((c) => c.id === "sessionId" && c.visible) && (
                    <TableCell>
                      <div className="flex items-center">
                        <span className="font-mono text-sm">{session.id}</span>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-6 w-6 ml-1"
                                onClick={() => copyToClipboard(session.id, `sessionId-${session.id}`)}
                              >
                                {copied[`sessionId-${session.id}`] ? (
                                  <Check className="h-3 w-3" />
                                ) : (
                                  <Copy className="h-3 w-3" />
                                )}
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              {copied[`sessionId-${session.id}`] ? "コピーしました" : "コピー"}
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                    </TableCell>
                  )}
                  {columns.find((c) => c.id === "userId" && c.visible) && (
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="font-mono text-xs">{session.userId}</span>
                        <span className="text-xs text-muted-foreground">{getUserName(session.userId)}</span>
                      </div>
                    </TableCell>
                  )}
                  {columns.find((c) => c.id === "ipAddress" && c.visible) && (
                    <TableCell>
                      <div className="flex items-center">
                        <span>{session.ipAddress}</span>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-6 w-6 ml-1"
                                onClick={() => copyToClipboard(session.ipAddress, `ipAddress-${session.id}`)}
                              >
                                {copied[`ipAddress-${session.id}`] ? (
                                  <Check className="h-3 w-3" />
                                ) : (
                                  <Copy className="h-3 w-3" />
                                )}
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              {copied[`ipAddress-${session.id}`] ? "コピーしました" : "コピー"}
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                    </TableCell>
                  )}
                  {columns.find((c) => c.id === "userAgent" && c.visible) && (
                    <TableCell>
                      <div className="flex items-center">
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <span className="cursor-help truncate max-w-[200px]">
                                {formatUserAgent(session.userAgent)}
                              </span>
                            </TooltipTrigger>
                            <TooltipContent className="max-w-md">
                              <p className="text-xs">{session.userAgent}</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-6 w-6 ml-1"
                                onClick={() => copyToClipboard(session.userAgent, `userAgent-${session.id}`)}
                              >
                                {copied[`userAgent-${session.id}`] ? (
                                  <Check className="h-3 w-3" />
                                ) : (
                                  <Copy className="h-3 w-3" />
                                )}
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              {copied[`userAgent-${session.id}`] ? "コピーしました" : "コピー"}
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                    </TableCell>
                  )}
                  {columns.find((c) => c.id === "createdAt" && c.visible) && (
                    <TableCell>{formatDate(session.createdAt)}</TableCell>
                  )}
                  {columns.find((c) => c.id === "expiresAt" && c.visible) && (
                    <TableCell>{formatDate(session.expiresAt)}</TableCell>
                  )}
                  {columns.find((c) => c.id === "actions" && c.visible) && (
                    <TableCell className="text-right">
                      <div className="flex justify-end items-center space-x-2">
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => filterByUser(session.userId)}
                                className="text-blue-500 hover:text-blue-600"
                              >
                                <Filter className="h-4 w-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>このユーザーでフィルター</TooltipContent>
                          </Tooltip>
                        </TooltipProvider>

                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => openDeleteDialog(session)}
                                className="text-red-500 hover:text-red-600"
                                disabled={actionInProgress === session.id}
                              >
                                {actionInProgress === session.id ? (
                                  <Loader2 className="h-4 w-4 animate-spin" />
                                ) : (
                                  <Trash2 className="h-4 w-4" />
                                )}
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>セッションを削除</TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                    </TableCell>
                  )}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.filter((c) => c.visible).length} className="h-24 text-center">
                  該当するセッションが見つかりませんでした。
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {sessionToDelete && (
        <SessionDeleteDialog
          session={sessionToDelete}
          open={deleteDialogOpen}
          onOpenChange={setDeleteDialogOpen}
          onConfirm={() => handleDeleteSession(sessionToDelete.id)}
        />
      )}
    </div>
  )
}
