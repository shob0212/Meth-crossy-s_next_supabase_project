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

"use client";

import {
	ArrowLeft,
	Calendar,
	Compass,
	Image,
	Share2,
	Ticket,
	Users,
	Wallet as WalletIcon,
	X,
} from "lucide-react";
import { useParams } from "next/navigation"; // Next.js App Router で URL パラメータを取得
import { useState } from "react";
import { Bookings } from "@/components/features/Bookings";
import { CalendarView } from "@/components/features/CalendarView";
import { Memories } from "@/components/features/Memories";
import { Timeline } from "@/components/features/Timeline";
import { Wallet } from "@/components/features/Wallet";
import { UserAvatar } from "@/components/ui/UserAvatar";
import { MOCK_TRIPS, MOCK_USERS } from "@/lib/constants";
import type { Language, Trip } from "@/lib/types";

type TabType = "TIMELINE" | "CALENDAR" | "WALLET" | "BOOKINGS" | "MEMORIES";

/**
 * 特定の旅行を閲覧・管理するための旅行詳細ページコンポーネント。
 *
 * このコンポーネントは、複数のタブに分かれた旅行情報を表示します：
 * - TIMELINE：旅行中の出来事や行程
 * - CALENDAR：旅行日程のカレンダー表示
 * - WALLET：支出管理および割り勘計算
 * - BOOKINGS：ホテル、フライトなどの予約情報
 * - MEMORIES：写真ギャラリーや共有された思い出
 *
 * @component
 * @returns {React.ReactElement}
 *  固定ヘッダーによるナビゲーション、
 *  タブ切り替え式のコンテンツ表示、
 *  メンバー管理モーダル、
 *  戻るボタンを備えた旅行詳細ページ全体。
 *
 * @example
 * // Next.js の動的ルーティングで使用
 * // app/trips/[tripId]/page.tsx
 * export default function TripDetailPage() { ... }
 *
 * @remarks
 * - URL パラメータ `tripId` をもとに MOCK_TRIPS から旅行データを取得
 * - タブ切り替えやモーダルの表示状態はローカル state で管理
 * - Tailwind CSS によりダークモードに対応
 * - データの更新処理はすべて `updateTripData` ユーティリティ関数経由で実施
 * - モーダル表示には `&&` 演算子による条件付きレンダリングを使用
 * - 固定ヘッダー、下部アクションボタン、スクロール可能なコンテンツを備えたレスポンシブレイアウト
 */

