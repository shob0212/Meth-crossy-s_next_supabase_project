/**
 * ========================
 * 認証レイアウトコンポーネント
 * ========================
 *
 * 機能：ログイン画面や登録画面の背景やレイアウト
 *
 * 使い方：
 *   <AuthLayout title="ログイン" onBack={() => {}}>
 *     <input type="email" placeholder="メール" />
 *   </AuthLayout>
 *
 * 説明：
 *   - ログイン、登録、認証など、複数の認証画面で使い回す
 *   - タイトルと内容を渡すことで、異なる認証画面を作成できる
 */

import { BackButton } from "./BackButton";

interface AuthLayoutProps {
  title: string; // ページのタイトル
  children?: React.ReactNode; // ページの内容
  onBack: () => void; // 戻るボタンを押した時の処理
}

export function AuthLayout({ title, children, onBack }: AuthLayoutProps) {
  return (
    <div className="min-h-screen bg-ivory dark:bg-gray-900 flex items-center justify-center p-6 relative">
      <div className="w-full max-w-md animate-fade-in relative z-10">
        <div className="bg-white dark:bg-gray-800 p-8 rounded-[40px] shadow-xl border border-gray-100 dark:border-gray-700 relative overflow-hidden">
          {/* 上部のグラデーションバー */}
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-mint-300 to-peach-300"></div>

          {/* タイトル */}
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-8 text-center">
            {title}
          </h2>

          {/* コンテンツ */}
          {children}
        </div>
      </div>

      {/* 戻るボタン */}
      <BackButton onClick={onBack} />
    </div>
  );
}
