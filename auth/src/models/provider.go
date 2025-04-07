package models

import (
	"auth/logger"
)

type ProviderCode string

const (
	Google    ProviderCode = "google"
	Github    ProviderCode = "github"
	Discord   ProviderCode = "discord"
	Line      ProviderCode = "line"
	Microsoft ProviderCode = "microsoftonline"
	Basic     ProviderCode = "basic"
)

type Provider struct {
    ProviderName string       `gorm:"primaryKey"` // 認証プロバイダ名
    ClientID     string       // 認証プロバイダのクライアントID
    ClientSecret string       // 認証プロバイダのクライアントシークレット
    CallbackURL  string       // 認証プロバイダのコールバックURL
    ProviderCode ProviderCode `gorm:"type:varchar(255);uniqueIndex"` // 認証プロバイダのコード
    IsEnabled    int          `gorm:"default:0"` // 認証プロバイダの有効状態
    Users        []User       `gorm:"foreignKey:ProvCode;references:ProviderCode"` // プロバイダが持つユーザー
}

// プロバイダを取得
func GetProvider(providerCode ProviderCode) (*Provider, error) {
	var provider Provider

	// 取得する
	err := dbconn.First(&provider, &Provider{ProviderCode: providerCode}).Error
	return &provider, err
}

func CreateProvider(provider *Provider) error {
	return dbconn.Create(provider).Error
}

// プロバイダを初期化する
func InitProviders() {
	// Google
	err := CreateProvider(&Provider{
		ProviderName: "Google",
		ClientID:     "",
		ClientSecret: "",
		CallbackURL:  "/auth/google/callback",
		ProviderCode: Google,
		IsEnabled:    0,
		Users:        []User{},
	})

	// エラー処理
	if err != nil {
		logger.PrintErr(err)
	}

	// GitHub
	err = CreateProvider(&Provider{
		ProviderName: "GitHub",
		ClientID:     "",
		ClientSecret: "",
		CallbackURL:  "/auth/github/callback",
		ProviderCode: Github,
		IsEnabled:    0,
		Users:        []User{},
	})

	// エラー処理
	if err != nil {
		logger.PrintErr(err)
	}

	// Discord
	err = CreateProvider(&Provider{
		ProviderName: "Discord",
		ClientID:     "",
		ClientSecret: "",
		CallbackURL:  "/auth/discord/callback",
		ProviderCode: Discord,
		IsEnabled:    0,
		Users:        []User{},
	})

	// エラー処理
	if err != nil {
		logger.PrintErr(err)
	}

	// Line
	err = CreateProvider(&Provider{
		ProviderName: "Line",
		ClientID:     "",
		ClientSecret: "",
		CallbackURL:  "/auth/line/callback",
		ProviderCode: Line,
		IsEnabled:    0,
		Users:        []User{},
	})

	// エラー処理
	if err != nil {
		logger.PrintErr(err)
	}

	// Microsoft
	err = CreateProvider(&Provider{
		ProviderName: "Microsoft",
		ClientID:     "",
		ClientSecret: "",
		CallbackURL:  "/auth/microsoftonline/callback",
		ProviderCode: Microsoft,
		IsEnabled:    0,
		Users:        []User{},
	})

	// エラー処理
	if err != nil {
		logger.PrintErr(err)
	}

	// basic
	err = CreateProvider(&Provider{
		ProviderName: "Basic",
		ClientID:     "",
		ClientSecret: "",
		CallbackURL:  "",
		ProviderCode: Basic,
		IsEnabled:    0,
		Users:        []User{},
	})

	// エラー処理
	if err != nil {
		logger.PrintErr(err)
	}

	// 完了
	logger.Println("Providers initialized")
}
