'use client';

import { useState } from 'react';
import { Compass, LogIn, UserPlus } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { TEXT } from '@/lib/constants';

export default function WelcomePage() {
  const router = useRouter();
  const t = TEXT['ja'];
  const [isJoinModalOpen, setIsJoinModalOpen] = useState(false);
  const [joinInput, setJoinInput] = useState('');

  const handleJoinTrip = () => {
    if (joinInput) {
      router.push(`/trips/${joinInput}`);
    }
  };

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
          <button 
            onClick={() => router.push('/login')}
            className="w-full bg-white text-mint-500 py-4 rounded-full font-bold shadow-lg hover:shadow-xl hover:scale-105 transition-all flex items-center justify-center gap-2"
          >
            <LogIn size={20} /> {t.login}
          </button>
          <button 
            onClick={() => router.push('/register')}
            className="w-full bg-mint-500 text-white py-4 rounded-full font-bold border border-mint-300 shadow-lg hover:bg-mint-600 transition-all flex items-center justify-center gap-2"
          >
            <UserPlus size={20} /> {t.register}
          </button>
          <div className="h-px bg-mint-300 w-full my-4"></div>
          <button 
            onClick={() => router.push('/dashboard')}
            className="w-full bg-transparent text-white py-4 rounded-full font-bold border-2 border-white/30 hover:bg-white/10 transition-colors"
          >
            {t.guest}
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
              <button 
                onClick={() => setIsJoinModalOpen(false)} 
                className="flex-1 py-3 rounded-full text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                {t.cancel}
              </button>
              <button 
                onClick={handleJoinTrip} 
                className="flex-1 py-3 rounded-full bg-mint-400 text-white font-bold shadow-sm"
              >
                {t.join}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
