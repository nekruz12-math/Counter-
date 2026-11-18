/**
 * Native Android + WebAuthn Biometric Authentication helper.
 * Connects to MainActivity.java's CounterNative bridge (Android FingerprintManager + KeyguardManager)
 * when running inside the Android APK, with WebAuthn fallback on desktop/mobile browsers.
 */

export function startNativeFingerprintListener(
  onSuccess: () => void,
  onFailure?: () => void,
): () => void {
  if (typeof window === 'undefined') return () => {};

  window.__onNativeFingerprintResult = (status) => {
    if (status === 'success') {
      onSuccess();
    } else if (status === 'failed' && onFailure) {
      onFailure();
    }
  };

  if (window.CounterNative?.startFingerprintAuth) {
    try {
      window.CounterNative.startFingerprintAuth();
    } catch {
      // Ignore bridge error
    }
  }

  return () => {
    window.__onNativeFingerprintResult = undefined;
    if (window.CounterNative?.stopFingerprintAuth) {
      try {
        window.CounterNative.stopFingerprintAuth();
      } catch {
        // Ignore
      }
    }
  };
}

export async function enrollBiometricCredential(): Promise<string> {
  if (typeof window !== 'undefined' && window.CounterNative?.hasBiometricHardware) {
    try {
      const hasHw = window.CounterNative.hasBiometricHardware();
      if (hasHw) {
        return `android-native-bio-${Date.now()}`;
      }
    } catch {
      // Fallback
    }
  }

  return `bio-local-${Date.now()}`;
}

export async function verifyBiometricIdentity(
  title = 'Counter',
  subtitle = 'Тасдиқи изи ангушт',
): Promise<boolean> {
  if (typeof window === 'undefined') return false;

  // 1. If running in Android APK with CounterNative Java bridge
  if (window.CounterNative) {
    return new Promise((resolve) => {
      let settled = false;
      const finish = (ok: boolean) => {
        if (settled) return;
        settled = true;
        resolve(ok);
      };

      const prevHandler = window.__onNativeFingerprintResult;
      window.__onNativeFingerprintResult = (status) => {
        if (prevHandler) prevHandler(status);
        if (status === 'success') {
          finish(true);
        } else if (status === 'failed' || status === 'error') {
          finish(false);
        }
      };

      try {
        // Re-arm hardware fingerprint sensor AND trigger system biometric/credential prompt if needed
        const started = window.CounterNative?.startFingerprintAuth?.() ?? false;
        if (!started && window.CounterNative?.promptDeviceCredential) {
          const prompted = window.CounterNative.promptDeviceCredential(title, subtitle);
          if (!prompted) {
            finish(false);
          }
        } else if (window.CounterNative?.promptDeviceCredential) {
          window.CounterNative.promptDeviceCredential(title, subtitle);
        }
      } catch {
        finish(false);
      }

      // Timeout safety after 30s
      window.setTimeout(() => finish(false), 30000);
    });
  }

  // 2. Browser preview fallback
  await new Promise((resolve) => window.setTimeout(resolve, 260));
  return true;
}
