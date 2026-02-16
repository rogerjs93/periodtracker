export enum Mood {
  HAPPY = 'Happy',
  SENSITIVE = 'Sensitive',
  SAD = 'Sad',
  IRRITABLE = 'Irritable',
  ANXIOUS = 'Anxious',
  ENERGETIC = 'Energetic',
  TIRED = 'Tired',
  CALM = 'Calm'
}

export enum FlowIntensity {
  NONE = 'None',
  LIGHT = 'Light',
  MEDIUM = 'Medium',
  HEAVY = 'Heavy',
  SPOTTING = 'Spotting'
}

export enum Symptom {
  CRAMPS = 'Cramps',
  HEADACHE = 'Headache',
  BLOATING = 'Bloating',
  ACNE = 'Acne',
  BACKACHE = 'Backache',
  INSOMNIA = 'Insomnia',
  CRAVINGS = 'Cravings'
}

export interface DailyLog {
  date: string; // ISO string YYYY-MM-DD
  isPeriod: boolean;
  flow?: FlowIntensity;
  moods: Mood[];
  symptoms: Symptom[];
  notes?: string;
  temperature?: number; // Basal Body Temp
}

export interface CycleStats {
  averageLength: number;
  lastPeriodStart: string | null;
  predictedNextStart: string | null;
  predictedOvulation: string | null;
  history: { startDate: string; length: number }[];
}

export interface AppSettings {
  userName: string;
  cycleLengthGoal: number; // Default 28
  periodLengthGoal: number; // Default 5
  moodCheckFrequency: number; // Hours between notifications (0 = off)
}
