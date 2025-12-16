/**
 * ========================
 * 定数・固定値ファイル
 * ========================
 *
 * 何度も使う値や変わらない値を定義しておくファイルです。
 * コードの上部に定数をまとめることで、値を変更する際に一箇所で済みます。
 */

import { Category, type Invitation, type Trip, type User } from "../types";

/**
 * モックユーザー
 * テスト用のダミーユーザーデータです
 * 本来はデータベースから取得しますが、開発時はこれを使用
 */
export const MOCK_USERS: User[] = [
  {
    id: "u1",
    name: "アリスン",
    avatar:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop&crop=faces",
  },
  {
    id: "u2",
    name: "ボブジ",
    avatar:
      "https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=150&h=150&fit=crop&crop=faces",
  },
  {
    id: "u3",
    name: "キャロル",
    avatar:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=faces",
  },
  {
    id: "u4",
    name: "デイビッド",
    avatar:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=faces",
  },
];

/**
 * モック旅行データ
 * テスト用の旅行情報です
 */
export const MOCK_TRIPS: Trip[] = [
  {
    id: "t1",
    title: "京都 夏の古都巡り",
    dates: "2025/08/15 - 08/17",
    coverImage: "",
    members: [
      { ...MOCK_USERS[0], role: "admin" },
      { ...MOCK_USERS[1], role: "editor" },
      { ...MOCK_USERS[2], role: "editor" },
    ],
    isSaved: true,
    status: "upcoming",
    messages: [
      {
        id: "m1",
        userId: "u2",
        text: "新幹線の予約完了しました！",
        timestamp: "10:30",
      },
      {
        id: "m2",
        userId: "u1",
        text: "ありがとう！ホテルの予約確認書もアップしておいたよ。",
        timestamp: "10:35",
      },
    ],
    events: [
      {
        id: "e1",
        title: "京都駅集合",
        startTime: "10:00",
        location: "京都駅 中央改札",
        category: Category.Transport,
        date: "2025/08/15",
      },
      {
        id: "e2",
        title: "錦市場で食べ歩き",
        startTime: "12:00",
        location: "錦市場",
        category: Category.Food,
        notes: "だし巻き卵とタコ串は絶対食べる！",
        date: "2025/08/15",
      },
    ],
    expenses: [
      {
        id: "x1",
        title: "新幹線代",
        amount: 42000,
        payerId: "u2",
        category: Category.Transport,
        date: "08/01",
      },
      {
        id: "x2",
        title: "ランチ代",
        amount: 4500,
        payerId: "u1",
        category: Category.Food,
        date: "08/15",
      },
    ],
    memories: [
      {
        id: "mem1",
        url: "",
        caption: "清水寺の眺め最高！",
        userId: "u1",
        date: "2025/08/15",
      },
      {
        id: "mem2",
        url: "",
        caption: "抹茶パフェ美味しい〜",
        userId: "u2",
        date: "2025/08/15",
      },
    ],
    bookings: [
      {
        id: "b1",
        type: "Flight",
        title: "JAL 123 (東京 -> 大阪)",
        bookingNumber: "JAL-X7Y8Z9",
        date: "2025/08/15",
        time: "08:00",
        notes: "窓側座席確保済み",
        attachments: [],
      },
      {
        id: "b2",
        type: "Hotel",
        title: "嵐山 温泉旅館",
        bookingNumber: "H-998877",
        date: "2025/08/15",
        notes: "夕食19時から",
        attachments: [],
      },
    ],
  },
  {
    id: "t2",
    title: "沖縄 3泊4日",
    dates: "2025/11/02 - 11/05",
    coverImage: "",
    members: [
      { ...MOCK_USERS[0], role: "admin" },
      { ...MOCK_USERS[1], role: "editor" },
    ],
    isSaved: false,
    status: "upcoming",
    messages: [],
    events: [],
    expenses: [],
    memories: [],
    bookings: [],
  },
  {
    id: "t3",
    title: "北海道 雪まつり",
    dates: "2024/02/05 - 02/08",
    coverImage: "",
    members: [
      { ...MOCK_USERS[1], role: "admin" },
      { ...MOCK_USERS[2], role: "editor" },
      { ...MOCK_USERS[3], role: "viewer" },
    ],
    isSaved: true,
    status: "completed",
    messages: [],
    events: [],
    expenses: [],
    memories: [],
    bookings: [],
  },
];

