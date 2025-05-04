"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Loader2, AlertCircle } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface SessionDeleteDialogProps {
  session: {
    id: string
    userId: string
    ipAddress: string
    userAgent: string
  }
  open: boolean
  onOpenChange: (open: boolean) => void
  onConfirm: () => Promise<void>
}

export function SessionDeleteDialog({ session, open, onOpenChange, onConfirm }: SessionDeleteDialogProps) {
  const [isDeleting, setIsDeleting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleConfirm = async () => {
    try {
      setIsDeleting(true)
      setError(null)
      await onConfirm()
      onOpenChange(false)
    } catch (err) {
      console.error("セッションの削除に失敗しました:", err)
      setError("セッションの削除に失敗しました")
    } finally {
      setIsDeleting(false)
    }
  }

  // ユーザーエージェントを短縮表示
  const formatUserAgent = (userAgent: string) => {
    if (userAgent.length > 50) {
      return userAgent.substring(0, 50) + "..."
    }
    return userAgent
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>セッションの削除</DialogTitle>
          <DialogDescription>以下のセッションを削除してもよろしいですか？この操作は元に戻せません。</DialogDescription>
        </DialogHeader>

        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="py-4">
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="font-medium">セッションID:</span>
              <span className="font-mono text-sm">{session.id}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">ユーザーID:</span>
              <span className="font-mono text-sm">{session.userId}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">IPアドレス:</span>
              <span>{session.ipAddress}</span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="font-medium">ユーザーエージェント:</span>
              <span className="text-xs text-muted-foreground break-all">{session.userAgent}</span>
            </div>
          </div>
          <p className="mt-4 text-sm text-destructive">
            このセッションを削除すると、ユーザーは再ログインが必要になります。
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
