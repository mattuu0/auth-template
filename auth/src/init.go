package main

import (
	"auth/controllers"
	"auth/middlewares"
	"html/template"
	"io"

	"github.com/labstack/echo/v4"
	"github.com/labstack/echo/v4/middleware"
)

// TemplateRenderer is a custom html/template renderer for Echo framework
type TemplateRenderer struct {
	templates *template.Template
}

// Render renders a template document
func (temp *TemplateRenderer) Render(writer io.Writer, name string, data interface{}, ctx echo.Context) error {

	// Add global methods if data is a map
	if viewContext, isMap := data.(map[string]interface{}); isMap {
		viewContext["reverse"] = ctx.Echo().Reverse
	}

	return temp.templates.ExecuteTemplate(writer, name, data)
}

func SetupRouter(router *echo.Echo) {
	// logger 設定
	router.Use(middleware.Logger())

	// テンプレート
	renderer := &TemplateRenderer{
		templates: template.Must(template.ParseGlob("templates/*.html")),
	}

	// レンダラー
	router.Renderer = renderer

	// ルーティング設定
	// ベーシックユーザーグループ
	basicg := router.Group("/basic")
	{
		basicg.POST("/signup", controllers.CreateBasicUser)
		basicg.POST("/login", controllers.LoginBasicUser)
	}

	// アイコンフォルダを配信する
	router.Static("/assets", "./assets/icons")

	// 情報を取得する
	router.GET("/me", controllers.GetMe, middlewares.RequireAuth)

	// token を取得する
	router.GET("/token", controllers.GetToken, middlewares.RequireAuth)

	// ログアウト
	router.POST("/logout",controllers.Logout,middlewares.RequireAuth)

	// oauth グループ
	oauthg := router.Group("/oauth")
	{
		oauthg.GET("/:provider",controllers.StartOauth)
		oauthg.GET("/:provider/callback",controllers.CallbackOauth)
	}

	// api グループ
	apig := router.Group("/api")
	{
		// ユーザーのグループ作成
		userg := apig.Group("/user")
		{
			// ユーザー一覧を取得する
			userg.GET("/all", controllers.GetAllUsers)

			// ユーザーを更新する
			userg.PUT("", controllers.UpdateUser)

			// ユーザーを削除する
			userg.DELETE("",controllers.DeleteOauth)

			// BAN を切り替える
			userg.PUT("/ban",controllers.ToggleBan)
		}

		// プロバイダグループ
		providerg := apig.Group("/providers")
		{
			// プロバイダー一覧を取得する
			providerg.GET("", controllers.GetProviders)

			// Oauth プロバイダ一覧取得
			providerg.GET("/oauth",controllers.GetOauthProviders)

			// Oauth プロバイダ一覧更新
			providerg.POST("/oauth",controllers.UpdateOauthProviders)

			// プロバイダー一覧を更新する
			providerg.POST("", controllers.UpdateProviders)
		}

		// ラベルグループを作る
		labelg := apig.Group("/labels")
		{
			// ラベルを取得する
			labelg.GET("",controllers.GetLabels)

			// ラベルを作成する
			labelg.POST("",controllers.CreateLabel)

			// ラベルを更新する
			labelg.PUT("",controllers.UpdateLabel)

			// ラベルを削除する
			labelg.DELETE("",controllers.DeleteLabel)
		}
	}
}