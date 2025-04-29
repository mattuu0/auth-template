package controllers

import (
	"auth/logger"
	"auth/services"
	"net/http"

	"github.com/labstack/echo/v4"
)

func GetAllUsers(ctx echo.Context) (error) {
	// サービスを呼び出す
	users, err := services.GetUsers()

	// エラー処理
	if err != nil {
		logger.PrintErr(err)
		return ctx.JSON(http.StatusInternalServerError, echo.Map{"error": err.Error()})
	}

	return ctx.JSON(http.StatusOK, users)
}