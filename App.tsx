import React, { useState, useEffect } from 'react';
import { Calendar, Activity, BrainCircuit, Settings as SettingsIcon, Heart } from 'lucide-react';
import { TrackerView } from './components/TrackerView';
import { InsightsView } from './components/InsightsView';
import { SettingsView } from './components/SettingsView';
import { AIHealthAssistant } from './components/AIHealthAssistant';
import { MoodCheckModal } from './components/MoodCheckModal';
import { LocalNotifications } from '@capacitor/local-notifications';
import { getSettings } from './utils/storage';
import { format } from 'date-fns';

enum Tab {
  TRACKER = 'TRACKER',
  INSIGHTS = 'INSIGHTS',
  AI_ASSISTANT = 'AI_ASSISTANT',
  SETTINGS = 'SETTINGS'
}

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>(Tab.TRACKER);
  const [showMoodCheck, setShowMoodCheck] = useState(false);

  useEffect(() => {
    const setupNotifications = async () => {
      // 1. Request Permissions
      let permStatus = await LocalNotifications.checkPermissions();
      if (permStatus.display === 'prompt') {
        permStatus = await LocalNotifications.requestPermissions();
      }

      if (permStatus.display === 'granted') {
        // Register Action Type
        await LocalNotifications.registerActionTypes({
          types: [{
            id: 'MOOD_CHECK',
            actions: [{
              id: 'check_in',
              title: 'Check In',
              foreground: true
            }]
          }]
        });

        const settings = getSettings();
        const pending = await LocalNotifications.getPending();

        // If frequency is OFF (0), cancel all
        if (settings.moodCheckFrequency === 0) {
          if (pending.notifications.length > 0) {
            await LocalNotifications.cancel(pending);
          }
          return;
        }

        // Determine Schedule
        let schedule: any = { every: 'day', allowWhileIdle: true };
        if (settings.moodCheckFrequency === 1) schedule = { every: 'hour', allowWhileIdle: true };
        if (settings.moodCheckFrequency === 168) schedule = { every: 'week', allowWhileIdle: true };
        if (settings.moodCheckFrequency === 720) schedule = { every: 'month', allowWhileIdle: true };

        // Schedule if not exists or if we need to update (simplified: just reschedule on app load for now)
        // A better approach would be to check if the existing one matches, but for simplicity we cancel and re-add.
        await LocalNotifications.cancel({ notifications: [{ id: 1 }] });

        await LocalNotifications.schedule({
          notifications: [{
            title: "How are you feeling?",
            body: "Take a moment to log your mood.",
            id: 1,
            schedule: schedule,
            actionTypeId: "MOOD_CHECK",
            extra: null
          }]
        });
      }

      // 3. Listen for Action
      LocalNotifications.addListener('localNotificationActionPerformed', (notification) => {
        // Open modal on tap or action click
        setShowMoodCheck(true);
      });
    };

    setupNotifications();
  }, []);

  return (
    <div className="min-h-screen flex flex-col max-w-md mx-auto bg-white shadow-xl overflow-hidden relative">
      {/* Header */}
      <header className="bg-gradient-to-r from-pink-400 to-rose-400 p-4 text-white shadow-md z-10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Heart className="w-6 h-6 fill-white" />
            <h1 className="text-xl font-bold tracking-wide">Luna</h1>
          </div>
          <div className="text-xs font-medium bg-white/20 px-2 py-1 rounded-full">
            Offline Capable
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto bg-gray-50 pb-20">
        {activeTab === Tab.TRACKER && <TrackerView />}
        {activeTab === Tab.INSIGHTS && <InsightsView />}
        {activeTab === Tab.AI_ASSISTANT && <AIHealthAssistant />}
        {activeTab === Tab.SETTINGS && <SettingsView />}
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-white border-t border-pink-100 flex justify-around py-3 pb-safe shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] z-20">
        <NavButton
          active={activeTab === Tab.TRACKER}
          onClick={() => setActiveTab(Tab.TRACKER)}
          icon={<Calendar size={24} />}
          label="Tracker"
        />
        <NavButton
          active={activeTab === Tab.INSIGHTS}
          onClick={() => setActiveTab(Tab.INSIGHTS)}
          icon={<Activity size={24} />}
          label="Trends"
        />
        <NavButton
          active={activeTab === Tab.AI_ASSISTANT}
          onClick={() => setActiveTab(Tab.AI_ASSISTANT)}
          icon={<BrainCircuit size={24} />}
          label="AI Help"
        />
        <NavButton
          active={activeTab === Tab.SETTINGS}
          onClick={() => setActiveTab(Tab.SETTINGS)}
          icon={<SettingsIcon size={24} />}
          label="Settings"
        />
      </nav>


      {/* Mood Check Modal */}
      <MoodCheckModal
        isOpen={showMoodCheck}
        onClose={() => setShowMoodCheck(false)}
        currentDate={format(new Date(), 'yyyy-MM-dd')}
      />
    </div >
  );
};

interface NavButtonProps {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
}

const NavButton: React.FC<NavButtonProps> = ({ active, onClick, icon, label }) => (
  <button
    onClick={onClick}
    className={`flex flex-col items-center gap-1 transition-colors duration-200 ${active ? 'text-rose-500' : 'text-gray-400 hover:text-gray-600'
      }`}
  >
    {icon}
    <span className="text-[10px] font-semibold">{label}</span>
  </button>
);

export default App;