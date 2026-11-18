import { memo, useEffect, useRef, useState } from 'react';
import {
  Check,
  CheckCircle2,
  Flame,
  TrendingDown,
  TrendingUp,
} from 'lucide-react';
import type { SmartTranslations } from '../i18n/translations';
import type { CounterItem } from '../types/counter';
import { COUNTER_THEMES } from '../utils/themes';

interface CounterCardProps {
  counter: CounterItem;
  todayKey: string;
  powerSaver: boolean;
  onOpenFocus: (id: string) => void;
  t: SmartTranslations;
}

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
  onOpenFocus,
  t,
}: CounterCardProps) {
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
  const hasDailyGoal = (counter.dailyGoal ?? 0) > 0;
  const dailyCount = counter.dailyCountDate === todayKey ? counter.dailyCount ?? 0 : 0;
  const dailyPct = hasDailyGoal
    ? Math.min(100, Math.round((dailyCount / counter.dailyGoal) * 100))
    : 0;
  const dailyDone = hasDailyGoal && dailyCount >= counter.dailyGoal;

  const limitPct =
    counter.limit > 0 ? Math.min(100, Math.round((counter.count / counter.limit) * 100)) : 0;
  const isReached = counter.limit > 0 && counter.count === counter.limit;
  const isExceeded = counter.limit > 0 && counter.count > counter.limit;
  const weeklyTrend = getWeeklyTrend(counter.dailyActivity);

  return (
    <button
      type="button"
      onClick={() => onOpenFocus(counter.id)}
      className={`group relative w-full text-left overflow-hidden rounded-[1.6rem] border ${palette.cardBg} ${palette.cardBorder} p-3.5 sm:p-5 shadow-xs hover:shadow-md transition-[transform,box-shadow] duration-150 active:scale-[0.96] select-none cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 flex flex-col justify-between min-h-[138px] sm:min-h-[154px]`}
    >
      {/* Top Row: Title + Badges */}
      <div className="flex items-start justify-between gap-1.5 w-full">
        <h3 className={`text-sm sm:text-base font-bold leading-snug truncate ${palette.cardTitle}`}>
          {counter.name}
        </h3>

        <div className="flex items-center gap-1 shrink-0">
          {counter.streakEnabled && (
            <span
              className={`inline-flex items-center gap-0.5 text-[11px] font-bold ${palette.cardMuted}`}
            >
              <Flame className="w-3 h-3 shrink-0" aria-hidden="true" />
              <span className="font-mono tabular-nums">{counter.streak}</span>
            </span>
          )}
          {weeklyTrend === 'up' && (
            <span
              title={t.trendUpLabel}
              aria-label={t.trendUpLabel}
              className="inline-flex items-center text-emerald-700 dark:text-emerald-300"
            >
              <TrendingUp className="w-3.5 h-3.5" aria-hidden="true" />
            </span>
          )}
          {weeklyTrend === 'down' && (
            <span
              title={t.trendDownLabel}
              aria-label={t.trendDownLabel}
              className="inline-flex items-center text-rose-700 dark:text-rose-300"
            >
              <TrendingDown className="w-3.5 h-3.5" aria-hidden="true" />
            </span>
          )}
        </div>
      </div>

      {/* Center Value + Limit */}
      <div className="my-2.5 flex items-baseline gap-1.5 flex-wrap">
        <span
          className={`count-pop ${
            isPopping ? 'count-pop-active' : ''
          } font-mono tabular-nums text-3xl sm:text-4xl font-bold leading-none tracking-tight ${palette.cardTitle}`}
        >
          {counter.count.toLocaleString()}
        </span>
        <span className={`font-mono tabular-nums text-xs sm:text-sm font-semibold ${palette.cardMuted}`}>
          / {counter.limit.toLocaleString()}
          {counter.unit ? ` ${counter.unit}` : ''}
        </span>
        {isReached && (
          <span className={`inline-flex items-center ${palette.cardMuted}`}>
            <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" aria-hidden="true" />
          </span>
        )}
        {isExceeded && (
          <span className={`font-mono tabular-nums text-[11px] font-bold ${palette.cardMuted}`}>
            +{(counter.count - counter.limit).toLocaleString()}
          </span>
        )}
      </div>

      {/* Bottom Progress Bar (Daily Goal if active, else Total Limit) */}
      {hasDailyGoal ? (
        <div className="w-full mt-auto pt-1">
          <div
            className={`flex items-center justify-between gap-1 text-[10px] sm:text-[11px] font-semibold mb-1 ${palette.cardMuted}`}
          >
            <span className="inline-flex items-center gap-1 truncate">
              {dailyDone && (
                <CheckCircle2 className="w-3 h-3 text-emerald-500 shrink-0" aria-hidden="true" />
              )}
              <span className="truncate">{t.dailyGoalProgress}</span>
            </span>
            <span className="font-mono tabular-nums shrink-0">
              {dailyCount}/{counter.dailyGoal} ({dailyPct}%)
            </span>
          </div>
          <div className="h-1.5 w-full rounded-full bg-black/10 dark:bg-white/10 overflow-hidden">
            <div
              className={`h-full rounded-full ${
                powerSaver ? '' : 'transition-[width] duration-200 ease-out'
              } ${dailyDone ? 'bg-emerald-500' : palette.progressFill}`}
              style={{ width: `${dailyPct}%` }}
            />
          </div>
        </div>
      ) : (
        <div className="w-full mt-auto pt-1">
          <div
            className={`flex items-center justify-between gap-1 text-[10px] font-semibold mb-1 ${palette.cardMuted}`}
          >
            <span className="truncate">{t.limitLabel}</span>
            <span className="font-mono tabular-nums shrink-0">{limitPct}%</span>
          </div>
          <div className="h-1.5 w-full rounded-full bg-black/10 dark:bg-white/10 overflow-hidden">
            <div
              className={`h-full rounded-full ${
                powerSaver ? '' : 'transition-[width] duration-200 ease-out'
              } ${palette.progressFill}`}
              style={{ width: `${limitPct}%` }}
            />
          </div>
        </div>
      )}
    </button>
  );
});
