'use client';

import React, { useState } from 'react';
import { ItineraryEvent, Category, Language } from '@/lib/types';
import { Clock, MapPin, Sparkles, Plus, Loader2, X, ChevronDown, Trash2, Pencil, Calendar } from 'lucide-react';

interface TimelineProps {
  events: ItineraryEvent[];
  onAddEvent: (event: ItineraryEvent) => void;
  onUpdateEvent: (event: ItineraryEvent) => void;
  onDeleteEvent: (eventId: string) => void;
  tripLocation: string;
  tripDates: string;
  isReadOnly?: boolean;
  language?: Language;
}

const TEXT = {
  ja: {
    aiSuggest: 'AI提案',
    noPlans: '予定がありません',
    details: '詳細',
    title: 'タイトル',
    location: '場所',
    notes: 'メモ',
    save: '保存',
    generating: '生成中...',
    categories: {
      [Category.Transport]: '移動',
      [Category.Food]: '食事',
      [Category.Activity]: '観光・体験',
      [Category.Lodging]: '宿泊',
      [Category.Other]: 'その他'
    }
  },
  en: {
    aiSuggest: 'AI Suggest',
    noPlans: 'No plans yet',
    details: 'Details',
    title: 'Title',
    location: 'Location',
    notes: 'Notes',
    save: 'Save',
    generating: 'Thinking...',
    categories: {
      [Category.Transport]: 'Transport',
      [Category.Food]: 'Food',
      [Category.Activity]: 'Activity',
      [Category.Lodging]: 'Lodging',
      [Category.Other]: 'Other'
    }
  }
};

const getCategoryStyles = (cat: Category) => {
  switch (cat) {
    case Category.Food: return { bg: 'bg-peach-50 dark:bg-peach-900/20', text: 'text-peach-400' };
    case Category.Transport: return { bg: 'bg-blue-50 dark:bg-blue-900/20', text: 'text-blue-400' };
    case Category.Activity: return { bg: 'bg-mint-50 dark:bg-mint-900/20', text: 'text-mint-400' };
    case Category.Lodging: return { bg: 'bg-purple-50 dark:bg-purple-900/20', text: 'text-purple-400' };
    default: return { bg: 'bg-gray-100 dark:bg-gray-800', text: 'text-gray-400' };
  }
};

const getMidTime = (t1: string, t2: string) => {
    const [h1, m1] = t1.split(':').map(Number);
    const [h2, m2] = t2.split(':').map(Number);
    const mid = Math.floor(((h1 * 60 + m1) + (h2 * 60 + m2)) / 2);
    return `${Math.floor(mid / 60).toString().padStart(2, '0')}:${(mid % 60).toString().padStart(2, '0')}`;
};
  
const addTime = (t: string, minutes: number) => {
    const [h, m] = t.split(':').map(Number);
    let total = h * 60 + m + minutes;
    return `${Math.floor(total / 60) % 24}:${(total % 60).toString().padStart(2, '0')}`;
};

const roundToNearest5 = (timeStr: string) => {
    const [h, m] = timeStr.split(':').map(Number);
    const total = Math.round((h * 60 + m) / 5) * 5;
    return `${Math.floor(total / 60) % 24}:${(total % 60).toString().padStart(2, '0')}`;
};

