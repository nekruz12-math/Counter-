import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.counter.app',
  appName: 'Counter',
  webDir: 'dist',
  server: {
    androidScheme: 'https',
  },
  android: {
    backgroundColor: '#121316',
    allowMixedContent: false,
  },
  plugins: {
    LocalNotifications: {
      iconColor: '#A4382A',
    },
  },
};

export default config;
