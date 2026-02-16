import React, { useState, useEffect } from 'react';
import { getSettings, saveSettings, clearAllData } from '../utils/storage';
import { AppSettings } from '../types';
import { Trash2, Lock, Save } from 'lucide-react';

export const SettingsView: React.FC = () => {
    const [settings, setSettings] = useState<AppSettings>({
        userName: '',
        cycleLengthGoal: 28,
        periodLengthGoal: 5,
        moodCheckFrequency: 24
    });
    const [showConfirm, setShowConfirm] = useState(false);

    useEffect(() => {
        setSettings(getSettings());
    }, []);

    const handleChange = (key: keyof AppSettings, value: any) => {
        const newSettings = { ...settings, [key]: value };
        setSettings(newSettings);
    };

    const handleSave = () => {
        saveSettings(settings);
        alert('Settings saved!');
    };

    const handleClearData = () => {
        clearAllData();
        setShowConfirm(false);
        setSettings(getSettings());
        alert('All data has been erased.');
        window.location.reload();
    };

    return (
        <div className="p-4 space-y-6">
            <h2 className="text-2xl font-bold text-gray-800">Settings</h2>

            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Your Name</label>
                    <input
                        type="text"
                        value={settings.userName}
                        onChange={(e) => handleChange('userName', e.target.value)}
                        className="w-full p-3 rounded-xl border border-gray-200 focus:border-pink-300 focus:ring focus:ring-pink-100 outline-none transition"
                    />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Cycle Goal (Days)</label>
                        <input
                            type="number"
                            value={settings.cycleLengthGoal}
                            onChange={(e) => handleChange('cycleLengthGoal', parseInt(e.target.value))}
                            className="w-full p-3 rounded-xl border border-gray-200 outline-none"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Period Goal (Days)</label>
                        <input
                            type="number"
                            value={settings.periodLengthGoal}
                            onChange={(e) => handleChange('periodLengthGoal', parseInt(e.target.value))}
                            className="w-full p-3 rounded-xl border border-gray-200 outline-none"
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Mood Check Frequency</label>
                    <select
                        value={settings.moodCheckFrequency}
                        onChange={(e) => handleChange('moodCheckFrequency', parseInt(e.target.value))}
                        className="w-full p-3 rounded-xl border border-gray-200 focus:border-pink-300 focus:ring focus:ring-pink-100 outline-none transition bg-white"
                    >
                        <option value={0}>Off</option>
                        <option value={1}>Hourly</option>
                        <option value={24}>Daily</option>
                        <option value={168}>Weekly</option>
                        <option value={720}>Monthly</option>
                    </select>
                </div>

                <button
                    onClick={handleSave}
                    className="w-full py-3 bg-gray-900 text-white rounded-xl font-medium mt-2 flex items-center justify-center gap-2"
                >
                    <Save size={18} /> Save Settings
                </button>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <div className="flex items-center gap-2 text-gray-800 font-bold mb-2">
                    <Lock size={18} className="text-green-600" /> Privacy & Data
                </div>
                <p className="text-sm text-gray-600 mb-4">
                    All your data is stored locally on this device. <strong>Our AI runs entirely on your phone</strong> (Local Intelligence), so your personal health data never leaves your device.
                </p>

                {!showConfirm ? (
                    <button
                        onClick={() => setShowConfirm(true)}
                        className="w-full py-3 border border-red-200 text-red-600 bg-red-50 rounded-xl font-medium flex items-center justify-center gap-2 hover:bg-red-100 transition"
                    >
                        <Trash2 size={18} /> Erase All Data
                    </button>
                ) : (
                    <div className="space-y-2">
                        <p className="text-center text-xs text-red-500 font-bold">Are you sure? This cannot be undone.</p>
                        <div className="flex gap-2">
                            <button
                                onClick={() => setShowConfirm(false)}
                                className="flex-1 py-2 bg-gray-100 text-gray-700 rounded-lg"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleClearData}
                                className="flex-1 py-2 bg-red-600 text-white rounded-lg"
                            >
                                Yes, Erase
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};
