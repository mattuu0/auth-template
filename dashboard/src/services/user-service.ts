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

// ユーザー一覧
let users: User[] = [];

// ユーザー一覧を取得
export async function getUsers(): Promise<User[]> {
  // APIからデータ取得
  const req = await fetch("/auth/api/user/all", {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    }
  });

  // ユーザー一覧を取得
  users = await req.json();

  return users;
}

// ユーザーを検索
export async function searchUsers(query: string): Promise<User[]> {
  // 実際の実装ではAPIからデータを取得
  return users.filter(
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

  const req = await fetch("/auth/api/users", {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(user),
  });

  // モックデータを更新して返す
  const index = users.findIndex((u) => u.id === user.id)
  if (index !== -1) {
    users[index] = { ...users[index], ...user }
    return users[index]
  }

  throw new Error("User not found")
}

// ユーザーのBANステータスを切り替え
export async function toggleUserBan(userId: string): Promise<User> {
  // 実際の実装ではAPIを呼び出してユーザーのBANステータスを切り替え
  console.log("Toggle ban status for user:", userId)

  // モックデータを更新して返す
  const index = users.findIndex((u) => u.id === userId)
  if (index !== -1) {
    users[index].banned = !users[index].banned
    return users[index]
  }

  throw new Error("User not found")
}

// ユーザーとしてログイン
export async function loginAsUser(userId: string): Promise<User> {
  // 実際の実装ではAPIを呼び出してユーザーとしてログイン
  console.log("Login as user:", userId)

  // モックデータからユーザーを取得
  const user = users.find((u) => u.id === userId)
  if (!user) {
    throw new Error("User not found")
  }

  // セッションストレージにログイン中のユーザー情報を保存
  sessionStorage.setItem("login_as_user", JSON.stringify(user))

  return user
}

// 現在ログイン中のユーザーを取得
export async function getCurrentLoginAs(): Promise<User | null> {
  // セッションストレージからログイン中のユーザー情報を取得
  const userJson = sessionStorage.getItem("login_as_user")
  if (userJson) {
    return JSON.parse(userJson) as User
  }

  return null
}

// ログイン中のユーザーをクリア
export async function clearLoginAs(): Promise<void> {
  // セッションストレージからログイン中のユーザー情報を削除
  sessionStorage.removeItem("login_as_user")
}

// // モックデータ
// const users: User[] = [
//   {
//     id: "usr_123456789",
//     name: "山田太郎",
//     email: "yamada@example.com",
//     provider: "google",
//     providerId: "109876543210",
//     avatar: "/placeholder.svg?height=40&width=40",
//     labels: ["管理者"],
//     createdAt: "2023-01-15",
//     banned: false,
//   },
//   {
//     id: "usr_987654321",
//     name: "佐藤花子",
//     email: "sato@example.com",
//     provider: "github",
//     providerId: "sato123",
//     avatar: "/placeholder.svg?height=40&width=40",
//     labels: ["一般ユーザー"],
//     createdAt: "2023-02-20",
//     banned: false,
//   },
//   {
//     id: "usr_456789123",
//     name: "鈴木一郎",
//     email: "suzuki@example.com",
//     provider: "basic",
//     providerId: "suzuki_ichiro",
//     avatar: "/placeholder.svg?height=40&width=40",
//     labels: ["プレミアム"],
//     createdAt: "2023-03-10",
//     banned: true,
//   },
//   {
//     id: "usr_789123456",
//     name: "高橋次郎",
//     email: "takahashi@example.com",
//     provider: "microsoft",
//     providerId: "takahashi_jiro",
//     avatar: "/placeholder.svg?height=40&width=40",
//     labels: ["一般ユーザー", "ベータテスター"],
//     createdAt: "2023-04-05",
//     banned: false,
//   },
//   {
//     id: "usr_321654987",
//     name: "田中三郎",
//     email: "tanaka@example.com",
//     provider: "discord",
//     providerId: "tanaka#1234",
//     avatar: "/placeholder.svg?height=40&width=40",
//     labels: ["ベータテスター"],
//     createdAt: "2023-05-15",
//     banned: false,
//   },
// ]
