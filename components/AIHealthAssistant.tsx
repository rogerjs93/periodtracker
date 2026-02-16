import React, { useState, useEffect } from 'react';
import { PetSprite } from './PetSprite';
import { getAnimationForMood, PET_INTERACTIONS } from '../utils/petAnimations';
import { Brain, Sparkles, MessageCircle, Info } from 'lucide-react';
import { generateHealthInsights } from '../services/localService';
import { ParticleEffects } from './ParticleEffects';
import { getLogs, getSettings } from '../utils/storage';
import { calculateCycleStats } from '../utils/cycleHelper';

interface AnalysisResult {
    summary: string;
    tips: string[];
}

export const AIHealthAssistant: React.FC = () => {
    // const { analyzeHealth, isModelReady } = useLocalAI(); // Removed non-existent hook
    const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [manualAnim, setManualAnim] = useState<{ sheet: string, anim: string, icon?: string } | null>(null);
    const [timeOfDay, setTimeOfDay] = useState<'morning' | 'noon' | 'evening' | 'night'>('noon');

    useEffect(() => {
        // Determine time of day for background
        const hour = new Date().getHours();
        if (hour >= 5 && hour < 11) setTimeOfDay('morning');
        else if (hour >= 11 && hour < 17) setTimeOfDay('noon');
        else if (hour >= 17 && hour < 21) setTimeOfDay('evening');
        else setTimeOfDay('night');

        generateDailyInsight();
    }, []);

    // Reset manual animation after it plays (approx 2s)
    useEffect(() => {
        if (manualAnim) {
            const timer = setTimeout(() => {
                setManualAnim(null);
            }, 2000);
            return () => clearTimeout(timer);
        }
    }, [manualAnim]);

    const generateDailyInsight = async () => {
        setLoading(true);
        setError(null);
        try {
            const logs = getLogs();
            const stats = calculateCycleStats(logs);
            const settings = getSettings();

            const result = await generateHealthInsights(logs, stats, settings.userName);
            setAnalysis(result);
        } catch (err) {
            setError("I'm having trouble reading your cycle data right now.");
        } finally {
            setLoading(false);
        }
    };

    // Determine Animation: Manual -> Default
    // Determine Animation: Manual -> Analysis (derived from summary) -> Default
    const currentAnim = manualAnim || (analysis ? getAnimationForMood(analysis.summary) : { sheet: 'main', anim: 'idle' });

    return (
        <div className="h-full flex flex-col relative overflow-hidden bg-slate-50">
            <ParticleEffects />



            {/* Main Content - Centered */}
            <div className="flex-1 flex flex-col items-center justify-center relative z-10 w-full max-w-md mx-auto">

                {/* Speech Bubble */}
                <div className="mb-4 w-[90%] transform transition-all duration-500 ease-out">
                    {loading ? (
                        <div className="bg-white/90 backdrop-blur-md p-6 rounded-[2rem] rounded-bl-sm shadow-lg border border-white/50 animate-pulse mx-auto">
                            <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                        </div>
                    ) : error ? (
                        <div className="bg-red-50 p-6 rounded-[2rem] rounded-bl-sm shadow-md border border-red-100 mx-auto text-red-600 text-center">
                            {error}
                        </div>
                    ) : analysis ? (
                        <div className="bg-white/95 backdrop-blur-xl p-6 rounded-[2rem] rounded-bl-sm shadow-xl border border-white/50 text-center animate-fade-in mx-auto relative group hover:scale-[1.02] transition-transform">
                            <h3 className="text-lg font-bold text-gray-800 mb-1 flex items-center justify-center gap-2">
                                <Sparkles className="w-4 h-4 text-yellow-500" />
                                {analysis.summary}
                            </h3>
                            <div className="mt-2 space-y-1">
                                {analysis.tips.map((tip, i) => (
                                    <p key={i} className="text-gray-600 font-medium leading-relaxed text-sm">
                                        "{tip}"
                                    </p>
                                ))}
                            </div>

                            {/* Triangle for Bubble */}
                            <div className="absolute -bottom-2 left-8 w-4 h-4 bg-white/95 transform rotate-45 border-b border-r border-white/50"></div>
                        </div>
                    ) : (
                        <div className="bg-white/90 backdrop-blur-md p-6 rounded-[2rem] rounded-bl-sm shadow-lg border border-white/50 text-center mx-auto">
                            <p className="text-gray-500 italic">Thinking about your health...</p>
                        </div>
                    )}
                </div>


                {/* The Sprite - Large & Seamless */}
                <div className="relative z-10 w-full flex-1 min-h-0 flex items-center justify-center py-4">
                    <div className="relative w-full h-full max-h-[50vh] aspect-square flex items-center justify-center">
                        <PetSprite
                            sheetKey={currentAnim.sheet}
                            animationKey={currentAnim.anim}
                        />
                    </div>
                </div>
            </div>

        </div>
    );
};
