"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { LogOut, Users, Tag, Settings } from "lucide-react"
import { logout, getCurrentUser } from "@/services/auth-service"

const navItems = [
  {
    title: "ユーザー管理",
    href: "/dashboard/users",
    icon: Users,
  },
  {
    title: "ラベル管理",
    href: "/dashboard/labels",
    icon: Tag,
  },
  {
    title: "プロバイダ設定",
    href: "/dashboard/providers",
    icon: Settings,
  },
]

export function Sidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [currentUser, setCurrentUser] = useState<any>(null)

  // 現在のユーザー情報を取得
  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const user = await getCurrentUser()
        setCurrentUser(user)
      } catch (error) {
        console.error("ユーザー情報の取得に失敗しました:", error)
      }
    }

    fetchUserInfo()
  }, [])

  // 画面サイズに応じてモバイル表示を切り替え
  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 768)
      if (window.innerWidth < 768) {
        setIsCollapsed(true)
      }
    }

    // 初期チェック
    checkIsMobile()

    // リサイズイベントのリスナーを追加
    window.addEventListener("resize", checkIsMobile)

    // クリーンアップ
    return () => window.removeEventListener("resize", checkIsMobile)
  }, [])

  // ログアウト処理
  const handleLogout = async () => {
    try {
      await logout()
      router.push("/login")
    } catch (error) {
      console.error("ログアウトに失敗しました:", error)
    }
  }

  return (
    <TooltipProvider>
      <div
        className={cn(
          "flex h-full flex-col border-r bg-white shadow-sm transition-width duration-300 ease-in-out",
          isCollapsed ? "w-14" : "w-52", // 横幅を縮小
        )}
      >
        <div className="flex h-14 items-center border-b px-3">
          <h1
            className={cn(
              "font-semibold text-sm transition-opacity duration-200",
              isCollapsed ? "opacity-0 w-0 invisible" : "opacity-100 visible",
            )}
          >
            authkit
          </h1>
          <Button
            variant="ghost"
            size="icon"
            className="ml-auto"
            onClick={() => setIsCollapsed(!isCollapsed)}
            aria-label={isCollapsed ? "展開" : "折りたたむ"}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className={cn("transition-transform duration-200", isCollapsed ? "rotate-180" : "")}
            >
              <path d="m15 6-6 6 6 6" />
            </svg>
          </Button>
        </div>
        <nav className="flex-1 overflow-auto py-4">
          <ul className="grid gap-1 px-2">
            {navItems.map((item) => {
              const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`)
              return (
                <li key={item.href}>
                  <Tooltip delayDuration={0}>
                    <TooltipTrigger asChild>
                      <Link
                        href={item.href}
                        className={cn(
                          "flex h-10 items-center rounded-md px-3 text-sm font-medium transition-colors",
                          isActive ? "bg-blue-50 text-blue-700" : "text-gray-500 hover:bg-gray-100 hover:text-gray-900",
                        )}
                      >
                        <item.icon className={cn("h-5 w-5", isActive ? "text-blue-700" : "text-gray-500")} />
                        <span
                          className={cn(
                            "ml-3 text-sm transition-opacity duration-200",
                            isCollapsed ? "opacity-0 w-0 invisible" : "opacity-100 visible",
                          )}
                        >
                          {item.title}
                        </span>
                      </Link>
                    </TooltipTrigger>
                    {isCollapsed && <TooltipContent side="right">{item.title}</TooltipContent>}
                  </Tooltip>
                </li>
              )
            })}
          </ul>
        </nav>

        <div className="border-t p-2">
          <Tooltip delayDuration={0}>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                className={cn(
                  "w-full justify-start text-gray-500 hover:bg-gray-100 hover:text-gray-900",
                  isCollapsed ? "px-3" : "",
                )}
                onClick={handleLogout}
              >
                <LogOut className="h-5 w-5" />
                <span
                  className={cn(
                    "ml-3 transition-opacity duration-200",
                    isCollapsed ? "opacity-0 w-0 invisible" : "opacity-100 visible",
                  )}
                >
                  ログアウト
                </span>
              </Button>
            </TooltipTrigger>
            {isCollapsed && <TooltipContent side="right">ログアウト</TooltipContent>}
          </Tooltip>
        </div>
      </div>
    </TooltipProvider>
  )
}
