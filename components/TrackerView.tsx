import React, { useState, useEffect } from 'react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isToday, addMonths, subMonths, getDay, isSameMonth } from 'date-fns';
import { ChevronLeft, ChevronRight, Droplet, Sun, Moon, Edit3, CheckCircle } from 'lucide-react';
import { getLogs, saveLog } from '../utils/storage';
import { calculateCycleStats, getDayStatus } from '../utils/cycleHelper';
import { DailyLog, FlowIntensity, Mood, Symptom } from '../types';
import { LogModal } from './LogModal';

export const TrackerView: React.FC = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [logs, setLogs] = useState<Record<string, DailyLog>>({});
  const [stats, setStats] = useState(calculateCycleStats({}));
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const loadData = () => {
      const loadedLogs = getLogs();
      setLogs(loadedLogs);
      setStats(calculateCycleStats(loadedLogs));
    };

    loadData();
    window.addEventListener('storage-update', loadData);
    return () => window.removeEventListener('storage-update', loadData);
  }, []);

  const daysInMonth = eachDayOfInterval({
    start: startOfMonth(currentDate),
    end: endOfMonth(currentDate)
  });

  const startDayOfWeek = getDay(startOfMonth(currentDate)); // 0 = Sun, 1 = Mon, etc.
  const emptyDays = Array(startDayOfWeek).fill(null);

  const handleDateClick = (dateStr: string) => {
    setSelectedDate(dateStr);
    setIsModalOpen(true);
  };

  const handleSaveLog = (log: DailyLog) => {
    saveLog(log);
    setIsModalOpen(false);
  };

  const nextMonth = () => setCurrentDate(addMonths(currentDate, 1));
  const prevMonth = () => setCurrentDate(subMonths(currentDate, 1));

  return (
    <div className="p-4">
      {/* Quick Status Card */}
      <div className="bg-white rounded-2xl shadow-sm border border-pink-100 p-6 mb-6">
        <h2 className="text-gray-500 text-sm font-medium uppercase tracking-wider mb-1">Prediction</h2>
        <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold text-gray-800">
                {stats.predictedNextStart ? 
                    format(new Date(stats.predictedNextStart), 'MMM d') : 
                    "Not enough data"}
            </span>
            {stats.predictedNextStart && (
                 <span className="text-pink-500 font-medium">Next Period</span>
            )}
        </div>
        <div className="mt-4 flex gap-4 text-sm text-gray-600">
             <div className="flex items-center gap-1">
                 <div className="w-2 h-2 rounded-full bg-rose-400"></div>
                 Cycle Day: {stats.lastPeriodStart ? 
                    Math.floor((new Date().getTime() - new Date(stats.lastPeriodStart).getTime()) / (1000 * 60 * 60 * 24)) + 1
                    : '-'}
             </div>
             <div className="flex items-center gap-1">
                 <div className="w-2 h-2 rounded-full bg-purple-400"></div>
                 Avg Cycle: {stats.averageLength}d
             </div>
        </div>
      </div>

      {/* Calendar Controls */}
      <div className="flex items-center justify-between mb-4 px-2">
        <button onClick={prevMonth} className="p-2 hover:bg-gray-100 rounded-full transition"><ChevronLeft className="text-gray-600" /></button>
        <h3 className="text-lg font-bold text-gray-800">{format(currentDate, 'MMMM yyyy')}</h3>
        <button onClick={nextMonth} className="p-2 hover:bg-gray-100 rounded-full transition"><ChevronRight className="text-gray-600" /></button>
      </div>

      {/* Calendar Grid */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="grid grid-cols-7 border-b border-gray-100 bg-gray-50">
          {['S','M','T','W','T','F','S'].map(d => (
            <div key={d} className="py-2 text-center text-xs font-bold text-gray-400">{d}</div>
          ))}
        </div>
        <div className="grid grid-cols-7">
          {emptyDays.map((_, i) => <div key={`empty-${i}`} className="h-14 bg-gray-50/30" />)}
          
          {daysInMonth.map(day => {
            const dateStr = format(day, 'yyyy-MM-dd');
            const { isPeriod, isPredictedPeriod, isOvulation, log } = getDayStatus(dateStr, logs, stats);
            const isTodayDate = isToday(day);

            return (
              <div 
                key={dateStr}
                onClick={() => handleDateClick(dateStr)}
                className={`
                  h-14 border-t border-r border-gray-50 relative cursor-pointer transition-colors
                  hover:bg-gray-50
                  ${!isSameMonth(day, currentDate) ? 'opacity-30' : ''}
                  ${isPeriod ? 'bg-rose-100' : ''}
                  ${isPredictedPeriod && !isPeriod ? 'bg-pink-50' : ''}
                `}
              >
                <span className={`
                  absolute top-1 left-1 text-xs font-medium w-6 h-6 flex items-center justify-center rounded-full
                  ${isTodayDate ? 'bg-gray-800 text-white' : 'text-gray-500'}
                  ${isPeriod ? 'text-rose-700' : ''}
                `}>
                  {format(day, 'd')}
                </span>

                {/* Indicators */}
                <div className="absolute bottom-1 right-1 flex gap-0.5">
                    {isPeriod && <Droplet size={10} className="text-rose-500 fill-rose-500" />}
                    {isOvulation && <Sun size={10} className="text-amber-400 fill-amber-400" />}
                    {log?.moods && log.moods.length > 0 && <div className="w-1.5 h-1.5 rounded-full bg-indigo-400" />}
                    {log?.symptoms && log.symptoms.length > 0 && <div className="w-1.5 h-1.5 rounded-full bg-orange-400" />}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Legend */}
      <div className="mt-6 flex flex-wrap gap-4 text-xs text-gray-500 px-2">
        <div className="flex items-center gap-1.5"><div className="w-3 h-3 bg-rose-400 rounded-sm"></div> Period</div>
        <div className="flex items-center gap-1.5"><div className="w-3 h-3 bg-pink-100 rounded-sm"></div> Prediction</div>
        <div className="flex items-center gap-1.5"><Sun size={12} className="text-amber-400" /> Ovulation</div>
      </div>

      {isModalOpen && selectedDate && (
        <LogModal 
          dateStr={selectedDate} 
          existingLog={logs[selectedDate]} 
          onClose={() => setIsModalOpen(false)} 
          onSave={handleSaveLog} 
        />
      )}
    </div>
  );
};
