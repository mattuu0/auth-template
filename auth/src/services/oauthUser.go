package services

import (
	"auth/models"
	"auth/utils"
)

type OauthUserArgs struct {
	Name         string // ユーザー名
	Email        string // メールアドレス
	ProviderCode string // 認証プロバイダコード
}

// Oauthユーザーを作成する
func CreateOauthUser(args OauthUserArgs) error {
	// UUID を生成
	uid := utils.GenID()

	// 現在時刻を取得
	now := utils.NowTime()

	// ユーザーを作成する
	return models.CreateUser(&models.User{
		UserID:       uid,
		Name:         args.Name,
		Email:        args.Email,
		ProviderCode: models.ProviderCode(args.ProviderCode),
		PasswordHash: "",
		CreatedAt:    now,
	}, models.ProviderCode(args.ProviderCode))
}