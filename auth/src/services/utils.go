package services

import (
	"bytes"
	"errors"
	"fmt"
	"image"
	"image/jpeg"
	"image/png"
	"io"
	"mime/multipart"
	"net/http"
	"net/url"
	"os"
	"path/filepath"
	"strings"
	"time"

	"golang.org/x/image/draw"
)

// 対応している画像形式
const (
	FormatJPEG = "jpeg"
	FormatPNG  = "png"
	FormatGIF  = "gif"
	FormatBMP  = "bmp"
)

// SaveResizedImage は multipart.File からの画像を指定サイズにリサイズして保存します
// params:
//   - file: アップロードされたファイルのmultipart.File
//   - filename: ファイル名
//   - fileSize: ファイルサイズ
//   - maxWidth: リサイズ後の最大幅
//   - maxHeight: リサイズ後の最大高さ
//   - quality: JPEG画像の品質 (0-100)
//   - saveDir: 保存先ディレクトリ
//
// return:
//   - string: 保存されたファイルのパス
//   - error: エラー
func SaveResizedImage(file multipart.File, filename string, fileSize int64, maxWidth, maxHeight, quality int, saveDir string) (string, error) {
	// ファイルサイズのチェック
	if fileSize <= 0 {
		return "", errors.New("invalid file size")
	}

	// ファイル名と拡張子の抽出
	ext := strings.ToLower(filepath.Ext(filename))
	if ext == "" {
		return "", errors.New("file has no extension")
	}
	ext = ext[1:] // 先頭の "." を削除

	// 対応している画像形式かどうかチェック
	var format string
	switch ext {
	case "jpg", "jpeg":
		format = FormatJPEG
	case "png":
		format = FormatPNG
	case "gif":
		format = FormatGIF
	case "bmp":
		format = FormatBMP
	default:
		return "", fmt.Errorf("unsupported image format: %s", ext)
	}

	// 画像をデコード
	img, _, err := image.Decode(file)
	if err != nil {
		return "", fmt.Errorf("failed to decode image: %w", err)
	}

	// 元の画像サイズを取得
	bounds := img.Bounds()
	width, height := bounds.Dx(), bounds.Dy()

	// リサイズが必要か判断
	var resized bool
	if width > maxWidth || height > maxHeight {
		// アスペクト比を維持してリサイズ
		ratio := float64(width) / float64(height)
		if width > maxWidth {
			width = maxWidth
			height = int(float64(width) / ratio)
		}
		if height > maxHeight {
			height = maxHeight
			width = int(float64(height) * ratio)
		}
		resized = true
	}

	var dst *image.RGBA
	if resized {
		// リサイズ先の画像を作成
		dst = image.NewRGBA(image.Rect(0, 0, width, height))

		// リサイズ実行
		draw.CatmullRom.Scale(dst, dst.Bounds(), img, img.Bounds(), draw.Over, nil)
	} else {
		// リサイズ不要の場合は元のサイズでRGBAに変換
		dst = image.NewRGBA(image.Rect(0, 0, width, height))
		draw.Draw(dst, dst.Bounds(), img, bounds.Min, draw.Src)
	}

	// 保存先ディレクトリが存在しない場合は作成
	if err := os.MkdirAll(saveDir, 0755); err != nil {
		return "", fmt.Errorf("failed to create directory: %w", err)
	}

	// ユニークなファイル名を生成（ここではタイムスタンプを使用）
	newFilename := fmt.Sprintf("%d_%s", time.Now().UnixNano(), filepath.Base(filename))
	savePath := filepath.Join(saveDir, newFilename)

	// ファイルを作成
	outFile, err := os.Create(savePath)
	if err != nil {
		return "", fmt.Errorf("failed to create file: %w", err)
	}
	defer outFile.Close()

	// 画像を書き込み（EXIFデータは除去される）
	if err := encodeImage(outFile, dst, format, quality); err != nil {
		return "", fmt.Errorf("failed to encode image: %w", err)
	}

	return savePath, nil
}

