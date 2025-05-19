// セッション関連の操作を行うサービス
// 実際の実装ではバックエンドAPIとの通信を行う

import { baseURL } from "./config"

export interface Session {
  id: string
  userId: string
  ipAddress: string
  userAgent: string
  createdAt: string
  expiresAt: string // 最終アクティブから有効期限に変更
  isActive: boolean
}

let sessions: Session[] = []

// セッション一覧を取得
export async function getSessions(): Promise<Session[]> {
  const req = await fetch(`${baseURL}/api/session`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    }
  });

  // セッション一覧を取得
  sessions = await req.json();

  // 実際の実装ではAPIからデータを取得
  return sessions;
}

// ユーザーIDでセッションを検索
export async function getSessionsByUserId(userId: string): Promise<Session[]> {
  // 実際の実装ではAPIからデータを取得
  return sessions.filter((session) => session.userId === userId)
}

// セッションを検索
export async function searchSessions(query: string): Promise<Session[]> {
  // 実際の実装ではAPIからデータを取得
  return sessions.filter(
    (session) =>
      session.id.toLowerCase().includes(query.toLowerCase()) ||
      session.userId.toLowerCase().includes(query.toLowerCase()) ||
      session.ipAddress.toLowerCase().includes(query.toLowerCase()) ||
      session.userAgent.toLowerCase().includes(query.toLowerCase()),
  )
}

// セッションを削除
export async function deleteSession(sessionId: string): Promise<void> {
  // 実際の実装ではAPIを呼び出してセッションを削除
  console.log("Delete session:", sessionId)

  // APIを送る
  const req = await fetch(`${baseURL}/api/session`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      "sessionId": sessionId
    }
  });

  if (!req.ok) {
    throw new Error("Failed to delete session")
  }

  // モックデータから削除
  const index = sessions.findIndex((s) => s.id === sessionId)
  if (index !== -1) {
    sessions.splice(index, 1)
    return
  }

  throw new Error("Session not found")
}

// ユーザーのすべてのセッションを削除
export async function deleteAllSessionsByUserId(userId: string): Promise<void> {
  // 実際の実装ではAPIを呼び出してユーザーのすべてのセッションを削除
  console.log("Delete all sessions for user:", userId)
}
