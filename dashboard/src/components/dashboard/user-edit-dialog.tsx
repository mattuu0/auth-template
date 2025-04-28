"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { X, Camera } from "lucide-react"

// ラベルの色マッピング
const labelColors: Record<string, string> = {
  管理者: "bg-red-100 text-red-800",
  一般ユーザー: "bg-blue-100 text-blue-800",
  プレミアム: "bg-purple-100 text-purple-800",
  ベータテスター: "bg-green-100 text-green-800",
}

// 利用可能なすべてのラベル
const availableLabels = ["管理者", "一般ユーザー", "プレミアム", "ベータテスター"]

// プロバイダーの表示名マッピング
const providerNames: Record<string, string> = {
  google: "Google",
  github: "GitHub",
  microsoft: "Microsoft",
  discord: "Discord",
  basic: "Basic",
}

interface UserEditDialogProps {
  user: {
    id: string
    name: string
    email: string
    provider: string
    providerId: string
    avatar: string
    labels: string[]
    createdAt: string
    banned: boolean
  }
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function UserEditDialog({ user, open, onOpenChange }: UserEditDialogProps) {
  const [name, setName] = useState(user.name)
  const [avatar, setAvatar] = useState(user.avatar)
  const [selectedLabels, setSelectedLabels] = useState<string[]>(user.labels)
  const [selectedLabel, setSelectedLabel] = useState<string>("")
  const [previewImage, setPreviewImage] = useState<string | null>(user.avatar)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleAddLabel = () => {
    if (selectedLabel && !selectedLabels.includes(selectedLabel)) {
      setSelectedLabels([...selectedLabels, selectedLabel])
      setSelectedLabel("")
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

  const handleSave = () => {
    // 実際の実装ではサービスを呼び出してユーザー情報を更新
    console.log("Save user:", {
      id: user.id,
      name,
      avatar,
      labels: selectedLabels,
    })
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>ユーザー編集</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="flex flex-col items-center gap-4">
            <div className="relative">
              <Avatar className="h-24 w-24">
                <AvatarImage src={previewImage || "/placeholder.svg"} alt={name} />
                <AvatarFallback>{name.substring(0, 2)}</AvatarFallback>
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
            <Label htmlFor="user-id">ユーザーID</Label>
            <Input id="user-id" value={user.id} disabled />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="user-name">ユーザー名</Label>
            <Input id="user-name" value={name} onChange={(e) => setName(e.target.value)} />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="provider">認証プロバイダ</Label>
            <Input id="provider" value={providerNames[user.provider]} disabled />
          </div>

          <div className="grid gap-2">
            <Label>ラベル</Label>
            <div className="flex flex-wrap gap-2 mb-2">
              {selectedLabels.map((label) => (
                <Badge key={label} className={`${labelColors[label] || "bg-gray-100 text-gray-800"} pl-2 pr-1 py-1`}>
                  {label}
                  <Button variant="ghost" size="icon" className="h-4 w-4 ml-1" onClick={() => handleRemoveLabel(label)}>
                    <X className="h-3 w-3" />
                  </Button>
                </Badge>
              ))}
            </div>
            <div className="flex gap-2">
              <Select value={selectedLabel} onValueChange={setSelectedLabel}>
                <SelectTrigger className="flex-1">
                  <SelectValue placeholder="ラベルを選択" />
                </SelectTrigger>
                <SelectContent>
                  {availableLabels
                    .filter((label) => !selectedLabels.includes(label))
                    .map((label) => (
                      <SelectItem key={label} value={label}>
                        {label}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
              <Button type="button" onClick={handleAddLabel} disabled={!selectedLabel}>
                追加
              </Button>
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            キャンセル
          </Button>
          <Button onClick={handleSave}>保存</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
