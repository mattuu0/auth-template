package oauth2

import (
	"context"
	"log"
	"net/http"
	"os"

	"github.com/labstack/echo/v4"
	"github.com/markbates/goth"
	"github.com/markbates/goth/gothic"
	"github.com/markbates/goth/providers/google"
)

// 認証用のプロバイダ
type OauthProvider struct {}

// 認証を開始するメソッド
func (provider *OauthProvider) StartOauth(ctx echo.Context,providerName string) {
	// リクエストを変更
	ctx.SetRequest(provider.contextWithProviderName(ctx,providerName))

	// リクエスト取得
	request := ctx.Request()

	// 認証開始
	gothic.BeginAuthHandler(ctx.Response().Writer,request)
}

func (provider *OauthProvider) CallbackOauth(ctx echo.Context,providerName string) (string,error) {
	// リクエスト変更
	ctx.SetRequest(provider.contextWithProviderName(ctx,providerName))

	// 認証を完了する
	user,err := gothic.CompleteUserAuth(ctx.Response().Writer,ctx.Request())

	// エラー処理
	if err != nil {
		return "",err
	}

	log.Println(user)

	return "",nil
}

// コンテキストを設定
func (provider *OauthProvider) contextWithProviderName(ctx echo.Context, providerName string) (*http.Request) {
	return	ctx.Request().WithContext(context.WithValue(ctx.Request().Context(), "provider", providerName))
}

func UseProviders() {
	goth.UseProviders(
		google.New(os.Getenv("GoogleClientID"),os.Getenv("GoogleClientSecret"),os.Getenv("GoogleCallback")),
	)
}