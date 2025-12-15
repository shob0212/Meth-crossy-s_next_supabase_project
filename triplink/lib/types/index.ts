/**
 * ========================
 * TypeScript型定義ファイル
 * ========================
 *
 * このファイルでは、アプリケーション全体で使用する全てのデータ型を定義しています。
 * 「型」とは「このデータはこんな情報を持つ必要がある」というルールのことです。
 *
 * 例えば、「User型」と定義すれば、ユーザーデータは常に
 * id, name, avatar という3つの情報を必ず持つ必要があります。
 */

/**
 * 支出のカテゴリ
 * 旅行中の出費を分類するための区分けです
 */
export enum Category {
  Transport = "Transport", // 交通費（飛行機、新幹線など）
  Food = "Food", // 食事代
  Activity = "Activity", // 観光やアクティビティ代
  Lodging = "Lodging", // 宿泊費
  Other = "Other", // その他
}

/**
 * ユーザー型
 * アプリを使っている人の情報
 */
export interface User {
  id: string; // ユーザーの一意なID
  name: string; // ユーザーの表示名
  avatar: string; // プロフィール写真のURL
}

/**
 * 支出型
 * 旅行中に使ったお金の記録
 */
export interface Expense {
  id: string; // 支出の一意なID
  title: string; // 何に使ったか（例：「新幹線代」）
  amount: number; // 金額（円）
  payerId: string; // 誰が払ったか（ユーザーID）
  category: Category; // どのカテゴリの支出か
  date: string; // 支出した日付
}

/**
 * 予定イベント型
 * 旅行中の予定を記録するもの
 */
export interface ItineraryEvent {
  id: string; // イベントの一意なID
  title: string; // イベント名（例：「清水寺 参拝」）
  startTime: string; // 開始時刻（HH:mm形式）
  endTime?: string; // 終了時刻（オプション）
  location: string; // 場所
  category: Category; // イベントのカテゴリ
  notes?: string; // メモ
  costEstimate?: number; // 費用の見積もり
  date?: string; // 日付（YYYY/MM/DD形式）
}

/**
 * チャットメッセージ型
 * グループチャットで使用されるメッセージ
 */
export interface ChatMessage {
  id: string; // メッセージの一意なID
  userId: string; // 誰が送ったか（ユーザーID）
  text: string; // メッセージの内容
  timestamp: string; // 送信時刻
}

/**
 * 写真・思い出型
 * 旅行中に撮った写真やメモ
 */
export interface Memory {
  id: string; // 思い出の一意なID
  url: string; // 画像のURL（またはBase64）
  caption?: string; // 写真の説明コメント
  userId: string; // 誰が投稿したか（ユーザーID）
  date: string; // 撮影日
}

/**
 * グループメンバー型
 * User型を拡張したもの。グループ内での権限を追加
 */
export interface TripMember extends User {
  role: "admin" | "editor" | "viewer"; // admin=全権限, editor=編集可, viewer=閲覧のみ
}

/**
 * 予約型
 * 飛行機やホテルなどの予約情報
 */
export interface Booking {
  id: string; // 予約の一意なID
  type: "Flight" | "Hotel" | "Activity" | "Other"; // 予約の種類
  title: string; // 予約タイトル（例：「JAL 123」）
  bookingNumber: string; // 予約番号（例：「JAL-X7Y8Z9」）
  date?: string; // 予約日
  time?: string; // 時刻
  notes?: string; // 備考
  attachments: string[]; // 確認書などのファイル
}

/**
 * 旅行型
 * 最も重要な型。1つの旅行に関する全ての情報を含む
 */
export interface Trip {
  id: string; // 旅行の一意なID
  title: string; // 旅行のタイトル
  dates: string; // 旅行期間（「2025/08/15 - 08/17」形式）
  coverImage: string; // カバー画像URL
  members: TripMember[]; // メンバー一覧
  events: ItineraryEvent[]; // 予定イベント一覧
  expenses: Expense[]; // 支出一覧
  messages: ChatMessage[]; // チャットメッセージ一覧
  memories: Memory[]; // 思い出・写真一覧
  bookings: Booking[]; // 予約一覧
  isSaved?: boolean; // お気に入り登録されているか
  status?: "upcoming" | "completed"; // 進行中 or 完了
}

/**
 * 招待型
 * 旅行への招待を表す
 */
export interface Invitation {
  id: string; // 招待の一意なID
  tripId: string; // どの旅行への招待か
  tripTitle: string; // 旅行のタイトル
  tripDates: string; // 旅行期間
  tripImage: string; // 旅行の画像
  inviter: User; // 招待者
  message?: string; // 招待メッセージ
}

/**
 * 通知型
 * システム通知やチャットメッセージ通知
 */
export interface AppNotification {
  id: string; // 通知の一意なID
  title: string; // 通知のタイトル
  message: string; // 通知のメッセージ
  timestamp: string; // 通知の送信時刻
  isRead: boolean; // 読んだか読んでないか
  type: "message" | "system"; // 通知の種類
}

/**
 * 言語型
 * アプリで対応している言語
 */
export type Language = "ja" | "en";

/**
 * ダッシュボードタブ状態
 * React最新版(triplink (2))に合わせて統一
 */
export type DashboardTabState =
  | "HOME"
  | "SEARCH"
  | "SAVED"
  | "NOTIFICATIONS"
  | "PROFILE"
  | "INVITATIONS"
  | "HISTORY"
  | "COMPLETED";

/**
 * 旅行詳細タブ状態
 * React最新版(triplink (2))に合わせて統一
 */
export type TripDetailTabState =
  | "TIMELINE"
  | "CALENDAR"
  | "MAP"
  | "WALLET"
  | "BOARD"
  | "MEMORIES"
  | "BOOKINGS";
