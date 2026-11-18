import { Delete, Fingerprint, ShieldCheck } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import type { SmartTranslations } from '../i18n/translations';
import type { HapticIntensity } from '../types/counter';
import { verifyBiometricIdentity } from '../utils/biometricAuth';
import { playTapFeedback, triggerErrorHaptic } from '../utils/feedback';

interface PinLockScreenProps {
  expectedPin: string;
  biometricEnabled: boolean;
  biometricCredentialId?: string | null;
  soundEnabled: boolean;
  hapticEnabled: boolean;
  hapticIntensity: HapticIntensity;
  onUnlock: () => void;
  t: SmartTranslations;
}

const KEYPAD_DIGITS = ['1', '2', '3', '4', '5', '6', '7', '8', '9'];

export function PinLockScreen({
  expectedPin,
  biometricEnabled,
  biometricCredentialId,
  soundEnabled,
  hapticEnabled,
  hapticIntensity,
  onUnlock,
  t,
}: PinLockScreenProps) {
  const [entered, setEntered] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [shaking, setShaking] = useState(false);
  const [scanningBio, setScanningBio] = useState(false);

  const handleBiometricUnlock = useCallback(async () => {
    if (!biometricEnabled || scanningBio) return;
    setScanningBio(true);
    setErrorMessage(null);
    playTapFeedback('increment', soundEnabled, hapticEnabled, hapticIntensity);

    const verified = await verifyBiometricIdentity(biometricCredentialId);
    setScanningBio(false);

    if (verified) {
      playTapFeedback('limit', soundEnabled, hapticEnabled, hapticIntensity);
      onUnlock();
    }
  }, [
    biometricEnabled,
    biometricCredentialId,
    scanningBio,
    soundEnabled,
    hapticEnabled,
    hapticIntensity,
    onUnlock,
  ]);

  useEffect(() => {
    // Automatically prompt biometric unlock if enabled
    if (biometricEnabled) {
      const timer = window.setTimeout(() => {
        void handleBiometricUnlock();
      }, 280);
      return () => window.clearTimeout(timer);
    }
  }, [biometricEnabled, handleBiometricUnlock]);

  const handleDigitPress = (digit: string) => {
    if (entered.length >= 4) return;
    setErrorMessage(null);
    playTapFeedback('increment', soundEnabled, hapticEnabled, hapticIntensity);

    const next = entered + digit;
    setEntered(next);

    if (next.length === 4) {
      if (next === expectedPin) {
        playTapFeedback('limit', soundEnabled, hapticEnabled, hapticIntensity);
        window.setTimeout(() => {
          onUnlock();
        }, 90);
      } else {
        triggerErrorHaptic();
        setShaking(true);
        setErrorMessage(t.wrongPinError);
        window.setTimeout(() => {
          setEntered('');
          setShaking(false);
        }, 360);
      }
    }
  };

  const handleBackspace = () => {
    if (!entered) return;
    playTapFeedback('decrement', soundEnabled, hapticEnabled, hapticIntensity);
    setEntered((prev) => prev.slice(0, -1));
    setErrorMessage(null);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={t.enterPinTitle}
      className="fixed inset-0 z-50 flex flex-col items-center justify-between px-6 pt-[calc(2.5rem+env(safe-area-inset-top))] pb-[calc(2rem+env(safe-area-inset-bottom))] bg-[#F4F5F7] dark:bg-[#121316] text-slate-900 dark:text-[#F3EFEA] select-none"
    >
      {/* Top Identity */}
      <div className="flex flex-col items-center text-center mt-2">
        <div className="w-14 h-14 rounded-3xl bg-sky-500/10 dark:bg-sky-400/10 border border-sky-500/20 dark:border-sky-400/20 flex items-center justify-center mb-4">
          <ShieldCheck className="w-7 h-7 text-sky-600 dark:text-sky-400" aria-hidden="true" />
        </div>
        <h1 className="text-xl sm:text-2xl font-bold tracking-tight">{t.enterPinTitle}</h1>
        <p className="mt-1 text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-xs">
          {errorMessage ? (
            <span className="text-rose-600 dark:text-rose-400 font-semibold">{errorMessage}</span>
          ) : (
            t.enterPinSubtitle
          )}
        </p>

        {/* 4 PIN Dots */}
        <div
          className={`mt-7 flex items-center justify-center gap-4 ${shaking ? 'pin-shake' : ''}`}
          aria-hidden="true"
        >
          {[0, 1, 2, 3].map((idx) => {
            const filled = idx < entered.length;
            return (
              <span
                key={idx}
                className={`w-4 h-4 rounded-full transition-all duration-150 ${
                  filled
                    ? 'scale-110 bg-sky-600 dark:bg-sky-400 shadow-sm'
                    : 'bg-slate-300 dark:bg-[#2C2F36]'
                }`}
              />
            );
          })}
        </div>
      </div>

      {/* Tactile Flagship Numeric Pad */}
      <div className="w-full max-w-[300px] my-auto">
        <div className="grid grid-cols-3 gap-3.5 sm:gap-4">
          {KEYPAD_DIGITS.map((digit) => (
            <button
              key={digit}
              type="button"
              onClick={() => handleDigitPress(digit)}
              className="h-18 sm:h-19 rounded-3xl bg-white dark:bg-[#1C1E24] border border-slate-200/80 dark:border-white/8 font-mono text-2xl font-bold text-slate-900 dark:text-white shadow-xs active:scale-[0.92] active:bg-slate-100 dark:active:bg-[#282B33] transition-[transform,background-color] duration-150 flex items-center justify-center cursor-pointer"
            >
              {digit}
            </button>
          ))}

          {/* Bottom Left: Fingerprint Biometric Button */}
          {biometricEnabled ? (
            <button
              type="button"
              onClick={() => void handleBiometricUnlock()}
              aria-label={t.unlockWithFingerprint}
              title={t.unlockWithFingerprint}
              className={`h-18 sm:h-19 rounded-3xl border flex items-center justify-center active:scale-[0.92] transition-[transform,background-color] duration-150 cursor-pointer ${
                scanningBio
                  ? 'bg-sky-600 text-white border-sky-500'
                  : 'bg-sky-500/10 dark:bg-sky-400/12 border-sky-500/25 text-sky-600 dark:text-sky-300 hover:bg-sky-500/15'
              }`}
            >
              <Fingerprint className="w-7 h-7" aria-hidden="true" />
            </button>
          ) : (
            <div />
          )}

          {/* Bottom Center: 0 */}
          <button
            type="button"
            onClick={() => handleDigitPress('0')}
            className="h-18 sm:h-19 rounded-3xl bg-white dark:bg-[#1C1E24] border border-slate-200/80 dark:border-white/8 font-mono text-2xl font-bold text-slate-900 dark:text-white shadow-xs active:scale-[0.92] active:bg-slate-100 dark:active:bg-[#282B33] transition-[transform,background-color] duration-150 flex items-center justify-center cursor-pointer"
          >
            0
          </button>

          {/* Bottom Right: Backspace */}
          <button
            type="button"
            disabled={entered.length === 0}
            onClick={handleBackspace}
            aria-label={t.cancelLabel}
            className="h-18 sm:h-19 rounded-3xl bg-white/70 dark:bg-[#1C1E24]/70 border border-slate-200/60 dark:border-white/5 text-slate-700 dark:text-slate-300 active:scale-[0.92] disabled:opacity-30 disabled:pointer-events-none transition-[transform,opacity] duration-150 flex items-center justify-center cursor-pointer"
          >
            <Delete className="w-6 h-6" aria-hidden="true" />
          </button>
        </div>

        {biometricEnabled && (
          <button
            type="button"
            onClick={() => void handleBiometricUnlock()}
            className="mt-5 w-full min-h-[44px] rounded-2xl inline-flex items-center justify-center gap-2 text-xs font-bold text-sky-600 dark:text-sky-400 hover:bg-sky-500/10 transition-colors cursor-pointer"
          >
            <Fingerprint className="w-4 h-4" aria-hidden="true" />
            <span>{t.unlockWithFingerprint}</span>
          </button>
        )}
      </div>

      <div className="h-2" />
    </div>
  );
}
