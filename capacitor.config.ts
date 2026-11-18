import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.counter.v2',
  appName: 'Counter',
  webDir: 'dist',
  server: {
    androidScheme: 'https',
  },
  android: {
    backgroundColor: '#101216',
    allowMixedContent: false,
  },
  plugins: {
    LocalNotifications: {
      iconColor: '#E14B32',
    },
  },
};

export default config;
