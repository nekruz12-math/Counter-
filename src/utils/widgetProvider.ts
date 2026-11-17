import type { CounterItem, HomeWidgetSnapshot } from '../types/counter';

export const WIDGET_STORAGE_KEY = 'smart_counter_widget_v1';

export function getTodayKey(date: Date = new Date()): string {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(
    date.getDate(),
  ).padStart(2, '0')}`;
}

export function selectMostFrequentCounter(counters: CounterItem[]): CounterItem | null {
  const active = counters.filter((c) => !c.archived);
  if (active.length === 0) return null;

  const sorted = active.slice().sort((a, b) => {
    const accessDiff = (b.accessCount ?? 0) - (a.accessCount ?? 0);
    if (accessDiff !== 0) return accessDiff;

    const activityA = Object.values(a.dailyActivity ?? {}).reduce((s, v) => s + v, 0);
    const activityB = Object.values(b.dailyActivity ?? {}).reduce((s, v) => s + v, 0);
    if (activityB !== activityA) return activityB - activityA;

    return b.updatedAt - a.updatedAt;
  });

  return sorted[0];
}

export function buildWidgetSnapshot(counters: CounterItem[]): HomeWidgetSnapshot | null {
  const top = selectMostFrequentCounter(counters);
  if (!top) return null;

  const today = getTodayKey();
  const dailyCount = top.dailyCountDate === today ? top.dailyCount ?? 0 : 0;

  return {
    counterId: top.id,
    name: top.name,
    count: top.count,
    limit: top.limit,
    dailyGoal: top.dailyGoal ?? 0,
    dailyCount,
    unit: top.unit,
    color: top.color,
    accessCount: top.accessCount ?? 0,
    locked: top.locked,
    step: top.step ?? 1,
    updatedAt: Date.now(),
  };
}

export function writeWidgetSnapshot(snapshot: HomeWidgetSnapshot | null): void {
  if (typeof window === 'undefined') return;
  try {
    if (!snapshot) {
      window.localStorage.removeItem(WIDGET_STORAGE_KEY);
    } else {
      window.localStorage.setItem(WIDGET_STORAGE_KEY, JSON.stringify(snapshot));
    }
  } catch {
    // Ignore storage quota errors
  }
}

export function readWidgetSnapshot(): HomeWidgetSnapshot | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = window.localStorage.getItem(WIDGET_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<HomeWidgetSnapshot>;
    if (!parsed || typeof parsed.counterId !== 'string' || typeof parsed.name !== 'string') {
      return null;
    }
    return {
      counterId: parsed.counterId,
      name: parsed.name,
      count: typeof parsed.count === 'number' ? parsed.count : 0,
      limit: typeof parsed.limit === 'number' ? parsed.limit : 100,
      dailyGoal: typeof parsed.dailyGoal === 'number' ? parsed.dailyGoal : 0,
      dailyCount: typeof parsed.dailyCount === 'number' ? parsed.dailyCount : 0,
      unit: typeof parsed.unit === 'string' ? parsed.unit : '',
      color: parsed.color ?? 'terracotta',
      accessCount: typeof parsed.accessCount === 'number' ? parsed.accessCount : 0,
      locked: Boolean(parsed.locked),
      step: typeof parsed.step === 'number' ? parsed.step : 1,
      updatedAt: typeof parsed.updatedAt === 'number' ? parsed.updatedAt : Date.now(),
    };
  } catch {
    return null;
  }
}
