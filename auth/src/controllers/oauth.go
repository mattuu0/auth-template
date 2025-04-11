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

	// oauth を更新
	oauth2.UseProviders()

	// IsMobile
	isMobile := ctx.QueryParam("ismobile")

	// 認証を開始
	oauth2.StartOauth(ctx, oauth2.OauthArgs{
		ProviderName: provider,
		IsMobile:     isMobile == "1",
	})

	return nil
}

func CallbackOauth(ctx echo.Context) error {
	provider := ctx.Param("provider")

	// oauth を完了
	oauthResponse, err := oauth2.CallbackOauth(ctx, provider)

	// エラー処理
	if err != nil {
		// エラー処理
		logger.PrintErr(err)

		return ctx.JSON(http.StatusBadRequest, echo.Map{"error": err.Error()})
	}

	// ユーザー
	user := oauthResponse.User

	// ユーザーを作成
	token, err := services.LoginOauthUser(services.OauthUserArgs{
		Name:           user.Name,
		Email:          user.Email,
		ProviderCode:   provider,
		ProviderUserID: user.UserID,
		RemoteIP:       ctx.RealIP(),
		UserAgent:      ctx.Request().UserAgent(),
	})

	// エラー処理
	if err != nil {
		return ctx.JSON(http.StatusInternalServerError, echo.Map{"error": err.Error()})
	}

	logger.Println(token)

	if oauthResponse.IsMobile {
		return ctx.Redirect(http.StatusFound, "authkit://?token="+token)
	}

	return ctx.Render(http.StatusOK, "oauth-callback.html", echo.Map{"token": token})
	// return ctx.JSON(http.StatusOK, echo.Map{"token": token})
	// return ctx.Redirect(http.StatusFound, "/auth/")
}
