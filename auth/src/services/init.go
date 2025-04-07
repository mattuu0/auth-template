package services

import "os"

var (
	// トークンシークレット
	TokenSecret = "secret"
)

func Init() {
	// 環境変数からトークンシークレットを取得
	TokenSecret = os.Getenv("TOKEN_SECRET")
}