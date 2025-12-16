"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Compass,
  Home,
  Plus,
  Users,
  Bell,
  History,
  Search,
  X,
  Settings,
  HelpCircle,
  FileText,
  Info,
  LogOut,
  Edit2,
  Moon,
  Sun,
  Globe,
  ArrowLeft,
  Link,
  ChevronRight,
  MapIcon,
  Calendar,
  Heart,
  BellOff,
} from "lucide-react";
import {
  TEXT,
  MOCK_USERS,
  MOCK_TRIPS,
  MOCK_INVITATIONS,
} from "@/lib/constants";
import {
  User,
  Language,
  Trip,
  Invitation,
  AppNotification,
  DashboardTabState,
} from "@/lib/types";
import { UserAvatar } from "@/components/ui/UserAvatar";
import { Toast } from "@/components/ui/Toast";

export default function DashboardPage() {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<User>(MOCK_USERS[0]);
  const [language, setLanguage] = useState<Language>("ja");
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [trips, setTrips] = useState<Trip[]>(MOCK_TRIPS);
  const [invitations, setInvitations] =
    useState<Invitation[]>(MOCK_INVITATIONS);
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [dashboardTab, setDashboardTab] = useState<DashboardTabState>("HOME");
  const [showToast, setShowToast] = useState<{
    title: string;
    message: string;
  } | null>(null);

  // Modals
  const [isCreateTripModalOpen, setIsCreateTripModalOpen] = useState(false);
  const [isEditProfileModalOpen, setIsEditProfileModalOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [isActionSheetOpen, setIsActionSheetOpen] = useState(false);
  const [notificationPermission, setNotificationPermission] = useState<
    "default" | "granted" | "denied"
  >("default");

  // Inputs
  const [newTripData, setNewTripData] = useState({
    title: "",
    startDate: "",
    endDate: "",
  });
  const [editNameInput, setEditNameInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchOnlySaved, setSearchOnlySaved] = useState(false);

  // Settings
  const [notifSettings, setNotifSettings] = useState({
    enabled: true,
    messages: true,
    reminders: true,
  });

  const t = TEXT[language];

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDarkMode]);

  const addNotification = (
    title: string,
    message: string,
    type: "system" | "message" = "system",
  ) => {
    const newNotif: AppNotification = {
      id: Math.random().toString(36).substr(2, 9),
      title,
      message,
      timestamp: new Date().toLocaleTimeString(),
      isRead: false,
      type,
    };
    setNotifications((prev) => [newNotif, ...prev]);
    setShowToast({ title, message });
  };

  const toggleNotifSetting = (key: keyof typeof notifSettings) => {
    setNotifSettings((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleToggleSave = (e: React.MouseEvent, tripId: string) => {
    e.stopPropagation();
    setTrips(
      trips.map((t) => (t.id === tripId ? { ...t, isSaved: !t.isSaved } : t)),
    );
  };

  const handleCreateTrip = () => {
    const newTrip: Trip = {
      id: Math.random().toString(36).substr(2, 9),
      title: newTripData.title,
      dates: `${newTripData.startDate.replace(/-/g, "/")} - ${newTripData.endDate.replace(/-/g, "/")}`,
      coverImage: "",
      members: [{ ...currentUser, role: "admin" }],
      events: [],
      expenses: [],
      messages: [],
      memories: [],
      bookings: [],
      status: "upcoming",
      isSaved: false,
    };
    setTrips([newTrip, ...trips]);
    setIsCreateTripModalOpen(false);
    router.push(`/trips/${newTrip.id}`);
  };

  const handleAcceptInvite = (invite: Invitation) => {
    const newTrip: Trip = {
      id: invite.tripId,
      title: invite.tripTitle,
      dates: invite.tripDates,
      coverImage: invite.tripImage,
      members: [{ ...currentUser, role: "editor" }],
      events: [],
      expenses: [],
      messages: [],
      memories: [],
      bookings: [],
      status: "upcoming",
    };
    setTrips([newTrip, ...trips]);
    setInvitations(invitations.filter((i) => i.id !== invite.id));
  };

  const handleUpdateProfile = () => {
    if (editNameInput) {
      const updatedUser = { ...currentUser, name: editNameInput };
      setCurrentUser(updatedUser);
      setIsEditProfileModalOpen(false);
    }
  };

  const handleLogout = () => {
    router.push("/");
  };

  return (
    <div className="min-h-screen bg-ivory dark:bg-gray-900 pb-32">
      {showToast && (
        <Toast
          title={showToast.title}
          message={showToast.message}
          onClose={() => setShowToast(null)}
        />
      )}

      {/* Mint Banner Header */}
      <div className="bg-mint-400 pt-8 pb-10 px-6 rounded-b-[40px] shadow-lg mb-6 relative z-10 transition-all">
        <div className="flex justify-between items-center text-white">
          <div className="flex items-center gap-2">
            <Compass size={28} />
            <h1 className="text-2xl font-bold tracking-tight">TripLink</h1>
          </div>
          <div
            onClick={() => setDashboardTab("PROFILE")}
            className="cursor-pointer"
          >
            <UserAvatar user={currentUser} />
          </div>
        </div>
      </div>

      <div className="p-6 animate-fade-in">
        {dashboardTab === "HOME" && (
          <>
            <div className="space-y-4 mb-8">
              <button
                onClick={() => setIsCreateTripModalOpen(true)}
                className="w-full bg-gradient-to-r from-mint-400 to-mint-500 text-white p-5 rounded-[24px] shadow-lg shadow-mint-200 dark:shadow-none flex items-center justify-between group hover:scale-[1.02] transition-transform"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                    <Plus size={24} className="text-white" />
                  </div>
                  <div className="text-left">
                    <h3 className="font-bold text-lg">
                      {language === "ja"
                        ? "新しい旅行を計画する"
                        : "Plan a New Trip"}
                    </h3>
                    <p className="text-mint-100 text-xs">
                      Create a new itinerary
                    </p>
                  </div>
                </div>
                <div className="bg-white/20 p-2 rounded-full">
                  <ChevronRight size={20} />
                </div>
              </button>
            </div>

            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-800 dark:text-white">
                {language === "ja" ? "進行中" : "Upcoming"}
              </h2>
            </div>

            {trips.filter((t) => t.status === "upcoming").length === 0 ? (
              <div className="text-center py-20 bg-white dark:bg-gray-800 rounded-[32px] border border-dashed border-gray-300 dark:border-gray-700">
                <div className="w-20 h-20 bg-gray-50 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-300">
                  <MapIcon size={32} />
                </div>
                <p className="text-gray-400 font-medium mb-6">{t.noTrips}</p>
                <button
                  onClick={() => setIsCreateTripModalOpen(true)}
                  className="bg-mint-400 text-white px-8 py-3 rounded-full font-bold shadow-lg hover:bg-mint-500"
                >
                  {t.planNew}
                </button>
              </div>
            ) : (
              <div className="grid gap-6">
                {trips
                  .filter((t) => t.status === "upcoming")
                  .map((trip) => (
                    <div
                      key={trip.id}
                      onClick={() => router.push(`/trips/${trip.id}`)}
                      className="bg-white dark:bg-gray-800 rounded-[32px] p-6 shadow-sm border border-gray-100 dark:border-gray-700 relative overflow-hidden group hover:shadow-lg transition-all cursor-pointer"
                    >
                      <div className="flex justify-between items-start mb-8">
                        <div
                          className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl font-bold ${trip.id === "t1" ? "bg-peach-100 text-peach-500" : "bg-mint-100 text-mint-500"}`}
                        >
                          {trip.title.substring(0, 1)}
                        </div>
                        <button
                          onClick={(e) => handleToggleSave(e, trip.id)}
                          className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${trip.isSaved ? "text-pink-500 bg-pink-50 dark:bg-pink-900/20" : "text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"}`}
                        >
                          <Heart
                            size={20}
                            fill={trip.isSaved ? "currentColor" : "none"}
                          />
                        </button>
                      </div>
                      <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-1 line-clamp-1">
                        {trip.title}
                      </h3>
                      <div className="flex justify-between items-end mt-4">
                        <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400 text-sm font-medium bg-gray-50 dark:bg-gray-700 px-3 py-1 rounded-full">
                          <Calendar size={14} />
                          {trip.dates.split(" - ")[0]}
                        </div>
                        <div className="flex -space-x-2">
                          {trip.members.map((m, i) => (
                            <div
                              key={i}
                              className="ring-2 ring-white dark:ring-gray-800 rounded-full"
                            >
                              <UserAvatar user={m} />
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            )}
          </>
        )}

        {dashboardTab === "SEARCH" && (
          <div className="space-y-6">
            <div className="bg-white dark:bg-gray-800 rounded-[24px] p-4 border border-gray-100 dark:border-gray-700">
              <div className="flex gap-4 items-center">
                <input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="flex-1 bg-gray-50 dark:bg-gray-700 dark:text-white p-3 rounded-2xl outline-none focus:ring-2 ring-mint-200"
                  placeholder={
                    language === "ja"
                      ? "タイトルで検索..."
                      : "Search by title..."
                  }
                />
                <label className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300 whitespace-nowrap">
                  <input
                    type="checkbox"
                    checked={searchOnlySaved}
                    onChange={(e) => setSearchOnlySaved(e.target.checked)}
                    className="w-4 h-4"
                  />
                  {language === "ja" ? "保存済みのみ" : "Saved only"}
                </label>
              </div>
            </div>

            <div className="space-y-4">
              {trips
                .filter((t) => (searchOnlySaved ? t.isSaved : true))
                .filter((t) =>
                  t.title.toLowerCase().includes(searchQuery.toLowerCase()),
                )
                .map((trip) => (
                  <div
                    key={trip.id}
                    onClick={() => router.push(`/trips/${trip.id}`)}
                    className="bg-white dark:bg-gray-800 rounded-[24px] p-6 border border-gray-100 dark:border-gray-700 cursor-pointer hover:shadow-md transition-shadow"
                  >
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="font-bold text-gray-800 dark:text-white">
                        {trip.title}
                      </h3>
                      <div className="flex gap-2">
                        {trip.isSaved && (
                          <span className="text-[10px] text-pink-500 bg-pink-50 dark:bg-pink-900/20 px-2 py-1 rounded-full font-bold">
                            Saved
                          </span>
                        )}
                        {trip.status === "completed" && (
                          <span className="text-[10px] bg-gray-200 dark:bg-gray-600 text-gray-500 dark:text-gray-300 px-2 py-1 rounded-full font-bold">
                            {t.tabPast}
                          </span>
                        )}
                      </div>
                    </div>
                    <p className="text-sm text-gray-400">{trip.dates}</p>
                    <div className="flex items-center gap-2 mt-3">
                      <div className="flex -space-x-2">
                        {trip.members.slice(0, 3).map((m, i) => (
                          <div
                            key={i}
                            className="ring-2 ring-white dark:ring-gray-800 rounded-full"
                          >
                            <UserAvatar user={m} size="sm" />
                          </div>
                        ))}
                      </div>
                      {trip.members.length > 3 && (
                        <span className="text-xs text-gray-400">
                          +{trip.members.length - 3}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              {trips
                .filter((t) => (searchOnlySaved ? t.isSaved : true))
                .filter((t) =>
                  t.title.toLowerCase().includes(searchQuery.toLowerCase()),
                ).length === 0 && (
                <div className="text-center py-16 text-gray-400">
                  {language === "ja"
                    ? "該当する旅行が見つかりませんでした"
                    : "No trips found"}
                </div>
              )}
            </div>
          </div>
        )}

        {dashboardTab === "SAVED" && (
          <div className="space-y-4">
            {trips.filter((t) => t.isSaved).length === 0 ? (
              <div className="text-center py-16 text-gray-400">{t.saved}</div>
            ) : (
              trips
                .filter((t) => t.isSaved)
                .map((trip) => (
                  <div
                    key={trip.id}
                    onClick={() => router.push(`/trips/${trip.id}`)}
                    className="bg-white dark:bg-gray-800 rounded-[24px] p-6 border border-gray-100 dark:border-gray-700 cursor-pointer hover:shadow-md transition-shadow"
                  >
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="font-bold text-gray-800 dark:text-white">
                        {trip.title}
                      </h3>
                      <span className="text-[10px] text-pink-500 bg-pink-50 dark:bg-pink-900/20 px-2 py-1 rounded-full font-bold">
                        Saved
                      </span>
                    </div>
                    <p className="text-sm text-gray-400">{trip.dates}</p>
                  </div>
                ))
            )}
          </div>
        )}

        {dashboardTab === "HISTORY" && (
          <div className="space-y-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-800 dark:text-white">
                {t.history}
              </h2>
            </div>
            {trips.length === 0 ? (
              <p className="text-gray-400 text-center py-10">No history</p>
            ) : (
              trips.map((trip) => (
                <div
                  key={trip.id}
                  onClick={() => router.push(`/trips/${trip.id}`)}
                  className="bg-white dark:bg-gray-800 rounded-[24px] p-6 shadow-sm border border-gray-100 dark:border-gray-700 flex justify-between items-center cursor-pointer hover:shadow-md transition-all group"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span
                        className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase border ${
                          trip.status === "completed"
                            ? "bg-gray-100 text-gray-500 border-gray-200 dark:bg-gray-700 dark:text-gray-400 dark:border-gray-600"
                            : "bg-mint-50 text-mint-500 border-mint-100 dark:bg-mint-900/20 dark:text-mint-400 dark:border-mint-900"
                        }`}
                      >
                        {trip.status === "completed"
                          ? t.tabPast
                          : language === "ja"
                            ? "進行中"
                            : "Upcoming"}
                      </span>
                      <h3 className="font-bold text-gray-800 dark:text-white line-clamp-1">
                        {trip.title}
                      </h3>
                    </div>
                    <div className="flex items-center gap-2 text-gray-400 text-xs">
                      <Calendar size={12} />
                      <span>{trip.dates}</span>
                    </div>
                  </div>
                  <div className="text-gray-300 group-hover:text-mint-400 transition-colors">
                    <ChevronRight size={20} />
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {dashboardTab === "INVITATIONS" && (
          <div className="space-y-4">
            {invitations.length === 0 ? (
              <p className="text-center text-gray-400 mt-10">
                No pending invitations
              </p>
            ) : (
              invitations.map((inv) => (
                <div
                  key={inv.id}
                  className="bg-white dark:bg-gray-800 rounded-[24px] p-6 shadow-sm border border-gray-100 dark:border-gray-700"
                >
                  <div className="flex items-center gap-4 mb-4">
                    <UserAvatar user={inv.inviter} />
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        <span className="font-bold text-gray-800 dark:text-white">
                          {inv.inviter.name}
                        </span>{" "}
                        invited you to
                      </p>
                      <h3 className="font-bold text-lg text-gray-800 dark:text-white">
                        {inv.tripTitle}
                      </h3>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleAcceptInvite(inv)}
                      className="flex-1 bg-mint-400 text-white py-2 rounded-xl font-bold text-sm shadow-sm"
                    >
                      {t.inviteAccept}
                    </button>
                    <button className="flex-1 bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-300 py-2 rounded-xl font-bold text-sm">
                      {t.inviteDecline}
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {dashboardTab === "NOTIFICATIONS" && (
          <div className="space-y-4">
            {notificationPermission === "default" && (
              <div className="bg-mint-50 dark:bg-mint-900/20 p-6 rounded-[24px] text-center border border-mint-100 dark:border-mint-900 mb-6">
                <div className="w-12 h-12 bg-mint-400 rounded-full flex items-center justify-center mx-auto mb-3 text-white shadow-sm">
                  <Bell size={24} />
                </div>
                <h3 className="font-bold text-gray-800 dark:text-white mb-1">
                  {language === "ja" ? "通知を許可" : "Allow Notifications"}
                </h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">
                  {language === "ja"
                    ? "旅の更新やメッセージを見逃さないように通知を許可しましょう。"
                    : "Don't miss out on trip updates and messages."}
                </p>
                <button
                  onClick={() => setNotificationPermission("granted")}
                  className="bg-mint-400 text-white px-6 py-2 rounded-full font-bold text-sm shadow-md hover:bg-mint-500 transition-colors"
                >
                  {language === "ja" ? "許可する" : "Allow"}
                </button>
              </div>
            )}
            {notificationPermission === "denied" && (
              <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-[24px] flex gap-4 items-center border border-red-100 dark:border-red-900 mb-6">
                <div className="w-10 h-10 bg-red-400 rounded-full flex items-center justify-center text-white flex-shrink-0">
                  <BellOff size={20} />
                </div>
                <div>
                  <h3 className="font-bold text-gray-800 dark:text-white text-sm">
                    {language === "ja"
                      ? "通知がブロックされています"
                      : "Notifications Blocked"}
                  </h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {language === "ja"
                      ? "ブラウザの設定から通知を許可してください。"
                      : "Please enable notifications in your browser settings."}
                  </p>
                </div>
              </div>
            )}

            {notifications.length === 0 ? (
              <div className="text-center py-20 text-gray-400">
                No notifications
              </div>
            ) : (
              notifications.map((n) => (
                <div
                  key={n.id}
                  className={`p-4 rounded-2xl flex gap-4 ${n.isRead ? "bg-gray-50 dark:bg-gray-800" : "bg-white dark:bg-gray-700 shadow-sm border border-mint-100 dark:border-gray-600"}`}
                >
                  <div
                    className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${n.isRead ? "bg-gray-300" : "bg-mint-400"}`}
                  ></div>
                  <div>
                    <h4 className="font-bold text-sm text-gray-800 dark:text-white">
                      {n.title}
                    </h4>
                    <p className="text-xs text-gray-500 dark:text-gray-300 mt-1">
                      {n.message}
                    </p>
                    <p className="text-[10px] text-gray-400 mt-2">
                      {n.timestamp}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {dashboardTab === "SEARCH" && (
          <div className="space-y-6">
            <div className="bg-white dark:bg-gray-800 rounded-[24px] p-4 border border-gray-100 dark:border-gray-700">
              <div className="flex gap-4 items-center">
                <input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="flex-1 bg-gray-50 dark:bg-gray-700 dark:text-white p-3 rounded-2xl outline-none focus:ring-2 ring-mint-200"
                  placeholder={
                    language === "ja"
                      ? "タイトルで検索..."
                      : "Search by title..."
                  }
                />
                <label className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300 whitespace-nowrap">
                  <input
                    type="checkbox"
                    checked={searchOnlySaved}
                    onChange={(e) => setSearchOnlySaved(e.target.checked)}
                    className="w-4 h-4"
                  />
                  {language === "ja" ? "保存済みのみ" : "Saved only"}
                </label>
              </div>
            </div>

            <div className="space-y-4">
              {trips
                .filter((t) => (searchOnlySaved ? t.isSaved : true))
                .filter((t) =>
                  t.title.toLowerCase().includes(searchQuery.toLowerCase()),
                )
                .map((trip) => (
                  <div
                    key={trip.id}
                    onClick={() => router.push(`/trips/${trip.id}`)}
                    className="bg-white dark:bg-gray-800 rounded-[24px] p-6 border border-gray-100 dark:border-gray-700 cursor-pointer hover:shadow-md transition-shadow"
                  >
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="font-bold text-gray-800 dark:text-white">
                        {trip.title}
                      </h3>
                      <div className="flex gap-2">
                        {trip.isSaved && (
                          <span className="text-[10px] text-pink-500 bg-pink-50 dark:bg-pink-900/20 px-2 py-1 rounded-full font-bold">
                            Saved
                          </span>
                        )}
                        {trip.status === "completed" && (
                          <span className="text-[10px] bg-gray-200 dark:bg-gray-600 text-gray-500 dark:text-gray-300 px-2 py-1 rounded-full font-bold">
                            {t.tabPast}
                          </span>
                        )}
                      </div>
                    </div>
                    <p className="text-sm text-gray-400">{trip.dates}</p>
                    <div className="flex items-center gap-2 mt-3">
                      <div className="flex -space-x-2">
                        {trip.members.slice(0, 3).map((m, i) => (
                          <div
                            key={i}
                            className="ring-2 ring-white dark:ring-gray-800 rounded-full"
                          >
                            <UserAvatar user={m} size="sm" />
                          </div>
                        ))}
                      </div>
                      {trip.members.length > 3 && (
                        <span className="text-xs text-gray-400">
                          +{trip.members.length - 3}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              {trips
                .filter((t) => (searchOnlySaved ? t.isSaved : true))
                .filter((t) =>
                  t.title.toLowerCase().includes(searchQuery.toLowerCase()),
                ).length === 0 && (
                <div className="text-center py-16 text-gray-400">
                  {language === "ja"
                    ? "該当する旅行が見つかりませんでした"
                    : "No trips found"}
                </div>
              )}
            </div>
          </div>
        )}

        {dashboardTab === "COMPLETED" && (
          <div className="space-y-4">
            {trips
              .filter((t) => t.status === "completed")
              .map((trip) => (
                <div
                  key={trip.id}
                  onClick={() => router.push(`/trips/${trip.id}`)}
                  className="bg-gray-50 dark:bg-gray-800 rounded-[24px] p-6 border border-gray-200 dark:border-gray-700 grayscale hover:grayscale-0 transition-all cursor-pointer opacity-75 hover:opacity-100"
                >
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="font-bold text-gray-700 dark:text-white">
                      {trip.title}
                    </h3>
                    <span className="text-[10px] bg-gray-200 dark:bg-gray-600 text-gray-500 dark:text-gray-300 px-2 py-1 rounded-full font-bold">
                      {t.tabPast}
                    </span>
                  </div>
                  <p className="text-sm text-gray-400">{trip.dates}</p>
                </div>
              ))}
          </div>
        )}

        {dashboardTab === "SAVED" && (
          <div className="space-y-4">
            {trips.filter((t) => t.isSaved).length === 0 ? (
              <div className="text-center py-16 text-gray-400">{t.saved}</div>
            ) : (
              trips
                .filter((t) => t.isSaved)
                .map((trip) => (
                  <div
                    key={trip.id}
                    onClick={() => router.push(`/trips/${trip.id}`)}
                    className="bg-white dark:bg-gray-800 rounded-[24px] p-6 border border-gray-100 dark:border-gray-700 cursor-pointer hover:shadow-md transition-shadow"
                  >
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="font-bold text-gray-800 dark:text-white">
                        {trip.title}
                      </h3>
                      <span className="text-[10px] text-pink-500 bg-pink-50 dark:bg-pink-900/20 px-2 py-1 rounded-full font-bold">
                        Saved
                      </span>
                    </div>
                    <p className="text-sm text-gray-400">{trip.dates}</p>
                  </div>
                ))
            )}
          </div>
        )}

        {dashboardTab === "HISTORY" && (
          <div className="space-y-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-800 dark:text-white">
                {t.history}
              </h2>
            </div>
            {trips.length === 0 ? (
              <p className="text-gray-400 text-center py-10">No history</p>
            ) : (
              trips.map((trip) => (
                <div
                  key={trip.id}
                  onClick={() => router.push(`/trips/${trip.id}`)}
                  className="bg-white dark:bg-gray-800 rounded-[24px] p-6 shadow-sm border border-gray-100 dark:border-gray-700 flex justify-between items-center cursor-pointer hover:shadow-md transition-all group"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span
                        className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase border ${
                          trip.status === "completed"
                            ? "bg-gray-100 text-gray-500 border-gray-200 dark:bg-gray-700 dark:text-gray-400 dark:border-gray-600"
                            : "bg-mint-50 text-mint-500 border-mint-100 dark:bg-mint-900/20 dark:text-mint-400 dark:border-mint-900"
                        }`}
                      >
                        {trip.status === "completed"
                          ? t.tabPast
                          : language === "ja"
                            ? "進行中"
                            : "Upcoming"}
                      </span>
                      <h3 className="font-bold text-gray-800 dark:text-white line-clamp-1">
                        {trip.title}
                      </h3>
                    </div>
                    <div className="flex items-center gap-2 text-gray-400 text-xs">
                      <Calendar size={12} />
                      <span>{trip.dates}</span>
                    </div>
                  </div>
                  <div className="text-gray-300 group-hover:text-mint-400 transition-colors">
                    <ChevronRight size={20} />
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {dashboardTab === "INVITATIONS" && (
          <div className="space-y-4">
            {invitations.length === 0 ? (
              <p className="text-center text-gray-400 mt-10">
                No pending invitations
              </p>
            ) : (
              invitations.map((inv) => (
                <div
                  key={inv.id}
                  className="bg-white dark:bg-gray-800 rounded-[24px] p-6 shadow-sm border border-gray-100 dark:border-gray-700"
                >
                  <div className="flex items-center gap-4 mb-4">
                    <UserAvatar user={inv.inviter} />
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        <span className="font-bold text-gray-800 dark:text-white">
                          {inv.inviter.name}
                        </span>{" "}
                        invited you to
                      </p>
                      <h3 className="font-bold text-lg text-gray-800 dark:text-white">
                        {inv.tripTitle}
                      </h3>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleAcceptInvite(inv)}
                      className="flex-1 bg-mint-400 text-white py-2 rounded-xl font-bold text-sm shadow-sm"
                    >
                      {t.inviteAccept}
                    </button>
                    <button className="flex-1 bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-300 py-2 rounded-xl font-bold text-sm">
                      {t.inviteDecline}
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {dashboardTab === "NOTIFICATIONS" && (
          <div className="space-y-4">
            {notifications.length === 0 ? (
              <div className="text-center py-20 text-gray-400">
                No notifications
              </div>
            ) : (
              notifications.map((n) => (
                <div
                  key={n.id}
                  className={`p-4 rounded-2xl flex gap-4 ${n.isRead ? "bg-gray-50 dark:bg-gray-800" : "bg-white dark:bg-gray-700 shadow-sm border border-mint-100 dark:border-gray-600"}`}
                >
                  <div
                    className={`w-2 h-2 rounded-full mt-2 ${n.isRead ? "bg-gray-300" : "bg-mint-400"}`}
                  ></div>
                  <div>
                    <h4 className="font-bold text-sm text-gray-800 dark:text-white">
                      {n.title}
                    </h4>
                    <p className="text-xs text-gray-500 dark:text-gray-300 mt-1">
                      {n.message}
                    </p>
                    <p className="text-[10px] text-gray-400 mt-2">
                      {n.timestamp}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {dashboardTab === "PROFILE" && (
          <div className="space-y-6">
            <div className="bg-white dark:bg-gray-800 rounded-[32px] p-8 text-center border border-gray-100 dark:border-gray-700 relative">
              <div className="absolute top-4 right-4">
                <button
                  onClick={() => {
                    setEditNameInput(currentUser.name);
                    setIsEditProfileModalOpen(true);
                  }}
                  className="p-2 bg-gray-50 dark:bg-gray-700 rounded-full text-gray-400 hover:text-mint-500"
                >
                  <Edit2 size={16} />
                </button>
              </div>
              <div className="inline-block p-1 rounded-full border-2 border-mint-100 dark:border-mint-900 mb-4">
                <UserAvatar user={currentUser} size="lg" />
              </div>
              <h2 className="text-xl font-bold text-gray-800 dark:text-white">
                {currentUser.name}
              </h2>
              <p className="text-gray-400 text-sm">@{currentUser.id}</p>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-[32px] p-6 border border-gray-100 dark:border-gray-700 space-y-2">
              <div
                className="flex justify-between items-center p-4 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-2xl cursor-pointer transition-colors"
                onClick={() => setIsSettingsModalOpen(true)}
              >
                <div className="flex items-center gap-4 text-gray-800 dark:text-white">
                  <div className="w-10 h-10 rounded-full bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center text-blue-500">
                    <Settings size={20} />
                  </div>
                  <span className="font-bold">
                    {language === "ja" ? "設定" : "Settings"}
                  </span>
                </div>
                <ChevronRight size={18} className="text-gray-300" />
              </div>

              <div className="flex justify-between items-center p-4 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-2xl cursor-pointer transition-colors">
                <div className="flex items-center gap-4 text-gray-800 dark:text-white">
                  <div className="w-10 h-10 rounded-full bg-purple-50 dark:bg-purple-900/20 flex items-center justify-center text-purple-500">
                    <HelpCircle size={20} />
                  </div>
                  <span className="font-bold">
                    {language === "ja" ? "ヘルプ" : "Help"}
                  </span>
                </div>
                <ChevronRight size={18} className="text-gray-300" />
              </div>
            </div>

            <button
              onClick={handleLogout}
              className="w-full py-4 rounded-2xl text-red-500 font-bold bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/40 transition-colors flex items-center justify-center gap-2"
            >
              <LogOut size={20} /> {t.logout}
            </button>
          </div>
        )}
      </div>

      {/* Bottom Navigation Bar with FAB */}
      <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 border-t border-gray-100 dark:border-gray-700 px-6 py-2 flex justify-between items-center z-40 pb-safe">
        <button
          onClick={() => setDashboardTab("HOME")}
          className={`p-2 rounded-xl transition-colors flex flex-col items-center gap-1 ${dashboardTab === "HOME" ? "text-mint-400" : "text-gray-300"}`}
        >
          <Home size={24} strokeWidth={dashboardTab === "HOME" ? 2.5 : 2} />
        </button>
        <button
          onClick={() => setDashboardTab("HISTORY")}
          className={`p-2 rounded-xl transition-colors flex flex-col items-center gap-1 ${dashboardTab === "HISTORY" ? "text-mint-400" : "text-gray-300"}`}
        >
          <History
            size={24}
            strokeWidth={dashboardTab === "HISTORY" ? 2.5 : 2}
          />
        </button>

        {/* FAB */}
        <div className="relative -top-6">
          <button
            onClick={() => setIsActionSheetOpen(true)}
            className="w-16 h-16 bg-mint-400 rounded-full text-white flex items-center justify-center shadow-lg border-4 border-ivory dark:border-gray-900 hover:scale-105 transition-transform hover:shadow-xl hover:bg-mint-500"
          >
            <Plus size={32} />
          </button>
        </div>

        <button
          onClick={() => setDashboardTab("INVITATIONS")}
          className={`p-2 rounded-xl transition-colors relative flex flex-col items-center gap-1 ${dashboardTab === "INVITATIONS" ? "text-mint-400" : "text-gray-300"}`}
        >
          <Users
            size={24}
            strokeWidth={dashboardTab === "INVITATIONS" ? 2.5 : 2}
          />
          {invitations.length > 0 && (
            <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white dark:ring-gray-800"></span>
          )}
        </button>
        <button
          onClick={() => setDashboardTab("NOTIFICATIONS")}
          className={`p-2 rounded-xl transition-colors relative flex flex-col items-center gap-1 ${dashboardTab === "NOTIFICATIONS" ? "text-mint-400" : "text-gray-300"}`}
        >
          <Bell
            size={24}
            strokeWidth={dashboardTab === "NOTIFICATIONS" ? 2.5 : 2}
          />
          {notifications.some((n) => !n.isRead) && (
            <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white dark:ring-gray-800"></span>
          )}
        </button>
      </div>

      {/* Action Sheet Modal */}
      {isActionSheetOpen && (
        <div className="fixed inset-0 z-50 flex items-end justify-center">
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setIsActionSheetOpen(false)}
          ></div>
          <div className="bg-white dark:bg-gray-800 w-full max-w-sm rounded-t-[32px] p-8 z-10 animate-slide-up space-y-4 shadow-2xl">
            <div className="w-12 h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full mx-auto mb-6"></div>
            <h3 className="text-xl font-bold text-gray-800 dark:text-white text-center mb-6">
              {language === "ja" ? "アクションを選択" : "Select Action"}
            </h3>

            <button
              onClick={() => {
                setIsCreateTripModalOpen(true);
                setIsActionSheetOpen(false);
              }}
              className="w-full flex items-center gap-4 p-4 bg-mint-50 dark:bg-mint-900/20 rounded-2xl hover:bg-mint-100 dark:hover:bg-mint-900/40 transition-colors group border border-transparent hover:border-mint-200"
            >
              <div className="w-12 h-12 bg-mint-400 rounded-full text-white flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
                <Plus size={24} />
              </div>
              <div className="text-left">
                <h4 className="font-bold text-gray-800 dark:text-white text-lg">
                  {t.createTrip}
                </h4>
                <p className="text-xs text-gray-400">
                  Create a new itinerary from scratch
                </p>
              </div>
            </button>

            <button
              onClick={() => {
                setIsActionSheetOpen(false);
              }}
              className="w-full flex items-center gap-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-2xl hover:bg-blue-100 dark:hover:bg-blue-900/40 transition-colors group border border-transparent hover:border-blue-200"
            >
              <div className="w-12 h-12 bg-blue-400 rounded-full text-white flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
                <Link size={24} />
              </div>
              <div className="text-left">
                <h4 className="font-bold text-gray-800 dark:text-white text-lg">
                  {t.joinTrip}
                </h4>
                <p className="text-xs text-gray-400">
                  Enter code or link to join
                </p>
              </div>
            </button>

            <button
              onClick={() => setIsActionSheetOpen(false)}
              className="w-full py-4 mt-2 text-gray-400 font-bold hover:text-gray-600 dark:hover:text-gray-300"
            >
              {t.cancel}
            </button>
          </div>
        </div>
      )}
      {/* Create Trip Modal */}
      {isCreateTripModalOpen && (
        <div className="fixed inset-0 bg-white/95 dark:bg-gray-900/95 backdrop-blur-md z-50 p-8 flex flex-col animate-fade-in">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
              {t.createTrip}
            </h2>
            <button
              onClick={() => setIsCreateTripModalOpen(false)}
              className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center"
            >
              <X size={20} />
            </button>
          </div>
          <div className="space-y-6 flex-1">
            <div>
              <label className="block text-sm font-bold text-gray-400 mb-2">
                {t.tripTitle}
              </label>
              <input
                value={newTripData.title}
                onChange={(e) =>
                  setNewTripData({ ...newTripData, title: e.target.value })
                }
                className="w-full bg-ivory dark:bg-gray-800 dark:text-white p-5 rounded-2xl text-lg font-bold outline-none focus:ring-2 ring-mint-200"
                placeholder="e.g. Summer Vacation"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-gray-400 mb-2">
                  {t.startDate}
                </label>
                <input
                  type="date"
                  value={newTripData.startDate}
                  onChange={(e) =>
                    setNewTripData({
                      ...newTripData,
                      startDate: e.target.value,
                    })
                  }
                  className="w-full bg-ivory dark:bg-gray-800 dark:text-white p-4 rounded-2xl outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-400 mb-2">
                  {t.endDate}
                </label>
                <input
                  type="date"
                  value={newTripData.endDate}
                  onChange={(e) =>
                    setNewTripData({ ...newTripData, endDate: e.target.value })
                  }
                  className="w-full bg-ivory dark:bg-gray-800 dark:text-white p-4 rounded-2xl outline-none"
                />
              </div>
            </div>
          </div>
          <button
            onClick={handleCreateTrip}
            className="w-full bg-mint-400 text-white py-5 rounded-full font-bold text-lg shadow-xl hover:bg-mint-500 transition-all"
          >
            {t.create}
          </button>
        </div>
      )}

      {/* Settings Modal */}
      {isSettingsModalOpen && (
        <div className="fixed inset-0 bg-white dark:bg-gray-900 z-50 flex flex-col animate-fade-in">
          <div className="px-6 py-4 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md sticky top-0 border-b border-gray-100 dark:border-gray-800 flex items-center gap-4">
            <button
              onClick={() => setIsSettingsModalOpen(false)}
              className="w-10 h-10 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 flex items-center justify-center text-gray-800 dark:text-white transition-colors"
            >
              <ArrowLeft size={24} />
            </button>
            <h2 className="text-xl font-bold text-gray-800 dark:text-white">
              {language === "ja" ? "設定" : "Settings"}
            </h2>
          </div>

          <div className="flex-1 overflow-y-auto p-6 space-y-8">
            <section>
              <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4 ml-2">
                {language === "ja" ? "一般" : "General"}
              </h3>
              <div className="bg-gray-50 dark:bg-gray-800 rounded-[24px] overflow-hidden border border-gray-100 dark:border-gray-700">
                <div className="flex justify-between items-center p-4 border-b border-gray-100 dark:border-gray-700">
                  <div className="flex items-center gap-3 text-gray-700 dark:text-gray-200">
                    {isDarkMode ? <Moon size={20} /> : <Sun size={20} />}
                    <span className="font-medium">{t.darkMode}</span>
                  </div>
                  <button
                    onClick={() => setIsDarkMode(!isDarkMode)}
                    className={`w-12 h-7 rounded-full p-1 transition-colors ${isDarkMode ? "bg-mint-400" : "bg-gray-200 dark:bg-gray-600"}`}
                  >
                    <div
                      className={`w-5 h-5 bg-white rounded-full shadow-sm transition-transform ${isDarkMode ? "translate-x-5" : ""}`}
                    ></div>
                  </button>
                </div>
                <div className="flex justify-between items-center p-4">
                  <div className="flex items-center gap-3 text-gray-700 dark:text-gray-200">
                    <Globe size={20} />
                    <span className="font-medium">{t.language}</span>
                  </div>
                  <button
                    onClick={() =>
                      setLanguage((l) => (l === "ja" ? "en" : "ja"))
                    }
                    className="text-xs font-bold bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 px-3 py-1.5 rounded-full text-gray-600 dark:text-gray-200"
                  >
                    {language === "ja" ? "日本語" : "English"}
                  </button>
                </div>
              </div>
            </section>

            <section>
              <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4 ml-2">
                {language === "ja" ? "通知" : "Notifications"}
              </h3>
              <div className="bg-gray-50 dark:bg-gray-800 rounded-[24px] overflow-hidden border border-gray-100 dark:border-gray-700">
                <div
                  className="flex justify-between items-center p-4 border-b border-gray-100 dark:border-gray-700 cursor-pointer"
                  onClick={() => toggleNotifSetting("enabled")}
                >
                  <div className="flex items-center gap-3 text-gray-700 dark:text-gray-200">
                    <Bell size={20} />
                    <span className="font-medium">
                      {language === "ja" ? "通知を許可" : "Allow Notifications"}
                    </span>
                  </div>
                  <div
                    className={`w-12 h-7 rounded-full p-1 transition-colors ${notifSettings.enabled ? "bg-mint-400" : "bg-gray-200 dark:bg-gray-600"}`}
                  >
                    <div
                      className={`w-5 h-5 bg-white rounded-full shadow-sm transition-transform ${notifSettings.enabled ? "translate-x-5" : ""}`}
                    ></div>
                  </div>
                </div>
                {notifSettings.enabled && (
                  <>
                    <div
                      className="flex justify-between items-center p-4 border-b border-gray-100 dark:border-gray-700 cursor-pointer pl-10"
                      onClick={() => toggleNotifSetting("messages")}
                    >
                      <span className="text-gray-700 dark:text-gray-200 text-sm">
                        {language === "ja"
                          ? "メッセージ通知"
                          : "Message Notifications"}
                      </span>
                      <div
                        className={`w-10 h-6 rounded-full p-1 transition-colors ${notifSettings.messages ? "bg-mint-400" : "bg-gray-200 dark:bg-gray-600"}`}
                      >
                        <div
                          className={`w-4 h-4 bg-white rounded-full shadow-sm transition-transform ${notifSettings.messages ? "translate-x-4" : ""}`}
                        ></div>
                      </div>
                    </div>
                    <div
                      className="flex justify-between items-center p-4 border-b border-gray-100 dark:border-gray-700 cursor-pointer pl-10"
                      onClick={() => toggleNotifSetting("reminders")}
                    >
                      <span className="text-gray-700 dark:text-gray-200 text-sm">
                        {language === "ja" ? "リマインダー" : "Reminders"}
                      </span>
                      <div
                        className={`w-10 h-6 rounded-full p-1 transition-colors ${notifSettings.reminders ? "bg-mint-400" : "bg-gray-200 dark:bg-gray-600"}`}
                      >
                        <div
                          className={`w-4 h-4 bg-white rounded-full shadow-sm transition-transform ${notifSettings.reminders ? "translate-x-4" : ""}`}
                        ></div>
                      </div>
                    </div>
                  </>
                )}
                <div
                  className="flex justify-between items-center p-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors cursor-pointer"
                  onClick={() => addNotification("Test", "Notification test")}
                >
                  <span className="text-mint-500 font-bold text-sm ml-2">
                    {language === "ja" ? "通知テスト" : "Test Notification"}
                  </span>
                  <ChevronRight size={18} className="text-gray-300" />
                </div>
              </div>
            </section>

            <section>
              <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4 ml-2">
                {language === "ja" ? "サポート" : "Support"}
              </h3>
              <div className="bg-gray-50 dark:bg-gray-800 rounded-[24px] overflow-hidden border border-gray-100 dark:border-gray-700">
                <div className="flex justify-between items-center p-4 border-b border-gray-100 dark:border-gray-700">
                  <div className="flex items-center gap-3 text-gray-700 dark:text-gray-200">
                    <HelpCircle size={20} />
                    <span className="font-medium">
                      {language === "ja" ? "ヘルプ" : "Help"}
                    </span>
                  </div>
                  <ChevronRight size={18} className="text-gray-300" />
                </div>
                <div className="flex justify-between items-center p-4 border-b border-gray-100 dark:border-gray-700">
                  <div className="flex items-center gap-3 text-gray-700 dark:text-gray-200">
                    <FileText size={20} />
                    <span className="font-medium">
                      {language === "ja"
                        ? "プライバシーポリシー"
                        : "Privacy Policy"}
                    </span>
                  </div>
                  <ChevronRight size={18} className="text-gray-300" />
                </div>
                <div className="flex justify-between items-center p-4">
                  <div className="flex items-center gap-3 text-gray-700 dark:text-gray-200">
                    <Info size={20} />
                    <span className="font-medium">
                      {language === "ja" ? "アプリについて" : "About"}
                    </span>
                  </div>
                  <ChevronRight size={18} className="text-gray-300" />
                </div>
              </div>
            </section>

            <div className="text-center pt-8 pb-10">
              <p className="text-xs text-gray-400 font-medium">
                TripLink v1.0.0
              </p>
              <p className="text-[10px] text-gray-300 mt-1">
                Made with ❤️ for travelers
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Edit Profile Modal */}
      {isEditProfileModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[60] flex items-center justify-center p-6">
          <div className="bg-white dark:bg-gray-800 w-full max-w-sm rounded-[32px] p-8 shadow-2xl">
            <h3 className="font-bold text-xl mb-4 text-gray-800 dark:text-white">
              {language === "ja" ? "プロフィール編集" : "Edit Profile"}
            </h3>
            <input
              value={editNameInput}
              onChange={(e) => setEditNameInput(e.target.value)}
              className="w-full bg-gray-100 dark:bg-gray-700 dark:text-white p-4 rounded-2xl mb-6 outline-none"
              placeholder={t.name}
            />
            <div className="space-y-2">
              <button
                onClick={() => setIsEditProfileModalOpen(false)}
                className="w-full py-3 rounded-full text-gray-500"
              >
                {t.cancel}
              </button>
              <button
                onClick={handleUpdateProfile}
                className="w-full py-3 rounded-full bg-mint-400 text-white font-bold"
              >
                {t.save}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
