import { ArchiveRestore, CheckCircle2, TrendingUp } from 'lucide-react';
import type { SmartTranslations } from '../i18n/translations';
import type { CounterItem } from '../types/counter';
import { COUNTER_THEMES } from '../utils/themes';

interface GoalsArchiveViewProps {
  counters: CounterItem[];
  onOpenFocus: (id: string) => void;
  onUnarchive: (id: string) => void;
  t: SmartTranslations;
}

export function GoalsArchiveView({
  counters,
  onOpenFocus,
  onUnarchive,
  t,
}: GoalsArchiveViewProps) {
  const completedCounters = counters.filter(
    (c) => !c.archived && c.limit > 0 && c.count >= c.limit,
  );
  const archivedCounters = counters.filter((c) => c.archived);

  return (
    <div className="space-y-6">
      {/* Reached & Exceeded Goals */}
      <section className="rounded-2xl bg-white dark:bg-[#231B18] border border-slate-200 dark:border-[#352A25] p-4 sm:p-5">
        <h2 className="text-sm font-bold text-slate-900 dark:text-slate-100 mb-3">
          {t.goalsCompletedTitle}
        </h2>

        {completedCounters.length === 0 ? (
          <p className="text-sm text-slate-500 dark:text-slate-400 py-3">{t.goalsEmpty}</p>
        ) : (
          <div className="space-y-2.5">
            {completedCounters.map((c) => {
              const palette = COUNTER_THEMES[c.color] || COUNTER_THEMES.terracotta;
              const isExceeded = c.count > c.limit;
              return (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => onOpenFocus(c.id)}
                  className={`w-full text-left rounded-2xl border p-3.5 flex items-center justify-between gap-3 cursor-pointer transition-transform active:scale-[0.99] ${palette.cardBg} ${palette.cardBorder}`}
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
                    <span className={`font-mono tabular-nums text-lg font-bold ${palette.cardTitle}`}>
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

      {/* Archived Counters */}
      <section className="rounded-2xl bg-white dark:bg-[#231B18] border border-slate-200 dark:border-[#352A25] p-4 sm:p-5">
        <h2 className="text-sm font-bold text-slate-900 dark:text-slate-100 mb-3">
          {t.archivedTitle}
        </h2>

        {archivedCounters.length === 0 ? (
          <p className="text-sm text-slate-500 dark:text-slate-400 py-3">{t.archivedEmpty}</p>
        ) : (
          <ul className="divide-y divide-slate-100 dark:divide-[#352A25]">
            {archivedCounters.map((c) => (
              <li key={c.id} className="py-3 flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <p className="font-semibold text-slate-900 dark:text-slate-100 truncate">
                    {c.name}
                  </p>
                  <p className="font-mono tabular-nums text-xs text-slate-500 dark:text-slate-400">
                    {c.count.toLocaleString()} / {c.limit.toLocaleString()}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => onUnarchive(c.id)}
                  className="min-h-[40px] px-3 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-[#16110F] dark:hover:bg-[#2C221E] text-xs font-semibold inline-flex items-center gap-1.5 cursor-pointer shrink-0"
                >
                  <ArchiveRestore className="w-4 h-4" aria-hidden="true" />
                  <span>{t.restoreBtn}</span>
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
