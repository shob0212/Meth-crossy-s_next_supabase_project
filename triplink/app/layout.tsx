/**
 * ========================
 * Next.js App Router ルートレイアウト
 * ========================
 *
 * 機能：アプリケーション全体のHTMLレイアウト構造
 *
 * 説明：
 *   - 全ページの基盤となるレイアウト
 *   - グローバルなスタイルやメタデータを設定
 *   - Next.js の App Router では必須のファイル
 */

import "./globals.css";

export const metadata = {
  title: "TripLink - 旅行計画アプリ",
  description: "友達と一緒に旅行を計画・管理できるアプリ",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <body>{children}</body>
    </html>
  );
}
