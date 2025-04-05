package main

import (
	"auth/models"
	"auth/services"
	"net/http"

	"github.com/labstack/echo/v4"
	_ "github.com/joho/godotenv/autoload"
)

func Init() {
	// モデル初期化
	models.Init()

	// サービス初期化
	services.Init()
}

func main() {
	// 初期化
	Init()

	// エンジン初期化
	router := echo.New()

	// ルーティング設定
	SetupRouter(router)

	// ヘルスチェック
	router.GET("/health", func(ctx echo.Context) error {
		return ctx.String(http.StatusOK, "OK")
	})
	
	router.Logger.Fatal(router.Start(":8080"))
}
