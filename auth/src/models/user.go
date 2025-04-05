package models

type User struct {
	UserID       string       `gorm:"primaryKey"`
	Name         string       // ユーザー名
	Email        string       `gorm:"unique"` // メールアドレス
	ProviderCode ProviderCode // 認証プロバイダ
	PasswordHash string       `default:""`            // ハッシュ化されたパスワード
	CreatedAt    int64        `gorm:"autoCreateTime"` // ユーザー作成日
}

func CreateUser(user *User, ProviderCode ProviderCode) error {
	// プロバイダを取得する
	provider, err := GetProvider(ProviderCode)

	// エラー処理
	if err != nil {
		return err
	}

	// ユーザを作成する
	err = dbconn.Create(user).Error

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

	return nil
}

// ユーザーを取得
func GetUser(userID string) (*User, error) {
	var user User

	// 取得する
	err := dbconn.Where(&User{UserID: userID}).First(&user).Error
	return &user, err
}

// メールアドレスからユーザーを取得
func GetUserByEmail(email string) (*User, error) {
	var user User

	// 取得する
	err := dbconn.Where(&User{Email: email}).First(&user).Error
	return &user, err
}

// 全てのユーザーを取得
func GetAllUsers() ([]User, error) {
	var users []User

	// 取得する
	err := dbconn.Find(&users).Error
	return users, err
}
