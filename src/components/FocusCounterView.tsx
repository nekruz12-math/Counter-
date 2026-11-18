import { useEffect, useRef, useState } from 'react';
import {
  CheckCircle2,
  ChevronLeft,
  ChevronsDown,
  ChevronsUp,
  RotateCcw,
  Settings,
  TrendingUp,
} from 'lucide-react';
import type { SmartTranslations } from '../i18n/translations';
import type { CounterItem } from '../types/counter';
import { COUNTER_THEMES } from '../utils/themes';

interface FocusCounterViewProps {
  counter: CounterItem;
  todayKey: string;
  powerSaver: boolean;
  onClose: () => void;
  onOpenSettings: () => void;
  onIncrement: (stepOverride?: number) => void;
  onDecrement: () => void;
  onResetToZero: () => void;
  onStepChange: (nextStep: number) => void;
  t: SmartTranslations;
}

const STEP_OPTIONS = [1, 2, 5, 10];

export function FocusCounterView({
  counter,
  todayKey,
  powerSaver,
  onClose,
  onOpenSettings,
  onIncrement,
  onDecrement,
  onResetToZero,
  onStepChange,
  t,
}: FocusCounterViewProps) {
  const [isPopping, setIsPopping] = useState(false);
  const prevCountRef = useRef(counter.count);

  useEffect(() => {
    if (prevCountRef.current !== counter.count) {
      prevCountRef.current = counter.count;
      if (!powerSaver) {
        setIsPopping(true);
        const timer = window.setTimeout(() => setIsPopping(false), 160);
        return () => window.clearTimeout(timer);
      }
    }
  }, [counter.count, powerSaver]);

  const palette = COUNTER_THEMES[counter.color] || COUNTER_THEMES.terracotta;
  const remaining = Math.max(counter.limit - counter.count, 0);
  const overflow = Math.max(counter.count - counter.limit, 0);
  const isReached = counter.limit > 0 && counter.count === counter.limit;
  const isExceeded = counter.limit > 0 && counter.count > counter.limit;
  const canDecrement = counter.count > 0;
  const canReset = counter.count > 0;

  const hasDailyGoal = (counter.dailyGoal ?? 0) > 0;
  const dailyCount = counter.dailyCountDate === todayKey ? counter.dailyCount ?? 0 : 0;
  const dailyPct = hasDailyGoal
    ? Math.min(100, Math.round((dailyCount / counter.dailyGoal) * 100))
    : 0;

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      const tag = target?.tagName?.toLowerCase();
      if (tag === 'input' || tag === 'textarea') return;

      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowUp' || e.key === ' ') {
        if (tag !== 'button') {
          e.preventDefault();
          onIncrement();
        }
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        if (canDecrement) onDecrement();
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [onClose, onIncrement, onDecrement, canDecrement]);

  const digitCount = String(counter.count).length;
  const heroTextSize =
    digitCount >= 6
      ? 'text-6xl sm:text-7xl'
      : digitCount >= 4
        ? 'text-7xl sm:text-8xl'
        : 'text-[5.5rem] sm:text-[7rem]';

  return (
    <div
      className={`flagship-enter fixed inset-0 z-50 flex flex-col pt-[env(safe-area-inset-top)] ${palette.focusBg} transition-colors duration-200`}
      role="dialog"
      aria-modal="true"
      aria-label={counter.name}
    >
      {/* Top Bar */}
      <header className="h-14 sm:h-16 px-3 sm:px-6 flex items-center justify-between gap-3 shrink-0">
        <button
          type="button"
          onClick={onClose}
          aria-label={t.navHome}
          className={`min-h-[44px] min-w-[44px] rounded-2xl flex items-center justify-center hover:bg-black/5 dark:hover:bg-white/10 active:scale-[0.92] transition-[transform,background-color] cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 ${palette.focusText}`}
        >
          <ChevronLeft className="w-6 h-6" aria-hidden="true" />
        </button>

        <div className="flex items-center gap-2 min-w-0">
          <h2 className={`text-lg sm:text-xl font-bold tracking-tight truncate ${palette.focusText}`}>
            {counter.name}
          </h2>
        </div>

        <div className="flex items-center gap-1 shrink-0">
          <button
            type="button"
            disabled={!canReset}
            onClick={onResetToZero}
            aria-label={t.resetCounterLabel}
            title={t.resetPreservesLimit}
            className={`min-h-[44px] min-w-[44px] rounded-2xl flex items-center justify-center hover:bg-black/5 dark:hover:bg-white/10 active:scale-[0.92] disabled:opacity-30 disabled:pointer-events-none transition-[transform,background-color] cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 ${palette.focusText}`}
          >
            <RotateCcw className="w-5 h-5" aria-hidden="true" />
          </button>

          <button
            type="button"
            onClick={onOpenSettings}
            aria-label={t.editCounterTitle}
            className={`min-h-[44px] min-w-[44px] rounded-2xl flex items-center justify-center hover:bg-black/5 dark:hover:bg-white/10 active:scale-[0.92] transition-[transform,background-color] cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 ${palette.focusText}`}
          >
            <Settings className="w-5 h-5" aria-hidden="true" />
          </button>
        </div>
      </header>

      {/* Main Counter Stage */}
      <div className="relative flex-1 flex flex-col items-center justify-center px-6 pb-4 select-none">
        {/* Hero Number + Target Limit */}
        <div className="flex flex-col items-center text-center mb-8 sm:mb-10">
          <div className="flex items-baseline justify-center gap-3">
            <span
              aria-live="polite"
              className={`count-pop ${
                isPopping ? 'count-pop-active' : ''
              } font-mono tabular-nums font-bold leading-none tracking-tight ${heroTextSize} ${palette.focusText}`}
            >
              {counter.count.toLocaleString()}
            </span>
            <span className={`font-mono tabular-nums text-2xl sm:text-3xl font-medium ${palette.focusMuted}`}>
              {counter.limit.toLocaleString()}
              {counter.unit ? ` ${counter.unit}` : ''}
            </span>
          </div>

          {/* Explicit Status Text */}
          <div className={`mt-3 flex flex-wrap items-center justify-center gap-2 text-sm font-semibold ${palette.focusMuted}`}>
            {isReached ? (
              <>
                <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-500" aria-hidden="true" />
                <span>{t.limitReached}</span>
              </>
            ) : isExceeded ? (
              <>
                <TrendingUp className="w-4 h-4 shrink-0 text-amber-500" aria-hidden="true" />
                <span className="font-mono tabular-nums">
                  +{overflow.toLocaleString()} {t.overLimit}
                </span>
              </>
            ) : (
              <span className="font-mono tabular-nums">
                {t.remaining}: {remaining.toLocaleString()}
              </span>
            )}

            {hasDailyGoal && (
              <>
                <span aria-hidden="true" className="opacity-40">
                  ·
                </span>
                <span className="font-mono tabular-nums">
                  {t.dailyGoalProgress}: {dailyCount.toLocaleString()}/{counter.dailyGoal.toLocaleString()} ({dailyPct}%)
                </span>
              </>
            )}
          </div>
        </div>

        {/* Center Tactile Up & Down Pads */}
        <div className="flex flex-col items-center gap-4">
          <button
            type="button"
            onClick={() => onIncrement()}
            aria-label={`${counter.name} +${counter.step}`}
            className={`w-46 h-46 sm:w-52 sm:h-52 rounded-[3.25rem] flex flex-col items-center justify-center shadow-xl transition-[transform,background-color,box-shadow] duration-150 active:scale-[0.92] cursor-pointer focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-sky-500/40 ${palette.focusPrimaryBg} ${palette.focusPrimaryText}`}
          >
            <ChevronsUp className="w-16 h-16 sm:w-20 sm:h-20 stroke-[2.25]" aria-hidden="true" />
            {counter.step > 1 && (
              <span className="mt-1 font-mono tabular-nums text-sm font-bold">
                +{counter.step}
              </span>
            )}
          </button>

          <button
            type="button"
            disabled={!canDecrement}
            onClick={onDecrement}
            aria-label={`${counter.name} −${counter.step}`}
            className={`w-28 h-24 sm:w-32 sm:h-28 rounded-[2.25rem] shadow-md flex items-center justify-center transition-[transform,opacity,background-color] duration-150 active:scale-[0.92] disabled:opacity-35 disabled:pointer-events-none cursor-pointer focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-sky-500/40 ${palette.focusSecondaryBg} ${palette.focusSecondaryText}`}
          >
            <ChevronsDown className="w-10 h-10 sm:w-12 sm:h-12 stroke-[2.25]" aria-hidden="true" />
          </button>
        </div>

        {/* Right Side Step Rail */}
        <div
          aria-label={t.stepLabel}
          className="absolute right-2 sm:right-8 top-1/2 -translate-y-1/2 flex flex-col items-end gap-1"
        >
          {STEP_OPTIONS.slice()
            .reverse()
            .map((stepVal) => {
              const isSelected = counter.step === stepVal;
              return (
                <button
                  key={stepVal}
                  type="button"
                  onClick={() => onStepChange(stepVal)}
                  className={`min-h-[44px] min-w-[48px] px-2.5 rounded-xl font-mono tabular-nums text-sm sm:text-base transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 ${
                    isSelected
                      ? `font-bold ${palette.focusText} bg-black/10 dark:bg-white/10`
                      : `font-medium ${palette.focusMuted} hover:bg-black/5 dark:hover:bg-white/5`
                  }`}
                >
                  +{stepVal}
                </button>
              );
            })}
        </div>
      </div>

      {/* Bottom Dedicated Reset Bar */}
      <footer className="px-4 sm:px-6 pb-[calc(1.5rem+env(safe-area-inset-bottom))] pt-2 flex items-center justify-center shrink-0">
        <button
          type="button"
          disabled={!canReset}
          onClick={onResetToZero}
          className={`min-h-[48px] px-6 rounded-2xl shadow-sm inline-flex items-center gap-2 text-sm font-semibold transition-[transform,opacity,background-color] duration-150 active:scale-[0.95] disabled:opacity-35 disabled:pointer-events-none cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 ${palette.focusSecondaryBg} ${palette.focusSecondaryText}`}
        >
          <RotateCcw className="w-4 h-4" aria-hidden="true" />
          <span>{t.resetCounterLabel}</span>
        </button>
      </footer>
    </div>
  );
}
