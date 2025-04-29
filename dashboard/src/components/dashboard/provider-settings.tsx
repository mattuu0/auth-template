"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Copy } from "lucide-react"
import { Slider } from "@/components/ui/slider"

// プロバイダ設定
const initialProviders = {
  google: {
    enabled: true,
    clientId: "123456789012-abcdefghijklmnopqrstuvwxyz123456.apps.googleusercontent.com",
    clientSecret: "GOCSPX-abcdefghijklmnopqrstuvwxyz123456",
    callbackUrl: "https://example.com/api/auth/callback/google",
  },
  discord: {
    enabled: false,
    clientId: "",
    clientSecret: "",
    callbackUrl: "https://example.com/api/auth/callback/discord",
  },
  github: {
    enabled: true,
    clientId: "abcdef1234567890abcd",
    clientSecret: "abcdef1234567890abcdef1234567890abcdef12",
    callbackUrl: "https://example.com/api/auth/callback/github",
  },
  microsoft: {
    enabled: false,
    clientId: "",
    clientSecret: "",
    callbackUrl: "https://example.com/api/auth/callback/microsoft",
  },
}

// Basic認証の設定（独立して管理）
const initialBasicSettings = {
  enabled: true,
  hashRounds: 10,
}

// システム設定
const initialSystemSettings = {
  secretKey: "your-secret-key-for-jwt-and-encryption",
}

export function ProviderSettings() {
  const [providers, setProviders] = useState(initialProviders)
  const [basicSettings, setBasicSettings] = useState(initialBasicSettings)
  const [systemSettings, setSystemSettings] = useState(initialSystemSettings)
  const [activeTab, setActiveTab] = useState("google")

  // プロバイダの有効/無効を切り替え
  const toggleProvider = (provider: keyof typeof providers) => {
    setProviders({
      ...providers,
      [provider]: {
        ...providers[provider],
        enabled: !providers[provider].enabled,
      },
    })
  }

  // Basic認証の有効/無効を切り替え
  const toggleBasic = () => {
    setBasicSettings({
      ...basicSettings,
      enabled: !basicSettings.enabled,
    })
  }

  // クライアントIDを更新
  const updateClientId = (provider: keyof typeof providers, value: string) => {
    setProviders({
      ...providers,
      [provider]: {
        ...providers[provider],
        clientId: value,
      },
    })
  }

  // クライアントシークレットを更新
  const updateClientSecret = (provider: keyof typeof providers, value: string) => {
    setProviders({
      ...providers,
      [provider]: {
        ...providers[provider],
        clientSecret: value,
      },
    })
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

  // 設定を保存
  const saveSettings = () => {
    // 実際の実装ではサービスを呼び出して設定を保存
    console.log("Save provider settings:", providers)
    console.log("Save basic settings:", basicSettings)
    console.log("Save system settings:", systemSettings)
  }

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="google">Google</TabsTrigger>
          <TabsTrigger value="discord">Discord</TabsTrigger>
          <TabsTrigger value="github">GitHub</TabsTrigger>
          <TabsTrigger value="microsoft">Microsoft</TabsTrigger>
          <TabsTrigger value="basic">Basic</TabsTrigger>
          <TabsTrigger value="system">システム</TabsTrigger>
        </TabsList>

        <TabsContent value="google">
          <OAuthProviderCard
            title="Google認証"
            description="GoogleアカウントでのログインをユーザーにOAuthで提供します。"
            provider="google"
            data={providers.google}
            onToggle={() => toggleProvider("google")}
            onUpdateClientId={(value) => updateClientId("google", value)}
            onUpdateClientSecret={(value) => updateClientSecret("google", value)}
            onCopy={copyToClipboard}
            onSave={saveSettings}
          />
        </TabsContent>

        <TabsContent value="discord">
          <OAuthProviderCard
            title="Discord認証"
            description="Discordアカウントでのログインをユーザーにプロバイダします。"
            provider="discord"
            data={providers.discord}
            onToggle={() => toggleProvider("discord")}
            onUpdateClientId={(value) => updateClientId("discord", value)}
            onUpdateClientSecret={(value) => updateClientSecret("discord", value)}
            onCopy={copyToClipboard}
            onSave={saveSettings}
          />
        </TabsContent>

        <TabsContent value="github">
          <OAuthProviderCard
            title="GitHub認証"
            description="GitHubアカウントでのログインをユーザーにOAuthで提供します。"
            provider="github"
            data={providers.github}
            onToggle={() => toggleProvider("github")}
            onUpdateClientId={(value) => updateClientId("github", value)}
            onUpdateClientSecret={(value) => updateClientSecret("github", value)}
            onCopy={copyToClipboard}
            onSave={saveSettings}
          />
        </TabsContent>

        <TabsContent value="microsoft">
          <OAuthProviderCard
            title="Microsoft認証"
            description="Microsoftアカウントでのログインをユーザーにプロバイダします。"
            provider="microsoft"
            data={providers.microsoft}
            onToggle={() => toggleProvider("microsoft")}
            onUpdateClientId={(value) => updateClientId("microsoft", value)}
            onUpdateClientSecret={(value) => updateClientSecret("microsoft", value)}
            onCopy={copyToClipboard}
            onSave={saveSettings}
          />
        </TabsContent>

        <TabsContent value="basic">
          <BasicProviderCard
            title="Basic認証"
            description="メールアドレスとパスワードでのログインをユーザーに提供します。"
            data={basicSettings}
            onToggle={toggleBasic}
            onUpdateHashRounds={updateHashRounds}
            onSave={saveSettings}
          />
        </TabsContent>

        <TabsContent value="system">
          <SystemSettingsCard
            title="システム設定"
            description="認証システム全体に関わる設定を管理します。"
            data={systemSettings}
            onUpdateSecretKey={updateSecretKey}
            onSave={saveSettings}
          />
        </TabsContent>
      </Tabs>
    </div>
  )
}

