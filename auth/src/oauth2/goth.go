package oauth2

import (
	"context"
	"net/http"
	"os"

	"github.com/labstack/echo/v4"
	"github.com/markbates/goth"
	"github.com/markbates/goth/gothic"
	"github.com/markbates/goth/providers/google"
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
	goth.UseProviders(
		google.New(os.Getenv("GoogleClientID"),os.Getenv("GoogleClientSecret"),os.Getenv("GoogleCallback")),
	)
}