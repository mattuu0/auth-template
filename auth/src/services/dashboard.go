package services

import (
	"auth/models"
	"time"
)

type User struct {
	ID         string   `json:"id"`
	Name       string   `json:"name"`
	Email      string   `json:"email"`
	Provider   string   `json:"provider"`
	ProviderID string   `json:"providerId"`
	Avatar     string   `json:"avatar"`
	Labels     []string `json:"labels"`
	CreatedAt  string   `json:"createdAt"` // 日時型にする場合は time.Time を使用し、適切なフォーマットでパース・フォーマットする必要があります
	Banned     bool     `json:"banned"`
}

func GetUsers() ([]User, error) {
	// ユーザーを取得
	users, err := models.GetAllUsers()

	// エラー処理
	if err != nil {
		return []User{}, err
	}

	userResponse := []User{}
	for _, user := range users {
		// ラベルを取得
		labels,err := user.GetLabelNames()

		// エラー処理
		if err != nil {
			return []User{}, err
		}

		// ユーザーを返す
		userResponse = append(userResponse, User{
			ID:         user.UserID,
			Name:       user.Name,
			Email:      user.Email,
			Provider:   string(user.ProvCode),
			ProviderID: user.ProvUID,
			Avatar:     "",
			Labels:     labels,
			CreatedAt:  FormatUnixTimestampToString(user.CreatedAt, time.RFC3339),
			Banned:     user.IsBanned == 1,
		})
	}

	return userResponse, nil
}

func FormatUnixTimestampToString(timestamp int64, layout string) string {
	// Unixタイムスタンプ (秒) を time.Time に変換
	// time.Unix(seconds, nanoseconds) を使用
	t := time.Unix(timestamp, 0) // ナノ秒は0とします

	// time.Time を指定されたレイアウトで文字列にフォーマット
	return t.Format(layout)
}