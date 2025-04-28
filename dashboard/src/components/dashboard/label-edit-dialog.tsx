"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { updateLabel } from "@/services/label-service"

interface LabelEditDialogProps {
  label: {
    id: string
    name: string
    color: string
    createdAt: string
  }
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function LabelEditDialog({ label, open, onOpenChange }: LabelEditDialogProps) {
  const [labelName, setLabelName] = useState(label.name)
  const [selectedColor, setSelectedColor] = useState("#ff0000") // デフォルト色
  const [badgeColor, setBadgeColor] = useState(label.color)

  // 初期カラーを設定
  useEffect(() => {
    // 既存のTailwindクラスから色を抽出してカラーピッカー用に変換
    if (label.color.includes("red")) setSelectedColor("#ef4444")
    else if (label.color.includes("blue")) setSelectedColor("#3b82f6")
    else if (label.color.includes("green")) setSelectedColor("#22c55e")
    else if (label.color.includes("purple")) setSelectedColor("#a855f7")
    else if (label.color.includes("yellow")) setSelectedColor("#eab308")
    else if (label.color.includes("gray")) setSelectedColor("#6b7280")
    else if (label.color.includes("pink")) setSelectedColor("#ec4899")
    else if (label.color.includes("indigo")) setSelectedColor("#6366f1")
  }, [label])

  // カラーピッカーの値が変更されたときにバッジの色を更新
  const handleColorChange = (color: string) => {
    setSelectedColor(color)

    // 色からTailwindクラスを生成
    // 実際のアプリケーションでは、より洗練された方法で色を変換するとよいでしょう
    let newBadgeColor = ""

    // 色に基づいて適切なTailwindクラスを選択
    if (color.startsWith("#f") || color.startsWith("#e")) {
      newBadgeColor = "bg-red-100 text-red-800"
    } else if (color.startsWith("#3") || color.startsWith("#60")) {
      newBadgeColor = "bg-blue-100 text-blue-800"
    } else if (color.startsWith("#2") || color.startsWith("#4")) {
      newBadgeColor = "bg-green-100 text-green-800"
    } else if (color.startsWith("#a") || color.startsWith("#8")) {
      newBadgeColor = "bg-purple-100 text-purple-800"
    } else if (color.startsWith("#ea") || color.startsWith("#f")) {
      newBadgeColor = "bg-yellow-100 text-yellow-800"
    } else if (color.startsWith("#6") || color.startsWith("#7")) {
      newBadgeColor = "bg-gray-100 text-gray-800"
    } else if (color.startsWith("#ec") || color.startsWith("#d")) {
      newBadgeColor = "bg-pink-100 text-pink-800"
    } else {
      newBadgeColor = "bg-indigo-100 text-indigo-800"
    }

    setBadgeColor(newBadgeColor)
  }

  const handleUpdateLabel = async () => {
    if (labelName.trim()) {
      try {
        // サービスを呼び出してラベルを更新
        await updateLabel({
          id: label.id,
          name: labelName,
          color: badgeColor,
        })

        // 成功したらダイアログを閉じる
        onOpenChange(false)
      } catch (error) {
        console.error("ラベルの更新に失敗しました:", error)
        // エラー処理（実際の実装ではエラーメッセージを表示するなど）
      }
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>ラベル編集</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="label-name">ラベル名</Label>
            <Input
              id="label-name"
              value={labelName}
              onChange={(e) => setLabelName(e.target.value)}
              placeholder="ラベル名を入力"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="label-color">ラベル色</Label>
            <div className="flex items-center gap-4">
              <Input
                id="label-color"
                type="color"
                value={selectedColor}
                onChange={(e) => handleColorChange(e.target.value)}
                className="w-16 h-10 p-1 cursor-pointer"
              />
              <div className="flex-1">
                <p className="text-sm text-muted-foreground mb-1">色を選択してください</p>
                <div className="flex gap-2">
                  {["#ef4444", "#3b82f6", "#22c55e", "#a855f7", "#eab308", "#6b7280"].map((color) => (
                    <div
                      key={color}
                      className="w-6 h-6 rounded-full cursor-pointer border"
                      style={{ backgroundColor: color }}
                      onClick={() => handleColorChange(color)}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
          <div className="mt-2">
            <Label>プレビュー</Label>
            <div className="mt-1">
              <Badge className={badgeColor}>{labelName || "ラベル名"}</Badge>
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            キャンセル
          </Button>
          <Button onClick={handleUpdateLabel} disabled={!labelName.trim()}>
            更新
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
