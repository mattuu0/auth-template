package controllers

import (
	"net/http"

	"github.com/labstack/echo/v4"
)

func GetMe(ctx echo.Context) error {
	return ctx.JSON(http.StatusOK, echo.Map{"message": "success"})
}