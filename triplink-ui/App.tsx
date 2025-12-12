
import React, { useState, useEffect } from 'react';
import { Trip, ViewState, TripTabState, DashboardTabState, User, Category, ChatMessage, Invitation, TripMember, AppNotification, Language } from './types';
import { Timeline } from './components/Timeline';
import { Wallet } from './components/Wallet';
import { CalendarView } from './components/CalendarView';
import { Memories } from './components/Memories';
import { Bookings } from './components/Bookings';
import { 
  Compass, 
  Wallet as WalletIcon, 
  Image as ImageIcon, 
  ArrowLeft, 
  Users, 
  Share2, 
  Calendar,
  Home,
  User as UserIcon,
  Search,
  Plus,
  Map as MapIcon,
  MessageCircle,
  Bell,
  Heart,
  Send,
  ChevronRight,
  LogIn,
  Sparkles,
  UserPlus,
  X,
  Edit2,
  LogOut,
  Moon,
  Sun,
  ShieldCheck,
  Globe,
  Ticket
} from 'lucide-react';

// --- MOCK DATA ---
const MOCK_USERS: User[] = [
  { id: 'u1', name: 'アリスン', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop&crop=faces' },
  { id: 'u2', name: 'ボブジ', avatar: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=150&h=150&fit=crop&crop=faces' },
  { id: 'u3', name: 'キャロル', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=faces' },
  { id: 'u4', name: 'デイビッド', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=faces' },
];

const MOCK_TRIPS: Trip[] = [
  {
    id: 't1',
    title: '京都 夏の古都巡り',
    dates: '2025/08/15 - 08/17',
    coverImage: '',
    members: [
        { ...MOCK_USERS[0], role: 'admin' },
        { ...MOCK_USERS[1], role: 'editor' },
        { ...MOCK_USERS[2], role: 'editor' }
    ],
    isSaved: true,
    status: 'upcoming',
    messages: [
      { id: 'm1', userId: 'u2', text: '新幹線の予約完了しました！', timestamp: '10:30' },
      { id: 'm2', userId: 'u1', text: 'ありがとう！ホテルの予約確認書もアップしておいたよ。', timestamp: '10:35' },
    ],
    events: [
        { id: 'e1', title: '京都駅集合', startTime: '10:00', location: '京都駅 中央改札', category: Category.Transport, date: '2025/08/15' },
        { id: 'e2', title: '錦市場で食べ歩き', startTime: '12:00', location: '錦市場', category: Category.Food, notes: 'だし巻き卵とタコ串は絶対食べる！', date: '2025/08/15' },
        { id: 'e3', title: '清水寺 参拝', startTime: '14:30', location: '清水寺', category: Category.Activity, date: '2025/08/15' },
        { id: 'e4', title: '旅館チェックイン', startTime: '17:00', location: '嵐山 旅館', category: Category.Lodging, date: '2025/08/15' },
        { id: 'e5', title: '金閣寺', startTime: '10:00', location: '金閣寺', category: Category.Activity, date: '2025/08/16' },
        { id: 'e6', title: 'お土産購入', startTime: '15:00', location: '京都駅', category: Category.Other, date: '2025/08/17' },
    ],
    expenses: [
        { id: 'x1', title: '新幹線代', amount: 42000, payerId: 'u2', category: Category.Transport, date: '08/01' },
        { id: 'x2', title: 'ランチ代', amount: 4500, payerId: 'u1', category: Category.Food, date: '08/15' },
    ],
    memories: [
        { id: 'mem1', url: '', caption: '清水寺の眺め最高！', userId: 'u1', date: '2025/08/15' },
        { id: 'mem2', url: '', caption: '抹茶パフェ美味しい〜', userId: 'u2', date: '2025/08/15' }
    ],
    bookings: [
        { id: 'b1', type: 'Flight', title: 'JAL 123 (東京 -> 大阪)', bookingNumber: 'JAL-X7Y8Z9', date: '2025/08/15', time: '08:00', notes: '窓側座席確保済み', attachments: [] },
        { id: 'b2', type: 'Hotel', title: '嵐山 温泉旅館', bookingNumber: 'H-998877', date: '2025/08/15', notes: '夕食19時から', attachments: [] }
    ]
  },
  {
    id: 't2',
    title: '沖縄 3泊4日',
    dates: '2025/11/02 - 11/05',
    coverImage: '',
    members: [
        { ...MOCK_USERS[0], role: 'admin' },
        { ...MOCK_USERS[1], role: 'editor' }
    ],
    isSaved: false,
    status: 'upcoming',
    messages: [],
    events: [],
    expenses: [],
    memories: [],
    bookings: []
  },
  {
    id: 't3',
    title: '北海道 雪まつり',
    dates: '2024/02/05 - 02/08',
    coverImage: '',
    members: [
        { ...MOCK_USERS[1], role: 'admin' },
        { ...MOCK_USERS[2], role: 'editor' },
        { ...MOCK_USERS[3], role: 'viewer' }
    ],
    isSaved: true,
    status: 'completed',
    messages: [],
    events: [],
    expenses: [],
    memories: [],
    bookings: []
  }
];

const MOCK_INVITATIONS: Invitation[] = [
    {
        id: 'inv1',
        tripId: 't_inv_1',
        tripTitle: '年末年始 韓国旅行',
        tripDates: '2025/12/30 - 2026/01/03',
        tripImage: '',
        inviter: MOCK_USERS[1],
        message: '一緒に行こう！'
    }
];

const UserAvatar = ({ user, size = "md" }: { user: User | TripMember, size?: "sm" | "md" | "lg" }) => {
    const sizeClasses = {
        sm: "w-6 h-6 text-[10px]",
        md: "w-8 h-8 text-xs",
        lg: "w-16 h-16 text-xl"
    };

    if (user.avatar) {
        return <img src={user.avatar} alt={user.name} className={`${sizeClasses[size]} rounded-full object-cover border border-gray-200 dark:border-gray-600 shadow-sm`} />;
    }

    return (
        <div className={`${sizeClasses[size]} rounded-full bg-mint-100 dark:bg-mint-900/30 text-mint-600 dark:text-mint-400 font-bold flex items-center justify-center border border-mint-200 dark:border-mint-800`}>
            {user.name.substring(0, 2).toUpperCase()}
        </div>
    );
};

const Toast = ({ title, message, onClose }: { title: string, message: string, onClose: () => void }) => {
    useEffect(() => {
        const timer = setTimeout(onClose, 5000);
        return () => clearTimeout(timer);
    }, [onClose]);

    return (
        <div className="fixed top-4 left-4 right-4 z-[100] animate-fade-in pointer-events-none flex justify-center">
            <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-md border border-mint-200 dark:border-gray-700 shadow-lg rounded-[24px] p-4 flex gap-4 max-w-sm w-full pointer-events-auto">
                <div className="w-10 h-10 bg-mint-400 rounded-full flex items-center justify-center flex-shrink-0 text-white">
                    <Bell size={20} />
                </div>
                <div className="flex-1">
                    <h4 className="font-bold text-gray-800 dark:text-white text-sm">{title}</h4>
                    <p className="text-xs text-gray-500 dark:text-gray-300 mt-1">{message}</p>
                </div>
                <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><X size={16}/></button>
            </div>
        </div>
    );
};

const BackBtn = ({ onClick }: { onClick: () => void }) => (
  <div className="fixed bottom-8 left-6 z-50">
     <button onClick={onClick} className="w-14 h-14 rounded-full bg-gray-800/10 dark:bg-white/10 backdrop-blur-md border border-gray-800/10 dark:border-white/20 text-gray-800 dark:text-white flex items-center justify-center hover:bg-gray-800/20 dark:hover:bg-white/20 transition-all shadow-lg">
         <ArrowLeft size={24} />
     </button>
  </div>
);

const AuthLayout = ({ title, children, onBack }: { title: string, children?: React.ReactNode, onBack: () => void }) => (
    <div className="min-h-screen bg-ivory dark:bg-gray-900 flex items-center justify-center p-6 relative">
       <div className="w-full max-w-md animate-fade-in relative z-10">
           <div className="bg-white dark:bg-gray-800 p-8 rounded-[40px] shadow-xl border border-gray-100 dark:border-gray-700 relative overflow-hidden">
               <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-mint-300 to-peach-300"></div>
               <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-8 text-center">{title}</h2>
               {children}
           </div>
       </div>
       <BackBtn onClick={onBack} />
    </div>
);

export default function App() {
  // --- STATE ---
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isGuestView, setIsGuestView] = useState(false);
  const [viewState, setViewState] = useState<ViewState>('DASHBOARD');
  const [activeTripId, setActiveTripId] = useState<string | null>(null);
  const [trips, setTrips] = useState<Trip[]>(MOCK_TRIPS);
  const [invitations, setInvitations] = useState<Invitation[]>(MOCK_INVITATIONS);
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [showToast, setShowToast] = useState<{title: string, message: string} | null>(null);
  
  // Dashboard Tabs
  const [dashboardTab, setDashboardTab] = useState<DashboardTabState>('HOME');
  
  // Trip Tabs
  const [activeTab, setActiveTab] = useState<TripTabState>('TIMELINE');

  // Modals
  const [isCreateTripModalOpen, setIsCreateTripModalOpen] = useState(false);
  const [isJoinModalOpen, setIsJoinModalOpen] = useState(false);
  const [isMemberModalOpen, setIsMemberModalOpen] = useState(false);
  const [isEditProfileModalOpen, setIsEditProfileModalOpen] = useState(false);
  
  // Inputs
  const [newTripData, setNewTripData] = useState({ title: '', startDate: '', endDate: '' });
  const [joinInput, setJoinInput] = useState('');
  const [chatInput, setChatInput] = useState('');
  const [editNameInput, setEditNameInput] = useState('');

  // Settings
  const [language, setLanguage] = useState<Language>('ja');
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Auth Flow
  const [authStep, setAuthStep] = useState<'WELCOME' | 'LOGIN' | 'REGISTER' | 'VERIFY_EMAIL' | 'SETUP_PROFILE'>('WELCOME');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [displayName, setDisplayName] = useState('');

  // --- LOCALIZATION ---
  const TEXT = {
    ja: {
        welcome: 'Welcome to TripLink',
        desc: '仲間との旅を、もっと自由に、もっと楽しく。',
        login: 'ログイン',
        guest: 'ゲストでログイン',
        register: '新規アカウント作成',
        email: 'メールアドレス',
        pass: 'パスワード',
        confirmPass: 'パスワード (確認)',
        otp: '認証コード',
        otpDesc: 'メールに送信された6桁のコードを入力してください',
        verify: '認証する',
        setupProfile: 'プロフィール設定',
        name: '表示名',
        start: '始める',
        back: '戻る',
        top: 'トップに戻る',
        home: 'ホーム',
        search: '検索',
        notif: '通知',
        profile: 'マイページ',
        tabTrips: '進行中',
        tabPast: '完了',
        tabInvites: '招待待ち',
        tabSaved: '保存',
        newTrip: '新しい冒険',
        joinTrip: '旅行に参加',
        noTrips: '予定されている旅行はありません',
        planNew: '新しい旅行を計画する',
        createTrip: '旅行を作成',
        tripTitle: '旅行のタイトル',
        startDate: '開始日',
        endDate: '終了日',
        create: '作成',
        join: '参加',
        linkPlaceholder: '招待リンクまたはコード',
        tabTimeline: '旅程',
        tabCalendar: 'カレンダー',
        tabMap: '地図',
        tabWallet: '財布',
        tabBoard: '掲示板',
        tabMemories: '思い出',
        tabBookings: '予約',
        editProfile: 'プロフィール編集',
        save: '保存',
        cancel: 'キャンセル',
        darkMode: 'ダークモード',
        language: 'Language',
        logout: 'ログアウト',
        testNotif: '通知テスト',
        testNotifTitle: '通知テスト',
        testNotifMsg: '通知は正常に動作しています！',
        chatReply: '自動返信',
        chatReplyMsg: '了解です！楽しみですね！',
        reminderTitle: '予定のリマインダー',
        reminderMsg: (title: string, time: string) => `「${title}」が ${time} から始まります`,
        todayPlan: '今日の予定',
        todayPlanMsg: (count: number) => `今日は ${count} 件の予定があります。`,
        inviteAccept: '承認',
        inviteDecline: '拒否'
    },
    en: {
        welcome: 'Welcome to TripLink',
        desc: 'Plan together, travel together.',
        login: 'Log In',
        guest: 'Guest Login',
        register: 'Create Account',
        email: 'Email',
        pass: 'Password',
        confirmPass: 'Confirm Password',
        otp: 'Verification Code',
        otpDesc: 'Enter the 6-digit code sent to your email',
        verify: 'Verify',
        setupProfile: 'Setup Profile',
        name: 'Display Name',
        start: 'Get Started',
        back: 'Back',
        top: 'Back to Top',
        home: 'Home',
        search: 'Search',
        notif: 'Notifications',
        profile: 'Profile',
        tabTrips: 'Upcoming',
        tabPast: 'Completed',
        tabInvites: 'Invites',
        tabSaved: 'Saved',
        newTrip: 'New Adventure',
        joinTrip: 'Join Trip',
        noTrips: 'No upcoming trips',
        planNew: 'Plan a New Trip',
        createTrip: 'Create Trip',
        tripTitle: 'Trip Title',
        startDate: 'Start Date',
        endDate: 'End Date',
        create: 'Create',
        join: 'Join',
        linkPlaceholder: 'Invite Link or Code',
        tabTimeline: 'Timeline',
        tabCalendar: 'Calendar',
        tabMap: 'Map',
        tabWallet: 'Wallet',
        tabBoard: 'Board',
        tabMemories: 'Memories',
        tabBookings: 'Bookings',
        editProfile: 'Edit Profile',
        save: 'Save',
        cancel: 'Cancel',
        darkMode: 'Dark Mode',
        language: '言語',
        logout: 'Log Out',
        testNotif: 'Test Notification',
        testNotifTitle: 'Notification Test',
        testNotifMsg: 'Notifications are working correctly!',
        chatReply: 'Auto Reply',
        chatReplyMsg: 'Sounds good! Can\'t wait!',
        reminderTitle: 'Event Reminder',
        reminderMsg: (title: string, time: string) => `"${title}" starts at ${time}`,
        todayPlan: 'Today\'s Plan',
        todayPlanMsg: (count: number) => `You have ${count} events today.`,
        inviteAccept: 'Accept',
        inviteDecline: 'Decline'
    }
  };
  const t = TEXT[language];

  // --- EFFECTS ---
  useEffect(() => {
    if (isDarkMode) {
        document.documentElement.classList.add('dark');
    } else {
        document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  // Notifications Logic
  const addNotification = (title: string, message: string, type: 'system' | 'message' = 'system') => {
      const newNotif: AppNotification = {
          id: Math.random().toString(36).substr(2, 9),
          title,
          message,
          timestamp: new Date().toLocaleTimeString(),
          isRead: false,
          type
      };
      setNotifications(prev => [newNotif, ...prev]);
      setShowToast({ title, message });
      
      // Native Browser Notification
      if (Notification.permission === 'granted') {
          new Notification(title, { body: message });
      }
  };

  const handleTestNotification = () => {
    Notification.requestPermission().then(permission => {
        if (permission === 'granted') {
            addNotification(t.testNotifTitle, t.testNotifMsg);
            
            // Simulation: Receive a message 3 seconds later
            setTimeout(() => {
                addNotification(t.chatReply, t.chatReplyMsg, 'message');
            }, 3000);
        }
    });
  };

  // Reminder Check (Every minute)
  useEffect(() => {
    const interval = setInterval(() => {
        const now = new Date();
        const currentStr = now.toLocaleDateString('ja-JP', { year: 'numeric', month: '2-digit', day: '2-digit' }).replace(/\//g, '/');
        const currentTime = now.getHours() * 60 + now.getMinutes();

        trips.forEach(trip => {
            if (trip.status === 'completed') return;
            trip.events.forEach(event => {
                if (event.date === currentStr) {
                    const [h, m] = event.startTime.split(':').map(Number);
                    const eventTime = h * 60 + m;
                    const diff = eventTime - currentTime;

                    // 15 min, 30 min, 60 min, or 0 min (Start now)
                    if ([0, 15, 30, 60].includes(diff)) {
                         addNotification(t.reminderTitle, t.reminderMsg(event.title, event.startTime));
                    }
                }
            });
        });
    }, 60000); // Check every minute

    return () => clearInterval(interval);
  }, [trips, t]);

  // --- AUTH HANDLERS ---
  const handleLogin = () => { setCurrentUser(MOCK_USERS[0]); };
  const handleGuestLogin = () => { setCurrentUser(MOCK_USERS[0]); setIsGuestView(false); };
  const handleLogout = () => { 
      setCurrentUser(null); 
      setIsGuestView(false); 
      setViewState('DASHBOARD'); 
      setAuthStep('WELCOME'); 
  };
  const handleStartRegistration = () => { setAuthStep('REGISTER'); };
  const handleRegister = () => { 
      if (!email || !password || password !== confirmPassword) return alert("Please check inputs");
      setAuthStep('VERIFY_EMAIL'); 
  };
  const handleVerifyOtp = () => { if (otp.length === 6) setAuthStep('SETUP_PROFILE'); };
  const handleCompleteSetup = () => { 
      setCurrentUser({ id: 'new_u', name: displayName, avatar: '' }); 
      setViewState('DASHBOARD'); 
  };
  const handleShareLinkLogin = (tripId: string) => {
      setIsGuestView(true);
      setActiveTripId(tripId);
      setViewState('TRIP_DETAIL');
  };

  // --- TRIP HANDLERS ---
  const handleCreateTrip = () => {
      const newTrip: Trip = {
          id: Math.random().toString(36).substr(2, 9),
          title: newTripData.title,
          dates: `${newTripData.startDate.replace(/-/g, '/')} - ${newTripData.endDate.replace(/-/g, '/')}`,
          coverImage: '',
          members: [{ ...(currentUser || MOCK_USERS[0]), role: 'admin' }],
          events: [], expenses: [], messages: [], memories: [], bookings: [],
          status: 'upcoming', isSaved: false
      };
      setTrips([newTrip, ...trips]);
      setIsCreateTripModalOpen(false);
      setActiveTripId(newTrip.id);
      setViewState('TRIP_DETAIL');
  };

  const handleJoinTrip = () => {
      const foundTrip = trips.find(t => t.id === joinInput || joinInput.includes(t.id));
      if (foundTrip && currentUser) {
         const updatedTrip = { ...foundTrip, members: [...foundTrip.members, { ...currentUser, role: 'editor' as const }] };
         setTrips(trips.map(t => t.id === foundTrip.id ? updatedTrip : t));
         setActiveTripId(foundTrip.id);
         setViewState('TRIP_DETAIL');
         setIsJoinModalOpen(false);
      } else {
          alert("Invalid Link");
      }
  };

  const handleToggleSave = (e: React.MouseEvent, tripId: string) => {
      e.stopPropagation();
      setTrips(trips.map(t => t.id === tripId ? { ...t, isSaved: !t.isSaved } : t));
  };

  const handleAcceptInvite = (invite: Invitation) => {
      const newTrip: Trip = {
          id: invite.tripId,
          title: invite.tripTitle,
          dates: invite.tripDates,
          coverImage: invite.tripImage,
          members: [{ ...(currentUser || MOCK_USERS[0]), role: 'editor' }],
          events: [], expenses: [], messages: [], memories: [], bookings: [],
          status: 'upcoming'
      };
      setTrips([newTrip, ...trips]);
      setInvitations(invitations.filter(i => i.id !== invite.id));
  };

  const handleUpdateProfile = () => {
      if(currentUser && editNameInput) {
          const updatedUser = { ...currentUser, name: editNameInput };
          setCurrentUser(updatedUser);
          setTrips(trips.map(t => ({
              ...t,
              members: t.members.map(m => m.id === currentUser.id ? { ...m, name: editNameInput } : m)
          })));
          setIsEditProfileModalOpen(false);
      }
  };

  // --- SUB-COMPONENT HANDLERS ---
  const getActiveTrip = () => trips.find(t => t.id === activeTripId);
  const activeTrip = getActiveTrip();
  const isReadOnly = !currentUser && isGuestView;
  
  const canEditTrip = () => {
      if (!currentUser || !activeTrip) return false;
      const member = activeTrip.members.find(m => m.id === currentUser.id);
      return member?.role === 'admin' || member?.role === 'editor';
  };

  const updateTripData = (updater: (t: Trip) => Trip) => {
      if (!activeTrip) return;
      setTrips(trips.map(t => t.id === activeTripId ? updater(t) : t));
  };

  // --- RENDER HELPERS ---
  const renderAuthScreen = () => {
      if (authStep === 'WELCOME') {
          return (
              <div className="min-h-screen bg-mint-400 dark:bg-gray-900 flex items-center justify-center p-6 relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
                      <div className="absolute top-20 left-10 w-64 h-64 bg-white rounded-full mix-blend-overlay filter blur-3xl animate-pulse"></div>
                      <div className="absolute bottom-20 right-10 w-96 h-96 bg-peach-300 rounded-full mix-blend-overlay filter blur-3xl animate-pulse delay-1000"></div>
                  </div>
                  
                  <div className="z-10 w-full max-w-md flex flex-col items-center text-center animate-fade-in">
                      <div className="w-24 h-24 bg-white rounded-[32px] mb-8 flex items-center justify-center shadow-xl rotate-3 transform hover:rotate-6 transition-transform">
                          <Compass size={48} className="text-mint-400" />
                      </div>
                      <h1 className="text-4xl font-bold text-white mb-4 tracking-tight">TripLink</h1>
                      <p className="text-mint-50 text-lg mb-12 font-light">{t.desc}</p>
                      
                      <div className="w-full max-w-xs space-y-4">
                          <button onClick={() => setAuthStep('LOGIN')} className="w-full bg-white text-mint-500 py-4 rounded-full font-bold shadow-lg hover:shadow-xl hover:scale-105 transition-all flex items-center justify-center gap-2">
                              <LogIn size={20} /> {t.login}
                          </button>
                          <button onClick={handleStartRegistration} className="w-full bg-mint-500 text-white py-4 rounded-full font-bold border border-mint-300 shadow-lg hover:bg-mint-600 transition-all flex items-center justify-center gap-2">
                              <UserPlus size={20} /> {t.register}
                          </button>
                          <div className="h-px bg-mint-300 w-full my-4"></div>
                          <button onClick={handleGuestLogin} className="w-full bg-transparent text-white py-4 rounded-full font-bold border-2 border-white/30 hover:bg-white/10 transition-colors">
                              {t.guest}
                          </button>
                          <button onClick={() => setIsJoinModalOpen(true)} className="text-white/80 text-sm hover:text-white underline decoration-dashed underline-offset-4">
                              共有リンクをお持ちの方はこちら
                          </button>
                      </div>
                  </div>

                   {isJoinModalOpen && (
                      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-6">
                          <div className="bg-white dark:bg-gray-800 w-full max-w-sm rounded-[32px] p-8 shadow-2xl">
                              <h3 className="font-bold text-xl mb-4 text-gray-800 dark:text-white">共有リンクを開く</h3>
                              <input 
                                  value={joinInput} 
                                  onChange={e => setJoinInput(e.target.value)} 
                                  placeholder="Trip ID (e.g. t1)" 
                                  className="w-full bg-gray-100 dark:bg-gray-700 dark:text-white p-4 rounded-2xl mb-4 outline-none" 
                              />
                              <div className="flex gap-4">
                                  <button onClick={() => setIsJoinModalOpen(false)} className="flex-1 py-3 rounded-full text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700">{t.cancel}</button>
                                  <button onClick={() => handleShareLinkLogin(joinInput)} className="flex-1 py-3 rounded-full bg-mint-400 text-white font-bold shadow-sm">{t.join}</button>
                              </div>
                          </div>
                      </div>
                  )}
              </div>
          );
      }
      
      if (authStep === 'LOGIN') {
          return (
              <AuthLayout title={t.login} onBack={() => setAuthStep('WELCOME')}>
                  <div className="space-y-4">
                      <input type="email" placeholder={t.email} value={email} onChange={e => setEmail(e.target.value)} className="w-full bg-gray-50 dark:bg-gray-700 dark:text-white p-4 rounded-2xl outline-none focus:ring-2 ring-mint-200 transition-all" />
                      <input type="password" placeholder={t.pass} value={password} onChange={e => setPassword(e.target.value)} className="w-full bg-gray-50 dark:bg-gray-700 dark:text-white p-4 rounded-2xl outline-none focus:ring-2 ring-mint-200 transition-all" />
                      <button onClick={handleLogin} className="w-full bg-mint-400 text-white py-4 rounded-full font-bold shadow-md hover:bg-mint-500 hover:shadow-lg transition-all">{t.login}</button>
                  </div>
              </AuthLayout>
          );
      }

      if (authStep === 'REGISTER') {
           return (
              <AuthLayout title={t.register} onBack={() => setAuthStep('WELCOME')}>
                  <div className="space-y-4">
                      <input type="email" placeholder={t.email} value={email} onChange={e => setEmail(e.target.value)} className="w-full bg-gray-50 dark:bg-gray-700 dark:text-white p-4 rounded-2xl outline-none focus:ring-2 ring-mint-200" />
                      <input type="password" placeholder={t.pass} value={password} onChange={e => setPassword(e.target.value)} className="w-full bg-gray-50 dark:bg-gray-700 dark:text-white p-4 rounded-2xl outline-none focus:ring-2 ring-mint-200" />
                      <input type="password" placeholder={t.confirmPass} value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} className="w-full bg-gray-50 dark:bg-gray-700 dark:text-white p-4 rounded-2xl outline-none focus:ring-2 ring-mint-200" />
                      <button onClick={handleRegister} className="w-full bg-mint-400 text-white py-4 rounded-full font-bold shadow-md hover:bg-mint-500 transition-all">{t.start}</button>
                  </div>
              </AuthLayout>
          );
      }

      if (authStep === 'VERIFY_EMAIL') {
           return (
              <AuthLayout title={t.otp} onBack={() => setAuthStep('WELCOME')}>
                  <p className="text-center text-gray-500 dark:text-gray-400 mb-6 text-sm">{t.otpDesc}</p>
                  <div className="space-y-6">
                      <input type="text" maxLength={6} placeholder="000000" value={otp} onChange={e => setOtp(e.target.value)} className="w-full text-center text-3xl tracking-[0.5em] font-mono bg-gray-50 dark:bg-gray-700 dark:text-white p-4 rounded-2xl outline-none focus:ring-2 ring-mint-200" />
                      <button onClick={handleVerifyOtp} className="w-full bg-mint-400 text-white py-4 rounded-full font-bold shadow-md hover:bg-mint-500 transition-all">{t.verify}</button>
                  </div>
              </AuthLayout>
          );
      }

      if (authStep === 'SETUP_PROFILE') {
           return (
              <AuthLayout title={t.setupProfile} onBack={() => setAuthStep('WELCOME')}>
                  <div className="space-y-4">
                      <div className="w-24 h-24 bg-gray-100 dark:bg-gray-700 rounded-full mx-auto mb-4 flex items-center justify-center text-gray-400 border-2 border-dashed border-gray-300 dark:border-gray-600">
                          <ImageIcon size={32} />
                      </div>
                      <input type="text" placeholder={t.name} value={displayName} onChange={e => setDisplayName(e.target.value)} className="w-full bg-gray-50 dark:bg-gray-700 dark:text-white p-4 rounded-2xl outline-none focus:ring-2 ring-mint-200" />
                      <button onClick={handleCompleteSetup} className="w-full bg-mint-400 text-white py-4 rounded-full font-bold shadow-md hover:bg-mint-500 transition-all">{t.start}</button>
                  </div>
              </AuthLayout>
          );
      }
      return null;
  };

  if (!currentUser && !isGuestView) {
      return (
          <>
            {showToast && <Toast title={showToast.title} message={showToast.message} onClose={() => setShowToast(null)} />}
            {renderAuthScreen()}
          </>
      );
  }

  // --- MAIN APP ---
  if (viewState === 'DASHBOARD') {
      return (
        <div className="min-h-screen bg-ivory dark:bg-gray-900 pb-24">
             {showToast && <Toast title={showToast.title} message={showToast.message} onClose={() => setShowToast(null)} />}
             
             {/* Header */}
             <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md sticky top-0 z-40 border-b border-gray-100 dark:border-gray-700">
                 <div className="px-6 py-4 flex justify-between items-center">
                     <h1 className="text-2xl font-bold text-gray-800 dark:text-white flex items-center gap-2">
                         <Compass className="text-mint-400" /> TripLink
                     </h1>
                     {currentUser && <div onClick={() => setDashboardTab('PROFILE')}><UserAvatar user={currentUser} /></div>}
                 </div>
                 
                 {/* Top Tabs (Reduced) */}
                 <div className="px-8 pb-4 pt-2 overflow-x-auto no-scrollbar flex gap-1">
                    {[
                        {id: 'COMPLETED', label: t.tabPast},
                        {id: 'INVITATIONS', label: t.tabInvites, count: invitations.length},
                    ].map((tab) => (
                        <button 
                           key={tab.id}
                           onClick={() => setDashboardTab(tab.id as DashboardTabState)}
                           className={`px-5 py-2.5 rounded-full text-sm font-bold whitespace-nowrap transition-all flex items-center gap-2 ${dashboardTab === tab.id ? 'bg-gray-800 text-white dark:bg-white dark:text-gray-900 shadow-md' : 'text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'}`}
                        >
                            {tab.label}
                            {tab.count !== undefined && tab.count > 0 && <span className="bg-red-500 text-white text-[10px] px-1.5 py-0.5 rounded-full">{tab.count}</span>}
                        </button>
                    ))}
                 </div>
             </div>

             <div className="p-6 animate-fade-in">
                 {dashboardTab === 'HOME' && (
                     <>
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-bold text-gray-800 dark:text-white">{t.tabTrips}</h2>
                            <button onClick={() => setIsCreateTripModalOpen(true)} className="bg-mint-400 hover:bg-mint-500 text-white px-5 py-2.5 rounded-full font-bold shadow-md hover:shadow-lg transition-all flex items-center gap-2">
                                <Plus size={20} strokeWidth={2.5} />
                                <span>{t.createTrip}</span>
                            </button>
                        </div>

                        {trips.filter(t => t.status === 'upcoming').length === 0 ? (
                            <div className="text-center py-20 bg-white dark:bg-gray-800 rounded-[32px] border border-dashed border-gray-300 dark:border-gray-700">
                                <div className="w-20 h-20 bg-gray-50 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-300">
                                    <MapIcon size={32} />
                                </div>
                                <p className="text-gray-400 font-medium mb-6">{t.noTrips}</p>
                                <button onClick={() => setIsCreateTripModalOpen(true)} className="bg-mint-400 text-white px-8 py-3 rounded-full font-bold shadow-lg hover:bg-mint-500">{t.planNew}</button>
                            </div>
                        ) : (
                            <div className="grid gap-6">
                                {trips.filter(t => t.status === 'upcoming').map(trip => (
                                    <div key={trip.id} onClick={() => { setActiveTripId(trip.id); setViewState('TRIP_DETAIL'); }} className="bg-white dark:bg-gray-800 rounded-[32px] p-6 shadow-sm border border-gray-100 dark:border-gray-700 relative overflow-hidden group hover:shadow-lg transition-all cursor-pointer">
                                        <div className="flex justify-between items-start mb-8">
                                            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl font-bold ${trip.id === 't1' ? 'bg-peach-100 text-peach-500' : 'bg-mint-100 text-mint-500'}`}>
                                                {trip.title.substring(0, 1)}
                                            </div>
                                            <button onClick={(e) => handleToggleSave(e, trip.id)} className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${trip.isSaved ? 'text-pink-500 bg-pink-50 dark:bg-pink-900/20' : 'text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'}`}>
                                                <Heart size={20} fill={trip.isSaved ? "currentColor" : "none"} />
                                            </button>
                                        </div>
                                        <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-1 line-clamp-1">{trip.title}</h3>
                                        <div className="flex justify-between items-end mt-4">
                                            <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400 text-sm font-medium bg-gray-50 dark:bg-gray-700 px-3 py-1 rounded-full">
                                                <Calendar size={14} />
                                                {trip.dates.split(' - ')[0]}
                                            </div>
                                            <div className="flex -space-x-2">
                                                {trip.members.map((m, i) => (
                                                    <div key={i} className="ring-2 ring-white dark:ring-gray-800 rounded-full">
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

                 {dashboardTab === 'COMPLETED' && (
                     <div className="space-y-4">
                         {trips.filter(t => t.status === 'completed').map(trip => (
                            <div key={trip.id} onClick={() => { setActiveTripId(trip.id); setViewState('TRIP_DETAIL'); }} className="bg-gray-50 dark:bg-gray-800 rounded-[24px] p-6 border border-gray-200 dark:border-gray-700 grayscale hover:grayscale-0 transition-all cursor-pointer opacity-75 hover:opacity-100">
                                <div className="flex justify-between items-center mb-2">
                                    <h3 className="font-bold text-gray-700 dark:text-white">{trip.title}</h3>
                                    <span className="text-[10px] bg-gray-200 dark:bg-gray-600 text-gray-500 dark:text-gray-300 px-2 py-1 rounded-full font-bold">{t.tabPast}</span>
                                </div>
                                <p className="text-sm text-gray-400">{trip.dates}</p>
                            </div>
                         ))}
                     </div>
                 )}

                 {dashboardTab === 'INVITATIONS' && (
                     <div className="space-y-4">
                         {invitations.length === 0 ? <p className="text-center text-gray-400 mt-10">No pending invitations</p> : invitations.map(inv => (
                             <div key={inv.id} className="bg-white dark:bg-gray-800 rounded-[24px] p-6 shadow-sm border border-gray-100 dark:border-gray-700">
                                 <div className="flex items-center gap-4 mb-4">
                                     <UserAvatar user={inv.inviter} />
                                     <div>
                                         <p className="text-sm text-gray-500 dark:text-gray-400"><span className="font-bold text-gray-800 dark:text-white">{inv.inviter.name}</span> invited you to</p>
                                         <h3 className="font-bold text-lg text-gray-800 dark:text-white">{inv.tripTitle}</h3>
                                     </div>
                                 </div>
                                 <div className="flex gap-2">
                                     <button onClick={() => handleAcceptInvite(inv)} className="flex-1 bg-mint-400 text-white py-2 rounded-xl font-bold text-sm shadow-sm">{t.inviteAccept}</button>
                                     <button className="flex-1 bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-300 py-2 rounded-xl font-bold text-sm">{t.inviteDecline}</button>
                                 </div>
                             </div>
                         ))}
                     </div>
                 )}

                 {dashboardTab === 'NOTIFICATIONS' && (
                     <div className="space-y-4">
                         {notifications.length === 0 ? (
                             <div className="text-center py-20 text-gray-400">No notifications</div>
                         ) : (
                             notifications.map(n => (
                                 <div key={n.id} className={`p-4 rounded-2xl flex gap-4 ${n.isRead ? 'bg-gray-50 dark:bg-gray-800' : 'bg-white dark:bg-gray-700 shadow-sm border border-mint-100 dark:border-gray-600'}`}>
                                     <div className={`w-2 h-2 rounded-full mt-2 ${n.isRead ? 'bg-gray-300' : 'bg-mint-400'}`}></div>
                                     <div>
                                         <h4 className="font-bold text-sm text-gray-800 dark:text-white">{n.title}</h4>
                                         <p className="text-xs text-gray-500 dark:text-gray-300 mt-1">{n.message}</p>
                                         <p className="text-[10px] text-gray-400 mt-2">{n.timestamp}</p>
                                     </div>
                                 </div>
                             ))
                         )}
                     </div>
                 )}

                 {dashboardTab === 'PROFILE' && currentUser && (
                     <div className="space-y-6">
                         <div className="bg-white dark:bg-gray-800 rounded-[32px] p-8 text-center border border-gray-100 dark:border-gray-700 relative">
                             <div className="absolute top-4 right-4">
                                 <button onClick={() => { setEditNameInput(currentUser.name); setIsEditProfileModalOpen(true); }} className="p-2 bg-gray-50 dark:bg-gray-700 rounded-full text-gray-400 hover:text-mint-500">
                                     <Edit2 size={16} />
                                 </button>
                             </div>
                             <div className="inline-block p-1 rounded-full border-2 border-mint-100 dark:border-mint-900 mb-4">
                                 <UserAvatar user={currentUser} size="lg" />
                             </div>
                             <h2 className="text-xl font-bold text-gray-800 dark:text-white">{currentUser.name}</h2>
                             <p className="text-gray-400 text-sm">@{currentUser.id}</p>
                         </div>

                         <div className="bg-white dark:bg-gray-800 rounded-[32px] p-6 border border-gray-100 dark:border-gray-700 space-y-2">
                             <div className="flex justify-between items-center p-3 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-xl cursor-pointer">
                                 <div className="flex items-center gap-3 text-gray-600 dark:text-gray-300">
                                     {isDarkMode ? <Moon size={20} /> : <Sun size={20} />}
                                     <span className="font-medium">{t.darkMode}</span>
                                 </div>
                                 <div onClick={() => setIsDarkMode(!isDarkMode)} className={`w-12 h-7 rounded-full p-1 transition-colors ${isDarkMode ? 'bg-mint-400' : 'bg-gray-200'}`}>
                                     <div className={`w-5 h-5 bg-white rounded-full shadow-sm transition-transform ${isDarkMode ? 'translate-x-5' : ''}`}></div>
                                 </div>
                             </div>
                             <div className="flex justify-between items-center p-3 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-xl cursor-pointer">
                                 <div className="flex items-center gap-3 text-gray-600 dark:text-gray-300">
                                     <Globe size={20} />
                                     <span className="font-medium">{t.language}</span>
                                 </div>
                                 <button onClick={() => setLanguage(l => l === 'ja' ? 'en' : 'ja')} className="text-xs font-bold bg-gray-100 dark:bg-gray-600 px-3 py-1 rounded-full">
                                     {language === 'ja' ? '日本語' : 'English'}
                                 </button>
                             </div>
                             <div className="flex justify-between items-center p-3 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-xl cursor-pointer" onClick={handleTestNotification}>
                                 <div className="flex items-center gap-3 text-gray-600 dark:text-gray-300">
                                     <Bell size={20} />
                                     <span className="font-medium">{t.testNotif}</span>
                                 </div>
                                 <ChevronRight size={16} className="text-gray-300" />
                             </div>
                         </div>
                         
                         <button onClick={handleLogout} className="w-full py-4 rounded-2xl text-red-500 font-bold bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/40 transition-colors flex items-center justify-center gap-2">
                             <LogOut size={20} /> {t.logout}
                         </button>
                     </div>
                 )}
             </div>

             {/* Bottom Navigation */}
             <div className="fixed bottom-0 w-full bg-white dark:bg-gray-800 border-t border-gray-100 dark:border-gray-700 px-8 py-4 flex justify-between items-center z-40 pb-8">
                 <button onClick={() => setDashboardTab('HOME')} className={`flex flex-col items-center gap-1 ${dashboardTab === 'HOME' ? 'text-mint-500' : 'text-gray-300 dark:text-gray-600'}`}>
                     <Home size={24} fill={dashboardTab === 'HOME' ? "currentColor" : "none"} />
                 </button>
                 <button onClick={() => setDashboardTab('SEARCH')} className={`flex flex-col items-center gap-1 ${dashboardTab === 'SEARCH' ? 'text-mint-500' : 'text-gray-300 dark:text-gray-600'}`}>
                     <Search size={24} />
                 </button>
                 <button onClick={() => { setDashboardTab('NOTIFICATIONS'); setNotifications(prev => prev.map(n => ({...n, isRead: true}))); }} className={`flex flex-col items-center gap-1 relative ${dashboardTab === 'NOTIFICATIONS' ? 'text-mint-500' : 'text-gray-300 dark:text-gray-600'}`}>
                     <Bell size={24} fill={dashboardTab === 'NOTIFICATIONS' ? "currentColor" : "none"} />
                     {notifications.filter(n => !n.isRead).length > 0 && <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white dark:border-gray-800"></span>}
                 </button>
                 <button onClick={() => setDashboardTab('PROFILE')} className={`flex flex-col items-center gap-1 ${dashboardTab === 'PROFILE' ? 'text-mint-500' : 'text-gray-300 dark:text-gray-600'}`}>
                     {currentUser ? <UserAvatar user={currentUser} size="sm" /> : <UserIcon size={24} />}
                 </button>
             </div>

             {/* Modals */}
             {isCreateTripModalOpen && (
                 <div className="fixed inset-0 bg-white/95 dark:bg-gray-900/95 backdrop-blur-md z-50 p-8 flex flex-col animate-fade-in">
                     <div className="flex justify-between items-center mb-8">
                         <h2 className="text-2xl font-bold text-gray-800 dark:text-white">{t.createTrip}</h2>
                         <button onClick={() => setIsCreateTripModalOpen(false)} className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center"><X size={20}/></button>
                     </div>
                     <div className="space-y-6 flex-1">
                         <div>
                             <label className="block text-sm font-bold text-gray-400 mb-2">{t.tripTitle}</label>
                             <input value={newTripData.title} onChange={e => setNewTripData({...newTripData, title: e.target.value})} className="w-full bg-ivory dark:bg-gray-800 dark:text-white p-5 rounded-2xl text-lg font-bold outline-none focus:ring-2 ring-mint-200" placeholder="e.g. Summer Vacation" />
                         </div>
                         <div className="grid grid-cols-2 gap-4">
                             <div>
                                 <label className="block text-sm font-bold text-gray-400 mb-2">{t.startDate}</label>
                                 <input type="date" value={newTripData.startDate} onChange={e => setNewTripData({...newTripData, startDate: e.target.value})} className="w-full bg-ivory dark:bg-gray-800 dark:text-white p-4 rounded-2xl outline-none" />
                             </div>
                             <div>
                                 <label className="block text-sm font-bold text-gray-400 mb-2">{t.endDate}</label>
                                 <input type="date" value={newTripData.endDate} onChange={e => setNewTripData({...newTripData, endDate: e.target.value})} className="w-full bg-ivory dark:bg-gray-800 dark:text-white p-4 rounded-2xl outline-none" />
                             </div>
                         </div>
                     </div>
                     <button onClick={handleCreateTrip} className="w-full bg-mint-400 text-white py-5 rounded-full font-bold text-lg shadow-xl hover:bg-mint-500 transition-all">{t.create}</button>
                 </div>
             )}

             {isEditProfileModalOpen && (
                 <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[60] flex items-center justify-center p-6">
                     <div className="bg-white dark:bg-gray-800 w-full max-w-sm rounded-[32px] p-8 shadow-2xl">
                         <h3 className="font-bold text-xl mb-4 text-gray-800 dark:text-white">{t.editProfile}</h3>
                         <input value={editNameInput} onChange={e => setEditNameInput(e.target.value)} className="w-full bg-gray-100 dark:bg-gray-700 dark:text-white p-4 rounded-2xl mb-6 outline-none" placeholder={t.name} />
                         <div className="flex gap-4">
                             <button onClick={() => setIsEditProfileModalOpen(false)} className="flex-1 py-3 rounded-full text-gray-500">{t.cancel}</button>
                             <button onClick={handleUpdateProfile} className="flex-1 py-3 rounded-full bg-mint-400 text-white font-bold">{t.save}</button>
                         </div>
                     </div>
                 </div>
             )}
        </div>
      );
  }

  // --- TRIP DETAIL VIEW ---
  if (!activeTrip) return null;

  return (
    <div className="min-h-screen bg-ivory dark:bg-gray-900 pb-24 relative">
       {showToast && <Toast title={showToast.title} message={showToast.message} onClose={() => setShowToast(null)} />}
       
       {/* Trip Header */}
       <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-md sticky top-0 z-30 border-b border-gray-100 dark:border-gray-700">
           <div className="px-6 py-4 flex justify-between items-center">
               <div className="flex items-center gap-4">
                   <h1 className="text-xl font-bold text-gray-800 dark:text-white line-clamp-1">{activeTrip.title}</h1>
               </div>
               <div className="flex gap-3">
                   <button className="w-10 h-10 rounded-full bg-gray-50 dark:bg-gray-700 flex items-center justify-center text-gray-400"><Share2 size={20}/></button>
                   <button onClick={() => setIsMemberModalOpen(true)} className="w-10 h-10 rounded-full bg-gray-50 dark:bg-gray-700 flex items-center justify-center text-gray-400 relative">
                       <Users size={20}/>
                       <span className="absolute -top-1 -right-1 bg-mint-400 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center">{activeTrip.members.length}</span>
                   </button>
               </div>
           </div>

           {/* Tab Navigation */}
           <div className="px-6 pb-2 overflow-x-auto no-scrollbar flex gap-6">
              {[
                {id: 'TIMELINE', icon: Compass, label: t.tabTimeline},
                {id: 'CALENDAR', icon: Calendar, label: t.tabCalendar},
                {id: 'BOOKINGS', icon: Ticket, label: t.tabBookings},
                {id: 'MAP', icon: MapIcon, label: t.tabMap},
                {id: 'WALLET', icon: WalletIcon, label: t.tabWallet},
                {id: 'BOARD', icon: MessageCircle, label: t.tabBoard},
                {id: 'MEMORIES', icon: ImageIcon, label: t.tabMemories},
              ].map(tab => (
                  <button key={tab.id} onClick={() => setActiveTab(tab.id as TripTabState)} className={`flex flex-col items-center gap-1 pb-3 min-w-[60px] border-b-2 transition-all ${activeTab === tab.id ? 'border-mint-400 text-mint-500' : 'border-transparent text-gray-300 dark:text-gray-600 hover:text-gray-400'}`}>
                      <tab.icon size={24} strokeWidth={activeTab === tab.id ? 2.5 : 2} />
                      <span className="text-[10px] font-bold">{tab.label}</span>
                  </button>
              ))}
           </div>
       </div>

       {/* Content Area */}
       <div className="p-6 animate-fade-in">
           {activeTab === 'TIMELINE' && (
               <Timeline 
                  events={activeTrip.events} 
                  onAddEvent={(e) => updateTripData(t => ({...t, events: [...t.events, e]}))}
                  onUpdateEvent={(e) => updateTripData(t => ({...t, events: t.events.map(ev => ev.id === e.id ? e : ev)}))}
                  onDeleteEvent={(id) => updateTripData(t => ({...t, events: t.events.filter(e => e.id !== id)}))}
                  tripLocation={activeTrip.title}
                  tripDates={activeTrip.dates}
                  isReadOnly={isReadOnly || !canEditTrip()}
                  language={language}
               />
           )}

           {activeTab === 'CALENDAR' && <CalendarView trip={activeTrip} language={language} />}

           {activeTab === 'WALLET' && (
               <Wallet 
                  expenses={activeTrip.expenses}
                  members={activeTrip.members}
                  onAddExpense={(ex) => updateTripData(t => ({...t, expenses: [...t.expenses, {id: Math.random().toString(), ...ex}]}))}
                  onUpdateExpense={(ex) => updateTripData(t => ({...t, expenses: t.expenses.map(e => e.id === ex.id ? ex : e)}))}
                  onDeleteExpense={(id) => updateTripData(t => ({...t, expenses: t.expenses.filter(e => e.id !== id)}))}
                  isReadOnly={isReadOnly || !canEditTrip()}
                  language={language}
               />
           )}

           {activeTab === 'BOOKINGS' && (
               <Bookings 
                   bookings={activeTrip.bookings}
                   onAddBooking={(b) => updateTripData(t => ({...t, bookings: [...t.bookings, {id: Math.random().toString(), ...b}]}))}
                   onDeleteBooking={(id) => updateTripData(t => ({...t, bookings: t.bookings.filter(b => b.id !== id)}))}
                   isReadOnly={isReadOnly || !canEditTrip()}
                   language={language}
               />
           )}

           {activeTab === 'MEMORIES' && (
               <Memories 
                   memories={activeTrip.memories} 
                   members={activeTrip.members}
                   onAddMemory={(m) => updateTripData(t => ({...t, memories: [...t.memories, {id: Math.random().toString(), ...m}]}))}
                   onDeleteMemory={(id) => updateTripData(t => ({...t, memories: t.memories.filter(m => m.id !== id)}))}
                   currentUser={currentUser}
                   isReadOnly={isReadOnly || !canEditTrip()}
                   language={language}
               />
           )}
           
           {activeTab === 'BOARD' && (
               <div className="flex flex-col h-[65vh]">
                   <div className="flex-1 overflow-y-auto space-y-4 p-2 no-scrollbar">
                       {activeTrip.messages.map(msg => {
                           const isMe = msg.userId === currentUser?.id;
                           const sender = activeTrip.members.find(m => m.id === msg.userId);
                           return (
                               <div key={msg.id} className={`flex gap-3 ${isMe ? 'flex-row-reverse' : ''}`}>
                                   <div className="mt-1"><UserAvatar user={sender || MOCK_USERS[0]} size="sm" /></div>
                                   <div>
                                       <div className={`p-4 rounded-[20px] max-w-[240px] ${isMe ? 'bg-mint-400 text-white rounded-tr-sm' : 'bg-white dark:bg-gray-800 text-gray-800 dark:text-white border border-gray-100 dark:border-gray-700 rounded-tl-sm'}`}>
                                           <p className="text-sm">{msg.text}</p>
                                       </div>
                                       <p className={`text-[10px] text-gray-300 mt-1 ${isMe ? 'text-right' : ''}`}>{msg.timestamp}</p>
                                   </div>
                               </div>
                           );
                       })}
                   </div>
                   {!isReadOnly && canEditTrip() && (
                       <div className="mt-4 mb-24 bg-white dark:bg-gray-800 p-2 rounded-full shadow-lg border border-gray-100 dark:border-gray-700 flex gap-2">
                           <input 
                               value={chatInput} 
                               onChange={e => setChatInput(e.target.value)} 
                               placeholder="Type a message..." 
                               className="flex-1 bg-transparent px-4 outline-none dark:text-white"
                               onKeyDown={e => {
                                   if(e.key === 'Enter' && chatInput) {
                                       const newMsg: ChatMessage = { id: Math.random().toString(), userId: currentUser!.id, text: chatInput, timestamp: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) };
                                       updateTripData(t => ({...t, messages: [...t.messages, newMsg]}));
                                       setChatInput('');
                                       
                                       // Sim Chat Reply
                                       setTimeout(() => {
                                           const reply: ChatMessage = { id: Math.random().toString(), userId: 'u2', text: t.chatReplyMsg, timestamp: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) };
                                           updateTripData(t => ({...t, messages: [...t.messages, reply]}));
                                           addNotification(t.chatReply, t.chatReplyMsg, 'message');
                                       }, 3000);
                                   }
                               }}
                           />
                           <button className="w-10 h-10 bg-mint-400 rounded-full text-white flex items-center justify-center hover:bg-mint-500 transition-colors">
                               <Send size={18} />
                           </button>
                       </div>
                   )}
               </div>
           )}

           {activeTab === 'MAP' && (
               <div className="h-[60vh] bg-blue-50 dark:bg-gray-800 rounded-[32px] flex items-center justify-center border border-blue-100 dark:border-gray-700">
                   <div className="text-center text-blue-300">
                       <MapIcon size={48} className="mx-auto mb-2 opacity-50" />
                       <p className="font-bold">Map View Placeholder</p>
                   </div>
               </div>
           )}
       </div>

       {/* Member Mgmt Modal */}
       {isMemberModalOpen && (
           <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[60] flex items-center justify-center p-6">
               <div className="bg-white dark:bg-gray-800 w-full max-w-sm rounded-[32px] p-6 shadow-2xl">
                   <div className="flex justify-between items-center mb-6">
                       <h3 className="font-bold text-xl text-gray-800 dark:text-white">Members</h3>
                       <button onClick={() => setIsMemberModalOpen(false)}><X size={20} className="text-gray-400"/></button>
                   </div>
                   <div className="space-y-4">
                       {activeTrip.members.map(m => (
                           <div key={m.id} className="flex items-center justify-between">
                               <div className="flex items-center gap-3">
                                   <UserAvatar user={m} />
                                   <div>
                                       <p className="font-bold text-sm text-gray-800 dark:text-white">{m.name}</p>
                                       <p className="text-xs text-gray-400 capitalize">{m.role}</p>
                                   </div>
                               </div>
                               {m.role === 'admin' && <ShieldCheck size={16} className="text-mint-400" />}
                           </div>
                       ))}
                   </div>
                   {!isReadOnly && (
                       <div className="mt-6 pt-6 border-t border-gray-100 dark:border-gray-700">
                           <h4 className="font-bold text-sm text-gray-500 mb-3">Invite Link</h4>
                           <div className="flex gap-2 bg-gray-50 dark:bg-gray-700 p-3 rounded-xl">
                               <span className="text-xs text-gray-400 flex-1 truncate select-all">triplink.app/join/{activeTrip.id}</span>
                               <button onClick={() => { navigator.clipboard.writeText(`triplink.app/join/${activeTrip.id}`); alert("Copied!"); }} className="text-mint-500 font-bold text-xs">COPY</button>
                           </div>
                       </div>
                   )}
               </div>
           </div>
       )}

       {/* Floating Back Button (Bottom Left) */}
       <div className="fixed bottom-32 left-6 z-50">
           <button onClick={() => { setViewState('DASHBOARD'); setActiveTripId(null); }} className="w-14 h-14 rounded-full shadow-lg bg-white dark:bg-gray-800 text-gray-500 dark:text-white flex items-center justify-center hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors border-4 border-ivory dark:border-gray-900">
               <ArrowLeft size={24} />
           </button>
       </div>
    </div>
  );
}
