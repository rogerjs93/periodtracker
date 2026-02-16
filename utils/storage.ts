import { DailyLog, AppSettings } from '../types';

const LOGS_KEY = 'luna_daily_logs';
const SETTINGS_KEY = 'luna_settings';

export const getLogs = (): Record<string, DailyLog> => {
  const stored = localStorage.getItem(LOGS_KEY);
  return stored ? JSON.parse(stored) : {};
};

export const saveLog = (log: DailyLog) => {
  const logs = getLogs();
  logs[log.date] = log;
  localStorage.setItem(LOGS_KEY, JSON.stringify(logs));
  // Dispatch event for simple reactivity across components if needed
  window.dispatchEvent(new Event('storage-update'));
};

export const deleteLog = (date: string) => {
  const logs = getLogs();
  delete logs[date];
  localStorage.setItem(LOGS_KEY, JSON.stringify(logs));
  window.dispatchEvent(new Event('storage-update'));
};

export const getSettings = (): AppSettings => {
  const stored = localStorage.getItem(SETTINGS_KEY);
  return stored ? JSON.parse(stored) : {
    userName: 'User',
    cycleLengthGoal: 28,
    periodLengthGoal: 5,
    moodCheckFrequency: 24, // Default once a day
  };
};

export const saveSettings = (settings: AppSettings) => {
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  window.dispatchEvent(new Event('settings-update'));
};

// Clear all data (Privacy feature)
export const clearAllData = () => {
  localStorage.removeItem(LOGS_KEY);
  localStorage.removeItem(SETTINGS_KEY);
  window.dispatchEvent(new Event('storage-update'));
};
