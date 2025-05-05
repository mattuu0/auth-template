package utils

import (
	"auth/logger"

	"github.com/labstack/echo/v4"
)

func ErrorScreen(ctx echo.Context, code int, ErrorID string, Error error) error {
	// エラー表示
	logger.PrintErr2(2,"ErrorID: " + ErrorID,Error)

	return ctx.Render(code, "error-screen.html", echo.Map{
		"StatusCode": code,
		"ErrorID":    ErrorID,
		"Error":      Error.Error(),
	})
}
