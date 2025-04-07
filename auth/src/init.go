package main

import (
	"auth/controllers"
	"auth/middlewares"

	"github.com/labstack/echo/v4"
	"github.com/labstack/echo/v4/middleware"
)

func SetupRouter(router *echo.Echo) {
	// logger 設定
	router.Use(middleware.Logger())

	// ルーティング設定
	// ベーシックユーザーグループ
	basicg := router.Group("/basic")
	{
		basicg.POST("/signup", controllers.CreateBasicUser)
		basicg.POST("/login", controllers.LoginBasicUser)
	}

	// 情報を取得する
	router.GET("/me", controllers.GetMe, middlewares.RequireAuth)

	// ログアウト
	router.POST("/logout",controllers.Logout,middlewares.RequireAuth)

	// oauth グループ
	oauthg := router.Group("/oauth")
	{
		oauthg.GET("/:provider",controllers.StartOauth)
		oauthg.GET("/:provider/callback",controllers.CallbackOauth)
	}
}