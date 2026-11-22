import { useState } from 'react';
import {
  Bell,
  Check,
  ChevronLeft,
  Link2,
  Palette,
  RotateCcw,
  Target,
  Trash2,
} from 'lucide-react';
import type { SmartTranslations } from '../i18n/translations';
import type { CounterColorId, CounterItem, Language } from '../types/counter';
import { COUNTER_COLOR_IDS, COUNTER_THEMES } from '../utils/themes';

interface CounterEditorViewProps {
  mode: 'create' | 'edit';
  initialCounter?: CounterItem;
  language: Language;
  onClose: () => void;
  onSave: (draft: {
    name: string;
    note: string;
    count: number;
    limit: number;
    dailyGoal: number;
    unit: string;
    color: CounterColorId;
    reminderTime: string;
    streakEnabled: boolean;
  }) => void;
  onResetCounter: (id: string) => void;
  onDeleteCounter: (id: string) => void;
  t: SmartTranslations;
}

const QUICK_LIMITS = [33, 99, 100, 500, 1000];

export function CounterEditorView({
  mode,
  initialCounter,
  language,
  onClose,
  onSave,
  onResetCounter,
  onDeleteCounter,
  t,
}: CounterEditorViewProps) {
  const [name, setName] = useState(initialCounter?.name ?? '');
  const [note, setNote] = useState(initialCounter?.note ?? '');

  // Numeric fields use sample placeholders (намунавӣ) so tapping them does not require deleting pre-filled numbers
  const [countPlaceholder, setCountPlaceholder] = useState<number>(
    initialCounter?.count ?? 0,
  );
  const [countStr, setCountStr] = useState('');

  const [limitPlaceholder, setLimitPlaceholder] = useState<number>(
    initialCounter?.limit ?? 33,
  );
  const [limitStr, setLimitStr] = useState('');

  const [dailyGoalPlaceholder] = useState<number>(
    initialCounter?.dailyGoal ?? 0,
  );
  const [dailyGoalStr, setDailyGoalStr] = useState('');

  const [unit, setUnit] = useState(initialCounter?.unit ?? '');
  const [color, setColor] = useState<CounterColorId>(initialCounter?.color ?? 'terracotta');
  const [reminderTime, setReminderTime] = useState(initialCounter?.reminderTime ?? '');
  const [streakEnabled, setStreakEnabled] = useState(initialCounter?.streakEnabled ?? false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const palette = COUNTER_THEMES[color] || COUNTER_THEMES.terracotta;

  const sanitizeDigits = (raw: string) => raw.replace(/[^\d]/g, '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedName = name.trim() || (language === 'tg' ? 'Ҳисобкунак' : 'Counter');
    const parsedCount = countStr.trim() ? Number.parseInt(countStr, 10) : countPlaceholder;
    const parsedLimit = limitStr.trim() ? Number.parseInt(limitStr, 10) : limitPlaceholder;
    const parsedDailyGoal = dailyGoalStr.trim()
      ? Number.parseInt(dailyGoalStr, 10)
      : dailyGoalPlaceholder;

    const safeCount = Number.isFinite(parsedCount) ? Math.max(0, parsedCount) : countPlaceholder;
    const safeLimit =
      Number.isFinite(parsedLimit) && parsedLimit >= 1 ? parsedLimit : limitPlaceholder;
    const safeDailyGoal =
      Number.isFinite(parsedDailyGoal) && parsedDailyGoal >= 0
        ? parsedDailyGoal
        : dailyGoalPlaceholder;

    onSave({
      name: trimmedName,
      note: note.trim(),
      count: safeCount,
      limit: safeLimit,
      dailyGoal: safeDailyGoal,
      unit: unit.trim(),
      color,
      reminderTime,
      streakEnabled,
    });
  };

  const effectiveLimit = limitStr.trim() ? Number(limitStr) : limitPlaceholder;

  return (
    <div
      className="flagship-enter fixed inset-0 z-50 overflow-y-auto bg-[#F4F5F7] dark:bg-[#121316] text-slate-900 dark:text-slate-100"
      role="dialog"
      aria-modal="true"
      aria-label={mode === 'create' ? t.newCounterTitle : t.editCounterTitle}
    >
      <form
        onSubmit={handleSubmit}
        className="max-w-xl mx-auto min-h-full flex flex-col pb-[calc(2.5rem+env(safe-area-inset-bottom))]"
      >
        {/* Sticky Top Bar */}
        <header className="sticky top-0 z-20 pt-[env(safe-area-inset-top)] px-4 bg-[#F4F5F7]/95 dark:bg-[#121316]/95 backdrop-blur-md">
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
              className={`min-h-[44px] px-5 rounded-2xl text-sm font-bold shadow-sm transition-transform active:scale-[0.95] cursor-pointer whitespace-nowrap shrink-0 ${palette.focusPrimaryBg} ${palette.focusPrimaryText}`}
            >
              {mode === 'create' ? t.createLabel : t.saveLabel}
            </button>
          </div>
        </header>

        <div className="px-4 space-y-3 mt-2">
          {/* Name & Note Fields */}
          <div className="rounded-3xl bg-white dark:bg-[#1B1D22] border border-slate-200/80 dark:border-white/8 p-4 space-y-3">
            <div>
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
                className="w-full bg-transparent text-lg font-semibold text-slate-900 dark:text-slate-50 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none"
              />
            </div>

            <div className="pt-2.5 border-t border-slate-200/70 dark:border-white/8">
              <label
                htmlFor="counter-note"
                className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1"
              >
                {t.noteLabel}
              </label>
              <input
                id="counter-note"
                type="text"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder={t.notePlaceholder}
                className="w-full bg-transparent text-sm font-medium text-slate-800 dark:text-slate-200 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Value, Total Limit & Unit Row — Numbers shown as sample placeholders (намунавӣ) */}
          <div className="rounded-3xl bg-white dark:bg-[#1B1D22] border border-slate-200/80 dark:border-white/8 p-4 space-y-3">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <div>
                <label
                  htmlFor="counter-value"
                  className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1"
                >
                  {t.valueLabel}
                </label>
                <input
                  id="counter-value"
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  placeholder={String(countPlaceholder)}
                  value={countStr}
                  onChange={(e) => setCountStr(sanitizeDigits(e.target.value))}
                  className="w-full min-h-[42px] px-3 rounded-xl bg-slate-100 dark:bg-[#121316] font-mono tabular-nums text-lg font-bold text-slate-900 dark:text-slate-50 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-500"
                />
              </div>

              <div>
                <label
                  htmlFor="counter-limit"
                  className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1"
                >
                  {t.limitLabel}
                </label>
                <input
                  id="counter-limit"
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  placeholder={String(limitPlaceholder)}
                  value={limitStr}
                  onChange={(e) => setLimitStr(sanitizeDigits(e.target.value))}
                  className="w-full min-h-[42px] px-3 rounded-xl bg-slate-100 dark:bg-[#121316] font-mono tabular-nums text-lg font-bold text-slate-900 dark:text-slate-50 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-500"
                />
              </div>

              <div className="col-span-2 sm:col-span-1">
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
                  className="w-full min-h-[42px] px-3 rounded-xl bg-slate-100 dark:bg-[#121316] text-base font-semibold text-slate-900 dark:text-slate-50 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-500"
                />
              </div>
            </div>

            {/* Quick Limit Presets */}
            <div className="flex items-center gap-1.5 flex-wrap pt-1">
              {QUICK_LIMITS.map((preset) => {
                const active = effectiveLimit === preset;
                return (
                  <button
                    key={preset}
                    type="button"
                    onClick={() => {
                      setLimitPlaceholder(preset);
                      setLimitStr('');
                    }}
                    className={`min-h-[32px] px-3 rounded-xl font-mono text-xs font-bold transition-colors cursor-pointer ${
                      active
                        ? 'bg-sky-600 text-white dark:bg-sky-400 dark:text-slate-950'
                        : 'bg-slate-100 dark:bg-[#121316] text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-white/10'
                    }`}
                  >
                    {preset}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Daily Goal (24h auto-reset) — Sample placeholder number */}
          <div className="rounded-3xl bg-white dark:bg-[#1B1D22] border border-slate-200/80 dark:border-white/8 p-4">
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
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                placeholder={String(dailyGoalPlaceholder)}
                value={dailyGoalStr}
                onChange={(e) => setDailyGoalStr(sanitizeDigits(e.target.value))}
                className="w-24 min-h-[44px] px-3 text-right rounded-xl bg-slate-100 dark:bg-[#121316] font-mono tabular-nums text-lg font-bold text-slate-900 dark:text-slate-50 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-500 shrink-0"
              />
            </div>
          </div>

          {/* Color Scheme Selector */}
          <div className="rounded-3xl bg-white dark:bg-[#1B1D22] border border-slate-200/80 dark:border-white/8 p-4">
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
                    className={`w-11 h-11 rounded-full flex items-center justify-center transition-transform active:scale-90 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 ${
                      isSelected ? 'ring-2 ring-offset-2 ring-slate-900 dark:ring-white dark:ring-offset-[#1B1D22]' : ''
                    }`}
                  >
                    {isSelected && <Check className="w-5 h-5 text-white drop-shadow-sm" aria-hidden="true" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Daily Goal Reminder Time */}
          <div className="rounded-3xl bg-white dark:bg-[#1B1D22] border border-slate-200/80 dark:border-white/8 p-4 flex items-center justify-between gap-4">
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
                className="min-h-[40px] px-2.5 rounded-xl bg-slate-100 dark:bg-[#121316] font-mono text-sm focus:outline-none"
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
          <div className="rounded-3xl bg-white dark:bg-[#1B1D22] border border-slate-200/80 dark:border-white/8 p-4 flex items-center justify-between gap-4">
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
                streakEnabled ? 'bg-sky-600' : 'bg-slate-300 dark:bg-[#2F333D]'
              }`}
            >
              <span
                className={`block w-5 h-5 rounded-full bg-white shadow-sm transform transition-transform ${
                  streakEnabled ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          {/* Existing Counter Actions: Reset to 0 & Delete */}
          {mode === 'edit' && initialCounter && (
            <div className="space-y-3 pt-2">
              {/* Reset Counter (Preserves Limit) */}
              <button
                type="button"
                disabled={countPlaceholder === 0 && !countStr}
                onClick={() => {
                  onResetCounter(initialCounter.id);
                  setCountPlaceholder(0);
                  setCountStr('');
                }}
                className="w-full min-h-[54px] px-4 rounded-3xl bg-white dark:bg-[#1B1D22] border border-slate-200/80 dark:border-white/8 flex items-center justify-between gap-3 hover:bg-slate-50 dark:hover:bg-[#23262E] disabled:opacity-45 disabled:pointer-events-none transition-colors cursor-pointer text-left"
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

              {/* Delete Counter */}
              {!confirmDelete ? (
                <button
                  type="button"
                  onClick={() => setConfirmDelete(true)}
                  className="w-full min-h-[54px] px-4 rounded-3xl bg-white dark:bg-[#1B1D22] border border-slate-200/80 dark:border-white/8 flex items-center gap-3 hover:bg-red-50 dark:hover:bg-red-950/30 text-red-600 dark:text-red-400 transition-colors cursor-pointer text-left"
                >
                  <Trash2 className="w-5 h-5 shrink-0" aria-hidden="true" />
                  <span className="text-sm font-semibold">{t.deleteCounterLabel}</span>
                </button>
              ) : (
                <div className="rounded-3xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900/60 p-3 flex items-center justify-between gap-3">
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
