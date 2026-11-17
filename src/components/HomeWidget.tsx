import { ArrowUpRight, CheckCircle2, Plus, Sparkles } from 'lucide-react';
import { useEffect, useState } from 'react';
import type { SmartTranslations } from '../i18n/translations';
import type { HomeWidgetSnapshot } from '../types/counter';
import { COUNTER_THEMES } from '../utils/themes';
import { readWidgetSnapshot, WIDGET_STORAGE_KEY } from '../utils/widgetProvider';

interface HomeWidgetProps {
  snapshot: HomeWidgetSnapshot | null;
  powerSaver: boolean;
  onIncrement: (id: string) => void;
  onOpenFocus: (id: string) => void;
  t: SmartTranslations;
}

export function HomeWidget({
  snapshot,
  powerSaver,
  onIncrement,
  onOpenFocus,
  t,
}: HomeWidgetProps) {
  const [storedSnapshot, setStoredSnapshot] = useState<HomeWidgetSnapshot | null>(() =>
    readWidgetSnapshot(),
  );

  useEffect(() => {
    setStoredSnapshot(snapshot ?? readWidgetSnapshot());
  }, [snapshot]);

  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key === WIDGET_STORAGE_KEY) {
        setStoredSnapshot(readWidgetSnapshot());
      }
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  const activeWidget = snapshot ?? storedSnapshot;
  if (!activeWidget) return null;

  const palette = COUNTER_THEMES[activeWidget.color] || COUNTER_THEMES.terracotta;
  const hasDailyGoal = activeWidget.dailyGoal > 0;
  const target = hasDailyGoal ? activeWidget.dailyGoal : activeWidget.limit;
  const progressValue = hasDailyGoal ? activeWidget.dailyCount : activeWidget.count;
  const pct = target > 0 ? Math.min(100, Math.round((progressValue / target) * 100)) : 0;
  const dailyDone = hasDailyGoal && activeWidget.dailyCount >= activeWidget.dailyGoal;

  return (
    <section
      aria-label={t.widgetTitle}
      className="rounded-3xl bg-white dark:bg-[#211A17] border border-slate-200/90 dark:border-[#362B26] p-4 sm:p-5 shadow-sm"
    >
      <div className="flex items-center justify-between gap-3 mb-3">
        <div className="flex items-center gap-2 min-w-0">
          <Sparkles className="w-4 h-4 text-sky-600 dark:text-sky-400 shrink-0" aria-hidden="true" />
          <span className="text-xs font-bold text-slate-600 dark:text-[#CFC0BA] truncate">
            {t.widgetTitle}
          </span>
          <span aria-hidden="true" className="text-slate-300 dark:text-slate-600">
            ·
          </span>
          <span className="text-xs font-medium text-slate-500 dark:text-[#A5948D] truncate">
            {t.widgetMostActive}
          </span>
        </div>

        <button
          type="button"
          onClick={() => onOpenFocus(activeWidget.counterId)}
          className="min-h-[34px] px-2.5 rounded-xl text-xs font-semibold text-slate-700 dark:text-[#E7D8D2] hover:bg-slate-100 dark:hover:bg-white/10 inline-flex items-center gap-1 cursor-pointer shrink-0 transition-colors"
        >
          <span>{t.widgetOpenFocus}</span>
          <ArrowUpRight className="w-3.5 h-3.5" aria-hidden="true" />
        </button>
      </div>

      <div className="flex items-center justify-between gap-4">
        <div className="min-w-0 flex-1">
          <div className="flex items-baseline gap-2.5 flex-wrap">
            <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-[#F8EFEA] truncate">
              {activeWidget.name}
            </h2>
            <span className="font-mono tabular-nums text-2xl sm:text-3xl font-bold text-slate-950 dark:text-white leading-none">
              {activeWidget.count.toLocaleString()}
            </span>
            {activeWidget.unit && (
              <span className="text-xs font-medium text-slate-500 dark:text-[#A5948D]">
                {activeWidget.unit}
              </span>
            )}
          </div>

          <div className="mt-2.5">
            <div className="flex items-center justify-between gap-2 text-xs mb-1.5">
              <span className="font-medium text-slate-600 dark:text-[#C8B8B2] inline-flex items-center gap-1.5">
                {dailyDone && (
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" aria-hidden="true" />
                )}
                <span>{hasDailyGoal ? t.dailyGoalProgress : t.limitLabel}</span>
              </span>
              <span className="font-mono tabular-nums font-bold text-slate-800 dark:text-[#F0E3DE]">
                {progressValue.toLocaleString()} / {target.toLocaleString()} ({pct}%)
              </span>
            </div>
            <div className="h-2 w-full rounded-full bg-slate-100 dark:bg-[#140F0D] overflow-hidden">
              <div
                className={`h-full rounded-full ${
                  powerSaver ? '' : 'transition-[width] duration-200 ease-out'
                } ${dailyDone ? 'bg-emerald-500' : palette.progressFill}`}
                style={{ width: `${pct}%` }}
              />
            </div>
          </div>
        </div>

        <button
          type="button"
          disabled={activeWidget.locked}
          onClick={() => onIncrement(activeWidget.counterId)}
          aria-label={`${activeWidget.name} +${activeWidget.step}`}
          className={`min-h-[54px] min-w-[54px] px-4 rounded-2xl flex items-center justify-center gap-1 font-mono tabular-nums text-sm font-bold shadow-sm transition-transform duration-150 active:scale-[0.94] disabled:opacity-35 disabled:pointer-events-none shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 ${palette.cardPlusBg} ${palette.cardPlusText}`}
        >
          <Plus className="w-5 h-5 stroke-[2.5]" aria-hidden="true" />
          {activeWidget.step > 1 && <span>{activeWidget.step}</span>}
        </button>
      </div>
    </section>
  );
}