// SaveResizedImageFromBytes はバイトスライスからの画像を指定サイズにリサイズして保存します
// params:
//   - imageData: 画像データのバイトスライス
//   - filename: ファイル名
//   - width: リサイズ後の幅
//   - height: リサイズ後の高さ
//   - saveDir: 保存先ディレクトリ
//
// return:
//   - string: 保存されたファイルのパス
//   - error: エラー
func SaveResizedImageFromBytes(imageData []byte, filename string, width, height int, saveDir string) (string, error) {
	if len(imageData) == 0 {
		return "", errors.New("empty image data")
	}

	// バイトスライスをReaderに変換
	reader := bytes.NewReader(imageData)

	// 画像処理
	img, err := processAndResizeImage(reader, width, height)
	if err != nil {
		return "", err
	}

	// PNG形式で画像保存
	return saveProcessedImage(img, filename, saveDir)
}

// 使用例
// ExampleUsage は関数の使用例を示します
func ExampleUsage() {
	// HTTPハンドラでの使用例 - multipart.Fileを使用
	http.HandleFunc("/upload", func(w http.ResponseWriter, r *http.Request) {
		// ファイルを取得
		file, header, err := r.FormFile("image")
		if err != nil {
			http.Error(w, "Failed to get file: "+err.Error(), http.StatusBadRequest)
			return
		}
		defer file.Close()

		// 画像をリサイズして保存（強制的に800x600にリサイズ、PNG形式で保存）
		savePath, err := SaveResizedImage(
			file,            // multipart.File
			header.Filename, // ファイル名
			header.Size,     // ファイルサイズ
			800,             // 幅を800pxに指定
			600,             // 高さを600pxに指定
			"./uploads",     // 保存先ディレクトリ
		)

		if err != nil {
			http.Error(w, "Failed to process image: "+err.Error(), http.StatusInternalServerError)
			return
		}

		fmt.Fprintf(w, "Image saved to: %s", savePath)
	})

	// バイトスライスを使用した例
	http.HandleFunc("/upload-bytes", func(w http.ResponseWriter, r *http.Request) {
		// ファイルを取得してバイトとして読み込む
		file, header, err := r.FormFile("image")
		if err != nil {
			http.Error(w, "Failed to get file: "+err.Error(), http.StatusBadRequest)
			return
		}
		defer file.Close()

		// ファイルの内容を読み込む
		imageData, err := io.ReadAll(file)
		if err != nil {
			http.Error(w, "Failed to read file: "+err.Error(), http.StatusInternalServerError)
			return
		}

		// バイトスライスから画像をリサイズして保存
		savePath, err := SaveResizedImageFromBytes(
			imageData,       // []byte
			header.Filename, // ファイル名
			800,             // 幅を800pxに指定
			600,             // 高さを600pxに指定
			"./uploads",     // 保存先ディレクトリ
		)

		if err != nil {
			http.Error(w, "Failed to process image: "+err.Error(), http.StatusInternalServerError)
			return
		}

		fmt.Fprintf(w, "Image saved to: %s", savePath)
	})

	// URLから画像を取得してリサイズする例
	http.HandleFunc("/upload-url", func(w http.ResponseWriter, r *http.Request) {
		// URLからパラメータを取得
		imageURL := r.URL.Query().Get("url")
		if imageURL == "" {
			http.Error(w, "Missing image URL", http.StatusBadRequest)
			return
		}

		// URLから画像をダウンロード、リサイズして保存
		savePath, err := SaveResizedImageFromURL(
			imageURL,    // 画像URL
			"",          // ファイル名 (空白の場合URLから自動抽出)
			800,         // 幅を800pxに指定
			600,         // 高さを600pxに指定
			"./uploads", // 保存先ディレクトリ
		)

		if err != nil {
			http.Error(w, "Failed to process image: "+err.Error(), http.StatusInternalServerError)
			return
		}

		fmt.Fprintf(w, "Image saved to: %s", savePath)
	})
}
