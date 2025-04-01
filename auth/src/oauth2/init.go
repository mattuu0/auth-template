package oauth2

import (
	"context"
	"log"
	"net/http"

	"github.com/labstack/echo/v4"
	"github.com/markbates/goth/gothic"
)

// 認証用のプロバイダ
type OauthProvider struct {

}

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
