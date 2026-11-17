import { Capacitor } from '@capacitor/core';
import { Haptics, ImpactStyle, NotificationType } from '@capacitor/haptics';
import type { HapticIntensity } from '../types/counter';

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
  { tap: number; reset: number; limit: number[] }
> = {
  low: { tap: 6, reset: 10, limit: [12, 22, 16] },
  medium: { tap: 14, reset: 20, limit: [22, 35, 32] },
  high: { tap: 28, reset: 36, limit: [38, 45, 52] },
};

const NATIVE_IMPACT_MAP: Record<HapticIntensity, ImpactStyle> = {
  low: ImpactStyle.Light,
  medium: ImpactStyle.Medium,
  high: ImpactStyle.Heavy,
};

export function triggerLightHaptic(): void {
  if (Capacitor.isNativePlatform()) {
    Haptics.impact({ style: ImpactStyle.Medium }).catch(() => {});
    return;
  }
  if (typeof navigator !== 'undefined' && typeof navigator.vibrate === 'function') {
    try {
      navigator.vibrate(20);
    } catch {
      // Ignore vibration errors
    }
  }
}

export function playTapFeedback(
  type: 'increment' | 'decrement' | 'limit' | 'reset',
  soundEnabled: boolean,
  hapticEnabled: boolean,
  hapticIntensity: HapticIntensity = 'medium',
): void {
  if (hapticEnabled) {
    if (Capacitor.isNativePlatform()) {
      if (type === 'limit') {
        Haptics.notification({ type: NotificationType.Success }).catch(() => {});
      } else {
        Haptics.impact({
          style: NATIVE_IMPACT_MAP[hapticIntensity] || ImpactStyle.Medium,
        }).catch(() => {});
      }
    } else if (typeof navigator !== 'undefined' && typeof navigator.vibrate === 'function') {
      try {
        const pattern = HAPTIC_PATTERNS[hapticIntensity] || HAPTIC_PATTERNS.medium;
        if (type === 'limit') {
          navigator.vibrate(pattern.limit);
        } else if (type === 'reset') {
          navigator.vibrate(pattern.reset);
        } else {
          navigator.vibrate(pattern.tap);
        }
      } catch {
        // Ignore vibration errors on restricted devices
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
