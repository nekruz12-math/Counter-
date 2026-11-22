import type { AppPreferences, CounterItem, SmartCounterStore } from '../types/counter';
import { getScheduledThemeForNow } from './solarSchedule';
import { buildWidgetSnapshot, getTodayKey, writeWidgetSnapshot } from './widgetProvider';

export const APP_VERSION = '2.0.0';
export const APP_VERSION_CODE = 200;

export const PRIMARY_STORAGE_KEY = 'smart_counter_free_v1';
export const BACKUP_STORAGE_KEY = 'smart_counter_backup_v1';
export const VAULT_STORAGE_KEY = 'smart_counter_v2_vault';
export const VERSION_META_KEY = 'smart_counter_app_version';

const LEGACY_KEYS = [
  PRIMARY_STORAGE_KEY,
  BACKUP_STORAGE_KEY,
  VAULT_STORAGE_KEY,
  'smart_counter_store',
  'counter_store_v1',
];

const IDB_NAME = 'CounterPersistentVaultDB';
const IDB_STORE = 'app_state_v2';
const IDB_KEY = 'latest_store';

export const DEFAULT_PREFERENCES: AppPreferences = {
  soundEnabled: true,
  hapticEnabled: true,
  hapticIntensity: 'medium',
  notificationsEnabled: true,
  powerSaver: false,
  theme: 'dark',
  scheduleDarkMode: false,
  solarLatitude: null,
  solarLongitude: null,
  pinCode: null,
  biometricEnabled: false,
  biometricCredentialId: null,
  language: 'tg',
};

export function createStarterCounters(): CounterItem[] {
  const now = Date.now();
  const today = getTodayKey();
  return [
    {
      id: 'starter-slwt',
      name: 'SLWT',
      count: 0,
      limit: 100,
      dailyGoal: 33,
      dailyCount: 0,
      dailyCountDate: today,
      unit: '',
      color: 'terracotta',
      step: 1,
      streakEnabled: false,
      streak: 0,
      lastCountDate: null,
      reminderTime: '',
      lastReminderDate: null,
      accessCount: 3,
      createdAt: now,
      updatedAt: now,
    },
    {
      id: 'starter-istgh',
      name: 'iSTGh',
      count: 0,
      limit: 500,
      dailyGoal: 100,
      dailyCount: 0,
      dailyCountDate: today,
      unit: '',
      color: 'olive',
      step: 1,
      streakEnabled: true,
      streak: 1,
      lastCountDate: null,
      reminderTime: '',
      lastReminderDate: null,
      accessCount: 1,
      createdAt: now - 1000,
      updatedAt: now,
    },
    {
      id: 'starter-tsb',
      name: 'TSB',
      count: 4,
      limit: 100,
      dailyGoal: 33,
      dailyCount: 4,
      dailyCountDate: today,
      unit: 'та',
      color: 'teal',
      step: 1,
      streakEnabled: true,
      streak: 1,
      lastCountDate: today,
      reminderTime: '',
      lastReminderDate: null,
      accessCount: 2,
      dailyActivity: { [today]: 4 },
      createdAt: now - 2000,
      updatedAt: now,
    },
    {
      id: 'starter-jws',
      name: 'JWS',
      count: 45,
      limit: 100,
      dailyGoal: 100,
      dailyCount: 45,
      dailyCountDate: today,
      unit: '',
      color: 'navy',
      step: 1,
      streakEnabled: true,
      streak: 1,
      lastCountDate: today,
      reminderTime: '',
      lastReminderDate: null,
      accessCount: 5,
      dailyActivity: { [today]: 45 },
      createdAt: now - 3000,
      updatedAt: now,
    },
    {
      id: 'starter-ruz',
      name: 'Ruz',
      count: 0,
      limit: 100,
      dailyGoal: 50,
      dailyCount: 0,
      dailyCountDate: today,
      unit: '',
      color: 'plum',
      step: 1,
      streakEnabled: true,
      streak: 1,
      lastCountDate: null,
      reminderTime: '',
      lastReminderDate: null,
      accessCount: 1,
      createdAt: now - 4000,
      updatedAt: now,
    },
  ];
}

