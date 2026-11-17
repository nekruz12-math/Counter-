import { memo, useEffect, useRef, useState } from 'react';
import {
  Check,
  CheckCircle2,
  Flame,
  Lock,
  Minus,
  Plus,
  RotateCcw,
  TrendingDown,
  TrendingUp,
  X,
} from 'lucide-react';
import type { SmartTranslations } from '../i18n/translations';
import type { CounterItem } from '../types/counter';
import { triggerLightHaptic } from '../utils/feedback';
import { COUNTER_THEMES } from '../utils/themes';

interface CounterCardProps {
  counter: CounterItem;
  todayKey: string;
  powerSaver: boolean;
  onIncrement: (id: string) => void;
  onDecrement: (id: string) => void;
  onReset: (id: string) => void;
  onOpenFocus: (id: string) => void;
  t: SmartTranslations;
}

const LONG_PRESS_MS = 480;
const MOVE_CANCEL_PX = 10;

function formatDateKey(date: Date): string {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(
    date.getDate(),
  ).padStart(2, '0')}`;
}

function getWeeklyTrend(dailyActivity?: Record<string, number>): 'up' | 'down' | 'flat' {
  if (!dailyActivity) return 'flat';
  const now = new Date();
  let currentWeek = 0;
  let previousWeek = 0;

  for (let i = 0; i < 14; i += 1) {
    const d = new Date(now);
    d.setDate(now.getDate() - i);
    const key = formatDateKey(d);
    const value = dailyActivity[key] ?? 0;
    if (i < 7) {
      currentWeek += value;
    } else {
      previousWeek += value;
    }
  }

  if (currentWeek > previousWeek) return 'up';
  if (currentWeek < previousWeek) return 'down';
  return 'flat';
}

export const CounterCard = memo(function CounterCard({
  counter,
  todayKey,
  powerSaver,
  onIncrement,
  onDecrement,
  onReset,
  onOpenFocus,
  t,
}: CounterCardProps) {
  const [isPressing, setIsPressing] = useState(false);
  const [quickMenuOpen, setQuickMenuOpen] = useState(false);
  const [isPopping, setIsPopping] = useState(false);

  const pressTimerRef = useRef<number | null>(null);
  const startPosRef = useRef<{ x: number; y: number } | null>(null);
  const longPressTriggeredRef = useRef(false);
  const prevCountRef = useRef(counter.count);

  useEffect(() => {
    if (prevCountRef.current !== counter.count) {
      prevCountRef.current = counter.count;
      if (!powerSaver) {
        setIsPopping(true);
        const timer = window.setTimeout(() => setIsPopping(false), 150);
        return () => window.clearTimeout(timer);
      }
    }
  }, [counter.count, powerSaver]);

  const palette = COUNTER_THEMES[counter.color] || COUNTER_THEMES.terracotta;
  const hasDailyGoal = (counter.dailyGoal ?? 0) > 0;
  const dailyCount = counter.dailyCountDate === todayKey ? counter.dailyCount ?? 0 : 0;
  const dailyPct = hasDailyGoal
    ? Math.min(100, Math.round((dailyCount / counter.dailyGoal) * 100))
    : 0;
  const dailyDone = hasDailyGoal && dailyCount >= counter.dailyGoal;

  const limitPct = counter.limit > 0 ? Math.min(100, (counter.count / counter.limit) * 100) : 0;
  const isReached = counter.limit > 0 && counter.count === counter.limit;
  const isExceeded = counter.limit > 0 && counter.count > counter.limit;
  const canDecrement = !counter.locked && (counter.allowNegative || counter.count > 0);
  const canReset = !counter.locked && counter.count !== 0;
  const weeklyTrend = getWeeklyTrend(counter.dailyActivity);

  const clearPressTimer = () => {
    if (pressTimerRef.current !== null) {
      window.clearTimeout(pressTimerRef.current);
      pressTimerRef.current = null;
    }
    setIsPressing(false);
    startPosRef.current = null;
  };

  useEffect(() => {
    return () => {
      if (pressTimerRef.current !== null) {
        window.clearTimeout(pressTimerRef.current);
      }
    };
  }, []);

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.button !== 0 && e.pointerType === 'mouse') return;
    if (quickMenuOpen) return;

    longPressTriggeredRef.current = false;
    startPosRef.current = { x: e.clientX, y: e.clientY };
    setIsPressing(true);

    pressTimerRef.current = window.setTimeout(() => {
      pressTimerRef.current = null;
      longPressTriggeredRef.current = true;
      setIsPressing(false);
      setQuickMenuOpen(true);
      triggerLightHaptic();
    }, LONG_PRESS_MS);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!startPosRef.current || pressTimerRef.current === null) return;
    const dx = Math.abs(e.clientX - startPosRef.current.x);
    const dy = Math.abs(e.clientY - startPosRef.current.y);
    if (dx > MOVE_CANCEL_PX || dy > MOVE_CANCEL_PX) {
      clearPressTimer();
    }
  };

  const handleCardClick = () => {
    if (longPressTriggeredRef.current) {
      longPressTriggeredRef.current = false;
      return;
    }
    if (quickMenuOpen) {
      setQuickMenuOpen(false);
      return;
    }
    onOpenFocus(counter.id);
  };

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={handleCardClick}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={clearPressTimer}
      onPointerCancel={clearPressTimer}
      onPointerLeave={clearPressTimer}
      onContextMenu={(e) => {
        e.preventDefault();
        if (!quickMenuOpen) {
          setQuickMenuOpen(true);
        }
      }}
      onKeyDown={(e) => {
        if (e.key === 'Escape' && quickMenuOpen) {
          e.stopPropagation();
          setQuickMenuOpen(false);
        } else if ((e.key === 'Enter' || e.key === ' ') && !quickMenuOpen) {
          e.preventDefault();
          onOpenFocus(counter.id);
        }
      }}
      className={`group relative overflow-hidden rounded-3xl border ${palette.cardBg} ${palette.cardBorder} p-4 sm:p-5 shadow-xs hover:shadow-md transition-[transform,box-shadow] duration-150 select-none cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 ${
        isPressing ? 'scale-[0.98]' : 'active:scale-[0.99]'
      }`}
    >
      <div className="flex items-center justify-between gap-3">
        {/* Left Info & Count */}
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5">
            <h3 className={`text-base sm:text-lg font-bold truncate ${palette.cardTitle}`}>
              {counter.name}
            </h3>
            {counter.locked && (
              <Lock className={`w-3.5 h-3.5 shrink-0 ${palette.cardMuted}`} aria-label={t.lockedLabel} />
            )}
            {weeklyTrend === 'up' && (
              <span
                title={t.trendUpLabel}
                aria-label={t.trendUpLabel}
                className="inline-flex items-center text-emerald-700 dark:text-emerald-300 shrink-0"
              >
                <TrendingUp className="w-4 h-4" aria-hidden="true" />
              </span>
            )}
            {weeklyTrend === 'down' && (
              <span
                title={t.trendDownLabel}
                aria-label={t.trendDownLabel}
                className="inline-flex items-center text-rose-700 dark:text-rose-300 shrink-0"
              >
                <TrendingDown className="w-4 h-4" aria-hidden="true" />
              </span>
            )}
          </div>

          {counter.streakEnabled && (
            <div className={`mt-0.5 flex items-center gap-1 text-xs font-semibold ${palette.cardMuted}`}>
              <Flame className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
              <span className="font-mono tabular-nums">{counter.streak}</span>
            </div>
          )}

          <div className="mt-2 flex items-baseline gap-2 flex-wrap">
            <span
              className={`count-pop ${
                isPopping ? 'count-pop-active' : ''
              } font-mono tabular-nums text-4xl sm:text-[2.6rem] font-semibold leading-none tracking-tight ${palette.cardTitle}`}
            >
              {counter.count.toLocaleString()}
            </span>
            <span className={`font-mono tabular-nums text-base sm:text-lg font-medium ${palette.cardMuted}`}>
              {counter.limit.toLocaleString()}
              {counter.unit ? ` ${counter.unit}` : ''}
            </span>
            {isReached && (
              <span className={`inline-flex items-center gap-1 text-xs font-semibold ${palette.cardMuted}`}>
                <Check className="w-3.5 h-3.5" aria-hidden="true" />
              </span>
            )}
            {isExceeded && (
              <span className={`font-mono tabular-nums text-xs font-semibold ${palette.cardMuted}`}>
                +{(counter.count - counter.limit).toLocaleString()}
              </span>
            )}
          </div>
        </div>

        {/* Right Quick Step Buttons (- / +) */}
        <div
          className="flex items-center gap-2 shrink-0"
          onPointerDown={(e) => e.stopPropagation()}
          onClick={(e) => e.stopPropagation()}
          onKeyDown={(e) => e.stopPropagation()}
        >
          <button
            type="button"
            disabled={!canDecrement}
            onClick={() => onDecrement(counter.id)}
            aria-label={`${counter.name} −${counter.step}`}
            className={`min-h-[56px] w-13 sm:w-14 rounded-2xl shadow-xs flex items-center justify-center transition-[transform,opacity,background-color] duration-150 active:scale-[0.92] disabled:opacity-35 disabled:pointer-events-none cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60 ${palette.cardMinusBg} ${palette.cardMinusText}`}
          >
            <Minus className="w-5 h-5 stroke-[2.5]" aria-hidden="true" />
          </button>

          <button
            type="button"
            disabled={counter.locked}
            onClick={() => onIncrement(counter.id)}
            aria-label={`${counter.name} +${counter.step}`}
            className={`min-h-[56px] w-20 sm:w-24 rounded-2xl shadow-sm flex items-center justify-center transition-[transform,opacity,background-color] duration-150 active:scale-[0.92] disabled:opacity-35 disabled:pointer-events-none cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60 ${palette.cardPlusBg} ${palette.cardPlusText}`}
          >
            <Plus className="w-6 h-6 stroke-[2.5]" aria-hidden="true" />
          </button>
        </div>
      </div>

      {/* Long-Press Quick Actions Tray */}
      {quickMenuOpen && (
        <div
          role="toolbar"
          aria-label={t.quickActionsLabel}
          onPointerDown={(e) => e.stopPropagation()}
          onClick={(e) => e.stopPropagation()}
          onKeyDown={(e) => e.stopPropagation()}
          className="mt-3 pt-3 border-t border-black/10 dark:border-white/10 flex items-center justify-between gap-2"
        >
          <div className="flex items-center gap-2 flex-1 min-w-0">
            <button
              type="button"
              disabled={counter.locked}
              onClick={() => onIncrement(counter.id)}
              className={`min-h-[44px] flex-1 px-3 rounded-xl inline-flex items-center justify-center gap-1.5 text-xs font-bold transition-transform active:scale-[0.96] disabled:opacity-35 disabled:pointer-events-none cursor-pointer whitespace-nowrap ${palette.cardPlusBg} ${palette.cardPlusText}`}
            >
              <Plus className="w-4 h-4 shrink-0" aria-hidden="true" />
              <span>
                {t.quickIncrementBtn} (+{counter.step})
              </span>
            </button>

            <button
              type="button"
              disabled={!canReset}
              onClick={() => {
                onReset(counter.id);
                setQuickMenuOpen(false);
              }}
              className={`min-h-[44px] flex-1 px-3 rounded-xl inline-flex items-center justify-center gap-1.5 text-xs font-bold transition-transform active:scale-[0.96] disabled:opacity-35 disabled:pointer-events-none cursor-pointer whitespace-nowrap ${palette.cardMinusBg} ${palette.cardMinusText}`}
            >
              <RotateCcw className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
              <span>{t.quickResetBtn}</span>
            </button>
          </div>

          <button
            type="button"
            onClick={() => setQuickMenuOpen(false)}
            aria-label={t.cancelLabel}
            className={`min-h-[44px] min-w-[44px] rounded-xl flex items-center justify-center hover:bg-black/10 dark:hover:bg-white/10 shrink-0 cursor-pointer ${palette.cardTitle}`}
          >
            <X className="w-4 h-4" aria-hidden="true" />
          </button>
        </div>
      )}

      {/* Daily Goal Progress Bar (when Daily Goal is set) OR Total Limit Bar */}
      {hasDailyGoal ? (
        <div className="mt-3.5">
          <div className={`flex items-center justify-between gap-2 text-[11px] font-semibold mb-1 ${palette.cardMuted}`}>
            <span className="inline-flex items-center gap-1">
              {dailyDone && <CheckCircle2 className="w-3 h-3 text-emerald-500 shrink-0" aria-hidden="true" />}
              <span>{t.dailyGoalProgress}</span>
            </span>
            <span className="font-mono tabular-nums">
              {dailyCount.toLocaleString()} / {counter.dailyGoal.toLocaleString()} ({dailyPct}%)
            </span>
          </div>
          <div className="h-1.5 w-full rounded-full bg-black/10 dark:bg-black/25 overflow-hidden">
            <div
              className={`h-full rounded-full ${
                powerSaver ? '' : 'transition-[width] duration-200 ease-out'
              } ${dailyDone ? 'bg-emerald-500' : palette.progressFill}`}
              style={{ width: `${dailyPct}%` }}
            />
          </div>
        </div>
      ) : (
        <div className="mt-3.5 h-1 w-full rounded-full bg-black/10 dark:bg-black/25 overflow-hidden">
          <div
            className={`h-full rounded-full ${
              powerSaver ? '' : 'transition-[width] duration-200 ease-out'
            } ${palette.progressFill}`}
            style={{ width: `${limitPct}%` }}
          />
        </div>
      )}
    </div>
  );
});
