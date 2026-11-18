import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

const KEYSTORE_B64 =
  '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';

// 1. Write persistent debug.keystore so all APK updates share the exact same certificate
const androidHomeDir = path.join(os.homedir(), '.android');
fs.mkdirSync(androidHomeDir, { recursive: true });
fs.writeFileSync(
  path.join(androidHomeDir, 'debug.keystore'),
  Buffer.from(KEYSTORE_B64, 'base64'),
);
console.log('Installed persistent debug.keystore');

// 2. Bump versionCode and versionName in android/app/build.gradle
const runNum = Number.parseInt(process.env.GITHUB_RUN_NUMBER || '1', 10) || 1;
const versionCode = 300 + runNum;
const versionName = `2.1.${runNum}`;
const appGradlePath = 'android/app/build.gradle';

if (fs.existsSync(appGradlePath)) {
  let gradleContent = fs.readFileSync(appGradlePath, 'utf8');
  gradleContent = gradleContent.replace(/versionCode\s+\d+/g, `versionCode ${versionCode}`);
  gradleContent = gradleContent.replace(
    /versionName\s+"[^"]*"/g,
    `versionName "${versionName}"`,
  );
  fs.writeFileSync(appGradlePath, gradleContent, 'utf8');
  console.log(`Updated build.gradle: versionCode=${versionCode}, versionName=${versionName}`);
}

// 3. Configure AndroidManifest.xml permissions (VIBRATE, USE_BIOMETRIC, USE_FINGERPRINT, POST_NOTIFICATIONS) & allowBackup="true"
const manifestPath = 'android/app/src/main/AndroidManifest.xml';
if (fs.existsSync(manifestPath)) {
  let manifest = fs.readFileSync(manifestPath, 'utf8');
  manifest = manifest.replace(/android:allowBackup="false"/g, 'android:allowBackup="true"');

  const permissions = [
    'android.permission.VIBRATE',
    'android.permission.USE_BIOMETRIC',
    'android.permission.USE_FINGERPRINT',
    'android.permission.POST_NOTIFICATIONS',
  ];

  for (const perm of permissions) {
    if (!manifest.includes(perm)) {
      manifest = manifest.replace(
        '</manifest>',
        `    <uses-permission android:name="${perm}" />\n</manifest>`,
      );
    }
  }
  fs.writeFileSync(manifestPath, manifest, 'utf8');
  console.log('Updated AndroidManifest.xml with vibration & biometric permissions');
}