export function normalizeCountersForToday(list: unknown[], today: string): CounterItem[] {
  return list
    .filter(
      (item): item is Record<string, unknown> =>
        Boolean(item && typeof item === 'object' && typeof (item as { id?: unknown }).id === 'string'),
    )
    .map((c) => {
      const isSameDay = c.dailyCountDate === today;
      const rawColor = typeof c.color === 'string' ? c.color : 'terracotta';
      const validColor = (
        ['terracotta', 'olive', 'amber', 'teal', 'navy', 'plum', 'slate'].includes(rawColor)
          ? rawColor
          : 'terracotta'
      ) as CounterItem['color'];

      const rawActivity =
        c.dailyActivity && typeof c.dailyActivity === 'object'
          ? (c.dailyActivity as Record<string, number>)
          : undefined;

      return {
        id: String(c.id),
        name: typeof c.name === 'string' && c.name.trim() ? c.name : 'Counter',
        note: typeof c.note === 'string' ? c.note : '',
        count:
          typeof c.count === 'number' && Number.isFinite(c.count) ? Math.max(0, c.count) : 0,
        limit:
          typeof c.limit === 'number' && Number.isFinite(c.limit) ? Math.max(1, c.limit) : 100,
        step: typeof c.step === 'number' && c.step >= 1 ? c.step : 1,
        dailyGoal:
          typeof c.dailyGoal === 'number' && c.dailyGoal >= 0 ? c.dailyGoal : 0,
        dailyCount:
          isSameDay && typeof c.dailyCount === 'number' ? Math.max(0, c.dailyCount) : 0,
        dailyCountDate: today,
        unit: typeof c.unit === 'string' ? c.unit : '',
        color: validColor,
        streakEnabled: typeof c.streakEnabled === 'boolean' ? c.streakEnabled : false,
        streak: typeof c.streak === 'number' && c.streak >= 0 ? c.streak : 0,
        lastCountDate: typeof c.lastCountDate === 'string' ? c.lastCountDate : null,
        reminderTime: typeof c.reminderTime === 'string' ? c.reminderTime : '',
        lastReminderDate: typeof c.lastReminderDate === 'string' ? c.lastReminderDate : null,
        accessCount: typeof c.accessCount === 'number' ? c.accessCount : 0,
        dailyActivity: rawActivity,
        createdAt: typeof c.createdAt === 'number' ? c.createdAt : Date.now(),
        updatedAt: typeof c.updatedAt === 'number' ? c.updatedAt : Date.now(),
      };
    });
}

export function parseRawStore(raw: string, today: string): SmartCounterStore | null {
  try {
    const parsed = JSON.parse(raw) as Partial<SmartCounterStore> & { updatedAt?: number };
    if (!parsed || typeof parsed !== 'object') return null;
    if (!Array.isArray(parsed.counters)) return null;

    const counters = normalizeCountersForToday(parsed.counters, today);
    const prefs = parsed.preferences;
    const scheduleDarkMode =
      typeof prefs?.scheduleDarkMode === 'boolean' ? prefs.scheduleDarkMode : false;
    const solarLatitude =
      typeof prefs?.solarLatitude === 'number' ? prefs.solarLatitude : null;
    const solarLongitude =
      typeof prefs?.solarLongitude === 'number' ? prefs.solarLongitude : null;

    let resolvedTheme: 'light' | 'dark' = prefs?.theme === 'light' ? 'light' : 'dark';
    if (scheduleDarkMode) {
      resolvedTheme = getScheduledThemeForNow(new Date(), solarLatitude, solarLongitude).theme;
    }

    const preferences: AppPreferences = {
      soundEnabled: typeof prefs?.soundEnabled === 'boolean' ? prefs.soundEnabled : true,
      hapticEnabled: typeof prefs?.hapticEnabled === 'boolean' ? prefs.hapticEnabled : true,
      hapticIntensity:
        prefs?.hapticIntensity === 'low' || prefs?.hapticIntensity === 'high'
          ? prefs.hapticIntensity
          : 'medium',
      notificationsEnabled:
        typeof prefs?.notificationsEnabled === 'boolean' ? prefs.notificationsEnabled : true,
      powerSaver: typeof prefs?.powerSaver === 'boolean' ? prefs.powerSaver : false,
      theme: resolvedTheme,
      scheduleDarkMode,
      solarLatitude,
      solarLongitude,
      pinCode:
        typeof prefs?.pinCode === 'string' && /^\d{4}$/.test(prefs.pinCode)
          ? prefs.pinCode
          : null,
      biometricEnabled:
        typeof prefs?.biometricEnabled === 'boolean' ? prefs.biometricEnabled : false,
      biometricCredentialId:
        typeof prefs?.biometricCredentialId === 'string' ? prefs.biometricCredentialId : null,
      language: prefs?.language === 'ru' ? 'ru' : prefs?.language === 'en' ? 'en' : 'tg',
    };

    return { counters, preferences };
  } catch {
    return null;
  }
}

function computeStoreScore(store: SmartCounterStore): number {
  const maxUpdated = store.counters.reduce((max, c) => Math.max(max, c.updatedAt || 0), 0);
  const totalCount = store.counters.reduce((sum, c) => sum + (c.count || 0), 0);
  return maxUpdated + totalCount;
}

/**
 * Loads user data across APK updates by inspecting all primary, backup, and vault keys,
 * picking the most recent non-corrupted user snapshot, and migrating schema in-place.
 */
