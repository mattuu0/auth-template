package models

type Label struct {
	ID    uint   `gorm:"primarykey"`      // ラベルのプライマリキー
	Name  string `gorm:"unique;not null"` // ラベル名（ユニークかつNULL不可）
	Color string `gorm:"default:#000000"` // ラベルの色

	CreatedAt int64 `gorm:"autoCreateTime"`	// ラベルの作成日時

	// これも同じ中間テーブル "user_labels" を指定します。
	Users []*User `gorm:"many2many:user_labels;constraint:OnDelete:CASCADE"`
}

func GetLabels() ([]Label, error) {
	var labels []Label

	// 取得する
	err := dbconn.Find(&labels).Error
	return labels, err
}

func GetLabel(name string) (*Label, error) {
	var label Label

	// 取得する
	err := dbconn.Where(&Label{Name: name}).First(&label).Error
	return &label, err
}

func CreateLabel(label *Label) error {
	return dbconn.Create(label).Error
}

func UpdateLabel(label *Label) error {
	return dbconn.Save(label).Error
}

func DeleteLabel(label *Label) error {
	return dbconn.Delete(label).Error
}
