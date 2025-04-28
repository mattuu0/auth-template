"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Copy } from "lucide-react"

// モックデータ
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
  basic: {
    enabled: true,
    clientId: "basic_auth_client",
    clientSecret: "basic_auth_secret",
    callbackUrl: "https://example.com/api/auth/callback/basic",
  },
}

export function ProviderSettings() {
  const [providers, setProviders] = useState(initialProviders)
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

  // テキストをクリップボードにコピー
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
  }

  // 設定を保存
  const saveSettings = () => {
    // 実際の実装ではサービスを呼び出して設定を保存
    console.log("Save provider settings:", providers)
  }

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="google">Google</TabsTrigger>
          <TabsTrigger value="discord">Discord</TabsTrigger>
          <TabsTrigger value="github">GitHub</TabsTrigger>
          <TabsTrigger value="microsoft">Microsoft</TabsTrigger>
          <TabsTrigger value="basic">Basic</TabsTrigger>
        </TabsList>

        <TabsContent value="google">
          <ProviderCard
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
          <ProviderCard
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
          <ProviderCard
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
          <ProviderCard
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
          <ProviderCard
            title="Basic認証"
            description="メールアドレスとパスワードでのログインをユーザーに提供します。"
            provider="basic"
            data={providers.basic}
            onToggle={() => toggleProvider("basic")}
            onUpdateClientId={(value) => updateClientId("basic", value)}
            onUpdateClientSecret={(value) => updateClientSecret("basic", value)}
            onCopy={copyToClipboard}
            onSave={saveSettings}
            isBasic={true}
          />
        </TabsContent>
      </Tabs>
    </div>
  )
}

interface ProviderCardProps {
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
  isBasic?: boolean
}

function ProviderCard({
  title,
  description,
  provider,
  data,
  onToggle,
  onUpdateClientId,
  onUpdateClientSecret,
  onCopy,
  onSave,
  isBasic = false,
}: ProviderCardProps) {
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
              disabled={isBasic}
              className="rounded-r-none"
            />
            {isBasic && (
              <Button variant="secondary" className="rounded-l-none" onClick={() => onCopy(data.clientId)}>
                <Copy className="h-4 w-4" />
              </Button>
            )}
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
              disabled={isBasic}
              className="rounded-r-none"
            />
            {isBasic && (
              <Button variant="secondary" className="rounded-l-none" onClick={() => onCopy(data.clientSecret)}>
                <Copy className="h-4 w-4" />
              </Button>
            )}
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

        {!isBasic && (
          <Button onClick={onSave} className="mt-4">
            設定を保存
          </Button>
        )}
      </CardContent>
    </Card>
  )
}
