import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  BarChart3,
  BellRing,
  Flag,
  Home,
  Lock,
  Plus,
  Settings,
  Undo2,
  X,
} from 'lucide-react';
import { App as CapApp } from '@capacitor/app';
import { Capacitor } from '@capacitor/core';
import { AppSettingsView } from './components/AppSettingsView';
import { CounterCard } from './components/CounterCard';
import { CounterEditorView } from './components/CounterEditorView';
import { FocusCounterView } from './components/FocusCounterView';
import { GoalsArchiveView } from './components/GoalsArchiveView';
import { PinLockScreen } from './components/PinLockScreen';
import { StatsView } from './components/StatsView';
import { SMART_TRANSLATIONS } from './i18n/translations';
import type {
  AppPreferences,
  AppTab,
  CounterColorId,
  CounterItem,
  SmartCounterStore,
} from './types/counter';
import { playTapFeedback } from './utils/feedback';
import {
  sendDailyGoalReminderNotification,
  syncAndroidStatusBar,
} from './utils/nativeAndroid';
import { getScheduledThemeForNow } from './utils/solarSchedule';
import {
  loadStoreWithMigration,
  normalizeCountersForToday,
  persistStoreImmediately,
  recoverStoreFromIndexedDBIfNeeded,
} from './utils/storageMigration';
import { getTodayKey } from './utils/widgetProvider';

function getYesterdayDateString(): string {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return getTodayKey(d);
}

interface UndoState {
  counterId: string;
  counterName: string;
  previousCount: number;
}

interface ReminderAlert {
  counterId: string;
  counterName: string;
  dailyCount: number;
  dailyGoal: number;
}

