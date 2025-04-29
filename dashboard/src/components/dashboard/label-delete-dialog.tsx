"use client"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Loader2 } from "lucide-react"

interface LabelDeleteDialogProps {
  label: {
    id: string
    name: string
    color: string
  }
  open: boolean
  onOpenChange: (open: boolean) => void
  onConfirm: () => Promise<void>
  isDeleting: boolean
}

export function LabelDeleteDialog({ label, open, onOpenChange, onConfirm, isDeleting }: LabelDeleteDialogProps) {
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

  const handleConfirm = async () => {
    await onConfirm()
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>ラベルの削除</DialogTitle>
          <DialogDescription>以下のラベルを削除してもよろしいですか？この操作は元に戻せません。</DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <div className="flex items-center gap-4">
            <Badge
              style={{
                backgroundColor: label.color,
                color: getTextColor(label.color),
              }}
            >
              {label.name}
            </Badge>
            <div className="text-sm text-muted-foreground">
              ID: <span className="font-mono">{label.id}</span>
            </div>
          </div>
          <p className="mt-4 text-sm text-destructive">
            このラベルを削除すると、このラベルが付与されているすべてのユーザーからも削除されます。
          </p>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isDeleting}>
            キャンセル
          </Button>
          <Button variant="destructive" onClick={handleConfirm} disabled={isDeleting}>
            {isDeleting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                削除中...
              </>
            ) : (
              "削除"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
