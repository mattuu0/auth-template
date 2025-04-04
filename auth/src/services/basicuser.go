package services

import (
	"auth/models"
	"auth/structs"
	"auth/utils"
	"errors"
	"net/http"
)

type CreateBasicUserArgs struct {
	Name     string // ユーザー名
	Email    string // メールアドレス
	Password string // パスワード
}

// 一般ユーザーを作成する
func CreateBasicUser(args CreateBasicUserArgs) (string,structs.HttpResult) {
	// UUID を生成
	uid := utils.GenID()

	// 現在時刻を取得
	now := utils.NowTime()

	// ユーザーを取得する
	_, err := models.GetUserByEmail(args.Email)

	// エラー処理
	if err == nil {
		return "",structs.HttpResult{
			Code:    http.StatusConflict,
			Message: "user already exists",
			Error:   err,
			Success: false,
		}
	}

	// パスワードをハッシュ化する
	hashed, err := utils.HashPassword(args.Password)

	// エラー処理
	if err != nil {
		return "",structs.HttpResult{
			Code:    http.StatusInternalServerError,
			Message: "failed to hash password",
			Error:   err,
			Success: false,
		}
	}

	// ユーザーを作成する
	err = models.CreateUser(&models.User{
		UserID:       uid,
		Name:         args.Name,
		Email:        args.Email,
		ProviderCode: "",
		PasswordHash: hashed,
		CreatedAt:    now,
	}, models.Basic)

	// エラー処理
	if err != nil {
		return "",structs.HttpResult{
			Code:    http.StatusInternalServerError,
			Message: "failed to create user",
			Error:   err,
			Success: false,
		}
	}

	return uid, structs.HttpResult{
		Code:    http.StatusOK,
		Message: "success",
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
			Code:    http.StatusInternalServerError,
			Message: "failed to get user",
			Error:   err,
			Success: false,
		}
	}

	// プロバイダをチェックする
	if user.ProviderCode != models.Basic {
		// basic 以外の場合はエラーを返す
		return structs.HttpResult{
			Code:    http.StatusBadRequest,
			Message: "invalid provider",
			Error:   errors.New("invalid provider"),
			Success: false,
		}
	}

	// パスワードをチェックする
	if utils.CheckPasswordHash(args.Password, user.PasswordHash) {
		return structs.HttpResult{
			Code:    http.StatusOK,
			Message: "success",
			Error:   nil,
			Success: true,
		}
	}

	return structs.HttpResult{
		Code:    http.StatusBadRequest,
		Message: "invalid password",
		Error:   errors.New("invalid password"),
		Success: false,
	}
}