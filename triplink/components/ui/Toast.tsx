/**
 * ========================
 * トーストメッセージコンポーネント
 * ========================
 * 
 * 機能：画面上部に一時的に表示される通知
 * 
 * 使い方：
 *   <Toast title="成功" message="データを保存しました" onClose={() => {}} />
 * 
 * 説明：
 *   - 5秒後に自動的に消える
 *   - ユーザーがボタンをクリックしても消せる
 *   - 重要な通知（成功、エラー、情報）を表示するのに使う
 */

import { useEffect } from 'react';
import { Bell, X } from 'lucide-react';

interface ToastProps {
  title: string;      // 通知のタイトル
  message: string;    // 通知のメッセージ
  onClose: () => void;  // 閉じる時の処理
}

export function Toast({ title, message, onClose }: ToastProps) {
  // 5秒後に自動的に消す
  useEffect(() => {
    const timer = setTimeout(onClose, 5000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="fixed top-4 left-4 right-4 z-[100] animate-fade-in pointer-events-none flex justify-center">
      <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-md border border-mint-200 dark:border-gray-700 shadow-lg rounded-[24px] p-4 flex gap-4 max-w-sm w-full pointer-events-auto">
        {/* アイコン */}
        <div className="w-10 h-10 bg-mint-400 rounded-full flex items-center justify-center flex-shrink-0 text-white">
          <Bell size={20} />
        </div>

        {/* テキスト */}
        <div className="flex-1">
          <h4 className="font-bold text-gray-800 dark:text-white text-sm">{title}</h4>
          <p className="text-xs text-gray-500 dark:text-gray-300 mt-1">{message}</p>
        </div>

        {/* 閉じるボタン */}
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-gray-600"
        >
          <X size={16} />
        </button>
      </div>
    </div>
  );
}
