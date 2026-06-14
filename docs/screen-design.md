# クイズアプリ 画面設計書

| 項目 | 内容 |
| --- | --- |
| プロジェクト名 | La-quizApp |
| 作成日 | 2026-05-31 |
| バージョン | 1.1 |
| 関連文書 | [requirements.md](requirements.md)（要件定義書）、`docs/er.drawio` |
| 技術スタック | Laravel 13 + Inertia.js + React (TypeScript) / MySQL |

> 本書は講義スライド「34. 設計の確認」のワイヤーフレーム・画面遷移図・モデル/コントローラ設計・DB スキーマを基に作成。

---

## 1. 画面一覧

### 1.1 プレイヤー画面

| ID | 画面名 | 概要 | コントローラ@アクション |
| --- | --- | --- | --- |
| PS-01 | トップ（カテゴリー一覧） | カテゴリーを選んで挑戦を開始 | PlayController@index |
| PS-02 | クイズスタート | 選択カテゴリーの開始確認 | PlayController@start |
| PS-03 | クイズ出題 | 問題文・4択（チェックボックス）・解答 | PlayController@question |
| PS-04 | クイズ解答（結果） | 正誤・選択肢ごとの正誤・解説・次へ | PlayController@answer |
| PS-05 | リザルト | 正解数 / 総問題数・再挑戦・カテゴリーへ | PlayController@result |

### 1.2 管理画面

| ID | 画面名 | 概要 | コントローラ@アクション |
| --- | --- | --- | --- |
| AS-01 | ログイン | 管理者認証 | LoginController@create / store |
| AS-02 | トップ（カテゴリー一覧） | カテゴリー一覧・新規登録・詳細・削除 | CategoryController@index |
| AS-03 | カテゴリー新規登録 | カテゴリー名・説明を登録 | CategoryController@create / store |
| AS-04 | カテゴリー詳細 | カテゴリー情報＋所属クイズ一覧 | CategoryController@show |
| AS-05 | カテゴリー編集 | カテゴリー名・説明を更新 | CategoryController@edit / update |
| AS-06 | クイズ新規登録 | 問題文・選択肢・正解・解説を登録 | QuizController@create / store |
| AS-07 | クイズ編集 | 問題文・選択肢・正解・解説を更新 | QuizController@edit / update |

---

## 2. ルーティング設計

### 2.1 プレイヤー（認証不要）

| メソッド | URL | アクション | 画面 |
| --- | --- | --- | --- |
| GET | `/` | PlayController@index | PS-01 |
| GET | `/categories/{category}/start` | PlayController@start | PS-02 |
| GET | `/categories/{category}/quiz` | PlayController@question | PS-03 |
| POST | `/categories/{category}/answer` | PlayController@answer | PS-04 |
| GET | `/categories/{category}/result` | PlayController@result | PS-05 |

### 2.2 管理（`/admin` プレフィックス・認証ミドルウェア）

| メソッド | URL | アクション | 画面 |
| --- | --- | --- | --- |
| GET | `/admin/login` | LoginController@create | AS-01 |
| POST | `/admin/login` | LoginController@store | （認証処理） |
| POST | `/admin/logout` | LoginController@destroy | （ログアウト） |
| GET | `/admin/categories` | CategoryController@index | AS-02 |
| GET | `/admin/categories/create` | CategoryController@create | AS-03 |
| POST | `/admin/categories` | CategoryController@store | （登録処理） |
| GET | `/admin/categories/{category}` | CategoryController@show | AS-04 |
| GET | `/admin/categories/{category}/edit` | CategoryController@edit | AS-05 |
| PUT | `/admin/categories/{category}` | CategoryController@update | （更新処理） |
| DELETE | `/admin/categories/{category}` | CategoryController@destroy | （カスケード削除） |
| GET | `/admin/categories/{category}/quizzes/create` | QuizController@create | AS-06 |
| POST | `/admin/categories/{category}/quizzes` | QuizController@store | （登録処理） |
| GET | `/admin/quizzes/{quiz}/edit` | QuizController@edit | AS-07 |
| PUT | `/admin/quizzes/{quiz}` | QuizController@update | （更新処理） |
| DELETE | `/admin/quizzes/{quiz}` | QuizController@destroy | （クイズ削除） |

---

## 3. 画面遷移図

### 3.1 プレイヤー画面

