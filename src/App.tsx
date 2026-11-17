import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  BarChart3,
  BellRing,
  Flag,
  Home,
  Plus,
  Settings,
  Undo2,
  X,
} from 'lucide-react';
import { AppSettingsView } from './components/AppSettingsView';
import { CounterCard } from './components/CounterCard';
import { CounterEditorView } from './components/CounterEditorView';
import { FocusCounterView } from './components/FocusCounterView';
import { GoalsArchiveView } from './components/GoalsArchiveView';
import { HomeWidget } from './components/HomeWidget';
import { StatsView } from './components/StatsView';
import { SMART_TRANSLATIONS } from './i18n/translations';
import type {
  AppPreferences,
  AppTab,
  CounterColorId,
  CounterItem,
  HistoryRecord,
  SmartCounterStore,
} from './types/counter';
import { App as CapApp } from '@capacitor/app';
import { Capacitor } from '@capacitor/core';
import { playTapFeedback } from './utils/feedback';
import {
  sendDailyGoalReminderNotification,
  syncAndroidStatusBar,
} from './utils/nativeAndroid';
import {
  buildWidgetSnapshot,
  getTodayKey,
  writeWidgetSnapshot,
} from './utils/widgetProvider';

const STORAGE_KEY = 'smart_counter_free_v1';
const MAX_HISTORY = 100;

const DEFAULT_PREFERENCES: AppPreferences = {
  soundEnabled: true,
  hapticEnabled: true,
  hapticIntensity: 'medium',
  notificationsEnabled: true,
  powerSaver: false,
  theme: 'dark',
  language: 'tg',
};

function createStarterCounters(): CounterItem[] {
  const now = Date.now();
  const today = getTodayKey();
  return [
    {
      id: 'starter-slwt',
      name: 'SLWT',
      count: 0,
      limit: 100,
      dailyGoal: 33,
      dailyCount: 0,
      dailyCountDate: today,
      unit: '',
      color: 'terracotta',
      step: 1,
      locked: false,
      allowNegative: false,
      streakEnabled: false,
      streak: 0,
      lastCountDate: null,
      reminderTime: '',
      lastReminderDate: null,
      accessCount: 3,
      archived: false,
      createdAt: now,
      updatedAt: now,
    },
    {
      id: 'starter-istgh',
      name: 'iSTGh',
      count: 0,
      limit: 500,
      dailyGoal: 100,
      dailyCount: 0,
      dailyCountDate: today,
      unit: '',
      color: 'terracotta',
      step: 1,
      locked: false,
      allowNegative: false,
      streakEnabled: true,
      streak: 1,
      lastCountDate: null,
      reminderTime: '',
      lastReminderDate: null,
      accessCount: 1,
      archived: false,
      createdAt: now - 1000,
      updatedAt: now,
    },
    {
      id: 'starter-tsb',
      name: 'TSB',
      count: 4,
      limit: 100,
      dailyGoal: 33,
      dailyCount: 4,
      dailyCountDate: today,
      unit: 'та',
      color: 'terracotta',
      step: 1,
      locked: false,
      allowNegative: false,
      streakEnabled: true,
      streak: 1,
      lastCountDate: today,
      reminderTime: '',
      lastReminderDate: null,
      accessCount: 2,
      archived: false,
      dailyActivity: { [today]: 4 },
      createdAt: now - 2000,
      updatedAt: now,
    },
    {
      id: 'starter-jws',
      name: 'JWS',
      count: 45,
      limit: 100,
      dailyGoal: 100,
      dailyCount: 45,
      dailyCountDate: today,
      unit: '',
      color: 'terracotta',
      step: 1,
      locked: false,
      allowNegative: false,
      streakEnabled: true,
      streak: 1,
      lastCountDate: today,
      reminderTime: '',
      lastReminderDate: null,
      accessCount: 5,
      archived: false,
      dailyActivity: { [today]: 45 },
      createdAt: now - 3000,
      updatedAt: now,
    },
    {
      id: 'starter-ruz',
      name: 'Ruz',
      count: 0,
      limit: 100,
      dailyGoal: 50,
      dailyCount: 0,
      dailyCountDate: today,
      unit: '',
      color: 'plum',
      step: 1,
      locked: false,
      allowNegative: false,
      streakEnabled: true,
      streak: 1,
      lastCountDate: null,
      reminderTime: '',
      lastReminderDate: null,
      accessCount: 1,
      archived: false,
      createdAt: now - 4000,
      updatedAt: now,
    },
  ];
}

