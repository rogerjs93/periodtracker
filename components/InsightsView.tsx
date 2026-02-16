import React, { useEffect, useState } from 'react';
import { getLogs } from '../utils/storage';
import { calculateCycleStats } from '../utils/cycleHelper';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { CycleStats, DailyLog } from '../types';

export const InsightsView: React.FC = () => {
  const [stats, setStats] = useState<CycleStats | null>(null);
  const [symptomCounts, setSymptomCounts] = useState<{name: string, count: number}[]>([]);

  useEffect(() => {
    const logs = getLogs();
    const cycleStats = calculateCycleStats(logs);
    setStats(cycleStats);

    // Calculate symptom frequency
    const symptoms: Record<string, number> = {};
    Object.values(logs).forEach(log => {
        log.symptoms.forEach(s => {
            symptoms[s] = (symptoms[s] || 0) + 1;
        });
    });
    const symptomData = Object.entries(symptoms)
        .map(([name, count]) => ({ name, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 5);
    setSymptomCounts(symptomData);

  }, []);

  if (!stats) return <div className="p-8 text-center text-gray-400">Loading insights...</div>;

  const chartData = stats.history.map((cycle, i) => ({
    name: `Cycle ${i + 1}`,
    length: cycle.length
  }));

  return (
    <div className="p-4 space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">Your Patterns</h2>
      
      {/* Cycle Length Chart */}
      <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
        <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4">Cycle Length History</h3>
        {chartData.length > 1 ? (
            <div className="h-48 w-full">
                <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                    <XAxis dataKey="name" tick={{fontSize: 10}} tickLine={false} axisLine={false} />
                    <YAxis domain={['dataMin - 2', 'dataMax + 2']} hide />
                    <Tooltip 
                        contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)'}} 
                    />
                    <Line 
                        type="monotone" 
                        dataKey="length" 
                        stroke="#fb7185" 
                        strokeWidth={3} 
                        dot={{fill: '#fb7185', strokeWidth: 2}} 
                    />
                </LineChart>
                </ResponsiveContainer>
            </div>
        ) : (
            <div className="h-32 flex items-center justify-center text-gray-400 text-sm bg-gray-50 rounded-lg">
                Not enough data yet. Log more cycles!
            </div>
        )}
      </div>

      {/* Top Symptoms */}
      <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
        <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4">Top Symptoms</h3>
        {symptomCounts.length > 0 ? (
             <div className="h-48 w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={symptomCounts} layout="vertical">
                        <XAxis type="number" hide />
                        <YAxis dataKey="name" type="category" width={80} tick={{fontSize: 11}} axisLine={false} tickLine={false} />
                        <Tooltip cursor={{fill: 'transparent'}} contentStyle={{borderRadius: '8px'}} />
                        <Bar dataKey="count" fill="#818cf8" radius={[0, 4, 4, 0]} barSize={20} />
                    </BarChart>
                </ResponsiveContainer>
             </div>
        ) : (
             <div className="h-32 flex items-center justify-center text-gray-400 text-sm bg-gray-50 rounded-lg">
                No symptoms logged yet.
            </div>
        )}
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-rose-50 p-4 rounded-xl">
            <div className="text-rose-400 text-xs font-bold uppercase">Avg Cycle</div>
            <div className="text-3xl font-bold text-rose-600 mt-1">{stats.averageLength}</div>
            <div className="text-rose-400 text-xs">Days</div>
        </div>
        <div className="bg-indigo-50 p-4 rounded-xl">
            <div className="text-indigo-400 text-xs font-bold uppercase">Logged Cycles</div>
            <div className="text-3xl font-bold text-indigo-600 mt-1">{stats.history.length}</div>
            <div className="text-indigo-400 text-xs">Total</div>
        </div>
      </div>
    </div>
  );
};