```text
[PS-01 トップ]
  └ カテゴリー選択
      ↓
[PS-02 クイズスタート] ──スタート──▶ [PS-03 クイズ出題]
                                        ↓ 解答ボタン
                                  [PS-04 クイズ解答(結果)]
                                        │
              ┌─────────────────────────┤
   未解答のクイズが残っている            すべて解答済み
              │（次の問題へ）            │
              ▼                          ▼
        [PS-03 クイズ出題]         [PS-05 リザルト]
                                        │
                          ┌─────────────┴─────────────┐
                  もう1度挑戦する              カテゴリー一覧へ
                          ▼                          ▼
                   [PS-02 クイズスタート]      [PS-01 トップ]
```

### 3.2 管理画面

```text
[AS-01 ログイン]
   ↓ 認証成功
[AS-02 トップ(カテゴリー一覧)]
   ├─ 新規登録 ─▶ [AS-03 カテゴリー新規登録] ─登録─▶ [AS-02]
   ├─ 詳細 ─────▶ [AS-04 カテゴリー詳細]
   │                 ├─ 編集 ───────▶ [AS-05 カテゴリー編集] ─更新─▶ [AS-04]
   │                 ├─ クイズ登録 ──▶ [AS-06 クイズ新規登録] ─登録─▶ [AS-04]
   │                 ├─ クイズ編集 ──▶ [AS-07 クイズ編集] ─更新─▶ [AS-04]
   │                 └─ クイズ削除（確認後 AS-04 に留まる）
   └─ 削除（カスケード削除。確認後 AS-02 に留まる）
```

---

## 4. 画面別 詳細設計

### PS-01 トップ（カテゴリー一覧）

```text
┌───────────────────────────────────┐
│ [ロゴ]                              │
├───────────────────────────────────┤
│        カテゴリーを選んでください       │
│                                    │
│   ┌──────────┐   ┌──────────┐      │
│   │ カテゴリー1 │   │ カテゴリー2 │      │
│   └──────────┘   └──────────┘      │
│   ┌──────────┐   ┌──────────┐      │
│   │ カテゴリー3 │   │ カテゴリー4 │      │
│   └──────────┘   └──────────┘      │
└───────────────────────────────────┘
```

| 要素 | 内容 | 操作 |
| --- | --- | --- |
| カテゴリーボタン | 登録済みカテゴリーをカード表示 | クリックで PS-02 へ（`category` を指定） |

- 表示データ：`categories` 全件（name）
- カテゴリーが0件の場合は「カテゴリーがありません」を表示。

### PS-02 クイズスタート

```text
┌───────────────────────────────────┐
│ [ロゴ]                              │
├───────────────────────────────────┤
│        ＜カテゴリー名＞               │
│                                    │
│           ┌───────────┐            │
│           │  スタート   │            │
│           └───────────┘            │
└───────────────────────────────────┘
```

| 要素 | 内容 | 操作 |
| --- | --- | --- |
| カテゴリー名 | 選択したカテゴリー名 | - |
| スタートボタン | クイズ開始 | クリックで PS-03 へ。出題対象（当該カテゴリーの全クイズ）をランダム順で初期化 |

### PS-03 クイズ出題

```text
┌───────────────────────────────────┐
│ [ロゴ]                              │
├───────────────────────────────────┤
│ 問題                                │
│ ワンピースの主人公の名前は？           │
│                                    │
│   1 ルフィ      ☐                   │
│   2 ゾロ        ☐                   │
│   3 ウソップ     ☐                   │
│   4 サンジ      ☐                   │
│                                    │
│           ┌───────┐                │
│           │  解答  │                │
│           └───────┘                │
└───────────────────────────────────┘
```

| 要素 | 内容 | 操作 |
| --- | --- | --- |
| 問題文 | 出題中クイズの `question` | - |
| 選択肢（4件） | `options.content` をチェックボックス表示 | 複数選択可 |
| 解答ボタン | 選択内容を送信 | クリックで判定 → PS-04。選択0件は送信不可（バリデーション） |

- 進捗表示（例: 「3 / 10問」）を任意で表示。

### PS-04 クイズ解答（結果）

| 要素 | 内容 | 操作 |
| --- | --- | --- |
| 正誤判定 | 正解 / 不正解（`isCorrectAnswer` の結果） | - |
| 選択肢毎の正解/不正解 | 各選択肢が正解 / 不正解かを表示 | - |
| 自分が選んだ選択肢 | プレイヤーが選択した選択肢を表示 | - |
| 解説 | クイズの `explanation` | - |
| 次の問題ボタン | 次へ進む | 未解答クイズが残れば PS-03、全問終了で PS-05 |

- 判定ロジックは「6. メソッド設計（isCorrectAnswer）」参照。

### PS-05 リザルト

