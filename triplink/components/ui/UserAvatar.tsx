/**
 * ========================
 * ユーザーアバターコンポーネント
 * ========================
 * 
 * 機能：ユーザーのプロフィール写真を表示するコンポーネント
 * 
 * 使い方：
 *   <UserAvatar user={currentUser} size="md" />
 * 
 * 説明：
 *   - ユーザーがアバター画像を持っていれば表示
 *   - なければ、名前の最初の2文字を背景色と一緒に表示
 *   - サイズ（sm/md/lg）を指定できる
 */

import { User, TripMember } from '@/lib/types';

interface UserAvatarProps {
  user: User | TripMember;
  size?: 'sm' | 'md' | 'lg';
}

export function UserAvatar({ user, size = 'md' }: UserAvatarProps) {
  // サイズごとのスタイルを定義
  const sizeClasses = {
    sm: 'w-6 h-6 text-[10px]',
    md: 'w-8 h-8 text-xs',
    lg: 'w-16 h-16 text-xl'
  };

  // もしアバター画像があれば、それを表示
  if (user.avatar) {
    return (
      <img
        src={user.avatar}
        alt={user.name}
        className={`${sizeClasses[size]} rounded-full object-cover border border-gray-200 dark:border-gray-600 shadow-sm`}
      />
    );
  }

  // 画像がなければ、名前の最初の2文字を表示
  return (
    <div
      className={`${sizeClasses[size]} rounded-full bg-mint-100 dark:bg-mint-900/30 text-mint-600 dark:text-mint-400 font-bold flex items-center justify-center border border-mint-200 dark:border-mint-800`}
    >
      {user.name.substring(0, 2).toUpperCase()}
    </div>
  );
}
