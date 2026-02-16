import { DailyLog, CycleStats } from '../types';
import { parseISO, differenceInDays, addDays, startOfDay, isSameDay, compareAsc, format } from 'date-fns';

export const calculateCycleStats = (logs: Record<string, DailyLog>): CycleStats => {
  const sortedDates = Object.keys(logs)
    .filter(date => logs[date].isPeriod)
    .sort();

  if (sortedDates.length === 0) {
    return {
      averageLength: 28,
      lastPeriodStart: null,
      predictedNextStart: null,
      predictedOvulation: null,
      history: []
    };
  }

  // Identify cycles
  // A new cycle starts if the gap between period days is > 7 days (simplified logic)
  const cycles: { startDate: string; length: number }[] = [];
  let currentCycleStart = sortedDates[0];
  let lastPeriodDay = sortedDates[0];

  for (let i = 1; i < sortedDates.length; i++) {
    const currentDay = sortedDates[i];
    const prevDay = sortedDates[i - 1];
    const diff = differenceInDays(parseISO(currentDay), parseISO(prevDay));

    if (diff > 14) { // Assuming a gap > 14 days implies a new cycle
       const length = differenceInDays(parseISO(currentDay), parseISO(currentCycleStart));
       cycles.push({ startDate: currentCycleStart, length });
       currentCycleStart = currentDay;
    }
    lastPeriodDay = currentDay;
  }

  // Add the current ongoing cycle if valid (but we can't determine length yet until next starts)
  // For prediction, we just use the identified past cycles.

  const cycleLengths = cycles.map(c => c.length);
  const averageLength = cycleLengths.length > 0
    ? Math.round(cycleLengths.reduce((a, b) => a + b, 0) / cycleLengths.length)
    : 28;

  const lastStart = currentCycleStart;
  const predictedNext = addDays(parseISO(lastStart), averageLength);
  const predictedOvulation = addDays(parseISO(lastStart), averageLength - 14); // Naive ovulation: 14 days before next

  return {
    averageLength,
    lastPeriodStart: lastStart,
    predictedNextStart: format(predictedNext, 'yyyy-MM-dd'),
    predictedOvulation: format(predictedOvulation, 'yyyy-MM-dd'),
    history: cycles.reverse() // Newest first
  };
};

export const getDayStatus = (dateStr: string, logs: Record<string, DailyLog>, stats: CycleStats) => {
    const log = logs[dateStr];
    const isPeriod = log?.isPeriod || false;
    
    let isPredictedPeriod = false;
    let isOvulation = false;

    if (stats.predictedNextStart) {
        const predStart = parseISO(stats.predictedNextStart);
        const checkDate = parseISO(dateStr);
        // Predict 4 days duration
        const diff = differenceInDays(checkDate, predStart);
        if (diff >= 0 && diff < 4) {
            isPredictedPeriod = true;
        }
    }

    if (stats.predictedOvulation) {
        if (dateStr === stats.predictedOvulation) {
            isOvulation = true;
        }
    }

    return { isPeriod, isPredictedPeriod, isOvulation, log };
};