| 要素 | 内容 | 操作 |
| --- | --- | --- |
| カテゴリー名 | 挑戦したカテゴリー名 | - |
| 結果 | 正解数 / 総問題数 | - |
| もう1度挑戦するボタン | 同カテゴリーを再挑戦 | クリックで PS-02 へ |
| カテゴリー一覧へ戻るボタン | トップへ | クリックで PS-01 へ |

- 回答結果は DB に保存しない（セッション内集計のみ）。

---

### AS-01 ログイン

```text
┌───────────────────────────────────┐
│ [ロゴ]                              │
├───────────────────────────────────┤
│   メールアドレス [_______________]    │
│   パスワード     [_______________]    │
│                                    │
│           ┌───────────┐            │
│           │  ログイン   │            │
│           └───────────┘            │
└───────────────────────────────────┘
```

| 要素 | 内容 | 操作 |
| --- | --- | --- |
| メールアドレス | 入力 | 必須 |
| パスワード | 入力（マスク） | 必須 |
| ログインボタン | 認証実行 | 成功で AS-02、失敗でエラー表示し本画面に留まる |

- 認証フローは「5. 管理者ログイン フロー」参照。
- 未認証で `/admin/*` にアクセスした場合は AS-01 へリダイレクト。

### AS-02 トップ（カテゴリー一覧）

```text
┌──────────────────────────────────────────────┐
│ [ロゴ]                            [ログアウト]   │
├──────────────────────────────────────────────┤
│                       カテゴリー一覧  [新規登録]   │
│  ID  カテゴリー名   更新日時                       │
│  1   カテゴリー1   2024-07-01   [詳細] [削除]      │
│  2   カテゴリー2   2024-07-01   [詳細] [削除]      │
│  3   カテゴリー3   2024-07-01   [詳細] [削除]      │
│  4   カテゴリー4   2024-07-01   [詳細] [削除]      │
└──────────────────────────────────────────────┘
```

| 要素 | 内容 | 操作 |
| --- | --- | --- |
| 一覧テーブル | ID・カテゴリー名・更新日時 | - |
| 新規登録ボタン | カテゴリー追加 | AS-03 へ |
| 詳細ボタン | 各行 | AS-04 へ |
| 削除ボタン | 各行 | 確認後カスケード削除し AS-02 を再表示 |
| ログアウトボタン | ヘッダー | ログアウトし AS-01 へ |

### AS-03 カテゴリー新規登録

| 要素 | 内容 | 操作 |
| --- | --- | --- |
| カテゴリー名 | 入力 | 必須 |
| 説明 | 入力 | 必須 |
| 登録ボタン | 保存 | 成功で AS-02 へ |

### AS-04 カテゴリー詳細

| 要素 | 内容 | 操作 |
| --- | --- | --- |
| カテゴリー名・説明 | 表示 | - |
| 編集ボタン | カテゴリー編集 | AS-05 へ |
| クイズ登録ボタン | クイズ追加 | AS-06 へ |
| クイズ一覧 | 所属クイズの問題文一覧 | - |
| クイズ編集ボタン | 各クイズ | AS-07 へ |
| クイズ削除ボタン | 各クイズ | 確認後削除し AS-04 を再表示 |

### AS-05 カテゴリー編集

| 要素 | 内容 | 操作 |
| --- | --- | --- |
| カテゴリー名 | 入力（初期値あり） | 必須 |
| 説明 | 入力（初期値あり） | 必須 |
| 更新ボタン | 保存 | 成功で AS-04 へ |

### AS-06 クイズ新規登録

| 要素 | 内容 | 操作 |
| --- | --- | --- |
| 問題文 | 入力 | 必須 |
| 選択肢 ×4 | 入力（`content`） | 各必須（4件） |
| 正解フラグ ×4 | 各選択肢の正解 / 不正解 | 1件以上を正解に |
| 解説 | 入力 | 必須 |
| 登録ボタン | 保存 | 成功で AS-04 へ |

### AS-07 クイズ編集

| 要素 | 内容 | 操作 |
| --- | --- | --- |
| 問題文 | 入力（初期値あり） | 必須 |
| 選択肢 ×4 | 入力（初期値あり） | 各必須 |
| 正解フラグ ×4 | 正解 / 不正解（初期値あり） | 1件以上を正解に |
| 解説 | 入力（初期値あり） | 必須 |
| 更新ボタン | 保存 | 成功で AS-04 へ |

---

## 5. 管理者ログイン フロー（アクティビティ図）

