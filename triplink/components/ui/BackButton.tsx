/**
 * ========================
 * 戻るボタンコンポーネント
 * ========================
 * 
 * 機能：前のページへ戻るボタン
 * 
 * 使い方：
 *   <BackButton onClick={() => router.back()} />
 * 
 * 説明：
 *   - 画面左下に固定表示される
 *   - ユーザーが押すとクリックハンドラが実行される
 */

import { ArrowLeft } from 'lucide-react';

interface BackButtonProps {
  onClick: () => void;
}

export function BackButton({ onClick }: BackButtonProps) {
  return (
    <div className="fixed bottom-8 left-6 z-50">
      <button
        onClick={onClick}
        className="w-14 h-14 rounded-full bg-gray-800/10 dark:bg-white/10 backdrop-blur-md border border-gray-800/10 dark:border-white/20 text-gray-800 dark:text-white flex items-center justify-center hover:bg-gray-800/20 dark:hover:bg-white/20 transition-all shadow-lg"
      >
        <ArrowLeft size={24} />
      </button>
    </div>
  );
}
