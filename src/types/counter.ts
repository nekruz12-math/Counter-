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

export interface CounterItem {
  id: string;
  name: string;
  note?: string;
  count: number;
  limit: number;
  dailyGoal: number;
  dailyCount: number;
  dailyCountDate: string;
  unit: string;
  color: CounterColorId;
  step: number;
  streakEnabled: boolean;
  streak: number;
  lastCountDate: string | null;
  reminderTime: string;
  lastReminderDate?: string | null;
  accessCount: number;
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
  scheduleDarkMode: boolean;
  solarLatitude?: number | null;
  solarLongitude?: number | null;
  pinCode: string | null;
  biometricEnabled: boolean;
  biometricCredentialId?: string | null;
  language: Language;
}

export interface SmartCounterStore {
  counters: CounterItem[];
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
  step: number;
  updatedAt: number;
}
