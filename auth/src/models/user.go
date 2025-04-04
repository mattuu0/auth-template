package models

type User struct {
	UserID       string       `gorm:"primaryKey"`
	Name         string       // ユーザー名
	Email        string       `gorm:"unique` // メールアドレス
	ProviderCode ProviderCode // 認証プロバイダ
	PasswordHash string       `default:""`           // ハッシュ化されたパスワード
	CreatedAt    int64        `gorm:"autoCreateTime` // ユーザー作成日
}

func CreateUser(user *User, ProviderCode ProviderCode) error {
	// プロバイダを取得する
	provider, err := GetProvider(ProviderCode)

	// エラー処理
	if err != nil {
		return err
	}

	// プロバイダにユーザーを追加する
	err = dbconn.Model(provider).Association("Users").Append(user)

	// エラー処理
	if err != nil {
		return err
	}

	return dbconn.Create(user).Error
}

func GetUser(userID string) (*User, error) {
	var user User

	// 取得する
	err := dbconn.First(&user, &User{UserID: userID}).Error
	return &user, err
}

func GetUserByEmail(email string) (*User, error) {
	var user User

	// 取得する
	err := dbconn.First(&user, &User{Email: email}).Error
	return &user, err
}
