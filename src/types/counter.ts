export type Language = 'tg' | 'ru' | 'en';

export type ThemeMode = 'light' | 'dark';

export type AppTab = 'home' | 'stats' | 'goals' | 'settings';

export type HapticIntensity = 'low' | 'medium' | 'high';

export type CounterColorId =
  | 'terracotta'
  | 'olive'
  | 'teal'
  | 'gold'
  | 'amber'
  | 'navy'
  | 'plum';

export interface HistoryRecord {
  id: string;
  counterId: string;
  counterName: string;
  finalCount: number;
  targetLimit: number;
  reachedLimit: boolean;
  timestamp: number;
}

export interface CounterItem {
  id: string;
  name: string;
  count: number;
  limit: number;
  dailyGoal: number;
  dailyCount: number;
  dailyCountDate: string;
  unit: string;
  color: CounterColorId;
  step: number;
  locked: boolean;
  allowNegative: boolean;
  streakEnabled: boolean;
  streak: number;
  lastCountDate: string | null;
  reminderTime: string;
  lastReminderDate?: string | null;
  accessCount: number;
  archived: boolean;
  dailyActivity?: Record<string, number>;
  createdAt: number;
  updatedAt: number;
}

export interface AppPreferences {
  soundEnabled: boolean;
  hapticEnabled: boolean;
  hapticIntensity: HapticIntensity;
  notificationsEnabled: boolean;
  powerSaver: boolean;
  theme: ThemeMode;
  language: Language;
}

export interface SmartCounterStore {
  counters: CounterItem[];
  history: HistoryRecord[];
  preferences: AppPreferences;
}

export interface HomeWidgetSnapshot {
  counterId: string;
  name: string;
  count: number;
  limit: number;
  dailyGoal: number;
  dailyCount: number;
  unit: string;
  color: CounterColorId;
  accessCount: number;
  locked: boolean;
  step: number;
  updatedAt: number;
}
