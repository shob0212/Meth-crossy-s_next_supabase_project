/**
 * ========================
 * 旅行詳細ページ
 * ========================
 * 
 * URL: /trips/[tripId]
 * 
 * 機能：1つの旅行の詳細情報を表示・管理
 *   - タイムライン（予定）
 *   - カレンダー（日程確認）
 *   - ウォレット（支出管理）
 *   - 思い出（写真・メモ）
 *   - 予約（チケット・ホテル）
 * 
 * 説明：
 *   - [tripId] は Dynamic Route。
 *     /trips/t1 → tripId = 't1'
 *     /trips/t2 → tripId = 't2'
 *   - 複数のタブで異なる機能を切り替え
 */

'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation'; // Next.js App Router で URL パラメータを取得
import { Trip, ItineraryEvent, Language } from '@/lib/types';
import { MOCK_TRIPS, MOCK_USERS } from '@/lib/constants';
import { Timeline } from '@/components/features/Timeline';
import { Wallet } from '@/components/features/Wallet';
import { CalendarView } from '@/components/features/CalendarView';
import { Bookings } from '@/components/features/Bookings';
import { Memories } from '@/components/features/Memories';
import { UserAvatar } from '@/components/ui/UserAvatar';
import {
  ArrowLeft,
  Compass,
  Calendar,
  Wallet as WalletIcon,
  Ticket,
  ImageIcon,
  Users,
  Share2,
  X
} from 'lucide-react';

type TabType = 'TIMELINE' | 'CALENDAR' | 'WALLET' | 'BOOKINGS' | 'MEMORIES';

