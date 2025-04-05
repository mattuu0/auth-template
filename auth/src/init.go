package main

import (
	"auth/controllers"
	"auth/middlewares"

	"github.com/labstack/echo/v4"
)

func SetupRouter(router *echo.Echo) {
	// ルーティング設定
	// ベーシックユーザーグループ
	basicg := router.Group("/basic")
	{
		basicg.POST("/signup", controllers.CreateBasicUser)
		basicg.POST("/login", controllers.LoginBasicUser)
	}

	// 情報を取得する
	router.GET("/me", controllers.GetMe, middlewares.RequireAuth)
}