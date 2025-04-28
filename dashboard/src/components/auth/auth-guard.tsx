"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import { isAuthenticated } from "@/services/auth-service"

interface AuthGuardProps {
  children: React.ReactNode
}

export function AuthGuard({ children }: AuthGuardProps) {
  const router = useRouter()
  const pathname = usePathname()
  const [isChecking, setIsChecking] = useState(true)

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const authenticated = await isAuthenticated()

        // 認証されていない場合はログインページにリダイレクト
        if (!authenticated && !pathname.includes("/login") && !pathname.includes("/signup")) {
          router.push(`/login?redirect=${encodeURIComponent(pathname)}`)
        }
      } catch (error) {
        console.error("認証チェックに失敗しました:", error)
        router.push("/login")
      } finally {
        setIsChecking(false)
      }
    }

    checkAuth()
  }, [pathname, router])

  // 認証チェック中はローディング表示
  if (isChecking) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"></div>
      </div>
    )
  }

  return <>{children}</>
}
