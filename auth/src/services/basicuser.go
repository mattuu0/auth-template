package services

import (
	"auth/models"
	"auth/structs"
	"auth/utils"
	"errors"
	"net/http"

	"github.com/labstack/echo/v4"
)

type CreateBasicUserArgs struct {
	Name     string // ユーザー名
	Email    string // メールアドレス
	Password string // パスワード
}

// 一般ユーザーを作成する
func CreateBasicUser(args CreateBasicUserArgs) (string, structs.HttpResult) {
	// UUID を生成
	uid := utils.GenID()

	// 現在時刻を取得
	now := utils.NowTime()

	// ユーザーを取得する
	_, err := models.GetUserByEmail(args.Email)

	// エラー処理
	if err == nil {
		return "", structs.HttpResult{
			Code: http.StatusConflict,
			Message: echo.Map{
				"message": "user already exists",
			},
			Error:   err,
			Success: false,
		}
	}

	// パスワードをハッシュ化する
	hashed, err := utils.HashPassword(args.Password)

	// エラー処理
	if err != nil {
		return "", structs.HttpResult{
			Code: http.StatusInternalServerError,
			Message: echo.Map{
				"message": "failed to hash password",
			},
			Error:   err,
			Success: false,
		}
	}

	// ユーザーを作成する
	err = models.CreateUser(&models.User{
		UserID:       uid,
		Name:         args.Name,
		Email:        args.Email,
		ProvCode:     "",
		PasswordHash: hashed,
		CreatedAt:    now,
	}, models.Basic)

	// エラー処理
	if err != nil {
		return "", structs.HttpResult{
			Code: http.StatusInternalServerError,
			Message: echo.Map{
				"message": "failed to create user",
			},
			Error:   err,
			Success: false,
		}
	}

	return uid, structs.HttpResult{
		Code: http.StatusOK,
		Message: echo.Map{
			"message": "success",
		},
		Error:   nil,
		Success: true,
	}
}

type LoginBasicUserArgs struct {
	Email    string // メールアドレス
	Password string // パスワード
}

func LoginBasicUser(args LoginBasicUserArgs) structs.HttpResult {
	// ユーザーを取得する
	user, err := models.GetUserByEmail(args.Email)

	// エラー処理
	if err != nil {
		return structs.HttpResult{
			Code: http.StatusInternalServerError,
			Message: echo.Map{
				"message": "failed to get user",
			},
			Error:   err,
			Success: false,
		}
	}

	// プロバイダをチェックする
	if user.ProvCode != models.Basic {
		// basic 以外の場合はエラーを返す
		return structs.HttpResult{
			Code: http.StatusBadRequest,
			Message: echo.Map{
				"message": "invalid provider",
			},
			Error:   errors.New("invalid provider"),
			Success: false,
		}
	}

	// パスワードをチェックする
	if !utils.CheckPasswordHash(args.Password, user.PasswordHash) {
		// パスワードが一致しない場合はエラーを返す
		return structs.HttpResult{
			Code: http.StatusBadRequest,
			Message: echo.Map{
				"message": "invalid password",
			},
			Error:   errors.New("invalid password"),
			Success: false,
		}
	}

	// セッションを作成する
	token, err := NewSession(SessionArgs{
		UserID:    user.UserID,
		RemoteIP:  "",
		UserAgent: "",
	})

	// エラー処理
	if err != nil {
		return structs.HttpResult{
			Code: http.StatusInternalServerError,
			Message: echo.Map{
				"message": "failed to create session",
				"error":   err.Error(),
			},
			Error:   err,
			Success: false,
		}
	}

	return structs.HttpResult{
		Code: http.StatusOK,
		Message: echo.Map{
			"token": token,
		},
		Error:   nil,
		Success: true,
	}
}