// 4. Write MainActivity.java with native CounterNativeBridge for hardware vibration & fingerprint sensor
const mainActivityPath = 'android/app/src/main/java/com/counter/app/MainActivity.java';
if (fs.existsSync(path.dirname(mainActivityPath))) {
  const mainActivityJava = `package com.counter.app;

import android.app.Activity;
import android.app.KeyguardManager;
import android.content.Context;
import android.content.Intent;
import android.hardware.fingerprint.FingerprintManager;
import android.media.AudioAttributes;
import android.os.Build;
import android.os.Bundle;
import android.os.CancellationSignal;
import android.os.VibrationEffect;
import android.os.Vibrator;
import android.os.VibratorManager;
import android.view.HapticFeedbackConstants;
import android.view.View;
import android.webkit.JavascriptInterface;
import android.webkit.WebView;
import com.getcapacitor.BridgeActivity;

@SuppressWarnings("deprecation")
public class MainActivity extends BridgeActivity {
    private static final int REQ_CONFIRM_CREDENTIAL = 9401;
    private CancellationSignal fingerprintCancelSignal;

    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        if (getBridge() != null && getBridge().getWebView() != null) {
            WebView webView = getBridge().getWebView();
            webView.addJavascriptInterface(new CounterNativeBridge(), "CounterNative");
        }
    }

    @Override
    protected void onActivityResult(int requestCode, int resultCode, Intent data) {
        super.onActivityResult(requestCode, resultCode, data);
        if (requestCode == REQ_CONFIRM_CREDENTIAL) {
            if (resultCode == Activity.RESULT_OK) {
                notifyFingerprintResult("success");
            } else {
                notifyFingerprintResult("failed");
            }
        }
    }

    private void notifyFingerprintResult(final String status) {
        runOnUiThread(() -> {
            if (getBridge() != null && getBridge().getWebView() != null) {
                getBridge().getWebView().evaluateJavascript(
                    "if(window.__onNativeFingerprintResult){window.__onNativeFingerprintResult('" + status + "');}",
                    null
                );
            }
        });
    }

    private Vibrator getDeviceVibrator() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.S) {
            VibratorManager vm = (VibratorManager) getSystemService(Context.VIBRATOR_MANAGER_SERVICE);
            if (vm != null) {
                return vm.getDefaultVibrator();
            }
        }
        return (Vibrator) getSystemService(Context.VIBRATOR_SERVICE);
    }

    public class CounterNativeBridge {
        @JavascriptInterface
        public void vibrate(final int durationMs, final int amplitude) {
            try {
                Vibrator v = getDeviceVibrator();
                if (v != null && v.hasVibrator()) {
                    int safeDur = Math.max(18, durationMs);
                    int safeAmp = Math.max(1, Math.min(255, amplitude));
                    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
                        AudioAttributes attrs = new AudioAttributes.Builder()
                            .setContentType(AudioAttributes.CONTENT_TYPE_SONIFICATION)
                            .setUsage(AudioAttributes.USAGE_ALARM)
                            .build();
                        v.vibrate(VibrationEffect.createOneShot(safeDur, safeAmp), attrs);
                    } else {
                        v.vibrate(safeDur);
                    }
                }
            } catch (Exception ignored) {}

            runOnUiThread(() -> {
                try {
                    View decor = getWindow() != null ? getWindow().getDecorView() : null;
                    if (decor != null) {
                        decor.performHapticFeedback(
                            HapticFeedbackConstants.LONG_PRESS,
                            HapticFeedbackConstants.FLAG_IGNORE_GLOBAL_SETTING | HapticFeedbackConstants.FLAG_IGNORE_VIEW_SETTING
                        );
                    }
                } catch (Exception ignored) {}
            });
        }

        @JavascriptInterface
        public void vibratePattern(final int firstMs, final int gapMs, final int secondMs, final int amplitude) {
            try {
                Vibrator v = getDeviceVibrator();
                if (v != null && v.hasVibrator()) {
                    long[] timings = new long[]{0, Math.max(20, firstMs), Math.max(25, gapMs), Math.max(25, secondMs)};
                    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
                        int safeAmp = Math.max(1, Math.min(255, amplitude));
                        int[] amps = new int[]{0, safeAmp, 0, safeAmp};
                        AudioAttributes attrs = new AudioAttributes.Builder()
                            .setContentType(AudioAttributes.CONTENT_TYPE_SONIFICATION)
                            .setUsage(AudioAttributes.USAGE_ALARM)
                            .build();
                        v.vibrate(VibrationEffect.createWaveform(timings, amps, -1), attrs);
                    } else {
                        v.vibrate(timings, -1);
                    }
                }
            } catch (Exception ignored) {}
        }

        @JavascriptInterface
        public boolean hasBiometricHardware() {
            try {
                if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
                    FingerprintManager fm = (FingerprintManager) getSystemService(Context.FINGERPRINT_SERVICE);
                    if (fm != null && fm.isHardwareDetected() && fm.hasEnrolledFingerprints()) {
                        return true;
                    }
                }
                KeyguardManager km = (KeyguardManager) getSystemService(Context.KEYGUARD_SERVICE);
                return km != null && km.isKeyguardSecure();
            } catch (Exception e) {
                return false;
            }
        }

        @JavascriptInterface
        public boolean startFingerprintAuth() {
            try {
                if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
                    FingerprintManager fm = (FingerprintManager) getSystemService(Context.FINGERPRINT_SERVICE);
                    if (fm != null && fm.isHardwareDetected() && fm.hasEnrolledFingerprints()) {
                        stopFingerprintAuth();
                        fingerprintCancelSignal = new CancellationSignal();
                        fm.authenticate(null, fingerprintCancelSignal, 0, new FingerprintManager.AuthenticationCallback() {
                            @Override
                            public void onAuthenticationSucceeded(FingerprintManager.AuthenticationResult result) {
                                super.onAuthenticationSucceeded(result);
                                vibrate(45, 255);
                                notifyFingerprintResult("success");
                            }

                            @Override
                            public void onAuthenticationFailed() {
                                super.onAuthenticationFailed();
                                vibratePattern(55, 40, 80, 255);
                                notifyFingerprintResult("failed");
                            }
                        }, null);
                        return true;
                    }
                }
            } catch (Exception ignored) {}
            return false;
        }

        @JavascriptInterface
        public void stopFingerprintAuth() {
            try {
                if (fingerprintCancelSignal != null && !fingerprintCancelSignal.isCanceled()) {
                    fingerprintCancelSignal.cancel();
                }
                fingerprintCancelSignal = null;
            } catch (Exception ignored) {}
        }

        @JavascriptInterface
        public boolean promptDeviceCredential(final String title, final String subtitle) {
            try {
                KeyguardManager km = (KeyguardManager) getSystemService(Context.KEYGUARD_SERVICE);
                if (km != null && km.isKeyguardSecure()) {
                    Intent intent = km.createConfirmDeviceCredentialIntent(title, subtitle);
                    if (intent != null) {
                        runOnUiThread(() -> {
                            try {
                                startActivityForResult(intent, REQ_CONFIRM_CREDENTIAL);
                            } catch (Exception ignored) {}
                        });
                        return true;
                    }
                }
            } catch (Exception ignored) {}
            return false;
        }
    }
}
`;
  fs.writeFileSync(mainActivityPath, mainActivityJava, 'utf8');
  console.log('Wrote MainActivity.java with native CounterNativeBridge');
}

// 5. Configure launcher icons
const bgXmlPath = 'android/app/src/main/res/values/ic_launcher_background.xml';
if (fs.existsSync(bgXmlPath)) {
  fs.writeFileSync(
    bgXmlPath,
    '<?xml version="1.0" encoding="utf-8"?>\n<resources>\n    <color name="ic_launcher_background">#A4382A</color>\n</resources>\n',
    'utf8',
  );
}

const densities = [
  'mipmap-mdpi',
  'mipmap-hdpi',
  'mipmap-xhdpi',
  'mipmap-xxhdpi',
  'mipmap-xxxhdpi',
];

for (const density of densities) {
  const dir = path.join('android/app/src/main/res', density);
  if (fs.existsSync(dir)) {
    if (fs.existsSync('public/android-icon-192.png')) {
      fs.copyFileSync('public/android-icon-192.png', path.join(dir, 'ic_launcher.png'));
      fs.copyFileSync('public/android-icon-192.png', path.join(dir, 'ic_launcher_round.png'));
    }
    if (fs.existsSync('public/android-icon-maskable.png')) {
      fs.copyFileSync(
        'public/android-icon-maskable.png',
        path.join(dir, 'ic_launcher_foreground.png'),
      );
    }
  }
}
console.log('Android configuration completed successfully');
