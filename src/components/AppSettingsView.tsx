import {
  BatteryCharging,
  Bell,
  Globe,
  Moon,
  Smartphone,
  Sun,
  Volume2,
  VolumeX,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import type { SmartTranslations } from '../i18n/translations';
import type { AppPreferences, HapticIntensity, Language } from '../types/counter';
import { playTapFeedback } from '../utils/feedback';
import {
  getNotificationPermissionState,
  requestDailyNotificationPermission,
} from '../utils/nativeAndroid';

interface AppSettingsViewProps {
  preferences: AppPreferences;
  onUpdatePreferences: (patch: Partial<AppPreferences>) => void;
  t: SmartTranslations;
}

const INTENSITY_LEVELS: HapticIntensity[] = ['low', 'medium', 'high'];

export function AppSettingsView({
  preferences,
  onUpdatePreferences,
  t,
}: AppSettingsViewProps) {
  const [notifPermission, setNotifPermission] = useState<string>('default');

  useEffect(() => {
    void getNotificationPermissionState().then(setNotifPermission);
  }, []);

  const languages: { id: Language; label: string }[] = [
    { id: 'tg', label: 'Тоҷикӣ' },
    { id: 'ru', label: 'Русский' },
    { id: 'en', label: 'English' },
  ];

  const intensityIndex = Math.max(
    0,
    INTENSITY_LEVELS.indexOf(preferences.hapticIntensity ?? 'medium'),
  );

  const handleIntensityChange = (idx: number) => {
    const nextIntensity = INTENSITY_LEVELS[idx] ?? 'medium';
    onUpdatePreferences({ hapticIntensity: nextIntensity });
    if (preferences.hapticEnabled) {
      playTapFeedback('increment', false, true, nextIntensity);
    }
  };

  const handleNotificationsToggle = async () => {
    const nextEnabled = !preferences.notificationsEnabled;
    onUpdatePreferences({ notificationsEnabled: nextEnabled });

    if (nextEnabled) {
      const result = await requestDailyNotificationPermission();
      setNotifPermission(result);
    }
  };

  const intensityLabels: Record<HapticIntensity, string> = {
    low: t.intensityLow,
    medium: t.intensityMedium,
    high: t.intensityHigh,
  };

  return (
    <div className="space-y-4">
      <section className="rounded-3xl bg-white dark:bg-[#231B18] border border-slate-200 dark:border-[#352A25] divide-y divide-slate-100 dark:divide-[#352A25]">
        {/* Language */}
        <div className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <Globe className="w-5 h-5 text-slate-500 dark:text-slate-400 shrink-0" aria-hidden="true" />
            <span className="text-sm font-semibold">{t.languageLabel}</span>
          </div>
          <div className="flex items-center gap-1 p-1 rounded-xl bg-slate-100 dark:bg-[#16110F]">
            {languages.map((lang) => (
              <button
                key={lang.id}
                type="button"
                onClick={() => onUpdatePreferences({ language: lang.id })}
                className={`min-h-[38px] px-3 rounded-lg text-xs font-semibold transition-colors cursor-pointer whitespace-nowrap ${
                  preferences.language === lang.id
                    ? 'bg-white dark:bg-[#2F2420] text-slate-900 dark:text-slate-50 shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                }`}
              >
                {lang.label}
              </button>
            ))}
          </div>
        </div>

        {/* Theme */}
        <div className="p-4 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            {preferences.theme === 'dark' ? (
              <Moon className="w-5 h-5 text-slate-500 dark:text-slate-400 shrink-0" aria-hidden="true" />
            ) : (
              <Sun className="w-5 h-5 text-slate-500 dark:text-slate-400 shrink-0" aria-hidden="true" />
            )}
            <span className="text-sm font-semibold">{t.themeLabel}</span>
          </div>
          <div className="flex items-center gap-1 p-1 rounded-xl bg-slate-100 dark:bg-[#16110F]">
            <button
              type="button"
              onClick={() => onUpdatePreferences({ theme: 'dark' })}
              className={`min-h-[38px] px-3 rounded-lg text-xs font-semibold transition-colors cursor-pointer whitespace-nowrap ${
                preferences.theme === 'dark'
                  ? 'bg-white dark:bg-[#2F2420] text-slate-900 dark:text-slate-50 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              {t.themeDark}
            </button>
            <button
              type="button"
              onClick={() => onUpdatePreferences({ theme: 'light' })}
              className={`min-h-[38px] px-3 rounded-lg text-xs font-semibold transition-colors cursor-pointer whitespace-nowrap ${
                preferences.theme === 'light'
                  ? 'bg-white dark:bg-[#2F2420] text-slate-900 dark:text-slate-50 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              {t.themeLight}
            </button>
          </div>
        </div>

        {/* Sound Effects */}
        <div className="p-4 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            {preferences.soundEnabled ? (
              <Volume2 className="w-5 h-5 text-sky-600 dark:text-sky-400 shrink-0" aria-hidden="true" />
            ) : (
              <VolumeX className="w-5 h-5 text-slate-400 dark:text-slate-500 shrink-0" aria-hidden="true" />
            )}
            <span className="text-sm font-semibold">{t.soundLabel}</span>
          </div>
          <button
            type="button"
            role="switch"
            aria-label={t.soundLabel}
            aria-checked={preferences.soundEnabled}
            onClick={() => {
              const next = !preferences.soundEnabled;
              onUpdatePreferences({ soundEnabled: next });
              if (next) {
                playTapFeedback('increment', true, false);
              }
            }}
            className={`relative w-12 h-7 rounded-full transition-colors shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 ${
              preferences.soundEnabled ? 'bg-sky-600' : 'bg-slate-300 dark:bg-[#3A2E29]'
            }`}
          >
            <span
              className={`block w-5 h-5 rounded-full bg-white shadow-sm transform transition-transform ${
                preferences.soundEnabled ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
        </div>

        {/* Haptic Feedback + Intensity Slider */}
        <div className="p-4 space-y-4">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <Smartphone
                className={`w-5 h-5 shrink-0 ${
                  preferences.hapticEnabled
                    ? 'text-sky-600 dark:text-sky-400'
                    : 'text-slate-400 dark:text-slate-500'
                }`}
                aria-hidden="true"
              />
              <span className="text-sm font-semibold">{t.hapticLabel}</span>
            </div>
            <button
              type="button"
              role="switch"
              aria-label={t.hapticLabel}
              aria-checked={preferences.hapticEnabled}
              onClick={() => onUpdatePreferences({ hapticEnabled: !preferences.hapticEnabled })}
              className={`relative w-12 h-7 rounded-full transition-colors shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 ${
                preferences.hapticEnabled ? 'bg-sky-600' : 'bg-slate-300 dark:bg-[#3A2E29]'
              }`}
            >
              <span
                className={`block w-5 h-5 rounded-full bg-white shadow-sm transform transition-transform ${
                  preferences.hapticEnabled ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          {/* Haptic Intensity Slider */}
          <div
            className={`pl-8 transition-opacity ${
              preferences.hapticEnabled ? 'opacity-100' : 'opacity-45 pointer-events-none'
            }`}
          >
            <div className="flex items-center justify-between gap-2 text-xs mb-2">
              <label htmlFor="haptic-intensity-slider" className="font-medium text-slate-600 dark:text-slate-300">
                {t.hapticIntensityLabel}
              </label>
              <span className="font-semibold text-sky-600 dark:text-sky-400">
                {intensityLabels[preferences.hapticIntensity ?? 'medium']}
              </span>
            </div>

            <input
              id="haptic-intensity-slider"
              type="range"
              min={0}
              max={2}
              step={1}
              disabled={!preferences.hapticEnabled}
              value={intensityIndex}
              onChange={(e) => handleIntensityChange(Number(e.target.value))}
              className="w-full accent-sky-600 cursor-pointer h-2 rounded-lg bg-slate-200 dark:bg-[#3A2E29]"
            />

            <div className="flex items-center justify-between mt-1.5">
              {INTENSITY_LEVELS.map((level, idx) => (
                <button
                  key={level}
                  type="button"
                  disabled={!preferences.hapticEnabled}
                  onClick={() => handleIntensityChange(idx)}
                  className={`text-[11px] font-medium cursor-pointer ${
                    intensityIndex === idx
                      ? 'text-slate-900 dark:text-slate-100 font-bold'
                      : 'text-slate-500 dark:text-slate-400'
                  }`}
                >
                  {intensityLabels[level]}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Daily Goal Push Reminders */}
        <div className="p-4 flex items-center justify-between gap-3">
          <div className="flex items-start gap-3">
            <Bell
              className={`w-5 h-5 mt-0.5 shrink-0 ${
                preferences.notificationsEnabled
                  ? 'text-sky-600 dark:text-sky-400'
                  : 'text-slate-400 dark:text-slate-500'
              }`}
              aria-hidden="true"
            />
            <div>
              <span className="block text-sm font-semibold">{t.notificationsLabel}</span>
              <span className="block text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                {t.notificationsDesc}
              </span>
              {preferences.notificationsEnabled && (
                <span className="block text-[11px] font-medium text-slate-500 dark:text-slate-400 mt-1">
                  {notifPermission === 'granted' ? t.notificationsGranted : t.notificationsBlocked}
                </span>
              )}
            </div>
          </div>
          <button
            type="button"
            role="switch"
            aria-label={t.notificationsLabel}
            aria-checked={preferences.notificationsEnabled}
            onClick={handleNotificationsToggle}
            className={`relative w-12 h-7 rounded-full transition-colors shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 ${
              preferences.notificationsEnabled ? 'bg-sky-600' : 'bg-slate-300 dark:bg-[#3A2E29]'
            }`}
          >
            <span
              className={`block w-5 h-5 rounded-full bg-white shadow-sm transform transition-transform ${
                preferences.notificationsEnabled ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
        </div>

        {/* Power Saver */}
        <div className="p-4 flex items-center justify-between gap-3">
          <div className="flex items-start gap-3">
            <BatteryCharging
              className={`w-5 h-5 mt-0.5 shrink-0 ${
                preferences.powerSaver
                  ? 'text-emerald-600 dark:text-emerald-400'
                  : 'text-slate-400 dark:text-slate-500'
              }`}
              aria-hidden="true"
            />
            <div>
              <span className="block text-sm font-semibold">{t.powerSaverLabel}</span>
              <span className="block text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                {t.powerSaverDesc}
              </span>
            </div>
          </div>
          <button
            type="button"
            role="switch"
            aria-label={t.powerSaverLabel}
            aria-checked={preferences.powerSaver}
            onClick={() => onUpdatePreferences({ powerSaver: !preferences.powerSaver })}
            className={`relative w-12 h-7 rounded-full transition-colors shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 ${
              preferences.powerSaver ? 'bg-emerald-600' : 'bg-slate-300 dark:bg-[#3A2E29]'
            }`}
          >
            <span
              className={`block w-5 h-5 rounded-full bg-white shadow-sm transform transition-transform ${
                preferences.powerSaver ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
        </div>
      </section>
    </div>
  );
}