export function loadStoreWithMigration(): SmartCounterStore {
  const today = getTodayKey();
  if (typeof window === 'undefined') {
    return {
      counters: createStarterCounters(),
      preferences: DEFAULT_PREFERENCES,
    };
  }

  let bestCandidate: SmartCounterStore | null = null;
  let bestScore = -1;

  try {
    for (const key of LEGACY_KEYS) {
      const raw = window.localStorage.getItem(key);
      if (!raw) continue;
      const parsed = parseRawStore(raw, today);
      if (parsed) {
        const score = computeStoreScore(parsed);
        if (!bestCandidate || score > bestScore) {
          bestCandidate = parsed;
          bestScore = score;
        }
      }
    }

    // Also check Android native SharedPreferences vault if available
    const nativeBridge = (
      window as unknown as {
        CounterNative?: {
          loadNativeVault?: () => string;
          saveNativeVault?: (json: string) => void;
        };
      }
    ).CounterNative;
    if (nativeBridge && typeof nativeBridge.loadNativeVault === 'function') {
      const nativeRaw = nativeBridge.loadNativeVault();
      if (nativeRaw) {
        const parsedNative = parseRawStore(nativeRaw, today);
        if (parsedNative) {
          const score = computeStoreScore(parsedNative);
          if (!bestCandidate || score > bestScore) {
            bestCandidate = parsedNative;
            bestScore = score;
          }
        }
      }
    }
  } catch {
    // Ignore storage read errors
  }

  if (bestCandidate) {
    // Immediately write migrated v2 data to all redundant keys so update migration is locked in
    persistStoreImmediately(bestCandidate);
    try {
      window.localStorage.setItem(VERSION_META_KEY, APP_VERSION);
    } catch {
      // Ignore
    }
    return bestCandidate;
  }

  const starter: SmartCounterStore = {
    counters: createStarterCounters(),
    preferences: DEFAULT_PREFERENCES,
  };
  return starter;
}

/**
 * Synchronously writes to 3 localStorage keys + Android Native SharedPreferences + widget snapshot, and mirrors to IndexedDB.
 */
export function persistStoreImmediately(store: SmartCounterStore): void {
  if (typeof window === 'undefined') return;
  try {
    const payload = JSON.stringify({
      ...store,
      appVersion: APP_VERSION,
      versionCode: APP_VERSION_CODE,
      savedAt: Date.now(),
    });
    window.localStorage.setItem(PRIMARY_STORAGE_KEY, payload);
    window.localStorage.setItem(BACKUP_STORAGE_KEY, payload);
    window.localStorage.setItem(VAULT_STORAGE_KEY, payload);
    window.localStorage.setItem(VERSION_META_KEY, APP_VERSION);

    const nativeBridge = (
      window as unknown as {
        CounterNative?: {
          saveNativeVault?: (json: string) => void;
        };
      }
    ).CounterNative;
    if (nativeBridge && typeof nativeBridge.saveNativeVault === 'function') {
      nativeBridge.saveNativeVault(payload);
    }

    writeWidgetSnapshot(buildWidgetSnapshot(store.counters));
  } catch {
    // Ignore storage quota errors
  }
  void writeStoreToIndexedDB(store);
}

function openVaultDB(): Promise<IDBDatabase | null> {
  if (typeof window === 'undefined' || !('indexedDB' in window)) {
    return Promise.resolve(null);
  }
  return new Promise((resolve) => {
    try {
      const req = window.indexedDB.open(IDB_NAME, 1);
      req.onupgradeneeded = () => {
        const db = req.result;
        if (!db.objectStoreNames.contains(IDB_STORE)) {
          db.createObjectStore(IDB_STORE);
        }
      };
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => resolve(null);
    } catch {
      resolve(null);
    }
  });
}

export async function writeStoreToIndexedDB(store: SmartCounterStore): Promise<void> {
  const db = await openVaultDB();
  if (!db) return;
  try {
    const tx = db.transaction(IDB_STORE, 'readwrite');
    tx.objectStore(IDB_STORE).put(JSON.stringify(store), IDB_KEY);
  } catch {
    // Ignore IDB errors
  }
}

export async function recoverStoreFromIndexedDBIfNeeded(
  currentStore: SmartCounterStore,
): Promise<SmartCounterStore | null> {
  // Request persistent storage permission from Android WebView so OS never evicts app data
  if (typeof navigator !== 'undefined' && navigator.storage && navigator.storage.persist) {
    try {
      await navigator.storage.persist();
    } catch {
      // Ignore
    }
  }

  // Check if currentStore is only default starter counters while IndexedDB has real user data
  const isStarterOnly =
    currentStore.counters.every((c) => c.id.startsWith('starter-')) &&
    currentStore.counters.reduce((s, c) => s + c.count, 0) === 49;

  if (!isStarterOnly) {
    // Mirror current user data into IndexedDB vault
    await writeStoreToIndexedDB(currentStore);
    return null;
  }

  const db = await openVaultDB();
  if (!db) return null;

  return new Promise((resolve) => {
    try {
      const tx = db.transaction(IDB_STORE, 'readonly');
      const req = tx.objectStore(IDB_STORE).get(IDB_KEY);
      req.onsuccess = () => {
        if (typeof req.result === 'string' && req.result) {
          const parsed = parseRawStore(req.result, getTodayKey());
          if (parsed) {
            persistStoreImmediately(parsed);
            resolve(parsed);
            return;
          }
        }
        resolve(null);
      };
      req.onerror = () => resolve(null);
    } catch {
      resolve(null);
    }
  });
}
