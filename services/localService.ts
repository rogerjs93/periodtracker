import * as tf from '@tensorflow/tfjs';
import { DailyLog, CycleStats, Mood, Symptom } from '../types';

/**
 * Predicts the next cycle length using a simple linear regression model (TensorFlow.js)
 * based on the last 6 cycles.
 */
export const predictCycleLength = async (history: { length: number }[]): Promise<number> => {
    if (history.length < 2) return 28; // Default fallback

    // Use at most last 6 cycles for relevant trend
    const recentHistory = history.slice(-6);
    const xValues = recentHistory.map((_, i) => i);
    const yValues = recentHistory.map(h => h.length);

    // Create tensors
    const xs = tf.tensor2d(xValues, [xValues.length, 1]);
    const ys = tf.tensor2d(yValues, [yValues.length, 1]);

    // Simple linear regression model
    const model = tf.sequential();
    model.add(tf.layers.dense({ units: 1, inputShape: [1] }));
    model.compile({ loss: 'meanSquaredError', optimizer: 'sgd' });

    // Train the model (very quickly)
    await model.fit(xs, ys, { epochs: 50, verbose: 0 });

    // Predict the next value (index = length)
    const prediction = model.predict(tf.tensor2d([recentHistory.length], [1, 1])) as tf.Tensor;
    const predictedLength = (await prediction.data())[0];

    // Cleanup tensors
    xs.dispose();
    ys.dispose();
    model.dispose();
    prediction.dispose();

    return Math.round(predictedLength);
};

export const generateHealthInsights = async (logs: Record<string, DailyLog>, stats: CycleStats, userName: string) => {
    // 1. Analyze current state
    const today = new Date();
    const lastPeriod = stats.lastPeriodStart ? new Date(stats.lastPeriodStart) : null;

    let daysSincePeriod = 0;
    if (lastPeriod) {
        const diffTime = Math.abs(today.getTime() - lastPeriod.getTime());
        daysSincePeriod = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    }

    const tips: string[] = [];
    let summary = `Hello ${userName}, `;

    // 2. Science-Based Insights per Phase
    if (!lastPeriod) {
        summary += "start tracking your period to get personalized insights!";
        tips.push("Log your first period to unlock predictions.");
    } else {
        if (daysSincePeriod < 6) {
            // Menstrual Phase (Day 1-5)
            summary += "you are in your Menstrual phase. Your energy is naturally lower.";
            tips.push("🥗 **Nutrition**: Focus on iron-rich foods (spinach, lentils) and Vitamin C.");
            tips.push("🧘‍♀️ **Movement**: Gentle yoga or walking is best. Avoid high-intensity cardio.");
            tips.push("💤 **Rest**: Your body is working hard. Prioritize sleep.");
        } else if (daysSincePeriod < 12) {
            // Follicular Phase (Day 6-11)
            summary += "you are in the Follicular phase. Estrogen is rising, boosting your energy!";
            tips.push("⚡ **Exercise**: Great time for HIIT, running, or strength training.");
            tips.push("💡 **Creativity**: Your brain is primed for learning and complex tasks.");
            tips.push("🥗 **Nutrition**: Fermented foods (kimchi, yogurt) support hormone metabolism.");
        } else if (daysSincePeriod < 17) {
            // Ovulatory Phase (Day 12-16)
            summary += "you are likely approaching Ovulation. You may feel your most social and confident.";
            tips.push("🗣️ **Social**: Perfect time for big presentations or social gatherings.");
            tips.push("🔥 **Energy**: You're at peak performance, but don't overtrain.");
            tips.push("🥗 **Nutrition**: Cruciferous veggies (broccoli) help manage estrogen spikes.");
        } else {
            // Luteal Phase (Day 17-28+)
            summary += "you are in the Luteal phase. Progesterone is dominant, suggesting a time to slow down.";
            tips.push("🧹 **Focus**: Good for wrapping up projects and organizing.");
            tips.push("🍫 **Cravings**: Dark chocolate provides magnesium to fight fatigue.");
            tips.push("🍞 **Nutrition**: Complex carbs (oats, sweet potato) help stabilize mood.");
            tips.push("🧘‍♀️ **Mindset**: Be gentle with yourself if you feel lower energy.");
        }
    }

    // 3. Symptom Management (Targeted Advice)
    const recentLogs = Object.values(logs).sort((a, b) => b.date.localeCompare(a.date)).slice(0, 3);
    const recentSymptoms = new Set(recentLogs.flatMap(l => l.symptoms));

    if (recentSymptoms.has(Symptom.CRAMPS)) {
        tips.push("💊 **Cramps**: Try a warm bath with Epsom salts or ginger tea.");
    }
    if (recentSymptoms.has(Symptom.BLOATING)) {
        tips.push("🎈 **Bloating**: Dandelion tea and reducing salt can relieve water retention.");
    }
    if (recentSymptoms.has(Symptom.INSOMNIA)) {
        tips.push("🌙 **Sleep**: Magnesium glycinate before bed can improve sleep quality.");
    }
    if (recentSymptoms.has(Symptom.HEADACHE)) {
        tips.push("💧 **Headache**: Hydrate! Sometimes it's just dehydration.");
    }
    if (recentSymptoms.has(Symptom.ACNE)) {
        tips.push("skin **Skin**: Zinc supplements may help reduce cyclical breakouts.");
    }

    // Uniqueness & Fallback
    if (tips.length < 3) {
        tips.push("💧 **Hydration**: Aim for 2 liters of water today.");
        tips.push("📝 **Journaling**: Tracking your mood helps identify patterns.");
    }

    // Shuffle and pick top 4 tips
    const shuffledTips = tips.sort(() => 0.5 - Math.random());

    return {
        summary,
        tips: shuffledTips.slice(0, 4) // Return 4 actionable tips
    };
};

export const chatWithAI = async (message: string, context: string) => {
    // Simple mock response for now
    if (message.toLowerCase().includes("pain") || message.toLowerCase().includes("cramp")) {
        return "I'm sorry you're in pain. Heat, rest, and hydration are your best friends right now. If it's severe, please consult a doctor.";
    }
    if (message.toLowerCase().includes("happy") || message.toLowerCase().includes("good")) {
        return "I'm glad to hear that! Keep up the good vibes.";
    }
    return "I am a local health assistant. I can help track your cycle and suggest wellness tips based on your logs!";
};
