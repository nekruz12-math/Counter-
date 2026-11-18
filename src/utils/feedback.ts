import { Capacitor } from '@capacitor/core';
import { Haptics, ImpactStyle, NotificationType } from '@capacitor/haptics';
import type { HapticIntensity } from '../types/counter';

interface CounterNativeBridge {
  vibrate?: (durationMs: number, amplitude: number) => void;
  vibratePattern?: (firstMs: number, gapMs: number, secondMs: number, amplitude: number) => void;
  startFingerprintAuth?: () => boolean;
  stopFingerprintAuth?: () => void;
  promptDeviceCredential?: (title: string, subtitle: string) => boolean;
  hasBiometricHardware?: () => boolean;
}

declare global {
  interface Window {
    CounterNative?: CounterNativeBridge;
    __onNativeFingerprintResult?: (status: 'success' | 'failed' | 'error', message?: string) => void;
  }
}

let sharedAudioContext: AudioContext | null = null;

function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  const AudioCtx =
    window.AudioContext ||
    (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (!AudioCtx) return null;

  if (!sharedAudioContext) {
    sharedAudioContext = new AudioCtx();
  }
  if (sharedAudioContext.state === 'suspended') {
    sharedAudioContext.resume().catch(() => {});
  }
  return sharedAudioContext;
}

const HAPTIC_PATTERNS: Record<
  HapticIntensity,
  { tap: number; reset: number; limit: [number, number, number]; amplitude: number }
> = {
  low: { tap: 30, reset: 45, limit: [45, 45, 75], amplitude: 160 },
  medium: { tap: 55, reset: 75, limit: [65, 50, 110], amplitude: 220 },
  high: { tap: 90, reset: 120, limit: [90, 55, 145], amplitude: 255 },
};

const NATIVE_IMPACT_MAP: Record<HapticIntensity, ImpactStyle> = {
  low: ImpactStyle.Light,
  medium: ImpactStyle.Medium,
  high: ImpactStyle.Heavy,
};

function triggerNativeBridgeVibrate(durationMs: number, amplitude = 255): boolean {
  if (typeof window !== 'undefined' && window.CounterNative?.vibrate) {
    try {
      window.CounterNative.vibrate(durationMs, amplitude);
      return true;
    } catch {
      // Fallback to Capacitor / Web Vibration API
    }
  }
  return false;
}

function triggerNativeBridgePattern(
  firstMs: number,
  gapMs: number,
  secondMs: number,
  amplitude = 255,
): boolean {
  if (typeof window !== 'undefined' && window.CounterNative?.vibratePattern) {
    try {
      window.CounterNative.vibratePattern(firstMs, gapMs, secondMs, amplitude);
      return true;
    } catch {
      // Fallback
    }
  }
  return false;
}

function triggerBrowserVibrate(pattern: number | number[]): void {
  if (typeof navigator !== 'undefined' && typeof navigator.vibrate === 'function') {
    try {
      navigator.vibrate(pattern);
    } catch {
      // Ignore vibration errors on restricted browsers
    }
  }
}

export function triggerLightHaptic(): void {
  triggerNativeBridgeVibrate(40, 220);
  triggerBrowserVibrate(35);
  if (Capacitor.isNativePlatform()) {
    Haptics.vibrate({ duration: 40 }).catch(() => {
      Haptics.impact({ style: ImpactStyle.Medium }).catch(() => {});
    });
  }
}

export function triggerErrorHaptic(): void {
  triggerNativeBridgePattern(65, 45, 95, 255);
  triggerBrowserVibrate([60, 45, 85]);
  if (Capacitor.isNativePlatform()) {
    Haptics.vibrate({ duration: 80 }).catch(() => {});
    Haptics.notification({ type: NotificationType.Error }).catch(() => {});
  }
}

export function playTapFeedback(
  type: 'increment' | 'decrement' | 'limit' | 'reset',
  soundEnabled: boolean,
  hapticEnabled: boolean,
  hapticIntensity: HapticIntensity = 'medium',
): void {
  if (hapticEnabled) {
    const pattern = HAPTIC_PATTERNS[hapticIntensity] || HAPTIC_PATTERNS.medium;

    // 1. Direct Native Java Bridge (MainActivity.java -> Vibrator USAGE_ALARM + View HapticFeedback)
    if (type === 'limit') {
      triggerNativeBridgePattern(
        pattern.limit[0],
        pattern.limit[1],
        pattern.limit[2],
        pattern.amplitude,
      );
      triggerBrowserVibrate(pattern.limit);
    } else if (type === 'reset') {
      triggerNativeBridgeVibrate(pattern.reset, pattern.amplitude);
      triggerBrowserVibrate(pattern.reset);
    } else {
      triggerNativeBridgeVibrate(pattern.tap, pattern.amplitude);
      triggerBrowserVibrate(pattern.tap);
    }

    // 2. Also invoke Capacitor Haptics plugin as secondary layer
    if (Capacitor.isNativePlatform()) {
      if (type === 'limit') {
        Haptics.vibrate({ duration: pattern.limit[0] }).catch(() => {});
        window.setTimeout(() => {
          Haptics.vibrate({ duration: pattern.limit[2] }).catch(() => {});
        }, pattern.limit[0] + pattern.limit[1]);
      } else if (type === 'reset') {
        Haptics.vibrate({ duration: pattern.reset }).catch(() => {
          Haptics.impact({ style: NATIVE_IMPACT_MAP[hapticIntensity] }).catch(() => {});
        });
      } else {
        Haptics.vibrate({ duration: pattern.tap }).catch(() => {
          Haptics.impact({ style: NATIVE_IMPACT_MAP[hapticIntensity] }).catch(() => {});
        });
      }
    }
  }

  if (!soundEnabled) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  try {
    const now = ctx.currentTime;

    if (type === 'limit') {
      const freqs = [523.25, 659.25, 783.99];
      freqs.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + idx * 0.06);
        gain.gain.setValueAtTime(0.0001, now + idx * 0.06);
        gain.gain.exponentialRampToValueAtTime(0.08, now + idx * 0.06 + 0.015);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.06 + 0.18);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now + idx * 0.06);
        osc.stop(now + idx * 0.06 + 0.2);
      });
      return;
    }

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    if (type === 'increment') {
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(520, now);
      osc.frequency.exponentialRampToValueAtTime(340, now + 0.035);
      gain.gain.setValueAtTime(0.065, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.04);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.045);
    } else if (type === 'decrement') {
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(310, now);
      osc.frequency.exponentialRampToValueAtTime(220, now + 0.04);
      gain.gain.setValueAtTime(0.055, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.045);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.05);
    } else {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(392, now);
      osc.frequency.exponentialRampToValueAtTime(261.6, now + 0.09);
      gain.gain.setValueAtTime(0.055, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.1);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.11);
    }
  } catch {
    // Ignore audio context autoplay errors
  }
}
