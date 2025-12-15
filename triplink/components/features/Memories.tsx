'use client';

import React, { useState } from 'react';
import { Memory, User, Language } from '@/lib/types';
import { Plus, X, Image as ImageIcon, Trash2, Heart } from 'lucide-react';

interface MemoriesProps {
  memories: Memory[];
  members: User[];
  onAddMemory: (memory: Omit<Memory, 'id'>) => void;
  onDeleteMemory: (id: string) => void;
  currentUser: User | null;
  isReadOnly: boolean;
  language?: Language;
}

const TEXT = {
  ja: {
    emptyTitle: '思い出がまだありません',
    emptyDesc: '旅の瞬間をここに集めましょう',
    addNote: '写真/メモを追加'
  },
  en: {
    emptyTitle: 'No Memories Yet',
    emptyDesc: 'Collect moments here.',
    addNote: 'Add Note'
  }
};

export function Memories({ 
  memories, 
  members, 
  onAddMemory, 
  onDeleteMemory,
  currentUser,
  isReadOnly,
  language = 'ja'
}: MemoriesProps) {
  const t = TEXT[language];

  const handleAddMockMemory = () => {
      if(!currentUser) return;
      onAddMemory({
          url: '',
          caption: 'New Memory',
          userId: currentUser.id,
          date: new Date().toLocaleDateString()
      });
  };

  return (
    <div className="pb-24">
       {memories.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 px-6 text-center bg-white dark:bg-gray-800 rounded-[32px] border border-gray-200 dark:border-gray-700">
             <div className="w-16 h-16 bg-mint-50 dark:bg-mint-900/20 rounded-full flex items-center justify-center mb-4 text-mint-400 border border-mint-100 dark:border-mint-900">
                <Heart size={24} />
             </div>
             <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-2">{t.emptyTitle}</h3>
             <p className="text-gray-400 text-sm mb-6">{t.emptyDesc}</p>
             {!isReadOnly && (
                 <button onClick={handleAddMockMemory} className="bg-mint-400 text-white px-6 py-3 rounded-full font-bold shadow-sm hover:bg-mint-500 transition-colors">
                    {t.addNote}
                 </button>
             )}
          </div>
       ) : (
           <div className="grid grid-cols-1 gap-4">
              {memories.map((memory, idx) => (
                  <div key={memory.id} className="bg-white dark:bg-gray-800 p-6 rounded-[24px] border border-gray-200 dark:border-gray-700 flex justify-between items-center hover:border-mint-200 dark:hover:border-mint-900 transition-colors group">
                     <div className="flex items-center gap-4">
                         <div className="w-12 h-12 bg-ivory dark:bg-gray-700 rounded-2xl flex items-center justify-center text-mint-400 border border-gray-100 dark:border-gray-600">
                             <ImageIcon size={20} />
                         </div>
                         <div>
                             <p className="font-bold text-gray-800 dark:text-white">Memory #{idx + 1}</p>
                             <p className="text-xs text-gray-400">{memory.caption || 'Untitled'} • {memory.date}</p>
                         </div>
                     </div>
                     {!isReadOnly && (
                         <button onClick={() => onDeleteMemory(memory.id)} className="w-10 h-10 rounded-full bg-ivory dark:bg-gray-700 flex items-center justify-center text-gray-300 hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900 transition-colors border border-gray-100 dark:border-gray-600">
                             <Trash2 size={16} />
                         </button>
                     )}
                  </div>
              ))}
           </div>
       )}
       
       {!isReadOnly && memories.length > 0 && (
          <div className="fixed z-50 bottom-32 right-6">
            <button onClick={handleAddMockMemory} className="w-14 h-14 rounded-full shadow-lg bg-mint-400 text-white flex items-center justify-center hover:bg-mint-500 transition-colors border-4 border-ivory dark:border-gray-900">
                <Plus size={24} />
            </button>
          </div>
       )}
    </div>
  );
}
