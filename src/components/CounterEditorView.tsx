import { useState } from 'react';
import {
  Archive,
  Bell,
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  History,
  Link2,
  Lock,
  Minus,
  Palette,
  RotateCcw,
  Target,
  Trash2,
} from 'lucide-react';
import type { SmartTranslations } from '../i18n/translations';
import type { CounterColorId, CounterItem, HistoryRecord, Language } from '../types/counter';
import { COUNTER_COLOR_IDS, COUNTER_THEMES } from '../utils/themes';

interface CounterEditorViewProps {
  mode: 'create' | 'edit';
  initialCounter?: CounterItem;
  counterHistory: HistoryRecord[];
  language: Language;
  onClose: () => void;
  onSave: (draft: {
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
  }) => void;
  onResetCounter: (id: string) => void;
  onArchiveCounter: (id: string) => void;
  onDeleteCounter: (id: string) => void;
  t: SmartTranslations;
}

export function CounterEditorView({
  mode,
  initialCounter,
  counterHistory,
  language,
  onClose,
  onSave,
  onResetCounter,
  onArchiveCounter,
  onDeleteCounter,
  t,
}: CounterEditorViewProps) {
  const [name, setName] = useState(initialCounter?.name ?? '');
  const [countStr, setCountStr] = useState(String(initialCounter?.count ?? 0));
  const [limitStr, setLimitStr] = useState(String(initialCounter?.limit ?? 100));
  const [dailyGoalStr, setDailyGoalStr] = useState(String(initialCounter?.dailyGoal ?? 0));
  const [unit, setUnit] = useState(initialCounter?.unit ?? '');
  const [color, setColor] = useState<CounterColorId>(initialCounter?.color ?? 'terracotta');
  const [locked, setLocked] = useState(initialCounter?.locked ?? false);
  const [allowNegative, setAllowNegative] = useState(initialCounter?.allowNegative ?? false);
  const [reminderTime, setReminderTime] = useState(initialCounter?.reminderTime ?? '');
  const [streakEnabled, setStreakEnabled] = useState(initialCounter?.streakEnabled ?? false);
  const [showHistory, setShowHistory] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const palette = COUNTER_THEMES[color] || COUNTER_THEMES.terracotta;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedName = name.trim() || (language === 'tg' ? 'Ҳисобкунак' : 'Counter');
    const parsedCount = Number.parseInt(countStr, 10);
    const parsedLimit = Number.parseInt(limitStr, 10);
    const parsedDailyGoal = Number.parseInt(dailyGoalStr, 10);

    const safeCount = Number.isFinite(parsedCount)
      ? allowNegative
        ? parsedCount
        : Math.max(0, parsedCount)
      : 0;
    const safeLimit = Number.isFinite(parsedLimit) && parsedLimit >= 1 ? parsedLimit : 100;
    const safeDailyGoal =
      Number.isFinite(parsedDailyGoal) && parsedDailyGoal >= 0 ? parsedDailyGoal : 0;

    onSave({
      name: trimmedName,
      count: safeCount,
      limit: safeLimit,
      dailyGoal: safeDailyGoal,
      unit: unit.trim(),
      color,
      locked,
      allowNegative,
      reminderTime,
      streakEnabled,
    });
  };

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto bg-slate-50 dark:bg-[#16110F] text-slate-900 dark:text-slate-100"
      role="dialog"
      aria-modal="true"
      aria-label={mode === 'create' ? t.newCounterTitle : t.editCounterTitle}
    >
      <form
        onSubmit={handleSubmit}
        className="max-w-xl mx-auto min-h-full flex flex-col pb-[calc(2.5rem+env(safe-area-inset-bottom))]"
      >
        {/* Sticky Top Bar */}
        <header className="sticky top-0 z-20 pt-[env(safe-area-inset-top)] px-4 bg-slate-50/95 dark:bg-[#16110F]/95 backdrop-blur-md">
          <div className="h-16 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 min-w-0">
            <button
              type="button"
              onClick={onClose}
              aria-label={t.cancelLabel}
              className="min-h-[44px] min-w-[44px] rounded-2xl flex items-center justify-center hover:bg-black/5 dark:hover:bg-white/10 active:scale-[0.94] transition-[transform,background-color] cursor-pointer"
            >
              <ChevronLeft className="w-6 h-6" aria-hidden="true" />
            </button>
            <div className="min-w-0">
              <h2 className="text-lg font-bold truncate">
                {mode === 'create' ? t.newCounterTitle : name || t.editCounterTitle}
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {t.settingsSubtitle}
              </p>
            </div>
          </div>

          <button
            type="submit"
            className={`min-h-[44px] px-5 rounded-2xl text-sm font-bold shadow-sm transition-transform active:scale-[0.96] cursor-pointer whitespace-nowrap shrink-0 ${palette.focusPrimaryBg} ${palette.focusPrimaryText}`}
          >
            {mode === 'create' ? t.createLabel : t.saveLabel}
          </button>
          </div>
        </header>

        <div className="px-4 space-y-3 mt-2">
          {/* Name Field */}
          <div className="rounded-2xl bg-white dark:bg-[#231B18] border border-slate-200 dark:border-[#352A25] p-3.5">
            <label
              htmlFor="counter-name"
              className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1"
            >
              {t.nameLabel}
            </label>
            <input
              id="counter-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={t.namePlaceholder}
              autoFocus={mode === 'create'}
              className="w-full bg-transparent text-lg font-semibold text-slate-900 dark:text-slate-50 placeholder:text-slate-400 dark:placeholder:text-slate-600 focus:outline-none"
            />
          </div>

          {/* Value, Total Limit & Unit Row */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <div className="rounded-2xl bg-white dark:bg-[#231B18] border border-slate-200 dark:border-[#352A25] p-3.5">
              <label
                htmlFor="counter-value"
                className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1"
              >
                {t.valueLabel}
              </label>
              <input
                id="counter-value"
                type="number"
                inputMode="numeric"
                value={countStr}
                onChange={(e) => setCountStr(e.target.value)}
                className="w-full bg-transparent font-mono tabular-nums text-xl font-bold text-slate-900 dark:text-slate-50 focus:outline-none"
              />
            </div>

            <div className="rounded-2xl bg-white dark:bg-[#231B18] border border-slate-200 dark:border-[#352A25] p-3.5">
              <label
                htmlFor="counter-limit"
                className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1"
              >
                {t.limitLabel}
              </label>
              <input
                id="counter-limit"
                type="number"
                min={1}
                inputMode="numeric"
                value={limitStr}
                onChange={(e) => setLimitStr(e.target.value)}
                className="w-full bg-transparent font-mono tabular-nums text-xl font-bold text-slate-900 dark:text-slate-50 focus:outline-none"
              />
            </div>

            <div className="col-span-2 sm:col-span-1 rounded-2xl bg-white dark:bg-[#231B18] border border-slate-200 dark:border-[#352A25] p-3.5">
              <label
                htmlFor="counter-unit"
                className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1"
              >
                {t.unitLabel}
              </label>
              <input
                id="counter-unit"
                type="text"
                value={unit}
                onChange={(e) => setUnit(e.target.value)}
                placeholder={t.unitPlaceholder}
                className="w-full bg-transparent text-base font-semibold text-slate-900 dark:text-slate-50 placeholder:text-slate-400 dark:placeholder:text-slate-600 focus:outline-none"
              />
            </div>
          </div>

          {/* Daily Goal (24h auto-reset) */}
          <div className="rounded-2xl bg-white dark:bg-[#231B18] border border-slate-200 dark:border-[#352A25] p-4">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-3">
                <Target className="w-5 h-5 mt-0.5 text-slate-500 dark:text-slate-400 shrink-0" aria-hidden="true" />
                <div>
                  <label htmlFor="counter-daily-goal" className="block text-sm font-semibold">
                    {t.dailyGoalLabel}
                  </label>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    {t.dailyGoalHint}
                  </p>
                </div>
              </div>
              <input
                id="counter-daily-goal"
                type="number"
                min={0}
                inputMode="numeric"
                value={dailyGoalStr}
                onChange={(e) => setDailyGoalStr(e.target.value)}
                className="w-24 min-h-[44px] px-3 text-right rounded-xl bg-slate-100 dark:bg-[#16110F] font-mono tabular-nums text-lg font-bold text-slate-900 dark:text-slate-50 focus:outline-none focus:ring-2 focus:ring-sky-500 shrink-0"
              />
            </div>
          </div>

          {/* Color Scheme Selector */}
          <div className="rounded-2xl bg-white dark:bg-[#231B18] border border-slate-200 dark:border-[#352A25] p-4">
            <div className="flex items-center gap-3 mb-3.5">
              <Palette className="w-5 h-5 text-slate-500 dark:text-slate-400" aria-hidden="true" />
              <span className="text-sm font-semibold">{t.colorSchemeLabel}</span>
            </div>

            <div className="flex items-center gap-3 flex-wrap">
              {COUNTER_COLOR_IDS.map((colorId) => {
                const itemPalette = COUNTER_THEMES[colorId];
                const isSelected = color === colorId;
                return (
                  <button
                    key={colorId}
                    type="button"
                    onClick={() => setColor(colorId)}
                    aria-label={colorId}
                    aria-pressed={isSelected}
                    style={{ backgroundColor: itemPalette.swatchHex }}
                    className={`w-11 h-11 rounded-full flex items-center justify-center transition-transform active:scale-95 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 ${
                      isSelected ? 'ring-2 ring-offset-2 ring-slate-900 dark:ring-white dark:ring-offset-[#231B18]' : ''
                    }`}
                  >
                    {isSelected && <Check className="w-5 h-5 text-white drop-shadow-sm" aria-hidden="true" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Lock Toggle */}
          <div className="rounded-2xl bg-white dark:bg-[#231B18] border border-slate-200 dark:border-[#352A25] p-4 flex items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <Lock className="w-5 h-5 mt-0.5 text-slate-500 dark:text-slate-400 shrink-0" aria-hidden="true" />
              <div>
                <p className="text-sm font-semibold">{t.lockedLabel}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{t.lockedDesc}</p>
              </div>
            </div>
            <button
              type="button"
              role="switch"
              aria-label={t.lockedLabel}
              aria-checked={locked}
              onClick={() => setLocked((prev) => !prev)}
              className={`relative w-12 h-7 rounded-full transition-colors shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 ${
                locked ? 'bg-sky-600' : 'bg-slate-300 dark:bg-[#3A2E29]'
              }`}
            >
              <span
                className={`block w-5 h-5 rounded-full bg-white shadow-sm transform transition-transform ${
                  locked ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          {/* Allow Negative Values Toggle */}
          <div className="rounded-2xl bg-white dark:bg-[#231B18] border border-slate-200 dark:border-[#352A25] p-4 flex items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <Minus className="w-5 h-5 mt-0.5 text-slate-500 dark:text-slate-400 shrink-0" aria-hidden="true" />
              <div>
                <p className="text-sm font-semibold">{t.allowNegativeLabel}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{t.allowNegativeDesc}</p>
              </div>
            </div>
            <button
              type="button"
              role="switch"
              aria-label={t.allowNegativeLabel}
              aria-checked={allowNegative}
              onClick={() => setAllowNegative((prev) => !prev)}
              className={`relative w-12 h-7 rounded-full transition-colors shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 ${
                allowNegative ? 'bg-sky-600' : 'bg-slate-300 dark:bg-[#3A2E29]'
              }`}
            >
              <span
                className={`block w-5 h-5 rounded-full bg-white shadow-sm transform transition-transform ${
                  allowNegative ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          {/* Daily Goal Reminder Time */}
          <div className="rounded-2xl bg-white dark:bg-[#231B18] border border-slate-200 dark:border-[#352A25] p-4 flex items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <Bell className="w-5 h-5 mt-0.5 text-slate-500 dark:text-slate-400 shrink-0" aria-hidden="true" />
              <div>
                <label htmlFor="counter-reminder" className="block text-sm font-semibold">
                  {t.reminderLabel}
                </label>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  {t.reminderHint}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <input
                id="counter-reminder"
                type="time"
                value={reminderTime}
                onChange={(e) => setReminderTime(e.target.value)}
                className="min-h-[40px] px-2.5 rounded-xl bg-slate-100 dark:bg-[#16110F] font-mono text-sm focus:outline-none"
              />
              {reminderTime && (
                <button
                  type="button"
                  onClick={() => setReminderTime('')}
                  aria-label={t.cancelLabel}
                  className="min-h-[36px] min-w-[36px] text-sm text-slate-500 hover:text-red-500 cursor-pointer"
                >
                  ×
                </button>
              )}
            </div>
          </div>

          {/* Habit Streak Toggle */}
          <div className="rounded-2xl bg-white dark:bg-[#231B18] border border-slate-200 dark:border-[#352A25] p-4 flex items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <Link2 className="w-5 h-5 mt-0.5 text-slate-500 dark:text-slate-400 shrink-0" aria-hidden="true" />
              <div>
                <p className="text-sm font-semibold">{t.streakLabel}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{t.streakDesc}</p>
              </div>
            </div>
            <button
              type="button"
              role="switch"
              aria-label={t.streakLabel}
              aria-checked={streakEnabled}
              onClick={() => setStreakEnabled((prev) => !prev)}
              className={`relative w-12 h-7 rounded-full transition-colors shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 ${
                streakEnabled ? 'bg-sky-600' : 'bg-slate-300 dark:bg-[#3A2E29]'
              }`}
            >
              <span
                className={`block w-5 h-5 rounded-full bg-white shadow-sm transform transition-transform ${
                  streakEnabled ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          {/* Existing Counter Actions: History, Reset, Archive, Delete */}
          {mode === 'edit' && initialCounter && (
            <div className="space-y-3 pt-2">
              {/* History Accordion */}
              <div className="rounded-2xl bg-white dark:bg-[#231B18] border border-slate-200 dark:border-[#352A25] overflow-hidden">
                <button
                  type="button"
                  onClick={() => setShowHistory((prev) => !prev)}
                  className="w-full min-h-[54px] px-4 flex items-center justify-between gap-3 hover:bg-black/[0.02] dark:hover:bg-white/[0.02] cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <History className="w-5 h-5 text-slate-500 dark:text-slate-400" aria-hidden="true" />
                    <span className="text-sm font-semibold">{t.counterHistoryLabel}</span>
                  </div>
                  {showHistory ? (
                    <ChevronDown className="w-4 h-4 text-slate-400" aria-hidden="true" />
                  ) : (
                    <ChevronRight className="w-4 h-4 text-slate-400" aria-hidden="true" />
                  )}
                </button>

                {showHistory && (
                  <div className="px-4 pb-4 pt-1 border-t border-slate-100 dark:border-[#352A25]">
                    {counterHistory.length === 0 ? (
                      <p className="text-xs text-slate-500 dark:text-slate-400 py-2">
                        {t.noCounterHistory}
                      </p>
                    ) : (
                      <ul className="divide-y divide-slate-100 dark:divide-[#352A25] max-h-48 overflow-y-auto">
                        {counterHistory.map((item) => (
                          <li key={item.id} className="py-2 flex items-center justify-between text-xs">
                            <span className="font-mono tabular-nums font-bold">
                              {item.finalCount.toLocaleString()} / {item.targetLimit.toLocaleString()}
                            </span>
                            <span className="font-mono tabular-nums text-slate-500 dark:text-slate-400">
                              {new Date(item.timestamp).toLocaleString([], {
                                month: 'short',
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit',
                              })}
                            </span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                )}
              </div>

              {/* Reset Counter (Preserves Limit) */}
              <button
                type="button"
                disabled={locked || initialCounter.count === 0}
                onClick={() => {
                  onResetCounter(initialCounter.id);
                  setCountStr('0');
                }}
                className="w-full min-h-[54px] px-4 rounded-2xl bg-white dark:bg-[#231B18] border border-slate-200 dark:border-[#352A25] flex items-center justify-between gap-3 hover:bg-slate-50 dark:hover:bg-[#2C221E] disabled:opacity-45 disabled:pointer-events-none transition-colors cursor-pointer text-left"
              >
                <div className="flex items-center gap-3">
                  <RotateCcw className="w-5 h-5 text-slate-500 dark:text-slate-400 shrink-0" aria-hidden="true" />
                  <div>
                    <span className="block text-sm font-semibold">{t.resetCounterLabel}</span>
                    <span className="block text-xs text-slate-500 dark:text-slate-400">
                      {t.resetPreservesLimit}
                    </span>
                  </div>
                </div>
              </button>

              {/* Archive Counter */}
              <button
                type="button"
                onClick={() => onArchiveCounter(initialCounter.id)}
                className="w-full min-h-[54px] px-4 rounded-2xl bg-white dark:bg-[#231B18] border border-slate-200 dark:border-[#352A25] flex items-center gap-3 hover:bg-slate-50 dark:hover:bg-[#2C221E] transition-colors cursor-pointer text-left"
              >
                <Archive className="w-5 h-5 text-slate-500 dark:text-slate-400 shrink-0" aria-hidden="true" />
                <span className="text-sm font-semibold">
                  {initialCounter.archived ? t.unarchiveCounterLabel : t.archiveCounterLabel}
                </span>
              </button>

              {/* Delete Counter */}
              {!confirmDelete ? (
                <button
                  type="button"
                  onClick={() => setConfirmDelete(true)}
                  className="w-full min-h-[54px] px-4 rounded-2xl bg-white dark:bg-[#231B18] border border-slate-200 dark:border-[#352A25] flex items-center gap-3 hover:bg-red-50 dark:hover:bg-red-950/30 text-red-600 dark:text-red-400 transition-colors cursor-pointer text-left"
                >
                  <Trash2 className="w-5 h-5 shrink-0" aria-hidden="true" />
                  <span className="text-sm font-semibold">{t.deleteCounterLabel}</span>
                </button>
              ) : (
                <div className="rounded-2xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900/60 p-3 flex items-center justify-between gap-3">
                  <button
                    type="button"
                    onClick={() => setConfirmDelete(false)}
                    className="min-h-[44px] px-4 rounded-xl text-sm font-semibold text-slate-700 dark:text-slate-200 hover:bg-black/5 dark:hover:bg-white/5 cursor-pointer"
                  >
                    {t.cancelLabel}
                  </button>
                  <button
                    type="button"
                    onClick={() => onDeleteCounter(initialCounter.id)}
                    className="min-h-[44px] px-4 rounded-xl bg-red-600 hover:bg-red-700 text-white text-sm font-bold cursor-pointer"
                  >
                    {t.confirmDeleteLabel}
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </form>
    </div>
  );
}