function normalizeCountersForToday(list: CounterItem[], today: string): CounterItem[] {
  return list
    .filter((c): c is CounterItem => Boolean(c && typeof c === 'object' && typeof c.id === 'string'))
    .map((c) => {
      const isSameDay = c.dailyCountDate === today;
      return {
        ...c,
        name: typeof c.name === 'string' && c.name.trim() ? c.name : 'Counter',
        count: typeof c.count === 'number' && Number.isFinite(c.count) ? c.count : 0,
        limit: typeof c.limit === 'number' && Number.isFinite(c.limit) ? c.limit : 100,
        step: typeof c.step === 'number' && c.step >= 1 ? c.step : 1,
        dailyGoal: typeof c.dailyGoal === 'number' && c.dailyGoal >= 0 ? c.dailyGoal : 0,
        dailyCount: isSameDay && typeof c.dailyCount === 'number' ? c.dailyCount : 0,
        dailyCountDate: today,
        accessCount: typeof c.accessCount === 'number' ? c.accessCount : 0,
      };
    });
}

function loadStore(): SmartCounterStore {
  const today = getTodayKey();
  if (typeof window === 'undefined') {
    return {
      counters: createStarterCounters(),
      history: [],
      preferences: DEFAULT_PREFERENCES,
    };
  }

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return {
        counters: createStarterCounters(),
        history: [],
        preferences: DEFAULT_PREFERENCES,
      };
    }

    const parsed = JSON.parse(raw) as Partial<SmartCounterStore>;
    const counters = Array.isArray(parsed.counters)
      ? normalizeCountersForToday(parsed.counters, today)
      : createStarterCounters();
    const history = Array.isArray(parsed.history) ? parsed.history.slice(0, MAX_HISTORY) : [];
    const prefs = parsed.preferences;
    const preferences: AppPreferences = {
      soundEnabled: typeof prefs?.soundEnabled === 'boolean' ? prefs.soundEnabled : true,
      hapticEnabled: typeof prefs?.hapticEnabled === 'boolean' ? prefs.hapticEnabled : true,
      hapticIntensity:
        prefs?.hapticIntensity === 'low' || prefs?.hapticIntensity === 'high'
          ? prefs.hapticIntensity
          : 'medium',
      notificationsEnabled:
        typeof prefs?.notificationsEnabled === 'boolean' ? prefs.notificationsEnabled : true,
      powerSaver: typeof prefs?.powerSaver === 'boolean' ? prefs.powerSaver : false,
      theme: prefs?.theme === 'light' ? 'light' : 'dark',
      language: prefs?.language === 'ru' ? 'ru' : prefs?.language === 'en' ? 'en' : 'tg',
    };

    return { counters, history, preferences };
  } catch {
    return {
      counters: createStarterCounters(),
      history: [],
      preferences: DEFAULT_PREFERENCES,
    };
  }
}

function getYesterdayDateString(): string {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return getTodayKey(d);
}

interface UndoState {
  counterId: string;
  counterName: string;
  previousCount: number;
  historyEntryId: string | null;
}

interface ReminderAlert {
  counterId: string;
  counterName: string;
  dailyCount: number;
  dailyGoal: number;
}

