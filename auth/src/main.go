package main

import (
	"auth/models"
	"net/http"

	"github.com/labstack/echo/v4"
)

func Init() {
	// モデル初期化
	models.Init()
}

func main() {
	// 初期化
	Init()

	router := echo.New()

	router.GET("/", func(ctx echo.Context) error {
		return ctx.String(http.StatusOK, "Hello, World!")
	})
	
	router.Logger.Fatal(router.Start(":8080"))
}
