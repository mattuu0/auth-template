package oauth2

import (
	"auth/logger"
	"auth/models"
	"context"
	"encoding/base64"
	"net/http"

	"github.com/labstack/echo/v4"
	"github.com/markbates/goth"
	"github.com/markbates/goth/gothic"
	"github.com/markbates/goth/providers/discord"
	"github.com/markbates/goth/providers/github"
	"github.com/markbates/goth/providers/google"
	"github.com/markbates/goth/providers/microsoftonline"

	"github.com/vmihailenco/msgpack/v5"
)

func InitGothic() {

}

type OauthArgs struct {
	ProviderName string // プロバイダー名
	IsMobile     bool   // モバイルかどうか
}

// 認証を開始するメソッド
func StartOauth(ctx echo.Context, args OauthArgs) error {
	// リクエストを変更
	ctx.SetRequest(contextWithProviderName(ctx, args.ProviderName))

	// リクエスト取得
	request := ctx.Request()
	response := ctx.Response()

	// バイナリ
	argsbin, err := msgpack.Marshal(args)

	// エラー処理
	if err != nil {
		logger.PrintErr(err)
		return err
	}

	// base64 エンコード
	paylaod := base64.StdEncoding.EncodeToString(argsbin)

	logger.Println(paylaod)

	// クッキー
	ctx.SetCookie(&http.Cookie{
		Name:     "goth",
		Value:    paylaod,
		Path:     "/",
		MaxAge:   0,
		SameSite: http.SameSiteLaxMode,
		HttpOnly: true,
	})

	// 認証開始
	gothic.BeginAuthHandler(response.Writer, request)

	return nil
}

// 認証を完了
type OauthResponse struct {
	User goth.User
	IsMobile bool
}

func CallbackOauth(ctx echo.Context, providerName string) (OauthResponse, error) {
	request := contextWithProviderName(ctx, providerName)

	// リクエスト変更
	ctx.SetRequest(request)

	// クッキー
	cooike, err := ctx.Cookie("goth")

	// エラー処理
	if err != nil {
		return OauthResponse{}, err
	}

	// リクエスト変更
	payload, err := base64.StdEncoding.DecodeString(cooike.Value)

	// エラー処理
	if err != nil {
		return OauthResponse{}, err
	}

	// バイナリ
	var args OauthArgs
	err = msgpack.Unmarshal(payload, &args)

	// エラー処理
	if err != nil {
		return OauthResponse{}, err
	}

	logger.Println(args)

	user, err := gothic.CompleteUserAuth(ctx.Response().Writer, request)

	// エラー処理
	if err != nil {
		return OauthResponse{}, err
	}

	return OauthResponse{User: user, IsMobile: args.IsMobile}, nil
}

// コンテキストを設定
func contextWithProviderName(ctx echo.Context, providerName string) *http.Request {
	return ctx.Request().WithContext(context.WithValue(ctx.Request().Context(), "provider", providerName))
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

	// エラー処理 と 有効かどうか
	if err == nil && gprovider.IsEnabled == 1 {
		// 認証プロバイダーに追加
		providers = append(providers, google.New(gprovider.ClientID, gprovider.ClientSecret, gprovider.CallbackURL))
	}

	// github
	githubProvider, err := models.GetProvider(models.Github)

	// エラー処理
	if err != nil {
		logger.PrintErr(err)
	}

	// エラー処理 と 有効かどうか
	if err == nil && githubProvider.IsEnabled == 1 {
		// 認証プロバイダーに追加
		providers = append(providers, github.New(githubProvider.ClientID, githubProvider.ClientSecret, githubProvider.CallbackURL))
	}

	// microsoft
	microsoftProvider, err := models.GetProvider(models.Microsoft)

	// エラー処理
	if err != nil {
		logger.PrintErr(err)
	}

	// エラー処理 と 有効かどうか
	if err == nil && microsoftProvider.IsEnabled == 1 {
		// 認証プロバイダーに追加
		providers = append(providers, microsoftonline.New(microsoftProvider.ClientID, microsoftProvider.ClientSecret, microsoftProvider.CallbackURL))
	}

	// discord
	discordProvider, err := models.GetProvider(models.Discord)

	// エラー処理
	if err != nil {
		logger.PrintErr(err)
	}

	// エラー処理 と 有効かどうか
	if err == nil && discordProvider.IsEnabled == 1 {
		// 認証プロバイダーに追加
		providers = append(providers, discord.New(discordProvider.ClientID, discordProvider.ClientSecret, discordProvider.CallbackURL))
	}

	// 認証プロバイダーを設定
	goth.UseProviders(providers...)
}
