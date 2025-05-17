"use client"

import { useState, useEffect } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Copy, Loader2, AlertCircle } from "lucide-react"
import { Slider } from "@/components/ui/slider"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Skeleton } from "@/components/ui/skeleton"
import {
  getProviders,
  updateProvider,
  toggleProvider,
  getBasicSettings,
  updateBasicSettings,
  getSystemSettings,
  updateSystemSettings,
  type Provider,
} from "@/services/provider-service"

export function ProviderSettings() {
  const [providers, setProviders] = useState<Provider[]>([])
  const [basicSettings, setBasicSettings] = useState<{ enabled: boolean; hashRounds: number }>({
    enabled: true,
    hashRounds: 10,
  })
  const [systemSettings, setSystemSettings] = useState<{ secretKey: string }>({
    secretKey: "",
  })
  const [activeTab, setActiveTab] = useState("google")
  const [saving, setSaving] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  // データの初期ロード
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        setError(null)

        // プロバイダデータを取得
        const providersData = await getProviders()
        setProviders(providersData)

        // Basic認証設定を取得
        const basicData = await getBasicSettings()
        setBasicSettings(basicData)

        // システム設定を取得
        const systemData = await getSystemSettings()
        setSystemSettings(systemData)

        // 最初のプロバイダをアクティブタブに設定
        if (providersData.length > 0) {
          setActiveTab(providersData[0].ProviderCode)
        }
      } catch (err) {
        console.error("設定の取得に失敗しました:", err)
        setError("設定の取得に失敗しました。ページを再読み込みしてください。")
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  // プロバイダの有効/無効を切り替え
  const handleToggleProvider = async (providerCode: string) => {
    try {
      setSaving(providerCode)
      setError(null)

      // サービスを呼び出してプロバイダの有効/無効を切り替え
      const updatedProvider = await toggleProvider(providerCode)

      // 状態を更新
      setProviders(providers.map((provider) => (provider.ProviderCode === providerCode ? updatedProvider : provider)))

      setSuccess("プロバイダの設定を更新しました")
      setTimeout(() => setSuccess(null), 3000)
    } catch (err) {
      console.error("プロバイダの切り替えに失敗しました:", err)
      setError("プロバイダの切り替えに失敗しました")
    } finally {
      setSaving(null)
    }
  }

  // Basic認証の有効/無効を切り替え
  const toggleBasic = async () => {
    try {
      setSaving("basic")
      setError(null)

      const updatedSettings = await updateBasicSettings({
        ...basicSettings,
        enabled: !basicSettings.enabled,
      })

      setBasicSettings(updatedSettings)
      setSuccess("Basic認証の設定を更新しました")
      setTimeout(() => setSuccess(null), 3000)
    } catch (err) {
      console.error("Basic認証の切り替えに失敗しました:", err)
      setError("Basic認証の切り替えに失敗しました")
    } finally {
      setSaving(null)
    }
  }

  // プロバイダ設定を保存
  const saveProviderSettings = async (providerCode: string) => {
    try {
      setSaving(providerCode)
      setError(null)

      const provider = providers.find((p) => p.ProviderCode === providerCode)
      if (!provider) {
        throw new Error("Provider not found")
      }

      // サービスを呼び出してプロバイダを更新
      const updatedProvider = await updateProvider(provider)

      // 状態を更新
      setProviders(providers.map((p) => (p.ProviderCode === providerCode ? updatedProvider : p)))

      setSuccess("プロバイダの設定を保存しました")
      setTimeout(() => setSuccess(null), 3000)
    } catch (err) {
      console.error("プロバイダの保存に失敗しました:", err)
      setError("プロバイダの保存に失敗しました")
    } finally {
      setSaving(null)
    }
  }

  // Basic認証設定を保存
  const saveBasicSettings = async () => {
    try {
      setSaving("basic")
      setError(null)

      // サービスを呼び出してBasic認証設定を更新
      const updatedSettings = await updateBasicSettings(basicSettings)

      setBasicSettings(updatedSettings)
      setSuccess("Basic認証の設定を保存しました")
      setTimeout(() => setSuccess(null), 3000)
    } catch (err) {
      console.error("Basic認証設定の保存に失敗しました:", err)
      setError("Basic認証設定の保存に失敗しました")
    } finally {
      setSaving(null)
    }
  }

  // システム設定を保存
  const saveSystemSettings = async () => {
    try {
      setSaving("system")
      setError(null)

      // サービスを呼び出してシステム設定を更新
      const updatedSettings = await updateSystemSettings(systemSettings)

      setSystemSettings(updatedSettings)
      setSuccess("システム設定を保存しました")
      setTimeout(() => setSuccess(null), 3000)
    } catch (err) {
      console.error("システム設定の保存に失敗しました:", err)
      setError("システム設定の保存に失敗しました")
    } finally {
      setSaving(null)
    }
  }

  // クライアントIDを更新
  const updateClientId = (providerCode: string, value: string) => {
    setProviders(
      providers.map((provider) =>
        provider.ProviderCode === providerCode ? { ...provider, ClientID: value } : provider,
      ),
    )
  }

  // クライアントシークレットを更新
  const updateClientSecret = (providerCode: string, value: string) => {
    setProviders(
      providers.map((provider) =>
        provider.ProviderCode === providerCode ? { ...provider, ClientSecret: value } : provider,
      ),
    )
  }

  // ハッシュラウンド数を更新
  const updateHashRounds = (value: number[]) => {
    setBasicSettings({
      ...basicSettings,
      hashRounds: value[0],
    })
  }

  // システムのシークレットキーを更新
  const updateSecretKey = (value: string) => {
    setSystemSettings({
      ...systemSettings,
      secretKey: value,
    })
  }

  // テキストをクリップボードにコピー
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
  }

  // プロバイダ名の表示名マッピング
  const providerDisplayNames: Record<string, string> = {
    google: "Google",
    discord: "Discord",
    github: "GitHub",
    microsoftonline: "Microsoft",
  }

  // ローディング中の表示
  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-[300px] w-full" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {success && (
        <Alert variant="default" className="bg-green-50 text-green-800 border-green-200">
          <AlertCircle className="h-4 w-4 text-green-500" />
          <AlertDescription>{success}</AlertDescription>
        </Alert>
      )}

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-6">
          {providers.map((provider) => (
            <TabsTrigger key={provider.ProviderCode} value={provider.ProviderCode}>
              {providerDisplayNames[provider.ProviderCode]}
            </TabsTrigger>
          ))}
          <TabsTrigger value="basic">Basic</TabsTrigger>
          <TabsTrigger value="system">システム</TabsTrigger>
        </TabsList>

        {providers.map((provider) => (
          <TabsContent key={provider.ProviderCode} value={provider.ProviderCode}>
            <OAuthProviderCard
              title={`${providerDisplayNames[provider.ProviderCode]}認証`}
              description={`${providerDisplayNames[provider.ProviderCode]}アカウントでのログインをユーザーにOAuthで提供します。`}
              provider={provider}
              onToggle={() => handleToggleProvider(provider.ProviderCode)}
              onUpdateClientId={(value) => updateClientId(provider.ProviderCode, value)}
              onUpdateClientSecret={(value) => updateClientSecret(provider.ProviderCode, value)}
              onCopy={copyToClipboard}
              onSave={() => saveProviderSettings(provider.ProviderCode)}
              saving={saving === provider.ProviderCode}
            />
          </TabsContent>
        ))}

        <TabsContent value="basic">
          <BasicProviderCard
            title="Basic認証"
            description="メールアドレスとパスワードでのログインをユーザーに提供します。"
            data={basicSettings}
            onToggle={toggleBasic}
            onUpdateHashRounds={updateHashRounds}
            onSave={saveBasicSettings}
            saving={saving === "basic"}
          />
        </TabsContent>

        <TabsContent value="system">
          <SystemSettingsCard
            title="システム設定"
            description="認証システム全体に関わる設定を管理します。"
            data={systemSettings}
            onUpdateSecretKey={updateSecretKey}
            onSave={saveSystemSettings}
            saving={saving === "system"}
          />
        </TabsContent>
      </Tabs>
    </div>
  )
}

