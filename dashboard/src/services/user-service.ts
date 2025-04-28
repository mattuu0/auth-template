// ユーザー関連の操作を行うサービス
// 実際の実装ではバックエンドAPIとの通信を行う

export interface User {
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

// ユーザー一覧を取得
export async function getUsers(): Promise<User[]> {
  // 実際の実装ではAPIからデータを取得
  return mockUsers
}

// ユーザーを検索
export async function searchUsers(query: string): Promise<User[]> {
  // 実際の実装ではAPIからデータを取得
  return mockUsers.filter(
    (user) =>
      user.name.toLowerCase().includes(query.toLowerCase()) ||
      user.email.toLowerCase().includes(query.toLowerCase()) ||
      user.id.toLowerCase().includes(query.toLowerCase()),
  )
}

// ユーザーを更新
export async function updateUser(user: Partial<User> & { id: string }): Promise<User> {
  // 実際の実装ではAPIを呼び出してユーザーを更新
  console.log("Update user:", user)

  // モックデータを更新して返す
  const index = mockUsers.findIndex((u) => u.id === user.id)
  if (index !== -1) {
    mockUsers[index] = { ...mockUsers[index], ...user }
    return mockUsers[index]
  }

  throw new Error("User not found")
}

// ユーザーのBANステータスを切り替え
export async function toggleUserBan(userId: string): Promise<User> {
  // 実際の実装ではAPIを呼び出してユーザーのBANステータスを切り替え
  console.log("Toggle ban status for user:", userId)

  // モックデータを更新して返す
  const index = mockUsers.findIndex((u) => u.id === userId)
  if (index !== -1) {
    mockUsers[index].banned = !mockUsers[index].banned
    return mockUsers[index]
  }

  throw new Error("User not found")
}

// モックデータ
const mockUsers: User[] = [
  {
    id: "usr_123456789",
    name: "山田太郎",
    email: "yamada@example.com",
    provider: "google",
    providerId: "109876543210",
    avatar: "/placeholder.svg?height=40&width=40",
    labels: ["管理者"],
    createdAt: "2023-01-15",
    banned: false,
  },
  {
    id: "usr_987654321",
    name: "佐藤花子",
    email: "sato@example.com",
    provider: "github",
    providerId: "sato123",
    avatar: "/placeholder.svg?height=40&width=40",
    labels: ["一般ユーザー"],
    createdAt: "2023-02-20",
    banned: false,
  },
  {
    id: "usr_456789123",
    name: "鈴木一郎",
    email: "suzuki@example.com",
    provider: "basic",
    providerId: "suzuki_ichiro",
    avatar: "/placeholder.svg?height=40&width=40",
    labels: ["プレミアム"],
    createdAt: "2023-03-10",
    banned: true,
  },
  {
    id: "usr_789123456",
    name: "高橋次郎",
    email: "takahashi@example.com",
    provider: "microsoft",
    providerId: "takahashi_jiro",
    avatar: "/placeholder.svg?height=40&width=40",
    labels: ["一般ユーザー", "ベータテスター"],
    createdAt: "2023-04-05",
    banned: false,
  },
  {
    id: "usr_321654987",
    name: "田中三郎",
    email: "tanaka@example.com",
    provider: "discord",
    providerId: "tanaka#1234",
    avatar: "/placeholder.svg?height=40&width=40",
    labels: ["ベータテスター"],
    createdAt: "2023-05-15",
    banned: false,
  },
]
