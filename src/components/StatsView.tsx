import { Award, BarChart2, CalendarDays } from 'lucide-react';
import { useMemo, useState } from 'react';
import type { SmartTranslations } from '../i18n/translations';
import type { CounterItem } from '../types/counter';
import { COUNTER_THEMES } from '../utils/themes';
import { calculateWeeklyInsights, formatInsightNumber } from '../utils/weeklyInsights';

interface StatsViewProps {
  counters: CounterItem[];
  powerSaver?: boolean;
  onOpenFocus: (id: string) => void;
  t: SmartTranslations;
}

export function StatsView({
  counters,
  powerSaver = false,
  onOpenFocus,
  t,
}: StatsViewProps) {
  const insights = useMemo(() => calculateWeeklyInsights(counters), [counters]);
  const [selectedDay, setSelectedDay] = useState<number | null>(null);

  const activeDayIndex =
    selectedDay !== null ? selectedDay : insights.mostProductiveDayIndex;
  const activeDayData =
    activeDayIndex !== null ? insights.weekdays[activeDayIndex] : null;

  return (
    <div className="flagship-enter space-y-5">
      {/* Weekly Insights (Last 4 Weeks) */}
      <section
        aria-label={t.weeklyInsightsTitle}
        className="rounded-3xl bg-white dark:bg-[#1B1D22] border border-slate-200/80 dark:border-white/8 p-4 sm:p-5 shadow-xs"
      >
        <div className="flex items-center justify-between gap-3 mb-4">
          <div className="flex items-center gap-2 min-w-0">
            <BarChart2 className="w-4 h-4 text-sky-600 dark:text-sky-400 shrink-0" aria-hidden="true" />
            <h2 className="text-sm sm:text-base font-bold text-slate-900 dark:text-slate-100 truncate">
              {t.weeklyInsightsTitle}
            </h2>
          </div>
          <span className="inline-flex items-center gap-1 text-xs font-semibold text-slate-500 dark:text-slate-400 shrink-0">
            <CalendarDays className="w-3.5 h-3.5" aria-hidden="true" />
            <span>{t.weeklyInsightsPeriod}</span>
          </span>
        </div>

        {/* Key 4-Week Insight Callouts */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-5">
          <div className="rounded-2xl bg-slate-50 dark:bg-[#131519] border border-slate-100 dark:border-white/6 p-3.5">
            <span className="block text-[11px] font-medium text-slate-500 dark:text-slate-400">
              {t.avgDailyCountLabel}
            </span>
            <span className="mt-1 block font-mono tabular-nums text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-50">
              {formatInsightNumber(insights.dailyAverage)}
            </span>
          </div>

          <div className="rounded-2xl bg-amber-50/80 dark:bg-amber-950/25 border border-amber-200/80 dark:border-amber-800/40 p-3.5">
            <span className="flex items-center gap-1 text-[11px] font-semibold text-amber-800 dark:text-amber-300">
              <Award className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
              <span className="truncate">{t.mostProductiveDayLabel}</span>
            </span>
            <span className="mt-1 block text-lg sm:text-xl font-bold text-amber-950 dark:text-amber-100 truncate">
              {insights.mostProductiveDayIndex !== null
                ? t.weekdaysFull[insights.mostProductiveDayIndex]
                : '—'}
            </span>
          </div>

          <div className="col-span-2 sm:col-span-1 rounded-2xl bg-slate-50 dark:bg-[#131519] border border-slate-100 dark:border-white/6 p-3.5">
            <span className="block text-[11px] font-medium text-slate-500 dark:text-slate-400">
              {t.weeklyTotalLabel}
            </span>
            <span className="mt-1 block font-mono tabular-nums text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-50">
              {insights.total28Days.toLocaleString()}
            </span>
          </div>
        </div>

        {/* 7-Day Bar Chart */}
        {insights.total28Days === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-200 dark:border-white/10 py-8 px-4 text-center">
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
              {t.weeklyNoData}
            </p>
          </div>
        ) : (
          <div>
            <div
              role="list"
              aria-label={t.weeklyInsightsTitle}
              className="relative h-44 pt-6 pb-1 px-1 grid grid-cols-7 gap-2 sm:gap-3 items-end"
            >
              {/* Subtle Horizontal Reference Lines */}
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-x-0 top-6 bottom-7 flex flex-col justify-between"
              >
                <div className="border-t border-dashed border-slate-200/80 dark:border-white/10" />
                <div className="border-t border-dashed border-slate-200/80 dark:border-white/10" />
                <div className="border-t border-slate-200 dark:border-white/15" />
              </div>

              {insights.weekdays.map((day) => {
                const heightPct =
                  insights.maxWeekdayAverage > 0
                    ? Math.max(
                        day.average > 0 ? 10 : 3,
                        Math.round((day.average / insights.maxWeekdayAverage) * 100),
                      )
                    : 3;
                const isSelected = activeDayIndex === day.dayIndex;
                const isBest = day.isMostProductive;

                return (
                  <button
                    key={day.dayIndex}
                    type="button"
                    role="listitem"
                    onClick={() => setSelectedDay(day.dayIndex)}
                    aria-label={`${t.weekdaysFull[day.dayIndex]}: ${formatInsightNumber(day.average)}`}
                    className="relative z-10 h-full flex flex-col items-center justify-end gap-1.5 group cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 rounded-xl"
                  >
                    <span
                      className={`font-mono tabular-nums text-[10px] sm:text-[11px] leading-none ${
                        isBest
                          ? 'font-bold text-amber-700 dark:text-amber-300'
                          : isSelected
                            ? 'font-bold text-slate-900 dark:text-white'
                            : 'font-medium text-slate-500 dark:text-slate-400'
                      }`}
                    >
                      {formatInsightNumber(day.average)}
                    </span>

                    <div className="w-full max-w-[38px] flex-1 flex items-end justify-center">
                      <div
                        style={{ height: `${heightPct}%` }}
                        className={`w-full rounded-t-xl ${
                          powerSaver
                            ? ''
                            : 'transition-[height,background-color,transform] duration-200 ease-out'
                        } ${
                          isBest
                            ? 'bg-amber-500 dark:bg-amber-400 shadow-sm'
                            : isSelected
                              ? 'bg-sky-600 dark:bg-sky-400'
                              : 'bg-slate-300 dark:bg-[#323640] group-hover:bg-slate-400 dark:group-hover:bg-[#404552]'
                        }`}
                      />
                    </div>

                    <span
                      className={`text-[11px] sm:text-xs leading-none ${
                        isBest
                          ? 'font-bold text-amber-700 dark:text-amber-300'
                          : isSelected
                            ? 'font-bold text-slate-900 dark:text-slate-100'
                            : 'font-medium text-slate-500 dark:text-slate-400'
                      }`}
                    >
                      {t.weekdaysShort[day.dayIndex]}
                    </span>
                  </button>
                );
              })}
            </div>

            {activeDayData && (
              <div className="mt-3 pt-3 border-t border-slate-100 dark:border-white/8 flex flex-wrap items-center justify-between gap-2 text-xs">
                <div className="flex items-center gap-2 font-semibold text-slate-800 dark:text-slate-100">
                  {activeDayData.isMostProductive && (
                    <Award className="w-3.5 h-3.5 text-amber-500 shrink-0" aria-hidden="true" />
                  )}
                  <span>{t.weekdaysFull[activeDayData.dayIndex]}</span>
                </div>
                <div className="flex items-center gap-2 font-mono tabular-nums text-slate-600 dark:text-slate-300">
                  <span>
                    {t.weeklySelectedDayAvg}:{' '}
                    <strong className="text-slate-900 dark:text-white">
                      {formatInsightNumber(activeDayData.average)}
                    </strong>
                  </span>
                  <span aria-hidden="true" className="text-slate-400">
                    ·
                  </span>
                  <span>
                    {t.weeklyTotalLabel}:{' '}
                    <strong className="text-slate-900 dark:text-white">
                      {activeDayData.total.toLocaleString()}
                    </strong>
                  </span>
                </div>
              </div>
            )}
          </div>
        )}
      </section>

      {/* Per-Counter Progress Breakdown */}
      <section className="rounded-3xl bg-white dark:bg-[#1B1D22] border border-slate-200/80 dark:border-white/8 p-4 sm:p-5 shadow-xs">
        <h2 className="text-sm font-bold text-slate-900 dark:text-slate-100 mb-4">
          {t.statsBreakdown}
        </h2>

        {counters.length === 0 ? (
          <p className="text-sm text-slate-500 dark:text-slate-400 py-4">{t.emptyCountersTitle}</p>
        ) : (
          <div className="space-y-4">
            {counters.map((c) => {
              const palette = COUNTER_THEMES[c.color] || COUNTER_THEMES.terracotta;
              const pct = c.limit > 0 ? Math.min(100, Math.round((c.count / c.limit) * 100)) : 0;
              return (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => onOpenFocus(c.id)}
                  className="w-full text-left group cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 rounded-lg"
                >
                  <div className="flex items-baseline justify-between gap-3 text-sm mb-1.5">
                    <span className="font-semibold text-slate-900 dark:text-slate-100 group-hover:underline truncate">
                      {c.name}
                    </span>
                    <span className="font-mono tabular-nums text-xs text-slate-500 dark:text-slate-400 shrink-0">
                      {c.count.toLocaleString()} / {c.limit.toLocaleString()} · {pct}%
                    </span>
                  </div>
                  <div className="h-2 rounded-full bg-slate-100 dark:bg-[#121316] overflow-hidden">
                    <div
                      className={`h-full rounded-full ${
                        powerSaver ? '' : 'transition-[width] duration-200'
                      } ${palette.progressFill}`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}
