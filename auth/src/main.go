package main

import (
	"auth/oauth2"
	"net/http"

	_ "github.com/joho/godotenv/autoload"
	"github.com/labstack/echo/v4"
)

var (
	OauthProv *oauth2.OauthProvider = nil
)

func init() {
	// 認証プロバイダ初期化
	OauthProv = &oauth2.OauthProvider{}
}

func main() {
	// 認証初期化
	oauth2.UseProviders()

	// ルータ
	router := echo.New()

	router.GET("/", func(ctx echo.Context) error {
		return ctx.String(http.StatusOK, "Hello, World!")
	})

	router.GET("/:provider",func(ctx echo.Context) error {
		provider := ctx.Param("provider")

		OauthProv.StartOauth(ctx,provider)

		return nil
	})

	router.GET("/:provider/callback",func(ctx echo.Context) error {
		provider := ctx.Param("provider")

		OauthProv.CallbackOauth(ctx,provider)

		return ctx.Redirect(http.StatusTemporaryRedirect,"/auth/")
	})
	
	router.Logger.Fatal(router.Start(":8080"))
}
