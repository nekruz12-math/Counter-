import {
  BatteryCharging,
  Bell,
  Compass,
  Delete,
  Fingerprint,
  Globe,
  KeyRound,
  Lock,
  Moon,
  ShieldCheck,
  Smartphone,
  Sun,
  Sunrise,
  Sunset,
  Volume2,
  VolumeX,
  X,
} from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import type { SmartTranslations } from '../i18n/translations';
import type { AppPreferences, HapticIntensity, Language } from '../types/counter';
import { enrollBiometricCredential } from '../utils/biometricAuth';
import { playTapFeedback, triggerErrorHaptic } from '../utils/feedback';
import {
  getNotificationPermissionState,
  requestDailyNotificationPermission,
} from '../utils/nativeAndroid';
import { calculateSunTimes, getScheduledThemeForNow } from '../utils/solarSchedule';

interface AppSettingsViewProps {
  preferences: AppPreferences;
  onUpdatePreferences: (patch: Partial<AppPreferences>) => void;
  onLockNow?: () => void;
  t: SmartTranslations;
}

const INTENSITY_LEVELS: HapticIntensity[] = ['low', 'medium', 'high'];
const KEYPAD_DIGITS = ['1', '2', '3', '4', '5', '6', '7', '8', '9'];

export function AppSettingsView({
  preferences,
  onUpdatePreferences,
  onLockNow,
  t,
}: AppSettingsViewProps) {
  const [notifPermission, setNotifPermission] = useState<string>('default');
  const [pinModalOpen, setPinModalOpen] = useState(false);
  const [pinStep, setPinStep] = useState<'first' | 'confirm'>('first');
  const [firstPin, setFirstPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [pinError, setPinError] = useState<string | null>(null);

  useEffect(() => {
    void getNotificationPermissionState().then(setNotifPermission);
  }, []);

  const sunTimes = useMemo(
    () =>
      calculateSunTimes(
        new Date(),
        preferences.solarLatitude,
        preferences.solarLongitude,
      ),
    [preferences.solarLatitude, preferences.solarLongitude],
  );

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
      playTapFeedback('increment', preferences.soundEnabled, true, nextIntensity);
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

  const handleScheduleDarkToggle = () => {
    const nextScheduled = !preferences.scheduleDarkMode;
    if (nextScheduled) {
      const { theme: scheduledTheme } = getScheduledThemeForNow(
        new Date(),
        preferences.solarLatitude,
        preferences.solarLongitude,
      );
      onUpdatePreferences({
        scheduleDarkMode: true,
        theme: scheduledTheme,
      });
    } else {
      onUpdatePreferences({ scheduleDarkMode: false });
    }
  };

  const handleRefreshGpsSolar = () => {
    if (typeof navigator === 'undefined' || !navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;
        const { theme: scheduledTheme } = getScheduledThemeForNow(new Date(), lat, lng);
        onUpdatePreferences({
          solarLatitude: lat,
          solarLongitude: lng,
          ...(preferences.scheduleDarkMode ? { theme: scheduledTheme } : {}),
        });
        playTapFeedback(
          'limit',
          preferences.soundEnabled,
          preferences.hapticEnabled,
          preferences.hapticIntensity,
        );
      },
      () => {
        // Keep offline estimated solar coordinates if GPS permission is declined
      },
      { timeout: 8000 },
    );
  };

  const openPinSetup = () => {
    setPinStep('first');
    setFirstPin('');
    setConfirmPin('');
    setPinError(null);
    setPinModalOpen(true);
  };

  const handlePinDigit = (digit: string) => {
    setPinError(null);
    playTapFeedback(
      'increment',
      preferences.soundEnabled,
      preferences.hapticEnabled,
      preferences.hapticIntensity,
    );

    if (pinStep === 'first') {
      const next = (firstPin + digit).slice(0, 4);
      setFirstPin(next);
      if (next.length === 4) {
        window.setTimeout(() => {
          setPinStep('confirm');
        }, 120);
      }
    } else {
      const next = (confirmPin + digit).slice(0, 4);
      setConfirmPin(next);
      if (next.length === 4) {
        if (next === firstPin) {
          playTapFeedback(
            'limit',
            preferences.soundEnabled,
            preferences.hapticEnabled,
            preferences.hapticIntensity,
          );
          onUpdatePreferences({ pinCode: next });
          setPinModalOpen(false);
        } else {
          triggerErrorHaptic();
          setPinError(t.pinMismatchError);
          setFirstPin('');
          setConfirmPin('');
          setPinStep('first');
        }
      }
    }
  };

  const handlePinBackspace = () => {
    playTapFeedback(
      'decrement',
      preferences.soundEnabled,
      preferences.hapticEnabled,
      preferences.hapticIntensity,
    );
    if (pinStep === 'first') {
      setFirstPin((p) => p.slice(0, -1));
    } else {
      setConfirmPin((p) => p.slice(0, -1));
    }
  };

  const handleBiometricToggle = async () => {
    if (!preferences.pinCode) {
      openPinSetup();
      return;
    }
    const nextBio = !preferences.biometricEnabled;
    if (nextBio) {
      const credId = await enrollBiometricCredential();
      onUpdatePreferences({
        biometricEnabled: true,
        biometricCredentialId: credId,
      });
      playTapFeedback(
        'limit',
        preferences.soundEnabled,
        preferences.hapticEnabled,
        preferences.hapticIntensity,
      );
    } else {
      onUpdatePreferences({
        biometricEnabled: false,
      });
    }
  };

  const intensityLabels: Record<HapticIntensity, string> = {
    low: t.intensityLow,
    medium: t.intensityMedium,
    high: t.intensityHigh,
  };

  const activePinValue = pinStep === 'first' ? firstPin : confirmPin;

  return (
    <div className="flagship-enter space-y-5">
      {/* Main Appearance & Feedback Card */}
      <section className="rounded-3xl bg-white dark:bg-[#1B1D22] border border-slate-200/80 dark:border-white/8 divide-y divide-slate-100 dark:divide-white/6 shadow-xs">
        {/* Language */}
        <div className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <Globe className="w-5 h-5 text-slate-500 dark:text-slate-400 shrink-0" aria-hidden="true" />
            <span className="text-sm font-semibold">{t.languageLabel}</span>
          </div>
          <div className="flex items-center gap-1 p-1 rounded-xl bg-slate-100 dark:bg-[#121316]">
            {languages.map((lang) => (
              <button
                key={lang.id}
                type="button"
                onClick={() => onUpdatePreferences({ language: lang.id })}
                className={`min-h-[38px] px-3 rounded-lg text-xs font-semibold transition-colors cursor-pointer whitespace-nowrap ${
                  preferences.language === lang.id
                    ? 'bg-white dark:bg-[#282B33] text-slate-900 dark:text-slate-50 shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                }`}
              >
                {lang.label}
              </button>
            ))}
          </div>
        </div>

        {/* Manual Theme */}
        <div className="p-4 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            {preferences.theme === 'dark' ? (
              <Moon className="w-5 h-5 text-sky-500 dark:text-sky-400 shrink-0" aria-hidden="true" />
            ) : (
              <Sun className="w-5 h-5 text-amber-500 shrink-0" aria-hidden="true" />
            )}
            <span className="text-sm font-semibold">{t.themeLabel}</span>
          </div>
          <div className="flex items-center gap-1 p-1 rounded-xl bg-slate-100 dark:bg-[#121316]">
            <button
              type="button"
              onClick={() => onUpdatePreferences({ theme: 'dark', scheduleDarkMode: false })}
              className={`min-h-[38px] px-3 rounded-lg text-xs font-semibold transition-colors cursor-pointer whitespace-nowrap ${
                preferences.theme === 'dark'
                  ? 'bg-white dark:bg-[#282B33] text-slate-900 dark:text-slate-50 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              {t.themeDark}
            </button>
            <button
              type="button"
              onClick={() => onUpdatePreferences({ theme: 'light', scheduleDarkMode: false })}
              className={`min-h-[38px] px-3 rounded-lg text-xs font-semibold transition-colors cursor-pointer whitespace-nowrap ${
                preferences.theme === 'light'
                  ? 'bg-white dark:bg-[#282B33] text-slate-900 dark:text-slate-50 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              {t.themeLight}
            </button>
          </div>
        </div>

        {/* Schedule Dark Mode (Sunrise / Sunset) */}
        <div className="p-4 space-y-3">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-start gap-3">
              <Sunset
                className={`w-5 h-5 mt-0.5 shrink-0 ${
                  preferences.scheduleDarkMode
                    ? 'text-amber-500 dark:text-amber-400'
                    : 'text-slate-400 dark:text-slate-500'
                }`}
                aria-hidden="true"
              />
              <div>
                <span className="block text-sm font-semibold">{t.scheduleDarkLabel}</span>
                <span className="block text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  {t.scheduleDarkDesc}
                </span>
              </div>
            </div>

            <button
              type="button"
              role="switch"
              aria-label={t.scheduleDarkLabel}
              aria-checked={preferences.scheduleDarkMode}
              onClick={handleScheduleDarkToggle}
              className={`relative w-12 h-7 rounded-full transition-colors shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 ${
                preferences.scheduleDarkMode ? 'bg-sky-600' : 'bg-slate-300 dark:bg-[#2F333D]'
              }`}
            >
              <span
                className={`block w-5 h-5 rounded-full bg-white shadow-sm transform transition-transform ${
                  preferences.scheduleDarkMode ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          {/* Sunrise & Sunset Readout */}
          <div className="pl-8 flex flex-wrap items-center justify-between gap-2 text-xs">
            <div className="flex items-center gap-3 text-slate-600 dark:text-slate-300">
              <span className="inline-flex items-center gap-1 font-mono tabular-nums">
                <Sunrise className="w-3.5 h-3.5 text-amber-500" aria-hidden="true" />
                <span>
                  {t.sunriseLabel}: <strong>{sunTimes.sunriseFormatted}</strong>
                </span>
              </span>
              <span aria-hidden="true" className="text-slate-400">
                ·
              </span>
              <span className="inline-flex items-center gap-1 font-mono tabular-nums">
                <Sunset className="w-3.5 h-3.5 text-indigo-400" aria-hidden="true" />
                <span>
                  {t.sunsetLabel}: <strong>{sunTimes.sunsetFormatted}</strong>
                </span>
              </span>
            </div>

            <button
              type="button"
              onClick={handleRefreshGpsSolar}
              className="min-h-[32px] px-2.5 rounded-xl bg-slate-100 dark:bg-[#121316] hover:bg-slate-200 dark:hover:bg-white/10 text-[11px] font-semibold text-slate-700 dark:text-slate-300 inline-flex items-center gap-1 cursor-pointer transition-colors"
            >
              <Compass className="w-3.5 h-3.5 text-sky-500" aria-hidden="true" />
              <span>{t.updateGpsBtn}</span>
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
              preferences.soundEnabled ? 'bg-sky-600' : 'bg-slate-300 dark:bg-[#2F333D]'
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
              onClick={() => {
                const next = !preferences.hapticEnabled;
                onUpdatePreferences({ hapticEnabled: next });
                if (next) {
                  playTapFeedback(
                    'increment',
                    preferences.soundEnabled,
                    true,
                    preferences.hapticIntensity,
                  );
                }
              }}
              className={`relative w-12 h-7 rounded-full transition-colors shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 ${
                preferences.hapticEnabled ? 'bg-sky-600' : 'bg-slate-300 dark:bg-[#2F333D]'
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
              <label
                htmlFor="haptic-intensity-slider"
                className="font-medium text-slate-600 dark:text-slate-300"
              >
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
              className="w-full accent-sky-600 cursor-pointer h-2 rounded-lg bg-slate-200 dark:bg-[#2F333D]"
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
              preferences.notificationsEnabled ? 'bg-sky-600' : 'bg-slate-300 dark:bg-[#2F333D]'
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
              preferences.powerSaver ? 'bg-emerald-600' : 'bg-slate-300 dark:bg-[#2F333D]'
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

      {/* Security & 4-Digit PIN + Fingerprint Section */}
      <section className="rounded-3xl bg-white dark:bg-[#1B1D22] border border-slate-200/80 dark:border-white/8 divide-y divide-slate-100 dark:divide-white/6 shadow-xs">
        <div className="px-4 py-3 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-sky-600 dark:text-sky-400" aria-hidden="true" />
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              {t.securitySectionTitle}
            </h2>
          </div>

          {preferences.pinCode && onLockNow && (
            <button
              type="button"
              onClick={onLockNow}
              className="min-h-[30px] px-2.5 rounded-xl bg-slate-100 dark:bg-[#121316] hover:bg-slate-200 dark:hover:bg-white/10 text-[11px] font-bold text-slate-700 dark:text-slate-300 inline-flex items-center gap-1 cursor-pointer"
            >
              <Lock className="w-3 h-3" aria-hidden="true" />
              <span>{t.lockNowBtn}</span>
            </button>
          )}
        </div>

        {/* 4-Digit PIN Setup / Change / Disable */}
        <div className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-start gap-3">
            <KeyRound
              className={`w-5 h-5 mt-0.5 shrink-0 ${
                preferences.pinCode
                  ? 'text-sky-600 dark:text-sky-400'
                  : 'text-slate-400 dark:text-slate-500'
              }`}
              aria-hidden="true"
            />
            <div>
              <span className="block text-sm font-semibold">{t.pinLockLabel}</span>
              <span className="block text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                {t.pinLockDesc}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={openPinSetup}
              className="min-h-[38px] px-3.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold transition-transform active:scale-95 cursor-pointer whitespace-nowrap"
            >
              {preferences.pinCode ? t.changePinBtn : t.setPinBtn}
            </button>

            {preferences.pinCode && (
              <button
                type="button"
                onClick={() =>
                  onUpdatePreferences({
                    pinCode: null,
                    biometricEnabled: false,
                  })
                }
                className="min-h-[38px] px-3 rounded-xl bg-slate-100 dark:bg-[#121316] hover:bg-rose-50 dark:hover:bg-rose-950/30 text-xs font-semibold text-rose-600 dark:text-rose-400 transition-colors cursor-pointer whitespace-nowrap"
              >
                {t.removePinBtn}
              </button>
            )}
          </div>
        </div>

        {/* Fingerprint / Biometric Toggle */}
        <div className="p-4 flex items-center justify-between gap-3">
          <div className="flex items-start gap-3">
            <Fingerprint
              className={`w-5 h-5 mt-0.5 shrink-0 ${
                preferences.biometricEnabled && preferences.pinCode
                  ? 'text-sky-600 dark:text-sky-400'
                  : 'text-slate-400 dark:text-slate-500'
              }`}
              aria-hidden="true"
            />
            <div>
              <span className="block text-sm font-semibold">{t.biometricLabel}</span>
              <span className="block text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                {t.biometricDesc}
              </span>
            </div>
          </div>

          <button
            type="button"
            role="switch"
            aria-label={t.biometricLabel}
            aria-checked={Boolean(preferences.biometricEnabled && preferences.pinCode)}
            onClick={() => void handleBiometricToggle()}
            className={`relative w-12 h-7 rounded-full transition-colors shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 ${
              preferences.biometricEnabled && preferences.pinCode
                ? 'bg-sky-600'
                : 'bg-slate-300 dark:bg-[#2F333D]'
            }`}
          >
            <span
              className={`block w-5 h-5 rounded-full bg-white shadow-sm transform transition-transform ${
                preferences.biometricEnabled && preferences.pinCode
                  ? 'translate-x-6'
                  : 'translate-x-1'
              }`}
            />
          </button>
        </div>
      </section>

      {/* Version 2.0.0 & Safe In-Place Update Protection Card */}
      <section className="rounded-3xl bg-white/80 dark:bg-[#1B1D22]/80 border border-slate-200/70 dark:border-white/6 p-4 flex items-start gap-3">
        <ShieldCheck className="w-5 h-5 text-emerald-600 dark:text-emerald-400 mt-0.5 shrink-0" aria-hidden="true" />
        <div className="min-w-0">
          <p className="text-xs font-bold text-slate-800 dark:text-slate-100">
            {t.versionFooterLabel}
          </p>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 leading-relaxed">
            {t.versionDataSafeNote}
          </p>
        </div>
      </section>

      {/* PIN Setup Modal */}
      {pinModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4"
        >
          <div className="flagship-enter w-full max-w-sm rounded-3xl bg-[#F4F5F7] dark:bg-[#181A20] border border-slate-200 dark:border-white/10 p-5 shadow-2xl">
            <div className="flex items-center justify-between gap-2 mb-3">
              <h3 className="text-base font-bold">
                {pinStep === 'first' ? t.enterNewPinTitle : t.confirmNewPinTitle}
              </h3>
              <button
                type="button"
                onClick={() => setPinModalOpen(false)}
                aria-label={t.cancelLabel}
                className="min-h-[36px] min-w-[36px] rounded-xl flex items-center justify-center hover:bg-black/5 dark:hover:bg-white/10 cursor-pointer"
              >
                <X className="w-4 h-4" aria-hidden="true" />
              </button>
            </div>

            {pinError && (
              <p className="text-xs font-semibold text-rose-600 dark:text-rose-400 text-center mb-2">
                {pinError}
              </p>
            )}

            {/* 4 PIN Dots */}
            <div className="my-5 flex items-center justify-center gap-4">
              {[0, 1, 2, 3].map((idx) => {
                const filled = idx < activePinValue.length;
                return (
                  <span
                    key={idx}
                    className={`w-3.5 h-3.5 rounded-full transition-all duration-150 ${
                      filled
                        ? 'scale-110 bg-sky-600 dark:bg-sky-400'
                        : 'bg-slate-300 dark:bg-[#2F333D]'
                    }`}
                  />
                );
              })}
            </div>

            {/* Mini Keypad */}
            <div className="grid grid-cols-3 gap-2.5">
              {KEYPAD_DIGITS.map((digit) => (
                <button
                  key={digit}
                  type="button"
                  onClick={() => handlePinDigit(digit)}
                  className="h-14 rounded-2xl bg-white dark:bg-[#22252D] border border-slate-200/80 dark:border-white/8 font-mono text-xl font-bold active:scale-95 transition-transform cursor-pointer"
                >
                  {digit}
                </button>
              ))}
              <div />
              <button
                type="button"
                onClick={() => handlePinDigit('0')}
                className="h-14 rounded-2xl bg-white dark:bg-[#22252D] border border-slate-200/80 dark:border-white/8 font-mono text-xl font-bold active:scale-95 transition-transform cursor-pointer"
              >
                0
              </button>
              <button
                type="button"
                onClick={handlePinBackspace}
                aria-label={t.cancelLabel}
                className="h-14 rounded-2xl bg-white/70 dark:bg-[#22252D]/70 border border-slate-200/60 dark:border-white/5 flex items-center justify-center active:scale-95 transition-transform cursor-pointer"
              >
                <Delete className="w-5 h-5" aria-hidden="true" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
