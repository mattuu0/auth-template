"use client"

import { useState, useEffect } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuCheckboxItem,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { UserEditDialog } from "@/components/dashboard/user-edit-dialog"
import { Copy, Search, SlidersHorizontal, Ban, CheckCircle, Pencil, LogIn } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { getUsers, searchUsers, toggleUserBan } from "@/services/user-service"

// プロバイダーの表示名マッピング
const providerNames: Record<string, string> = {
  google: "Google",
  github: "GitHub",
  microsoft: "Microsoft",
  discord: "Discord",
  basic: "Basic",
}

// ラベルの色マッピング
const labelColors: Record<string, string> = {
  管理者: "bg-red-100 text-red-800",
  一般ユーザー: "bg-blue-100 text-blue-800",
  プレミアム: "bg-purple-100 text-purple-800",
  ベータテスター: "bg-green-100 text-green-800",
}

type Column = {
  id: string
  label: string
  visible: boolean
}

export function UserTable() {
  const [users, setUsers] = useState<any[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedProvider, setSelectedProvider] = useState<string>("")
  const [selectedLabel, setSelectedLabel] = useState<string>("")
  const [editingUser, setEditingUser] = useState<any | null>(null)
  const [loading, setLoading] = useState(true)

  // 表示する列の設定（デフォルトでアイコンも表示）
  const [columns, setColumns] = useState<Column[]>([
    { id: "avatar", label: "アイコン", visible: true },
    { id: "id", label: "ユーザーID", visible: false },
    { id: "name", label: "ユーザー名", visible: true },
    { id: "email", label: "メールアドレス", visible: true },
    { id: "provider", label: "プロバイダ", visible: false },
    { id: "providerId", label: "プロバイダID", visible: false },
    { id: "labels", label: "ラベル", visible: true },
    { id: "createdAt", label: "作成日", visible: true },
    { id: "actions", label: "操作", visible: true },
  ])

  // ユーザーデータの取得
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true)
        const data = await getUsers()
        setUsers(data)
      } catch (error) {
        console.error("ユーザーデータの取得に失敗しました:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchUsers()
  }, [])

  // 検索処理
  useEffect(() => {
    const handleSearch = async () => {
      console.log(searchTerm);
      console.log(selectedProvider);
      console.log(selectedLabel);

      if (!searchTerm && !selectedProvider && !selectedLabel) {
        // フィルターがなければ全ユーザーを取得
        const data = await getUsers()
        setUsers(data)
        return
      }

      try {
        setLoading(true)
        const data = await searchUsers(searchTerm)

        // クライアント側でさらにフィルタリング
        const filtered = data.filter((user) => {
          let matchesProvider = false;
          if (user.provider === selectedProvider || selectedProvider == "all") {
            matchesProvider = true;
          }

          let matchesLabel = false;
          if (user.labels.includes(selectedLabel) || selectedLabel == "all") {
            matchesLabel = true;
          }

          return matchesProvider && matchesLabel
        })

        setUsers(filtered)
      } catch (error) {
        console.error("ユーザー検索に失敗しました:", error)
      } finally {
        setLoading(false)
      }
    }

    // 検索処理を実行（実際のアプリではデバウンスを実装するとよい）
    const timer = setTimeout(handleSearch, 300)
    return () => clearTimeout(timer)
  }, [searchTerm, selectedProvider, selectedLabel])

  // 列の表示/非表示を切り替える
  const toggleColumn = (columnId: string) => {
    setColumns(columns.map((column) => (column.id === columnId ? { ...column, visible: !column.visible } : column)))
  }

  // テキストをクリップボードにコピー
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
  }

  // BANステータスの切り替え
  const handleToggleBan = async (userId: string) => {
    try {
      // サービスを呼び出してBANステータスを切り替え
      const updatedUser = await toggleUserBan(userId)

      // ユーザーリストを更新
      setUsers(users.map((user) => (user.id === userId ? { ...user, banned: updatedUser.banned } : user)))
    } catch (error) {
      console.error("BANステータスの切り替えに失敗しました:", error)
    }
  }

  // ユーザーとしてログイン
  const loginAsUser = async (userId: string) => {
    try {
      // サービスを呼び出してユーザーとしてログイン
      // 実際の実装ではサービス関数を呼び出す
      console.log(`Login as user: ${userId}`)
      // 例: await loginAs(userId)

      // 成功したらリダイレクトなど
      // window.location.href = '/dashboard'
    } catch (error) {
      console.error("ユーザーとしてのログインに失敗しました:", error)
    }
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
            placeholder="ユーザー名、メール、IDで検索..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex flex-wrap gap-2">
          <div className={isMobile ? "w-full" : "w-40"}>
            <Select value={selectedProvider} onValueChange={setSelectedProvider}>
              <SelectTrigger>
                <SelectValue placeholder="プロバイダ" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">すべて</SelectItem>
                <SelectItem value="google">Google</SelectItem>
                <SelectItem value="github">GitHub</SelectItem>
                <SelectItem value="microsoft">Microsoft</SelectItem>
                <SelectItem value="discord">Discord</SelectItem>
                <SelectItem value="basic">Basic</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className={isMobile ? "w-full" : "w-40"}>
            <Select value={selectedLabel} onValueChange={setSelectedLabel}>
              <SelectTrigger>
                <SelectValue placeholder="ラベル" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">すべて</SelectItem>
                <SelectItem value="管理者">管理者</SelectItem>
                <SelectItem value="一般ユーザー">一般ユーザー</SelectItem>
                <SelectItem value="プレミアム">プレミアム</SelectItem>
                <SelectItem value="ベータテスター">ベータテスター</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon">
                <SlidersHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuItem className="font-semibold">表示項目</DropdownMenuItem>
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
      </div>

      <div className="rounded-md border shadow-sm overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50">
              {columns.find((c) => c.id === "avatar")?.visible && <TableHead className="w-[50px]"></TableHead>}
              {columns.find((c) => c.id === "id")?.visible && <TableHead>ユーザーID</TableHead>}
              {columns.find((c) => c.id === "name")?.visible && <TableHead>ユーザー名</TableHead>}
              {columns.find((c) => c.id === "email")?.visible && <TableHead>メールアドレス</TableHead>}
              {columns.find((c) => c.id === "provider")?.visible && <TableHead>プロバイダ</TableHead>}
              {columns.find((c) => c.id === "providerId")?.visible && <TableHead>プロバイダID</TableHead>}
              {columns.find((c) => c.id === "labels")?.visible && <TableHead>ラベル</TableHead>}
              {columns.find((c) => c.id === "createdAt")?.visible && <TableHead>作成日</TableHead>}
              {columns.find((c) => c.id === "actions")?.visible && <TableHead className="w-[120px]">操作</TableHead>}
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              // ローディング状態
              Array(5)
                .fill(0)
                .map((_, index) => (
                  <TableRow key={`loading-${index}`}>
                    {columns
                      .filter((c) => c.visible)
                      .map((column, colIndex) => (
                        <TableCell key={`loading-cell-${colIndex}`}>
                          <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                        </TableCell>
                      ))}
                  </TableRow>
                ))
            ) : users.length > 0 ? (
              users.map((user) => (
                <TableRow key={user.id}>
                  {columns.find((c) => c.id === "avatar")?.visible && (
                    <TableCell>
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.name} />
                        <AvatarFallback>{user.name.substring(0, 2)}</AvatarFallback>
                      </Avatar>
                    </TableCell>
                  )}
                  {columns.find((c) => c.id === "id")?.visible && (
                    <TableCell className="font-mono text-sm">
                      <div className="flex items-center gap-1">
                        {user.id}
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6"
                          onClick={() => copyToClipboard(user.id)}
                        >
                          <Copy className="h-3 w-3" />
                        </Button>
                      </div>
                    </TableCell>
                  )}
                  {columns.find((c) => c.id === "name")?.visible && <TableCell>{user.name}</TableCell>}
                  {columns.find((c) => c.id === "email")?.visible && <TableCell>{user.email}</TableCell>}
                  {columns.find((c) => c.id === "provider")?.visible && (
                    <TableCell>{providerNames[user.provider]}</TableCell>
                  )}
                  {columns.find((c) => c.id === "providerId")?.visible && (
                    <TableCell className="font-mono text-sm">
                      <div className="flex items-center gap-1">
                        {user.providerId}
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6"
                          onClick={() => copyToClipboard(user.providerId)}
                        >
                          <Copy className="h-3 w-3" />
                        </Button>
                      </div>
                    </TableCell>
                  )}
                  {columns.find((c) => c.id === "labels")?.visible && (
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {user.labels.map((label: string) => (
                          <Badge key={label} className={labelColors[label] || "bg-gray-100 text-gray-800"}>
                            {label}
                          </Badge>
                        ))}
                      </div>
                    </TableCell>
                  )}
                  {columns.find((c) => c.id === "createdAt")?.visible && <TableCell>{user.createdAt}</TableCell>}
                  {columns.find((c) => c.id === "actions")?.visible && (
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleToggleBan(user.id)}
                                className={
                                  user.banned
                                    ? "text-red-500 hover:text-red-600"
                                    : "text-green-500 hover:text-green-600"
                                }
                              >
                                {user.banned ? <Ban className="h-4 w-4" /> : <CheckCircle className="h-4 w-4" />}
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>{user.banned ? "BANを解除" : "BANする"}</TooltipContent>
                          </Tooltip>
                        </TooltipProvider>

                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => setEditingUser(user)}
                                className="text-blue-500 hover:text-blue-600"
                              >
                                <Pencil className="h-4 w-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>編集</TooltipContent>
                          </Tooltip>
                        </TooltipProvider>

                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => loginAsUser(user.id)}
                                className="text-purple-500 hover:text-purple-600"
                              >
                                <LogIn className="h-4 w-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>このユーザーとしてログイン</TooltipContent>
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
                  該当するユーザーが見つかりませんでした。
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {editingUser && (
        <UserEditDialog
          user={editingUser}
          open={!!editingUser}
          onOpenChange={(open) => !open && setEditingUser(null)}
        />
      )}
    </div>
  )
}
