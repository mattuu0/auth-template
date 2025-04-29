package services

import "auth/models"

type UserInfo struct {
	UserID   string `json:"user_id"`
	Name     string `json:"name"`
	Email    string `json:"email"`
	ProvCode string `json:"prov_code"`
	ProvUid  string `json:"prov_uid"`
}

func GetMe(userid string) (UserInfo, error) {
	// ユーザー取得
	user, err := models.GetUser(userid)

	// エラー処理
	if err != nil {
		return UserInfo{}, err
	}

	return UserInfo{
		UserID: user.UserID,
		Name:   user.Name,
		Email:  user.Email,
		ProvCode: string(user.ProvCode),
		ProvUid:  user.ProvUID,
	}, nil
}

// ここからユーザーの更新
type UpdateUserData struct {
	ID     string   `json:"id"`
	Name   string   `json:"name"`
	Avatar string   `json:"avatar"`
	Labels []string `json:"labels"` // JSONの文字列配列はGoのスライス ([]string) で受けます
}

// ユーザーを更新する関数
func UpdateUser(args UpdateUserData) error {
	// ユーザーを取得
	user, err := models.GetUser(args.ID)

	// エラー処理
	if err != nil {
		return err
	}

	// ユーザーを更新する
	user.Name = args.Name

	// ラベルを回す
	for _, labelName := range args.Labels {
		// ラベルを追加
		err = user.AddLabel(labelName)

		// エラー処理
		if err != nil {
			return err
		}
	}

	return models.UpdateUser(user)
}

// ここまで