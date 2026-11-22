import { execSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

const PRIVATE_KEY_PEM = `-----BEGIN PRIVATE KEY-----
MIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQCgkBPlW+o/os3N
GJK5Xlx0uIFNsFnidXOEdPqigS4K0WS6p2eRFjwcy4gTASaOUPs7WVeMV5spKHBi
XXOTGGSPVnPo5lZLrq1p08g4KzFS0/deuaJ3gZcD2YKDg3x0OS95g7Xq7gpQjSWY
u4xl7RWjPgdiPtDUlema/2BTrNEbAc5eHuD/ijB4pgC62/LP2WvmJZm3AiEcByFB
M05tCVUB3u1T3nka3AbmFIqnTM0XcNJ+N0sAa+n4ct8/1xrZzmLq8yMe8710IjSI
EelNuuzJZvm9b1JaLw8GpyJkem76WZSUPITE9rLSBrsl+YLspPZ9PMaNTXxg8SDd
uNMsGRcnAgMBAAECggEAJ1j3jzsVrk+a6JqPhl7SAIagpWXEuUL4MqsqKr3Ghz8m
VLmmnz8YLyRPrfyXssO0tagg1NM5Qn5XADwPkSomppvUnuwnlLdzZt5QEDfBiB9K
3UtXvbqjw/0/RzRnQOIsuLYm1DJOk8vrPUEk2Guf5FfUnmZvbdFpJKNVu1u8CMZm
J+/wQOXGyWE0qzf9isWnYdAFDpDHfEAt6rx7SyLR/IuQOQ/taQFOYp5nJea3f7SJ
K8/3Is7X+4HjsQIl56VAT0oxMtqH2T6fszK8trGJRQn/Y4pwi9WGXjngSP5pVnfQ
vLtI3a6jHYFy1syjVPf1LSfwdL3rYlBYcc3ZVWNhcQKBgQDgVgXQ/erKfIJwV+vi
AvUggyBc48PEunlwwq1hZrBHZHg27MJPS6FJHdSufE8MCH4P8CmziEiku7zqGlcH
Nbg8kNTbd16aGtvzKTFKVxCRLfvcz5EjZi/aMmxxG9z1ylkxn+DLxSLO7Rn+LigF
/SET9hCGuZMOsJEem9ZCxA+r0QKBgQC3ObmIXq2lQ12fqnkD/x9pl9abpjVgxaDg
0R3QqH4w2ALEIgJHE26ecieGFquUFe/y1rha1IhhJmWulTt9TP1Gzf36bQhEe6go
dawXzcCN85e8x7X/evEGVjjJnBiohb8wlZB7Sgj5BSNPbyraHhgre3qt0Pb1JBwX
7tms7T/pdwKBgFuf5spAGvhOuDvIPShXSuTXiY1G3XtpKhZ6/LNubIsMJulP8+DN
I/en/mixjtt8UHiT/4Q7Imhd4T/AOFFSiIf8I2PrsjDAzZrX9TDGtJaHMHo0MLRD
lUHKHG5qEeo1lg5lnTu8rYXUYyxkj6Y6h5sOght0ifKS/QKCZZVpXHkxAoGAQi5f
jZplLmR+1MVGoOLt/b4SjnYioanAynO+STgTHKFpnl6KZBHoyuKA1DYsE3k5CoX0
YRqTiEPORpkwu7mrYn/VVTc83T+tJbAbUR3Ih32NOWsJmhZWKOvL50aywWxN+saL
QX0kcI4iivaki9SC9nHLhi0Mhs9cNmjXx1aK11ECgYEAwQ2RWvc/qLb0fWNyB1es
OwPJW9QwAfh2Oi7Lbr0mn0tBOEbAvBOUsxm3J/79WNDQ7+ofEp8LSdSsvk1PHuiy
fTjc7llGaJkFuOsK+xb6LdbaJi1rfd4SxV2vcu16gohNpazimWkORiB2xnlHfKpx
JBeR84BSC/lKCa/r5GDHcoY=
-----END PRIVATE KEY-----
`;

const CERT_PEM = `-----BEGIN CERTIFICATE-----
MIIDUTCCAjmgAwIBAgIUP7ehUJTHYsekXIHvaWkrHjqlq8AwDQYJKoZIhvcNAQEL
BQAwNzELMAkGA1UEBhMCVVMxEDAOBgNVBAoMB0FuZHJvaWQxFjAUBgNVBAMMDUFu
ZHJvaWQgRGVidWcwIBcNMjYxMTE4MDQ1MzA3WhgPMjA1NDA0MDUwNDUzMDdaMDcx
CzAJBgNVBAYTAlVTMRAwDgYDVQQKDAdBbmRyb2lkMRYwFAYDVQQDDA1BbmRyb2lk
IERlYnVnMIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAoJAT5VvqP6LN
zRiSuV5cdLiBTbBZ4nVzhHT6ooEuCtFkuqdnkRY8HMuIEwEmjlD7O1lXjFebKShw
Yl1zkxhkj1Zz6OZWS66tadPIOCsxUtP3Xrmid4GXA9mCg4N8dDkveYO16u4KUI0l
mLuMZe0Voz4HYj7Q1JXpmv9gU6zRGwHOXh7g/4oweKYAutvyz9lr5iWZtwIhHAch
QTNObQlVAd7tU955GtwG5hSKp0zNF3DSfjdLAGvp+HLfP9ca2c5i6vMjHvO9dCI0
iBHpTbrsyWb5vW9SWi8PBqciZHpu+lmUlDyExPay0ga7JfmC7KT2fTzGjU18YPEg
3bjTLBkXJwIDAQABo1MwUTAdBgNVHQ4EFgQUDUzmU92MSDRcFt8vqGGHVshnTqow
HwYDVR0jBBgwFoAUDUzmU92MSDRcFt8vqGGHVshnTqowDwYDVR0TAQH/BAUwAwEB
/zANBgkqhkiG9w0BAQsFAAOCAQEAgqhkbWx8V5LIvBAJOlIZb7YOhvpcvQDR4PIv
NxsOHT6ANu/cpf4vwiDFNxtczxIAhBiR3VOtoFCEC/SDZ3FMvVqDDAUDdzT+Tq1H
+5YeHd/IcKxli86DEi2HmB4JmGRCHO9//37mzO+hqAfCtUKoWBFv0GPWsxa0JZt3
BRcxwIGVv93zNqyuMV0gAToeGok1A1c7H11y1lkADknwZZCVDuClIzvWzB7Qv4pY
347cmklCxFKJTUrKoS6sS4tQL+4x8Q5DuZ3opRhveXU1TkWlIw9U0hNwj6+INCXG
Tr7tMJIoq4aZlelJEvws7bn5hAcgSfEA366vpe6p2a9vlHmONA==
-----END CERTIFICATE-----
`;

// 1. Build and verify persistent PKCS12 / JKS keystore from fixed PEM key & certificate
const tmpDir = os.tmpdir();
const keyPath = path.join(tmpDir, 'counter-key.pem');
const certPath = path.join(tmpDir, 'counter-cert.pem');
const p12Path = path.join(tmpDir, 'counter-persistent.p12');

fs.writeFileSync(keyPath, PRIVATE_KEY_PEM, 'utf8');
fs.writeFileSync(certPath, CERT_PEM, 'utf8');

execSync(
  `openssl pkcs12 -export -in "${certPath}" -inkey "${keyPath}" -out "${p12Path}" -name "androiddebugkey" -passout pass:android`,
  { stdio: 'inherit' },
);
execSync(`openssl pkcs12 -in "${p12Path}" -passin pass:android -noout`, {
  stdio: 'inherit',
});

const androidHomeDir = path.join(os.homedir(), '.android');
fs.mkdirSync(androidHomeDir, { recursive: true });
const homeDebugKeystore = path.join(androidHomeDir, 'debug.keystore');
const appKeystore = path.resolve('android/app/counter-persistent.keystore');

fs.copyFileSync(p12Path, homeDebugKeystore);
if (fs.existsSync('android/app')) {
  fs.copyFileSync(p12Path, appKeystore);
}

try {
  execSync(`keytool -list -v -keystore "${homeDebugKeystore}" -storepass android | head -n 25`, {
    stdio: 'inherit',
  });
} catch {
  // keytool check (runs on CI where Java is installed)
}
console.log('Verified persistent debug.keystore with zero MAC errors');

// 2. Bump versionCode, versionName, and bind explicit signingConfigs.debug inside android/app/build.gradle
const runNum = Number.parseInt(process.env.GITHUB_RUN_NUMBER || '1', 10) || 1;
const versionCode = 500 + runNum;
const versionName = `2.3.${runNum}`;
const appGradlePath = 'android/app/build.gradle';

if (fs.existsSync(appGradlePath)) {
  let gradleContent = fs.readFileSync(appGradlePath, 'utf8');
  gradleContent = gradleContent.replace(/versionCode\s+\d+/g, `versionCode ${versionCode}`);
  gradleContent = gradleContent.replace(
    /versionName\s+"[^"]*"/g,
    `versionName "${versionName}"`,
  );

  if (!gradleContent.includes('counter-persistent.keystore')) {
    gradleContent = gradleContent.replace(
      /buildTypes\s*\{/,
      `signingConfigs {
        debug {
            storeFile file("counter-persistent.keystore")
            storePassword "android"
            keyAlias "androiddebugkey"
            keyPassword "android"
        }
    }
    buildTypes {
        debug {
            signingConfig signingConfigs.debug
        }`,
    );
  }

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
const mainActivityPath = 'android/app/src/main/java/com/counter/v2/MainActivity.java';
if (fs.existsSync('android/app/src/main/java')) {
  fs.mkdirSync(path.dirname(mainActivityPath), { recursive: true });
  const mainActivityJava = `package com.counter.v2;

import android.app.Activity;
import android.app.KeyguardManager;
import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
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
            webView.reload();
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
                    int safeDur = Math.max(20, durationMs);
                    int safeAmp = Math.max(1, Math.min(255, amplitude));
                    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
                        VibrationEffect effect = VibrationEffect.createOneShot(safeDur, safeAmp);
                        AudioAttributes attrs = new AudioAttributes.Builder()
                            .setContentType(AudioAttributes.CONTENT_TYPE_SONIFICATION)
                            .setUsage(AudioAttributes.USAGE_ALARM)
                            .build();
                        v.vibrate(effect, attrs);
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
                            HapticFeedbackConstants.KEYBOARD_TAP,
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
                    long[] timings = new long[]{0, Math.max(22, firstMs), Math.max(28, gapMs), Math.max(28, secondMs)};
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

        @JavascriptInterface
        public void saveNativeVault(final String json) {
            try {
                if (json == null || json.isEmpty()) return;
                SharedPreferences prefs = getSharedPreferences("counter_native_vault_v2", Context.MODE_PRIVATE);
                prefs.edit().putString("latest_store_json", json).apply();
            } catch (Exception ignored) {}
        }

        @JavascriptInterface
        public String loadNativeVault() {
            try {
                SharedPreferences prefs = getSharedPreferences("counter_native_vault_v2", Context.MODE_PRIVATE);
                return prefs.getString("latest_store_json", "");
            } catch (Exception e) {
                return "";
            }
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
