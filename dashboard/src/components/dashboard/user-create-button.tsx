"use client"

import { DialogTrigger } from "@/components/ui/dialog"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { X, Camera, Plus, Loader2 } from "lucide-react"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn, sanitizeInput } from "@/lib/utils"
import { createUser } from "@/services/user-service"
import { getLabels } from "@/services/label-service"

interface UserCreateButtonProps {
  onUserCreated?: () => void
}

export function UserCreateButton({ onUserCreated }: UserCreateButtonProps) {
  const [open, setOpen] = useState(false)
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [avatar, setAvatar] = useState("/placeholder.svg?height=40&width=40")
  const [selectedLabels, setSelectedLabels] = useState<string[]>([])
  const [previewImage, setPreviewImage] = useState<string | null>("/placeholder.svg?height=40&width=40")
  const [commandOpen, setCommandOpen] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [availableLabels, setAvailableLabels] = useState<Array<{ id: string; name: string; color: string }>>([])
  const [loadingLabels, setLoadingLabels] = useState(true)
  const [creating, setCreating] = useState(false)

  // ラベル一覧を取得
  const fetchLabels = async () => {
    try {
      setLoadingLabels(true)
      const labels = await getLabels()
      setAvailableLabels(labels)
    } catch (error) {
      console.error("ラベルの取得に失敗しました:", error)
    } finally {
      setLoadingLabels(false)
    }
  }

  useEffect(() => {
    if (open) {
      fetchLabels()
    }
  }, [open])

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen)
    if (!newOpen) {
      resetForm()
    }
  }

  const handleRemoveLabel = (label: string) => {
    setSelectedLabels(selectedLabels.filter((l) => l !== label))
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // ファイルをBase64に変換してプレビュー表示
      const reader = new FileReader()
      reader.onload = (event) => {
        if (event.target?.result) {
          setPreviewImage(event.target.result as string)
          // 実際の実装では、ここでアップロードサービスを呼び出し、
          // 返されたURLをavatarにセットします
          setAvatar(event.target.result as string)
        }
      }
      reader.readAsDataURL(file)
    }
  }

  const triggerFileInput = () => {
    fileInputRef.current?.click()
  }

  // 色に基づいてテキスト色を決定（コントラスト確保のため）
  const getTextColor = (bgColor: string) => {
    // 16進数の色コードをRGBに変換
    const r = Number.parseInt(bgColor.slice(1, 3), 16)
    const g = Number.parseInt(bgColor.slice(3, 5), 16)
    const b = Number.parseInt(bgColor.slice(5, 7), 16)

    // 明るさを計算（YIQ方式）
    const yiq = (r * 299 + g * 587 + b * 114) / 1000

    // 明るさに基づいてテキスト色を返す
    return yiq >= 128 ? "#000000" : "#ffffff"
  }

  const resetForm = () => {
    setName("")
    setEmail("")
    setAvatar("/placeholder.svg?height=40&width=40")
    setSelectedLabels([])
    setPreviewImage("/placeholder.svg?height=40&width=40")
  }

  const handleCreate = async () => {
    if (!name.trim() || !email.trim()) {
      alert("ユーザー名とメールアドレスは必須です")
      return
    }

    try {
      setCreating(true)
      // 入力値のサニタイズ
      const sanitizedName = sanitizeInput(name)
      const sanitizedEmail = sanitizeInput(email)

      // サービスを呼び出してユーザーを作成
      await createUser({
        name: sanitizedName,
        email: sanitizedEmail,
        provider: "basic",
        providerId: `basic_${Date.now()}`,
        avatar,
        labels: selectedLabels,
      })

      // 成功したらフォームをリセットしてダイアログを閉じる
      resetForm()
      setOpen(false)

      // 親コンポーネントに通知
      if (onUserCreated) {
        onUserCreated()
      }
    } catch (error) {
      console.error("ユーザーの作成に失敗しました:", error)
      alert("ユーザーの作成に失敗しました")
    } finally {
      setCreating(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          ユーザー作成
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[700px]">
        <DialogHeader>
          <DialogTitle>ユーザー作成</DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* 左側カラム */}
          <div className="space-y-4">
            <div className="flex flex-col items-center gap-4">
              <div className="relative">
                <Avatar className="h-24 w-24">
                  <AvatarImage src={previewImage || "/placeholder.svg"} alt={name} />
                  <AvatarFallback>{name.substring(0, 2) || "U"}</AvatarFallback>
                </Avatar>
                <Button
                  type="button"
                  size="icon"
                  className="absolute bottom-0 right-0 rounded-full bg-primary text-primary-foreground"
                  onClick={triggerFileInput}
                >
                  <Camera className="h-4 w-4" />
                </Button>
                <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileChange} />
              </div>
              <div className="text-center text-sm text-muted-foreground">クリックしてアイコン画像をアップロード</div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="user-name">ユーザー名</Label>
              <Input id="user-name" value={name} onChange={(e) => setName(e.target.value)} />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="user-email">メールアドレス</Label>
              <Input id="user-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
          </div>

          {/* 右側カラム */}
          <div className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="provider">認証プロバイダ</Label>
              <Input id="provider" value="Basic" disabled />
            </div>

            <div className="grid gap-2">
              <Label>ラベル</Label>
              {loadingLabels ? (
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="h-6 w-16 rounded-full bg-gray-200 animate-pulse"></div>
                    <div className="h-6 w-20 rounded-full bg-gray-200 animate-pulse"></div>
                  </div>
                  <div className="h-10 w-full bg-gray-200 rounded animate-pulse"></div>
                </div>
              ) : (
                <>
                  <div className="flex flex-wrap gap-2 mb-2 min-h-[36px]">
                    {selectedLabels.map((labelId) => {
                      const labelInfo = availableLabels.find((label) => label.id === labelId)
                      return labelInfo ? (
                        <Badge
                          key={labelId}
                          className="pl-2 pr-1 py-1"
                          style={{
                            backgroundColor: labelInfo.color || "#6b7280",
                            color: labelInfo.color ? getTextColor(labelInfo.color) : "#ffffff",
                          }}
                        >
                          {labelInfo.name}
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-4 w-4 ml-1"
                            onClick={() => handleRemoveLabel(labelId)}
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </Badge>
                      ) : null
                    })}
                  </div>
                  <Popover open={commandOpen} onOpenChange={setCommandOpen}>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="w-full justify-between">
                        <span>ラベルを追加</span>
                        <Plus className="h-4 w-4 opacity-50" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="p-0" align="start" side="bottom" sideOffset={5}>
                      <Command>
                        <CommandInput placeholder="ラベルを検索..." />
                        <CommandList>
                          <CommandEmpty>ラベルが見つかりません</CommandEmpty>
                          <CommandGroup>
                            {availableLabels
                              .filter((label) => !selectedLabels.includes(label.id))
                              .map((label) => (
                                <CommandItem
                                  key={label.id}
                                  onSelect={() => {
                                    setSelectedLabels([...selectedLabels, label.id])
                                    setCommandOpen(false)
                                  }}
                                >
                                  <Badge
                                    className={cn("mr-2")}
                                    style={{
                                      backgroundColor: label.color,
                                      color: getTextColor(label.color),
                                    }}
                                  >
                                    {label.name}
                                  </Badge>
                                  <span>{label.name}</span>
                                </CommandItem>
                              ))}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                </>
              )}
            </div>
          </div>
        </div>
        <DialogFooter className="mt-4">
          <Button variant="outline" onClick={() => setOpen(false)} disabled={creating}>
            キャンセル
          </Button>
          <Button onClick={handleCreate} disabled={creating}>
            {creating ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                作成中...
              </>
            ) : (
              "作成"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
