"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Plus } from "lucide-react"
import { Badge } from "@/components/ui/badge"

// 利用可能な色のリスト
const colorOptions = [
  { name: "赤", value: "bg-red-100 text-red-800" },
  { name: "青", value: "bg-blue-100 text-blue-800" },
  { name: "緑", value: "bg-green-100 text-green-800" },
  { name: "紫", value: "bg-purple-100 text-purple-800" },
  { name: "黄", value: "bg-yellow-100 text-yellow-800" },
  { name: "灰色", value: "bg-gray-100 text-gray-800" },
  { name: "ピンク", value: "bg-pink-100 text-pink-800" },
  { name: "インディゴ", value: "bg-indigo-100 text-indigo-800" },
]

export function LabelCreateButton() {
  const [open, setOpen] = useState(false)
  const [labelName, setLabelName] = useState("")
  const [selectedColor, setSelectedColor] = useState(colorOptions[0].value)

  const handleCreateLabel = () => {
    if (labelName.trim()) {
      // 実際の実装ではサービスを呼び出してラベルを作成
      console.log("Create label:", {
        name: labelName,
        color: selectedColor,
      })
      setLabelName("")
      setSelectedColor(colorOptions[0].value)
      setOpen(false)
    }
  }

  return (
    <>
      <Button onClick={() => setOpen(true)}>
        <Plus className="mr-2 h-4 w-4" />
        ラベル作成
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>新規ラベル作成</DialogTitle>
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
              <Label>ラベル色</Label>
              <div className="grid grid-cols-4 gap-2">
                {colorOptions.map((color) => (
                  <div
                    key={color.value}
                    className={`cursor-pointer rounded-md border p-2 ${
                      selectedColor === color.value ? "ring-2 ring-blue-500" : ""
                    }`}
                    onClick={() => setSelectedColor(color.value)}
                  >
                    <Badge className={color.value}>{color.name}</Badge>
                  </div>
                ))}
              </div>
            </div>
            <div className="mt-2">
              <Label>プレビュー</Label>
              <div className="mt-1">
                <Badge className={selectedColor}>{labelName || "ラベル名"}</Badge>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>
              キャンセル
            </Button>
            <Button onClick={handleCreateLabel} disabled={!labelName.trim()}>
              作成
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
