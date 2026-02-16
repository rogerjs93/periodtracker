import React from 'react';
import { Mood, DailyLog } from '../types';
import { Smile, Frown, Meh, Sun, Zap, X } from 'lucide-react';
import { saveLog, getLogs } from '../utils/storage';

interface MoodCheckModalProps {
    isOpen: boolean;
    onClose: () => void;
    currentDate: string;
}

const MOOD_OPTIONS = [
    { label: Mood.HAPPY, icon: <Smile className="w-8 h-8 text-green-500" />, color: 'bg-green-50 border-green-200' },
    { label: Mood.CALM, icon: <Sun className="w-8 h-8 text-yellow-500" />, color: 'bg-yellow-50 border-yellow-200' },
    { label: Mood.TIRED, icon: <Meh className="w-8 h-8 text-blue-400" />, color: 'bg-blue-50 border-blue-200' },
    { label: Mood.SAD, icon: <Frown className="w-8 h-8 text-indigo-400" />, color: 'bg-indigo-50 border-indigo-200' },
    { label: Mood.ANXIOUS, icon: <Zap className="w-8 h-8 text-purple-500" />, color: 'bg-purple-50 border-purple-200' },
];

export const MoodCheckModal: React.FC<MoodCheckModalProps> = ({ isOpen, onClose, currentDate }) => {
    if (!isOpen) return null;

    const handleMoodSelect = (mood: Mood) => {
        const logs = getLogs();
        const existingLog = logs[currentDate] || {
            date: currentDate,
            isPeriod: false,
            moods: [],
            symptoms: []
        };

        // Add mood if not already present
        if (!existingLog.moods.includes(mood)) {
            existingLog.moods.push(mood);
        }

        saveLog(existingLog);
        onClose();
        // Optional: Trigger a toast or animation here
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-fade-in">
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-sm overflow-hidden relative animate-scale-up">

                {/* Close Button */}
                <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
                    <X size={24} />
                </button>

                <div className="p-8 text-center">
                    <h3 className="text-xl font-bold text-gray-800 mb-2">How are you feeling?</h3>
                    <p className="text-sm text-gray-500 mb-6">Take a moment to check in with yourself.</p>

                    <div className="grid grid-cols-3 gap-4">
                        {MOOD_OPTIONS.map((option) => (
                            <button
                                key={option.label}
                                onClick={() => handleMoodSelect(option.label)}
                                className={`flex flex-col items-center justify-center p-3 rounded-2xl border-2 transition-all active:scale-95 ${option.color} hover:brightness-95`}
                            >
                                {option.icon}
                                <span className="text-xs font-medium text-gray-700 mt-2">{option.label}</span>
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};