export default function App() {
  const initial = useMemo(() => loadStore(), []);

  const [counters, setCounters] = useState<CounterItem[]>(initial.counters);
  const [history, setHistory] = useState<HistoryRecord[]>(initial.history);
  const [preferences, setPreferences] = useState<AppPreferences>(initial.preferences);
  const [todayKey, setTodayKey] = useState<string>(() => getTodayKey());

  const [activeTab, setActiveTab] = useState<AppTab>('home');
  const [focusCounterId, setFocusCounterId] = useState<string | null>(null);
  const [editorState, setEditorState] = useState<
    { mode: 'create' } | { mode: 'edit'; counterId: string } | null
  >(null);
  const [undoState, setUndoState] = useState<UndoState | null>(null);
  const [reminderAlert, setReminderAlert] = useState<ReminderAlert | null>(null);
  const undoTimerRef = useRef<number | null>(null);

  const t = SMART_TRANSLATIONS[preferences.language];

  useEffect(() => {
    const root = document.documentElement;
    if (preferences.theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    if (preferences.powerSaver) {
      root.classList.add('power-saver');
    } else {
      root.classList.remove('power-saver');
    }
    root.lang = preferences.language;

    const metaTheme = document.querySelector('meta[name="theme-color"]');
    if (metaTheme) {
      metaTheme.setAttribute('content', preferences.theme === 'dark' ? '#16110F' : '#F8FAFC');
    }
    void syncAndroidStatusBar(preferences.theme);
  }, [preferences.theme, preferences.language, preferences.powerSaver]);

  const navStateRef = useRef({ editorState, focusCounterId, activeTab });
  navStateRef.current = { editorState, focusCounterId, activeTab };

  useEffect(() => {
    if (!Capacitor.isNativePlatform()) return;
    let listenerHandle: { remove: () => Promise<void> } | null = null;
    void CapApp.addListener('backButton', () => {
      const { editorState: ed, focusCounterId: fid, activeTab: tab } = navStateRef.current;
      if (ed) {
        setEditorState(null);
      } else if (fid) {
        setFocusCounterId(null);
      } else if (tab !== 'home') {
        setActiveTab('home');
      } else {
        void CapApp.minimizeApp();
      }
    }).then((handle) => {
      listenerHandle = handle;
    });

    return () => {
      void listenerHandle?.remove();
    };
  }, []);

  const latestStoreRef = useRef<SmartCounterStore>({
    counters,
    history,
    preferences,
  });
  latestStoreRef.current = { counters, history, preferences };

  const widgetSnapshot = useMemo(() => buildWidgetSnapshot(counters), [counters]);

  useEffect(() => {
    const persistNow = () => {
      try {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(latestStoreRef.current));
        writeWidgetSnapshot(buildWidgetSnapshot(latestStoreRef.current.counters));
      } catch {
        // Ignore storage quota errors
      }
    };

    if (!preferences.powerSaver) {
      persistNow();
      return;
    }

    const timer = window.setTimeout(persistNow, 1500);
    return () => window.clearTimeout(timer);
  }, [counters, history, preferences]);

  useEffect(() => {
    const flushOnHide = () => {
      try {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(latestStoreRef.current));
        writeWidgetSnapshot(buildWidgetSnapshot(latestStoreRef.current.counters));
      } catch {
        // Ignore storage quota errors
      }
    };
    window.addEventListener('pagehide', flushOnHide);
    return () => window.removeEventListener('pagehide', flushOnHide);
  }, []);

  // 24-hour Daily Goal rollover + Daily Reminder Scheduler
  useEffect(() => {
    const checkRolloverAndReminders = () => {
      const now = new Date();
      const currentDay = getTodayKey(now);
      if (currentDay !== todayKey) {
        setTodayKey(currentDay);
        setCounters((prev) => normalizeCountersForToday(prev, currentDay));
      }

      if (!preferences.notificationsEnabled) return;

      const currentHHMM = `${String(now.getHours()).padStart(2, '0')}:${String(
        now.getMinutes(),
      ).padStart(2, '0')}`;

      const dueCounters = latestStoreRef.current.counters.filter((c) => {
        if (c.archived || !c.reminderTime || (c.dailyGoal ?? 0) <= 0) return false;
        const dCount = c.dailyCountDate === currentDay ? c.dailyCount ?? 0 : 0;
        if (dCount >= c.dailyGoal) return false;
        if (c.lastReminderDate === currentDay) return false;
        return currentHHMM >= c.reminderTime;
      });

      if (dueCounters.length > 0) {
        const firstDue = dueCounters[0];
        const dueIds = new Set(dueCounters.map((c) => c.id));
        const dCount = firstDue.dailyCountDate === currentDay ? firstDue.dailyCount ?? 0 : 0;

        setCounters((prev) =>
          prev.map((c) => (dueIds.has(c.id) ? { ...c, lastReminderDate: currentDay } : c)),
        );

        setReminderAlert({
          counterId: firstDue.id,
          counterName: firstDue.name,
          dailyCount: dCount,
          dailyGoal: firstDue.dailyGoal,
        });

        void sendDailyGoalReminderNotification({
          title: `${firstDue.name} — ${t.reminderAlertTitle}`,
          body: `${t.reminderAlertBody} (${dCount}/${firstDue.dailyGoal})`,
        });
      }
    };

    checkRolloverAndReminders();
    const intervalId = window.setInterval(checkRolloverAndReminders, 20000);
    window.addEventListener('focus', checkRolloverAndReminders);
    return () => {
      window.clearInterval(intervalId);
      window.removeEventListener('focus', checkRolloverAndReminders);
    };
  }, [todayKey, preferences.notificationsEnabled, t.reminderAlertTitle, t.reminderAlertBody]);

  useEffect(() => {
    return () => {
      if (undoTimerRef.current !== null) {
        window.clearTimeout(undoTimerRef.current);
      }
    };
  }, []);

  const handleOpenFocus = useCallback((id: string) => {
    setCounters((prev) =>
      prev.map((c) => (c.id === id ? { ...c, accessCount: (c.accessCount ?? 0) + 1 } : c)),
    );
    setFocusCounterId(id);
  }, []);

  const handleIncrement = useCallback(
    (id: string, stepOverride?: number) => {
      const today = getTodayKey();
      const yesterday = getYesterdayDateString();

      setCounters((prev) =>
        prev.map((c) => {
          if (c.id !== id || c.locked) return c;
          const step = stepOverride ?? c.step ?? 1;
          const nextCount = c.count + step;
          const currentDaily = c.dailyCountDate === today ? c.dailyCount ?? 0 : 0;
          const nextDailyCount = currentDaily + step;

          const hitLimit = c.limit > 0 && c.count < c.limit && nextCount >= c.limit;
          const hitDailyGoal =
            (c.dailyGoal ?? 0) > 0 && currentDaily < c.dailyGoal && nextDailyCount >= c.dailyGoal;

          playTapFeedback(
            hitLimit || hitDailyGoal ? 'limit' : 'increment',
            preferences.soundEnabled,
            preferences.hapticEnabled,
            preferences.hapticIntensity,
          );

          let nextStreak = c.streak;
          let nextDate = c.lastCountDate;
          if (c.streakEnabled && c.lastCountDate !== today) {
            nextStreak = c.lastCountDate === yesterday ? c.streak + 1 : Math.max(1, c.streak);
            nextDate = today;
          }

          const prevActivity = c.dailyActivity ?? {};
          const cutoff = new Date();
          cutoff.setDate(cutoff.getDate() - 30);
          const cutoffKey = getTodayKey(cutoff);
          const nextActivity: Record<string, number> = {};
          for (const [k, v] of Object.entries(prevActivity)) {
            if (k >= cutoffKey) nextActivity[k] = v;
          }
          nextActivity[today] = (nextActivity[today] ?? 0) + step;

          return {
            ...c,
            count: nextCount,
            dailyCount: nextDailyCount,
            dailyCountDate: today,
            accessCount: (c.accessCount ?? 0) + 1,
            streak: nextStreak,
            lastCountDate: nextDate,
            dailyActivity: nextActivity,
            updatedAt: Date.now(),
          };
        }),
      );
    },
    [preferences.soundEnabled, preferences.hapticEnabled, preferences.hapticIntensity],
  );

  const handleDecrement = useCallback(
    (id: string) => {
      const today = getTodayKey();
      setCounters((prev) =>
        prev.map((c) => {
          if (c.id !== id || c.locked) return c;
          const step = c.step ?? 1;
          const rawNext = c.count - step;
          const nextCount = c.allowNegative ? rawNext : Math.max(0, rawNext);
          if (nextCount === c.count) return c;

          const currentDaily = c.dailyCountDate === today ? c.dailyCount ?? 0 : 0;
          const nextDailyCount = Math.max(0, currentDaily - step);

          const prevActivity = c.dailyActivity ?? {};
          const nextActivity =
            typeof prevActivity[today] === 'number'
              ? { ...prevActivity, [today]: Math.max(0, prevActivity[today] - step) }
              : c.dailyActivity;

          playTapFeedback(
            'decrement',
            preferences.soundEnabled,
            preferences.hapticEnabled,
            preferences.hapticIntensity,
          );
          return {
            ...c,
            count: nextCount,
            dailyCount: nextDailyCount,
            dailyCountDate: today,
            dailyActivity: nextActivity,
            accessCount: (c.accessCount ?? 0) + 1,
            updatedAt: Date.now(),
          };
        }),
      );
    },
    [preferences.soundEnabled, preferences.hapticEnabled, preferences.hapticIntensity],
  );

  const handleResetToZero = useCallback(
    (id: string) => {
      const target = counters.find((c) => c.id === id);
      if (!target || target.locked || target.count === 0) return;

      playTapFeedback(
        'reset',
        preferences.soundEnabled,
        preferences.hapticEnabled,
        preferences.hapticIntensity,
      );

      const entryId = `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
      const entry: HistoryRecord = {
        id: entryId,
        counterId: target.id,
        counterName: target.name,
        finalCount: target.count,
        targetLimit: target.limit,
        reachedLimit: target.limit > 0 && target.count >= target.limit,
        timestamp: Date.now(),
      };

      setHistory((prev) => [entry, ...prev].slice(0, MAX_HISTORY));
      setCounters((prev) =>
        prev.map((c) =>
          c.id === id
            ? {
                ...c,
                count: 0,
                updatedAt: Date.now(),
              }
            : c,
        ),
      );

      setUndoState({
        counterId: target.id,
        counterName: target.name,
        previousCount: target.count,
        historyEntryId: entryId,
      });

      if (undoTimerRef.current !== null) {
        window.clearTimeout(undoTimerRef.current);
      }
      undoTimerRef.current = window.setTimeout(() => {
        setUndoState(null);
        undoTimerRef.current = null;
      }, 5000);
    },
    [counters, preferences.soundEnabled, preferences.hapticEnabled, preferences.hapticIntensity],
  );

  const handleUndoReset = useCallback(() => {
    if (!undoState) return;
    if (undoTimerRef.current !== null) {
      window.clearTimeout(undoTimerRef.current);
      undoTimerRef.current = null;
    }

    setCounters((prev) =>
      prev.map((c) =>
        c.id === undoState.counterId
          ? { ...c, count: undoState.previousCount, updatedAt: Date.now() }
          : c,
      ),
    );
    if (undoState.historyEntryId) {
      setHistory((prev) => prev.filter((item) => item.id !== undoState.historyEntryId));
    }
    setUndoState(null);
  }, [undoState]);

  const handleStepChange = useCallback((id: string, nextStep: number) => {
    setCounters((prev) =>
      prev.map((c) => (c.id === id ? { ...c, step: nextStep, updatedAt: Date.now() } : c)),
    );
  }, []);

  const handleSaveEditor = useCallback(
    (draft: {
      name: string;
      count: number;
      limit: number;
      dailyGoal: number;
      unit: string;
      color: CounterColorId;
      locked: boolean;
      allowNegative: boolean;
      reminderTime: string;
      streakEnabled: boolean;
    }) => {
      if (!editorState) return;
      const today = getTodayKey();

      if (editorState.mode === 'create') {
        const now = Date.now();
        const newItem: CounterItem = {
          id: `cnt-${now}-${Math.random().toString(36).slice(2, 6)}`,
          name: draft.name,
          count: draft.count,
          limit: draft.limit,
          dailyGoal: draft.dailyGoal,
          dailyCount: draft.count,
          dailyCountDate: today,
          unit: draft.unit,
          color: draft.color,
          step: 1,
          locked: draft.locked,
          allowNegative: draft.allowNegative,
          streakEnabled: draft.streakEnabled,
          streak: draft.streakEnabled ? 1 : 0,
          lastCountDate: draft.streakEnabled ? today : null,
          reminderTime: draft.reminderTime,
          lastReminderDate: null,
          accessCount: 1,
          archived: false,
          dailyActivity: draft.count > 0 ? { [today]: draft.count } : undefined,
          createdAt: now,
          updatedAt: now,
        };
        setCounters((prev) => [newItem, ...prev]);
        setEditorState(null);
        setActiveTab('home');
      } else {
        const editId = editorState.counterId;
        setCounters((prev) =>
          prev.map((c) =>
            c.id === editId
              ? {
                  ...c,
                  ...draft,
                  updatedAt: Date.now(),
                }
              : c,
          ),
        );
        setEditorState(null);
      }
    },
    [editorState],
  );

  const handleArchiveCounter = useCallback((id: string) => {
    setCounters((prev) =>
      prev.map((c) => (c.id === id ? { ...c, archived: !c.archived, updatedAt: Date.now() } : c)),
    );
    setEditorState(null);
    setFocusCounterId((prev) => (prev === id ? null : prev));
  }, []);

  const handleDeleteCounter = useCallback((id: string) => {
    setCounters((prev) => prev.filter((c) => c.id !== id));
    setEditorState(null);
    setFocusCounterId((prev) => (prev === id ? null : prev));
  }, []);

  const activeCounters = useMemo(() => counters.filter((c) => !c.archived), [counters]);

  const focusCounter = useMemo(
    () => counters.find((c) => c.id === focusCounterId) ?? null,
    [counters, focusCounterId],
  );

  const editingCounter = useMemo(() => {
    if (!editorState || editorState.mode !== 'edit') return undefined;
    return counters.find((c) => c.id === editorState.counterId);
  }, [counters, editorState]);

  const headerTitle =
    activeTab === 'home'
      ? t.appName
      : activeTab === 'stats'
        ? t.navStats
        : activeTab === 'goals'
          ? t.navGoals
          : t.navSettings;

  return (
    <div className="min-h-dvh bg-slate-50 text-slate-900 dark:bg-[#16110F] dark:text-[#F5EAE6] transition-colors">
      {/* Compact Sticky Top Header (<= 56px + Android safe-area top) */}
      <header className="sticky top-0 z-30 pt-[env(safe-area-inset-top)] bg-slate-50/95 dark:bg-[#16110F]/95 backdrop-blur-md">
        <div className="max-w-5xl mx-auto h-14 px-4 sm:px-6 flex items-center justify-between gap-3">
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight whitespace-nowrap shrink-0">
            {headerTitle}
          </h1>

          <button
            type="button"
            onClick={() =>
              setPreferences((prev) => ({
                ...prev,
                language: prev.language === 'tg' ? 'ru' : prev.language === 'ru' ? 'en' : 'tg',
              }))
            }
            className="min-h-[44px] min-w-[44px] px-2.5 rounded-2xl flex items-center justify-center text-xs font-bold text-slate-600 dark:text-[#D3C0B9] hover:bg-black/5 dark:hover:bg-white/10 active:scale-[0.94] transition-[transform,background-color] cursor-pointer uppercase"
          >
            {preferences.language === 'tg' ? 'TJ' : preferences.language.toUpperCase()}
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 pt-1 pb-[calc(7.25rem+env(safe-area-inset-bottom))]">
        {activeTab === 'home' && (
          <div className="space-y-4">
            {/* Home Screen Widget Provider (Most Frequently Accessed Counter) */}
            {widgetSnapshot && (
              <HomeWidget
                snapshot={widgetSnapshot}
                powerSaver={preferences.powerSaver}
                onIncrement={handleIncrement}
                onOpenFocus={handleOpenFocus}
                t={t}
              />
            )}

            {/* Counter Cards Grid (No category bar!) */}
            {activeCounters.length === 0 ? (
              <div className="rounded-3xl border border-dashed border-slate-300 dark:border-[#3A2E29] py-12 px-6 text-center">
                <p className="text-base font-bold text-slate-800 dark:text-slate-100">
                  {t.emptyCountersTitle}
                </p>
                <p className="mt-1.5 text-sm text-slate-500 dark:text-slate-400">
                  {t.emptyCountersSub}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                {activeCounters.map((counter) => (
                  <CounterCard
                    key={counter.id}
                    counter={counter}
                    todayKey={todayKey}
                    powerSaver={preferences.powerSaver}
                    onIncrement={handleIncrement}
                    onDecrement={handleDecrement}
                    onReset={handleResetToZero}
                    onOpenFocus={handleOpenFocus}
                    t={t}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'stats' && (
          <StatsView
            counters={counters}
            history={history}
            powerSaver={preferences.powerSaver}
            onClearHistory={() => setHistory([])}
            onOpenFocus={handleOpenFocus}
            t={t}
          />
        )}

        {activeTab === 'goals' && (
          <GoalsArchiveView
            counters={counters}
            onOpenFocus={handleOpenFocus}
            onUnarchive={handleArchiveCounter}
            t={t}
          />
        )}

        {activeTab === 'settings' && (
          <AppSettingsView
            preferences={preferences}
            onUpdatePreferences={(patch) =>
              setPreferences((prev) => ({ ...prev, ...patch }))
            }
            t={t}
          />
        )}
      </main>

      {/* Daily Goal Reminder Banner */}
      {reminderAlert && (
        <div
          role="alert"
          className="fixed top-16 left-4 right-4 sm:left-auto sm:right-6 z-40"
        >
          <div className="max-w-md mx-auto sm:mx-0 rounded-2xl bg-slate-900 text-white dark:bg-[#2A201C] border border-white/10 px-4 py-3 shadow-xl flex items-center justify-between gap-3">
            <div className="flex items-start gap-2.5 min-w-0">
              <BellRing className="w-5 h-5 text-amber-400 mt-0.5 shrink-0" aria-hidden="true" />
              <div className="min-w-0">
                <p className="text-xs font-bold text-amber-300 truncate">
                  {reminderAlert.counterName} · {t.reminderAlertTitle}
                </p>
                <p className="text-xs text-slate-200 mt-0.5">
                  {t.reminderAlertBody} ({reminderAlert.dailyCount}/{reminderAlert.dailyGoal})
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1.5 shrink-0">
              <button
                type="button"
                onClick={() => {
                  const id = reminderAlert.counterId;
                  setReminderAlert(null);
                  handleOpenFocus(id);
                }}
                className="min-h-[36px] px-3 rounded-xl bg-amber-400 text-slate-950 text-xs font-bold cursor-pointer whitespace-nowrap"
              >
                {t.reminderOpenBtn}
              </button>
              <button
                type="button"
                onClick={() => setReminderAlert(null)}
                aria-label={t.cancelLabel}
                className="min-h-[36px] min-w-[36px] rounded-xl flex items-center justify-center hover:bg-white/10 cursor-pointer"
              >
                <X className="w-4 h-4" aria-hidden="true" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Undo Reset Toast */}
      {undoState && (
        <div
          role="status"
          aria-live="polite"
          className="fixed bottom-24 left-4 right-4 sm:left-auto sm:right-6 z-40"
        >
          <div className="max-w-md mx-auto sm:mx-0 rounded-2xl bg-slate-900 text-white dark:bg-[#F4EAE6] dark:text-[#1F1512] px-4 py-2.5 shadow-xl flex items-center justify-between gap-4">
            <span className="text-sm font-semibold truncate">
              {undoState.counterName}: {t.undoResetText} ({undoState.previousCount})
            </span>
            <button
              type="button"
              onClick={handleUndoReset}
              className="min-h-[38px] px-3 rounded-xl bg-white/15 hover:bg-white/25 dark:bg-black/10 dark:hover:bg-black/20 text-xs font-bold inline-flex items-center gap-1.5 whitespace-nowrap shrink-0 cursor-pointer"
            >
              <Undo2 className="w-3.5 h-3.5" aria-hidden="true" />
              <span>{t.undoBtn}</span>
            </button>
          </div>
        </div>
      )}

      {/* Subtle Bottom Fade + Floating Navigation + Add Counter FAB */}
      <div
        aria-hidden="true"
        className="fixed bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-slate-50 via-slate-50/80 to-transparent dark:from-[#16110F] dark:via-[#16110F]/80 pointer-events-none z-20"
      />
      <div className="fixed bottom-[calc(1rem+env(safe-area-inset-bottom))] left-0 right-0 z-30 px-4 pointer-events-none">
        <div className="max-w-md mx-auto flex items-center justify-center gap-3 pointer-events-auto">
          <nav
            aria-label={t.appName}
            className="flex-1 h-14 px-1.5 rounded-full bg-white/95 dark:bg-[#2B374D]/95 backdrop-blur-md border border-slate-200 dark:border-white/10 shadow-xl flex items-center justify-between gap-1"
          >
            {(
              [
                { id: 'home', label: t.navHome, Icon: Home },
                { id: 'stats', label: t.navStats, Icon: BarChart3 },
                { id: 'goals', label: t.navGoals, Icon: Flag },
                { id: 'settings', label: t.navSettings, Icon: Settings },
              ] as const
            ).map(({ id, label, Icon }) => {
              const isActive = activeTab === id;
              return (
                <button
                  key={id}
                  type="button"
                  onClick={() => setActiveTab(id)}
                  aria-label={label}
                  className={`h-11 rounded-full inline-flex items-center justify-center gap-1.5 transition-[transform,background-color,padding] duration-150 active:scale-[0.95] cursor-pointer whitespace-nowrap ${
                    isActive
                      ? 'px-3.5 bg-sky-100 text-sky-900 dark:bg-[#C6D5F7] dark:text-[#152238] font-bold shadow-xs'
                      : 'w-11 text-slate-600 dark:text-[#D0DCF5] hover:bg-black/5 dark:hover:bg-white/10'
                  }`}
                >
                  <Icon className="w-4 h-4 shrink-0" aria-hidden="true" />
                  {isActive && <span className="text-xs">{label}</span>}
                </button>
              );
            })}
          </nav>

          {/* Add Counter (+) FAB */}
          <button
            type="button"
            onClick={() => setEditorState({ mode: 'create' })}
            aria-label={t.addCounter}
            title={t.addCounter}
            className="w-14 h-14 rounded-full bg-sky-600 hover:bg-sky-700 dark:bg-[#36496C] dark:hover:bg-[#425882] text-white shadow-xl flex items-center justify-center transition-transform duration-150 active:scale-[0.92] shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-sky-500/40"
          >
            <Plus className="w-6 h-6 stroke-[2.5]" aria-hidden="true" />
          </button>
        </div>
      </div>

      {/* Full-Screen Focus Counter View */}
      {focusCounter && !editorState && (
        <FocusCounterView
          counter={focusCounter}
          todayKey={todayKey}
          powerSaver={preferences.powerSaver}
          onClose={() => setFocusCounterId(null)}
          onOpenSettings={() => setEditorState({ mode: 'edit', counterId: focusCounter.id })}
          onIncrement={(stepOverride) => handleIncrement(focusCounter.id, stepOverride)}
          onDecrement={() => handleDecrement(focusCounter.id)}
          onResetToZero={() => handleResetToZero(focusCounter.id)}
          onStepChange={(step) => handleStepChange(focusCounter.id, step)}
          t={t}
        />
      )}

      {/* Counter Settings / Create New Counter View */}
      {editorState && (
        <CounterEditorView
          mode={editorState.mode}
          initialCounter={editingCounter}
          counterHistory={
            editingCounter ? history.filter((h) => h.counterId === editingCounter.id) : []
          }
          language={preferences.language}
          onClose={() => setEditorState(null)}
          onSave={handleSaveEditor}
          onResetCounter={handleResetToZero}
          onArchiveCounter={handleArchiveCounter}
          onDeleteCounter={handleDeleteCounter}
          t={t}
        />
      )}
    </div>
  );
}
