import { CheckCircle2, Target, TrendingUp } from 'lucide-react';
import type { SmartTranslations } from '../i18n/translations';
import type { CounterItem } from '../types/counter';
import { COUNTER_THEMES } from '../utils/themes';

interface GoalsArchiveViewProps {
  counters: CounterItem[];
  todayKey: string;
  onOpenFocus: (id: string) => void;
  t: SmartTranslations;
}

export function GoalsArchiveView({
  counters,
  todayKey,
  onOpenFocus,
  t,
}: GoalsArchiveViewProps) {
  const dailyGoalCounters = counters.filter((c) => (c.dailyGoal ?? 0) > 0);
  const completedCounters = counters.filter((c) => c.limit > 0 && c.count >= c.limit);

  return (
    <div className="flagship-enter space-y-5">
      {/* Today's Daily Goals (24h) */}
      {dailyGoalCounters.length > 0 && (
        <section className="rounded-3xl bg-white dark:bg-[#1B1D22] border border-slate-200/80 dark:border-white/8 p-4 sm:p-5 shadow-xs">
          <div className="flex items-center gap-2 mb-3.5">
            <Target className="w-4 h-4 text-sky-600 dark:text-sky-400 shrink-0" aria-hidden="true" />
            <h2 className="text-sm font-bold text-slate-900 dark:text-slate-100">
              {t.goalsDailyTitle}
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {dailyGoalCounters.map((c) => {
              const palette = COUNTER_THEMES[c.color] || COUNTER_THEMES.terracotta;
              const dailyCount = c.dailyCountDate === todayKey ? c.dailyCount ?? 0 : 0;
              const pct = Math.min(100, Math.round((dailyCount / c.dailyGoal) * 100));
              const done = dailyCount >= c.dailyGoal;

              return (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => onOpenFocus(c.id)}
                  className={`w-full text-left rounded-2xl border p-3.5 transition-transform active:scale-[0.98] cursor-pointer ${palette.cardBg} ${palette.cardBorder}`}
                >
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className={`font-bold text-sm truncate ${palette.cardTitle}`}>
                      {c.name}
                    </span>
                    <span className={`font-mono tabular-nums text-xs font-bold ${palette.cardTitle}`}>
                      {dailyCount}/{c.dailyGoal} ({pct}%)
                    </span>
                  </div>
                  <div className="h-1.5 w-full rounded-full bg-black/10 dark:bg-white/10 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-[width] duration-200 ${
                        done ? 'bg-emerald-500' : palette.progressFill
                      }`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </button>
              );
            })}
          </div>
        </section>
      )}

      {/* Reached & Exceeded Total Limits */}
      <section className="rounded-3xl bg-white dark:bg-[#1B1D22] border border-slate-200/80 dark:border-white/8 p-4 sm:p-5 shadow-xs">
        <h2 className="text-sm font-bold text-slate-900 dark:text-slate-100 mb-3.5">
          {t.goalsCompletedTitle}
        </h2>

        {completedCounters.length === 0 ? (
          <p className="text-sm text-slate-500 dark:text-slate-400 py-3">{t.goalsEmpty}</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {completedCounters.map((c) => {
              const palette = COUNTER_THEMES[c.color] || COUNTER_THEMES.terracotta;
              const isExceeded = c.count > c.limit;
              return (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => onOpenFocus(c.id)}
                  className={`w-full text-left rounded-2xl border p-3.5 flex items-center justify-between gap-3 cursor-pointer transition-transform active:scale-[0.98] ${palette.cardBg} ${palette.cardBorder}`}
                >
                  <div className="min-w-0">
                    <span className={`block font-bold truncate ${palette.cardTitle}`}>{c.name}</span>
                    <span className={`text-xs font-medium ${palette.cardMuted}`}>
                      {isExceeded
                        ? `+${(c.count - c.limit).toLocaleString()} ${t.overLimit}`
                        : t.limitReached}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className={`font-mono tabular-nums text-base font-bold ${palette.cardTitle}`}>
                      {c.count.toLocaleString()} / {c.limit.toLocaleString()}
                    </span>
                    {isExceeded ? (
                      <TrendingUp className="w-4 h-4 text-amber-500" aria-hidden="true" />
                    ) : (
                      <CheckCircle2 className="w-4 h-4 text-emerald-500" aria-hidden="true" />
                    )}
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