```text
管理者                                管理画面
  │                                     │
  │ 管理画面にアクセスする ─────────────▶  │
  │                          管理者ログイン画面を表示する
  │ ◀───────────────────────────────────│
  │ ログイン情報を入力し、ログインボタンを押す ─▶
  │                          ログイン情報を検証する
  │                                  │
  │                        ┌─────────┴─────────┐
  │                     正しくない              正しい
  │ ◀──（再入力）──────────┘                    │
  │                          管理画面のトップ画面を表示
  │ ◀───────────────────────────────────────────│
```

---

## 6. メソッド設計

### isCorrectAnswer

| 項目 | 説明 |
| --- | --- |
| メソッド名 | `isCorrectAnswer` |
| 処理 | プレイヤーの解答が正解かどうかを判定する |
| 引数 | プレイヤーの解答（array：選択した選択肢 ID の配列） |
| 返り値 | 正解か不正解か（boolean） |

- 判定基準：選択された選択肢の集合が、当該クイズの正解選択肢（`is_correct = true`）の集合と**完全一致**したときのみ `true`（部分一致は不正解）。
- 配置：`Quiz` モデルのメソッドとして実装する想定。

---

## 7. モデル設計

| モデル | 主な属性 | リレーション |
| --- | --- | --- |
| Category | name, description | quizzes: hasMany |
| Quiz | question, explanation | category: belongsTo / options: hasMany |
| Option（選択肢） | content, is_correct | quiz: belongsTo |
| User（管理者） | email, password, name | - |

---

## 8. データ定義（講義スキーマ準拠）

`docs/er.drawio` および講義スライドの DDL に準拠。マイグレーションは講義側で作成。

### categories

| カラム | 型 | 制約 |
| --- | --- | --- |
| id | BIGINT | PRIMARY KEY, AUTO INCREMENT |
| name | VARCHAR | NOT NULL |
| description | VARCHAR | NOT NULL |
| created_at | TIMESTAMP | NOT NULL |
| updated_at | TIMESTAMP | NOT NULL |

### quizzes

| カラム | 型 | 制約 |
| --- | --- | --- |
| id | BIGINT | PRIMARY KEY, AUTO INCREMENT |
| category_id | BIGINT | FK → categories, ON DELETE CASCADE, NOT NULL |
| question | VARCHAR | NOT NULL |
| explanation | VARCHAR | NOT NULL |
| created_at | TIMESTAMP | NOT NULL |
| updated_at | TIMESTAMP | NOT NULL |

### options（選択肢）

| カラム | 型 | 制約 |
| --- | --- | --- |
| id | BIGINT | PRIMARY KEY, AUTO INCREMENT |
| quiz_id | BIGINT | FK → quizzes, ON DELETE CASCADE, NOT NULL |
| content | VARCHAR | NOT NULL |
| is_correct | BOOLEAN (TINYINT(1)) | NOT NULL, DEFAULT 0（true: 正解 / false: 不正解） |
| created_at | TIMESTAMP | NOT NULL |
| updated_at | TIMESTAMP | NOT NULL |

### users（管理者）

| カラム | 型 | 制約 |
| --- | --- | --- |
| id | BIGINT | PRIMARY KEY, AUTO INCREMENT |
| email | VARCHAR | NOT NULL, unique |
| password | VARCHAR | NOT NULL |
| name | VARCHAR | NOT NULL |
| created_at | TIMESTAMP | NOT NULL |
| updated_at | TIMESTAMP | NOT NULL |

---

## 9. 命名・型の方針（確定）

「講義は参考レベル、ベストプラクティス優先」の方針に基づき、テーブル/カラム名はフレームワーク標準・講義準拠、型は最適なものを採用。[requirements.md](requirements.md) v1.1 と整合済み。

| 概念 | 採用 | 根拠 |
| --- | --- | --- |
| 管理者テーブル | `users` | Laravel 公式 Starter Kit / Fortify 標準 |
| 選択肢テーブル | `options` | 講義準拠（命名のみの差で実害なし） |
| 選択肢テキスト列 | `content` | 講義準拠 |
| 正解フラグ型 | `boolean`（TINYINT(1)） | 2値フラグに最適・最小サイズ。講義の SMALLINT より適切なためベストプラクティスを採用 |

---

## 改訂履歴

| 日付 | バージョン | 変更内容 | 担当 |
| --- | --- | --- | --- |
| 2026-05-31 | 1.0 | 講義スライドのワイヤーフレーム・遷移図・設計を基に初版作成 | - |
| 2026-05-31 | 1.1 | クイズ解答画面の項目修正（選択肢毎の正解/不正解・自分が選んだ選択肢）。`is_correct` を boolean(TINYINT(1)) に変更。§9 を命名・型方針（確定）に更新し requirements.md と整合 | - |
