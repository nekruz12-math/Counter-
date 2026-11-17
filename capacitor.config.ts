import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.shumora.smartcounter',
  appName: 'Шумора',
  webDir: 'dist',
  server: {
    androidScheme: 'https',
  },
  android: {
    backgroundColor: '#16110F',
    allowMixedContent: false,
  },
  plugins: {
    LocalNotifications: {
      iconColor: '#A4382A',
    },
  },
};

export default config;
