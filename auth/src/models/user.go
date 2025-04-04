package models

type User struct {
	UserID       string `gorm:"primaryKey"`
	Name         string // ユーザー名
	Email        string `gorm:"unique` // メールアドレス
	ProviderCode string // 認証プロバイダ
	PasswordHash string `default:""` // ハッシュ化されたパスワード
	CreatedAt    int64  `gorm:"autoCreateTime` // ユーザー作成日
}

func CreateUser(user *User, ProviderCode string) error {
	// プロバイダを取得する
	provider, err := GetProvider(ProviderCode)

	// エラー処理
	if err != nil {
		return err
	}

	// 認証プロバイダを設定する
	user.ProviderCode = provider.ProviderCode

	return dbconn.Create(user).Error
}

func GetUser(userID string) (*User, error) {
	var user User

	// 取得する
	err := dbconn.First(&user, &User{UserID: userID}).Error
	return &user, err
}
