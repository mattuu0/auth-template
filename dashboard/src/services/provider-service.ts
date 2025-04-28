// プロバイダ関連の操作を行うサービス
// 実際の実装ではバックエンドAPIとの通信を行う

export interface Provider {
  id: string
  name: string
  enabled: boolean
  clientId: string
  clientSecret: string
  callbackUrl: string
}

// プロバイダ一覧を取得
export async function getProviders(): Promise<Provider[]> {
  // 実際の実装ではAPIからデータを取得
  return mockProviders
}

// プロバイダを更新
export async function updateProvider(provider: Partial<Provider> & { id: string }): Promise<Provider> {
  // 実際の実装ではAPIを呼び出してプロバイダを更新
  console.log("Update provider:", provider)

  // モックデータを更新して返す
  const index = mockProviders.findIndex((p) => p.id === provider.id)
  if (index !== -1) {
    mockProviders[index] = { ...mockProviders[index], ...provider }
    return mockProviders[index]
  }

  throw new Error("Provider not found")
}

// プロバイダの有効/無効を切り替え
export async function toggleProvider(providerId: string): Promise<Provider> {
  // 実際の実装ではAPIを呼び出してプロバイダの有効/無効を切り替え
  console.log("Toggle provider:", providerId)

  // モックデータを更新して返す
  const index = mockProviders.findIndex((p) => p.id === providerId)
  if (index !== -1) {
    mockProviders[index].enabled = !mockProviders[index].enabled
    return mockProviders[index]
  }

  throw new Error("Provider not found")
}

// モックデータ
const mockProviders: Provider[] = [
  {
    id: "google",
    name: "Google",
    enabled: true,
    clientId: "123456789012-abcdefghijklmnopqrstuvwxyz123456.apps.googleusercontent.com",
    clientSecret: "GOCSPX-abcdefghijklmnopqrstuvwxyz123456",
    callbackUrl: "https://example.com/api/auth/callback/google",
  },
  {
    id: "line",
    name: "LINE",
    enabled: false,
    clientId: "",
    clientSecret: "",
    callbackUrl: "https://example.com/api/auth/callback/line",
  },
  {
    id: "github",
    name: "GitHub",
    enabled: true,
    clientId: "abcdef1234567890abcd",
    clientSecret: "abcdef1234567890abcdef1234567890abcdef12",
    callbackUrl: "https://example.com/api/auth/callback/github",
  },
  {
    id: "microsoft",
    name: "Microsoft",
    enabled: false,
    clientId: "",
    clientSecret: "",
    callbackUrl: "https://example.com/api/auth/callback/microsoft",
  },
  {
    id: "basic",
    name: "Basic",
    enabled: true,
    clientId: "basic_auth_client",
    clientSecret: "basic_auth_secret",
    callbackUrl: "https://example.com/api/auth/callback/basic",
  },
]
