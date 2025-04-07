package controllers

import (
	"auth/logger"
	"auth/oauth2"
	"auth/services"
	"net/http"

	"github.com/labstack/echo/v4"
)

func StartOauth(ctx echo.Context) error {
	provider := ctx.Param("provider")

	// 認証を開始
	oauth2.StartOauth(ctx,provider)

	return nil
}

func CallbackOauth(ctx echo.Context) error {
	provider := ctx.Param("provider")

	// oauth を完了
	user,err := oauth2.CallbackOauth(ctx,provider)

	// エラー処理
	if err != nil {
		// エラー処理
		logger.PrintErr(err)

		return ctx.JSON(http.StatusBadRequest, echo.Map{"error": err.Error()})
	}

	// ユーザーを作成
	token,err := services.LoginOauthUser(services.OauthUserArgs{
		Name:         user.Name,
		Email:        user.Email,
		ProviderCode: provider,
		RemoteIP:     ctx.RealIP(),
		UserAgent:    ctx.Request().UserAgent(),
	})
	if err != nil {
		return ctx.JSON(http.StatusInternalServerError, echo.Map{"error": err.Error()})
	}

	return ctx.JSON(http.StatusOK, echo.Map{"token": token})
}
