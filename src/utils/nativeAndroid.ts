import { Capacitor } from '@capacitor/core';
import { LocalNotifications } from '@capacitor/local-notifications';
import { StatusBar, Style } from '@capacitor/status-bar';
import type { ThemeMode } from '../types/counter';

export function isNativeAndroid(): boolean {
  return Capacitor.isNativePlatform() && Capacitor.getPlatform() === 'android';
}

export async function syncAndroidStatusBar(theme: ThemeMode): Promise<void> {
  if (!Capacitor.isNativePlatform()) return;
  try {
    await StatusBar.setOverlaysWebView({ overlay: false });
    if (theme === 'dark') {
      await StatusBar.setStyle({ style: Style.Dark });
      await StatusBar.setBackgroundColor({ color: '#121316' });
    } else {
      await StatusBar.setStyle({ style: Style.Light });
      await StatusBar.setBackgroundColor({ color: '#F4F5F7' });
    }
  } catch {
    // Ignore on platforms where StatusBar API is unavailable
  }
}

export type PermissionStatusValue = 'granted' | 'denied' | 'default' | 'unsupported';

export async function getNotificationPermissionState(): Promise<PermissionStatusValue> {
  if (Capacitor.isNativePlatform()) {
    try {
      const status = await LocalNotifications.checkPermissions();
      if (status.display === 'granted') return 'granted';
      if (status.display === 'denied') return 'denied';
      return 'default';
    } catch {
      return 'unsupported';
    }
  }

  if (typeof window !== 'undefined' && 'Notification' in window) {
    return window.Notification.permission as PermissionStatusValue;
  }
  return 'unsupported';
}

export async function requestDailyNotificationPermission(): Promise<PermissionStatusValue> {
  if (Capacitor.isNativePlatform()) {
    try {
      const current = await LocalNotifications.checkPermissions();
      if (current.display === 'granted') return 'granted';
      const next = await LocalNotifications.requestPermissions();
      return next.display === 'granted' ? 'granted' : 'denied';
    } catch {
      return 'denied';
    }
  }

  if (typeof window !== 'undefined' && 'Notification' in window) {
    try {
      if (window.Notification.permission === 'default') {
        const res = await window.Notification.requestPermission();
        return res as PermissionStatusValue;
      }
      return window.Notification.permission as PermissionStatusValue;
    } catch {
      return 'denied';
    }
  }
  return 'unsupported';
}

export async function sendDailyGoalReminderNotification(params: {
  title: string;
  body: string;
}): Promise<void> {
  if (Capacitor.isNativePlatform()) {
    try {
      const perm = await LocalNotifications.checkPermissions();
      if (perm.display === 'granted') {
        await LocalNotifications.schedule({
          notifications: [
            {
              id: Math.floor(Date.now() % 2147483000),
              title: params.title,
              body: params.body,
              schedule: { at: new Date(Date.now() + 250) },
            },
          ],
        });
      }
    } catch {
      // In-app reminder banner remains active
    }
    return;
  }

  if (
    typeof window !== 'undefined' &&
    'Notification' in window &&
    window.Notification.permission === 'granted'
  ) {
    try {
      new window.Notification(params.title, { body: params.body });
    } catch {
      // In-app reminder banner remains active
    }
  }
}
