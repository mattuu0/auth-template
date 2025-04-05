package services

import "auth/models"

type SessionArgs struct {
	UserID    string // ユーザーID
	RemoteIP  string // リモートIP
	UserAgent string // ユーザーエージェント
}

func GenSessionToken(SessionID string) (string, error) {
	return "", nil
}

// セッションを作成してトークンを返す
func NewSession(args SessionArgs) (string, error) {
	// ユーザーIDを取得
	user, err := models.GetUser(args.UserID)

	// エラー処理
	if err != nil {
		return "", err
	}

	// セッションを作成
	session := models.Session{
		UserID:    args.UserID,
		RemoteIP:  args.RemoteIP,
		UserAgent: args.UserAgent,
	}

	// セッションを追加
	if err := user.NewSession(&session); err != nil {
		return "", err
	}

	// トークンを生成
	GenSessionToken(session.SessionID)

	return session.SessionID, nil
}
