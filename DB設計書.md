# TripLink データベース設計書 (Ver 1.0)

**プロジェクト**: TripLink  
**最終更新日**: 202X年X月X日  
**記述形式**: Mermaid (ER図)

---

## 1. 全体 ER図 (Entity Relationship Diagram)

```mermaid
erDiagram
    %% ユーザー管理
    USERS {
        uuid id PK "ユーザーID"
        string email "メールアドレス"
        string display_name "表示名"
        string avatar_url "アイコン画像URL"
        timestamp created_at "作成日時"
    }

    %% 旅行プロジェクト（親テーブル）
    TRIPS {
        uuid id PK "旅行ID"
        uuid created_by FK "作成者ID"
        string title "旅行タイトル"
        date start_date "開始日"
        date end_date "終了日"
        string cover_image_url "カバー画像URL"
        string invite_code "招待用コード/トークン"
        timestamp created_at "作成日時"
    }

    %% 旅行メンバー（中間テーブル）
    TRIP_MEMBERS {
        uuid trip_id FK "旅行ID"
        uuid user_id FK "ユーザーID"
        string role "権限 (admin/editor/viewer)"
        string status "状態 (joined/invited)"
        timestamp joined_at "参加日時"
    }

    %% 旅程・予定 (TimeLine)
    ITINERARIES {
        uuid id PK "予定ID"
        uuid trip_id FK "旅行ID"
        string title "予定タイトル"
        timestamp start_time "開始日時"
        timestamp end_time "終了日時"
        string category "種類 (move/stay/food/sightseeing/other)"
        string memo "メモ・詳細"
        string location_name "場所名称"
        float location_lat "緯度 (Map用)"
        float location_lng "経度 (Map用)"
        string url "参考URL"
        string booking_ref "予約番号 (チケット管理用)"
        string attachment_url "添付ファイル (EチケットPDF等)"
    }

    %% 支出記録 (Wallet)
    EXPENSES {
        uuid id PK "支出ID"
        uuid trip_id FK "旅行ID"
        uuid paid_by FK "支払った人のID"
        string title "用途 (タクシー代、夕食など)"
        decimal amount "金額"
        string currency "通貨 (JPY/USD/EUR...)"
        string category "分類 (food/transport/ticket...)"
        timestamp paid_at "支払い日時"
    }

    %% 支出の割り勘対象 (Split Logic)
    EXPENSE_SHARES {
        uuid expense_id FK "支出ID"
        uuid user_id FK "負担する人のID"
        boolean is_settled "精算済みフラグ"
        decimal split_amount "負担額 (固定額の場合)"
    }

    %% 写真・メディア (Memories)
    MEDIA {
        uuid id PK "メディアID"
        uuid trip_id FK "旅行ID"
        uuid uploader_id FK "アップロード者ID"
        uuid itinerary_id FK "関連する予定ID (Optional)"
        string file_url "画像URL"
        string file_type "種類 (image/video)"
        timestamp created_at "撮影/アップロード日時"
    }

    %% リレーション定義
    USERS ||--o{ TRIPS : "作成する"
    USERS ||--o{ TRIP_MEMBERS : "参加する"
    TRIPS ||--o{ TRIP_MEMBERS : "メンバーを持つ"
    
    TRIPS ||--o{ ITINERARIES : "予定を含む"
    TRIPS ||--o{ EXPENSES : "支出を含む"
    TRIPS ||--o{ MEDIA : "写真を含む"

    USERS ||--o{ EXPENSES : "支払う"
    EXPENSES ||--o{ EXPENSE_SHARES : "割り勘詳細"
    USERS ||--o{ EXPENSE_SHARES : "負担する"

    ITINERARIES |o--o{ MEDIA : "紐付く写真"
```


## 2. テーブル詳細定義

### 2.1 USERS (ユーザー)
認証システム（Supabase Auth / Firebase Authなど）と連携する基本テーブル。

*   **id**: UUID。AuthプロバイダのIDと一致させると管理が楽。
*   **display_name**: グループ内で表示される名前。

### 2.2 TRIPS (旅行)
アプリの核となるテーブル。

*   **invite_code**: ランダムな文字列を生成して格納。`example.com/join?code=xxxx` のように使用する。
*   **cover_image_url**: 旅行一覧で見栄えを良くするための画像。

### 2.3 TRIP_MEMBERS (メンバー管理)
多対多の中間テーブル。

*   **role**:
    *   `admin`: メンバー招待・削除、旅行自体の削除が可能。
    *   `editor`: 旅程・支出の追加編集が可能（基本はこれ）。
    *   `viewer`: 閲覧のみ（将来的な拡張用）。

### 2.4 ITINERARIES (旅程・チケット)
スケジュールとチケット管理を統合したテーブル。

*   **category**: アイコンの出し分けに使用。
    *   `move` (移動: 飛行機、電車)
    *   `stay` (宿泊: ホテル)
    *   `food` (食事)
    *   `sightseeing` (観光)
*   **booking_ref / attachment_url**: チケット管理機能の実体。航空券の予約番号やPDFのURLをここに保持する。

### 2.5 EXPENSES & EXPENSE_SHARES (支出・割り勘)
割り勘計算を柔軟にするため、親子関係にする。

*   **EXPENSES**: 「誰が、いくら払ったか」という事実（レシート情報）。
*   **EXPENSE_SHARES**: 「その支払いは誰のためのものか」という内訳。

> **割り勘の例**:
> Aさんが3000円払った（Expensesレコード1つ）。
> 対象はA, B, Cの3人（Sharesレコード3つ）。
> ➡ これで「BさんはAさんに1000円借金がある」状態を計算できる。

### 2.6 MEDIA (思い出)
*   **itinerary_id**: 「この写真は『2日目のランチ』の時のもの」と紐付けるための外部キー（NULL許可）。
    *   Tripに直接紐付けることで、アルバム機能（Gallery）の実装を容易にする。

---

## 3. 設計のポイント（アジャイル対応）

### チケット管理テーブルを作らない理由
初期段階では `ITINERARIES` テーブルに `booking_ref`（予約番号）や `memo` カラムがあれば十分機能します。専用テーブルを作ると結合が複雑になるため、まずは単一テーブルでMVPを目指します。

### 通貨（Currency）カラム
海外旅行対応のため、金額だけでなく `currency` ('JPY', 'USD' etc.) を持たせています。MVPではJPY固定でも良いですが、DB設計には入れておくべきです。

### IDはUUIDを採用
連番（Integer）ではなくUUID（v4）を採用することで、推測されにくくし、分散DB（将来的なスケーリング）に対応しやすくしています。