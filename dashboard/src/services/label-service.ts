// ラベル関連の操作を行うサービス
// 実際の実装ではバックエンドAPIとの通信を行う

export interface Label {
  id: string
  name: string
  color: string
  createdAt: string
}

// データを保持する変数
let labels: Label[] = []

// ラベル一覧を取得
export async function getLabels(): Promise<Label[]> {
  const req = await fetch("/auth/api/labels", {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    }
  });

  // ラベル一覧を取得
  labels = await req.json();

  // 実際の実装ではAPIからデータを取得
  return labels
}

// ラベルを検索
export async function searchLabels(query: string): Promise<Label[]> {
  // 実際の実装ではAPIからデータを取得
  return labels.filter((label) => label.name.toLowerCase().includes(query.toLowerCase()))
}

// ラベルを作成
export async function createLabel(label: Omit<Label, "id" | "createdAt">) {
  // ラベルを作成する
  const req = await fetch("/auth/api/labels", {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      name: label.name,
      color: label.color
    }),
  });

  // 結果を検証
  if (!req.ok) {
    throw new Error("Failed to create label")
  }
}

// ラベルを更新
export async function updateLabel(label: Partial<Label> & { id: string }): Promise<void> {
  // 実際の実装ではAPIを呼び出してラベルを更新
  console.log("Update label:", label);

  const req = await fetch("/auth/api/labels", {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(label),
  });

  if (!req.ok) {
    throw new Error("Failed to update label")
  }

  return;
}

// ラベルを削除
export async function deleteLabel(labelId: string): Promise<void> {
  // 実際の実装ではAPIを呼び出してラベルを削除
  console.log("Delete label:", labelId)

  const req = await fetch("/auth/api/labels", {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      id: labelId
    }),
  });

  if (!req.ok) {
    throw new Error("Failed to delete label")
  }

  return;
}

// // モックデータ
// const labels: Label[] = [
//   {
//     id: "lbl_123456",
//     name: "管理者",
//     color: "#ef4444",
//     createdAt: "2023-01-10",
//   },
//   {
//     id: "lbl_234567",
//     name: "一般ユーザー",
//     color: "#3b82f6",
//     createdAt: "2023-01-15",
//   },
//   {
//     id: "lbl_345678",
//     name: "プレミアム",
//     color: "#a855f7",
//     createdAt: "2023-02-20",
//   },
//   {
//     id: "lbl_456789",
//     name: "ベータテスター",
//     color: "#22c55e",
//     createdAt: "2023-03-05",
//   },
// ]
