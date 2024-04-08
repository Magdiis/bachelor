import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'io.ionic.starter',
  appName: 'astromate',
  webDir: 'dist',
  server: {
    androidScheme: 'https',
   // hostname: 'localhost:8100',
  }
};

export default config;