export default function App() {
  const initial = useMemo(() => loadStoreWithMigration(), []);

  const [counters, setCounters] = useState<CounterItem[]>(initial.counters);
  const [preferences, setPreferences] = useState<AppPreferences>(initial.preferences);
  const [todayKey, setTodayKey] = useState<string>(() => getTodayKey());
  const [isLocked, setIsLocked] = useState<boolean>(() => Boolean(initial.preferences.pinCode));

  // Recover user data from IndexedDB vault if WebView localStorage was ever reset during an OS/APK update
  useEffect(() => {
    let mounted = true;
    void recoverStoreFromIndexedDBIfNeeded(initial).then((recovered) => {
      if (mounted && recovered) {
        setCounters(recovered.counters);
        setPreferences(recovered.preferences);
        if (recovered.preferences.pinCode) {
          setIsLocked(true);
        }
      }
    });
    return () => {
      mounted = false;
    };
  }, [initial]);

  const [activeTab, setActiveTab] = useState<AppTab>('home');
  const [focusCounterId, setFocusCounterId] = useState<string | null>(null);
  const [editorState, setEditorState] = useState<
    { mode: 'create' } | { mode: 'edit'; counterId: string } | null
  >(null);
  const [undoState, setUndoState] = useState<UndoState | null>(null);
  const [reminderAlert, setReminderAlert] = useState<ReminderAlert | null>(null);
  const undoTimerRef = useRef<number | null>(null);

  const t = SMART_TRANSLATIONS[preferences.language];

  // Apply Dark/Light theme, Power Saver class, and Android StatusBar
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
      metaTheme.setAttribute('content', preferences.theme === 'dark' ? '#121316' : '#F4F5F7');
    }
    void syncAndroidStatusBar(preferences.theme);
  }, [preferences.theme, preferences.language, preferences.powerSaver]);

  const latestStoreRef = useRef<SmartCounterStore>({
    counters,
    preferences,
  });
  latestStoreRef.current = { counters, preferences };

  // Immediate Auto-Save on every state change (triple-key primary + backup + vault + IDB)
  useEffect(() => {
    persistStoreImmediately(latestStoreRef.current);
  }, [counters, preferences]);

  // Extra lifecycle Auto-Save hooks + Auto-Lock when app is minimized/backgrounded on Android
  useEffect(() => {
    const flushNow = () => {
      persistStoreImmediately(latestStoreRef.current);
    };
    const onVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        flushNow();
        if (latestStoreRef.current.preferences.pinCode) {
          setIsLocked(true);
        }
      }
    };
    window.addEventListener('pagehide', flushNow);
    window.addEventListener('beforeunload', flushNow);
    window.addEventListener('blur', flushNow);
    document.addEventListener('visibilitychange', onVisibilityChange);

    let stateHandle: { remove: () => Promise<void> } | null = null;
    if (Capacitor.isNativePlatform()) {
      void CapApp.addListener('appStateChange', ({ isActive }) => {
        flushNow();
        if (!isActive && latestStoreRef.current.preferences.pinCode) {
          setIsLocked(true);
        }
      }).then((h) => {
        stateHandle = h;
      });
    }

    return () => {
      window.removeEventListener('pagehide', flushNow);
      window.removeEventListener('beforeunload', flushNow);
      window.removeEventListener('blur', flushNow);
      document.removeEventListener('visibilitychange', onVisibilityChange);
      void stateHandle?.remove();
    };
  }, []);

  // Native Android Back Button handling
  const navStateRef = useRef({ editorState, focusCounterId, activeTab, isLocked });
  navStateRef.current = { editorState, focusCounterId, activeTab, isLocked };

  useEffect(() => {
    if (!Capacitor.isNativePlatform()) return;
    let listenerHandle: { remove: () => Promise<void> } | null = null;
    void CapApp.addListener('backButton', () => {
      const { editorState: ed, focusCounterId: fid, activeTab: tab, isLocked: locked } =
        navStateRef.current;
      if (locked) {
        void CapApp.minimizeApp();
      } else if (ed) {
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

  // 24-hour Daily Goal rollover + Solar Schedule Dark Mode + Daily Reminder Scheduler
  useEffect(() => {
    const checkSchedules = () => {
      const now = new Date();
      const currentDay = getTodayKey(now);
      if (currentDay !== todayKey) {
        setTodayKey(currentDay);
        setCounters((prev) => {
          const next = normalizeCountersForToday(prev, currentDay);
          persistStoreImmediately({ counters: next, preferences: latestStoreRef.current.preferences });
          return next;
        });
      }

      // Check Schedule Dark Mode (Sunrise / Sunset)
      const currentPrefs = latestStoreRef.current.preferences;
      if (currentPrefs.scheduleDarkMode) {
        const { theme: targetTheme } = getScheduledThemeForNow(
          now,
          currentPrefs.solarLatitude,
          currentPrefs.solarLongitude,
        );
        if (targetTheme !== currentPrefs.theme) {
          setPreferences((prev) => ({ ...prev, theme: targetTheme }));
        }
      }

      if (!currentPrefs.notificationsEnabled) return;

      const currentHHMM = `${String(now.getHours()).padStart(2, '0')}:${String(
        now.getMinutes(),
      ).padStart(2, '0')}`;

      const dueCounters = latestStoreRef.current.counters.filter((c) => {
        if (!c.reminderTime || (c.dailyGoal ?? 0) <= 0) return false;
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

    checkSchedules();
    const intervalId = window.setInterval(checkSchedules, 20000);
    window.addEventListener('focus', checkSchedules);
    return () => {
      window.clearInterval(intervalId);
      window.removeEventListener('focus', checkSchedules);
    };
  }, [
    todayKey,
    preferences.notificationsEnabled,
    preferences.scheduleDarkMode,
    preferences.solarLatitude,
    preferences.solarLongitude,
    t.reminderAlertTitle,
    t.reminderAlertBody,
  ]);

  useEffect(() => {
    return () => {
      if (undoTimerRef.current !== null) {
        window.clearTimeout(undoTimerRef.current);
      }
    };
  }, []);

  const handleOpenFocus = useCallback(
    (id: string) => {
      playTapFeedback(
        'increment',
        preferences.soundEnabled,
        preferences.hapticEnabled,
        preferences.hapticIntensity,
      );
      setCounters((prev) => {
        const next = prev.map((c) =>
          c.id === id ? { ...c, accessCount: (c.accessCount ?? 0) + 1 } : c,
        );
        persistStoreImmediately({ counters: next, preferences: latestStoreRef.current.preferences });
        return next;
      });
      setFocusCounterId(id);
    },
    [preferences.soundEnabled, preferences.hapticEnabled, preferences.hapticIntensity],
  );

  const handleIncrement = useCallback(
    (id: string, stepOverride?: number) => {
      const today = getTodayKey();
      const yesterday = getYesterdayDateString();
      const target = latestStoreRef.current.counters.find((c) => c.id === id);
      if (!target) return;

      const step = stepOverride ?? target.step ?? 1;
      const nextCount = target.count + step;
      const currentDaily = target.dailyCountDate === today ? target.dailyCount ?? 0 : 0;
      const nextDailyCount = currentDaily + step;

      const hitLimit = target.limit > 0 && target.count < target.limit && nextCount >= target.limit;
      const hitDailyGoal =
        (target.dailyGoal ?? 0) > 0 &&
        currentDaily < target.dailyGoal &&
        nextDailyCount >= target.dailyGoal;

      // Fire haptic + sound synchronously inside user gesture
      playTapFeedback(
        hitLimit || hitDailyGoal ? 'limit' : 'increment',
        preferences.soundEnabled,
        preferences.hapticEnabled,
        preferences.hapticIntensity,
      );

      setCounters((prev) => {
        const next = prev.map((c) => {
          if (c.id !== id) return c;

          let nextStreak = c.streak;
          let nextDate = c.lastCountDate;
          if (c.streakEnabled && c.lastCountDate !== today) {
            if (c.lastCountDate === null) {
              nextStreak = Math.max(1, c.streak);
            } else if (c.lastCountDate === yesterday) {
              nextStreak = c.streak + 1;
            } else {
              nextStreak = 1;
            }
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
            count: c.count + step,
            dailyCount: (c.dailyCountDate === today ? c.dailyCount ?? 0 : 0) + step,
            dailyCountDate: today,
            accessCount: (c.accessCount ?? 0) + 1,
            streak: nextStreak,
            lastCountDate: nextDate,
            dailyActivity: nextActivity,
            updatedAt: Date.now(),
          };
        });
        persistStoreImmediately({ counters: next, preferences: latestStoreRef.current.preferences });
        return next;
      });
    },
    [preferences.soundEnabled, preferences.hapticEnabled, preferences.hapticIntensity],
  );

  const handleDecrement = useCallback(
    (id: string) => {
      const today = getTodayKey();
      const target = latestStoreRef.current.counters.find((c) => c.id === id);
      if (!target || target.count <= 0) return;

      // Fire haptic + sound synchronously inside user gesture
      playTapFeedback(
        'decrement',
        preferences.soundEnabled,
        preferences.hapticEnabled,
        preferences.hapticIntensity,
      );

      setCounters((prev) => {
        const next = prev.map((c) => {
          if (c.id !== id) return c;
          const step = c.step ?? 1;
          const nextCount = Math.max(0, c.count - step);
          if (nextCount === c.count) return c;

          const currentDaily = c.dailyCountDate === today ? c.dailyCount ?? 0 : 0;
          const nextDailyCount = Math.max(0, currentDaily - step);

          const prevActivity = c.dailyActivity ?? {};
          const nextActivity =
            typeof prevActivity[today] === 'number'
              ? { ...prevActivity, [today]: Math.max(0, prevActivity[today] - step) }
              : c.dailyActivity;

          return {
            ...c,
            count: nextCount,
            dailyCount: nextDailyCount,
            dailyCountDate: today,
            dailyActivity: nextActivity,
            accessCount: (c.accessCount ?? 0) + 1,
            updatedAt: Date.now(),
          };
        });
        persistStoreImmediately({ counters: next, preferences: latestStoreRef.current.preferences });
        return next;
      });
    },
    [preferences.soundEnabled, preferences.hapticEnabled, preferences.hapticIntensity],
  );

  const handleResetToZero = useCallback(
    (id: string) => {
      const target = latestStoreRef.current.counters.find((c) => c.id === id);
      if (!target || target.count === 0) return;

      // Fire haptic + sound synchronously inside user gesture
      playTapFeedback(
        'reset',
        preferences.soundEnabled,
        preferences.hapticEnabled,
        preferences.hapticIntensity,
      );

      setCounters((prev) => {
        const next = prev.map((c) =>
          c.id === id
            ? {
                ...c,
                count: 0,
                updatedAt: Date.now(),
              }
            : c,
        );
        persistStoreImmediately({ counters: next, preferences: latestStoreRef.current.preferences });
        return next;
      });

      setUndoState({
        counterId: target.id,
        counterName: target.name,
        previousCount: target.count,
      });

      if (undoTimerRef.current !== null) {
        window.clearTimeout(undoTimerRef.current);
      }
      undoTimerRef.current = window.setTimeout(() => {
        setUndoState(null);
        undoTimerRef.current = null;
      }, 5000);
    },
    [preferences.soundEnabled, preferences.hapticEnabled, preferences.hapticIntensity],
  );

  const handleUndoReset = useCallback(() => {
    if (!undoState) return;
    if (undoTimerRef.current !== null) {
      window.clearTimeout(undoTimerRef.current);
      undoTimerRef.current = null;
    }

    playTapFeedback(
      'increment',
      preferences.soundEnabled,
      preferences.hapticEnabled,
      preferences.hapticIntensity,
    );

    setCounters((prev) => {
      const next = prev.map((c) =>
        c.id === undoState.counterId
          ? { ...c, count: undoState.previousCount, updatedAt: Date.now() }
          : c,
      );
      persistStoreImmediately({ counters: next, preferences: latestStoreRef.current.preferences });
      return next;
    });
    setUndoState(null);
  }, [
    undoState,
    preferences.soundEnabled,
    preferences.hapticEnabled,
    preferences.hapticIntensity,
  ]);

  const handleStepChange = useCallback(
    (id: string, nextStep: number) => {
      playTapFeedback(
        'increment',
        preferences.soundEnabled,
        preferences.hapticEnabled,
        preferences.hapticIntensity,
      );
      setCounters((prev) => {
        const next = prev.map((c) =>
          c.id === id ? { ...c, step: nextStep, updatedAt: Date.now() } : c,
        );
        persistStoreImmediately({ counters: next, preferences: latestStoreRef.current.preferences });
        return next;
      });
    },
    [preferences.soundEnabled, preferences.hapticEnabled, preferences.hapticIntensity],
  );

  const handleNoteChange = useCallback((id: string, nextNote: string) => {
    setCounters((prev) => {
      const next = prev.map((c) =>
        c.id === id ? { ...c, note: nextNote, updatedAt: Date.now() } : c,
      );
      persistStoreImmediately({ counters: next, preferences: latestStoreRef.current.preferences });
      return next;
    });
  }, []);

  const handleSaveEditor = useCallback(
    (draft: {
      name: string;
      note: string;
      count: number;
      limit: number;
      dailyGoal: number;
      unit: string;
      color: CounterColorId;
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
          note: draft.note,
          count: draft.count,
          limit: draft.limit,
          dailyGoal: draft.dailyGoal,
          dailyCount: draft.count,
          dailyCountDate: today,
          unit: draft.unit,
          color: draft.color,
          step: 1,
          streakEnabled: draft.streakEnabled,
          streak: draft.streakEnabled ? 1 : 0,
          lastCountDate: draft.streakEnabled ? today : null,
          reminderTime: draft.reminderTime,
          lastReminderDate: null,
          accessCount: 1,
          dailyActivity: draft.count > 0 ? { [today]: draft.count } : undefined,
          createdAt: now,
          updatedAt: now,
        };
        setCounters((prev) => {
          const next = [newItem, ...prev];
          persistStoreImmediately({
            counters: next,
            preferences: latestStoreRef.current.preferences,
          });
          return next;
        });
        setEditorState(null);
        setActiveTab('home');
      } else {
        const editId = editorState.counterId;
        setCounters((prev) => {
          const next = prev.map((c) =>
            c.id === editId
              ? {
                  ...c,
                  ...draft,
                  updatedAt: Date.now(),
                }
              : c,
          );
          persistStoreImmediately({
            counters: next,
            preferences: latestStoreRef.current.preferences,
          });
          return next;
        });
        setEditorState(null);
      }
    },
    [editorState],
  );

  const handleDeleteCounter = useCallback((id: string) => {
    setCounters((prev) => {
      const next = prev.filter((c) => c.id !== id);
      persistStoreImmediately({ counters: next, preferences: latestStoreRef.current.preferences });
      return next;
    });
    setEditorState(null);
    setFocusCounterId((prev) => (prev === id ? null : prev));
  }, []);

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
    <div className="min-h-dvh bg-[#F4F6FA] text-slate-900 dark:bg-[#101216] dark:text-[#F5F7FA] transition-colors duration-200">
      {/* 4-Digit PIN & Biometric Lock Screen */}
      {isLocked && preferences.pinCode && (
        <PinLockScreen
          expectedPin={preferences.pinCode}
          biometricEnabled={preferences.biometricEnabled}
          biometricCredentialId={preferences.biometricCredentialId}
          soundEnabled={preferences.soundEnabled}
          hapticEnabled={preferences.hapticEnabled}
          hapticIntensity={preferences.hapticIntensity}
          onUnlock={() => setIsLocked(false)}
          t={t}
        />
      )}

      {/* Compact Sticky Top Header + Sleek Elongated (+) Button below Counter on the right */}
      <header className="sticky top-0 z-30 pt-[env(safe-area-inset-top)] bg-[#F4F6FA]/95 dark:bg-[#101216]/95 backdrop-blur-md">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 pt-2.5 pb-2">
          <div className="flex items-center justify-between gap-3">
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight whitespace-nowrap shrink-0">
              {headerTitle}
            </h1>

            <div className="flex items-center gap-1.5">
              {preferences.pinCode && (
                <button
                  type="button"
                  onClick={() => setIsLocked(true)}
                  aria-label={t.lockNowBtn}
                  title={t.lockNowBtn}
                  className="min-h-[40px] min-w-[40px] rounded-2xl flex items-center justify-center text-slate-600 dark:text-slate-300 hover:bg-black/5 dark:hover:bg-white/10 active:scale-[0.94] transition-[transform,background-color] cursor-pointer"
                >
                  <Lock className="w-4 h-4" aria-hidden="true" />
                </button>
              )}

              <button
                type="button"
                onClick={() =>
                  setPreferences((prev) => {
                    const nextLang =
                      prev.language === 'tg' ? 'ru' : prev.language === 'ru' ? 'en' : 'tg';
                    const nextPrefs = { ...prev, language: nextLang as AppPreferences['language'] };
                    persistStoreImmediately({
                      counters: latestStoreRef.current.counters,
                      preferences: nextPrefs,
                    });
                    return nextPrefs;
                  })
                }
                className="min-h-[40px] min-w-[40px] px-2.5 rounded-2xl flex items-center justify-center text-xs font-extrabold text-slate-600 dark:text-slate-300 hover:bg-black/5 dark:hover:bg-white/10 active:scale-[0.94] transition-[transform,background-color] cursor-pointer uppercase"
              >
                {preferences.language === 'tg' ? 'TJ' : preferences.language.toUpperCase()}
              </button>
            </div>
          </div>

          {/* Full-width Left-to-Right (+ Илова) Button right below the header */}
          {activeTab === 'home' && (
            <div className="mt-2.5">
              <button
                type="button"
                onClick={() => {
                  playTapFeedback(
                    'increment',
                    preferences.soundEnabled,
                    preferences.hapticEnabled,
                    preferences.hapticIntensity,
                  );
                  setEditorState({ mode: 'create' });
                }}
                aria-label={t.addCounter}
                title={t.addCounter}
                className="w-full h-11 px-5 rounded-2xl bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 text-white font-extrabold text-sm shadow-md shadow-sky-500/25 inline-flex items-center justify-center gap-2 transition-transform duration-150 active:scale-[0.98] cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500"
              >
                <Plus className="w-5 h-5 stroke-[2.75]" aria-hidden="true" />
                <span>
                  {preferences.language === 'tg'
                    ? 'Илова'
                    : preferences.language === 'ru'
                      ? 'Добавить'
                      : 'Add'}
                </span>
              </button>
            </div>
          )}
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-5xl mx-auto px-3.5 sm:px-6 pt-1.5 pb-[calc(6.75rem+env(safe-area-inset-bottom))]">
        {activeTab === 'home' && (
          <div className="flagship-enter">
            {/* 2-Column Side-by-Side Counter Grid (1 1) */}
            {counters.length === 0 ? (
              <div className="rounded-3xl border border-dashed border-slate-300 dark:border-white/10 py-12 px-6 text-center">
                <p className="text-base font-bold text-slate-800 dark:text-slate-100">
                  {t.emptyCountersTitle}
                </p>
                <p className="mt-1.5 text-sm text-slate-500 dark:text-slate-400">
                  {t.emptyCountersSub}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-3 sm:gap-4">
                {counters.map((counter) => (
                  <CounterCard
                    key={counter.id}
                    counter={counter}
                    todayKey={todayKey}
                    powerSaver={preferences.powerSaver}
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
            powerSaver={preferences.powerSaver}
            onOpenFocus={handleOpenFocus}
            t={t}
          />
        )}

        {activeTab === 'goals' && (
          <GoalsArchiveView
            counters={counters}
            todayKey={todayKey}
            onOpenFocus={handleOpenFocus}
            t={t}
          />
        )}

        {activeTab === 'settings' && (
          <AppSettingsView
            preferences={preferences}
            onUpdatePreferences={(patch) =>
              setPreferences((prev) => {
                const nextPrefs = { ...prev, ...patch };
                persistStoreImmediately({
                  counters: latestStoreRef.current.counters,
                  preferences: nextPrefs,
                });
                return nextPrefs;
              })
            }
            onLockNow={() => setIsLocked(true)}
            t={t}
          />
        )}
      </main>

      {/* Daily Goal Reminder Banner */}
      {reminderAlert && (
        <div
          role="alert"
          className="fixed top-20 left-4 right-4 sm:left-auto sm:right-6 z-40"
        >
          <div className="max-w-md mx-auto sm:mx-0 rounded-2xl bg-slate-900 text-white dark:bg-[#22252D] border border-white/10 px-4 py-3 shadow-xl flex items-center justify-between gap-3">
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
          className="fixed bottom-24 left-4 right-4 sm:left-auto sm:right-6 z-60"
        >
          <div className="max-w-md mx-auto sm:mx-0 rounded-2xl bg-slate-900 text-white dark:bg-[#F3EFEA] dark:text-[#121316] px-4 py-2.5 shadow-xl flex items-center justify-between gap-4">
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

      {/* Subtle Bottom Fade + Centered Floating Navigation */}
      <div
        aria-hidden="true"
        className="fixed bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-[#F4F6FA] via-[#F4F6FA]/80 to-transparent dark:from-[#101216] dark:via-[#101216]/80 pointer-events-none z-20"
      />
      <div className="fixed bottom-[calc(1rem+env(safe-area-inset-bottom))] left-0 right-0 z-30 px-4 pointer-events-none">
        <div className="max-w-sm mx-auto flex items-center justify-center pointer-events-auto">
          <nav
            aria-label={t.appName}
            className="w-full h-14 px-2 rounded-full bg-white/95 dark:bg-[#1C1F26]/95 backdrop-blur-md border border-slate-200/80 dark:border-white/10 shadow-xl flex items-center justify-between gap-1"
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
                  onClick={() => {
                    playTapFeedback(
                      'increment',
                      preferences.soundEnabled,
                      preferences.hapticEnabled,
                      preferences.hapticIntensity,
                    );
                    setActiveTab(id);
                  }}
                  aria-label={label}
                  className={`h-11 rounded-full inline-flex items-center justify-center gap-1.5 transition-[transform,background-color,padding] duration-150 active:scale-[0.94] cursor-pointer whitespace-nowrap ${
                    isActive
                      ? 'px-4 bg-sky-100 text-sky-900 dark:bg-[#82ACFF] dark:text-[#0B193B] font-extrabold shadow-xs'
                      : 'w-11 text-slate-600 dark:text-[#C8D3E8] hover:bg-black/5 dark:hover:bg-white/10'
                  }`}
                >
                  <Icon className="w-4 h-4 shrink-0" aria-hidden="true" />
                  {isActive && <span className="text-xs">{label}</span>}
                </button>
              );
            })}
          </nav>
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
          onNoteChange={(nextNote) => handleNoteChange(focusCounter.id, nextNote)}
          t={t}
        />
      )}

      {/* Counter Settings / Create New Counter View */}
      {editorState && (
        <CounterEditorView
          mode={editorState.mode}
          initialCounter={editingCounter}
          language={preferences.language}
          onClose={() => setEditorState(null)}
          onSave={handleSaveEditor}
          onResetCounter={handleResetToZero}
          onDeleteCounter={handleDeleteCounter}
          t={t}
        />
      )}
    </div>
  );
}