/**
 * モック招待データ
 * テスト用の招待情報
 */
export const MOCK_INVITATIONS: Invitation[] = [
  {
    id: "inv1",
    tripId: "t_inv_1",
    tripTitle: "年末年始 韓国旅行",
    tripDates: "2025/12/30 - 2026/01/03",
    tripImage: "",
    inviter: MOCK_USERS[1],
    message: "一緒に行こう！",
  },
];

/**
 * テキスト翻訳（日本語と英語）
 * UIに表示される全てのテキストをここに集約
 * 言語を変更する際はここを参照
 */
export const TEXT = {
  ja: {
    welcome: "Welcome to TripLink",
    desc: "仲間との旅を、もっと自由に、もっと楽しく。",
    login: "ログイン",
    guest: "ゲストでログイン",
    register: "新規アカウント作成",
    email: "メールアドレス",
    pass: "パスワード",
    confirmPass: "パスワード (確認)",
    otp: "認証コード",
    otpDesc: "メールに送信された6桁のコードを入力してください",
    verify: "認証する",
    setupProfile: "プロフィール設定",
    name: "表示名",
    start: "始める",
    back: "戻る",
    home: "ホーム",
    search: "検索",
    notif: "通知",
    profile: "マイページ",
    saved: "保存済み",
    history: "履歴",
    tabTrips: "進行中",
    tabPast: "完了",
    tabInvites: "招待待ち",
    noTrips: "予定されている旅行はありません",
    planNew: "新しい旅行を計画する",
    joinTrip: "招待URLから参加",
    join: "参加する",
    inviteAccept: "承認",
    inviteDecline: "拒否",
    createTrip: "旅行を作成",
    tripTitle: "旅行のタイトル",
    startDate: "開始日",
    endDate: "終了日",
    create: "作成",
    tabTimeline: "旅程",
    tabCalendar: "カレンダー",
    tabWallet: "財布",
    tabMemories: "思い出",
    tabBookings: "予約",
    save: "保存",
    cancel: "キャンセル",
    logout: "ログアウト",
    darkMode: "ダークモード",
    settings: "設定",
    editProfile: "プロフィール編集",
    notifications: "通知設定",
    language: "言語",
    about: "このアプリについて",
    help: "ヘルプ",
  },
  en: {
    welcome: "Welcome to TripLink",
    desc: "Plan together, travel together.",
    login: "Log In",
    guest: "Guest Login",
    register: "Create Account",
    email: "Email",
    pass: "Password",
    confirmPass: "Confirm Password",
    otp: "Verification Code",
    otpDesc: "Enter the 6-digit code sent to your email",
    verify: "Verify",
    setupProfile: "Setup Profile",
    name: "Display Name",
    start: "Get Started",
    back: "Back",
    home: "Home",
    search: "Search",
    notif: "Notifications",
    profile: "Profile",
    saved: "Saved",
    history: "History",
    tabTrips: "Upcoming",
    tabPast: "Completed",
    tabInvites: "Invites",
    noTrips: "No upcoming trips",
    planNew: "Plan a New Trip",
    joinTrip: "Join via Invite URL",
    join: "Join",
    inviteAccept: "Accept",
    inviteDecline: "Decline",
    createTrip: "Create Trip",
    tripTitle: "Trip Title",
    startDate: "Start Date",
    endDate: "End Date",
    create: "Create",
    tabTimeline: "Timeline",
    tabCalendar: "Calendar",
    tabWallet: "Wallet",
    tabMemories: "Memories",
    tabBookings: "Bookings",
    save: "Save",
    cancel: "Cancel",
    logout: "Log Out",
    darkMode: "Dark Mode",
    settings: "Settings",
    editProfile: "Edit Profile",
    notifications: "Notifications",
    language: "Language",
    about: "About",
    help: "Help",
  },
};
