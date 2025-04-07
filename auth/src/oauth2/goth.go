package oauth2

import (
	"auth/logger"
	"auth/models"
	"context"
	"net/http"

	"github.com/labstack/echo/v4"
	"github.com/markbates/goth"
	"github.com/markbates/goth/gothic"
	"github.com/markbates/goth/providers/discord"
	"github.com/markbates/goth/providers/github"
	"github.com/markbates/goth/providers/google"
	"github.com/markbates/goth/providers/microsoftonline"
)

// 認証を開始するメソッド
func StartOauth(ctx echo.Context,providerName string) {
	// リクエストを変更
	ctx.SetRequest(contextWithProviderName(ctx,providerName))

	// リクエスト取得
	request := ctx.Request()

	// 認証開始
	gothic.BeginAuthHandler(ctx.Response().Writer,request)
}

func CallbackOauth(ctx echo.Context,providerName string) (goth.User,error) {
	// リクエスト変更
	ctx.SetRequest(contextWithProviderName(ctx,providerName))

	// 認証を完了する
	user,err := gothic.CompleteUserAuth(ctx.Response().Writer,ctx.Request())

	// エラー処理
	if err != nil {
		return goth.User{},err
	}

	return user,nil
}

// コンテキストを設定
func contextWithProviderName(ctx echo.Context, providerName string) (*http.Request) {
	return	ctx.Request().WithContext(context.WithValue(ctx.Request().Context(), "provider", providerName))
}

func UseProviders() {
	// 認証プロバイダー
	providers := []goth.Provider{}

	// モデルから取得
	// Google
	gprovider, err := models.GetProvider(models.Google)

	// エラー処理
	if err != nil {
		logger.PrintErr(err)
	}

	if err == nil {
		// 認証プロバイダーに追加
		providers = append(providers,google.New(gprovider.ClientID,gprovider.ClientSecret,gprovider.CallbackURL))
	}

	// github
	githubProvider, err := models.GetProvider(models.Github)

	// エラー処理
	if err != nil {
		logger.PrintErr(err)
	}

	if err == nil {
		// 認証プロバイダーに追加
		providers = append(providers,github.New(githubProvider.ClientID,githubProvider.ClientSecret,githubProvider.CallbackURL))
	}

	// microsoft
	microsoftProvider, err := models.GetProvider(models.Microsoft)

	// エラー処理
	if err != nil {
		logger.PrintErr(err)
	}

	// エラー処理
	if err == nil {
		// 認証プロバイダーに追加
		providers = append(providers,microsoftonline.New(microsoftProvider.ClientID,microsoftProvider.ClientSecret,microsoftProvider.CallbackURL))
	}

	// discord
	discordProvider, err := models.GetProvider(models.Discord)

	// エラー処理
	if err != nil {
		logger.PrintErr(err)
	}

	// エラー処理
	if err == nil {
		// 認証プロバイダーに追加
		providers = append(providers,discord.New(discordProvider.ClientID,discordProvider.ClientSecret,discordProvider.CallbackURL))
	}

	// 認証プロバイダーを設定
	goth.UseProviders(providers...)
}