interface OAuthProviderCardProps {
  title: string
  description: string
  provider: Provider
  onToggle: () => void
  onUpdateClientId: (value: string) => void
  onUpdateClientSecret: (value: string) => void
  onCopy: (text: string) => void
  onSave: () => void
  saving: boolean
}

function OAuthProviderCard({
  title,
  description,
  provider,
  onToggle,
  onUpdateClientId,
  onUpdateClientSecret,
  onCopy,
  onSave,
  saving,
}: OAuthProviderCardProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>{title}</CardTitle>
            <CardDescription>{description}</CardDescription>
          </div>
          <div className="flex items-center space-x-2">
            <Label htmlFor={`${provider.ProviderCode}-toggle`}>{provider.IsEnabled === 1 ? "有効" : "無効"}</Label>
            <Switch
              id={`${provider.ProviderCode}-toggle`}
              checked={provider.IsEnabled === 1}
              onCheckedChange={onToggle}
            />
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-2">
          <Label htmlFor={`${provider.ProviderCode}-client-id`}>クライアントID</Label>
          <div className="flex">
            <Input
              id={`${provider.ProviderCode}-client-id`}
              value={provider.ClientID}
              onChange={(e) => onUpdateClientId(e.target.value)}
              className="rounded-r-none"
            />
            <Button variant="secondary" className="rounded-l-none" onClick={() => onCopy(provider.ClientID)}>
              <Copy className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="grid gap-2">
          <Label htmlFor={`${provider.ProviderCode}-client-secret`}>クライアントシークレット</Label>
          <div className="flex">
            <Input
              id={`${provider.ProviderCode}-client-secret`}
              type="password"
              value={provider.ClientSecret}
              onChange={(e) => onUpdateClientSecret(e.target.value)}
              className="rounded-r-none"
            />
            <Button variant="secondary" className="rounded-l-none" onClick={() => onCopy(provider.ClientSecret)}>
              <Copy className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="grid gap-2">
          <Label htmlFor={`${provider.ProviderCode}-callback-url`}>コールバックURL</Label>
          <div className="flex">
            <Input
              id={`${provider.ProviderCode}-callback-url`}
              value={provider.CallbackURL}
              disabled
              className="rounded-r-none"
            />
            <Button variant="secondary" className="rounded-l-none" onClick={() => onCopy(provider.CallbackURL)}>
              <Copy className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <Button onClick={onSave} className="mt-4" disabled={saving}>
          {saving ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              保存中...
            </>
          ) : (
            "設定を保存"
          )}
        </Button>
      </CardContent>
    </Card>
  )
}