export default function TripDetailPage() {
  // ============= 状態管理 =============
  const params = useParams(); // URL パラメータを取得
  const tripId = params?.tripId as string;

  // tripId に基づいて旅行データを取得
  const trip = MOCK_TRIPS.find(t => t.id === tripId);

  const [activeTab, setActiveTab] = useState<TabType>('TIMELINE');
  const [language] = useState<Language>('ja');
  const [tripData, setTripData] = useState<Trip | null>(trip || null);
  const [isMemberModalOpen, setIsMemberModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  // ============= ハンドラ関数 =============

  /**
   * 旅行データを更新
   */
  const updateTripData = (updater: (t: Trip) => Trip) => {
    if (!tripData) return;
    setTripData(updater(tripData));
  };

  // ============= フォールバック =============
  if (!tripData) {
    return (
      <div className="min-h-screen bg-ivory dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
            旅行が見つかりません
          </h2>
          <p className="text-gray-400">指定されたIDの旅行は存在しません</p>
        </div>
      </div>
    );
  }

  // ============= 画面にレンダリング =============

  return (
    <div className="min-h-screen bg-ivory dark:bg-gray-900 pb-24">
      {/* ヘッダー */}
      <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-md sticky top-0 z-30 border-b border-gray-100 dark:border-gray-700">
        <div className="px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-4 flex-1">
            <h1 className="text-xl font-bold text-gray-800 dark:text-white line-clamp-1">
              {tripData.title}
            </h1>
          </div>
          <div className="flex gap-3">
            <button className="w-10 h-10 rounded-full bg-gray-50 dark:bg-gray-700 flex items-center justify-center text-gray-400 hover:text-mint-500 transition-colors">
              <Share2 size={20} />
            </button>
            <button
              onClick={() => setIsMemberModalOpen(true)}
              className="w-10 h-10 rounded-full bg-gray-50 dark:bg-gray-700 flex items-center justify-center text-gray-400 hover:text-mint-500 transition-colors relative"
            >
              <Users size={20} />
              <span className="absolute -top-1 -right-1 bg-mint-400 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center">
                {tripData.members.length}
              </span>
            </button>
          </div>
        </div>

        {/* タブナビゲーション */}
        <div className="px-6 pb-2 overflow-x-auto no-scrollbar flex gap-6">
          {[
            { id: 'TIMELINE' as const, icon: Compass, label: '旅程' },
            { id: 'CALENDAR' as const, icon: Calendar, label: 'カレンダー' },
            { id: 'WALLET' as const, icon: WalletIcon, label: '財布' },
            { id: 'BOOKINGS' as const, icon: Ticket, label: '予約' },
            { id: 'MEMORIES' as const, icon: ImageIcon, label: '思い出' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex flex-col items-center gap-1 pb-3 min-w-[60px] border-b-2 transition-all ${
                activeTab === tab.id
                  ? 'border-mint-400 text-mint-500'
                  : 'border-transparent text-gray-300 dark:text-gray-600 hover:text-gray-400'
              }`}
            >
              <tab.icon size={24} strokeWidth={activeTab === tab.id ? 2.5 : 2} />
              <span className="text-[10px] font-bold">{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* コンテンツ */}
      <div className="p-6 animate-fade-in">
        {activeTab === 'TIMELINE' && (
          <Timeline
            events={tripData.events}
            onAddEvent={e =>
              updateTripData(t => ({
                ...t,
                events: [...t.events, { ...e, id: Math.random().toString() }]
              }))
            }
            onUpdateEvent={e =>
              updateTripData(t => ({
                ...t,
                events: t.events.map(ev => (ev.id === e.id ? e : ev))
              }))
            }
            onDeleteEvent={id =>
              updateTripData(t => ({
                ...t,
                events: t.events.filter(e => e.id !== id)
              }))
            }
            tripLocation={tripData.title}
            tripDates={tripData.dates}
            language={language}
          />
        )}

        {activeTab === 'CALENDAR' && <CalendarView trip={tripData} language={language} />}

        {activeTab === 'WALLET' && (
          <Wallet
            expenses={tripData.expenses}
            members={tripData.members}
            onAddExpense={ex =>
              updateTripData(t => ({
                ...t,
                expenses: [...t.expenses, { id: Math.random().toString(), ...ex }]
              }))
            }
            onUpdateExpense={ex =>
              updateTripData(t => ({
                ...t,
                expenses: t.expenses.map(e => (e.id === ex.id ? ex : e))
              }))
            }
            onDeleteExpense={id =>
              updateTripData(t => ({
                ...t,
                expenses: t.expenses.filter(e => e.id !== id)
              }))
            }
            language={language}
          />
        )}

        {activeTab === 'BOOKINGS' && (
          <Bookings
            bookings={tripData.bookings}
            onAddBooking={b =>
              updateTripData(t => ({
                ...t,
                bookings: [...t.bookings, { id: Math.random().toString(), ...b }]
              }))
            }
            onDeleteBooking={id =>
              updateTripData(t => ({
                ...t,
                bookings: t.bookings.filter(b => b.id !== id)
              }))
            }
            isReadOnly={false}
            language={language}
          />
        )}

        {activeTab === 'MEMORIES' && (
          <Memories
            memories={tripData.memories}
            members={tripData.members}
            onAddMemory={m =>
              updateTripData(t => ({
                ...t,
                memories: [...t.memories, { id: Math.random().toString(), ...m }]
              }))
            }
            onDeleteMemory={id =>
              updateTripData(t => ({
                ...t,
                memories: t.memories.filter(m => m.id !== id)
              }))
            }
            currentUser={MOCK_USERS[0]}
            isReadOnly={false}
            language={language}
          />
        )}
      </div>

      {/* メンバーモーダル */}
      {isMemberModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[60] flex items-center justify-center p-6">
          <div className="bg-white dark:bg-gray-800 w-full max-w-sm rounded-[32px] p-6 shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-bold text-xl text-gray-800 dark:text-white">
                Members
              </h3>
              <button
                onClick={() => setIsMemberModalOpen(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={20} />
              </button>
            </div>

            <div className="space-y-4">
              {tripData.members.map(m => (
                <div key={m.id} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <UserAvatar user={m} />
                    <div>
                      <p className="font-bold text-sm text-gray-800 dark:text-white">
                        {m.name}
                      </p>
                      <p className="text-xs text-gray-400 capitalize">{m.role}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 戻るボタン */}
      <div className="fixed bottom-32 left-6 z-50">
        <button
          onClick={() => window.history.back()}
          className="w-14 h-14 rounded-full shadow-lg bg-white dark:bg-gray-800 text-gray-500 dark:text-white flex items-center justify-center hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors border-4 border-ivory dark:border-gray-900"
        >
          <ArrowLeft size={24} />
        </button>
      </div>
    </div>
  );
}
