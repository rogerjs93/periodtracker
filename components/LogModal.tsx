import React, { useState } from 'react';
import { format, parseISO } from 'date-fns';
import { X, Droplet, Smile, AlertCircle, Save } from 'lucide-react';
import { DailyLog, FlowIntensity, Mood, Symptom } from '../types';

interface LogModalProps {
  dateStr: string;
  existingLog?: DailyLog;
  onClose: () => void;
  onSave: (log: DailyLog) => void;
}

export const LogModal: React.FC<LogModalProps> = ({ dateStr, existingLog, onClose, onSave }) => {
  const [isPeriod, setIsPeriod] = useState(existingLog?.isPeriod || false);
  const [flow, setFlow] = useState<FlowIntensity>(existingLog?.flow || FlowIntensity.NONE);
  const [selectedMoods, setSelectedMoods] = useState<Mood[]>(existingLog?.moods || []);
  const [selectedSymptoms, setSelectedSymptoms] = useState<Symptom[]>(existingLog?.symptoms || []);
  const [notes, setNotes] = useState(existingLog?.notes || '');

  const toggleSelection = <T,>(item: T, list: T[], setList: (l: T[]) => void) => {
    if (list.includes(item)) {
      setList(list.filter(i => i !== item));
    } else {
      setList([...list, item]);
    }
  };

  const handleSave = () => {
    onSave({
      date: dateStr,
      isPeriod,
      flow: isPeriod ? flow : FlowIntensity.NONE,
      moods: selectedMoods,
      symptoms: selectedSymptoms,
      notes
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-2xl w-full max-w-sm max-h-[90vh] overflow-y-auto shadow-2xl flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-gray-100 flex items-center justify-between sticky top-0 bg-white z-10">
          <div>
            <h3 className="text-lg font-bold text-gray-800">Log Details</h3>
            <p className="text-xs text-gray-500">{format(parseISO(dateStr), 'EEEE, MMMM do')}</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition"><X size={20} className="text-gray-500" /></button>
        </div>

        <div className="p-6 space-y-6">
          
          {/* Period Toggle */}
          <div className="space-y-3">
             <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 text-gray-700 font-semibold">
                    <div className={`p-2 rounded-lg ${isPeriod ? 'bg-rose-100 text-rose-600' : 'bg-gray-100 text-gray-400'}`}>
                        <Droplet size={20} className={isPeriod ? 'fill-rose-600' : ''} />
                    </div>
                    Period today?
                </label>
                <div 
                    onClick={() => { setIsPeriod(!isPeriod); if(!isPeriod) setFlow(FlowIntensity.MEDIUM); }}
                    className={`w-12 h-6 rounded-full p-1 cursor-pointer transition-colors ${isPeriod ? 'bg-rose-500' : 'bg-gray-200'}`}
                >
                    <div className={`w-4 h-4 rounded-full bg-white shadow-sm transition-transform ${isPeriod ? 'translate-x-6' : 'translate-x-0'}`} />
                </div>
             </div>

             {isPeriod && (
                 <div className="grid grid-cols-4 gap-2 pt-2">
                    {Object.values(FlowIntensity).filter(f => f !== 'None').map((f) => (
                        <button
                            key={f}
                            onClick={() => setFlow(f)}
                            className={`py-2 px-1 text-xs rounded-lg border transition-all ${flow === f ? 'border-rose-500 bg-rose-50 text-rose-700 font-bold' : 'border-gray-200 text-gray-500'}`}
                        >
                            {f}
                        </button>
                    ))}
                 </div>
             )}
          </div>

          {/* Moods */}
          <div className="space-y-2">
            <h4 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                <Smile size={16} /> Mood
            </h4>
            <div className="flex flex-wrap gap-2">
                {Object.values(Mood).map(m => (
                    <button
                        key={m}
                        onClick={() => toggleSelection(m, selectedMoods, setSelectedMoods)}
                        className={`px-3 py-1.5 text-xs rounded-full border transition-colors ${
                            selectedMoods.includes(m) 
                            ? 'bg-indigo-100 border-indigo-300 text-indigo-700' 
                            : 'bg-white border-gray-200 text-gray-600 hover:border-gray-300'
                        }`}
                    >
                        {m}
                    </button>
                ))}
            </div>
          </div>

          {/* Symptoms */}
          <div className="space-y-2">
            <h4 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                <AlertCircle size={16} /> Symptoms
            </h4>
            <div className="flex flex-wrap gap-2">
                {Object.values(Symptom).map(s => (
                    <button
                        key={s}
                        onClick={() => toggleSelection(s, selectedSymptoms, setSelectedSymptoms)}
                        className={`px-3 py-1.5 text-xs rounded-full border transition-colors ${
                            selectedSymptoms.includes(s) 
                            ? 'bg-orange-100 border-orange-300 text-orange-700' 
                            : 'bg-white border-gray-200 text-gray-600 hover:border-gray-300'
                        }`}
                    >
                        {s}
                    </button>
                ))}
            </div>
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <h4 className="text-sm font-semibold text-gray-700">Notes</h4>
            <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="How are you feeling?"
                className="w-full h-24 p-3 text-sm rounded-xl border border-gray-200 focus:border-rose-300 focus:ring focus:ring-rose-100 transition-all outline-none resize-none"
            />
          </div>

        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-100 sticky bottom-0 bg-white">
            <button 
                onClick={handleSave}
                className="w-full py-3 bg-gray-900 text-white rounded-xl font-semibold shadow-lg hover:bg-gray-800 transition active:scale-[0.98] flex items-center justify-center gap-2"
            >
                <Save size={18} /> Save Entry
            </button>
        </div>
      </div>
    </div>
  );
};