export function Timeline({ events, onAddEvent, onUpdateEvent, onDeleteEvent, tripLocation, tripDates, isReadOnly = false, language = 'ja' }: TimelineProps) {
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [activeDateForAi, setActiveDateForAi] = useState<string>('');
  const [editingEventId, setEditingEventId] = useState<string | null>(null);
  const [newEventData, setNewEventData] = useState<Partial<ItineraryEvent>>({});
  const [aiPrompt, setAiPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const t = TEXT[language];

  // Time Picker Logic
  const HOURS = Array.from({ length: 24 }, (_, i) => i.toString().padStart(2, '0'));
  const MINUTES = Array.from({ length: 12 }, (_, i) => (i * 5).toString().padStart(2, '0'));

  const [startDateStrRaw] = tripDates.split(' - ');
  const startDateStr = startDateStrRaw || '';
  const eventDates = new Set<string>(events.map(e => e.date || startDateStr));
  if (events.length === 0) eventDates.add(startDateStr);
  const sortedDates = Array.from(eventDates).sort();

  const handleOpenAdd = (initialTime: string, initialDate: string) => {
      const roundedTime = roundToNearest5(initialTime);
      setEditingEventId(null);
      setNewEventData({ title: '', startTime: roundedTime, date: initialDate, category: Category.Activity, location: '', notes: '' });
      setIsAddModalOpen(true);
  };

  const handleOpenEdit = (event: ItineraryEvent) => {
      setEditingEventId(event.id);
      setNewEventData({ ...event });
      setIsAddModalOpen(true);
  };

  const handleSaveEvent = () => {
    if (!newEventData.title || !newEventData.startTime || !newEventData.date) return;
    const event = {
        id: editingEventId || Math.random().toString(36).substr(2, 9),
        title: newEventData.title!,
        startTime: newEventData.startTime!,
        date: newEventData.date!,
        location: newEventData.location || 'TBD',
        category: newEventData.category || Category.Activity,
        notes: newEventData.notes
    };
    editingEventId ? onUpdateEvent(event as ItineraryEvent) : onAddEvent(event as ItineraryEvent);
    setIsAddModalOpen(false);
    setNewEventData({});
  };

  const handleDeleteWithConfirm = (id: string) => {
      if (window.confirm('Delete this event?')) {
          onDeleteEvent(id);
      }
  };

  // Helper to update specific time parts
  const updateTime = (part: 'hour' | 'minute', val: string) => {
      const [h, m] = (newEventData.startTime || '09:00').split(':');
      const newTime = part === 'hour' ? `${val}:${m}` : `${h}:${val}`;
      setNewEventData({...newEventData, startTime: newTime});
  };
  const [currentH, currentM] = (newEventData.startTime || '09:00').split(':');

  return (
    <div className="pb-24 select-none">
      {sortedDates.map((dateStr) => {
          const dayEvents = events.filter(e => (e.date || startDateStr) === dateStr).sort((a, b) => a.startTime.localeCompare(b.startTime));
          
          return (
            <div key={dateStr} className="mb-10 last:mb-0">
                <div className="flex justify-between items-center mb-6 py-2 sticky top-0 bg-ivory/95 dark:bg-gray-900/95 backdrop-blur-sm z-20 border-b border-gray-100/50 dark:border-gray-800/50">
                    <h2 className="text-xl font-bold text-gray-800 dark:text-white flex items-center gap-3">
                        <span className="w-3 h-3 bg-mint-400 rounded-full ring-2 ring-mint-100 dark:ring-mint-900"></span>
                        {dateStr}
                    </h2>
                    {!isReadOnly && (
                        <button onClick={() => { setActiveDateForAi(dateStr); setIsAiModalOpen(true); }} className="text-mint-500 bg-white dark:bg-gray-800 px-4 py-1.5 rounded-full text-xs font-bold border border-mint-200 dark:border-mint-900 hover:bg-mint-50 dark:hover:bg-mint-900/20 transition-colors flex items-center gap-1 shadow-sm">
                            <Sparkles size={12} /> {t.aiSuggest}
                        </button>
                    )}
                </div>

                <div className="relative pl-4 border-l border-dashed border-gray-300 dark:border-gray-700 ml-3.5 space-y-2">
                    {dayEvents.length === 0 && (
                        <div className="ml-6 p-8 bg-white dark:bg-gray-800 rounded-3xl border border-dashed border-gray-200 dark:border-gray-700 text-center">
                            <p className="text-gray-400 text-sm">{t.noPlans}</p>
                        </div>
                    )}
                    
                    {!isReadOnly && dayEvents.length > 0 && <InsertZone time={dayEvents.length > 0 ? addTime(dayEvents[0].startTime, -60) : '09:00'} onAdd={(t) => handleOpenAdd(t, dateStr)} />}

                    {dayEvents.map((event, index) => {
                        const style = getCategoryStyles(event.category);
                        const nextEvent = dayEvents[index + 1];
                        const insertTime = nextEvent ? getMidTime(event.startTime, nextEvent.startTime) : addTime(event.startTime, 60);

                        return (
                            <React.Fragment key={event.id}>
                                <div className="relative flex gap-4 group ml-6">
                                    <div className="absolute -left-[32px] top-7 w-3 h-3 bg-white dark:bg-gray-800 border-2 border-mint-400 rounded-full z-10"></div>
                                    
                                    <div className="flex-1 bg-white dark:bg-gray-800 p-6 rounded-[24px] shadow-sm border border-gray-200 dark:border-gray-700 hover:border-mint-200 dark:hover:border-mint-900 hover:shadow-md transition-all relative group/card z-20">
                                        <div className={`absolute top-0 right-0 px-4 py-2 rounded-bl-2xl rounded-tr-[24px] text-[10px] font-bold tracking-wider uppercase ${style.bg} ${style.text}`}>
                                            {t.categories[event.category] || event.category}
                                        </div>
                                        <div className="flex items-start gap-3">
                                            <div>
                                                <p className="text-2xl font-bold text-gray-800 dark:text-white mb-1 tracking-tight">{event.startTime}</p>
                                                <h3 className="font-semibold text-lg text-gray-700 dark:text-gray-200 leading-snug">{event.title}</h3>
                                                <p className="text-gray-400 text-sm mt-1 flex items-center gap-1"><MapPin size={12}/> {event.location}</p>
                                                {event.notes && <p className="text-gray-400 text-xs mt-3 bg-gray-50 dark:bg-gray-700 p-2 rounded-xl border border-gray-100 dark:border-gray-600 inline-block">{event.notes}</p>}
                                            </div>
                                        </div>
                                        
                                        {!isReadOnly && (
                                            <div className="flex gap-2 mt-4 opacity-0 group-hover/card:opacity-100 transition-opacity absolute bottom-4 right-4 z-30 pointer-events-auto">
                                                <button onClick={(e) => { e.stopPropagation(); handleOpenEdit(event); }} className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-50 dark:bg-gray-700 text-gray-400 hover:text-mint-500 hover:bg-mint-50 dark:hover:bg-mint-900 transition-colors"><Pencil size={14}/></button>
                                                <button onClick={(e) => { e.stopPropagation(); handleDeleteWithConfirm(event.id); }} className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-50 dark:bg-gray-700 text-gray-400 hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900 transition-colors"><Trash2 size={14}/></button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                                {!isReadOnly && <InsertZone time={roundToNearest5(insertTime)} onAdd={(t) => handleOpenAdd(t, dateStr)} />}
                            </React.Fragment>
                        );
                    })}
                </div>
            </div>
          )
      })}

      {isAddModalOpen && (
          <div className="fixed inset-0 bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm z-50 flex items-center justify-center p-6 animate-fade-in">
             <div className="bg-white dark:bg-gray-800 w-full max-w-sm rounded-[32px] p-8 shadow-xl border border-gray-100 dark:border-gray-700 max-h-[85vh] overflow-y-auto">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="font-bold text-xl text-gray-800 dark:text-white">{t.details}</h3>
                    <button onClick={() => setIsAddModalOpen(false)} className="w-8 h-8 rounded-full bg-ivory dark:bg-gray-700 flex items-center justify-center text-gray-400 border border-gray-100 dark:border-gray-600"><X size={18}/></button>
                </div>
                <div className="flex flex-col gap-4">
                    <input type="text" value={newEventData.title} onChange={(e) => setNewEventData({...newEventData, title: e.target.value})} className="w-full bg-ivory dark:bg-gray-700 dark:text-white rounded-2xl p-4 outline-none text-lg placeholder-gray-300 border border-transparent focus:border-mint-200 transition-colors" placeholder={t.title} autoFocus />
                    
                    {/* Time & Date Stack */}
                    <div className="flex flex-col gap-2">
                        <label className="text-xs font-bold text-gray-400 ml-1 uppercase">TIME</label>
                        <div className="flex gap-2">
                            <select value={currentH} onChange={(e) => updateTime('hour', e.target.value)} className="flex-1 bg-ivory dark:bg-gray-700 dark:text-white rounded-2xl p-4 outline-none border border-transparent focus:border-mint-200 appearance-none">
                                {HOURS.map(h => <option key={h} value={h}>{h}</option>)}
                            </select>
                            <span className="flex items-center text-gray-400 font-bold">:</span>
                            <select value={currentM} onChange={(e) => updateTime('minute', e.target.value)} className="flex-1 bg-ivory dark:bg-gray-700 dark:text-white rounded-2xl p-4 outline-none border border-transparent focus:border-mint-200 appearance-none">
                                {MINUTES.map(m => <option key={m} value={m}>{m}</option>)}
                            </select>
                        </div>
                    </div>

                    <div className="flex flex-col gap-2">
                         <label className="text-xs font-bold text-gray-400 ml-1 uppercase">CATEGORY</label>
                        <select value={newEventData.category} onChange={(e) => setNewEventData({...newEventData, category: e.target.value as Category})} className="w-full bg-ivory dark:bg-gray-700 dark:text-white rounded-2xl p-4 outline-none text-sm border border-transparent focus:border-mint-200 appearance-none">
                            {Object.values(Category).map(c => <option key={c} value={c}>{t.categories[c] || c}</option>)}
                        </select>
                    </div>

                    <input type="text" value={newEventData.location} onChange={(e) => setNewEventData({...newEventData, location: e.target.value})} className="w-full bg-ivory dark:bg-gray-700 dark:text-white rounded-2xl p-4 outline-none text-sm border border-transparent focus:border-mint-200" placeholder={t.location} />
                    <textarea value={newEventData.notes || ''} onChange={(e) => setNewEventData({...newEventData, notes: e.target.value})} className="w-full bg-ivory dark:bg-gray-700 dark:text-white rounded-2xl p-4 outline-none text-sm border border-transparent focus:border-mint-200" rows={3} placeholder={t.notes} />
                    <button onClick={handleSaveEvent} className="w-full bg-mint-400 text-white py-4 rounded-full font-bold mt-2 shadow-sm hover:bg-mint-500 transition-colors">{t.save}</button>
                </div>
             </div>
          </div>
      )}

      {isAiModalOpen && (
          <div className="fixed inset-0 bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm z-50 flex items-center justify-center p-6 animate-fade-in">
             <div className="bg-white dark:bg-gray-800 w-full max-w-sm rounded-[32px] p-8 shadow-xl border border-gray-100 dark:border-gray-700 text-center">
                 <div className="w-16 h-16 bg-mint-50 dark:bg-mint-900/20 rounded-full flex items-center justify-center mx-auto mb-4 text-mint-500">
                     <Sparkles size={24} />
                 </div>
                 <h3 className="font-bold text-xl text-gray-800 dark:text-white mb-2">{t.aiSuggest}</h3>
                 <p className="text-gray-400 text-sm mb-6">Let Gemini plan your day in {activeDateForAi}.</p>
                 
                 <div className="space-y-4">
                     <input 
                       value={aiPrompt}
                       onChange={(e) => setAiPrompt(e.target.value)}
                       className="w-full bg-ivory dark:bg-gray-700 dark:text-white rounded-2xl p-4 outline-none text-sm border border-transparent focus:border-mint-200 text-center"
                       placeholder="e.g. History & Local Food"
                     />
                     <button 
                        onClick={() => {/* AI generation would go here */}}
                        disabled={isLoading}
                        className="w-full bg-mint-400 text-white py-4 rounded-full font-bold shadow-sm hover:bg-mint-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                     >
                        {isLoading ? <Loader2 className="animate-spin" /> : <Sparkles size={18} />}
                        {isLoading ? t.generating : 'Generate'}
                     </button>
                     <button onClick={() => setIsAiModalOpen(false)} className="text-gray-400 text-sm hover:text-gray-600">Cancel</button>
                 </div>
             </div>
          </div>
      )}

       {/* Floating Action Button for Add Event (Bottom Right) */}
       {!isReadOnly && (
          <div className="fixed z-50 bottom-32 right-6">
            <button onClick={() => handleOpenAdd('09:00', sortedDates[0] || tripDates.split(' - ')[0])} className="w-14 h-14 rounded-full shadow-lg bg-mint-400 text-white flex items-center justify-center hover:bg-mint-500 transition-colors border-4 border-ivory dark:border-gray-900">
                <Plus size={24} />
            </button>
          </div>
       )}
    </div>
  );
}

const InsertZone = ({ time, onAdd, className = "" }: { time: string, onAdd: (t: string) => void, className?: string }) => (
    <div className={`relative h-6 group ml-6 flex items-center cursor-pointer z-10 ${className}`} onClick={() => onAdd(time)}>
        <div className="w-2 h-2 rounded-full bg-gray-200 dark:bg-gray-600 group-hover:bg-mint-400 absolute -left-[29px] transition-colors z-20 ring-4 ring-ivory dark:ring-gray-900"></div>
        <div className="h-px bg-gray-200 dark:bg-gray-700 w-full group-hover:bg-mint-200 dark:group-hover:bg-mint-900 transition-colors"></div>
        <span className="absolute left-1/2 -translate-x-1/2 bg-white dark:bg-gray-800 text-mint-400 text-[10px] font-bold px-2 py-0.5 rounded-full border border-mint-100 dark:border-mint-900 opacity-0 group-hover:opacity-100 transition-all shadow-sm">
            + {time}
        </span>
    </div>
);
