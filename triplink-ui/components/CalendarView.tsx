import React, { useState } from 'react';
import { Trip, ItineraryEvent, Category, Language } from '../types';
import { ChevronLeft, ChevronRight, MapPin } from 'lucide-react';

interface CalendarViewProps {
  trip: Trip;
  language?: Language;
}

const WEEKDAYS_JA = ['日', '月', '火', '水', '木', '金', '土'];
const WEEKDAYS_EN = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

export const CalendarView: React.FC<CalendarViewProps> = ({ trip, language = 'ja' }) => {
  const startDateStr = trip.dates.split(' - ')[0];
  const [currentDate, setCurrentDate] = useState(new Date(startDateStr));
  const [selectedDateStr, setSelectedDateStr] = useState(startDateStr);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1));
  const formatDateStr = (y: number, m: number, d: number) => `${y}/${(m + 1).toString().padStart(2, '0')}/${d.toString().padStart(2, '0')}`;

  const days = [];
  for (let i = 0; i < firstDay; i++) days.push(null);
  for (let i = 1; i <= daysInMonth; i++) days.push(i);

  const eventsOnSelectedDate = trip.events.filter(e => e.date === selectedDateStr).sort((a, b) => a.startTime.localeCompare(b.startTime));

  const weekdays = language === 'ja' ? WEEKDAYS_JA : WEEKDAYS_EN;

  return (
    <div className="pb-24">
      <div className="bg-white dark:bg-gray-800 rounded-[32px] p-6 shadow-sm border border-gray-100 dark:border-gray-700 mb-6">
        <div className="flex justify-between items-center mb-6">
            <button onClick={prevMonth} className="w-8 h-8 rounded-full bg-gray-50 dark:bg-gray-700 flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-600"><ChevronLeft size={16} className="text-gray-400" /></button>
            <h2 className="text-lg font-bold text-gray-800 dark:text-white">{year} / {month + 1}</h2>
            <button onClick={nextMonth} className="w-8 h-8 rounded-full bg-gray-50 dark:bg-gray-700 flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-600"><ChevronRight size={16} className="text-gray-400" /></button>
        </div>

        <div className="grid grid-cols-7 mb-4">
            {weekdays.map((day, i) => (
                <div key={i} className="text-center text-xs font-bold text-gray-300 dark:text-gray-600">{day}</div>
            ))}
        </div>

        <div className="grid grid-cols-7 gap-y-2">
            {days.map((day, i) => {
                if (!day) return <div key={`empty-${i}`} className="h-10"></div>;
                const dateStr = formatDateStr(year, month, day);
                const isSelected = dateStr === selectedDateStr;
                const hasEvents = trip.events.some(e => e.date === dateStr);

                return (
                    <div key={day} className="flex flex-col items-center">
                        <button 
                            onClick={() => setSelectedDateStr(dateStr)}
                            className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold transition-all relative ${isSelected ? 'bg-mint-400 text-white shadow-md' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'}`}
                        >
                            {day}
                            {hasEvents && !isSelected && <div className="absolute bottom-1 w-1 h-1 rounded-full bg-mint-400"></div>}
                        </button>
                    </div>
                );
            })}
        </div>
      </div>

      <div className="px-2 space-y-3">
          {eventsOnSelectedDate.length === 0 ? (
              <div className="text-center py-8 bg-white dark:bg-gray-800 rounded-[24px] border border-gray-100 dark:border-gray-700">
                  <p className="text-gray-400 text-sm">{language === 'ja' ? '予定がありません' : 'No events'}</p>
              </div>
          ) : (
              eventsOnSelectedDate.map(event => (
                  <div key={event.id} className="bg-white dark:bg-gray-800 p-6 rounded-[24px] shadow-sm border border-gray-100 dark:border-gray-700 flex gap-4">
                      <div className="text-center">
                          <p className="text-sm font-bold text-gray-800 dark:text-white">{event.startTime}</p>
                      </div>
                      <div>
                          <h4 className="font-bold text-gray-800 dark:text-white">{event.title}</h4>
                          <p className="text-xs text-gray-400 mt-1 flex items-center gap-1"><MapPin size={10} /> {event.location}</p>
                      </div>
                  </div>
              ))
          )}
      </div>
    </div>
  );
};