interface OAuthProviderCardProps {
  title: string
  description: string
  provider: string
  data: {
    enabled: boolean
    clientId: string
    clientSecret: string
    callbackUrl: string
  }
  onToggle: () => void
  onUpdateClientId: (value: string) => void
  onUpdateClientSecret: (value: string) => void
  onCopy: (text: string) => void
  onSave: () => void
}

function OAuthProviderCard({
  title,
  description,
  provider,
  data,
  onToggle,
  onUpdateClientId,
  onUpdateClientSecret,
  onCopy,
  onSave,
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
            <Label htmlFor={`${provider}-toggle`}>{data.enabled ? "有効" : "無効"}</Label>
            <Switch id={`${provider}-toggle`} checked={data.enabled} onCheckedChange={onToggle} />
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-2">
          <Label htmlFor={`${provider}-client-id`}>クライアントID</Label>
          <div className="flex">
            <Input
              id={`${provider}-client-id`}
              value={data.clientId}
              onChange={(e) => onUpdateClientId(e.target.value)}
              className="rounded-r-none"
            />
          </div>
        </div>

        <div className="grid gap-2">
          <Label htmlFor={`${provider}-client-secret`}>クライアントシークレット</Label>
          <div className="flex">
            <Input
              id={`${provider}-client-secret`}
              type="password"
              value={data.clientSecret}
              onChange={(e) => onUpdateClientSecret(e.target.value)}
              className="rounded-r-none"
            />
          </div>
        </div>

        <div className="grid gap-2">
          <Label htmlFor={`${provider}-callback-url`}>コールバックURL</Label>
          <div className="flex">
            <Input id={`${provider}-callback-url`} value={data.callbackUrl} disabled className="rounded-r-none" />
            <Button variant="secondary" className="rounded-l-none" onClick={() => onCopy(data.callbackUrl)}>
              <Copy className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <Button onClick={onSave} className="mt-4">
          設定を保存
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
}

function BasicProviderCard({ title, description, data, onToggle, onUpdateHashRounds, onSave }: BasicProviderCardProps) {
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

        <Button onClick={onSave} className="mt-4">
          設定を保存
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
}

function SystemSettingsCard({ title, description, data, onUpdateSecretKey, onSave }: SystemSettingsCardProps) {
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

        <Button onClick={onSave} className="mt-4">
          設定を保存
        </Button>
      </CardContent>
    </Card>
  )
}
