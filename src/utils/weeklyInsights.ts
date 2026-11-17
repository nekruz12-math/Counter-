import type { CounterItem } from '../types/counter';
import { getTodayKey } from './widgetProvider';

export interface WeekdayInsight {
  dayIndex: number; // 0 = Monday .. 6 = Sunday
  total: number;
  average: number; // 4-week average for this weekday (total / 4)
  isMostProductive: boolean;
}

export interface WeeklyInsightsSummary {
  total28Days: number;
  dailyAverage: number;
  mostProductiveDayIndex: number | null;
  maxWeekdayAverage: number;
  weekdays: WeekdayInsight[];
}

export function formatInsightNumber(value: number): string {
  if (value === 0) return '0';
  if (Number.isInteger(value)) return value.toLocaleString();
  return value >= 100
    ? Math.round(value).toLocaleString()
    : value.toLocaleString(undefined, { minimumFractionDigits: 1, maximumFractionDigits: 1 });
}

export function calculateWeeklyInsights(
  counters: CounterItem[],
  referenceDate: Date = new Date(),
): WeeklyInsightsSummary {
  const weekdayTotals = [0, 0, 0, 0, 0, 0, 0];
  let total28Days = 0;

  for (let offset = 0; offset < 28; offset += 1) {
    const d = new Date(referenceDate);
    d.setDate(referenceDate.getDate() - offset);
    const key = getTodayKey(d);
    const monBasedIndex = (d.getDay() + 6) % 7;

    let daySum = 0;
    for (const c of counters) {
      const recorded = c.dailyActivity?.[key] ?? 0;
      if (offset === 0) {
        const todayDaily = c.dailyCountDate === key ? c.dailyCount ?? 0 : 0;
        daySum += Math.max(recorded, todayDaily);
      } else {
        daySum += recorded;
      }
    }

    weekdayTotals[monBasedIndex] += daySum;
    total28Days += daySum;
  }

  let bestIndex: number | null = null;
  let maxTotal = 0;
  for (let i = 0; i < 7; i += 1) {
    if (weekdayTotals[i] > maxTotal) {
      maxTotal = weekdayTotals[i];
      bestIndex = i;
    }
  }

  const weekdays: WeekdayInsight[] = weekdayTotals.map((total, dayIndex) => ({
    dayIndex,
    total,
    average: total / 4,
    isMostProductive: bestIndex !== null && dayIndex === bestIndex,
  }));

  return {
    total28Days,
    dailyAverage: total28Days / 28,
    mostProductiveDayIndex: bestIndex,
    maxWeekdayAverage: maxTotal / 4,
    weekdays,
  };
}