export default function TripDetailPage() {
	// ============= 状態管理 =============
	const params = useParams(); // URL パラメータを取得
	const tripId = params?.tripId as string;

	// tripId に基づいて旅行データを取得
	const trip = MOCK_TRIPS.find((t) => t.id === tripId);

	const [activeTab, setActiveTab] = useState<TabType>("TIMELINE");
	const [language] = useState<Language>("ja");
	const [tripData, setTripData] = useState<Trip | null>(trip || null);
	const [isMemberModalOpen, setIsMemberModalOpen] = useState(false);

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
						{/* 旅行タイトル */}
						<h1 className="text-xl font-bold text-gray-800 dark:text-white line-clamp-1">
							{tripData.title}
						</h1>
					</div>
					<div className="flex gap-3">
						{/* 共有ボタン */}
						<button
							type="button"
							className="w-10 h-10 rounded-full bg-gray-50 dark:bg-gray-700 flex items-center justify-center text-gray-400 hover:text-mint-500 transition-colors"
						>
							<Share2 size={20} />
						</button>
						{/* メンバーモーダルを開くボタン */}
						<button
							type="button"
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
						{ id: "TIMELINE" as const, icon: Compass, label: "旅程" },
						{ id: "CALENDAR" as const, icon: Calendar, label: "カレンダー" },
						{ id: "WALLET" as const, icon: WalletIcon, label: "財布" },
						{ id: "BOOKINGS" as const, icon: Ticket, label: "予約" },
						{ id: "MEMORIES" as const, icon: Image, label: "思い出" },
					].map((tab) => (
						<button
							type="button"
							key={tab.id}
							onClick={() => setActiveTab(tab.id)}
							className={`flex flex-col items-center gap-1 pb-3 min-w-[60px] border-b-2 transition-all ${
								activeTab === tab.id
									? "border-mint-400 text-mint-500"
									: "border-transparent text-gray-300 dark:text-gray-600 hover:text-gray-400"
							}`}
						>
							<tab.icon
								size={24}
								strokeWidth={activeTab === tab.id ? 2.5 : 2}
							/>
							<span className="text-[10px] font-bold">{tab.label}</span>
						</button>
					))}
				</div>
			</div>

			{/* コンテンツエリア */}
			<div className="p-6 animate-fade-in">
				{/* タイムラインコンポーネント */}
				{activeTab === "TIMELINE" && (
					<>
						{/* Timeline コンポーネントに旅行データと更新ハンドラを渡す */}
						<Timeline
							events={tripData.events}
							onAddEvent={(e) =>
								updateTripData((t) => ({
									...t,
									events: [...t.events, { ...e, id: Math.random().toString() }],
								}))
							}
							onUpdateEvent={(e) =>
								updateTripData((t) => ({
									...t,
									events: t.events.map((ev) => (ev.id === e.id ? e : ev)),
								}))
							}
							onDeleteEvent={(id) =>
								updateTripData((t) => ({
									...t,
									events: t.events.filter((e) => e.id !== id),
								}))
							}
							tripLocation={tripData.title}
							tripDates={tripData.dates}
							language={language}
						/>
					</>
				)}

				{/* カレンダーコンポーネント */}
				{activeTab === "CALENDAR" && (
					<CalendarView trip={tripData} language={language} />
				)}

				{/* ウォレットコンポーネント */}
				{activeTab === "WALLET" && (
					<>
						{/* Wallet コンポーネントに旅行データと更新ハンドラを渡す */}
						<Wallet
							expenses={tripData.expenses}
							members={tripData.members}
							onAddExpense={(ex) =>
								updateTripData((t) => ({
									...t,
									expenses: [
										...t.expenses,
										{ id: Math.random().toString(), ...ex },
									],
								}))
							}
							onUpdateExpense={(ex) =>
								updateTripData((t) => ({
									...t,
									expenses: t.expenses.map((e) => (e.id === ex.id ? ex : e)),
								}))
							}
							onDeleteExpense={(id) =>
								updateTripData((t) => ({
									...t,
									expenses: t.expenses.filter((e) => e.id !== id),
								}))
							}
							language={language}
						/>
					</>
				)}

				{/* 予約コンポーネント */}
				{activeTab === "BOOKINGS" && (
					<>
						{/* Bookings コンポーネントに旅行データと更新ハンドラを渡す */}
						<Bookings
							bookings={tripData.bookings}
							onAddBooking={(b) =>
								updateTripData((t) => ({
									...t,
									bookings: [
										...t.bookings,
										{ id: Math.random().toString(), ...b },
									],
								}))
							}
							onDeleteBooking={(id) =>
								updateTripData((t) => ({
									...t,
									bookings: t.bookings.filter((b) => b.id !== id),
								}))
							}
							isReadOnly={false}
							language={language}
						/>
					</>
				)}

				{/* 思い出コンポーネント */}
				{activeTab === "MEMORIES" && (
					<>
						{/* Memories コンポーネントに旅行データと更新ハンドラを渡す */}
						<Memories
							memories={tripData.memories}
							members={tripData.members}
							onAddMemory={(m) =>
								updateTripData((t) => ({
									...t,
									memories: [
										...t.memories,
										{ id: Math.random().toString(), ...m },
									],
								}))
							}
							onDeleteMemory={(id) =>
								updateTripData((t) => ({
									...t,
									memories: t.memories.filter((m) => m.id !== id),
								}))
							}
							currentUser={MOCK_USERS[0]}
							isReadOnly={false}
							language={language}
						/>
					</>
				)}
			</div>

			{/* ===== メンバーモーダル（メンバーボタンをクリックで表示） ===== */}
			{/*
			 * && 演算子：isMemberModalOpen が true のときだけこのモーダルを表示
			 * {state変数} && <JSX> は、条件付きレンダリングの常套句
			 */}
			{isMemberModalOpen && (
				<>
					{/* モーダルの背景（黒い半透明） */}
					<div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[60] flex items-center justify-center p-6">
						{/* モーダルの白いボックス */}
						<div className="bg-white dark:bg-gray-800 w-full max-w-sm rounded-[32px] p-6 shadow-2xl">
							{/* ヘッダー：タイトルと閉じるボタン */}
							<div className="flex justify-between items-center mb-6">
								<h3 className="font-bold text-xl text-gray-800 dark:text-white">
									Members
								</h3>
								<button
									type="button"
									onClick={() => setIsMemberModalOpen(false)}
									className="text-gray-400 hover:text-gray-600"
								>
									<X size={20} />
								</button>
							</div>

							{/* メンバーリスト */}
							<div className="space-y-4">
								{/* 各メンバーを表示 */}
								{tripData.members.map((m) => (
									<div key={m.id} className="flex items-center justify-between">
										{/* ユーザーのアバターを表示 */}
										<div className="flex items-center gap-3">
											<UserAvatar user={m} />
											<div>
												{/* メンバーの名前を表示 */}
												<p className="font-bold text-sm text-gray-800 dark:text-white">
													{m.name}
												</p>
												{/* メンバーの役割を表示 */}
												<p className="text-xs text-gray-400 capitalize">
													{m.role}
												</p>
											</div>
										</div>
									</div>
								))}
							</div>
						</div>
					</div>
				</>
			)}

			{/* 戻るボタン */}
			<div className="fixed bottom-32 left-6 z-50">
				<button
					type="button"
					onClick={() => window.history.back()}
					className="w-14 h-14 rounded-full shadow-lg bg-white dark:bg-gray-800 text-gray-500 dark:text-white flex items-center justify-center hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors border-4 border-ivory dark:border-gray-900"
				>
					<ArrowLeft size={24} />
				</button>
			</div>
		</div>
	);
}