interface BasicProviderCardProps {
  title: string
  description: string
  data: {
    enabled: boolean
    hashRounds: number
  }
  onToggle: () => void
  onUpdateHashRounds: (value: number[]) => void
  onSave: () => void
  saving: boolean
}

function BasicProviderCard({
  title,
  description,
  data,
  onToggle,
  onUpdateHashRounds,
  onSave,
  saving,
}: BasicProviderCardProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>{title}</CardTitle>
            <CardDescription>{description}</CardDescription>
          </div>
          <div className="flex items-center space-x-2">
            <Label htmlFor="basic-toggle">{data.enabled ? "有効" : "無効"}</Label>
            <Switch id="basic-toggle" checked={data.enabled} onCheckedChange={onToggle} />
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="basic-hash-rounds">ハッシュラウンド数</Label>
            <span className="text-sm font-medium">{data.hashRounds}</span>
          </div>
          <Slider
            id="basic-hash-rounds"
            min={1}
            max={20}
            step={1}
            value={[data.hashRounds]}
            onValueChange={onUpdateHashRounds}
          />
          <p className="text-xs text-muted-foreground">
            パスワードハッシュのセキュリティレベルを設定します。値が大きいほどセキュリティは高くなりますが、処理時間も増加します。
          </p>
        </div>

        <Button onClick={onSave} className="mt-4" disabled={saving}>
          {saving ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              保存中...
            </>
          ) : (
            "設定を保存"
          )}
        </Button>
      </CardContent>
    </Card>
  )
}

interface SystemSettingsCardProps {
  title: string
  description: string
  data: {
    secretKey: string
  }
  onUpdateSecretKey: (value: string) => void
  onSave: () => void
  saving: boolean
}

function SystemSettingsCard({ title, description, data, onUpdateSecretKey, onSave, saving }: SystemSettingsCardProps) {
  const [showSecretKey, setShowSecretKey] = useState(false)

  return (
    <Card>
      <CardHeader>
        <div>
          <CardTitle>{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-2">
          <Label htmlFor="system-secret-key">シークレットキー</Label>
          <div className="flex">
            <Input
              id="system-secret-key"
              type={showSecretKey ? "text" : "password"}
              value={data.secretKey}
              onChange={(e) => onUpdateSecretKey(e.target.value)}
            />
            <Button type="button" variant="outline" className="ml-2" onClick={() => setShowSecretKey(!showSecretKey)}>
              {showSecretKey ? "隠す" : "表示"}
            </Button>
          </div>
          <p className="text-xs text-muted-foreground">
            JWTトークンの署名やデータの暗号化に使用されるキーです。安全な長い文字列を設定してください。
          </p>
        </div>

        <Button onClick={onSave} className="mt-4" disabled={saving}>
          {saving ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              保存中...
            </>
          ) : (
            "設定を保存"
          )}
        </Button>
      </CardContent>
    </Card>
  )
}
