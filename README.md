# TripLink システム構成図 & アプリケーションフロー

**技術スタック**: Next.js (App Router), Supabase 
**デプロイ先**: Vercel (フロントエンド/Edge), Supabase Cloud (バックエンド)

<br>


## 1. システム構成図 (アーキテクチャ)

Next.js の **Server Components** と **Server Actions** を中心に<br>
クライアント（ブラウザ）とSupabase（DB/Auth）をつなぐ構成

```mermaid
graph TD
    %% 定義: クライアントサイド
    subgraph Client ["クライアントサイド<br> (ブラウザ / スマホ)"]
        User((ユーザー))
        Browser["ブラウザ / PWAアプリ"]
    end

    %% 定義: Vercel (Next.js)
    subgraph Vercel ["Vercel (Next.js アプリ基盤)"]
        Middleware["Middleware<br>ページ保護・認証ガード"]
        
        subgraph Frontend ["レンダリング層 (表示)"]
            RSC["Server Components<br>データ取得・HTML生成"]
            CC["Client Components<br>ボタン操作・動き"]
        end
        
        subgraph Backend ["サーバーレス機能 (処理)"]
            SA["Server Actions<br>データ保存・更新ロジック"]
            API["Route Handlers<br>外部API連携"]
        end
    end

    %% 定義: Supabase
    subgraph Supabase ["Supabase (バックエンド基盤)"]
        Auth["Auth<br>ユーザー認証"]
        DB[("PostgreSQL<br>データベース")]
        Storage["Storage<br>画像保存"]
        Realtime["Realtime<br>リアルタイム"]
    end

    %% 接続関係フロー
    User -->|アクセス| Browser
    Browser -->|HTTPSリクエスト| Middleware
    Middleware -->|認証OKなら通過| RSC
    
    %% データ取得 (Read)
    RSC -->|データ取得 キャッシュ有| DB
    RSC -->|HTMLを返却| Browser
    
    %% データ更新 (Write)
    Browser -->|フォーム送信 / クリック| SA
    SA -->|データの追加 / 更新| DB
    SA -->|キャッシュ更新依頼| RSC
    
    %% 認証と画像
    Browser -->|画像のアップロード| Storage
    Browser -->|更新の購読 任意| Realtime
    SA -->|セッション検証| Auth
    Middleware -->|トークン確認| Auth
```

<br>

## 2. アプリケーション動作フロー (シーケンス)

ユーザーが**ログインして、旅程を追加する**時のデータの流れ

```mermaid
sequenceDiagram
    autonumber
    actor User as ユーザー
    participant Browser as ブラウザ
    participant NextServer as Next.js (サーバー)
    participant SupabaseAuth as Supabase (認証)
    participant SupabaseDB as Supabase (DB)

    Note over User, SupabaseDB: シナリオ: 旅程の追加 (Server Actions利用)

    %% 1. 画面表示
    User->>Browser: 旅程ページを開く
    Browser->>NextServer: リクエスト (GET)
    NextServer->>SupabaseAuth: セッション確認
    SupabaseAuth-->>NextServer: OK (ユーザーID)
    NextServer->>SupabaseDB: 旅程データ取得
    SupabaseDB-->>NextServer: データ返却
    NextServer-->>Browser: HTML返却

    %% 2. 旅程追加アクション
    User->>Browser: 「ランチ」と入力して[追加]ボタンを押す
    Browser->>NextServer: Server Action実行 (POST)
    
    Note right of Browser: フォームの内容を送信

    NextServer->>SupabaseAuth: ユーザー認証確認
    NextServer->>NextServer: バリデーション
    NextServer->>SupabaseDB: INSERT 旅程データ作成
    SupabaseDB-->>NextServer: 成功 (Created)

    %% 3. 画面更新 (Revalidation)
    NextServer->>NextServer: パスの再検証 (キャッシュ破棄)
    Note right of NextServer: 最新データを反映させるため<br>サーバー側で再取得
    
    NextServer->>SupabaseDB: 最新の旅程データを再取得
    SupabaseDB-->>NextServer: データ返却
    NextServer-->>Browser: 更新されたUI部分を返却
    Browser->>User: 画面が更新され「ランチ」が表示される
```
<br>

## 3. 開発・デプロイの流れ (CI/CD ワークフロー)
GitHubリポジトリに変更をプッシュするとVercelが自動検知、検証URL発行<br>
mainブランチにマージすると自動で本番環境にコードをデプロイ

```mermaid
graph LR
    Dev[開発者]
    GitHub[GitHub リポジトリ]
    Vercel[Vercel クラウド]
    Live[本番環境]

    subgraph Development [開発フェーズ]
        Dev -->|コミット & プッシュ| GitHub
    end

    subgraph Deployment [デプロイフェーズ]
        GitHub -->|自動検知 Trigger| Vercel
        Vercel -->|1. ビルド Next.js build| Vercel
        Vercel -->|2. デプロイ サーバーレス| Live
    end

    subgraph Result [公開]
        Live -->|閲覧・利用| User((ユーザー))
    end
```
